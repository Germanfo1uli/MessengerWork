import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Начальные настройки темы
    const defaultThemeSettings = {
        theme: 'dark',
        backgroundType: 'solid',
        customBackground: null,
        backgroundBlur: 0,
        backgroundOpacity: 0.8,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        panelAccentColor: '#6a5acd',
        panelFontSize: 16,
        panelFontFamily: 'default',
        panelSpacing: 'normal',
        panelAvatarShape: 'round',
        windowChatStyle: 'bubbles',
        windowAccentColor: '#6a5acd',
        windowFontSize: 16,
        windowFontFamily: 'default',
        messageCornerRadius: 12,
        messageShadow: true,
    };

    // Загружаем настройки из localStorage или используем значения по умолчанию
    const [themeSettings, setThemeSettings] = useState(() => {
        const savedSettings = localStorage.getItem('themeSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultThemeSettings;
    });

    const fontFamilies = [
        { id: 'default', name: 'Системный', value: 'system-ui' },
        { id: 'sans', name: 'Без засечек', value: '"Segoe UI", Roboto, sans-serif' },
        { id: 'serif', name: 'С засечками', value: 'Georgia, serif' },
        { id: 'mono', name: 'Моноширинный', value: 'Menlo, Consolas, monospace' },
    ];

    // Сохраняем настройки в localStorage при их изменении
    useEffect(() => {
        localStorage.setItem('themeSettings', JSON.stringify(themeSettings));
    }, [themeSettings]);

    const updateThemeSettings = (newSettings) => {
        setThemeSettings((prev) => ({ ...prev, ...newSettings }));
    };

    return (
        <ThemeContext.Provider value={{ themeSettings, updateThemeSettings, fontFamilies }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);