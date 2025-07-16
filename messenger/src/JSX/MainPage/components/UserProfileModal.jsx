import React, { useState } from 'react';
import {
    FaTimes,
    FaCircle,
    FaRegCircle,
    FaRocket,
    FaCopy,
    FaComment,
    FaBan,
    FaExclamationTriangle,
    FaStar,
    FaRegStar
} from 'react-icons/fa';
import { IoMdPlanet } from "react-icons/io";
import styles from '../styles/Modal.module.css';

const UserProfileModal = ({ user, onClose, onStartChat, onBlockUser, onReportUser, onToggleFavorite }) => {
    const [copied, setCopied] = useState(false);
    const [isStarVisible, setIsStarVisible] = useState(user.isFavorite);

    const copyTag = () => {
        navigator.clipboard.writeText(user.tag || "#0000");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleToggleFavorite = () => {
        const newFavoriteState = !isStarVisible;
        setIsStarVisible(newFavoriteState);
        onToggleFavorite({ ...user, isFavorite: newFavoriteState });
    };

    const gifts = [
        { id: 1, image: "https://cdn1.ozone.ru/s3/multimedia-1-h/7548608069.jpg", name: "Золотой лабубу" },
        { id: 2, image: "https://avatars.mds.yandex.net/get-mpic/13527901/2a000001971b61fbaf300b399920a6a840f3/orig", name: "Никита" },
        { id: 3, image: "https://avatars.mds.yandex.net/i?id=3eaffa6d84e0523f6ed1786307f4e0a4_l-5295169-images-thumbs&n=13", name: "Лабуба" }
    ];

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Космический баннер */}
                <div className={styles.banner}>
                    <div className={styles.stars}></div>
                    <IoMdPlanet className={styles.planetIcon} />
                </div>

                {/* Кнопка закрытия */}
                <button className={styles.closeButton} onClick={onClose}>
                    <FaTimes />
                </button>

                {/* Аватар с индикатором онлайн-статуса */}
                <div className={styles.avatarWrapper}>
                    <div
                        className={styles.avatar}
                        style={{
                            backgroundColor: user.avatarColor || '#4B0082',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            fontSize: '36px',
                            fontWeight: 'bold'
                        }}
                    >
                        {user.avatarText || 'US'}
                    </div>
                    {user.status === 'online' ? (
                        <FaCircle className={styles.statusOnline} />
                    ) : (
                        <FaRegCircle className={styles.statusOffline} />
                    )}
                </div>

                {/* Кнопки действий под аватаром */}
                <div className={styles.avatarActions}>
                    <button
                        className={styles.avatarActionButton}
                        onClick={handleToggleFavorite}
                    >
                        {isStarVisible ? (
                            <FaStar className={styles.avatarActionIcon} style={{ color: 'gold' }} />
                        ) : (
                            <FaRegStar className={styles.avatarActionIcon} />
                        )}
                    </button>
                    <button
                        className={styles.avatarActionButton}
                        onClick={() => onBlockUser(user)}
                    >
                        <FaBan className={styles.avatarActionIcon} />
                    </button>
                    <button
                        className={styles.avatarActionButton}
                        onClick={() => onReportUser(user)}
                    >
                        <FaExclamationTriangle className={styles.avatarActionIcon} />
                    </button>
                </div>

                {/* Информация о пользователе */}
                <div className={styles.userInfo}>
                    <div className={styles.usernameWrapper}>
                        <h2 className={styles.username}>{user.name || "Пользователь"}</h2>
                        {isStarVisible && (
                            <FaStar className={styles.usernameStar} />
                        )}
                    </div>
                    <div className={styles.userTag} onClick={copyTag}>
                        {user.tag || "#0000"}
                        <FaCopy className={styles.copyIcon} />
                        {copied && <span className={styles.copiedTooltip}>Скопировано!</span>}
                    </div>
                    <p className={styles.status}>{user.quote || "Статус не указан"}</p>
                    <p className={styles.lastSeen}>
                        <FaRocket className={styles.rocketIcon} />
                        {user.status === 'online' ? 'В сети' : 'Не в сети'}
                    </p>
                </div>

                {/* Витрина подарков */}
                <div className={styles.giftsSection}>
                    <div className={styles.sectionDivider}>
                        <span className={styles.dividerText}>КОСМИЧЕСКИЕ АРТЕФАКТЫ</span>
                    </div>
                    <div className={styles.giftsGrid}>
                        {gifts.map(gift => (
                            <div key={gift.id} className={styles.giftCard}>
                                <div className={styles.giftGlow}></div>
                                <img
                                    src={gift.image}
                                    alt={gift.name}
                                    className={styles.giftImage}
                                />
                                <div className={styles.giftName}>{gift.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Кнопка начала чата */}
                <button
                    className={styles.actionButton}
                    onClick={onStartChat}
                    style={{ background: 'linear-gradient(90deg, #5a96ff, #8a2be2)' }}
                >
                    <FaComment className={styles.actionIcon} /> Начать чат
                </button>
            </div>
        </div>
    );
};

export default UserProfileModal;