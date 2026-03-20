import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
    );

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        function handleChange(e) {
            setIsMobile(e.matches);
        }
        mql.addEventListener('change', handleChange);
        setIsMobile(mql.matches);
        return () => mql.removeEventListener('change', handleChange);
    }, [breakpoint]);

    return isMobile;
}
