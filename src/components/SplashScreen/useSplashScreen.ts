import { useEffect, useState } from 'react';

export const SPLASH_DURATION_MS = 900;

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useSplashScreen = () => {
  const [isVisible, setIsVisible] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsVisible(false);
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isVisible]);

  return { isVisible };
};
