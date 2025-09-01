import { useRef, useEffect, useCallback } from 'react';

export function useDebouncedCallback(callback: any, delay: number) {
    const timeoutRef = useRef<number | undefined>(undefined);

    const debouncedFn = useCallback(
        (...args: any) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    return debouncedFn;
}
