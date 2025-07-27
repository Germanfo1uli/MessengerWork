// src/JSX/SettingsPage/components/AppearanceSettings.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AppearanceSettings.module.css';
import ChatPanelPreview from './ChatPanelPreview';
import ChatWindowPreview from './ChatWindowPreview';
import GroupNavigationPreview from './GroupNavigationPreview';
import Sidebar from './Sidebar';
import { useTheme } from './ThemeContext';

const AppearanceSettings = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { themeSettings, updateThemeSettings, fontFamilies } = useTheme();

    // Инициализируем локальное состояние из контекста
    const [theme, setTheme] = useState(themeSettings.theme);
    const [backgroundType, setBackgroundType] = useState(themeSettings.backgroundType);
    const [customBackground, setCustomBackground] = useState(themeSettings.customBackground);
    const [backgroundBlur, setBackgroundBlur] = useState(themeSettings.backgroundBlur);
    const [backgroundOpacity, setBackgroundOpacity] = useState(themeSettings.backgroundOpacity);
    const [backgroundSize, setBackgroundSize] = useState(themeSettings.backgroundSize);
    const [backgroundPosition, setBackgroundPosition] = useState(themeSettings.backgroundPosition);
    const [panelAccentColor, setPanelAccentColor] = useState(themeSettings.panelAccentColor);
    const [panelFontSize, setPanelFontSize] = useState(themeSettings.panelFontSize);
    const [panelFontFamily, setPanelFontFamily] = useState(themeSettings.panelFontFamily);
    const [panelSpacing, setPanelSpacing] = useState(themeSettings.panelSpacing);
    const [panelAvatarShape, setPanelAvatarShape] = useState(themeSettings.panelAvatarShape);
    const [windowChatStyle, setWindowChatStyle] = useState(themeSettings.windowChatStyle);
    const [windowAccentColor, setWindowAccentColor] = useState(themeSettings.windowAccentColor);
    const [windowFontSize, setWindowFontSize] = useState(themeSettings.windowFontSize);
    const [windowFontFamily, setWindowFontFamily] = useState(themeSettings.windowFontFamily);
    const [messageCornerRadius, setMessageCornerRadius] = useState(themeSettings.messageCornerRadius);
    const [messageShadow, setMessageShadow] = useState(themeSettings.messageShadow);

    const themes = [
        { id: 'dark', name: 'Темная', preview: '#1e1e2d' },
        { id: 'light', name: 'Светлая', preview: '#f5f5f5' },
        { id: 'cosmic', name: 'Космическая', preview: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
        { id: 'sunset', name: 'Закат', preview: 'linear-gradient(135deg, #ff7e5f, #feb47b)' },
        { id: 'ocean', name: 'Океан', preview: 'linear-gradient(135deg, #00c6fb, #005bea)' },
        { id: 'forest', name: 'Лес', preview: 'linear-gradient(135deg, #11998e, #38ef7d)' },
    ];

    const backgroundTypes = [
        { id: 'solid', name: 'Сплошной цвет' },
        { id: 'gradient', name: 'Градиент' },
        { id: 'image', name: 'Изображение' },
        { id: 'pattern', name: 'Узор' },
    ];

    const backgroundSizes = [
        { id: 'cover', name: 'Растянуть' },
        { id: 'contain', name: 'Вместить' },
        { id: 'auto', name: 'Оригинал' },
        { id: '100%', name: '100%' },
        { id: '50%', name: '50%' },
    ];

    const backgroundPositions = [
        { id: 'left top', name: 'Лево Верх' },
        { id: 'center top', name: 'Центр Верх' },
        { id: 'right top', name: 'Право Верх' },
        { id: 'left center', name: 'Лево Центр' },
        { id: 'center center', name: 'Центр' },
        { id: 'right center', name: 'Право Центр' },
        { id: 'left bottom', name: 'Лево Низ' },
        { id: 'center bottom', name: 'Центр Низ' },
        { id: 'right bottom', name: 'Право Низ' },
    ];

    const chatStyles = [
        { id: 'bubbles', name: 'Пузыри' },
        { id: 'minimal', name: 'Минимализм' },
        { id: 'compact', name: 'Компактный' },
    ];

    const accentColors = [
        '#6a5acd', '#4b0082', '#ff6b6b', '#48dbfb',
        '#1dd1a1', '#feca57', '#ff9ff3', '#54a0ff', '#00d2d3'
    ];

    const fontSizes = [12, 14, 16, 18, 20, 22];

    const spacingOptions = [
        { id: 'compact', name: 'Компактный' },
        { id: 'normal', name: 'Обычный' },
        { id: 'spacious', name: 'Просторный' },
    ];

    const avatarShapes = [
        { id: 'round', name: 'Круглый' },
        { id: 'square', name: 'Квадратный' },
        { id: 'rounded-square', name: 'Скругленный' },
    ];

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleReset = () => {
        const defaultSettings = {
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

        setTheme(defaultSettings.theme);
        setBackgroundType(defaultSettings.backgroundType);
        setCustomBackground(defaultSettings.customBackground);
        setBackgroundBlur(defaultSettings.backgroundBlur);
        setBackgroundOpacity(defaultSettings.backgroundOpacity);
        setBackgroundSize(defaultSettings.backgroundSize);
        setBackgroundPosition(defaultSettings.backgroundPosition);
        setPanelAccentColor(defaultSettings.panelAccentColor);
        setPanelFontSize(defaultSettings.panelFontSize);
        setPanelFontFamily(defaultSettings.panelFontFamily);
        setPanelSpacing(defaultSettings.panelSpacing);
        setPanelAvatarShape(defaultSettings.panelAvatarShape);
        setWindowChatStyle(defaultSettings.windowChatStyle);
        setWindowAccentColor(defaultSettings.windowAccentColor);
        setWindowFontSize(defaultSettings.windowFontSize);
        setWindowFontFamily(defaultSettings.windowFontFamily);
        setMessageCornerRadius(defaultSettings.messageCornerRadius);
        setMessageShadow(defaultSettings.messageShadow);

        updateThemeSettings(defaultSettings);
    };

    const handleBackgroundUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.match('image.*')) {
            alert('Пожалуйста, выберите файл изображения (jpg, png, gif)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Размер файла не должен превышать 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setCustomBackground(event.target.result);
        };
        reader.onerror = () => {
            alert('Ошибка при чтении файла');
        };
        reader.readAsDataURL(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeCustomBackground = () => {
        setCustomBackground(null);
        setBackgroundBlur(0);
        setBackgroundOpacity(0.8);
        setBackgroundSize('cover');
        setBackgroundPosition('center');
    };

    const handleSave = () => {
        updateThemeSettings({
            theme,
            backgroundType,
            customBackground,
            backgroundBlur,
            backgroundOpacity,
            backgroundSize,
            backgroundPosition,
            panelAccentColor,
            panelFontSize,
            panelFontFamily,
            panelSpacing,
            panelAvatarShape,
            windowChatStyle,
            windowAccentColor,
            windowFontSize,
            windowFontFamily,
            messageCornerRadius,
            messageShadow,
        });
        navigate('/settings');
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
                        {/* General settings */}
                        <div className={`${styles.settingGroup} ${styles.withBorder}`}>
                            <h3>Общие настройки</h3>
                            <div className={styles.subSettingGroup}>
                                <h4>Цветовая тема</h4>
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
                            <div className={styles.subSettingGroup}>
                                <h4>Тип фона</h4>
                                <div className={styles.styleOptions}>
                                    {backgroundTypes.map((type) => (
                                        <div
                                            key={type.id}
                                            className={`${styles.styleOption} ${backgroundType === type.id ? styles.active : ''}`}
                                            onClick={() => setBackgroundType(type.id)}
                                        >
                                            {type.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {backgroundType === 'image' && (
                                <div className={styles.subSettingGroup}>
                                    <h4>Пользовательский фон</h4>
                                    <div className={styles.imageUploadContainer}>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleBackgroundUpload}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        {customBackground ? (
                                            <div className={styles.imagePreviewContainer}>
                                                <div
                                                    className={styles.imagePreview}
                                                    style={{
                                                        backgroundImage: `url(${customBackground})`,
                                                        backgroundSize: backgroundSize,
                                                        backgroundPosition: backgroundPosition,
                                                        filter: `blur(${backgroundBlur}px)`,
                                                        opacity: backgroundOpacity,
                                                    }}
                                                />
                                                <div className={styles.imageActions}>
                                                    <button
                                                        className={styles.changeImageButton}
                                                        onClick={triggerFileInput}
                                                    >
                                                        Изменить
                                                    </button>
                                                    <button
                                                        className={styles.removeImageButton}
                                                        onClick={removeCustomBackground}
                                                    >
                                                        Удалить
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className={styles.uploadPlaceholder}
                                                onClick={triggerFileInput}
                                            >
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="17 8 12 3 7 8"></polyline>
                                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                                </svg>
                                                <span>Загрузить изображение</span>
                                                <p className={styles.uploadHint}>JPG, PNG до 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                    {customBackground && (
                                        <>
                                            <div className={styles.rangeSetting}>
                                                <label>Размытие фона: {backgroundBlur}px</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="20"
                                                    value={backgroundBlur}
                                                    onChange={(e) => setBackgroundBlur(parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div className={styles.rangeSetting}>
                                                <label>Прозрачность: {Math.round(backgroundOpacity * 100)}%</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={backgroundOpacity * 100}
                                                    onChange={(e) => setBackgroundOpacity(parseInt(e.target.value) / 100)}
                                                />
                                            </div>
                                            <div className={styles.subSettingGroup}>
                                                <h4>Размер изображения</h4>
                                                <div className={styles.styleOptions}>
                                                    {backgroundSizes.map((size) => (
                                                        <div
                                                            key={size.id}
                                                            className={`${styles.styleOption} ${backgroundSize === size.id ? styles.active : ''}`}
                                                            onClick={() => setBackgroundSize(size.id)}
                                                        >
                                                            {size.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={styles.subSettingGroup}>
                                                <h4>Положение изображения</h4>
                                                <div className={styles.styleOptions}>
                                                    {backgroundPositions.map((pos) => (
                                                        <div
                                                            key={pos.id}
                                                            className={`${styles.styleOption} ${backgroundPosition === pos.id ? styles.active : ''}`}
                                                            onClick={() => setBackgroundPosition(pos.id)}
                                                        >
                                                            {pos.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ChatPanel settings */}
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
                            <div className={styles.subSettingGroup}>
                                <h4>Шрифт</h4>
                                <div className={styles.styleOptions}>
                                    {fontFamilies.map((font) => (
                                        <div
                                            key={`panel-font-${font.id}`}
                                            className={`${styles.styleOption} ${panelFontFamily === font.id ? styles.active : ''}`}
                                            onClick={() => setPanelFontFamily(font.id)}
                                            style={{ fontFamily: font.value }}
                                        >
                                            {font.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.subSettingGroup}>
                                <h4>Расстояние между элементами</h4>
                                <div className={styles.styleOptions}>
                                    {spacingOptions.map((spacing) => (
                                        <div
                                            key={`panel-spacing-${spacing.id}`}
                                            className={`${styles.styleOption} ${panelSpacing === spacing.id ? styles.active : ''}`}
                                            onClick={() => setPanelSpacing(spacing.id)}
                                        >
                                            {spacing.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.subSettingGroup}>
                                <h4>Форма аватаров</h4>
                                <div className={styles.avatarShapeOptions}>
                                    {avatarShapes.map((shape) => (
                                        <div
                                            key={`panel-avatar-${shape.id}`}
                                            className={`${styles.avatarShapeOption} ${panelAvatarShape === shape.id ? styles.active : ''}`}
                                            onClick={() => setPanelAvatarShape(shape.id)}
                                        >
                                            <div className={`${styles.avatarPreview} ${styles[shape.id]}`} />
                                            <span>{shape.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ChatWindow settings */}
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
                            <div className={styles.subSettingGroup}>
                                <h4>Шрифт</h4>
                                <div className={styles.styleOptions}>
                                    {fontFamilies.map((font) => (
                                        <div
                                            key={`window-font-${font.id}`}
                                            className={`${styles.styleOption} ${windowFontFamily === font.id ? styles.active : ''}`}
                                            onClick={() => setWindowFontFamily(font.id)}
                                            style={{ fontFamily: font.value }}
                                        >
                                            {font.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.subSettingGroup}>
                                <h4>Скругление сообщений</h4>
                                <div className={styles.rangeSetting}>
                                    <label>{messageCornerRadius}px</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="24"
                                        value={messageCornerRadius}
                                        onChange={(e) => setMessageCornerRadius(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className={styles.subSettingGroup}>
                                <h4>Тень сообщений</h4>
                                <label className={styles.checkboxOption}>
                                    <input
                                        type="checkbox"
                                        checked={messageShadow}
                                        onChange={(e) => setMessageShadow(e.target.checked)}
                                    />
                                    <span>Включить тень</span>
                                </label>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.resetButton} onClick={handleReset}>
                                Сбросить настройки
                            </button>
                            <button className={styles.saveButton} onClick={handleSave}>
                                Сохранить изменения
                            </button>
                        </div>
                    </div>

                    <div className={styles.previewPanel}>
                        <h3>Предпросмотр интерфейса</h3>
                        <div className={styles.previewWrapper}>
                            <div className={styles.interfacePreview}>
                                <div className={styles.groupNavigationPreview}>
                                    <GroupNavigationPreview
                                        theme={theme}
                                        avatarShape={panelAvatarShape}
                                    />
                                </div>
                                <div className={styles.chatPanelPreview}>
                                    <ChatPanelPreview
                                        theme={theme}
                                        accentColor={panelAccentColor}
                                        fontSize={panelFontSize}
                                        fontFamily={fontFamilies.find((f) => f.id === panelFontFamily)?.value}
                                        spacing={panelSpacing}
                                        avatarShape={panelAvatarShape}
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
                                    fontFamily={fontFamilies.find((f) => f.id === windowFontFamily)?.value}
                                    cornerRadius={messageCornerRadius}
                                    showShadow={messageShadow}
                                    customBackground={backgroundType === 'image' ? customBackground : null}
                                    backgroundBlur={backgroundBlur}
                                    backgroundOpacity={backgroundOpacity}
                                    backgroundSize={backgroundType === 'image' ? backgroundSize : 'cover'}
                                    backgroundPosition={backgroundType === 'image' ? backgroundPosition : 'center'}
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