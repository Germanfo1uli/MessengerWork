import { useCallback } from "react";

const useMainHooks = () => {
    const getStatusString = useCallback((statusCode) => {
        switch(statusCode) {
            case 0: return 'offline';
            case 1: return 'online';
            case 2: return 'idle';
            case 3: return 'busy';
            default: return 'offline';
        }
    }, []);

    const formatTimeFromISO = useCallback((isoString) => {
        if (!isoString) return ""; // Проверяем на пустую строку, null, undefined и т. д.
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return ""; 
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }, []);

    return {
        getStatusString,
        formatTimeFromISO
    }
}

export default useMainHooks;