/**
 * The notes shown beside the field.
 *
 * These are about the model — the ant colony optimization experiment this is a
 * running instance of — rather than about the implementation. The rail on the
 * right reports live state; this explains what the thing on screen is actually
 * demonstrating and where it comes from.
 *
 * Every citation here was checked against the source, not written from memory:
 *   Goss, Aron, Deneubourg & Pasteels (1989), "Self-organized shortcuts in the
 *     Argentine ant", Naturwissenschaften 76:579-581
 *   Grassé (1959), stigmergy, from nest building in Bellicositermes natalensis
 *   Dorigo (1992), PhD thesis, Politecnico di Milano — Ant System, the first
 *     ACO algorithm, applied to the travelling salesman and quadratic
 *     assignment problems
 *
 * Copy rules: say what it is, not what it isn't. No closing aphorisms. Give the
 * reasoning rather than the conclusion. Plain sentences.
 */

export interface BuildNote {
  label: string;
  body: string;
}

export const CLAIM_BODY =
  '780 ants. Each one drops pheromone on the way back from food, and it evaporates over time. Every path on screen came out of that.';

export const BUILD_NOTES: BuildNote[] = [
  {
    label: 'THE EXPERIMENT',
    body: 'This is a running version of a real result. In 1989 Goss and colleagues gave Argentine ants two routes of different length to the same food. The colony ended up using the shorter one, even though no ant ever compared them and none of them could see both.',
  },
  {
    label: 'HOW THAT WORKS',
    body: 'An ant on the shorter route gets back sooner, so it lays pheromone over that route more often per unit of time. The stronger smell pulls in more ants, which makes it stronger again. The colony is not choosing the short path, it is just reinforcing whatever is currently winning.',
  },
  {
    label: 'STIGMERGY',
    body: 'The ants are not communicating with each other. They change the environment and the environment changes what they do next, which is the whole coordination mechanism. Grassé named it in 1959 after watching termites build nests the same way.',
  },
  {
    label: 'WHY IT EVAPORATES',
    body: 'Decay is doing real work here. Without it the first route found would be reinforced forever and the colony could never move off a bad answer. Evaporation is what lets it drop a path once the food is gone, which you can watch happen if you delete a source.',
  },
  {
    label: 'WHAT IT BECAME',
    body: 'Dorigo turned this into an algorithm in his 1992 thesis, called Ant System. It was pointed at the travelling salesman and quadratic assignment problems, and the same family of methods still gets used on routing and scheduling.',
  },
];

export const BUILD_NOTE_MS = 15_000;
