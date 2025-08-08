import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiPhone, FiMoreVertical, FiPaperclip, FiSmile, FiSend, FiCornerUpLeft, FiMapPin, FiCopy, FiShare2, FiFlag, FiCheckSquare, FiX } from 'react-icons/fi';
import UserProfileModal from './UserProfileModal';
import cl from '../styles/ChatWindow.module.css';
import { apiRequest } from '../../../hooks/ApiRequest';
import { useAuth } from '../../../hooks/UseAuth';
import useMainHooks from '../../../hooks/UseMainHooks';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../SettingsPage/components/Context/ThemeContext';

const ChatWindow = ({ connection, activeChat, onToggleFavorite, isConnected }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [avatarText, setAvatarText] = useState('');
    const [avatarColor, setAvatarColor] = useState('#4B0082');
    const { isLoading, userId, username, isAuthenticated, logout } = useAuth();
    const { getStatusString, formatTimeFromISO } = useMainHooks();
    const navigate = useNavigate();
    const contextMenuRef = useRef(null);
    const messagesEndRef = useRef(null);
    const messagesAreaRef = useRef(null);
    const inputRef = useRef(null);
    const availableReactions = ['😊', '👍', '❤️', '😂', '😢'];
    const { themeSettings, fontFamilies } = useTheme();
    const {
        theme,
        backgroundType,
        customBackground,
        backgroundBlur,
        backgroundOpacity,
        backgroundSize,
        backgroundPosition,
        windowChatStyle,
        windowAccentColor,
        windowFontSize,
        windowFontFamily,
        messageCornerRadius,
        messageShadow,
    } = themeSettings;

    useEffect(() => {
        if (activeChat?.secondUser?.username) {
            const initials = activeChat.secondUser.username
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
        }
    }, [activeChat?.secondUser?.username]);

    const getThemeStyles = () => {
        switch (theme) {
            case 'cosmic':
                return {
                    headerBg: 'rgba(26, 21, 71, 1)',
                    headerBorder: 'rgba(255, 176, 255, 0.2)',
                    inputBg: 'rgba(26, 21, 71, 0.95)',
                    inputBorder: 'rgba(74, 20, 140, 0.5)',
                    inputWrapperBg: 'rgba(255, 255, 255, 0.08)',
                    textColor: '#e0e0ff',
                    secondaryText: '#b0b0ff',
                    actionButtonBg: 'rgba(255, 255, 255, 0.1)',
                    replyBg: 'rgba(255, 255, 255, 0.07)',
                    emptyChatBg: 'radial-gradient(circle at top center, #1a1547 0%, #0f0c29 70%)',
                    emptyTextColor: '#e0e0ff',
                    emptySecondaryText: '#b0b0ff',
                    nebulaGradient: 'radial-gradient(circle at 20% 30%, rgba(120, 60, 220, 0.3) 0%, rgba(50, 20, 100, 0.2) 40%, transparent 80%)',
                    planetSmallGradient: 'linear-gradient(135deg, #ff6f91, #4a148c)',
                    planetLargeGradient: 'linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)',
                    cometGradient: 'linear-gradient(45deg, #ffffff, #b0b0ff)',
                };
            case 'sunset':
                return {
                    headerBg: 'rgba(254, 180, 123, 1)',
                    headerBorder: 'rgba(255, 126, 95, 0.3)',
                    inputBg: 'rgba(254, 180, 123, 0.95)',
                    inputBorder: 'rgba(255, 126, 95, 0.5)',
                    inputWrapperBg: 'rgba(255, 255, 255, 0.15)',
                    textColor: '#5a2c0a',
                    secondaryText: '#7a4c2a',
                    actionButtonBg: 'rgba(255, 255, 255, 0.2)',
                    replyBg: 'rgba(255, 255, 255, 0.15)',
                    emptyChatBg: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
                    emptyTextColor: '#5a2c0a',
                    emptySecondaryText: '#7a4c2a',
                    nebulaGradient: 'radial-gradient(circle at 20% 30%, rgba(255, 126, 95, 0.3) 0%, rgba(254, 180, 123, 0.2) 40%, transparent 80%)',
                    planetSmallGradient: 'linear-gradient(135deg, #ff9a8b, #ff6a38)',
                    planetLargeGradient: 'linear-gradient(45deg, #ff7e5f, #feb47b, #ffcc99)',
                    cometGradient: 'linear-gradient(45deg, #ffffff, #ffcc99)',
                };
            case 'ocean':
                return {
                    headerBg: 'rgba(0, 93, 234, 1)',
                    headerBorder: 'rgba(0, 198, 251, 0.3)',
                    inputBg: 'rgba(0, 93, 234, 0.95)',
                    inputBorder: 'rgba(0, 198, 251, 0.5)',
                    inputWrapperBg: 'rgba(255, 255, 255, 0.15)',
                    textColor: '#e0f7ff',
                    secondaryText: '#b0e7ff',
                    actionButtonBg: 'rgba(255, 255, 255, 0.2)',
                    replyBg: 'rgba(255, 255, 255, 0.1)',
                    emptyChatBg: 'linear-gradient(135deg, #00c6fb, #005bea)',
                    emptyTextColor: '#e0f7ff',
                    emptySecondaryText: '#b0e7ff',
                    nebulaGradient: 'radial-gradient(circle at 20% 30%, rgba(0, 198, 251, 0.3) 0%, rgba(0, 93, 234, 0.2) 40%, transparent 80%)',
                    planetSmallGradient: 'linear-gradient(135deg, #00c6fb, #007bff)',
                    planetLargeGradient: 'linear-gradient(45deg, #005bea, #00c6fb, #66e0ff)',
                    cometGradient: 'linear-gradient(45deg, #ffffff, #b0e7ff)',
                };
            case 'forest':
                return {
                    headerBg: 'rgba(17, 153, 142, 1)',
                    headerBorder: 'rgba(56, 239, 125, 0.3)',
                    inputBg: 'rgba(17, 153, 142, 0.95)',
                    inputBorder: 'rgba(56, 239, 125, 0.5)',
                    inputWrapperBg: 'rgba(255, 255, 255, 0.15)',
                    textColor: '#e0fff5',
                    secondaryText: '#b0ffea',
                    actionButtonBg: 'rgba(255, 255, 255, 0.2)',
                    replyBg: 'rgba(255, 255, 255, 0.1)',
                    emptyChatBg: 'linear-gradient(135deg, #11998e, #38ef7d)',
                    emptyTextColor: '#e0fff5',
                    emptySecondaryText: '#b0ffea',
                    nebulaGradient: 'radial-gradient(circle at 20% 30%, rgba(56, 239, 125, 0.3) 0%, rgba(17, 153, 142, 0.2) 40%, transparent 80%)',
                    planetSmallGradient: 'linear-gradient(135deg, #38ef7d, #11998e)',
                    planetLargeGradient: 'linear-gradient(45deg, #11998e, #38ef7d, #66ff99)',
                    cometGradient: 'linear-gradient(45deg, #ffffff, #b0ffea)',
                };
            case 'light':
                return {
                    headerBg: 'rgba(240, 240, 240, 1)',
                    headerBorder: 'rgba(160, 160, 160, 0.2)',
                    inputBg: 'rgba(240, 240, 240, 0.95)',
                    inputBorder: 'rgba(160, 160, 160, 0.3)',
                    inputWrapperBg: 'rgba(0, 0, 0, 0.05)',
                    textColor: '#333',
                    secondaryText: '#666',
                    actionButtonBg: 'rgba(0, 0, 0, 0.05)',
                    replyBg: 'rgba(0, 0, 0, 0.03)',
                    emptyChatBg: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)',
                    emptyTextColor: '#333',
                    emptySecondaryText: '#666',
                    nebulaGradient: 'radial-gradient(circle at 20% 30%, rgba(160, 160, 160, 0.2) 0%, rgba(200, 200, 200, 0.1) 40%, transparent 80%)',
                    planetSmallGradient: 'linear-gradient(135deg, #d3d3d3, #a9a9a9)',
                    planetLargeGradient: 'linear-gradient(45deg, #e0e0e0, #d3d3d3, #f5f5f5)',
                    cometGradient: 'linear-gradient(45deg, #ffffff, #d3d3d3)',
                };
            default:
                return {
                    headerBg: 'rgba(15, 12, 41, 1)',
                    headerBorder: 'rgba(255, 176, 255, 0.2)',
                    inputBg: 'rgba(15, 12, 41, 0.95)',
                    inputBorder: 'rgba(74, 20, 140, 0.5)',
                    inputWrapperBg: 'rgba(255, 255, 255, 0.08)',
                    textColor: '#e0e0ff',
                    secondaryText: '#b0b0ff',
                    actionButtonBg: 'rgba(255, 255, 255, 0.1)',
                    replyBg: 'rgba(255, 255, 255, 0.07)',
                    emptyChatBg: 'radial-gradient(circle at top center, #1a1547 0%, #0f0c29 70%)',
                    emptyTextColor: '#e0e0ff',
                    emptySecondaryText: '#b0b0ff',
                    nebulaGradient: 'radial-gradient(circle at 20% 30%, rgba(120, 60, 220, 0.3) 0%, rgba(50, 20, 100, 0.2) 40%, transparent 80%)',
                    planetSmallGradient: 'linear-gradient(135deg, #ff6f91, #4a148c)',
                    planetLargeGradient: 'linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)',
                    cometGradient: 'linear-gradient(45deg, #ffffff, #b0b0ff)',
                };
        }
    };

    const themeStyles = getThemeStyles();
    const fontFamilyValue = fontFamilies.find((f) => f.id === windowFontFamily)?.value || 'system-ui';

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!activeChat?.id) return;
            try {
                const response = await apiRequest(`/api/messages/chat/${activeChat.id}`, {
                    method: 'GET',
                    authenticated: isAuthenticated,
                });
                const messages = Array.isArray(response)
                    ? response.map((message) => ({
                        ...message,
                        isUser: userId === message.senderId,
                        reactions: message.reactions || [],
                        replyTo: message.replyTo
                            ? {
                                ...message.replyTo,
                                sender: message.replyTo.senderId === userId ? 'You' : activeChat.secondUser.username,
                            }
                            : null,
                    }))
                    : response;
                setMessages(messages);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };

        if (isLoading || !userId) {
            return;
        }

        if (!isAuthenticated) {
            logout();
            navigate('/');
        }

        fetchData();
    }, [isLoading, userId, username, isAuthenticated, logout, activeChat?.id, navigate]);

    useEffect(() => {
        if (!activeChat?.id || !connection || !isConnected) return;
        const handleNewMessage = (newMessage) => {
            if (activeChat.id === newMessage.chatId) {
                setMessages((prevMessages) => {
                    if (newMessage.isTemporary) return prevMessages;
                    const isDuplicate = prevMessages.some(
                        (msg) => msg.tempId === newMessage.tempId && msg.senderId === newMessage.senderId
                    );
                    return isDuplicate
                        ? prevMessages
                        : [
                            ...prevMessages,
                            {
                                ...newMessage,
                                isUser: userId === newMessage.senderId,
                                reactions: newMessage.reactions || [],
                                replyTo: newMessage.replyTo
                                    ? {
                                        ...newMessage.replyTo,
                                        sender: newMessage.replyTo.senderId === userId ? 'You' : activeChat.secondUser.username,
                                    }
                                    : null,
                            },
                        ];
                });
            }
        };
        connection.on('ReceiveMessage', handleNewMessage);
        return () => connection.off('ReceiveMessage', handleNewMessage);
    }, [connection, isConnected, activeChat?.id, userId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setContextMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSendMessage = async () => {
        if (!message.trim() || !activeChat?.id || !userId) return;
        const tempId = Math.floor(10000000 + Math.random() * 90000000);
        const newMessage = {
            id: tempId.toString(),
            tempId: tempId,
            comment: message,
            isUser: true,
            createdAt: new Date().toISOString(),
            senderId: userId,
            chatId: activeChat.id,
            isTemporary: true,
            reactions: [],
            replyTo: replyingTo
                ? {
                    id: replyingTo.id,
                    comment: replyingTo.comment,
                    senderId: replyingTo.senderId,
                    sender: replyingTo.isUser ? 'You' : activeChat.secondUser.username,
                }
                : null,
        };
        setMessages((prev) => [...prev, newMessage]);
        setMessage('');
        setReplyingTo(null);
        try {
            await connection.invoke('SendMessage', activeChat.id, userId, message, tempId, replyingTo?.id);
            setMessages((prev) =>
                prev.map((msg) => (msg.id === tempId ? { ...msg, isTemporary: false } : msg))
            );
        } catch (error) {
            console.error('Ошибка отправки:', error);
            setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleAvatarClick = () => {
        console.log('Avatar clicked!');
        setIsProfileOpen(true);
    };

    const closeProfile = () => {
        setIsProfileOpen(false);
    };

    const handleStartChat = () => {
        closeProfile();
    };

    const handleBlockUser = () => {
        closeProfile();
    };

    const handleReportUser = () => {
        closeProfile();
    };

    const handleToggleFavorite = () => {
        if (onToggleFavorite) {
            onToggleFavorite();
        }
        closeProfile();
    };

    const handleContextMenu = (e, message) => {
        e.preventDefault();
        const messageElement = e.currentTarget;
        const rect = messageElement.getBoundingClientRect();
        const contextMenuHeight = 200;
        setContextMenu({
            messageId: message.id,
            x: rect.left,
            y: rect.top + window.scrollY - contextMenuHeight - 5,
        });
    };

    const handleReply = (message) => {
        setReplyingTo(message);
        setContextMenu(null);
        inputRef.current.focus();
    };

    const cancelReply = () => {
        setReplyingTo(null);
    };

    const handleContextMenuAction = (action, messageId, emoji = null) => {
        const message = messages.find((msg) => msg.id === messageId);
        switch (action) {
            case 'reply':
                handleReply(message);
                break;
            case 'pin':
                console.log(`Pinning message ${messageId}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(message.comment);
                break;
            case 'forward':
                console.log(`Forwarding message ${messageId}`);
                break;
            case 'report':
                console.log(`Reporting message ${messageId}`);
                break;
            case 'select':
                console.log(`Selecting message ${messageId}`);
                break;
            case 'react':
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === messageId
                            ? {
                                ...msg,
                                reactions: msg.reactions.some((r) => r.emoji === emoji)
                                    ? msg.reactions.map((r) =>
                                        r.emoji === emoji ? { ...r, count: r.count + 1 } : r
                                    )
                                    : [...msg.reactions, { emoji, count: 1 }],
                            }
                            : msg
                    )
                );
                break;
            default:
                break;
        }
        setContextMenu(null);
    };

    if (!activeChat) {
        return (
            <div
                className={cl.emptyChat}
                style={{
                    background: themeStyles.emptyChatBg,
                    fontFamily: fontFamilyValue,
                    fontSize: `${windowFontSize}px`,
                }}
            >
                <div
                    className={cl.emptyContent}
                    style={{
                        color: themeStyles.emptyTextColor,
                    }}
                >
                    <h2 style={{ color: themeStyles.emptyTextColor, textShadow: `0 0 12px ${themeStyles.secondaryText}` }}>
                        Зажгите свою звезду чата
                    </h2>
                    <p style={{ color: themeStyles.emptySecondaryText, textShadow: `0 0 6px ${themeStyles.secondaryText}` }}>
                        Выберите чат и исследуйте бескрайние просторы диалогов
                    </p>
                    <div className={cl.cosmicDecoration}>
                        <div
                            className={cl.nebula}
                            style={{ background: themeStyles.nebulaGradient }}
                        ></div>
                        <div className={cl.starField}>
                            <div className={cl.star}></div>
                            <div className={cl.star}></div>
                            <div className={cl.star}></div>
                            <div className={cl.star}></div>
                            <div className={cl.star}></div>
                            <div className={cl.star}></div>
                            <div className={cl.star}></div>
                            <div className={cl.star}></div>
                        </div>
                        <div
                            className={cl.planetSmall}
                            style={{ background: themeStyles.planetSmallGradient }}
                        ></div>
                        <div
                            className={cl.planetLarge}
                            style={{ background: themeStyles.planetLargeGradient }}
                        ></div>
                        <div
                            className={cl.comet}
                            style={{ background: themeStyles.cometGradient }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cl.chatWindow}
            style={{
                backgroundImage:
                    backgroundType === 'image' && customBackground
                        ? `url(${customBackground})`
                        : themeStyles.emptyChatBg,
                backgroundSize: backgroundType === 'image' ? backgroundSize : 'cover',
                backgroundPosition: backgroundType === 'image' ? backgroundPosition : 'center',
                filter: backgroundType === 'image' ? `blur(${backgroundBlur}px)` : 'none',
                opacity: backgroundType === 'image' ? backgroundOpacity : 1,
                fontFamily: fontFamilyValue,
                fontSize: `${windowFontSize}px`,
            }}
        >
            <div
                className={cl.chatHeader}
                style={{
                    background: themeStyles.headerBg,
                    borderBottom: `1px solid ${themeStyles.headerBorder}`,
                    color: themeStyles.textColor,
                }}
            >
                <div className={cl.userInfo}>
                    <button className={cl.avatarButton} onClick={handleAvatarClick}>
                        <div className={cl.avatar} style={{ backgroundColor: avatarColor }}>
                            {avatarText}
                        </div>
                    </button>
                    <div className={cl.userDetails}>
                        <h3 style={{ color: themeStyles.textColor }}>{activeChat.secondUser.username}</h3>
                        <p
                            className={cl.userStatus}
                            data-status={activeChat.secondUser.onlineStatus}
                            style={{ color: themeStyles.secondaryText }}
                        >
                            {getStatusString(activeChat.secondUser.onlineStatus)}
                        </p>
                    </div>
                </div>
                <div className={cl.chatActions}>
                    <button
                        className={cl.actionButton}
                        style={{ background: themeStyles.actionButtonBg, color: themeStyles.textColor }}
                    >
                        <FiSearch className={cl.actionIcon} />
                    </button>
                    <button
                        className={cl.actionButton}
                        style={{ background: themeStyles.actionButtonBg, color: themeStyles.textColor }}
                    >
                        <FiPhone className={cl.actionIcon} />
                    </button>
                    <button
                        className={cl.actionButton}
                        style={{ background: themeStyles.actionButtonBg, color: themeStyles.textColor }}
                    >
                        <FiMoreVertical className={cl.actionIcon} />
                    </button>
                </div>
                <div className={cl.headerDecoration}></div>
            </div>
            {searchQuery && (
                <div className={cl.searchBar}>
                    <input
                        type="text"
                        placeholder="Поиск сообщений..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            background: themeStyles.inputWrapperBg,
                            color: themeStyles.textColor,
                        }}
                    />
                </div>
            )}
            <div className={cl.messagesArea} ref={messagesAreaRef}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${cl.message} ${msg.isUser ? cl.userMessage : cl.contactMessage}`}
                        onContextMenu={(e) => handleContextMenu(e, msg)}
                        style={{
                            borderRadius:
                                windowChatStyle === 'bubbles'
                                    ? `${messageCornerRadius}px ${messageCornerRadius}px ${messageCornerRadius}px 5px`
                                    : windowChatStyle === 'minimal'
                                        ? '5px'
                                        : '10px',
                            boxShadow: messageShadow
                                ? msg.isUser
                                    ? `0 0 8px rgba(${parseInt(windowAccentColor.slice(1, 3), 16)}, ${parseInt(windowAccentColor.slice(3, 5), 16)}, ${parseInt(windowAccentColor.slice(5, 7), 16)}, 0.5)`
                                    : '0 0 12px rgba(106, 48, 147, 0.5)'
                                : 'none',
                            background: msg.isUser
                                ? `linear-gradient(135deg, ${windowAccentColor}, ${adjustColor(windowAccentColor, -20)})`
                                : 'linear-gradient(135deg, #3a1c71, #6a3093)',
                        }}
                    >
                        {msg.replyTo && (
                            <div
                                className={cl.replyPreview}
                                style={{ background: themeStyles.replyBg }}
                            >
                                <div className={cl.replyLine}></div>
                                <div className={cl.replyContent}>
                                    <span className={cl.replyAuthor} style={{ color: themeStyles.textColor }}>
                                        {msg.replyTo.sender}
                                    </span>
                                    <p className={cl.replyText} style={{ color: themeStyles.secondaryText }}>
                                        {msg.replyTo.comment}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className={cl.messageContent}>
                            <p style={{ color: msg.isUser ? '#fff' : '#e0e0ff' }}>{msg.comment}</p>
                            <span
                                className={cl.messageTime}
                                style={{ color: msg.isUser ? 'rgba(255,255,255,0.7)' : 'rgba(224,224,255,0.7)' }}
                            >
                                {formatTimeFromISO(msg.createdAt)}
                            </span>
                        </div>
                        {msg.reactions.length > 0 && (
                            <div className={cl.reactions}>
                                {msg.reactions.map((reaction, index) => (
                                    <span key={index} className={cl.reaction}>
                                        {reaction.emoji} {reaction.count > 1 ? reaction.count : ''}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
                {contextMenu && (
                    <div
                        ref={contextMenuRef}
                        className={cl.contextMenu}
                        style={{
                            top: contextMenu.y,
                            left: contextMenu.x,
                            background: themeStyles.headerBg,
                            border: `1px solid ${themeStyles.headerBorder}`,
                            color: themeStyles.textColor,
                        }}
                    >
                        <button
                            onClick={() => handleContextMenuAction('reply', contextMenu.messageId)}
                            style={{ color: themeStyles.textColor }}
                        >
                            <FiCornerUpLeft /> Ответить
                        </button>
                        <button
                            onClick={() => handleContextMenuAction('pin', contextMenu.messageId)}
                            style={{ color: themeStyles.textColor }}
                        >
                            <FiMapPin /> Закрепить
                        </button>
                        <button
                            onClick={() => handleContextMenuAction('copy', contextMenu.messageId)}
                            style={{ color: themeStyles.textColor }}
                        >
                            <FiCopy /> Копировать текст
                        </button>
                        <button
                            onClick={() => handleContextMenuAction('forward', contextMenu.messageId)}
                            style={{ color: themeStyles.textColor }}
                        >
                            <FiShare2 /> Переслать
                        </button>
                        <button
                            onClick={() => handleContextMenuAction('report', contextMenu.messageId)}
                            style={{ color: themeStyles.textColor }}
                        >
                            <FiFlag /> Пожаловаться
                        </button>
                        <button
                            onClick={() => handleContextMenuAction('select', contextMenu.messageId)}
                            style={{ color: themeStyles.textColor }}
                        >
                            <FiCheckSquare /> Выделить
                        </button>
                        <div
                            className={cl.reactionPicker}
                            style={{
                                borderTop: `1px solid ${themeStyles.headerBorder}`,
                                background: themeStyles.inputBg,
                            }}
                        >
                            {availableReactions.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleContextMenuAction('react', contextMenu.messageId, emoji)}
                                    className={cl.reactionButton}
                                    style={{ background: themeStyles.actionButtonBg }}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className={cl.messageDecoration}></div>
            </div>
            {replyingTo && (
                <div
                    className={cl.replyIndicator}
                    style={{
                        background: themeStyles.inputBg,
                        borderTop: `1px solid ${themeStyles.inputBorder}`,
                        borderBottom: `1px solid ${themeStyles.inputBorder}`,
                    }}
                >
                    <div className={cl.replyInfo}>
                        <span style={{ color: themeStyles.textColor }}>
                            Replying to {replyingTo.isUser ? 'yourself' : activeChat.secondUser.username}
                        </span>
                        <p style={{ color: themeStyles.secondaryText }}>{replyingTo.comment}</p>
                    </div>
                    <button
                        className={cl.cancelReply}
                        onClick={cancelReply}
                        style={{ color: themeStyles.textColor }}
                    >
                        <FiX />
                    </button>
                </div>
            )}
            <div
                className={cl.messageInputContainer}
                style={{
                    background: themeStyles.inputBg,
                    borderTop: `1px solid ${themeStyles.inputBorder}`,
                    color: themeStyles.textColor,
                }}
            >
                <div
                    className={cl.inputWrapper}
                    style={{ background: themeStyles.inputWrapperBg }}
                >
                    <button
                        className={cl.attachmentButton}
                        style={{ color: themeStyles.textColor }}
                    >
                        <FiPaperclip className={cl.icon} />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Напишите сообщение..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={cl.messageInputField}
                        style={{ color: themeStyles.textColor }}
                    />
                    <button
                        className={cl.emojiButton}
                        style={{ color: themeStyles.textColor }}
                    >
                        <FiSmile className={cl.icon} />
                    </button>
                </div>
                <button
                    className={cl.sendButton}
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    style={{
                        background: themeStyles.actionButtonBg,
                        color: themeStyles.textColor,
                        border: `1px solid ${themeStyles.inputBorder}`,
                    }}
                >
                    <FiSend className={cl.sendIcon} />
                </button>
            </div>
            {isProfileOpen && (
                <UserProfileModal
                    user={{
                        name: activeChat.secondUser.username,
                        avatarText: avatarText,
                        avatarColor: avatarColor,
                        status: activeChat.secondUser.onlineStatus,
                        isFavorite: activeChat.isFavorite,
                        tag: "#0000",
                        quote: "Статус пользователя",
                    }}
                    onClose={closeProfile}
                    onStartChat={handleStartChat}
                    onBlockUser={handleBlockUser}
                    onReportUser={handleReportUser}
                    onToggleFavorite={handleToggleFavorite}
                />
            )}
        </div>
    );
};

const adjustColor = (color, amount) => {
    let usePound = false;
    if (color[0] === '#') {
        color = color.slice(1);
        usePound = true;
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00ff) + amount;
    let b = (num & 0x0000ff) + amount;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    const newColor = (r << 16) | (g << 8) | b;
    return (usePound ? '#' : '') + newColor.toString(16).padStart(6, '0');
};

export default ChatWindow;