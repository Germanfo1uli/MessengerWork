import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AppearanceSettings.module.css';
import ChatPanelPreview from './ChatPanelPreview';
import ChatWindowPreview from './ChatWindowPreview';
import GroupNavigationPreview from './GroupNavigationPreview';
import Sidebar from './Sidebar';

const AppearanceSettings = () => {
    const navigate = useNavigate();

    // Общие настройки
    const [theme, setTheme] = useState('dark');

    // Настройки для ChatPanel
    const [panelAccentColor, setPanelAccentColor] = useState('#6a5acd');
    const [panelFontSize, setPanelFontSize] = useState(16);

    // Настройки для ChatWindow
    const [windowChatStyle, setWindowChatStyle] = useState('bubbles');
    const [windowAccentColor, setWindowAccentColor] = useState('#6a5acd');
    const [windowFontSize, setWindowFontSize] = useState(16);

    const themes = [
        { id: 'dark', name: 'Темная', preview: '#1e1e2d' },
        { id: 'light', name: 'Светлая', preview: '#f5f5f5' },
        { id: 'cosmic', name: 'Космическая', preview: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
    ];

    const chatStyles = [
        { id: 'bubbles', name: 'Пузыри' },
        { id: 'minimal', name: 'Минимализм' },
        { id: 'compact', name: 'Компактный' },
    ];

    const accentColors = [
        '#6a5acd', // slateblue
        '#4b0082', // indigo
        '#ff6b6b', // coral
        '#48dbfb', // neon blue
        '#1dd1a1', // aqua
        '#feca57', // yellow
    ];

    const fontSizes = [12, 14, 16, 18, 20];

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleReset = () => {
        setTheme('dark');
        setPanelAccentColor('#6a5acd');
        setPanelFontSize(16);
        setWindowChatStyle('bubbles');
        setWindowAccentColor('#6a5acd');
        setWindowFontSize(16);
    };

    return (
        <div className={styles.pageContainer}>
            <Sidebar />

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1>Настройки внешнего вида</h1>
                    <p>Персонализируйте интерфейс под свой вкус</p>
                </div>

                <div className={styles.settingsContainer}>
                    <div className={styles.settingsPanel}>
                        {/* Общие настройки */}
                        <div className={`${styles.settingGroup} ${styles.withBorder}`}>
                            <h3>Цветовая тема</h3>
                            <div className={styles.themeOptions}>
                                {themes.map((t) => (
                                    <div
                                        key={t.id}
                                        className={`${styles.themeOption} ${theme === t.id ? styles.active : ''}`}
                                        onClick={() => setTheme(t.id)}
                                    >
                                        <div
                                            className={styles.themePreview}
                                            style={{ background: t.preview }}
                                        />
                                        <span>{t.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Настройки панели чатов */}
                        <div className={`${styles.settingGroup} ${styles.withBorder}`}>
                            <h3>Панель чатов</h3>

                            <div className={styles.subSettingGroup}>
                                <h4>Акцентный цвет</h4>
                                <div className={styles.colorOptions}>
                                    {accentColors.map((color) => (
                                        <div
                                            key={`panel-${color}`}
                                            className={`${styles.colorOption} ${panelAccentColor === color ? styles.active : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setPanelAccentColor(color)}
                                        />
                                    ))}
                                    <div className={styles.customColor}>
                                        <input
                                            type="color"
                                            value={panelAccentColor}
                                            onChange={(e) => setPanelAccentColor(e.target.value)}
                                        />
                                        <span>Свой цвет</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.subSettingGroup}>
                                <h4>Размер текста</h4>
                                <div className={styles.fontSizeOptions}>
                                    {fontSizes.map((size) => (
                                        <div
                                            key={`panel-size-${size}`}
                                            className={`${styles.fontSizeOption} ${panelFontSize === size ? styles.active : ''}`}
                                            onClick={() => setPanelFontSize(size)}
                                        >
                                            {size}px
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Настройки окна чата */}
                        <div className={styles.settingGroup}>
                            <h3>Окно чата</h3>

                            <div className={styles.subSettingGroup}>
                                <h4>Стиль сообщений</h4>
                                <div className={styles.styleOptions}>
                                    {chatStyles.map((style) => (
                                        <div
                                            key={style.id}
                                            className={`${styles.styleOption} ${windowChatStyle === style.id ? styles.active : ''}`}
                                            onClick={() => setWindowChatStyle(style.id)}
                                        >
                                            {style.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.subSettingGroup}>
                                <h4>Акцентный цвет</h4>
                                <div className={styles.colorOptions}>
                                    {accentColors.map((color) => (
                                        <div
                                            key={`window-${color}`}
                                            className={`${styles.colorOption} ${windowAccentColor === color ? styles.active : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setWindowAccentColor(color)}
                                        />
                                    ))}
                                    <div className={styles.customColor}>
                                        <input
                                            type="color"
                                            value={windowAccentColor}
                                            onChange={(e) => setWindowAccentColor(e.target.value)}
                                        />
                                        <span>Свой цвет</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.subSettingGroup}>
                                <h4>Размер текста</h4>
                                <div className={styles.fontSizeOptions}>
                                    {fontSizes.map((size) => (
                                        <div
                                            key={`window-size-${size}`}
                                            className={`${styles.fontSizeOption} ${windowFontSize === size ? styles.active : ''}`}
                                            onClick={() => setWindowFontSize(size)}
                                        >
                                            {size}px
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.resetButton} onClick={handleReset}>
                                Сбросить настройки
                            </button>
                            <button className={styles.saveButton} onClick={() => navigate('/settings')}>
                                Сохранить изменения
                            </button>
                        </div>
                    </div>

                    <div className={styles.previewPanel}>
                        <h3>Предпросмотр интерфейса</h3>
                        <div className={styles.previewWrapper}>
                            <div className={styles.interfacePreview}>
                                <div className={styles.groupNavigationPreview}>
                                    <GroupNavigationPreview theme={theme} />
                                </div>
                                <div className={styles.chatPanelPreview}>
                                    <ChatPanelPreview
                                        theme={theme}
                                        accentColor={panelAccentColor}
                                        fontSize={panelFontSize}
                                    />
                                </div>
                            </div>

                            <h3 className={styles.previewSubtitle}>Предпросмотр окна чата</h3>
                            <div className={styles.chatWindowPreviewContainer}>
                                <ChatWindowPreview
                                    theme={theme}
                                    chatStyle={windowChatStyle}
                                    accentColor={windowAccentColor}
                                    fontSize={windowFontSize}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppearanceSettings;