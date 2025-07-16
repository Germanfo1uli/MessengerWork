import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { apiRequest } from "../../../hooks/ApiRequest.js";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const useAuthProvider = () => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        userId: null,
        username: null,
        token: null,
        expires: null,
        isLoading: true
    });

    const decodeToken = useCallback((token) => {
        try {
            const decoded = jwtDecode(token);
            return {
                userId: decoded.sub,
                username: decoded.username || 'Пользователь',
                expiresAt: decoded.exp * 1000 // Конвертируем в мс
            };
        } catch (error) {
            console.error('Token decoding failed:', error);
            return null;
        }
    }, []);

    const login = useCallback((token, refreshToken) => {
        const decoded = decodeToken(token);
        if (!decoded) return;

        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);

        setAuth({
            isAuthenticated: true,
            userId: decoded.userId,
            username: decoded.username,
            token,
            expiresAt: decoded.expiresAt,
            isLoading: false
        });
    }, [decodeToken]);

    // Очищает данные аутентификации
    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        
        setAuth({
            isAuthenticated: false,
            userId: null,
            username: null,
            token: null,
            expiresAt: null,
            isLoading: false
        });
    }, []);

    const refreshTokens = useCallback(async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            logout();
            return null;
        }

        try {
            const response = await apiRequest('/api/token/refresh', {
                method: 'POST',
                body: { refreshToken }
            });

            if (!response.tokenValue || !response.clientSecret) {
                throw new Error('Invalid refresh response');
            }

            login(response.tokenValue, response.clientSecret);
            return response.tokenValue;
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            return null;
        }
    }, [login, logout]);

    const checkTokenExpiration = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const decoded = decodeToken(token);
            const timeLeft = decoded.exp - Date.now();

            // Обновляем токен если осталось меньше 1 минуты
            if (timeLeft < 60000) {
                return await refreshTokens();
            }

            return token;
        } catch (error) {
            console.error('Token validation failed:', error);
            logout();
            return null;
        }
    }, [decodeToken, refreshTokens, logout]);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setAuth(prev => ({ ...prev, isLoading: false }));
                return;
            }

            const validToken = await checkTokenExpiration();
            if (!validToken) return;

            const decoded = decodeToken(validToken);
            if (!decoded) {
                logout();
                return;
            }

            setAuth({
                isAuthenticated: true,
                userId: decoded.userId,
                username: decoded.username,
                token: validToken,
                expires: decoded.exp,
                isLoading: false
            });
        };

        initializeAuth();
    }, [checkTokenExpiration, decodeToken, logout]);
    useEffect(() => {
        if (!auth.token || !auth.exp) return;

        const checkInterval = setInterval(() => {
            checkTokenExpiration();
        }, 30000); // Проверяем каждые 30 секунд

        return () => clearInterval(checkInterval);
    }, [auth.token, auth.exp, checkTokenExpiration]);

    return { 
        ...auth,
        login,
        logout,
        refreshTokens
    };
};

export const AuthProvider = ({ children }) => {
    const auth = useAuthProvider();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};