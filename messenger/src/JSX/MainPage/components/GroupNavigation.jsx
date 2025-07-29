import React, { useState } from 'react';
import styles from '../styles/GroupNavigation.module.css';
import { useTheme } from '../../SettingsPage/components/Context/ThemeContext';

const GroupNavigation = () => {
    const [tooltip, setTooltip] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('create');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        theme: 'exploration',
        agreement: false,
        inviteLink: ''
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const { themeSettings } = useTheme();
    const { theme } = themeSettings;

    const groups = [
        { avatar: 'https://avatars.mds.yandex.net/i?id=3a060b00307ec724a511c4e2d8f503bc_l-4120702-images-thumbs&n=13', name: 'Исследования космоса и технологий', id: 'group1' },
        { avatar: 'https://avatars.mds.yandex.net/i?id=3a060b00307ec724a511c4e2d8f503bc_l-4120702-images-thumbs&n=13', name: 'Экипаж звездолета', id: 'group2' },
        { avatar: 'https://avatars.mds.yandex.net/i?id=3a060b00307ec724a511c4e2d8f503bc_l-4120702-images-thumbs&n=13', name: 'Флот межгалактический', id: 'group3' }
    ];

    const getThemeStyles = () => {
        switch (theme) {
            case 'cosmic':
                return {
                    navBg: 'rgba(15, 12, 41, 0.95)',
                    navBorder: 'rgba(255, 176, 255, 0.2)',
                    modalBg: 'rgba(15, 12, 41, 0.95)',
                    modalBorder: 'rgba(255, 176, 255, 0.2)',
                    textColor: '#e0e0ff',
                    secondaryText: '#b0b0ff',
                    accentColor: '#8a2be2',
                    buttonHover: '#ff6f91',
                    tooltipBg: 'rgba(15, 12, 41, 0.9)',
                    inputBg: 'rgba(255, 255, 255, 0.08)',
                    inputBorder: 'rgba(74, 20, 140, 0.5)'
                };
            case 'sunset':
                return {
                    navBg: 'rgba(254, 180, 123, 0.95)',
                    navBorder: 'rgba(255, 126, 95, 0.3)',
                    modalBg: 'rgba(254, 180, 123, 0.95)',
                    modalBorder: 'rgba(255, 126, 95, 0.2)',
                    textColor: '#5a2c0a',
                    secondaryText: '#7a4c2a',
                    accentColor: '#ff7e5f',
                    buttonHover: '#feb47b',
                    tooltipBg: 'rgba(254, 180, 123, 0.9)',
                    inputBg: 'rgba(255, 255, 255, 0.15)',
                    inputBorder: 'rgba(255, 126, 95, 0.5)'
                };
            case 'ocean':
                return {
                    navBg: 'rgba(0, 93, 234, 0.95)',
                    navBorder: 'rgba(0, 198, 251, 0.3)',
                    modalBg: 'rgba(0, 93, 234, 0.95)',
                    modalBorder: 'rgba(0, 198, 251, 0.2)',
                    textColor: '#e0f7ff',
                    secondaryText: '#b0e7ff',
                    accentColor: '#00c6fb',
                    buttonHover: '#005bea',
                    tooltipBg: 'rgba(0, 93, 234, 0.9)',
                    inputBg: 'rgba(255, 255, 255, 0.15)',
                    inputBorder: 'rgba(0, 198, 251, 0.5)'
                };
            case 'forest':
                return {
                    navBg: 'rgba(17, 153, 142, 0.95)',
                    navBorder: 'rgba(56, 239, 125, 0.3)',
                    modalBg: 'rgba(17, 153, 142, 0.95)',
                    modalBorder: 'rgba(56, 239, 125, 0.2)',
                    textColor: '#e0fff5',
                    secondaryText: '#b0ffea',
                    accentColor: '#11998e',
                    buttonHover: '#38ef7d',
                    tooltipBg: 'rgba(17, 153, 142, 0.9)',
                    inputBg: 'rgba(255, 255, 255, 0.15)',
                    inputBorder: 'rgba(56, 239, 125, 0.5)'
                };
            case 'light':
                return {
                    navBg: 'rgba(240, 240, 240, 0.95)',
                    navBorder: 'rgba(160, 160, 160, 0.2)',
                    modalBg: 'rgba(240, 240, 240, 0.95)',
                    modalBorder: 'rgba(160, 160, 160, 0.2)',
                    textColor: '#333333',
                    secondaryText: '#666666',
                    accentColor: '#4b83f8',
                    buttonHover: '#6ba3ff',
                    tooltipBg: 'rgba(240, 240, 240, 0.9)',
                    inputBg: 'rgba(255, 255, 255, 0.05)',
                    inputBorder: 'rgba(160, 160, 160, 0.3)'
                };
            default:
                return {
                    navBg: 'rgba(15, 12, 41, 0.95)',
                    navBorder: 'rgba(255, 176, 255, 0.2)',
                    modalBg: 'rgba(15, 12, 41, 0.95)',
                    modalBorder: 'rgba(255, 176, 255, 0.2)',
                    textColor: '#e0e0ff',
                    secondaryText: '#b0b0ff',
                    accentColor: '#8a2be2',
                    buttonHover: '#ff6f91',
                    tooltipBg: 'rgba(15, 12, 41, 0.9)',
                    inputBg: 'rgba(255, 255, 255, 0.08)',
                    inputBorder: 'rgba(74, 20, 140, 0.5)'
                };
        }
    };

    const themeStyles = getThemeStyles();

    const truncateName = (name) => {
        const maxLength = 15;
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

    const handleAddGroup = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFormData({
            name: '',
            description: '',
            theme: 'exploration',
            agreement: false,
            inviteLink: ''
        });
        setAvatarPreview(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        handleCloseModal();
    };

    return (
        <>
            <nav
                className={styles.navPanel}
                style={{
                    background: themeStyles.navBg,
                    borderRight: `1px solid ${themeStyles.navBorder}`
                }}
            >
                <button
                    className={styles.homeButton}
                    onClick={() => window.location.href = '/home'}
                    style={{ color: themeStyles.textColor }}
                >
                    <svg width="24" height="24" fill={themeStyles.textColor} viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                </button>
                <div
                    className={styles.separator}
                    style={{ background: themeStyles.secondaryText }}
                ></div>
                <div className={styles.groupList}>
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className={styles.groupItem}
                            onMouseEnter={() => setTooltip(group.name)}
                            onMouseLeave={() => setTooltip('')}
                            onClick={() => setSelectedGroup(group.id)}
                        >
                            <div
                                className={`${styles.avatarWrapper} ${selectedGroup === group.id ? styles.selected : ''}`}
                                style={{
                                    boxShadow: selectedGroup === group.id ?
                                        `0 0 10px ${themeStyles.accentColor}` : 'none'
                                }}
                            >
                                <img src={group.avatar} alt={group.name} className={styles.avatar} />
                            </div>
                            {tooltip === group.name && (
                                <span
                                    className={styles.tooltip}
                                    style={{
                                        background: themeStyles.tooltipBg,
                                        color: themeStyles.textColor,
                                        border: `1px solid ${themeStyles.navBorder}`
                                    }}
                                >
                                    {truncateName(group.name)}
                                </span>
                            )}
                        </div>
                    ))}

                    <div
                        className={styles.addGroupButton}
                        onMouseEnter={() => setTooltip('Новая группа')}
                        onMouseLeave={() => setTooltip('')}
                        onClick={handleAddGroup}
                    >
                        <div
                            className={styles.avatarWrapper}
                            style={{
                                background: themeStyles.inputBg,
                                border: `1px dashed ${themeStyles.accentColor}`
                            }}
                        >
                            <div className={styles.plusIcon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill={themeStyles.textColor}>
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                            </div>
                        </div>
                        {tooltip === 'Новая группа' && (
                            <span
                                className={styles.tooltip}
                                style={{
                                    background: themeStyles.tooltipBg,
                                    color: themeStyles.textColor,
                                    border: `1px solid ${themeStyles.navBorder}`
                                }}
                            >
                                Новая группа
                            </span>
                        )}
                    </div>
                </div>
            </nav>

            {modalOpen && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div
                        className={styles.modal}
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: themeStyles.modalBg,
                            border: `1px solid ${themeStyles.modalBorder}`
                        }}
                    >
                        <button
                            className={styles.closeButton}
                            onClick={handleCloseModal}
                            style={{
                                background: themeStyles.inputBg,
                                color: themeStyles.textColor
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={themeStyles.textColor}>
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>

                        <div className={styles.modalHeader}>
                            <h2
                                className={styles.modalTitle}
                                style={{ color: themeStyles.textColor }}
                            >
                                {activeTab === 'create' ? 'Создайте свой сервер' : 'Присоединитесь к серверу'}
                            </h2>
                            <p
                                className={styles.modalDescription}
                                style={{ color: themeStyles.secondaryText }}
                            >
                                {activeTab === 'create'
                                    ? 'Объединяйтесь с единомышленниками для обсуждения космоса и технологий!'
                                    : 'Найдите сообщество по интересам и станьте его частью!'}
                            </p>
                            <div
                                className={styles.tabs}
                                style={{ background: themeStyles.inputBg }}
                            >
                                <button
                                    className={`${styles.tabButton} ${activeTab === 'create' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('create')}
                                    style={{
                                        color: activeTab === 'create' ? '#fff' : themeStyles.secondaryText,
                                        background: activeTab === 'create' ?
                                            `linear-gradient(135deg, ${themeStyles.accentColor}, ${themeStyles.buttonHover})` : 'transparent'
                                    }}
                                >
                                    Создать группу
                                </button>
                                <button
                                    className={`${styles.tabButton} ${activeTab === 'join' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('join')}
                                    style={{
                                        color: activeTab === 'join' ? '#fff' : themeStyles.secondaryText,
                                        background: activeTab === 'join' ?
                                            `linear-gradient(135deg, ${themeStyles.accentColor}, ${themeStyles.buttonHover})` : 'transparent'
                                    }}
                                >
                                    Вступить в группу
                                </button>
                            </div>
                        </div>

                        <div className={styles.modalContent}>
                            {activeTab === 'create' ? (
                                <form onSubmit={handleSubmit} className={styles.createForm}>
                                    <div className={styles.avatarUpload}>
                                        <label className={styles.uploadLabel}>
                                            {avatarPreview ? (
                                                <div
                                                    className={styles.avatarPreviewContainer}
                                                    style={{ border: `2px solid ${themeStyles.accentColor}` }}
                                                >
                                                    <img src={avatarPreview} alt="Аватар группы" className={styles.avatarPreview} />
                                                    <div
                                                        className={styles.avatarOverlay}
                                                        style={{ background: `rgba(0, 0, 0, 0.5)` }}
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className={styles.uploadPlaceholder}
                                                    style={{
                                                        background: themeStyles.inputBg,
                                                        border: `2px dashed ${themeStyles.accentColor}`,
                                                        color: themeStyles.secondaryText
                                                    }}
                                                >
                                                    <svg width="36" height="36" viewBox="0 0 24 24" fill={themeStyles.secondaryText}>
                                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                                    </svg>
                                                    <span className={styles.uploadText}>Загрузить логотип</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className={styles.uploadInput}
                                            />
                                        </label>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="name" style={{ color: themeStyles.secondaryText }}>Название группы</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Введите название группы"
                                            required
                                            style={{
                                                background: themeStyles.inputBg,
                                                border: `1px solid ${themeStyles.inputBorder}`,
                                                color: themeStyles.textColor
                                            }}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="description" style={{ color: themeStyles.secondaryText }}>Описание</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Опишите тематику вашей группы"
                                            rows="3"
                                            style={{
                                                background: themeStyles.inputBg,
                                                border: `1px solid ${themeStyles.inputBorder}`,
                                                color: themeStyles.textColor
                                            }}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="theme" style={{ color: themeStyles.secondaryText }}>Тематика группы</label>
                                        <select
                                            id="theme"
                                            name="theme"
                                            value={formData.theme}
                                            onChange={handleInputChange}
                                            style={{
                                                background: themeStyles.inputBg,
                                                border: `1px solid ${themeStyles.inputBorder}`,
                                                color: themeStyles.textColor,
                                                backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22${encodeURIComponent(themeStyles.secondaryText)}%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')`
                                            }}
                                        >
                                            <option value="exploration">Космические исследования</option>
                                            <option value="science">Астрономия</option>
                                            <option value="fiction">Научная фантастика</option>
                                            <option value="technology">Космические технологии</option>
                                            <option value="community">Космическое сообщество</option>
                                        </select>
                                    </div>

                                    <div className={styles.agreement}>
                                        <input
                                            type="checkbox"
                                            id="agreement"
                                            name="agreement"
                                            checked={formData.agreement}
                                            onChange={handleInputChange}
                                            required
                                            style={{ accentColor: themeStyles.accentColor }}
                                        />
                                        <label htmlFor="agreement" style={{ color: themeStyles.secondaryText }}>
                                            Я согласен с <a href="#" className={styles.termsLink} style={{ color: themeStyles.accentColor }}>Условиями группы</a> и <a href="#" className={styles.termsLink} style={{ color: themeStyles.accentColor }}>Правилами сообщества</a>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        style={{
                                            background: `linear-gradient(135deg, ${themeStyles.accentColor}, ${themeStyles.buttonHover})`,
                                            boxShadow: `0 4px 15px ${themeStyles.accentColor}33`
                                        }}
                                    >
                                        Создать группу
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmit} className={styles.joinForm}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="inviteLink" style={{ color: themeStyles.secondaryText }}>Ссылка-приглашение</label>
                                        <input
                                            type="text"
                                            id="inviteLink"
                                            name="inviteLink"
                                            value={formData.inviteLink}
                                            onChange={handleInputChange}
                                            placeholder="https://cosmiclink.space/join/abc123xyz"
                                            required
                                            style={{
                                                background: themeStyles.inputBg,
                                                border: `1px solid ${themeStyles.inputBorder}`,
                                                color: themeStyles.textColor
                                            }}
                                        />
                                    </div>

                                    <div
                                        className={styles.example}
                                        style={{
                                            background: themeStyles.inputBg,
                                            color: themeStyles.secondaryText
                                        }}
                                    >
                                        <p style={{ color: themeStyles.textColor }}>Пример корректной ссылки:</p>
                                        <code style={{ color: themeStyles.accentColor }}>
                                            https://cosmiclink.space/join/abc123xyz
                                        </code>
                                    </div>

                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        style={{
                                            background: `linear-gradient(135deg, ${themeStyles.accentColor}, ${themeStyles.buttonHover})`,
                                            boxShadow: `0 4px 15px ${themeStyles.accentColor}33`
                                        }}
                                    >
                                        Вступить в группу
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GroupNavigation;