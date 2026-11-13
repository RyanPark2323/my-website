import type { ComponentType } from 'react';
import type { ImageAnnotation } from '../foyer/components/PlaceholderBox';

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
  /** Imported image asset. Omitted projects render the placeholder box. */
  image?: string;
  /** Still frame shown instead of `image` under prefers-reduced-motion. */
  imageStill?: string;
  /** Alt text. Falls back to the title, which is rarely a good description. */
  imageAlt?: string;
  /** Mono readout drawn over the bottom of the image. */
  imageCaption?: string;
  /** A callout pointing at something inside the image. */
  imageAnnotation?: ImageAnnotation;
  /** The case-study body, one entry per paragraph. */
  longDescription: string[];
  highlights: string[];
  /**
   * The highlight shown on the index card, when the first highlight is too
   * long for the card's mono stat row. Omitted, the card uses highlights[0].
   */
  cardHighlight?: string;
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
