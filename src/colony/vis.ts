/**
 * Render knobs, separate from the simulation's own constants.
 *
 * FIELD_GAMMA is the one that matters most. Below 1 it lifts faint pheromone,
 * which turns every trail into a wide soft haze that swallows the agents; above
 * 1 it collapses the glow onto the arteries that are actually carrying traffic.
 * The agents, not the field, should be the brightest thing on screen.
 *
 * In dev these are reachable as window.__colony.VIS for live tuning.
 */
export const VIS = {
  /** >1 tightens the glow onto real trails; <1 spreads a haze. */
  FIELD_GAMMA: 1.7,
  /** Peak alpha of the pheromone field. */
  FIELD_ALPHA: 210,
  /** Concentration below which a cell draws nothing at all. */
  FIELD_FLOOR: 0.09,

  ANT_SEARCHING_ALPHA: 0.55,
  ANT_SEARCHING_SIZE: 1.5,
  ANT_CARRYING_ALPHA: 0.95,
  ANT_CARRYING_SIZE: 2.0,

  /**
   * Opacity at the centre of an obstacle, falling to nothing at its edge.
   * Low enough that it reads as a thickening of the dark rather than a hole
   * cut in it — the edge is described by the pheromone pooling against it,
   * never by a drawn line.
   */
  OBSTACLE_CORE: 0.7,

  /** Source frame half-width, as a fraction of the viewport's short axis. */
  SOURCE_FRAME: 0.0115,
  /** Smallest the core shrinks to before the source is gone. */
  SOURCE_CORE_MIN: 0.18,
};

