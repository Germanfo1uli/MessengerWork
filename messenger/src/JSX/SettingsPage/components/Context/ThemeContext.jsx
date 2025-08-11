import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const defaultThemeSettings = {
        backgroundColor: '#071332',
        avatarBorderColor: '#4d79f6',
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

    useEffect(() => {
        localStorage.setItem('themeSettings', JSON.stringify(themeSettings));
    }, [themeSettings]);

    const updateThemeSettings = (newSettings) => {
        setThemeSettings(prev => ({
            ...prev,
            ...newSettings
        }));
    };

    const getThemeStyles = () => ({
        bannerBg: themeSettings.backgroundColor,
        bannerBorder: '1px solid rgba(90, 150, 255, 0.3)',
        textColor: '#e0e0ff',
        secondaryText: '#b0b0ff',
        accentColor: '#6a5acd',
        buttonHover: '#7b68ee',
        inputBg: 'rgba(40, 40, 80, 0.7)',
        inputBorder: 'rgba(90, 150, 255, 0.5)',
        avatarBorder: themeSettings.avatarBorderColor,
        statusOnline: '#00ff9d',
        statusOffline: '#7b68ee',
        giftCardBg: 'rgba(30, 30, 70, 0.7)',
        giftCardBorder: 'rgba(90, 150, 255, 0.3)',
        giftCardHover: 'rgba(90, 150, 255, 0.15)',
        modalBg: themeSettings.backgroundColor,
        modalOverlay: 'rgba(10, 10, 30, 0.9)'
    });

    return (
        <ThemeContext.Provider value={{
            themeSettings,
            updateThemeSettings,
            getThemeStyles,
            fontFamilies
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);