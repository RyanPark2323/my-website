import type { SimulationRealm } from '../types';
import WaterRightsView from './WaterRightsView';

export const waterRights: SimulationRealm = {
  id: 'water-rights',
  kind: 'simulation',
  title: 'Water Rights',
  tagline:
    'Prior appropriation on a shrinking river — what seniority actually does once the water stops arriving, and how users re-time diversions when they can read the call list.',
  status: 'in-progress',
  order: 1,
  component: WaterRightsView,
  stats: [
    { label: 'AGENTS', value: '1,240 diverters · 1 regulator' },
    { label: 'MECHANISM', value: 'Seniority queue · reflexive re-timing' },
    { label: 'RUNTIME', value: 'In-browser · Canvas 2D' },
  ],
};
