/**
 * Bakes the warm-start pool.
 *
 *   npm run snapshots
 *
 * Runs the shipping engine headless to steady state from a handful of fixed
 * seeds, downsamples each pheromone field, and writes the pool to
 * src/colony/snapshots.data.ts.
 *
 * The seeds are fixed so a re-run is reproducible. Variety at load time comes
 * from the eight symmetries, source jitter and the tick offset, not from
 * regenerating this file.
 *
 * Deliberately imports the real engine rather than a copy — a snapshot that
 * was not produced by the shipping mechanics would be a scripted path.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createColony, stepColony, mulberry32 } from '../src/colony/engine.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../src/colony/snapshots.data.ts');

const SEEDS = [0x5eed01, 0x5eed02, 0x5eed03, 0x5eed04, 0x5eed05];
const GRID = 128;
const STORE = 64;
const AGENTS = 760;
const DT = 1000 / 30;
/** ~3 minutes of simulated time: well past convergence, with a disturbance or two behind it. */
const MIN_TICKS = 5400;
const MAX_TICKS = 11000;

/** Box-average GRID down to STORE. */
function downsample(field, G, g) {
  const out = new Float32Array(g * g);
  const f = G / g;
  for (let y = 0; y < g; y++) {
    for (let x = 0; x < g; x++) {
      let sum = 0;
      let n = 0;
      for (let sy = (y * f) | 0; sy < ((y + 1) * f) | 0; sy++) {
        for (let sx = (x * f) | 0; sx < ((x + 1) * f) | 0; sx++) {
          sum += field[sy * G + sx];
          n++;
        }
      }
      out[y * g + x] = n ? sum / n : 0;
    }
  }
  return out;
}

function capture(seed) {
  const c = createColony({ grid: GRID, agents: AGENTS, aspect: 16 / 9, rng: mulberry32(seed) });

  let ticks = 0;
  while (ticks < MAX_TICKS) {
    stepColony(c, DT);
    ticks++;
    // Hold out for a field that has actually converged on something.
    if (ticks >= MIN_TICKS && c.rho > 0.18 && c.sources.some((s) => s.rho > 0.25)) break;
  }

  const small = downsample(c.field, GRID, STORE);
  let max = 0;
  for (const v of small) if (v > max) max = v;
  // Store a little hot: the field decays during the loader's settle while the
  // agents rebuild it, and an under-scaled seed settles into nothing.
  const scale = Math.max(max, 1e-6) * 1.0;
  const bytes = Buffer.alloc(STORE * STORE);
  for (let i = 0; i < small.length; i++) {
    bytes[i] = Math.min(255, Math.round((small[i] / scale) * 255));
  }

  return {
    snapshot: {
      g: STORE,
      scale: Number(scale.toFixed(5)),
      field: bytes.toString('base64'),
      bars: c.bars.map((b) => [
        Number(b.x.toFixed(4)),
        Number(b.y.toFixed(4)),
        Number(b.len.toFixed(4)),
        Number(b.thick.toFixed(4)),
        Number(b.angle.toFixed(4)),
      ]),
      sources: c.sources.map((s) => [
        Number(s.x.toFixed(4)),
        Number(s.y.toFixed(4)),
        Number(Math.max(0.3, s.supply).toFixed(3)),
      ]),
      nest: [Number(c.nest.x.toFixed(4)), Number(c.nest.y.toFixed(4))],
      deliveries: c.deliveries,
    },
    stats: { seed, ticks, rho: c.rho, sources: c.sources.length, bars: c.bars.length, deliveries: c.deliveries },
  };
}

const results = SEEDS.map((s) => {
  const r = capture(s);
  console.log(
    `seed 0x${s.toString(16)}  ticks ${String(r.stats.ticks).padStart(5)}  rho ${r.stats.rho.toFixed(3)}  sources ${r.stats.sources}  bars ${r.stats.bars}  deliveries ${r.stats.deliveries}`
  );
  return r;
});

const body = results
  .map(
    (r) => `  {
    g: ${r.snapshot.g},
    scale: ${r.snapshot.scale},
    sources: ${JSON.stringify(r.snapshot.sources)},
    bars: ${JSON.stringify(r.snapshot.bars)},
    nest: ${JSON.stringify(r.snapshot.nest)},
    deliveries: ${r.snapshot.deliveries},
    field:
      '${r.snapshot.field}',
  },`
  )
  .join('\n');

writeFileSync(
  OUT,
  `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Steady-state pheromone fields produced by scripts/gen-snapshots.mjs, which
 * runs the shipping engine headless. Regenerate with: npm run snapshots
 *
 * Each entry is a ${STORE}x${STORE} quantized field plus the sources and nest that
 * produced it. The loader in snapshots.ts applies one of the eight square
 * symmetries, jitters, and settles before the first frame.
 */

import type { Snapshot } from './snapshots';

export const SNAPSHOTS: Snapshot[] = [
${body}
];
`,
  'utf8'
);

console.log(`\nwrote ${results.length} snapshots -> src/colony/snapshots.data.ts`);
