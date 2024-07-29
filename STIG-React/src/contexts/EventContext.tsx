import React, { createContext, useState, FC, useCallback, ReactNode } from 'react';

type EventContextType = {
    dispatchEvent: (eventName: string, payload?: any) => void;
    addEventListener: (eventName: string, listener: (payload?: any) => void) => void;
    removeEventListener: (eventName: string, listener: (payload?: any) => void) => void;
};

export const EventContext = createContext<EventContextType>({
    dispatchEvent: () => { },
    addEventListener: () => { },
    removeEventListener: () => { },
});

interface EventProviderProps {
    children: ReactNode;
}

export const EventProvider: FC<EventProviderProps> = ({ children }) => {
    const [listeners, setListeners] = useState<Map<string, Set<Function>>>(new Map());

    const dispatchEvent = useCallback((eventName: string, payload?: any) => {
        const eventListeners = listeners.get(eventName);
        eventListeners?.forEach(listener => listener(payload));
    }, [listeners]);

    const addEventListener = useCallback((eventName: string, listener: (payload?: any) => void) => {
        setListeners(prev => {
            const updated = new Map(prev);
            let eventListeners = updated.get(eventName);

            if (!eventListeners) {
                eventListeners = new Set<Function>();
                updated.set(eventName, eventListeners);
            }

            eventListeners.add(listener);

            return updated;
        });
    }, []);

    const removeEventListener = useCallback((eventName: string, listener: (payload?: any) => void) => {
        setListeners(prev => {
            const updated = new Map(prev);
            const eventListeners = updated.get(eventName);

            eventListeners?.delete(listener);

            if (eventListeners && eventListeners.size === 0) {
                updated.delete(eventName);
            }

            return updated;
        });
    }, []);

    return (
        <EventContext.Provider value={{ dispatchEvent, addEventListener, removeEventListener }}>
            {children}
        </EventContext.Provider>
    );
};