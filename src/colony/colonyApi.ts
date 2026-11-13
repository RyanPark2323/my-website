/**
 * The colony's public surface.
 *
 * Kept separate from the provider component so that the context and hook are
 * not re-exported from a module that also exports a component — which breaks
 * fast refresh and, worse, can remount the provider in development. The one
 * thing the colony must never do is restart.
 */

import { createContext, useContext, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';

export interface ColonyApi {
  /** The hero attaches this to the element that should receive field gestures. */
  heroRef: RefObject<HTMLElement | null>;
  onPointerDown: (e: ReactPointerEvent) => void;
  onPointerMove: (e: ReactPointerEvent) => void;
  onPointerLeave: () => void;
  /** Which verb the current target will produce. */
  cursor: 'crosshair' | 'pointer';
  /** Keyboard-accessible equivalent of clicking the field. */
  addSourceAtCentre: () => void;
  toastRef: RefObject<HTMLDivElement | null>;
  hintRef: RefObject<HTMLButtonElement | null>;
  /**
   * Hide or show every instrument layer — the rail, the explainer and the
   * annotations — without stopping the colony. A view that is not the field
   * calls this with true; the field is still live behind it.
   */
  setInstrumentsHidden: (hidden: boolean) => void;
}

const Ctx = createContext<ColonyApi | null>(null);

export const ColonyContext = Ctx;

export function useColony(): ColonyApi {
  const api = useContext(Ctx);
  if (!api) throw new Error('useColony must be used inside <ColonyProvider>');
  return api;
}
