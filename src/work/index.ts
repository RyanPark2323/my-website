import type { Project } from './types';
import { evaluatorStressTest } from './evaluator-stress-test/config';
import { utahCapAndTrade } from './utah-cap-and-trade/config';

/**
 * The single source of truth for everything shown in the work section. Adding
 * a project means a new folder plus one line here, and nothing else.
 */
export const projects: Project[] = [evaluatorStressTest, utahCapAndTrade].sort(
  (a, b) => a.order - b.order
);

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
