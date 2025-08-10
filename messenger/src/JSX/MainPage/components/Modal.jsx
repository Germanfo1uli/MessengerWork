import React, { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaCircle, FaRegCircle, FaRocket, FaCopy, FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoMdPlanet } from 'react-icons/io';
import styles from '../styles/Modal.module.css';
import { useUser } from '../../SettingsPage/components/Context/UserContext';
import { useTheme } from '../../SettingsPage/components/Context/ThemeContext';

const Modal = ({ isOpen, onClose }) => {
    const { user } = useUser();
    const { getThemeStyles } = useTheme();
    const [isStatusHidden, setIsStatusHidden] = useState(false);
    const [copied, setCopied] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

    const themeStyles = getThemeStyles();

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => (document.body.style.overflow = 'unset');
    }, [isOpen]);

    const copyTag = () => {
        navigator.clipboard.writeText(user.tag || '#0000');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleStatusVisibility = () => {
        setIsStatusHidden(!isStatusHidden);
    };

    const handleAvatarError = () => {
        setAvatarError(true);
    };

    if (!isOpen) return null;

    const getAvatarContent = () => {
        if (avatarError || !user.avatarUrl) {
            return (
                <div
                    className={styles.avatarPlaceholder}
                    style={{
                        background: `linear-gradient(135deg, ${themeStyles.accentColor}, ${themeStyles.buttonHover})`,
                        color: themeStyles.textColor,
                        border: `2px solid ${user.avatarBorderColor || '#4d79f6'}`
                    }}
                >
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
            );
        }
        return (
            <img
                src={user.avatarUrl}
                alt="Аватар"
                className={styles.avatar}
                onError={handleAvatarError}
            />
        );
    };

    return (
        <div
            className={styles.overlay}
            onClick={onClose}
            style={{ background: themeStyles.modalOverlay }}
        >
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                style={{ background: themeStyles.modalBg }}
            >
                <div
                    className={styles.banner}
                    style={{
                        background: user.banner.type === 'image'
                            ? `url(${user.banner.value}) center/cover`
                            : user.banner.value || themeStyles.bannerBg,
                        border: themeStyles.bannerBorder
                    }}
                >
                    <div className={styles.stars}></div>
                    <IoMdPlanet className={styles.planetIcon} />
                </div>

                <div
                    className={styles.avatarWrapper}
                    style={{ border: `3px solid ${user.avatarBorderColor || '#4d79f6'}` }}
                >
                    {getAvatarContent()}
                    {!isStatusHidden ? (
                        <FaCircle
                            className={styles.statusOnline}
                            style={{ color: themeStyles.statusOnline }}
                        />
                    ) : (
                        <FaRegCircle
                            className={styles.statusOffline}
                            style={{ color: themeStyles.statusOffline }}
                        />
                    )}
                    <div
                        className={styles.avatarGlow}
                        style={{ background: `radial-gradient(circle at center, ${themeStyles.accentColor}20, transparent 70%)` }}
                    ></div>
                </div>

                <div className={styles.userInfo}>
                    <h2
                        className={styles.username2}
                        style={{ color: themeStyles.textColor }}
                    >
                        {user.username || 'armisaelb'}
                    </h2>
                    <div
                        className={styles.userTag}
                        onClick={copyTag}
                        style={{ color: themeStyles.textColor }}
                    >
                        {user.tag || '#0000'}
                        <FaCopy className={styles.copyIcon} />
                        {copied && (
                            <span
                                className={styles.copiedTooltip}
                                style={{ background: themeStyles.accentColor }}
                            >
                                Скопировано!
                            </span>
                        )}
                    </div>
                    <p
                        className={styles.status}
                        style={{ color: themeStyles.secondaryText }}
                    >
                        {user.status || 'Исследую космос...'}
                    </p>
                    <p
                        className={styles.lastSeen}
                        style={{ color: themeStyles.secondaryText }}
                    >
                        <FaRocket className={styles.rocketIcon} />
                        {isStatusHidden ? 'Невидимка' : 'В сети'}
                    </p>
                </div>

                <div className={styles.giftsSection}>
                    <div className={styles.sectionDivider}>
                        <span
                            className={styles.dividerText}
                            style={{ color: themeStyles.accentColor }}
                        >
                            КОСМИЧЕСКИЕ АРТЕФАКТЫ
                        </span>
                    </div>
                    <div className={styles.giftsGrid}>
                        {user.gifts
                            .filter(gift => gift.selected)
                            .map(gift => (
                                <div
                                    key={gift.id}
                                    className={styles.giftCard}
                                    style={{
                                        background: themeStyles.giftCardBg,
                                        border: `1px solid ${themeStyles.giftCardBorder}`
                                    }}
                                >
                                    <div
                                        className={styles.giftGlow}
                                        style={{
                                            background: `radial-gradient(circle at center, ${themeStyles.accentColor}30, transparent 70%)`
                                        }}
                                    ></div>
                                    <img
                                        src={gift.image}
                                        alt={gift.name}
                                        className={styles.giftImage}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://i.imgur.com/3Zq3Z8L.png';
                                        }}
                                    />
                                    <div
                                        className={styles.giftName}
                                        style={{ color: themeStyles.textColor }}
                                    >
                                        {gift.name}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <button
                    className={styles.editButton}
                    style={{
                        background: themeStyles.accentColor,
                        color: '#ffffff'
                    }}
                >
                    <FaEdit className={styles.editIcon} /> Редактировать профиль
                </button>

                <button
                    className={styles.statusButton}
                    onClick={toggleStatusVisibility}
                    style={{
                        background: 'transparent',
                        border: `1px solid ${themeStyles.accentColor}`,
                        color: themeStyles.accentColor
                    }}
                >
                    {isStatusHidden ? (
                        <>
                            <FaEye className={styles.statusIcon} /> Выйти из невидимки
                        </>
                    ) : (
                        <>
                            <FaEyeSlash className={styles.statusIcon} /> Включить невидимку
                        </>
                    )}
                </button>

                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    style={{ color: themeStyles.textColor }}
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default Modal;