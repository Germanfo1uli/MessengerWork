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
    FiCheckSquare,
    FiX
} from 'react-icons/fi';
import UserProfileModal from './UserProfileModal';
import cl from '../styles/ChatWindow.module.css';
import { apiRequest } from '../../../hooks/ApiRequest';
import { useAuth } from '../../../hooks/UseAuth';
import useMainHooks from '../hooks/UseMainHooks';
import { useNavigate } from 'react-router-dom';

const ChatWindow = ({ connection, activeChat, setActiveChat, onToggleFavorite, isConnected }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [secondUserId, setSecondUserId] = useState('');
    const { isLoading, userId, username, isAuthenticated, logout } = useAuth();
    const { getStatusString, formatTimeFromISO } = useMainHooks();
    const navigate = useNavigate();
    const contextMenuRef = useRef(null);
    const messagesEndRef = useRef(null);
    const messagesAreaRef = useRef(null);
    const inputRef = useRef(null);

    const availableReactions = ['😊', '👍', '❤️', '😂', '😢'];

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!activeChat?.id || !userId) return;

            // Нормализация type
            const typeMap = {
                0: 'Chat',
                1: 'Group',
                2: 'Channel',
                3: 'Contact',
                4: 'User'
            };
            const chatType = typeMap[activeChat.type] || activeChat.type || (activeChat.secondUserId && !activeChat.membersCount ? 'User' : 'Group');

            // Устанавливаем secondUserId
            if (chatType === 'User' || chatType === 'Contact') {
                if (!activeChat.secondUserId) {
                    console.error('No secondUserId provided for User/Contact:', activeChat);
                    return;
                }
                setSecondUserId(activeChat.secondUserId);
            } else {
                setSecondUserId('00000000-0000-0000-0000-000000000000');
            }

            let chatId = activeChat.id;

            try {
                const response = await apiRequest(`/api/messages/chat/${chatId}`, {
                    method: 'GET',
                    authenticated: isAuthenticated
                });

                const messages = Array.isArray(response)
                    ? response.map(message => ({
                        ...message,
                        isUser: userId === message.senderId,
                        reactions: message.reactions || [],
                        replyTo: message.replyTo ? {
                            ...message.replyTo,
                            sender: message.replyTo.senderId === userId ? "You" : activeChat.secondUser?.username || activeChat.name
                        } : null
                    }))
                    : [];

                setMessages(messages);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };

        if (isLoading || !userId || !isAuthenticated) {
            if (!isAuthenticated) {
                logout();
                navigate('/');
            }
            return;
        }

        fetchData();
    }, [isLoading, userId, isAuthenticated, logout, activeChat, navigate]);

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
                        reactions: newMessage.reactions || [],
                        replyTo: newMessage.replyTo ? {
                            ...newMessage.replyTo,
                            sender: newMessage.replyTo.senderId === userId ? "You" : activeChat.secondUser?.username || activeChat.name
                        } : null
                    }];
                });
            }
        };

        connection.on('ReceiveMessage', handleNewMessage);
        return () => connection.off('ReceiveMessage', handleNewMessage);
    }, [connection, isConnected, activeChat, userId]);

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
            replyTo: replyingTo ? {
                id: replyingTo.id,
                comment: replyingTo.comment,
                senderId: replyingTo.senderId,
                sender: replyingTo.isUser ? username : activeChat.secondUser?.username || activeChat.name
            } : null
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');
        setReplyingTo(null);

        try {
            const typeMap = {
                0: 'Chat',
                1: 'Group',
                2: 'Channel',
                3: 'Contact',
                4: 'User'
            };
            const chatType = typeMap[activeChat.type] || activeChat.type || (activeChat.secondUserId && !activeChat.membersCount ? 'User' : 'Group');

            const recipientId = (chatType === 'User' || chatType === 'Contact')
                ? activeChat.secondUserId
                : '00000000-0000-0000-0000-000000000000';

            if (!recipientId && (chatType === 'User' || chatType === 'Contact')) {
                throw new Error('recipientId is required for User/Contact chats');
            }

            let chatId = (chatType === 'User' || chatType === 'Contact') && !activeChat.joined ? null : activeChat.id;

            // Проверяем формат chatId только если он не null
            if (chatId) {
                const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                if (!guidRegex.test(chatId)) {
                    throw new Error('Invalid chatId format');
                }
            }

            console.log('Sending message with params:', {
                chatId: chatId,
                recipientId: recipientId,
                message: message,
                tempId: tempId,
                replyToId: replyingTo?.id
            });

            if (!connection || connection.state !== 'Connected') {
                throw new Error('SignalR connection is not active');
            }
            console.log(chatId, recipientId, message, tempId);

            await connection.invoke(
                "SendMessage",
                chatId,
                recipientId,
                message,
                tempId,
                replyingTo?.id || null
            );
            setMessages(prev => prev.map(msg =>
                msg.id === tempId.toString() ? { ...msg, isTemporary: false } : msg
            ));
        } catch (error) {
            console.error("Ошибка отправки:", error);
            setMessages(prev => prev.filter(msg => msg.id !== tempId.toString()));
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
        const contextMenuHeight = 200;
        setContextMenu({
            messageId: message.id,
            x: rect.left,
            y: rect.top + window.scrollY - contextMenuHeight - 5
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
        const message = messages.find(msg => msg.id === messageId);
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
                        <div className={cl.avatar} style={{ backgroundColor: activeChat.avatarColor || '#ccc' }}>
                            {activeChat.avatarText || activeChat.name?.charAt(0) || 'U'}
                        </div>
                    </button>
                    <div className={cl.userDetails}>
                        <h3>{activeChat.secondUser?.username || activeChat.name || 'Без названия'}</h3>
                        <p className={cl.userStatus} data-status={getStatusString(activeChat.secondUser?.onlineStatus || 0)}>
                            {getStatusString(activeChat.secondUser?.onlineStatus || 0)}
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

            <div className={cl.messagesArea} ref={messagesAreaRef}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${cl.message} ${msg.isUser ? cl.userMessage : cl.contactMessage}`}
                        onContextMenu={(e) => handleContextMenu(e, msg)}
                    >
                        {msg.replyTo && (
                            <div className={cl.replyPreview}>
                                <div className={cl.replyLine}></div>
                                <div className={cl.replyContent}>
                                    <span className={cl.replyAuthor}>{msg.replyTo.sender}</span>
                                    <p className={cl.replyText}>{msg.replyTo.comment}</p>
                                </div>
                            </div>
                        )}
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
                <div ref={messagesEndRef} />
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

            {replyingTo && (
                <div className={cl.replyIndicator}>
                    <div className={cl.replyInfo}>
                        <span>Replying to {replyingTo.isUser ? "yourself" : activeChat.secondUser.username}</span>
                        <p>{replyingTo.comment}</p>
                    </div>
                    <button className={cl.cancelReply} onClick={cancelReply}>
                        <FiX />
                    </button>
                </div>
            )}

            <div className={cl.messageInputContainer}>
                <div className={cl.inputWrapper}>
                    <button className={cl.attachmentButton}>
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
                        name: activeChat.secondUser?.username || activeChat.name,
                        avatarText: activeChat.avatarText || activeChat.name?.charAt(0) || 'U',
                        avatarColor: activeChat.avatarColor || '#ccc',
                        status: getStatusString(activeChat.secondUser?.onlineStatus || 0),
                        isFavorite: activeChat.isFavorite || false,
                        tag: activeChat.secondUser?.contactTag || activeChat.tag || '#0000',
                        quote: activeChat.secondUser?.bio || activeChat.description || 'Статус пользователя'
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