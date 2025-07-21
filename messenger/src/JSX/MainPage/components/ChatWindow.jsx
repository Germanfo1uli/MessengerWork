import React, { useState, useEffect } from 'react';
import {
    FiSearch,
    FiPhone,
    FiMoreVertical,
    FiPaperclip,
    FiSmile,
    FiSend
} from 'react-icons/fi';
import UserProfileModal from './UserProfileModal';
import cl from '../styles/ChatWindow.module.css';
import { apiRequest } from '../../../hooks/ApiRequest';
import { useAuth } from '../../../hooks/UseAuth';
import useMainHooks from '../../../hooks/UseMainHooks';
import { useNavigate } from 'react-router-dom';

const ChatWindow = ({ connection, activeChat, setActiveChat, onToggleFavorite, isConnected }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const {isLoading, userId, username, isAuthenticated, logout} = useAuth();
    const {getStatusString, formatTimeFromISO} = useMainHooks();
    const [secondUserId, setSecondUserId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!activeChat?.id) return; // Добавляем проверку на наличие activeChat и его id

            setSecondUserId(activeChat.secondUserId)
            console.log(activeChat.id)

            try {
                const response = await apiRequest(`/api/messages/chat/${activeChat.id}`, {
                    method: 'GET',
                    authenticated: isAuthenticated
                });

                const messages = Array.isArray(response)
                ? response.map(message => ({
                      ...message,
                      isUser: userId === message.senderId,
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
                    // Пропускаем временные сообщения (они уже отображены)
                    if (newMessage.isTemporary) return prevMessages;
                    
                    // Проверяем дубликаты по ID или времени+отправителю
                    const isDuplicate = prevMessages.some(msg => 
                        msg.tempId === newMessage.tempId && 
                        msg.senderId === newMessage.senderId
                    );
                    
                    return isDuplicate ? prevMessages : [...prevMessages, {
                        ...newMessage,
                        isUser: userId === newMessage.senderId
                    }];
                });
            }
        };
    
        connection.on('ReceiveMessage', handleNewMessage);
        return () => connection.off('ReceiveMessage', handleNewMessage);
    }, [connection, isConnected, activeChat?.id, userId]);

    const handleSendMessage = async () => {
        if (!message.trim() || !activeChat?.id || !userId) return;
    
        // Генерируем временный ID для сообщения
        const tempId = Math.floor(10000000 + Math.random() * 90000000);
        
        // Оптимистичное обновление UI
        const newMessage = {
            id: tempId.toString(),
            tempId: tempId,
            comment: message,
            isUser: true,
            createdAt: new Date().toISOString(),
            senderId: userId,
            chatId: activeChat.id,
            isTemporary: true // Флаг для временных сообщений
        };
    
        setMessages(prev => [...prev, newMessage]);
        setMessage('');
    
        try {
            // Отправка на сервер
            var response = await connection.invoke("SendMessage",
                activeChat.id === '00000000-0000-0000-0000-000000000000' ? null : activeChat.id,
                secondUserId, message, tempId);
                
            console.log(response)

            if(activeChat.id === '00000000-0000-0000-0000-000000000000')
                setActiveChat((prev) => ({
                    ...prev,
                    id: response
                    }));

            // После успешной отправки помечаем сообщение как постоянное
            setMessages(prev => prev.map(msg => 
                msg.id === tempId ? { ...msg, isTemporary: false } : msg
            ));
        } catch (error) {
            console.error("Ошибка отправки:", error);
            // Удаляем временное сообщение при ошибке
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
            {/* Chat header */}
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

            {/* Search bar (visible when searching) */}
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

            {/* Messages area */}
            <div className={cl.messagesArea}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${cl.message} ${msg.isUser ? cl.userMessage : cl.contactMessage}`}
                    >
                        <div className={cl.messageContent}>
                            <p>{msg.comment}</p>
                            <span className={cl.messageTime}>{formatTimeFromISO(msg.createdAt)}</span>
                        </div>
                    </div>
                ))}
                <div className={cl.messageDecoration}></div>
            </div>

            {/* Message input */}
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

            {/* User Profile Modal */}
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