import { useEffect, useRef } from 'react';

interface Diverter {
  pos: number;
  rank: number;
  demand: number;
  eff: number;
  curtails: number;
  on: boolean;
  adapted: boolean;
}

interface RiverEngine {
  rctx?: CanvasRenderingContext2D | null;
  N: number;
  divs: Diverter[];
  order: Diverter[];
  rDay: number;
  hist: number[];
  ro?: ResizeObserver;
  rraf?: number;
  rlast: number;
  rw?: number;
  rh?: number;
  Q: number;
  sat: number;
  scenario: number;
  reduced: boolean;
}

const SCENARIO_LABELS = ['NORMAL', 'DRY', 'SEVERE'] as const;

/**
 * The Water Rights case-study simulation: eighteen diverters on a shrinking
 * river, allocated strictly by seniority, re-timing their demand as they get
 * curtailed. Runs only while `active` is true (the realm is open).
 */
export function useRiverSim(active: boolean) {
  const riverRef = useRef<HTMLCanvasElement>(null);
  const rDayRef = useRef<HTMLSpanElement>(null);
  const rQRef = useRef<HTMLSpanElement>(null);
  const rSatRef = useRef<HTMLSpanElement>(null);
  const rCurtRef = useRef<HTMLSpanElement>(null);
  const rAdaptRef = useRef<HTMLSpanElement>(null);
  const sc0Ref = useRef<HTMLButtonElement>(null);
  const sc1Ref = useRef<HTMLButtonElement>(null);
  const sc2Ref = useRef<HTMLButtonElement>(null);

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const eng = useRef<RiverEngine>({
    N: 18,
    divs: [],
    order: [],
    rDay: 0,
    hist: [],
    rlast: 0,
    Q: 0,
    sat: 0,
    scenario: 0,
    reduced: false,
  }).current;

  function setText<T extends HTMLElement>(ref: React.RefObject<T | null>, v: string) {
    if (ref.current) ref.current.textContent = v;
  }

  function setupRiver() {
    const c = riverRef.current;
    if (!c) return;
    eng.rctx = c.getContext('2d');
    eng.N = 18;
    eng.divs = [];
    const ranks: number[] = [];
    for (let i = 0; i < eng.N; i++) ranks.push(i);
    for (let i = ranks.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = ranks[i];
      ranks[i] = ranks[j];
      ranks[j] = t;
    }
    for (let i = 0; i < eng.N; i++) {
      eng.divs.push({
        pos: 0.055 + (i / (eng.N - 1)) * 0.89,
        rank: ranks[i],
        demand: 6 + Math.round(Math.random() * 9),
        eff: 1,
        curtails: 0,
        on: true,
        adapted: false,
      });
    }
    eng.order = eng.divs.slice().sort((a, b) => a.rank - b.rank);
    eng.rDay = 0;
    eng.hist = [];
    rsizeRiver();
    eng.ro = new ResizeObserver(() => rsizeRiver());
    eng.ro.observe(c);
    if (eng.reduced) {
      for (let i = 0; i < 140; i++) riverStep();
      riverDraw();
      riverReadout();
      return;
    }
    eng.rlast = performance.now();
    eng.rraf = requestAnimationFrame(riverLoop);
  }

  function teardownRiver() {
    if (eng.rraf != null) cancelAnimationFrame(eng.rraf);
    eng.rraf = undefined;
    if (eng.ro) {
      eng.ro.disconnect();
      eng.ro = undefined;
    }
  }

  function rsizeRiver() {
    const c = riverRef.current;
    if (!c || !eng.rctx) return;
    const r = c.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.floor(r.width * dpr);
    c.height = Math.floor(r.height * dpr);
    eng.rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    eng.rw = r.width;
    eng.rh = r.height;
    if (eng.reduced) riverDraw();
  }

  function riverStep() {
    const fac = [1, 0.72, 0.5][eng.scenario ?? 0];
    eng.rDay++;
    const seasonal = 0.78 + 0.34 * Math.sin(eng.rDay / 58);
    const Q = 150 * seasonal * fac;
    eng.Q = Q;
    let remaining = Q;
    let sat = 0;
    for (let i = 0; i < eng.order.length; i++) {
      const d = eng.order[i];
      const need = d.demand * d.eff;
      if (remaining >= need) {
        remaining -= need;
        d.on = true;
        sat++;
      } else {
        d.on = false;
        d.curtails++;
        if (d.curtails % 12 === 0 && d.eff > 0.56) {
          d.eff = Math.max(0.56, d.eff - 0.07);
          d.adapted = true;
        }
      }
    }
    eng.sat = sat;
    eng.hist.push(eng.N - sat);
    if (eng.hist.length > 190) eng.hist.shift();
  }

  function riverDraw() {
    const ctx = eng.rctx,
      w = eng.rw,
      h = eng.rh;
    if (!ctx || !w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const yR = h * 0.44;
    const x0 = w * 0.04,
      x1 = w * 0.96;
    const Qmax = 150 * 1.12;

    const used: { pos: number; cum: number }[] = [];
    let cum = 0;
    const byPos = eng.divs.slice().sort((a, b) => a.pos - b.pos);
    for (let i = 0; i < byPos.length; i++) {
      const d = byPos[i];
      if (d.on) cum += d.demand * d.eff;
      used.push({ pos: d.pos, cum });
    }
    const flowAt = (t: number) => {
      let u = 0;
      for (let i = 0; i < used.length; i++) {
        if (used[i].pos <= t) u = used[i].cum;
      }
      return Math.max(0, eng.Q - u);
    };
    const steps = 140;
    for (let i = 0; i < steps; i++) {
      const t0 = i / steps,
        t1 = (i + 1) / steps;
      const f = flowAt(t0) / Qmax;
      const xa = x0 + (x1 - x0) * t0,
        xb = x0 + (x1 - x0) * t1;
      const th = 1 + Math.max(0, f) * 13;
      ctx.fillStyle = 'rgba(78,133,119,' + (0.16 + Math.min(0.6, f * 0.85)).toFixed(3) + ')';
      ctx.fillRect(xa, yR - th / 2, xb - xa + 1, th);
    }
    ctx.fillStyle = 'rgba(237,232,221,.16)';
    ctx.fillRect(x0, yR + 12, x1 - x0, 1);

    for (let i = 0; i < byPos.length; i++) {
      const d = byPos[i];
      const x = x0 + (x1 - x0) * d.pos;
      const s = 5 + d.eff * 5;
      const y = yR - 26 - s;
      if (d.on) {
        ctx.fillStyle = 'rgba(78,133,119,.85)';
        ctx.fillRect(x - s / 2, y, s, s);
      } else {
        ctx.strokeStyle = 'rgba(80,84,90,.95)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - s / 2 + 0.5, y + 0.5, s, s);
      }
      ctx.fillStyle = d.on ? 'rgba(78,133,119,.4)' : 'rgba(120,124,130,.4)';
      ctx.fillRect(x - 0.5, y + s, 1, yR - 6 - (y + s));
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(237,232,221,.3)';
      ctx.textAlign = 'center';
      ctx.fillText(String(d.rank + 1), x, yR + 24);
      if (d.adapted) {
        ctx.fillStyle = 'rgba(237,232,221,.5)';
        ctx.fillRect(x - 3, y - 6, 6, 1);
      }
    }
    ctx.textAlign = 'left';
    ctx.font = '8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(237,232,221,.22)';
    ctx.fillText('SENIORITY RANK', x0, yR + 40);
    ctx.fillText('UPSTREAM', x0, yR - 46);
    ctx.textAlign = 'right';
    ctx.fillText('DOWNSTREAM', x1, yR - 46);
    ctx.textAlign = 'left';

    const gy0 = h * 0.72,
      gh = h * 0.2;
    ctx.fillStyle = 'rgba(237,232,221,.1)';
    ctx.fillRect(x0, gy0 + gh, x1 - x0, 1);
    ctx.strokeStyle = 'rgba(90,146,132,.9)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < eng.hist.length; i++) {
      const t = i / 190;
      const x = x0 + (x1 - x0) * t;
      const y = gy0 + gh - (eng.hist[i] / eng.N) * gh;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = 'rgba(237,232,221,.22)';
    ctx.font = '8.5px "JetBrains Mono", monospace';
    ctx.fillText('CURTAILED / DAY', x0, gy0 - 6);
  }

  function riverReadout() {
    const pad = (v: number, n: number) => String(v).padStart(n, '0');
    let adapted = 0;
    for (let i = 0; i < eng.divs.length; i++) if (eng.divs[i].adapted) adapted++;
    setText(rDayRef, pad(eng.rDay % 1000, 3));
    setText(rQRef, Math.round(eng.Q) + ' CFS');
    setText(rSatRef, pad(eng.sat, 2) + '/18');
    setText(rCurtRef, pad(eng.N - eng.sat, 2));
    setText(rAdaptRef, pad(adapted, 2));
  }

  function riverLoop(now: number) {
    if (!activeRef.current) {
      eng.rraf = undefined;
      return;
    }
    eng.rraf = requestAnimationFrame(riverLoop);
    if (document.hidden) return;
    if (now - eng.rlast < 90) return;
    eng.rlast = now;
    riverStep();
    riverDraw();
    riverReadout();
  }

  function applyScenarioStyles(i: number) {
    const refs = [sc0Ref, sc1Ref, sc2Ref];
    refs.forEach((ref, k) => {
      const el = ref.current;
      if (!el) return;
      const on = k === i;
      el.style.background = on ? '#B8874F' : 'transparent';
      el.style.color = on ? '#0B0C0E' : 'rgba(237,232,221,.6)';
      el.style.borderColor = on ? '#B8874F' : '#2A2C30';
      el.setAttribute('aria-pressed', String(on));
    });
  }

  function setScenario(i: number) {
    eng.scenario = i;
    applyScenarioStyles(i);
    if (eng.reduced) {
      for (let n = 0; n < 60; n++) riverStep();
      riverDraw();
      riverReadout();
    }
  }

  useEffect(() => {
    if (!active) return;
    eng.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    eng.scenario = 0;
    applyScenarioStyles(0);
    const id = requestAnimationFrame(() => setupRiver());
    return () => {
      cancelAnimationFrame(id);
      teardownRiver();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const onScenario0 = () => setScenario(0);
  const onScenario1 = () => setScenario(1);
  const onScenario2 = () => setScenario(2);

  return {
    riverRef,
    rDayRef,
    rQRef,
    rSatRef,
    rCurtRef,
    rAdaptRef,
    sc0Ref,
    sc1Ref,
    sc2Ref,
    onScenario0,
    onScenario1,
    onScenario2,
    scenarioLabels: SCENARIO_LABELS,
  };
}
