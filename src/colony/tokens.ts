/**
 * The site's existing visual language, named.
 *
 * These are not new tokens — every value here is lifted verbatim from the
 * inline styles already in Foyer.tsx / RealmTeaserCard.tsx / foyer.css. Naming
 * them stops the canvas from drifting into a parallel palette, which is the
 * one thing the field is not allowed to do.
 */

/** Page ground. */
export const BG = '#0B0C0E';

/** Bone — primary type and near-colorless agents. */
export const BONE = '#EDE8DD';
export const BONE_RGB = '237,232,221';
/** The established opacity ladder for bone. */
export const bone = (a: number) => `rgba(${BONE_RGB},${a})`;

/** Cold teal. The field's only color. */
export const TEAL_DEEP = '#4E8577';
export const TEAL = '#5A9284';
export const TEAL_LIGHT = '#7AB2A3';

/**
 * Pheromone ramp endpoints. Low concentration is colder and bluer, high
 * concentration is brighter and greener — so an artery visibly cools as it
 * evaporates. This single mapping is the field's most important signal.
 */
export const RHO_COLD = { r: 0x33, g: 0x4a, b: 0x55 };
export const RHO_HOT = { r: 0x5f, g: 0x96, b: 0x86 };

/**
 * Amber. Reserved for the page's accent (links, CTA, the headline underline).
 * The field never uses it.
 */
export const AMBER = '#C9975C';
export const AMBER_DEEP = '#B8874F';

/** Hairline rule. */
export const HAIRLINE = '#2A2C30';

export const FONT_DISPLAY = 'Fraunces,Georgia,serif';
export const FONT_BODY = "'Public Sans',system-ui,sans-serif";
export const FONT_MONO = "'JetBrains Mono',monospace";

/** Telemetry grammar: 10px mono, .13em tracking, dim label + teal value. */
export const TELEMETRY_LABEL = bone(0.28);
export const TELEMETRY_VALUE = TEAL;
