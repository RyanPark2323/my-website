import type { ComponentType } from 'react';

export type ProjectStatus = 'in-progress' | 'built' | 'planned';

interface ProjectCommon {
  /** Stable slug, also the React key. */
  id: string;
  title: string;
  /** One line under the title on the card. */
  tagline: string;
  status: ProjectStatus;
  /** Sort position, and the number shown on the card. */
  order: number;
}

/** A finished piece of work with a case study behind it. */
export interface CaseStudy extends ProjectCommon {
  kind: 'case-study';
  /** Path under /public to a screenshot. Omitted projects render the placeholder box. */
  image?: string;
  longDescription: string;
  highlights: string[];
  technologies: string[];
  /**
   * A bespoke interactive view, for work that is better shown running than
   * described. Omitted projects use the shared case-study template.
   */
  component?: ComponentType<{ onBack: () => void }>;
}

/** A slot that exists but has no content yet. */
export interface PlannedProject extends ProjectCommon {
  kind: 'planned';
  status: 'planned';
}

export type Project = CaseStudy | PlannedProject;
