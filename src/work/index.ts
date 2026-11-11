import type { Project } from './types';
import { breathOfFreshAir } from './breath-of-fresh-air/config';
import { est } from './est/config';

/**
 * The single source of truth for everything shown in the work section. Adding
 * a project means a new folder plus one line here, and nothing else.
 */
export const projects: Project[] = [breathOfFreshAir, est].sort((a, b) => a.order - b.order);

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
