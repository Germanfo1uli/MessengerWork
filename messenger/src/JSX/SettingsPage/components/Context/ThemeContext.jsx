// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [themeSettings, setThemeSettings] = useState({
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
    });

    const fontFamilies = [
        { id: 'default', name: 'Системный', value: 'system-ui' },
        { id: 'sans', name: 'Без засечек', value: '"Segoe UI", Roboto, sans-serif' },
        { id: 'serif', name: 'С засечками', value: 'Georgia, serif' },
        { id: 'mono', name: 'Моноширинный', value: 'Menlo, Consolas, monospace' },
    ];

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