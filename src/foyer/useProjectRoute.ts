import { useCallback, useEffect, useState } from 'react';
import { getProject } from '../work';

/**
 * Project routing.
 *
 * A query parameter rather than a path, because the site is served from a base
 * path on GitHub Pages with no server-side rewrite: `?project=x` always
 * resolves to the same index.html, so a deep link and a refresh both work with
 * no deploy configuration at all. A path would 404 on refresh.
 *
 * The history entry is the single source of truth. Opening a project pushes
 * one, so Back leaves the project rather than the site, and popstate is the
 * only thing that changes the view — which is what keeps Back, Forward and the
 * on-page control from ever disagreeing about where the reader is.
 */

const PARAM = 'project';

/** The project named in the URL right now, or null when it names nothing real. */
function readId(): string | null {
  const id = new URLSearchParams(window.location.search).get(PARAM);
  return id && getProject(id) ? id : null;
}

/**
 * Built from the live URL so whatever path the site is served from is carried
 * along rather than reconstructed. The hash is dropped on purpose: a project is
 * a view, not an anchor on the index.
 */
function hrefFor(id: string | null): string {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set(PARAM, id);
  else url.searchParams.delete(PARAM);
  return `${url.pathname}${url.search}`;
}

/** True when this history entry is one we pushed, so there is one to unwind. */
function isOurEntry(): boolean {
  const state: unknown = window.history.state;
  return typeof state === 'object' && state !== null && PARAM in state;
}

export interface ProjectRoute {
  /** The open project's id, or null on the index. Never names a missing project. */
  projectId: string | null;
  openProject: (id: string) => void;
  closeProject: () => void;
}

export function useProjectRoute(): ProjectRoute {
  const [projectId, setProjectId] = useState<string | null>(readId);

  useEffect(() => {
    const onPopState = () => setProjectId(readId());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    // Each view change puts the reader at the top, so the browser must not try
    // to restore a scroll position on top of that.
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  const openProject = useCallback((id: string) => {
    if (!getProject(id)) return;
    window.history.pushState({ [PARAM]: id }, '', hrefFor(id));
    setProjectId(id);
  }, []);

  const closeProject = useCallback(() => {
    // Unwind the entry that opening pushed, so the on-page control and Back
    // land in the same place instead of stacking a second entry. A reader who
    // arrived on a deep link has nothing to unwind, so rewrite this entry
    // rather than sending them off the site.
    if (isOurEntry()) {
      window.history.back();
      return;
    }
    window.history.replaceState(null, '', hrefFor(null));
    setProjectId(null);
  }, []);

  return { projectId, openProject, closeProject };
}
