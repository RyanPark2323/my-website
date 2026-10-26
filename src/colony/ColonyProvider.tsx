/**
 * The colony's single mount point.
 *
 * This provider owns the canvas, the clock and the render. It is mounted once,
 * above everything that can change, and it is never unmounted — navigating
 * between the foyer and a realm must not destroy or restart the colony. A trail
 * a visitor planted on the landing page is still there when they come back from
 * Contact, and it has aged in the meantime.
 *
 * Mounting this inside a page component silently breaks that, which is the
 * single highest-risk defect in the build. It lives in App.tsx, above the view
 * switch, for that reason.
 *
 * Hero dress and ambient dress are one continuous transform over the same
 * running simulation, driven only by scroll position. There is no second
 * instance and no state change — the chrome fades, the field dims, and pointer
 * events hand back to the page.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { ColonyContext, type ColonyApi } from './colonyApi';
import {
  GRID_DESKTOP,
  GRID_MOBILE,
  RHO_CAP,
  addSource,
  antAt,
  canPlaceAt,
  drainEvents,
  isCommitted,
  sourceLabel,
  removeSource,
  rhoAt,
  setAgentCount,
  sourceAt,
  stepColony,
  type Ant,
  type Colony,
  type SourceLabelState,
  P as ENGINE_P,
} from './engine';
import { warmColony } from './snapshots';
import {
  ANNOTATIONS,
  ANNOTATION_GAP_MS,
  ANNOTATION_HOLD_MS,
  REGIME_GLOSS,
  classifyRegime,
  type Annotation,
  type Regime,
} from './annotations';
import {
  BONE,
  BONE_RGB,
  RHO_COLD,
  RHO_HOT,
  bone,
  FONT_BODY,
  FONT_MONO,
  HAIRLINE,
  TEAL,
  TEAL_LIGHT,
} from './tokens';
import { VIS } from './vis';

// §8 budget. Starting points, tuned against the real thing.
const MOBILE_BREAKPOINT = 720;
const AGENTS_DESKTOP = 780;
const AGENTS_MOBILE = 250;
const HZ_HERO = 30;
const HZ_AMBIENT = 15;
const HZ_MOBILE = 20;
/** Scroll distance over which hero dress becomes ambient dress. */
const DRESS_SPAN = 0.38;
/** Below this the field has released the pointer and gone quiet. */
const AMBIENT_THRESHOLD = 0.5;
/** Field opacity at full ambient — content scrolls over it, it never disappears. */
const AMBIENT_FIELD_ALPHA = 0.5;


interface PanelSource {
  id: number;
  index: number;
  state: SourceLabelState;
  rho: number;
  supply: number;
}

/**
 * Everything the rail shows, republished at ~6 Hz. The canvas loop stays
 * imperative; only this small panel re-renders.
 */
interface PanelState {
  regime: Regime;
  tick: number;
  agents: number;
  deliveries: number;
  rho: number;
  sources: PanelSource[];
  hoverId: number | null;
}

interface Inspection {
  screenX: number;
  screenY: number;
  carrying: boolean;
  committed: boolean;
  rho: number;
  heading: number;
}

interface Live {
  colony: Colony | null;
  ctx: CanvasRenderingContext2D | null;
  off: HTMLCanvasElement | null;
  offCtx: CanvasRenderingContext2D | null;
  img: ImageData | null;
  buf: Uint32Array | null;
  w: number;
  h: number;
  dpr: number;
  sized: boolean;
  mobile: boolean;
  /** 1 = hero, 0 = fully ambient. */
  dress: number;
  wake: number;
  raf: number;
  last: number;
  acc: number;
  /** Pointer in world coords, or null when it is not over the field. */
  px: number | null;
  py: number | null;
  hoverSourceId: number | null;
  railHoverId: number | null;
  hoverAnt: Ant | null;
  annoUntil: number;
  annoNextAllowed: number;
  resizeTimer: number;
  instrumentTick: number;
  lastInspect: number;
  rhoPrev: number;
  regime: Regime;
}

export function ColonyProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const annoLayerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLButtonElement | null>(null);
  const footNoteRef = useRef<HTMLSpanElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const [cursor, setCursor] = useState<'crosshair' | 'pointer'>('crosshair');
  const [panel, setPanel] = useState<PanelState>({
    regime: 'REINFORCING',
    tick: 0,
    agents: 0,
    deliveries: 0,
    rho: 0,
    sources: [],
    hoverId: null,
  });
  const [annotation, setAnnotation] = useState<Annotation | null>(null);
  const [inspection, setInspection] = useState<Inspection | null>(null);
  // On a phone the full rail would cover most of the field, so it collapses to
  // regime plus counters and the per-source rows drop away.
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  );
  const L = useRef<Live>({
    colony: null,
    ctx: null,
    off: null,
    offCtx: null,
    img: null,
    buf: null,
    w: 0,
    h: 0,
    dpr: 1,
    sized: false,
    mobile: false,
    dress: 1,
    wake: 0,
    raf: 0,
    last: 0,
    acc: 0,
    px: null,
    py: null,
    hoverSourceId: null,
    railHoverId: null,
    hoverAnt: null,
    annoUntil: 0,
    annoNextAllowed: 0,
    resizeTimer: 0,
    instrumentTick: 0,
    lastInspect: 0,
    rhoPrev: 0,
    regime: 'REINFORCING',
  }).current;

  // -------------------------------------------------------------------------
  // Geometry. A resize changes the mapping to the viewport and nothing else:
  // the field, the agents and the sources are untouched, so the world never
  // moves, resizes or re-centres.
  // -------------------------------------------------------------------------

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    const c = L.colony;
    if (!canvas || !c || !L.ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w < 2 || h < 2) {
      L.sized = false;
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    L.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    L.w = w;
    L.h = h;
    L.dpr = dpr;
    L.sized = true;
    c.aspect = w / h;
  }, [L]);

  const toWorld = useCallback(
    (clientX: number, clientY: number): [number, number] => [clientX / L.w, clientY / L.h],
    [L]
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const draw = useCallback(
    (interp: number) => {
      const c = L.colony;
      const ctx = L.ctx;
      if (!c || !ctx || !L.sized || !L.buf || !L.img || !L.off || !L.offCtx) return;
      const { w, h, wake } = L;
      const dress = L.dress;
      const fieldAlpha = (AMBIENT_FIELD_ALPHA + (1 - AMBIENT_FIELD_ALPHA) * dress) * wake;

      // The field. Pheromone carries the colour: a trail glows teal and cools
      // as it evaporates, so a dying artery visibly fades. This single mapping
      // makes the system's most important event legible without words.
      const buf = L.buf;
      const f = c.field;
      for (let i = 0; i < f.length; i++) {
        const v = f[i];
        if (v < VIS.FIELD_FLOOR) {
          buf[i] = 0;
          continue;
        }
        const t = v > RHO_CAP ? 1 : v / RHO_CAP;
        const g = Math.pow(t, VIS.FIELD_GAMMA);
        let al = (g * VIS.FIELD_ALPHA) | 0;
        if (al > VIS.FIELD_ALPHA) al = VIS.FIELD_ALPHA;
        const r = (RHO_COLD.r + (RHO_HOT.r - RHO_COLD.r) * g) | 0;
        const gg = (RHO_COLD.g + (RHO_HOT.g - RHO_COLD.g) * g) | 0;
        const b = (RHO_COLD.b + (RHO_HOT.b - RHO_COLD.b) * g) | 0;
        buf[i] = (al << 24) | (b << 16) | (gg << 8) | r;
      }
      L.offCtx.putImageData(L.img, 0, 0);

      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.globalAlpha = fieldAlpha * 0.92;
      ctx.drawImage(L.off, 0, 0, w, h);

      // Obstacles: soft elongated masses with feathered edges and no outline.
      //
      // Nothing here draws a border. The field already pools pheromone against
      // an obstacle — that is what the reflecting boundary in the diffusion
      // does — so a trail brightens along the edge on its own. The shape is
      // revealed by how the colony reacts to it, which is the only kind of
      // edge this design has any business drawing.
      for (const b of c.bars) {
        const ca = Math.cos(b.angle);
        const sa = Math.sin(b.angle);
        ctx.save();
        // Map the obstacle's own frame onto the stretched world in one step,
        // then draw a unit circle through it.
        ctx.transform(
          ca * b.len * w,
          sa * b.len * h,
          -sa * b.thick * w,
          ca * b.thick * h,
          b.x * w,
          b.y * h
        );
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        g.addColorStop(0, `rgba(6,7,9,${VIS.OBSTACLE_CORE})`);
        g.addColorStop(0.5, `rgba(6,7,9,${VIS.OBSTACLE_CORE * 0.92})`);
        g.addColorStop(1, 'rgba(6,7,9,0)');
        ctx.globalAlpha = wake * (0.55 + 0.45 * dress);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, 6.2832);
        ctx.fill();
        ctx.restore();
      }

      // The nest.
      ctx.globalAlpha = wake * (0.35 + 0.65 * dress);
      ctx.strokeStyle = bone(0.22);
      ctx.lineWidth = 1;
      const nx = c.nest.x * w;
      const ny = c.nest.y * h;
      ctx.beginPath();
      ctx.arc(nx, ny, 13, 0, 6.2832);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(nx, ny, 30, 0, 6.2832);
      ctx.stroke();

      // Sources read by weight, not hue: opaque, hard-edged, geometric — the
      // only solid objects in a diffuse field. A fixed hairline frame holds the
      // position while the solid core contracts inside it, so depletion is
      // visible as a measurement rather than as a shape going soft.
      const shortAxis = Math.min(w, h);
      for (const s of c.sources) {
        const frame = VIS.SOURCE_FRAME * shortAxis;
        const core = frame * (VIS.SOURCE_CORE_MIN + (1 - VIS.SOURCE_CORE_MIN) * Math.max(0, s.supply));
        const sxp = s.x * w;
        const syp = s.y * h;
        ctx.save();
        ctx.translate(sxp, syp);
        ctx.rotate(Math.PI / 4);
        ctx.globalAlpha = wake * (0.3 + 0.62 * dress);
        ctx.strokeStyle = bone(0.5);
        ctx.lineWidth = 1;
        ctx.strokeRect(-frame, -frame, frame * 2, frame * 2);
        ctx.fillStyle = bone(0.92);
        ctx.fillRect(-core, -core, core * 2, core * 2);
        ctx.restore();

        if ((s.id === L.hoverSourceId || s.id === L.railHoverId) && dress > AMBIENT_THRESHOLD) {
          ctx.globalAlpha = wake;
          ctx.strokeStyle = TEAL_LIGHT;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sxp, syp, VIS.SOURCE_FRAME * Math.min(w, h) + 9, 0, 6.2832);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sxp - 3.5, syp - 3.5);
          ctx.lineTo(sxp + 3.5, syp + 3.5);
          ctx.moveTo(sxp + 3.5, syp - 3.5);
          ctx.lineTo(sxp - 3.5, syp + 3.5);
          ctx.stroke();
        }
      }

      // Each source carries only its index. Everything else about it — state,
      // rho, supply — lives in the instrument rail, so the field stays a field
      // instead of a scatter of captions.
      if (dress > AMBIENT_THRESHOLD) {
        const keyAlpha = (wake * (dress - AMBIENT_THRESHOLD)) / (1 - AMBIENT_THRESHOLD);
        ctx.font = `10px ${FONT_MONO}`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(11,12,14,.9)';
        ctx.shadowBlur = 3;
        c.sources.forEach((s, i) => {
          const frame = VIS.SOURCE_FRAME * Math.min(w, h);
          ctx.globalAlpha = keyAlpha * (s.id === L.hoverSourceId || s.id === L.railHoverId ? 1 : 0.8);
          ctx.fillStyle = s.id === L.hoverSourceId || s.id === L.railHoverId ? TEAL_LIGHT : bone(0.72);
          ctx.fillText(String(i + 1).padStart(2, '0'), s.x * w + frame + 7, s.y * h - frame - 1);
        });
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.textAlign = 'start';
      }

      // Agents are the point of the whole field, so they outrank the glow.
      const ants = c.ants;
      ctx.globalAlpha = wake * (0.55 + 0.45 * dress) * VIS.ANT_SEARCHING_ALPHA;
      ctx.fillStyle = BONE;
      const ss = VIS.ANT_SEARCHING_SIZE;
      for (let i = 0; i < ants.length; i++) {
        const a = ants[i];
        if (a.carrying) continue;
        const x = (a.px + (a.x - a.px) * interp) * w;
        const y = (a.py + (a.y - a.py) * interp) * h;
        ctx.fillRect(x - ss / 2, y - ss / 2, ss, ss);
      }
      ctx.globalAlpha = wake * (0.55 + 0.45 * dress) * VIS.ANT_CARRYING_ALPHA;
      ctx.fillStyle = TEAL_LIGHT;
      const cs = VIS.ANT_CARRYING_SIZE;
      for (let i = 0; i < ants.length; i++) {
        const a = ants[i];
        if (!a.carrying) continue;
        const x = (a.px + (a.x - a.px) * interp) * w;
        const y = (a.py + (a.y - a.py) * interp) * h;
        ctx.fillRect(x - cs / 2, y - cs / 2, cs, cs);
      }

      // The affordance, made visual: over empty field the cursor carries a
      // ghost of the source it would drop. Over a source it becomes the cross.
      if (
        dress > AMBIENT_THRESHOLD &&
        L.px !== null &&
        L.py !== null &&
        L.hoverSourceId === null &&
        canPlaceAt(c, L.px, L.py)
      ) {
        const frame = VIS.SOURCE_FRAME * Math.min(w, h);
        ctx.save();
        ctx.translate(L.px * w, L.py * h);
        ctx.rotate(Math.PI / 4);
        ctx.globalAlpha = wake * 0.75;
        ctx.strokeStyle = TEAL_LIGHT;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(-frame, -frame, frame * 2, frame * 2);
        ctx.setLineDash([]);
        ctx.restore();
      }

      // The inspected individual, ringed so you can see which one it is.
      const ha = L.hoverAnt;
      if (ha && dress > AMBIENT_THRESHOLD) {
        ctx.globalAlpha = wake;
        ctx.strokeStyle = TEAL_LIGHT;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ha.x * w, ha.y * h, 7, 0, 6.2832);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    },
    [L]
  );

  // -------------------------------------------------------------------------
  // Instruments (Tier 1). Written imperatively — none of this should ever
  // trigger a React render.
  // -------------------------------------------------------------------------

  const writeInstruments = useCallback(() => {
    const c = L.colony;
    if (!c) return;

    // What the colony is doing, derived from how the field is moving.
    let carrying = 0;
    for (let i = 0; i < c.ants.length; i += 4) if (c.ants[i].carrying) carrying++;
    const regimeNow = classifyRegime({
      rho: c.rho,
      rhoDelta: c.rho - L.rhoPrev,
      carryingFraction: carrying / Math.max(1, Math.ceil(c.ants.length / 4)),
      msSinceEvent: c.simMs - c.lastEventMs,
    });
    L.rhoPrev = c.rho;
    L.regime = regimeNow;

    setPanel({
      regime: regimeNow,
      tick: c.tick,
      agents: c.ants.length,
      deliveries: c.deliveries,
      rho: c.rho,
      sources: c.sources.map((s, i) => ({
        id: s.id,
        index: i + 1,
        state: sourceLabel(c, s),
        rho: s.rho,
        supply: Math.max(0, s.supply),
      })),
      hoverId: L.hoverSourceId ?? L.railHoverId,
    });
  }, [L]);

  // -------------------------------------------------------------------------
  // Annotations (Tier 2). One at a time, then fade. Silent most of the time,
  // and silent entirely in ambient dress.
  // -------------------------------------------------------------------------

  const pumpAnnotations = useCallback(
    (now: number) => {
      const c = L.colony;
      if (!c) return;
      const events = drainEvents(c);
      if (L.dress <= AMBIENT_THRESHOLD) return;
      if (events.length && now >= L.annoNextAllowed) {
        const kind = events[0].kind;
        setAnnotation(ANNOTATIONS[kind]);
        L.annoUntil = now + ANNOTATION_HOLD_MS;
        L.annoNextAllowed = now + ANNOTATION_GAP_MS;
      }
      if (L.annoUntil && now > L.annoUntil) {
        L.annoUntil = 0;
        setAnnotation(null);
      }
    },
    [L]
  );

  // -------------------------------------------------------------------------
  // The clock. Fixed timestep, decoupled from render, so behaviour is
  // identical at 60 Hz and 144 Hz.
  // -------------------------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    L.mobile = mobile;
    const G = mobile ? GRID_MOBILE : GRID_DESKTOP;

    L.ctx = canvas.getContext('2d');
    L.off = document.createElement('canvas');
    L.off.width = G;
    L.off.height = G;
    L.offCtx = L.off.getContext('2d');
    if (!L.ctx || !L.offCtx) return;
    L.img = L.offCtx.createImageData(G, G);
    L.buf = new Uint32Array(L.img.data.buffer);

    // The field is never shown cold.
    L.colony = warmColony({
      grid: G,
      agents: mobile ? AGENTS_MOBILE : AGENTS_DESKTOP,
      aspect: window.innerWidth / Math.max(1, window.innerHeight),
    });

    measure();

    if (footNoteRef.current) {
      footNoteRef.current.textContent = 'AMBIENT ENGINE: ANT COLONY · CLIENT-SIDE';
    }

    if (import.meta.env.DEV) {
      // Live tuning handle: window.__colony.VIS.FIELD_GAMMA = 1.6, etc.
      (window as unknown as { __colony: unknown }).__colony = {
        VIS,
        P: ENGINE_P,
        get colony() {
          return L.colony;
        },
      };
    }

    const t0 = performance.now();
    L.last = t0;
    L.acc = 0;

    const loop = (now: number) => {
      L.raf = requestAnimationFrame(loop);
      // Halt when the tab is hidden. Nothing accumulates to detonate on return.
      if (document.hidden) {
        L.last = now;
        L.acc = 0;
        return;
      }
      if (!L.sized) {
        measure();
        if (!L.sized) return;
      }

      const hz = L.mobile ? HZ_MOBILE : L.dress > AMBIENT_THRESHOLD ? HZ_HERO : HZ_AMBIENT;
      const stepMs = 1000 / hz;

      let dt = now - L.last;
      L.last = now;
      // A long gap (backgrounded, throttled, a stalled main thread) is dropped
      // rather than replayed.
      if (dt > 250) dt = stepMs;
      L.acc += dt;

      let steps = 0;
      while (L.acc >= stepMs && steps < 4) {
        stepColony(L.colony!, stepMs);
        L.acc -= stepMs;
        steps++;
      }
      if (L.acc > stepMs * 4) L.acc = 0;

      // Fade in over the hand-off so nothing pops.
      const p = Math.min(1, (now - t0) / 1400);
      L.wake = p * p;
      // Interpolate between fixed steps in hero dress only (§8).
      const interp = L.mobile || L.dress <= AMBIENT_THRESHOLD ? 1 : Math.min(1, L.acc / stepMs);
      draw(interp);

      L.instrumentTick++;
      if (L.instrumentTick % 10 === 0) writeInstruments();
      pumpAnnotations(now);
    };
    L.raf = requestAnimationFrame(loop);

    const onResize = () => {
      clearTimeout(L.resizeTimer);
      L.resizeTimer = window.setTimeout(() => {
        // Agent count follows the breakpoint; grid resolution does not, because
        // reallocating the field would wipe the world.
        const nowMobile = window.innerWidth < MOBILE_BREAKPOINT;
        if (nowMobile !== L.mobile) {
          L.mobile = nowMobile;
          if (L.colony) setAgentCount(L.colony, nowMobile ? AGENTS_MOBILE : AGENTS_DESKTOP);
        }
        measure();
      }, 180);
    };

    const onNarrow = () => setNarrow(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', onNarrow);

    const onVisibility = () => {
      L.last = performance.now();
      L.acc = 0;
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(L.raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('resize', onNarrow);
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(L.resizeTimer);
      clearTimeout(toastTimer.current);
    };
    // Mounted once for the life of the document. Nothing here may re-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------
  // Scroll is the only presentation driver.
  // -------------------------------------------------------------------------

  useEffect(() => {
    const apply = () => {
      const dress = 1 - Math.min(1, window.scrollY / (window.innerHeight * DRESS_SPAN));
      L.dress = dress;
      const ambient = dress <= AMBIENT_THRESHOLD;
      // In ambient dress the field releases pointer events entirely to the
      // page beneath, and Tiers 2 and 3 go silent.
      const hero = heroRef.current;
      if (hero) hero.style.pointerEvents = ambient ? 'none' : 'auto';
      const layer = annoLayerRef.current;
      const fade = ambient ? 0 : (dress - AMBIENT_THRESHOLD) / (1 - AMBIENT_THRESHOLD);
      if (layer) layer.style.opacity = String(fade);
      const rail = railRef.current;
      if (rail) {
        rail.style.opacity = String(fade);
        rail.style.pointerEvents = ambient ? 'none' : 'auto';
      }
      if (hintRef.current) hintRef.current.style.opacity = String(dress);
      if (ambient) {
        if (L.hoverAnt || L.hoverSourceId !== null) {
          L.hoverAnt = null;
          L.hoverSourceId = null;
          setInspection(null);
          setCursor('crosshair');
        }
      }
    };
    apply();
    window.addEventListener('scroll', apply, { passive: true });
    return () => window.removeEventListener('scroll', apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------
  // Interaction. One gesture, two verbs.
  // -------------------------------------------------------------------------

  const flashToast = useCallback((text: string) => {
    const t = toastRef.current;
    if (!t) return;
    t.textContent = text;
    t.style.opacity = '1';
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      t.style.opacity = '0';
    }, 2400);
  }, []);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      const c = L.colony;
      if (!c || L.dress <= AMBIENT_THRESHOLD) return;
      if ((e.target as HTMLElement).closest('a,button')) return;
      const [wx, wy] = toWorld(e.clientX, e.clientY);
      const hit = sourceAt(c, wx, wy);
      if (hit) {
        removeSource(c, hit, 'destroyed');
        L.hoverSourceId = null;
        setCursor('crosshair');
        flashToast(`SOURCE DESTROYED · ${String(c.sources.length).padStart(2, '0')} IN FIELD`);
      } else {
        addSource(c, wx, wy);
        flashToast(`SOURCE ADDED · ${String(c.sources.length).padStart(2, '0')} IN FIELD`);
      }
    },
    [L, toWorld, flashToast]
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      const c = L.colony;
      if (!c || L.dress <= AMBIENT_THRESHOLD) return;
      const [wx, wy] = toWorld(e.clientX, e.clientY);
      L.px = wx;
      L.py = wy;

      const hit = sourceAt(c, wx, wy);
      const nextId = hit ? hit.id : null;
      if (nextId !== L.hoverSourceId) {
        L.hoverSourceId = nextId;
        setCursor(hit ? 'pointer' : 'crosshair');
      }

      // Tier 3: what one individual knows. The point is how little is in there.
      const ant = hit ? null : antAt(c, wx, wy);
      L.hoverAnt = ant;
      const now = performance.now();
      if (ant) {
        if (now - L.lastInspect < 60) return;
        L.lastInspect = now;
        setInspection({
          screenX: e.clientX,
          screenY: e.clientY,
          carrying: ant.carrying === 1,
          committed: isCommitted(c, ant),
          rho: rhoAt(c, ant.x, ant.y),
          heading: ((ant.h * 180) / Math.PI + 360000) % 360,
        });
      } else {
        setInspection(null);
      }
    },
    [L, toWorld]
  );

  const onPointerLeave = useCallback(() => {
    L.px = null;
    L.py = null;
    L.hoverAnt = null;
    L.hoverSourceId = null;
    setInspection(null);
    setCursor('crosshair');
  }, [L]);

  const addSourceAtCentre = useCallback(() => {
    const c = L.colony;
    if (!c) return;
    addSource(c, 0.5, 0.56);
    flashToast(`SOURCE ADDED · ${String(c.sources.length).padStart(2, '0')} IN FIELD`);
  }, [L, flashToast]);

  // Stable across inspection/annotation renders: the hero must not re-render
  // every time the pointer passes over an ant.
  const api = useMemo<ColonyApi>(
    () => ({
      heroRef,
      onPointerDown,
      onPointerMove,
      onPointerLeave,
      cursor,
      addSourceAtCentre,
      toastRef,
      hintRef,
      footNoteRef,
    }),
    [cursor, onPointerDown, onPointerMove, onPointerLeave, addSourceAtCentre]
  );

  return (
    <ColonyContext.Provider value={api}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          display: 'block',
        }}
      />
      {/* Scrim. Keeps content legible over a live field without hiding it. */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'linear-gradient(to top,rgba(11,12,14,.97) 0%,rgba(11,12,14,.86) 14%,rgba(11,12,14,.3) 34%,rgba(11,12,14,0) 52%),linear-gradient(to bottom,rgba(11,12,14,.9) 0%,rgba(11,12,14,0) 14%)',
        }}
      />

      {/* Tiers 2 and 3. Fade out together as hero dress becomes ambient. */}
      <div
        ref={annoLayerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          transition: 'opacity .5s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 'clamp(20px,5vw,64px)',
            top: 'clamp(76px,12vh,132px)',
            opacity: annotation ? 1 : 0,
            transform: annotation ? 'none' : 'translateY(6px)',
            transition: 'opacity .8s ease,transform .8s ease',
          }}
        >
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: '10.5px',
              letterSpacing: '.2em',
              color: TEAL,
            }}
          >
            {annotation?.term ?? ''}
          </div>
          <div
            style={{
              marginTop: '5px',
              fontFamily: "'Public Sans',system-ui,sans-serif",
              fontSize: '12.5px',
              fontWeight: 300,
              letterSpacing: '.01em',
              color: `rgba(${BONE_RGB},.34)`,
            }}
          >
            {annotation?.translation ?? ''}
          </div>
        </div>

        {inspection && (
          <div
            style={{
              position: 'absolute',
              left: Math.min(inspection.screenX + 18, (L.w || 1200) - 190),
              top: Math.max(12, inspection.screenY - 72),
              width: '168px',
              padding: '9px 11px',
              border: '1px solid #2A2C30',
              background: 'rgba(11,12,14,.9)',
              fontFamily: FONT_MONO,
              fontSize: '9.5px',
              letterSpacing: '.1em',
              lineHeight: 1.75,
            }}
          >
            <Row k="MODE" v={inspection.carrying ? 'CARRYING' : 'SEARCHING'} />
            <Row k="TRAIL" v={inspection.committed ? 'COMMITTED' : 'UNCOMMITTED'} />
            <Row k="ρ LOCAL" v={inspection.rho.toFixed(3)} />
            <Row k="HEADING" v={`${inspection.heading.toFixed(0).padStart(3, '0')}°`} />
            <div
              style={{
                marginTop: '6px',
                paddingTop: '6px',
                borderTop: '1px solid #2A2C30',
                color: `rgba(${BONE_RGB},.26)`,
              }}
            >
              KNOWS NOTHING ELSE
            </div>
          </div>
        )}
      </div>

      {/*
        The instrument rail. Every persistent readout lives here — regime,
        every source, the counters, and the controls — so the field stays a
        field. Top-right, diagonally opposite the headline, so the two can
        never collide at any viewport shape.
      */}
      <aside
        ref={railRef}
        style={{
          position: 'fixed',
          top: narrow ? '58px' : 'clamp(62px,9vh,86px)',
          right: narrow ? '16px' : 'clamp(20px,5vw,64px)',
          left: narrow ? '16px' : undefined,
          zIndex: 4,
          width: narrow ? 'auto' : '236px',
          maxHeight: narrow ? 'none' : '72vh',
          overflow: 'hidden',
          border: `1px solid ${HAIRLINE}`,
          background: 'rgba(11,12,14,.72)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          fontFamily: FONT_MONO,
          fontSize: '9.5px',
          letterSpacing: '.11em',
          transition: 'opacity .5s ease',
        }}
      >
        <div style={{ padding: '11px 12px 10px' }}>
          <div style={{ color: TEAL, letterSpacing: '.2em' }}>{panel.regime}</div>
          <div
            style={{
              marginTop: '4px',
              fontFamily: FONT_BODY,
              fontSize: '12px',
              fontWeight: 300,
              letterSpacing: '.01em',
              color: bone(0.36),
            }}
          >
            {REGIME_GLOSS[panel.regime]}
          </div>
          <div
            style={{
              marginTop: '7px',
              minHeight: '15px',
              color: TEAL_LIGHT,
              opacity: annotation ? 1 : 0,
              transition: 'opacity .6s ease',
              letterSpacing: '.18em',
            }}
          >
            {annotation?.term ?? ''}
          </div>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: '11.5px',
              fontWeight: 300,
              color: bone(0.3),
              opacity: annotation ? 1 : 0,
              transition: 'opacity .6s ease',
              minHeight: '14px',
            }}
          >
            {annotation?.translation ?? ''}
          </div>
        </div>

        <div style={{ borderTop: narrow ? 'none' : `1px solid ${HAIRLINE}`, display: narrow ? 'none' : 'block' }}>
          {panel.sources.map((s) => {
            const lit = s.id === panel.hoverId;
            return (
              <div
                key={s.id}
                onMouseEnter={() => {
                  L.railHoverId = s.id;
                }}
                onMouseLeave={() => {
                  L.railHoverId = null;
                }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '14px 20px 1fr auto',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '5px 12px',
                  background: lit ? 'rgba(122,178,163,.08)' : 'transparent',
                  color: lit ? bone(0.8) : bone(0.46),
                  transition: 'background .2s ease,color .2s ease',
                }}
              >
                <SourceSwatch supply={s.supply} gone={s.state === 'GONE'} />
                <span style={{ color: lit ? TEAL_LIGHT : bone(0.52) }}>
                  {String(s.index).padStart(2, '0')}
                </span>
                <span style={{ color: s.state === 'DEPLETING' ? TEAL : 'inherit' }}>{s.state}</span>
                <span style={{ color: TEAL, opacity: 0.85 }}>{s.rho.toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            borderTop: `1px solid ${HAIRLINE}`,
            padding: '9px 12px',
            ...(narrow
              ? { display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '16px' }
              : null),
          }}
        >
          <Readout k="TICK" v={String(panel.tick % 1_000_000).padStart(6, '0')} />
          <Readout k="AGENTS" v={String(panel.agents).padStart(3, '0')} />
          <Readout k="DELIVERIES" v={String(panel.deliveries % 100_000).padStart(5, '0')} />
          <Readout k="ρ FIELD" v={panel.rho.toFixed(2)} />
        </div>

        <div style={{ borderTop: `1px solid ${HAIRLINE}`, padding: '9px 12px 11px' }}>
          <div
            style={{
              color: bone(0.34),
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span>{narrow ? 'TAP FIELD' : 'CLICK FIELD'}</span>
            <span style={{ color: bone(0.5) }}>&rarr; PLACE</span>
          </div>
          <div
            style={{
              marginTop: '4px',
              color: bone(0.34),
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span>{narrow ? 'TAP SOURCE' : 'CLICK SOURCE'}</span>
            <span style={{ color: bone(0.5) }}>&rarr; REMOVE</span>
          </div>
          <button
            ref={hintRef}
            type="button"
            onClick={addSourceAtCentre}
            style={{
              marginTop: '9px',
              width: '100%',
              padding: '6px 0',
              background: 'none',
              border: `1px solid ${HAIRLINE}`,
              color: bone(0.6),
              font: 'inherit',
              letterSpacing: 'inherit',
              cursor: 'pointer',
            }}
          >
            + PLACE A SOURCE
          </button>
          <div
            ref={toastRef}
            style={{
              marginTop: '7px',
              minHeight: '12px',
              color: TEAL,
              opacity: 0,
              transition: 'opacity .4s ease',
            }}
          />
        </div>
      </aside>

      {children}
    </ColonyContext.Provider>
  );
}

/** A source's remaining supply, as the same frame-and-core mark the field uses. */
function SourceSwatch({ supply, gone }: { supply: number; gone: boolean }) {
  const core = 3 + 5 * supply;
  return (
    <span
      style={{
        width: '11px',
        height: '11px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${gone ? 'transparent' : 'rgba(237,232,221,.4)'}`,
        transform: 'rotate(45deg)',
      }}
    >
      {!gone && (
        <span style={{ width: `${core}px`, height: `${core}px`, background: 'rgba(237,232,221,.85)' }} />
      )}
    </span>
  );
}

function Readout({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', lineHeight: 1.85 }}>
      <span style={{ color: bone(0.3) }}>{k}</span>
      <span style={{ color: TEAL }}>{v}</span>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
      <span style={{ color: `rgba(${BONE_RGB},.3)` }}>{k}</span>
      <span style={{ color: TEAL }}>{v}</span>
    </div>
  );
}
