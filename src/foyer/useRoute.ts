import { useCallback, useEffect, useState } from 'react';
import { getProject } from '../work';

/**
 * Routing for every view that is not the index.
 *
 * Query parameters rather than paths, because the site is served from a base
 * path on GitHub Pages with no server-side rewrite: `?project=x` always
 * resolves to the same index.html, so a deep link and a refresh both work with
 * no deploy configuration at all. A path would 404 on refresh.
 *
 * The history entry is the single source of truth. Opening a view pushes one,
 * so Back leaves the view rather than the site, and popstate is the only thing
 * that changes what renders — which is what keeps Back, Forward and the
 * on-page controls from ever disagreeing about where the reader is.
 */

const PROJECT_PARAM = 'project';
const VIEW_PARAM = 'view';
const RESUME_VIEW = 'resume';

export type Route = { kind: 'index' } | { kind: 'project'; id: string } | { kind: 'resume' };

/** Whatever the URL names right now. Falls back to the index rather than 404ing. */
function readRoute(): Route {
  const params = new URLSearchParams(window.location.search);
  const id = params.get(PROJECT_PARAM);
  if (id && getProject(id)) return { kind: 'project', id };
  if (params.get(VIEW_PARAM) === RESUME_VIEW) return { kind: 'resume' };
  return { kind: 'index' };
}

/**
 * Built from the live URL so whatever path the site is served from is carried
 * along rather than reconstructed. The hash is dropped on purpose: these are
 * views, not anchors on the index.
 */
function hrefFor(route: Route): string {
  const url = new URL(window.location.href);
  url.searchParams.delete(PROJECT_PARAM);
  url.searchParams.delete(VIEW_PARAM);
  if (route.kind === 'project') url.searchParams.set(PROJECT_PARAM, route.id);
  if (route.kind === 'resume') url.searchParams.set(VIEW_PARAM, RESUME_VIEW);
  return `${url.pathname}${url.search}`;
}

/** True when this history entry is one we pushed, so there is one to unwind. */
function isOurEntry(): boolean {
  const state: unknown = window.history.state;
  return typeof state === 'object' && state !== null && 'view' in state;
}

export interface Router {
  route: Route;
  openProject: (id: string) => void;
  openResume: () => void;
  /** Return to the index from any view. */
  close: () => void;
}

export function useRoute(): Router {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onPopState = () => setRoute(readRoute());
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

  const push = useCallback((next: Route) => {
    window.history.pushState({ view: next.kind }, '', hrefFor(next));
    setRoute(next);
  }, []);

  const openProject = useCallback(
    (id: string) => {
      if (!getProject(id)) return;
      push({ kind: 'project', id });
    },
    [push]
  );

  const openResume = useCallback(() => push({ kind: 'resume' }), [push]);

  const close = useCallback(() => {
    // Unwind the entry that opening pushed, so the on-page control and Back
    // land in the same place instead of stacking a second entry. A reader who
    // arrived on a deep link has nothing to unwind, so rewrite this entry
    // rather than sending them off the site.
    if (isOurEntry()) {
      window.history.back();
      return;
    }
    window.history.replaceState(null, '', hrefFor({ kind: 'index' }));
    setRoute({ kind: 'index' });
  }, []);

  return { route, openProject, openResume, close };
}
