import { useState, useEffect } from 'react';

export type Orientation = 'portrait' | 'landscape';

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    if (typeof window === 'undefined') return 'portrait';
    return window.matchMedia('(orientation: landscape)').matches ? 'landscape' : 'portrait';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(orientation: landscape)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setOrientation(e.matches ? 'landscape' : 'portrait');
    };

    mediaQuery.addEventListener('change', handleChange);
    
    const handleResize = () => {
      setOrientation(mediaQuery.matches ? 'landscape' : 'portrait');
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return orientation;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Use the smaller dimension to detect mobile - works in both orientations
    const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    return smallerDimension < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
      setIsMobile(smallerDimension < 768);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return isMobile;
}
