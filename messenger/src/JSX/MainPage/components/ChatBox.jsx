import React, { useState, useEffect } from 'react';
import { FaCheck, FaCheckDouble, FaClock } from 'react-icons/fa';
import cl from '../styles/ChatBox.module.css';
import UserProfileModal from './UserProfileModal';
import { useTheme } from '../../SettingsPage/components/Context/ThemeContext';

const ChatBox = ({ name, unread, lastMessage, time, status, isFavorite, messageStatus, isSentByUser, onToggleFavorite }) => {
    const { themeSettings } = useTheme();
    const { theme } = themeSettings;
    const [avatarText, setAvatarText] = useState('');
    const [avatarColor, setAvatarColor] = useState('#4B0082');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const getThemeStyles = () => {
        switch (theme) {
            case 'cosmic':
                return {
                    containerBg: 'rgba(138, 43, 226, 0.1)',
                    borderColor: 'rgba(138, 43, 226, 0.2)',
                    avatarBorder: '#8a2be2',
                    avatarBg: 'linear-gradient(135deg, #8a2be2 0%, #4b0082 100%)',
                    textColor: '#e0e0ff',
                    secondaryText: '#b0b0ff',
                    accentColor: '#8a2be2',
                    statusOnline: '#00ffaa',
                    statusIdle: '#ffcc00',
                    statusBusy: '#ff5555',
                    statusOffline: '#888888',
                    unreadBadgeBg: '#8a2be2',
                    favoriteColor: '#FFD700',
                    messageStatusColor: '#b0b0ff',
                    messageStatusRead: '#8a2be2',
                    messageStatusSending: '#b0b0ff',
                };
            case 'sunset':
                return {
                    containerBg: 'rgba(255, 126, 95, 0.2)',
                    borderColor: 'rgba(255, 126, 95, 0.3)',
                    avatarBorder: '#ff7e5f',
                    avatarBg: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
                    textColor: '#5a2c0a',
                    secondaryText: '#7a4c2a',
                    accentColor: '#ff7e5f',
                    statusOnline: '#00cc66',
                    statusIdle: '#ff9900',
                    statusBusy: '#cc3300',
                    statusOffline: '#996633',
                    unreadBadgeBg: '#ff7e5f',
                    favoriteColor: '#FFD700',
                    messageStatusColor: '#7a4c2a',
                    messageStatusRead: '#ff7e5f',
                    messageStatusSending: '#7a4c2a',
                };
            case 'ocean':
                return {
                    containerBg: 'rgba(0, 198, 251, 0.2)',
                    borderColor: 'rgba(0, 198, 251, 0.3)',
                    avatarBorder: '#00c6fb',
                    avatarBg: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
                    textColor: '#e0f7ff',
                    secondaryText: '#b0e7ff',
                    accentColor: '#00c6fb',
                    statusOnline: '#00ff9d',
                    statusIdle: '#ffcc00',
                    statusBusy: '#ff4d4f',
                    statusOffline: '#66ccff',
                    unreadBadgeBg: '#00c6fb',
                    favoriteColor: '#FFD700',
                    messageStatusColor: '#b0e7ff',
                    messageStatusRead: '#00c6fb',
                    messageStatusSending: '#b0e7ff',
                };
            case 'forest':
                return {
                    containerBg: 'rgba(56, 239, 125, 0.2)',
                    borderColor: 'rgba(56, 239, 125, 0.3)',
                    avatarBorder: '#11998e',
                    avatarBg: 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)',
                    textColor: '#e0fff5',
                    secondaryText: '#b0ffea',
                    accentColor: '#11998e',
                    statusOnline: '#00cc66',
                    statusIdle: '#ffcc00',
                    statusBusy: '#cc3300',
                    statusOffline: '#66cc99',
                    unreadBadgeBg: '#11998e',
                    favoriteColor: '#FFD700',
                    messageStatusColor: '#b0ffea',
                    messageStatusRead: '#11998e',
                    messageStatusSending: '#b0ffea',
                };
            case 'light':
                return {
                    containerBg: 'rgba(160, 160, 160, 0.1)',
                    borderColor: 'rgba(160, 160, 160, 0.2)',
                    avatarBorder: '#4b83f8',
                    avatarBg: 'linear-gradient(135deg, #4b83f8 0%, #6ba3ff 100%)',
                    textColor: '#333333',
                    secondaryText: '#666666',
                    accentColor: '#4b83f8',
                    statusOnline: '#00cc66',
                    statusIdle: '#ff9900',
                    statusBusy: '#cc3300',
                    statusOffline: '#999999',
                    unreadBadgeBg: '#4b83f8',
                    favoriteColor: '#FFD700',
                    messageStatusColor: '#666666',
                    messageStatusRead: '#4b83f8',
                    messageStatusSending: '#666666',
                };
            default:
                return {
                    containerBg: 'rgba(138, 43, 226, 0.1)',
                    borderColor: 'rgba(138, 43, 226, 0.2)',
                    avatarBorder: '#8a2be2',
                    avatarBg: 'linear-gradient(135deg, #8a2be2 0%, #4b0082 100%)',
                    textColor: '#e0e0ff',
                    secondaryText: '#b0b0ff',
                    accentColor: '#8a2be2',
                    statusOnline: '#00ffaa',
                    statusIdle: '#ffcc00',
                    statusBusy: '#ff5555',
                    statusOffline: '#888888',
                    unreadBadgeBg: '#8a2be2',
                    favoriteColor: '#FFD700',
                    messageStatusColor: '#b0b0ff',
                    messageStatusRead: '#8a2be2',
                    messageStatusSending: '#b0b0ff',
                };
        }
    };

    const themeStyles = getThemeStyles();

    useEffect(() => {
        const initials = name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .slice(0, 2)
            .toUpperCase();
        setAvatarText(initials);

        const today = new Date();
        const hash = today.toDateString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const dynamicColor = `hsl(${hash % 360}, 70%, 40%)`;
        setAvatarColor(dynamicColor);
    }, [name]);

    const renderMessageStatus = () => {
        if (!isSentByUser) return null;
        switch (messageStatus) {
            case 'sent':
                return <FaCheck className={cl.messageStatusIcon} style={{ color: themeStyles.messageStatusColor }} />;
            case 'delivered':
                return <FaCheckDouble className={cl.messageStatusIcon} style={{ color: themeStyles.messageStatusColor }} />;
            case 'read':
                return <FaCheckDouble className={`${cl.messageStatusIcon} ${cl.read}`} style={{ color: themeStyles.messageStatusRead }} />;
            case 'sending':
                return <FaClock className={`${cl.messageStatusIcon} ${cl.sending}`} style={{ color: themeStyles.messageStatusSending }} />;
            default:
                return null;
        }
    };

    const openProfile = () => setIsProfileOpen(true);
    const closeProfile = () => setIsProfileOpen(false);

    const handleStartChat = () => {
        closeProfile();
        // Логика начала чата
    };

    const handleBlockUser = () => {
        closeProfile();
        // Логика блокировки пользователя
    };

    const handleReportUser = () => {
        closeProfile();
        // Логика жалобы на пользователя
    };

    const handleToggleFavorite = () => {
        if (onToggleFavorite) {
            onToggleFavorite();
        }
    };

    return (
        <>
            <div
                className={cl.container}
                style={{
                    background: themeStyles.containerBg,
                    borderBottom: `1px solid ${themeStyles.borderColor}`,
                }}
            >
                <div className={cl.avatar_wrapper} onClick={openProfile}>
                    <div
                        className={cl.chatbox}
                        style={{
                            background: themeStyles.avatarBg,
                            border: `2px solid ${themeStyles.avatarBorder}`,
                        }}
                    >
            <span className={cl.avatar_text} style={{ color: themeStyles.textColor }}>
              {avatarText}
            </span>
                    </div>
                    <div
                        className={cl.statusBadge}
                        data-status={status}
                        style={{
                            border: `2px solid ${themeStyles.avatarBorder}`,
                            background: themeStyles[`status${status}`],
                        }}
                    ></div>
                </div>
                <div className={cl.chat_text}>
                    <div className={cl.name_wrapper}>
                        <p className={cl.p_chatname} style={{ color: themeStyles.textColor }}>
                            {name}
                        </p>
                        {isFavorite && (
                            <span className={cl.favorite_icon} style={{ color: themeStyles.favoriteColor }}>
                ★
              </span>
                        )}
                    </div>
                    <div className={cl.lastMessageContainer}>
                        {messageStatus && (
                            <div className={cl.messageStatus}>{renderMessageStatus()}</div>
                        )}
                        <p className={cl.p_lastmes} style={{ color: themeStyles.secondaryText }}>
                            {lastMessage}
                        </p>
                    </div>
                </div>
                <div className={cl.right_box}>
                    <p className={cl.p_date} style={{ color: themeStyles.accentColor }}>
                        {time}
                    </p>
                    {unread > 0 && (
                        <span
                            className={cl.unread_badge}
                            style={{
                                backgroundColor: themeStyles.unreadBadgeBg,
                                color: themeStyles.textColor,
                            }}
                        >
              {unread}
            </span>
                    )}
                </div>
            </div>
            {isProfileOpen && (
                <UserProfileModal
                    user={{
                        name,
                        avatarText,
                        avatarColor,
                        status,
                        isFavorite,
                        tag: '#0000',
                        quote: 'Статус пользователя',
                    }}
                    onClose={closeProfile}
                    onStartChat={handleStartChat}
                    onBlockUser={handleBlockUser}
                    onReportUser={handleReportUser}
                    onToggleFavorite={handleToggleFavorite}
                />
            )}
        </>
    );
};

export default ChatBox;