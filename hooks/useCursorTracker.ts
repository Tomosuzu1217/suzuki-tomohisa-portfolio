import { useEffect, useRef, RefObject } from 'react';

export function useCursorTracker(containerRef: RefObject<HTMLDivElement | null>) {
  const rafId = useRef(0);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--x', '50%');
      containerRef.current.style.setProperty('--y', '50%');
    }

    const updateMouse = (e: MouseEvent | TouchEvent) => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        let clientX: number, clientY: number;
        if ('touches' in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = (e as MouseEvent).clientX;
          clientY = (e as MouseEvent).clientY;
        }
        containerRef.current.style.setProperty('--x', `${clientX}px`);
        containerRef.current.style.setProperty('--y', `${clientY}px`);
      });
    };

    window.addEventListener('mousemove', updateMouse, { passive: true });
    window.addEventListener('touchmove', updateMouse, { passive: true });
    window.addEventListener('touchstart', updateMouse, { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', updateMouse);
      window.removeEventListener('touchmove', updateMouse);
      window.removeEventListener('touchstart', updateMouse);
    };
  }, [containerRef]);
}
