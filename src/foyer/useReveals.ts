import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Page chrome, not colony: reveals [data-reveal] elements as they scroll in.
 * Re-runs whenever `key` changes so a newly mounted view gets observed.
 */
export function useReveals(rootRef: RefObject<HTMLElement | null>, key: unknown) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const show = (el: HTMLElement) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(show);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target as HTMLElement);
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    const safety = window.setTimeout(() => els.forEach(show), 3500);
    return () => {
      obs.disconnect();
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
