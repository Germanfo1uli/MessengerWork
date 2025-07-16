import React, { useState, useEffect } from 'react';
import {
    FaCheck,
    FaCheckDouble,
    FaClock
} from 'react-icons/fa';
import cl from '../styles/ChatBox.module.css';
import UserProfileModal from './UserProfileModal';

const ChatBox =  ({ name, unread, lastMessage, time, status, isFavorite, messageStatus, isSentByUser, onToggleFavorite }) => {
    const [avatarText, setAvatarText] = useState('');
    const [avatarColor, setAvatarColor] = useState('#4B0082');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

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

        switch(messageStatus) {
            case 'sent':
                return <FaCheck className={cl.messageStatusIcon} />;
            case 'delivered':
                return <FaCheckDouble className={cl.messageStatusIcon} />;
            case 'read':
                return <FaCheckDouble className={`${cl.messageStatusIcon} ${cl.read}`} />;
            case 'sending':
                return <FaClock className={`${cl.messageStatusIcon} ${cl.sending}`} />;
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
            <div className={cl.container}>
                <div className={cl.avatar_wrapper} onClick={openProfile}>
                    <div className={cl.chatbox} style={{ backgroundColor: avatarColor }}>
                        <span className={cl.avatar_text}>{avatarText}</span>
                    </div>
                    <div className={cl.statusBadge} data-status={status}></div>
                </div>
                <div className={cl.chat_text}>
                    <div className={cl.name_wrapper}>
                        <p className={cl.p_chatname}>{name}</p>
                        {isFavorite && <span className={cl.favorite_icon}>★</span>}
                    </div>
                    <div className={cl.lastMessageContainer}>
                        {messageStatus && (
                            <div className={cl.messageStatus}>
                                {renderMessageStatus()}
                            </div>
                        )}
                        <p className={cl.p_lastmes}>{lastMessage}</p>
                    </div>
                </div>
                <div className={cl.right_box}>
                    <p className={cl.p_date}>{time}</p>
                    {unread > 0 && <span className={cl.unread_badge}>{unread}</span>}
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
                        tag: "#0000",
                        quote: "Статус пользователя"
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