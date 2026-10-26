/**
 * A continuously-running agent-based ant colony.
 *
 * Pure and DOM-free on purpose: the same code runs in the browser and under
 * Node, which is what lets scripts/gen-snapshots.mjs bake warm-start states
 * with the exact engine the site ships.
 *
 * What is genuinely mechanical here, and must stay that way:
 *   - pheromone is a real scalar field agents write into and read out of
 *   - deposition happens on the return leg of a successful find only
 *   - evaporation runs every tick across the whole field
 *   - movement is a biased walk up the local gradient with real noise
 *   - "committed" is derived from what an ant is standing in, never assigned
 *
 * Everything else — thresholds, deposit quantities, grid resolution, agent
 * count — is tuned for legibility, not for fidelity to any published number.
 *
 * COORDINATES. The world is the unit square. It is stretched to the viewport
 * at draw time, so the world never moves, resizes or re-centers when the
 * window does — a resize changes `aspect` and nothing else. Motion is
 * corrected by `aspect` so that a step covers equal *screen* distance on both
 * axes; headings are therefore screen-space angles.
 */

export const GRID_DESKTOP = 176;
export const GRID_MOBILE = 120;

/** Pheromone ceiling. Also the divisor that normalises rho to 0..1. */
export const RHO_CAP = 4;

// ---------------------------------------------------------------------------
// Tuning. All lengths are in "screen units" — fractions of the viewport's
// short axis — and are converted to world units per-axis by the aspect fix.
// ---------------------------------------------------------------------------

/**
 * Tuning. All lengths are in "screen units" — fractions of the viewport's
 * short axis — and are converted to world units per-axis by the aspect fix.
 *
 * These are a mutable bag rather than constants so they can be swept headless
 * (scripts/_tune) against the real thing. §8's numbers are starting points,
 * not targets.
 *
 * The one relationship that must hold: a trail's half-life has to outlast an
 * agent's round trip, or nothing can ever be reinforced and the colony cannot
 * bootstrap. At 30 Hz, EVAP 0.999 is a ~10s half-life against a ~6s crossing.
 */
export const P = {
  /** Screen units per tick. */
  SPEED: 0.0033,
  /** Gradient probe distance. Wants to be 2-4 grid cells. */
  SENSE: 0.028,
  SENSE_ANGLE: 0.62,
  TURN: 0.38,
  /** Genuine noise: agents must be able to wander, miss and fail. */
  NOISE: 0.5,

  /** Deposited per tick on the return leg. Scales with SPEED to hold
   *  pheromone-per-unit-length roughly constant. */
  DEPOSIT: 2.2,
  /** Per-tick survival. Without forgetting, no disturbance ever heals. */
  EVAP: 0.999,
  /**
   * How much of a cell blends into its neighbours each tick, 0..1. This is a
   * blend and not a fused averaging kernel on purpose: at the old fused 0.125
   * a trail smeared ~13 cells wide over its own lifetime and the field became
   * one mound centred on the nest instead of arteries.
   */
  DIFFUSE: 0.02,

  /**
   * Response threshold. An ant only follows pheromone it can actually smell;
   * below this it walks freely. This is where exploration comes from, and it
   * is why a decayed field releases the colony instead of trapping it in the
   * residue of its own old trails.
   */
  RESPONSE: 0.2,
  /** Field value at which an ant reads as committed. */
  COMMIT: 0.55,
  /**
   * Outbound bearing. Every return leg ends at the nest, so the nest is always
   * the field's local maximum; a pure hill-climber walks into it and stays.
   * A real ant leaves on a bearing, so inside the nest apron a searcher is
   * biased outward.
   */
  OUTBOUND: 0.26,
  /** Deposit multiplier at the nest centre, ramping to 1 at the apron edge. */
  NEST_TAPER: 0.22,

  NEST_HIT: 0.03,
  NEST_PULL: 0.11,
  SRC_R_FULL: 0.032,
  SRC_R_EMPTY: 0.012,
  /** Local capture cross-section. Discovery rate is quadratic in this. */
  SRC_SMELL: 0.13,
  /**
   * Click/hover target for a source, independent of its pickup radius and of
   * how depleted it is — a nearly-exhausted source must stay as easy to hit as
   * a full one, and the target should match what is drawn, not what the ants
   * can smell.
   */
  HIT_R: 0.026,

  /** Supply burned per pickup. Sets the depletion churn rate. */
  DEPLETE_PER_PICKUP: 0.00015,

  /** Floor on live sources. The field is never left unfindable. */
  MIN_LIVE: 5,
  /** Reseed placement, screen units from the nest. */
  RESEED_MIN: 0.18,
  RESEED_SPAN: 0.24,
};

/** A source carrying more pheromone than this reads as committed. */
/** Normalised view of P.COMMIT, for the instruments. */
export const commitRho = () => P.COMMIT / RHO_CAP;

/** The world may not touch a visitor-placed source for this long. */
const VISITOR_GRACE_MS = 75_000;

/** Disturbance cadence. Rare on purpose — the convergence between events is the thing worth watching. */
const EVENT_MIN_MS = 60_000;
const EVENT_MAX_MS = 120_000;

/** How long a dead source's label and trail-ghost stay interesting. */
const GHOST_TTL_MS = 26_000;
const RELOCATED_LABEL_MS = 11_000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Ant {
  x: number;
  y: number;
  /** Previous position, for render interpolation between fixed sim steps. */
  px: number;
  py: number;
  h: number;
  carrying: 0 | 1;
  load: number;
}

export interface Source {
  id: number;
  x: number;
  y: number;
  /** 1 at full, 0 exhausted. Drives both the radius and the label. */
  supply: number;
  visitor: boolean;
  /** Sim-clock ms at creation. Grace period and labels read from this. */
  bornMs: number;
  found: boolean;
  relocatedMs: number;
  /** Local pheromone, refreshed by the telemetry pass. */
  rho: number;
  /** Latched low-water mark, so POSITIVE FEEDBACK only fires on a real climb. */
  wasQuiet: boolean;
}

/**
 * An impassable mass — an ellipse, not a rectangle.
 *
 * Rigid rectangles were the only hard geometry in a composition made of
 * diffuse glow and hairlines, and they read as boxes punched into the page
 * however they were outlined. A soft elongated mass belongs to the same
 * visual family as the field, and agents slide around a curved boundary more
 * naturally than along a corner.
 *
 * Stored in world space (the unit square) so the eight symmetries apply
 * cleanly, and so it stretches with the field exactly as the pheromone does.
 */
export interface Bar {
  x: number;
  y: number;
  /** Semi-major and semi-minor axes, world units. */
  len: number;
  thick: number;
  /** World-space orientation, radians. */
  angle: number;
}

export type GhostReason = 'depleted' | 'relocated' | 'destroyed';

/** A source that is gone but whose trail is still being walked. */
export interface Ghost {
  x: number;
  y: number;
  diedMs: number;
  reason: GhostReason;
  peak: number;
  rho: number;
  emitted: boolean;
}

export type ColonyEventKind =
  | 'STIGMERGY'
  | 'POSITIVE_FEEDBACK'
  | 'SYMMETRY_BROKEN'
  | 'EVAPORATION'
  | 'EXPLORATION';

export interface ColonyEvent {
  kind: ColonyEventKind;
  /** World position the event happened at, when there is one. */
  x?: number;
  y?: number;
}

export interface Colony {
  G: number;
  field: Float32Array;
  tmp: Float32Array;
  ants: Ant[];
  n: number;
  sources: Source[];
  ghosts: Ghost[];
  /** Obstacles. Agents cannot enter them and pheromone cannot cross them. */
  bars: Bar[];
  /** Rasterised bars, one byte per cell. The hot path reads this, not the geometry. */
  blocked: Uint8Array;
  nest: { x: number; y: number };
  tick: number;
  deliveries: number;
  /** Sim-clock, advanced only by steps that actually ran. A hidden tab
   *  freezes it, which is what keeps disturbances from backing up. */
  simMs: number;
  nextEventMs: number;
  lastEventKind: ColonyEventKind | null;
  /** Sim-clock ms of the last emitted event. Drives the regime readout. */
  lastEventMs: number;
  /** Mean concentration over cells carrying any trail, normalised 0..1. */
  rho: number;
  /** Fraction of the field carrying any trail at all. */
  occupancy: number;
  aspect: number;
  /** Drained by the renderer each frame. */
  events: ColonyEvent[];
  rng: () => number;
  nextId: number;
  symRatio: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** World units per screen unit, x and y. Keeps motion isotropic on screen. */
function scales(c: Colony): [number, number] {
  return c.aspect >= 1 ? [1 / c.aspect, 1] : [1, c.aspect];
}

/** Screen-space angle from a world-space delta. */
function screenAngle(c: Colony, dx: number, dy: number): number {
  const [sx, sy] = scales(c);
  return Math.atan2(dy / sy, dx / sx);
}

/** Squared screen-space distance from a world-space delta. */
function screenDist2(c: Colony, dx: number, dy: number): number {
  const [sx, sy] = scales(c);
  const a = dx / sx;
  const b = dy / sy;
  return a * a + b * b;
}

/** Is this world point inside a bar? Reads the raster, not the geometry. */
export function blockedAt(c: Colony, x: number, y: number): boolean {
  const G = c.G;
  const gx = (x * G) | 0;
  const gy = (y * G) | 0;
  if (gx < 0 || gy < 0 || gx >= G || gy >= G) return false;
  return c.blocked[gy * G + gx] === 1;
}

function insideBar(b: Bar, x: number, y: number, pad = 0): boolean {
  const dx = x - b.x;
  const dy = y - b.y;
  const ca = Math.cos(-b.angle);
  const sa = Math.sin(-b.angle);
  const u = (dx * ca - dy * sa) / (b.len + pad);
  const v = (dx * sa + dy * ca) / (b.thick + pad);
  return u * u + v * v <= 1;
}

/** Rebuild the blocked raster. Call after any change to c.bars. */
export function rasterizeBars(c: Colony): void {
  const G = c.G;
  c.blocked = new Uint8Array(G * G);
  if (!c.bars.length) return;
  for (let gy = 0; gy < G; gy++) {
    const wy = (gy + 0.5) / G;
    for (let gx = 0; gx < G; gx++) {
      const wx = (gx + 0.5) / G;
      for (let i = 0; i < c.bars.length; i++) {
        if (insideBar(c.bars[i], wx, wy)) {
          c.blocked[gy * G + gx] = 1;
          break;
        }
      }
    }
  }
}

/**
 * Lay bars across the radials out of the nest.
 *
 * Placed deliberately rather than at random: a bar sitting across the straight
 * line from nest to source is what turns a radial burst into a route with a
 * dog-leg in it. Thin, few, and never near enough to the nest to pen it in.
 */
export function generateBars(c: Colony, count = 12): void {
  const bars: Bar[] = [];
  for (let i = 0; i < count; i++) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const theta = c.rng() * Math.PI * 2;
      const r = 0.1 + c.rng() * 0.3;
      const x = c.nest.x + Math.cos(theta) * r;
      const y = c.nest.y + Math.sin(theta) * r;
      if (x < 0.06 || x > 0.94 || y < 0.06 || y > 0.94) continue;
      const bar: Bar = {
        x,
        y,
        len: 0.026 + c.rng() * 0.03,
        thick: 0.016 + c.rng() * 0.016,
        angle: c.rng() * Math.PI,
      };
      // Never crowd the nest, never bury a source, never clump.
      if (insideBar(bar, c.nest.x, c.nest.y, 0.06)) continue;
      if (c.sources.some((s) => insideBar(bar, s.x, s.y, 0.03))) continue;
      if (bars.some((o) => Math.hypot(o.x - x, o.y - y) < 0.085)) continue;
      bars.push(bar);
      break;
    }
  }
  c.bars = bars;
  rasterizeBars(c);
}

function wrapAngle(d: number): number {
  return Math.atan2(Math.sin(d), Math.cos(d));
}

function sample(c: Colony, x: number, y: number): number {
  const G = c.G;
  const gx = (x * G) | 0;
  const gy = (y * G) | 0;
  if (gx < 0 || gy < 0 || gx >= G || gy >= G) return -1;
  return c.field[gy * G + gx];
}

/** Local pheromone, normalised 0..1. */
export function rhoAt(c: Colony, x: number, y: number): number {
  const v = sample(c, x, y);
  return v <= 0 ? 0 : v / RHO_CAP;
}

export function sourceRadius(s: Source): number {
  return P.SRC_R_EMPTY + (P.SRC_R_FULL - P.SRC_R_EMPTY) * Math.max(0, s.supply);
}

/** An ant is committed when it is standing in a strong trail and running with it. */
export function isCommitted(c: Colony, a: Ant): boolean {
  if (sample(c, a.x, a.y) < P.COMMIT) return false;
  const [sx, sy] = scales(c);
  const { SENSE, SENSE_ANGLE } = P;
  const l = sample(c, a.x + Math.cos(a.h - SENSE_ANGLE) * SENSE * sx, a.y + Math.sin(a.h - SENSE_ANGLE) * SENSE * sy);
  const m = sample(c, a.x + Math.cos(a.h) * SENSE * sx, a.y + Math.sin(a.h) * SENSE * sy);
  const r = sample(c, a.x + Math.cos(a.h + SENSE_ANGLE) * SENSE * sx, a.y + Math.sin(a.h + SENSE_ANGLE) * SENSE * sy);
  return m >= l && m >= r;
}

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

export interface ColonyOpts {
  grid?: number;
  agents?: number;
  aspect?: number;
  rng?: () => number;
}

const DEFAULT_SOURCES: [number, number][] = [
  [0.12, 0.22],
  [0.87, 0.2],
  [0.22, 0.62],
  [0.78, 0.64],
  [0.5, 0.08],
];

export function createColony(opts: ColonyOpts = {}): Colony {
  const G = opts.grid ?? GRID_DESKTOP;
  const n = opts.agents ?? 760;
  const rng = opts.rng ?? Math.random;
  const c: Colony = {
    G,
    field: new Float32Array(G * G),
    tmp: new Float32Array(G * G),
    ants: [],
    n,
    sources: [],
    ghosts: [],
    bars: [],
    blocked: new Uint8Array(G * G),
    nest: { x: 0.5, y: 0.42 },
    tick: 0,
    deliveries: 0,
    simMs: 0,
    nextEventMs: EVENT_MIN_MS,
    lastEventKind: null,
    lastEventMs: -1e9,
    rho: 0,
    occupancy: 0,
    aspect: opts.aspect ?? 16 / 9,
    events: [],
    rng,
    nextId: 1,
    symRatio: 1,
  };
  for (const [x, y] of DEFAULT_SOURCES) c.sources.push(makeSource(c, x, y, false));
  generateBars(c);
  spawnAnts(c);
  scheduleNextEvent(c);
  return c;
}

function makeSource(c: Colony, x: number, y: number, visitor: boolean): Source {
  return {
    id: c.nextId++,
    x,
    y,
    supply: 1,
    visitor,
    bornMs: c.simMs,
    found: false,
    relocatedMs: -1,
    rho: 0,
    wasQuiet: true,
  };
}

export function spawnAnts(c: Colony): void {
  c.ants = [];
  for (let i = 0; i < c.n; i++) {
    const a = c.rng() * Math.PI * 2;
    const d = 0.002 + c.rng() * 0.012;
    const x = c.nest.x + Math.cos(a) * d;
    const y = c.nest.y + Math.sin(a) * d;
    c.ants.push({ x, y, px: x, py: y, h: a, carrying: 0, load: 1 });
  }
}

/**
 * Scatter the population across the field in mixed states.
 *
 * A warm field needs this instead of spawnAnts: agents all released from the
 * nest at once stay in phase, and the whole colony then swings between
 * all-carrying and all-searching for minutes. Steady state has carriers
 * strewn along every return leg, so that is what we start from.
 */
export function scatterAnts(c: Colony): void {
  c.ants = [];
  for (let i = 0; i < c.n; i++) {
    const x = 0.02 + c.rng() * 0.96;
    const y = 0.02 + c.rng() * 0.96;
    c.ants.push({
      x,
      y,
      px: x,
      py: y,
      h: c.rng() * Math.PI * 2,
      carrying: c.rng() < 0.26 ? 1 : 0,
      load: 0.6 + c.rng() * 0.4,
    });
  }
}

export function setAgentCount(c: Colony, n: number): void {
  c.n = n;
  if (c.ants.length < n) {
    while (c.ants.length < n) {
      const a = c.rng() * Math.PI * 2;
      const x = c.nest.x + Math.cos(a) * 0.01;
      const y = c.nest.y + Math.sin(a) * 0.01;
      c.ants.push({ x, y, px: x, py: y, h: a, carrying: 0, load: 1 });
    }
  } else if (c.ants.length > n) {
    c.ants.length = n;
  }
}

// ---------------------------------------------------------------------------
// Interaction
// ---------------------------------------------------------------------------

/** The source under a world-space point, if any. Drives click-to-destroy and hover. */
export function sourceAt(c: Colony, x: number, y: number, slopScreen = 0): Source | null {
  let best: Source | null = null;
  let bestD = Infinity;
  for (const s of c.sources) {
    const r = P.HIT_R + slopScreen;
    const d2 = screenDist2(c, s.x - x, s.y - y);
    if (d2 < r * r && d2 < bestD) {
      best = s;
      bestD = d2;
    }
  }
  return best;
}

/** A source buried in a wall would be unreachable, so placement refuses it. */
export function canPlaceAt(c: Colony, x: number, y: number): boolean {
  if (x < 0.02 || x > 0.98 || y < 0.02 || y > 0.98) return false;
  return !blockedAt(c, x, y);
}

export function addSource(c: Colony, x: number, y: number): Source {
  const s = makeSource(c, x, y, true);
  c.sources.push(s);
  if (c.sources.length > 14) {
    const victim = c.sources.findIndex((v) => !v.visitor);
    if (victim >= 0) retireSource(c, victim, 'depleted');
  }
  return s;
}

export function removeSource(c: Colony, s: Source, reason: GhostReason = 'destroyed'): void {
  const i = c.sources.indexOf(s);
  if (i >= 0) retireSource(c, i, reason);
}

function retireSource(c: Colony, i: number, reason: GhostReason): void {
  const s = c.sources[i];
  c.sources.splice(i, 1);
  if (s.found) {
    c.ghosts.push({
      x: s.x,
      y: s.y,
      diedMs: c.simMs,
      reason,
      peak: Math.max(s.rho, rhoAt(c, s.x, s.y)),
      rho: rhoAt(c, s.x, s.y),
      emitted: false,
    });
  }
}

/** The ant nearest a world point, for Tier 3 inspection. */
export function antAt(c: Colony, x: number, y: number, radiusScreen = 0.014): Ant | null {
  let best: Ant | null = null;
  let bestD = radiusScreen * radiusScreen;
  for (const a of c.ants) {
    const d2 = screenDist2(c, a.x - x, a.y - y);
    if (d2 < bestD) {
      best = a;
      bestD = d2;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// The tick
// ---------------------------------------------------------------------------

export function stepColony(c: Colony, dtMs: number): void {
  const { SPEED, SENSE, SENSE_ANGLE, TURN, NOISE, DEPOSIT, NEST_HIT, NEST_PULL, NEST_TAPER, OUTBOUND, RESPONSE, SRC_SMELL, DEPLETE_PER_PICKUP } = P;
  const [sx, sy] = scales(c);
  const G = c.G;
  const field = c.field;
  const hasBars = c.bars.length > 0;
  const nest = c.nest;
  const ants = c.ants;
  const sources = c.sources;

  for (let i = 0; i < ants.length; i++) {
    const a = ants[i];
    a.px = a.x;
    a.py = a.y;

    if (a.carrying) {
      // Homeward. Real ants run this leg on path integration, not on the
      // trail — so a direct bearing plus noise is honest, not a shortcut.
      const want = screenAngle(c, nest.x - a.x, nest.y - a.y);
      a.h += wrapAngle(want - a.h) * 0.3;
      a.h += (c.rng() - 0.5) * NOISE * 0.55;
    } else {
      // Searching: three probes, climb the gradient, stay noisy enough to
      // wander, miss and fail.
      const l = sample(c, a.x + Math.cos(a.h - SENSE_ANGLE) * SENSE * sx, a.y + Math.sin(a.h - SENSE_ANGLE) * SENSE * sy);
      const m = sample(c, a.x + Math.cos(a.h) * SENSE * sx, a.y + Math.sin(a.h) * SENSE * sy);
      const r = sample(c, a.x + Math.cos(a.h + SENSE_ANGLE) * SENSE * sx, a.y + Math.sin(a.h + SENSE_ANGLE) * SENSE * sy);
      // Only what it can actually smell. Below threshold the walk is free,
      // and that is the whole of exploration: nobody ordered it.
      if (l > RESPONSE || m > RESPONSE || r > RESPONSE) {
        if (m >= l && m >= r) {
          /* hold course */
        } else if (l > r) {
          a.h -= TURN;
        } else if (r > l) {
          a.h += TURN;
        }
      }
      a.h += (c.rng() - 0.5) * NOISE;
      // Outbound bearing inside the nest apron. See P.OUTBOUND.
      const nd2 = screenDist2(c, a.x - nest.x, a.y - nest.y);
      if (nd2 < NEST_PULL * NEST_PULL && nd2 > 1e-9) {
        const out = screenAngle(c, a.x - nest.x, a.y - nest.y);
        a.h += wrapAngle(out - a.h) * OUTBOUND;
      }
    }

    if (a.carrying) {
      const d2 = screenDist2(c, nest.x - a.x, nest.y - a.y);
      if (d2 < NEST_HIT * NEST_HIT) {
        a.carrying = 0;
        a.h += Math.PI;
        a.load = 1;
        c.deliveries++;
      }
    } else {
      for (let s = 0; s < sources.length; s++) {
        const src = sources[s];
        if (src.supply <= 0) continue;
        const dx = src.x - a.x;
        const dy = src.y - a.y;
        const d2 = screenDist2(c, dx, dy);
        if (d2 < SRC_SMELL * SRC_SMELL) {
          const want = screenAngle(c, dx, dy);
          a.h += wrapAngle(want - a.h) * 0.2;
        }
        const r = sourceRadius(src);
        if (d2 < r * r) {
          a.carrying = 1;
          a.h += Math.PI;
          a.load = 1;
          src.supply -= DEPLETE_PER_PICKUP;
          if (!src.found) {
            src.found = true;
            // Found with nothing leading here: a wanderer did this.
            if (src.rho < 0.04 && !src.visitor) emit(c, 'EXPLORATION', src.x, src.y);
          }
          break;
        }
      }
    }

    // Advance. Equal screen distance on both axes.
    const stepX = Math.cos(a.h) * SPEED * sx;
    const stepY = Math.sin(a.h) * SPEED * sy;
    if (hasBars) {
      const nx = a.x + stepX;
      const ny = a.y + stepY;
      if (!blockedAt(c, nx, ny)) {
        a.x = nx;
        a.y = ny;
      } else if (!blockedAt(c, nx, a.y)) {
        // Slide along the wall rather than stopping dead at it.
        a.x = nx;
        a.h = Math.atan2(0, stepX) + (c.rng() - 0.5) * 0.25;
      } else if (!blockedAt(c, a.x, ny)) {
        a.y = ny;
        a.h = Math.atan2(stepY, 0) + (c.rng() - 0.5) * 0.25;
      } else {
        a.h += Math.PI + (c.rng() - 0.5) * 0.8;
      }
    } else {
      a.x += stepX;
      a.y += stepY;
    }
    if (a.x < 0.002) {
      a.x = 0.002;
      a.h = Math.PI - a.h;
    } else if (a.x > 0.998) {
      a.x = 0.998;
      a.h = Math.PI - a.h;
    }
    if (a.y < 0.002) {
      a.y = 0.002;
      a.h = -a.h;
    } else if (a.y > 0.998) {
      a.y = 0.998;
      a.h = -a.h;
    }

    // Deposition: return leg of a successful find only. Success is what
    // reinforces; a searching ant writes nothing.
    if (a.carrying) {
      const gx = (a.x * G) | 0;
      const gy = (a.y * G) | 0;
      if (gx >= 0 && gy >= 0 && gx < G && gy < G) {
        // Every return leg converges on the nest, so without a taper that one
        // cell pins at the cap forever: a blown-out blob and no legible
        // arteries anywhere. Deposit quantities are free to approximate.
        let dep = DEPOSIT;
        const nd2 = screenDist2(c, a.x - nest.x, a.y - nest.y);
        if (nd2 < NEST_PULL * NEST_PULL) {
          dep *= NEST_TAPER + (1 - NEST_TAPER) * (Math.sqrt(nd2) / NEST_PULL);
        }
        const idx = gy * G + gx;
        const v = field[idx] + a.load * dep;
        field[idx] = v > RHO_CAP ? RHO_CAP : v;
      }
      a.load *= 0.9965;
    }
  }

  evaporate(c);

  c.simMs += dtMs;
  c.tick++;

  if (c.tick % 4 === 0) telemetry(c);
  if (c.tick % 15 === 0) world(c);
}

/** Evaporation and diffusion in one pass, folding in the peak for rho. */
function evaporate(c: Colony): void {
  const { EVAP, DIFFUSE } = P;
  const G = c.G;
  const f = c.field;
  const t = c.tmp;
  let sum = 0;
  let occupied = 0;
  for (let y = 1; y < G - 1; y++) {
    const o = y * G;
    for (let x = 1; x < G - 1; x++) {
      const i = o + x;
      // Diffusion crosses obstacles freely — smell drifts over a low mass even
      // though bodies cannot. Nothing is deposited inside one, so the field
      // there decays on its own, which gives a soft edge instead of the hard
      // grid-quantised rim a reflecting boundary produces.
      const self = f[i];
      const avg = (f[i - 1] + f[i + 1] + f[i - G] + f[i + G]) * 0.25;
      const v = (self + (avg - self) * DIFFUSE) * EVAP;
      t[i] = v;
      if (v > 0.02) {
        sum += v;
        occupied++;
      }
    }
  }
  // Borders decay without inflow, so a trail pressed against an edge still fades.
  for (let x = 0; x < G; x++) {
    t[x] = f[x] * EVAP * 0.9;
    t[(G - 1) * G + x] = f[(G - 1) * G + x] * EVAP * 0.9;
  }
  for (let y = 0; y < G; y++) {
    t[y * G] = f[y * G] * EVAP * 0.9;
    t[y * G + G - 1] = f[y * G + G - 1] * EVAP * 0.9;
  }
  f.set(t);
  // Mean concentration where there is any trail at all. A peak measure is
  // useless here: the nest pins it. This one actually moves when a disturbance
  // lands, which is the whole point of putting it on the instruments.
  c.rho = occupied ? sum / occupied / RHO_CAP : 0;
  c.occupancy = occupied / (G * G);
}

function telemetry(c: Colony): void {
  for (const s of c.sources) {
    const r = rhoAt(c, s.x, s.y);
    s.rho = r;
    if (r < 0.06) {
      s.wasQuiet = true;
    } else if (s.wasQuiet && r > P.COMMIT / RHO_CAP) {
      // A trail that was quiet is now loud. Nothing decided this.
      s.wasQuiet = false;
      emit(c, 'POSITIVE_FEEDBACK', s.x, s.y);
    }
  }
  for (const g of c.ghosts) g.rho = rhoAt(c, g.x, g.y);
  symmetry(c);
}

/**
 * Two sources the same distance from the nest, one artery winning decisively.
 * No ant compared them.
 */
function symmetry(c: Colony): void {
  let pair: [Source, Source] | null = null;
  let bestGap = Infinity;
  for (let i = 0; i < c.sources.length; i++) {
    for (let j = i + 1; j < c.sources.length; j++) {
      const A = c.sources[i];
      const B = c.sources[j];
      if (!A.found || !B.found) continue;
      const dA = Math.sqrt(screenDist2(c, A.x - c.nest.x, A.y - c.nest.y));
      const dB = Math.sqrt(screenDist2(c, B.x - c.nest.x, B.y - c.nest.y));
      const gap = Math.abs(dA - dB) / Math.max(dA, dB, 1e-6);
      if (gap < 0.09 && gap < bestGap) {
        bestGap = gap;
        pair = [A, B];
      }
    }
  }
  if (!pair) {
    c.symRatio = 1;
    return;
  }
  const hi = Math.max(pair[0].rho, pair[1].rho);
  const lo = Math.min(pair[0].rho, pair[1].rho);
  if (hi < 0.1) return;
  const ratio = hi / Math.max(lo, 1e-4);
  if (c.symRatio < 1.5 && ratio > 3.5) {
    emit(c, 'SYMMETRY_BROKEN', pair[0].rho > pair[1].rho ? pair[0].x : pair[1].x, pair[0].rho > pair[1].rho ? pair[0].y : pair[1].y);
  }
  c.symRatio = ratio;
}

/** Depletion churn, the source floor, ghost ageing, and the disturbance clock. */
function world(c: Colony): void {
  for (let i = c.sources.length - 1; i >= 0; i--) {
    if (c.sources[i].supply <= 0) retireSource(c, i, 'depleted');
  }

  for (let i = c.ghosts.length - 1; i >= 0; i--) {
    const g = c.ghosts[i];
    if (!g.emitted && g.peak > 0.12 && g.rho < g.peak * 0.45) {
      g.emitted = true;
      emit(c, 'EVAPORATION', g.x, g.y);
    }
    if (c.simMs - g.diedMs > GHOST_TTL_MS) c.ghosts.splice(i, 1);
  }

  while (c.sources.length < P.MIN_LIVE) reseed(c);

  if (c.simMs >= c.nextEventMs) {
    disturb(c);
    scheduleNextEvent(c);
  }
}

function reseed(c: Colony): void {
  for (let attempt = 0; attempt < 40; attempt++) {
    const ang = c.rng() * Math.PI * 2;
    const d = P.RESEED_MIN + c.rng() * P.RESEED_SPAN;
    const [sx, sy] = scales(c);
    const x = c.nest.x + Math.cos(ang) * d * sx;
    const y = c.nest.y + Math.sin(ang) * d * sy;
    if (x < 0.06 || x > 0.94 || y < 0.06 || y > 0.94) continue;
    if (blockedAt(c, x, y)) continue;
    let clear = true;
    for (const s of c.sources) {
      if (screenDist2(c, s.x - x, s.y - y) < 0.1 * 0.1) {
        clear = false;
        break;
      }
    }
    if (!clear) continue;
    c.sources.push(makeSource(c, x, y, false));
    return;
  }
  c.sources.push(makeSource(c, 0.5 + (c.rng() - 0.5) * 0.4, 0.2 + c.rng() * 0.1, false));
}

function scheduleNextEvent(c: Colony): void {
  c.nextEventMs = c.simMs + EVENT_MIN_MS + c.rng() * (EVENT_MAX_MS - EVENT_MIN_MS);
}

/** Protected: the world may not erase a visitor's own click. */
function touchable(c: Colony, s: Source): boolean {
  if (!s.visitor) return true;
  return c.simMs - s.bornMs > VISITOR_GRACE_MS;
}

function disturb(c: Colony): void {
  // Relocation is the richest event in the set, so it is weighted highest —
  // but never twice in quick succession.
  const wantRelocation = c.lastEventKind !== 'STIGMERGY' ? c.rng() < 0.68 : c.rng() < 0.25;
  if (wantRelocation && relocate(c)) return;
  if (sever(c)) return;
  relocate(c);
}

/**
 * A source vanishes and an identical one appears elsewhere at equal distance.
 * Nothing is lost; the colony no longer knows where it is.
 */
function relocate(c: Colony): boolean {
  const pool = c.sources.filter((s) => touchable(c, s) && s.found && s.supply > 0.25);
  if (!pool.length) return false;
  const s = pool[(c.rng() * pool.length) | 0];
  const [sx, sy] = scales(c);
  const dx = (s.x - c.nest.x) / sx;
  const dy = (s.y - c.nest.y) / sy;
  const d = Math.hypot(dx, dy);
  const a0 = Math.atan2(dy, dx);
  for (let attempt = 0; attempt < 48; attempt++) {
    const swing = (0.55 + c.rng() * 0.9) * Math.PI * (c.rng() < 0.5 ? -1 : 1);
    const a1 = a0 + swing;
    const x = c.nest.x + Math.cos(a1) * d * sx;
    const y = c.nest.y + Math.sin(a1) * d * sy;
    if (x < 0.06 || x > 0.94 || y < 0.06 || y > 0.94) continue;
    if (blockedAt(c, x, y)) continue;
    let clear = true;
    for (const o of c.sources) {
      if (o === s) continue;
      if (screenDist2(c, o.x - x, o.y - y) < 0.11 * 0.11) {
        clear = false;
        break;
      }
    }
    if (!clear) continue;

    const supply = s.supply;
    removeSource(c, s, 'relocated');
    const moved = makeSource(c, x, y, false);
    moved.supply = supply;
    moved.relocatedMs = c.simMs;
    c.sources.push(moved);
    // The trail to the old place is still there, still being walked.
    emit(c, 'STIGMERGY', s.x, s.y);
    return true;
  }
  return false;
}

/** A band of pheromone wiped across the field. The trail is cut and must reroute. */
function sever(c: Colony): boolean {
  const G = c.G;
  const live = c.sources.filter((s) => s.found && s.rho > 0.08);
  if (!live.length) return false;

  for (let attempt = 0; attempt < 24; attempt++) {
    const ang = c.rng() * Math.PI;
    const nx = Math.cos(ang);
    const ny = Math.sin(ang);
    // Offset the line so it crosses somewhere between the nest and a live source.
    const target = live[(c.rng() * live.length) | 0];
    const t = 0.3 + c.rng() * 0.45;
    const cx = c.nest.x + (target.x - c.nest.x) * t;
    const cy = c.nest.y + (target.y - c.nest.y) * t;
    const offset = nx * cx + ny * cy;

    // Must actually cut something: the band has to separate nest from source.
    const dNest = nx * c.nest.x + ny * c.nest.y - offset;
    const dSrc = nx * target.x + ny * target.y - offset;
    if (dNest * dSrc > 0) continue;

    const half = 0.028;
    let wiped = 0;
    for (let gy = 0; gy < G; gy++) {
      const wy = (gy + 0.5) / G;
      for (let gx = 0; gx < G; gx++) {
        const wx = (gx + 0.5) / G;
        const dist = Math.abs(nx * wx + ny * wy - offset);
        if (dist < half) {
          const i = gy * G + gx;
          if (c.field[i] > 0.02) wiped++;
          // Feathered edges, so the cut is a band and not a stencil.
          const falloff = dist > half * 0.6 ? (dist - half * 0.6) / (half * 0.4) : 0;
          c.field[i] *= falloff * falloff;
        }
      }
    }
    if (wiped < 6) continue;
    emit(c, 'EXPLORATION', cx, cy);
    return true;
  }
  return false;
}

function emit(c: Colony, kind: ColonyEventKind, x?: number, y?: number): void {
  c.lastEventKind = kind;
  c.lastEventMs = c.simMs;
  c.events.push({ kind, x, y });
  if (c.events.length > 8) c.events.shift();
}

export function drainEvents(c: Colony): ColonyEvent[] {
  if (!c.events.length) return [];
  const out = c.events.slice();
  c.events.length = 0;
  return out;
}

// ---------------------------------------------------------------------------
// Source labels
// ---------------------------------------------------------------------------

export type SourceLabelState = 'FOUND' | 'UNFOUND' | 'DEPLETING' | 'RELOCATED' | 'GONE';

export function sourceLabel(c: Colony, s: Source): SourceLabelState {
  if (s.relocatedMs >= 0 && c.simMs - s.relocatedMs < RELOCATED_LABEL_MS) return 'RELOCATED';
  if (s.supply < 0.45) return 'DEPLETING';
  if (!s.found) return 'UNFOUND';
  return 'FOUND';
}

export interface LabelTarget {
  x: number;
  y: number;
  index: number;
  state: SourceLabelState;
  /** Ranking weight — only the top few are drawn, so the field never clutters. */
  weight: number;
}

/** The handful of sources worth labelling right now. */
export function labelTargets(c: Colony, max = 3): LabelTarget[] {
  const out: LabelTarget[] = [];
  c.sources.forEach((s, i) => {
    const state = sourceLabel(c, s);
    const weight =
      state === 'RELOCATED' ? 100 : state === 'DEPLETING' ? 60 : state === 'UNFOUND' ? 40 : s.rho * 10;
    out.push({ x: s.x, y: s.y, index: i + 1, state, weight });
  });
  c.ghosts.forEach((g) => {
    if (c.simMs - g.diedMs > 9000) return;
    out.push({ x: g.x, y: g.y, index: 0, state: 'GONE', weight: 80 });
  });
  out.sort((a, b) => b.weight - a.weight);
  return out.slice(0, max);
}
