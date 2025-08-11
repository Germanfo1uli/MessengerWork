import { useCallback } from "react";

const useMainHooks = () => {
    const getStatusString = useCallback((statusCode) => {
        switch(statusCode) {
            case 0: return 'Offline';
            case 1: return 'Online';
            case 2: return 'Idle';
            case 3: return 'Busy';
            default: return 'Offline';
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
        formatTimeFromISO,
        
    }
}

export default useMainHooks;