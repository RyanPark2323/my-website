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
  '780 ants, built from scratch. Each one leaves pheromone on the way back from food, and the others follow the smell. The trails are where that adds up.';

export const BUILD_NOTES: BuildNote[] = [
  {
    label: "WHAT YOU'RE LOOKING AT",
    body: 'In 1989 Goss and colleagues gave Argentine ants two routes to the same food, one shorter than the other. The colony ended up on the short one, even though no ant ever compared them. Ants on the shorter route get back sooner, so that route gets marked more often, which pulls in more ants. The same loop is running here. Watch a trail bend around an obstacle to see it settle on a route.',
  },
  {
    label: 'STIGMERGY',
    body: "No ant signals another directly. Each one changes the ground, and the ground changes what the next ant does. That's the whole coordination mechanism. Grassé named it in 1959 after watching termites build nests the same way.",
  },
  {
    label: 'WHY IT EVAPORATES',
    body: 'Decay is doing real work here. Without it, the first route found would be reinforced forever and the colony could never let go of it. Evaporation is what lets a trail fade once the food is gone. Delete a source to watch it happen.',
  },
  {
    label: 'WHAT IT BECAME',
    body: 'Dorigo turned this into an algorithm in his 1992 thesis, called Ant System, and pointed it at the travelling salesman and quadratic assignment problems. The same family of methods is still used for routing and scheduling.',
  },
  {
    label: 'TRY THIS',
    body: "Place food somewhere empty and watch how long it takes to get a trail. Then delete a source with a strong trail. The colony doesn't get told anything changed. It just stops finding food there, and the ants drift to whatever is still paying.",
  },
];

/**
 * How long a note stays up. Paced to the note rather than a flat interval, so
 * a long note is never pulled away mid-sentence: a slow reading pace (the text
 * sits over a moving field), plus a lead-in for finding the label, with a floor
 * so a short note does not flick past.
 */
const NOTE_MS_PER_WORD = 300;
const NOTE_LEAD_MS = 3_000;
const NOTE_MIN_MS = 12_000;

export function noteDurationMs(note: BuildNote): number {
  const words = note.body.trim().split(/\s+/).length;
  return Math.max(NOTE_MIN_MS, Math.round(NOTE_LEAD_MS + words * NOTE_MS_PER_WORD));
}
