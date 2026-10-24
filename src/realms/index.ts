import type { Realm, UnbuiltRealm } from './types';
import { waterRights } from './water-rights/config';
import { gifthint } from './gifthint/config';
import { breathOfFreshAir } from './breath-of-fresh-air/config';
import { golfSimulator } from './golf-simulator/config';

const nextUp: UnbuiltRealm = {
  id: 'realm-ii',
  kind: 'unbuilt',
  title: 'Realm II',
  tagline: 'UNBUILT · OPENS WHEN IT RUNS',
  status: 'unbuilt',
  order: 5,
};

/**
 * The single source of truth for every realm on the site. Both the foyer's
 * teaser-card list and the realm-view switch read from this array — adding a
 * future realm means a new folder plus one line here, nothing else.
 */
export const realms: Realm[] = [waterRights, gifthint, breathOfFreshAir, golfSimulator, nextUp].sort(
  (a, b) => a.order - b.order
);

export function getRealm(id: string): Realm | undefined {
  return realms.find((r) => r.id === id);
}
