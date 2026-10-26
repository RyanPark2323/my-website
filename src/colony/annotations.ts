/**
 * Tier 2 vocabulary.
 *
 * The field only explains itself at the instant it is demonstrating the thing.
 * There is no upfront legend and no definition on a quiet field — each of these
 * appears because the colony just did it, one at a time, and then fades.
 *
 * Term in monospace teal uppercase; translation beneath in the softer face,
 * dimmer, lowercase, one short line.
 */

import type { ColonyEventKind } from './engine';

export interface Annotation {
  term: string;
  translation: string;
}

export const ANNOTATIONS: Record<ColonyEventKind, Annotation> = {
  STIGMERGY: { term: 'STIGMERGY', translation: 'the path outlives its reason' },
  POSITIVE_FEEDBACK: { term: 'POSITIVE FEEDBACK', translation: 'success reinforces itself' },
  SYMMETRY_BROKEN: { term: 'SYMMETRY BROKEN', translation: 'no decision was made' },
  EVAPORATION: { term: 'EVAPORATION', translation: 'forgetting is what frees them' },
  EXPLORATION: { term: 'EXPLORATION', translation: 'nobody ordered this' },
};

/** Minimum quiet between annotations. Silent most of the time, never stacked. */
export const ANNOTATION_GAP_MS = 13_000;
/** How long one stays up before fading. */
export const ANNOTATION_HOLD_MS = 9_500;

/**
 * The regime: a one-word answer to "what is the colony doing right now",
 * derived from live state rather than scripted. Tier 2 annotations are rare by
 * design and fire only on events — this fills the long quiet between them, so
 * the field is never doing something unexplained.
 *
 * Pure state in the Tier 1 sense: no prose, no claims, just the name of the
 * phase the colony is observably in.
 */
export type Regime = 'CONVERGING' | 'REINFORCING' | 'REROUTING' | 'EXPLORING' | 'DECAYING';

export const REGIME_GLOSS: Record<Regime, string> = {
  CONVERGING: 'traffic is collecting onto one path',
  REINFORCING: 'the path is carrying itself now',
  REROUTING: 'the known route stopped paying',
  EXPLORING: 'no trail is worth following yet',
  DECAYING: 'a path nobody feeds is being forgotten',
};

export interface RegimeInput {
  rho: number;
  rhoDelta: number;
  carryingFraction: number;
  msSinceEvent: number;
}

export function classifyRegime(i: RegimeInput): Regime {
  // A disturbance just landed and the colony has not re-converged.
  if (i.msSinceEvent < 9000 && i.rhoDelta < 0.004) return 'REROUTING';
  if (i.carryingFraction < 0.08 && i.rho < 0.12) return 'EXPLORING';
  if (i.rhoDelta > 0.006) return 'CONVERGING';
  if (i.rhoDelta < -0.006) return 'DECAYING';
  return 'REINFORCING';
}
