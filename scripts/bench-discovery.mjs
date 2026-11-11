/**
 * How long does a visitor-placed source wait to be found?
 *
 *   npm run bench:discovery
 *
 * Reports the DISTRIBUTION, not the average. The average is useless here: the
 * outcome is bimodal — a source placed on an artery is found within a tick,
 * one placed in the outer field may never be found at all. The number that
 * matters is the "never" column.
 *
 * Measured on the shipping engine, 2026-10-26:
 *   found <2s 51% · <10s 67% · never within 60s 21%
 */
import { createColony, stepColony, mulberry32, addSource, rhoAt, isCommitted, blockedAt, P } from '../src/colony/engine.ts';
const HZ = 30;
const sx = 1/(16/9), sy = 1;

function clone(c) {
  return { ...c,
    field: Float32Array.from(c.field),
    tmp: new Float32Array(c.tmp.length),
    blocked: Uint8Array.from(c.blocked),
    ants: c.ants.map(a => ({...a})),
    sources: c.sources.map(s => ({...s})),
    ghosts: c.ghosts.map(g => ({...g})),
    bars: c.bars.map(b => ({...b})),
    events: [],
  };
}
const bases = {};
for (const seed of [7,23,41]) {
  const c = createColony({ grid:176, agents:780, aspect:16/9, rng: mulberry32(seed) });
  for (let t=0;t<4000;t++) stepColony(c, 1000/HZ);
  bases[seed] = c;
}
function trial(seed, dist, ang, maxTicks=1800) {
  const c = clone(bases[seed]);
  const x = c.nest.x + Math.cos(ang)*dist*sx;
  const y = c.nest.y + Math.sin(ang)*dist*sy;
  if (x<0.04||x>0.96||y<0.04||y>0.96||blockedAt(c,x,y)) return null;
  const s = addSource(c, x, y);
  let near=0, free=0;
  for (const a of c.ants) {
    const dx=(a.x-s.x)/sx, dy=(a.y-s.y)/sy;
    if (Math.hypot(dx,dy) < 0.18) { near++; if (!a.carrying && !isCommitted(c,a)) free++; }
  }
  const rho0 = rhoAt(c, s.x, s.y);
  for (let t=1;t<=maxTicks;t++) {
    stepColony(c, 1000/HZ);
    if (s.found) return { t: t/HZ, near, free, rho0 };
  }
  return { t: Infinity, near, free, rho0 };
}
const pct = (a, f) => (100 * a.filter(f).length / a.length).toFixed(0) + '%';
console.log('BASELINE — the distribution, not the average. n per row in brackets.');
console.log('dist  | <2s   <10s   <30s   never(60s) | uncommitted ants near the click');
const all = [];
for (const dist of [0.15,0.30,0.45,0.60,0.75]) {
  const ts=[], fs=[];
  for (const seed of [7,23,41]) for (let k=0;k<8;k++) {
    const r = trial(seed, dist, (k/8)*Math.PI*2 + 0.2);
    if (!r) continue;
    ts.push(r.t); fs.push(r.free); all.push(r.t);
  }
  if (!ts.length) continue;
  const avg = a=>a.reduce((x,y)=>x+y,0)/a.length;
  console.log(`${dist.toFixed(2)} [${String(ts.length).padStart(2)}] | ${pct(ts,t=>t<2).padStart(4)}  ${pct(ts,t=>t<10).padStart(4)}  ${pct(ts,t=>t<30).padStart(4)}  ${pct(ts,t=>t===Infinity).padStart(6)}     |  ${avg(fs).toFixed(1)}`);
}
console.log(`\nALL PLACEMENTS: found <2s ${pct(all,t=>t<2)} · <10s ${pct(all,t=>t<10)} · never within 60s ${pct(all,t=>t===Infinity)}`);
