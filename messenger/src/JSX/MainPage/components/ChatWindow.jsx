import React, { useState, useEffect, useRef } from 'react';
import {
    FiSearch,
    FiPhone,
    FiMoreVertical,
    FiPaperclip,
    FiSmile,
    FiSend,
    FiCornerUpLeft,
    FiMapPin,
    FiCopy,
    FiShare2,
    FiFlag,
    FiCheckSquare
} from 'react-icons/fi';
import UserProfileModal from './UserProfileModal';
import cl from '../styles/ChatWindow.module.css';
import { apiRequest } from '../../../hooks/ApiRequest';
import { useAuth } from '../../../hooks/UseAuth';
import useMainHooks from '../../../hooks/UseMainHooks';
import { useNavigate } from 'react-router-dom';

const ChatWindow = ({ connection, activeChat, onToggleFavorite, isConnected }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const { isLoading, userId, username, isAuthenticated, logout } = useAuth();
    const { getStatusString, formatTimeFromISO } = useMainHooks();
    const navigate = useNavigate();
    const contextMenuRef = useRef(null);

    // List of available emoji reactions
    const availableReactions = ['😊', '👍', '❤️', '😂', '😢'];

    useEffect(() => {
        const fetchData = async () => {
            if (!activeChat?.id) return;

            try {
                const response = await apiRequest(`/api/messages/chat/${activeChat.id}`, {
                    method: 'GET',
                    authenticated: isAuthenticated
                });

                const messages = Array.isArray(response)
                    ? response.map(message => ({
                        ...message,
                        isUser: userId === message.senderId,
                        reactions: message.reactions || [] // Initialize reactions array
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
                setMessages(prevMessages => {
                    if (newMessage.isTemporary) return prevMessages;

                    const isDuplicate = prevMessages.some(msg =>
                        msg.tempId === newMessage.tempId &&
                        msg.senderId === newMessage.senderId
                    );

                    return isDuplicate ? prevMessages : [...prevMessages, {
                        ...newMessage,
                        isUser: userId === newMessage.senderId,
                        reactions: newMessage.reactions || []
                    }];
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
            reactions: []
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        try {
            await connection.invoke("SendMessage", activeChat.id, userId, message, tempId);
            setMessages(prev => prev.map(msg =>
                msg.id === tempId ? { ...msg, isTemporary: false } : msg
            ));
        } catch (error) {
            console.error("Ошибка отправки:", error);
            setMessages(prev => prev.filter(msg => msg.id !== tempId));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleAvatarClick = () => {
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
    };

    const handleContextMenu = (e, message) => {
        e.preventDefault();
        const messageElement = e.currentTarget;
        const rect = messageElement.getBoundingClientRect();
        setContextMenu({
            messageId: message.id,
            x: rect.left,
            y: rect.bottom + window.scrollY + 5 // Position just below the message
        });
    };

    const handleContextMenuAction = (action, messageId, emoji = null) => {
        const message = messages.find(msg => msg.id === messageId);
        switch (action) {
            case 'reply':
                setMessage(`Replying to: ${message.comment}`);
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
                setMessages(prev => prev.map(msg =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            reactions: msg.reactions.some(r => r.emoji === emoji)
                                ? msg.reactions.map(r =>
                                    r.emoji === emoji ? { ...r, count: r.count + 1 } : r
                                )
                                : [...msg.reactions, { emoji, count: 1 }]
                        }
                        : msg
                ));
                // Optionally, send reaction to server
                // await connection.invoke("AddReaction", activeChat.id, messageId, userId, emoji);
                break;
            default:
                break;
        }
        setContextMenu(null);
    };

    if (!activeChat) {
        return (
            <div className={cl.emptyChat}>
                <div className={cl.emptyContent}>
                    <h2>Зажгите свою звезду чата</h2>
                    <p>Выберите чат и исследуйте бескрайние просторы диалогов</p>
                    <div className={cl.cosmicDecoration}>
                        <div className={cl.nebula}></div>
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
                        <div className={cl.planetSmall}></div>
                        <div className={cl.planetLarge}></div>
                        <div className={cl.comet}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cl.chatWindow}>
            <div className={cl.chatHeader}>
                <div className={cl.userInfo}>
                    <button className={cl.avatarButton} onClick={handleAvatarClick}>
                        <div className={cl.avatar} style={{ backgroundColor: activeChat.avatarColor }}>
                            {activeChat.avatarText}
                        </div>
                    </button>
                    <div className={cl.userDetails}>
                        <h3>{activeChat.secondUser.username}</h3>
                        <p className={cl.userStatus} data-status={getStatusString(activeChat.secondUser.onlineStatus)}>
                            {getStatusString(activeChat.secondUser.onlineStatus)}
                        </p>
                    </div>
                </div>
                <div className={cl.chatActions}>
                    <button className={cl.actionButton}>
                        <FiSearch />
                    </button>
                    <button className={cl.actionButton}>
                        <FiPhone />
                    </button>
                    <button className={cl.actionButton}>
                        <FiMoreVertical />
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
                    />
                </div>
            )}

            <div className={cl.messagesArea}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${cl.message} ${msg.isUser ? cl.userMessage : cl.contactMessage}`}
                        onContextMenu={(e) => handleContextMenu(e, msg)}
                    >
                        <div className={cl.messageContent}>
                            <p>{msg.comment}</p>
                            <span className={cl.messageTime}>{formatTimeFromISO(msg.createdAt)}</span>
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
                {contextMenu && (
                    <div
                        ref={contextMenuRef}
                        className={cl.contextMenu}
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                    >
                        <button onClick={() => handleContextMenuAction('reply', contextMenu.messageId)}>
                            <FiCornerUpLeft /> Ответить
                        </button>
                        <button onClick={() => handleContextMenuAction('pin', contextMenu.messageId)}>
                            <FiMapPin /> Закрепить
                        </button>
                        <button onClick={() => handleContextMenuAction('copy', contextMenu.messageId)}>
                            <FiCopy /> Копировать текст
                        </button>
                        <button onClick={() => handleContextMenuAction('forward', contextMenu.messageId)}>
                            <FiShare2 /> Переслать
                        </button>
                        <button onClick={() => handleContextMenuAction('report', contextMenu.messageId)}>
                            <FiFlag /> Пожаловаться
                        </button>
                        <button onClick={() => handleContextMenuAction('select', contextMenu.messageId)}>
                            <FiCheckSquare /> Выделить
                        </button>
                        <div className={cl.reactionPicker}>
                            {availableReactions.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleContextMenuAction('react', contextMenu.messageId, emoji)}
                                    className={cl.reactionButton}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className={cl.messageDecoration}></div>
            </div>

            <div className={cl.messageInputContainer}>
                <div className={cl.inputWrapper}>
                    <button className={cl.attachmentButton}>
                        <FiPaperclip className={cl.icon} />
                    </button>
                    <input
                        type="text"
                        placeholder="Напишите сообщение..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={cl.messageInputField}
                    />
                    <button className={cl.emojiButton}>
                        <FiSmile className={cl.icon} />
                    </button>
                </div>
                <button className={cl.sendButton} onClick={handleSendMessage} disabled={!message.trim()}>
                    <FiSend className={cl.sendIcon} />
                </button>
            </div>

            {isProfileOpen && (
                <UserProfileModal
                    user={{
                        name: activeChat.name,
                        avatarText: activeChat.avatarText,
                        avatarColor: activeChat.avatarColor,
                        status: activeChat.status,
                        isFavorite: activeChat.isFavorite,
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
        </div>
    );
};

export default ChatWindow;