import { useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? (JSON.parse(raw) as T) : initial;
        } catch {
            return initial;
        }
    });

    const isUpdater = (v: T | ((prev: T) => T)): v is (prev: T) => T => typeof v === 'function';

    const set = (next: T | ((prev: T) => T)) => {
        setValue((prev) => {
            const resolved = isUpdater(next) ? next(prev) : next;
            try {
                localStorage.setItem(key, JSON.stringify(resolved));
            } catch {
                // Throws in private browsing (Safari/Firefox), when quota exceeded, or when disabled
            }
            return resolved;
        });
    };

    return [value, set] as const;
}
