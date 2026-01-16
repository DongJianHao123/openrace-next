'use client'
import { useEffect, useState } from "react";

const useWindow = () => {
    const [location, setLocation] = useState<Location>({} as Location);
    const [localStorage, setLocalStorage] = useState<Storage>({} as Storage);
    const [history, setHistory] = useState<History>({} as History);

    useEffect(() => {
        setLocation(window.location);
        setLocalStorage(window.localStorage);
        setHistory(window.history);
    }, []);

    return {
        location,
        localStorage,
        history,
    };
}

export default useWindow;
