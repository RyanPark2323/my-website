import type { ComponentType } from 'react';

export type RealmStatus = 'in-progress' | 'built' | 'unbuilt';

interface RealmCommon {
  /** Stable slug, also used as the React key / identity for the realm. */
  id: string;
  title: string;
  /** Short one-line teaser shown on the foyer card, under the title. */
  tagline: string;
  status: RealmStatus;
  /** Sort position in the realm list. Also drives the "REALM N" numeral shown in the UI. */
  order: number;
}

export interface RealmStat {
  label: string;
  value: string;
}

/** A realm with a bespoke interactive case-study view/component (e.g. Water Rights). */
export interface SimulationRealm extends RealmCommon {
  kind: 'simulation';
  /** The case-study view rendered when this realm is opened. */
  component: ComponentType<{ onBack: () => void }>;
  /** Stat rows shown on the foyer teaser card (AGENTS / MECHANISM / RUNTIME, etc.) */
  stats: RealmStat[];
}

/** A realm with no bespoke simulation: image + description + stats, rendered by the generic template. */
export interface SimpleRealm extends RealmCommon {
  kind: 'simple';
  /** Path under /public to a screenshot. Omitted realms render the "DROP IN" placeholder box. */
  image?: string;
  longDescription: string;
  highlights: string[];
  technologies: string[];
}

/** A placeholder slot for a realm that doesn't exist yet ("opens when it runs"). */
export interface UnbuiltRealm extends RealmCommon {
  kind: 'unbuilt';
}

export type Realm = SimulationRealm | SimpleRealm | UnbuiltRealm;
