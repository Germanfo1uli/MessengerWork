import React, { useState, useEffect } from 'react';
import {
    FaCheck,
    FaCheckDouble,
    FaClock
} from 'react-icons/fa';
import cl from '../styles/ChatBox.module.css';

const ChatBox = ({ name, unread, lastMessage, time, status, isFavorite, messageStatus, isSentByUser }) => {
    const [avatarText, setAvatarText] = useState('');
    const [avatarColor, setAvatarColor] = useState('#4B0082');

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
        if (!isSentByUser) return null; // Don't show status icons for received messages

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

    return (
        <div className={cl.container}>
            <div className={cl.avatar_wrapper}>
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
    );
};

export default ChatBox;