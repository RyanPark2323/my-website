import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';

const AGENT_COUNT = 460;
const FIELD_INTENSITY = 1;
const ENGINE_RUNNING = true;

export type ViewState = 'foyer' | 'realm';

function setText<T extends HTMLElement>(ref: React.RefObject<T | null>, v: string) {
  if (ref.current) ref.current.textContent = v;
}

interface Ant {
  x: number;
  y: number;
  h: number;
  c: 0 | 1;
  load: number;
}

interface FieldSource {
  x: number;
  y: number;
  r: number;
}

interface AnnoLayout {
  tx: number;
  ty: number;
  lx: number;
  ly: number;
  lw?: number;
}

/**
 * The site's persistent ambient identity: an ant-colony optimization
 * simulation rendered behind the foyer hero. Not a realm — this runs on
 * every view, independent of the realm registry.
 */
interface AntColonyEngine {
  ctx?: CanvasRenderingContext2D | null;
  off?: HTMLCanvasElement;
  offCtx?: CanvasRenderingContext2D | null;
  CELL: number;
  tick: number;
  deliveries: number;
  t0: number;
  fps: number;
  onResize?: () => void;
  rz?: number;
  sized: boolean;
  w?: number;
  h?: number;
  gw?: number;
  gh?: number;
  food?: Float32Array;
  home?: Float32Array;
  tmpA?: Float32Array;
  tmpB?: Float32Array;
  img?: ImageData;
  buf?: Uint32Array;
  nest?: { x: number; y: number };
  userSources: number[][];
  sources: FieldSource[];
  annos: AnnoLayout[] | null;
  annoAlpha: number;
  annoWoke: boolean;
  obs?: IntersectionObserver;
  safety?: number;
  reduced: boolean;
  raf?: number;
  last: number;
  ants: Ant[];
  n: number;
  toastTimer?: number;
  retryTimer?: number;
  onScroll?: () => void;
  annoTimer?: number;
}

export function useAntColonySim() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const annoRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<HTMLSpanElement>(null);
  const agentsRef = useRef<HTMLSpanElement>(null);
  const srcRef = useRef<HTMLSpanElement>(null);
  const deliverRef = useRef<HTMLSpanElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLButtonElement>(null);
  const toastRef = useRef<HTMLSpanElement>(null);
  const footNoteRef = useRef<HTMLSpanElement>(null);

  // Everything the simulation mutates every frame lives on one stable bag
  // (the functional equivalent of `this` in the original class), not in
  // React state, since none of it should ever trigger a re-render.
  const eng = useRef<AntColonyEngine>({
    CELL: 7,
    tick: 0,
    deliveries: 0,
    t0: 0,
    fps: 60,
    sized: false,
    userSources: [],
    sources: [],
    annos: null,
    annoAlpha: 0,
    annoWoke: false,
    reduced: false,
    last: 0,
    ants: [],
    n: 0,
  }).current;

  function setupReveals() {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const show = (el: HTMLElement) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    };
    if (eng.reduced) {
      els.forEach(show);
      return;
    }
    eng.obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target as HTMLElement);
            eng.obs?.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );
    els.forEach((el) => eng.obs!.observe(el));
    eng.safety = window.setTimeout(() => els.forEach(show), 3500);
  }

  function setupSim() {
    const c = canvasRef.current;
    if (!c) return;
    eng.ctx = c.getContext('2d');
    eng.off = document.createElement('canvas');
    eng.offCtx = eng.off.getContext('2d');
    eng.CELL = 7;
    eng.tick = 0;
    eng.deliveries = 0;
    eng.t0 = performance.now();
    eng.fps = 60;
    eng.onResize = () => {
      clearTimeout(eng.rz);
      eng.rz = window.setTimeout(() => resize(), 180);
    };
    window.addEventListener('resize', eng.onResize);
    try {
      resize();
    } catch {
      eng.sized = false;
    }
    if (eng.reduced) {
      if (footNoteRef.current) {
        footNoteRef.current.textContent =
          'AMBIENT ENGINE: ANT COLONY OPTIMIZATION · STATIC FRAME · REDUCED MOTION';
      }
      if (!eng.sized) {
        eng.retryTimer = window.setInterval(() => {
          if (eng.sized) {
            clearInterval(eng.retryTimer);
            return;
          }
          try {
            resize();
          } catch {
            /* not sized yet */
          }
        }, 250);
      }
      return;
    }
    eng.last = performance.now();
    eng.raf = requestAnimationFrame(loop);
  }

  function warmStatic() {
    if (!eng.sized) return;
    for (let i = 0; i < 300; i++) step();
    eng.annoAlpha = 1;
    const layer = annoRef.current;
    if (layer) layer.style.opacity = '1';
    draw(1);
    writeReadout();
  }

  function resize() {
    const c = canvasRef.current;
    if (!c || !eng.ctx) return;
    const w = window.innerWidth,
      h = window.innerHeight;
    if (w < 2 || h < 2) {
      eng.sized = false;
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.max(1, Math.floor(w * dpr));
    c.height = Math.max(1, Math.floor(h * dpr));
    eng.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    eng.w = w;
    eng.h = h;
    eng.sized = true;
    eng.gw = Math.max(1, Math.ceil(w / eng.CELL));
    eng.gh = Math.max(1, Math.ceil(h / eng.CELL));
    const n = eng.gw * eng.gh;
    eng.food = new Float32Array(n);
    eng.home = new Float32Array(n);
    eng.tmpA = new Float32Array(n);
    eng.tmpB = new Float32Array(n);
    eng.off!.width = eng.gw;
    eng.off!.height = eng.gh;
    eng.img = eng.offCtx!.createImageData(eng.gw, eng.gh);
    eng.buf = new Uint32Array(eng.img.data.buffer);
    eng.nest = { x: w * 0.5, y: h * 0.4 };
    const rel = eng.userSources.slice();
    eng.sources = [[0.12, 0.22], [0.87, 0.2], [0.22, 0.62], [0.78, 0.64], [0.5, 0.08]]
      .concat(rel)
      .map((p: number[]) => ({ x: p[0] * w, y: p[1] * h, r: 30 }));
    layoutAnnotations();
    spawn();
    if (eng.reduced) warmStatic();
  }

  function addSource(cx: number, cy: number) {
    if (!eng.w || !eng.sources.length) return;
    if (eng.sources.length >= 14) eng.sources.splice(5, 1);
    eng.userSources.push([cx / eng.w, cy / eng.h!]);
    if (eng.userSources.length > 9) eng.userSources.shift();
    eng.sources.push({ x: cx, y: cy, r: 30 });
    const t = toastRef.current;
    if (t) {
      t.textContent = 'SOURCE ADDED · ' + String(eng.sources.length).padStart(2, '0') + ' IN FIELD';
      t.style.opacity = '1';
      clearTimeout(eng.toastTimer);
      eng.toastTimer = window.setTimeout(() => {
        t.style.opacity = '0';
      }, 2400);
    }
    if (eng.reduced) {
      for (let i = 0; i < 120; i++) step();
      draw(1);
      writeReadout();
    }
  }

  function layoutAnnotations() {
    const w = eng.w,
      h = eng.h,
      s = eng.sources[1],
      n = eng.nest;
    if (w == null || h == null || !s || !n) return;
    const clampY = (y: number) => Math.max(64, Math.min(h * 0.66, y));
    const raw: AnnoLayout[] = [
      { tx: n.x, ty: n.y, lx: n.x + 44, ly: clampY(n.y - 52) },
      { tx: s.x, ty: s.y, lx: s.x - 170, ly: clampY(s.y + 42) },
      {
        tx: n.x + (s.x - n.x) * 0.34,
        ty: n.y + (s.y - n.y) * 0.34,
        lx: n.x + (s.x - n.x) * 0.34 + 36,
        ly: clampY(n.y + (s.y - n.y) * 0.34 + 48),
      },
    ];
    const layer = annoRef.current;
    if (!layer) {
      eng.annos = null;
      return;
    }
    eng.annos = raw;
    const els: (HTMLElement | null)[] = [];
    raw.forEach((a, i) => {
      const el = layer.querySelector<HTMLElement>('[data-anno="' + i + '"]');
      els.push(el);
      if (!el) return;
      el.style.left = '0px';
      const lw = Math.ceil(el.getBoundingClientRect().width) + 2;
      a.lw = lw;
      a.lx = Math.max(18, Math.min(w - lw - 18, a.lx));
    });
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < raw.length; i++) {
        for (let j = i + 1; j < raw.length; j++) {
          const A = raw[i],
            B = raw[j];
          const xOverlap = A.lx < B.lx + (B.lw || 0) + 14 && B.lx < A.lx + (A.lw || 0) + 14;
          const dy = B.ly - A.ly;
          if (xOverlap && Math.abs(dy) < 26) {
            const push = (26 - Math.abs(dy)) / 2 + 2;
            const dir = dy >= 0 ? 1 : -1;
            A.ly = Math.max(64, Math.min(h - 34, A.ly - dir * push));
            B.ly = Math.max(64, Math.min(h - 34, B.ly + dir * push));
          }
        }
      }
    }
    raw.forEach((a, i) => {
      const el = els[i];
      if (!el) return;
      el.style.left = a.lx + 'px';
      el.style.top = a.ly - 6 + 'px';
    });
    layer.style.display = w < 720 ? 'none' : '';
  }

  function spawn() {
    if (!eng.w || !eng.h || !eng.nest) return;
    const scaled = Math.round(AGENT_COUNT * Math.sqrt((eng.w * eng.h) / (1440 * 900)));
    eng.n = Math.max(120, Math.min(900, scaled));
    eng.ants = [];
    for (let i = 0; i < eng.n; i++) {
      const a = Math.random() * Math.PI * 2;
      eng.ants.push({
        x: eng.nest.x + Math.cos(a) * (2 + Math.random() * 14),
        y: eng.nest.y + Math.sin(a) * (2 + Math.random() * 14),
        h: a,
        c: 0,
        load: 1,
      });
    }
  }

  function sample(f: Float32Array, x: number, y: number) {
    const gx = (x / eng.CELL) | 0,
      gy = (y / eng.CELL) | 0;
    if (gx < 0 || gy < 0 || gx >= eng.gw! || gy >= eng.gh!) return -1;
    return f[gy * eng.gw! + gx];
  }

  function step() {
    const w = eng.w!,
      h = eng.h!,
      gw = eng.gw!,
      gh = eng.gh!,
      CELL = eng.CELL;
    const active = activeCount();
    const SD = 12,
      SA = 0.62,
      SPEED = 1.05;
    for (let i = 0; i < active; i++) {
      const a = eng.ants[i];
      const fld = a.c ? eng.home! : eng.food!;
      const l = sample(fld, a.x + Math.cos(a.h - SA) * SD, a.y + Math.sin(a.h - SA) * SD);
      const m = sample(fld, a.x + Math.cos(a.h) * SD, a.y + Math.sin(a.h) * SD);
      const r = sample(fld, a.x + Math.cos(a.h + SA) * SD, a.y + Math.sin(a.h + SA) * SD);
      if (m >= l && m >= r) {
        /* hold course */
      } else if (l > r) a.h -= 0.38;
      else if (r > l) a.h += 0.38;
      a.h += (Math.random() - 0.5) * 0.55;

      if (a.c) {
        const dx = eng.nest!.x - a.x,
          dy = eng.nest!.y - a.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 12000) {
          a.h += Math.atan2(Math.sin(Math.atan2(dy, dx) - a.h), Math.cos(Math.atan2(dy, dx) - a.h)) * 0.22;
        }
        if (d2 < 260) {
          a.c = 0;
          a.h += Math.PI;
          a.load = 1;
          eng.deliveries++;
        }
      } else {
        for (let s = 0; s < eng.sources.length; s++) {
          const src = eng.sources[s];
          const dx = src.x - a.x,
            dy = src.y - a.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 9000) {
            a.h += Math.atan2(Math.sin(Math.atan2(dy, dx) - a.h), Math.cos(Math.atan2(dy, dx) - a.h)) * 0.2;
          }
          if (d2 < src.r * src.r) {
            a.c = 1;
            a.h += Math.PI;
            a.load = 1;
            break;
          }
        }
      }

      a.x += Math.cos(a.h) * SPEED;
      a.y += Math.sin(a.h) * SPEED;
      if (a.x < 2) {
        a.x = 2;
        a.h = Math.PI - a.h;
      }
      if (a.x > w - 2) {
        a.x = w - 2;
        a.h = Math.PI - a.h;
      }
      if (a.y < 2) {
        a.y = 2;
        a.h = -a.h;
      }
      if (a.y > h - 2) {
        a.y = h - 2;
        a.h = -a.h;
      }

      const gx = (a.x / CELL) | 0,
        gy = (a.y / CELL) | 0;
      if (gx >= 0 && gy >= 0 && gx < gw && gy < gh) {
        const idx = gy * gw + gx;
        if (a.c) {
          const v = eng.food![idx] + a.load * 1.35;
          eng.food![idx] = v > 4 ? 4 : v;
        } else {
          const v = eng.home![idx] + a.load * 0.9;
          eng.home![idx] = v > 4 ? 4 : v;
        }
      }
      a.load *= 0.9965;
    }
    diffuse(eng.food!, eng.tmpA!, 0.9925);
    diffuse(eng.home!, eng.tmpB!, 0.9945);
    eng.tick++;
  }

  function diffuse(f: Float32Array, t: Float32Array, evap: number) {
    const gw = eng.gw!,
      gh = eng.gh!,
      k = 0.125 * evap;
    for (let y = 1; y < gh - 1; y++) {
      const o = y * gw;
      for (let x = 1; x < gw - 1; x++) {
        const i = o + x;
        t[i] = (f[i] * 4 + f[i - 1] + f[i + 1] + f[i - gw] + f[i + gw]) * k;
      }
    }
    f.set(t);
  }

  function activeCount() {
    if (!eng.ants.length) return 0;
    if (eng.reduced) return eng.n;
    const p = Math.min(1, (performance.now() - eng.t0) / 2100);
    return Math.max(1, Math.floor(eng.n * (p * p * (3 - 2 * p))));
  }

  function draw(wake: number) {
    const ctx = eng.ctx!,
      w = eng.w!,
      h = eng.h!;
    const inten = FIELD_INTENSITY;
    const buf = eng.buf!,
      food = eng.food!,
      home = eng.home!,
      n = food.length;
    for (let i = 0; i < n; i++) {
      const fv = Math.min(1, food[i] * 0.62 * inten);
      const hv = Math.min(1, home[i] * 0.34 * inten);
      let al = (fv * 168 + hv * 78) | 0;
      if (al < 3) {
        buf[i] = 0;
        continue;
      }
      if (al > 235) al = 235;
      const t = fv / (fv + hv + 1e-6);
      const r = (0x33 + (0x5f - 0x33) * t) | 0;
      const g = (0x4a + (0x96 - 0x4a) * t) | 0;
      const b = (0x55 + (0x86 - 0x55) * t) | 0;
      buf[i] = (al << 24) | (b << 16) | (g << 8) | r;
    }
    eng.offCtx!.putImageData(eng.img!, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha = wake * 0.92;
    ctx.drawImage(eng.off!, 0, 0, w, h);

    ctx.globalAlpha = wake * 0.5;
    ctx.strokeStyle = 'rgba(78,133,119,.5)';
    ctx.lineWidth = 1;
    for (let s = 0; s < eng.sources.length; s++) {
      const src = eng.sources[s];
      ctx.beginPath();
      ctx.arc(src.x, src.y, src.r, 0, 6.2832);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(237,232,221,.22)';
    ctx.beginPath();
    ctx.arc(eng.nest!.x, eng.nest!.y, 13, 0, 6.2832);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(eng.nest!.x, eng.nest!.y, 30, 0, 6.2832);
    ctx.stroke();

    const aa = (eng.annoAlpha == null ? 1 : eng.annoAlpha) * wake;
    if (aa > 0.02 && eng.annos) {
      ctx.globalAlpha = aa * 0.55;
      ctx.strokeStyle = 'rgba(90,146,132,.85)';
      for (let i = 0; i < eng.annos.length; i++) {
        const a = eng.annos[i];
        ctx.beginPath();
        ctx.moveTo(a.tx, a.ty);
        ctx.lineTo(a.lx > a.tx ? a.lx - 8 : a.lx + (a.lw || 180) + 8, a.ly);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(a.tx, a.ty, 2.4, 0, 6.2832);
        ctx.stroke();
      }
    }

    const active = activeCount();
    ctx.globalAlpha = wake;
    ctx.fillStyle = 'rgba(237,232,221,.30)';
    for (let i = 0; i < active; i++) {
      const a = eng.ants[i];
      if (!a.c) ctx.fillRect(a.x - 0.6, a.y - 0.6, 1.3, 1.3);
    }
    ctx.fillStyle = 'rgba(122,178,163,.62)';
    for (let i = 0; i < active; i++) {
      const a = eng.ants[i];
      if (a.c) ctx.fillRect(a.x - 0.8, a.y - 0.8, 1.7, 1.7);
    }
    ctx.globalAlpha = 1;
  }

  function loop(now: number) {
    eng.raf = requestAnimationFrame(loop);
    if (!ENGINE_RUNNING) return;
    if (document.hidden) return;
    if (!eng.sized) {
      try {
        resize();
      } catch {
        /* ignore */
      }
      if (!eng.sized) return;
      eng.t0 = now;
      eng.last = now;
    }
    const dt = now - eng.last;
    eng.last = now;
    if (dt > 0 && dt < 500) eng.fps = eng.fps * 0.9 + (1000 / dt) * 0.1;
    const wake = Math.min(1, (now - eng.t0) / 1500);
    step();
    draw(wake * wake);
    if (eng.tick % 8 === 0) writeReadout();
  }

  function writeReadout() {
    const pad = (v: number, n: number) => String(v).padStart(n, '0');
    setText(tickRef, pad(eng.tick % 1000000, 6));
    setText(agentsRef, pad(activeCount(), 3));
    setText(srcRef, pad(eng.sources.length, 2));
    setText(deliverRef, pad(Math.min(9999, eng.deliveries), 4));
    setText(fpsRef, eng.reduced ? '—' : pad(Math.round(eng.fps), 2));
    const layer = annoRef.current;
    if (layer && eng.annos) {
      const tau = Math.max(0, sample(eng.food!, eng.annos[2].tx, eng.annos[2].ty));
      const v2 = layer.querySelector('[data-anno-val="2"]');
      if (v2) v2.textContent = tau.toFixed(2);
      const s2 = layer.querySelector('[data-anno-state="2"]');
      if (s2) {
        const word = tau < 0.02 ? 'NO TRAIL' : tau < 0.35 ? 'SETTLING' : 'REINFORCING';
        if (s2.textContent !== word) {
          s2.textContent = word;
          layoutAnnotations();
        }
      }
      const v1 = layer.querySelector('[data-anno-val="1"]');
      if (v1) {
        const label = sample(eng.food!, eng.sources[1].x, eng.sources[1].y) > 0.05 ? 'FOUND' : 'UNFOUND';
        if (v1.textContent !== label) {
          v1.textContent = label;
          layoutAnnotations();
        }
      }
    }
  }

  useEffect(() => {
    eng.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setupReveals();
    setupSim();
    eng.annoAlpha = 0;
    eng.onScroll = () => {
      const p = 1 - Math.min(1, window.scrollY / (window.innerHeight * 0.38));
      eng.annoAlpha = p * (eng.annoWoke ? 1 : 0);
      const layer = annoRef.current;
      if (layer) layer.style.opacity = String(eng.annoAlpha);
      const hint = hintRef.current;
      if (hint) hint.style.opacity = String(p);
    };
    window.addEventListener('scroll', eng.onScroll, { passive: true });
    eng.annoTimer = window.setTimeout(
      () => {
        eng.annoWoke = true;
        eng.onScroll?.();
      },
      eng.reduced ? 0 : 2200
    );

    return () => {
      cancelAnimationFrame(eng.raf!);
      window.removeEventListener('resize', eng.onResize!);
      window.removeEventListener('scroll', eng.onScroll!);
      eng.obs?.disconnect();
      clearTimeout(eng.rz);
      clearTimeout(eng.safety);
      clearTimeout(eng.annoTimer);
      clearTimeout(eng.toastTimer);
      clearInterval(eng.retryTimer);
    };
    // Runs once on mount, mirroring componentDidMount/componentWillUnmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Called by the page shell whenever the top-level view (foyer/realm) changes. */
  function onViewChange(view: ViewState) {
    if (view === 'realm') {
      eng.annoWoke = false;
      const layer = annoRef.current;
      if (layer) layer.style.opacity = '0';
    } else {
      clearTimeout(eng.annoTimer);
      eng.annoTimer = window.setTimeout(
        () => {
          eng.annoWoke = true;
          eng.onScroll?.();
        },
        eng.reduced ? 0 : 400
      );
    }
    setupReveals();
  }

  const onFieldClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) return;
    addSource(e.clientX, e.clientY);
  };

  // Keyboard-accessible equivalent of clicking the field: a small focusable
  // control (the existing hint label) that drops a source without requiring
  // a mouse, while the click-anywhere-in-the-field behavior above still works.
  const onHintActivate = () => {
    addSource(window.innerWidth / 2, window.innerHeight / 2);
  };

  return {
    rootRef,
    canvasRef,
    annoRef,
    tickRef,
    agentsRef,
    srcRef,
    deliverRef,
    fpsRef,
    hintRef,
    toastRef,
    footNoteRef,
    onFieldClick,
    onHintActivate,
    onViewChange,
    setupReveals,
  };
}
