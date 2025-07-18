import React, { useState, useEffect } from 'react';
import cl from '../styles/ChatPanel.module.css';
import ChatBox from './ChatBox';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoIosMore } from 'react-icons/io';
import { IoSearchOutline } from 'react-icons/io5';
import { IoStarOutline } from 'react-icons/io5';
import { FaEnvelope } from 'react-icons/fa';
import { FaGift } from 'react-icons/fa';
import { IoAddCircleOutline } from 'react-icons/io5';
import Modal from './Modal';
import AddContactModal from './AddContactModal';
import { apiRequest } from '../../../hooks/ApiRequest';
import { useAuth } from '../../../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import useMainHooks from '../../../hooks/UseMainHooks';

const ChatPanel = ({ connection, onChatSelect, isConnected }) => {
    const {isLoading, userId, username, isAuthenticated, logout} = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('favorites'); // Состояние для активной вкладки
    const [searchQuery, setSearchQuery] = useState(''); // Состояние для поискового запроса
    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const {getStatusString, formatTimeFromISO} = useMainHooks();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileResponse, chatsResponse] = await Promise.all([
                    apiRequest(`/api/user/${userId}`, {
                        method: 'GET',
                        authenticated: isAuthenticated
                    }),
                    apiRequest(`/api/chat/user/${userId}`, {
                        method: 'GET',
                        authenticated: isAuthenticated
                    })
                ]);

                const enhancedChats = Array.isArray(chatsResponse)
                ? chatsResponse.map(chat => ({
                      ...chat,
                      // Добавляем isSentByUser к lastMessage (если он есть)
                      lastMessage: chat.lastMessage
                          ? {
                                ...chat.lastMessage,
                                isSentByUser: userId === chat.lastMessage.senderId,
                            }
                          : null,
                  }))
                : chatsResponse;
                
                setUser({
                    username: profileResponse.username || username,
                    status: getStatusString(profileResponse.onlineStatus),
                    avatarUrl: '/default-avatar.png'
                });
                setData(enhancedChats);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
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
    }, [isLoading, userId, username, isAuthenticated, logout, navigate]);

    useEffect(() => {
        if (connection && isConnected && data.length > 0) {
            const unjoinedChats = data.filter((chat) => !chat.joined);

            unjoinedChats.forEach((chat) => {
                connection
                    .invoke('JoinChat', chat.id)
                    .then(() => {
                        setData((prev) =>
                            prev.map((c) => (c.id === chat.id ? { ...c, joined: true } : c))
                        );
                    })
                    .catch((error) => {
                        console.error(`Failed to join chat ${chat.id}:`, error);
                    });
            });
        }
    }, [connection, isConnected, data]);

    useEffect(() => {
        if (connection && isConnected) {
            connection.on('UpdateChatList', (updatedChat) => {
                setData((prev) => {
                    const existingChatIndex = prev.findIndex((chat) => chat.id === updatedChat.id);
                    if (existingChatIndex !== -1) {
                        const existingChat = prev[existingChatIndex];
                        
                        // Сохраняем информацию о пользователе из существующего чата
                        const secondUser = existingChat.secondUser || updatedChat.secondUser;
                        
                        // Объединяем данные
                        const mergedChat = {
                            ...existingChat,
                            ...updatedChat,
                            secondUser, // Сохраняем информацию о пользователе
                            lastMessage: updatedChat.lastMessage
                                ? {
                                    ...updatedChat.lastMessage,
                                    isSentByUser: userId === updatedChat.lastMessage.senderId,
                                  }
                                : existingChat.lastMessage,
                        };
                        
                        const newData = [...prev];
                        newData[existingChatIndex] = mergedChat;
                        return newData;
                    }
                    return [...prev, { ...updatedChat, joined: true }];
                });
            });
    
            return () => {
                connection.off('UpdateChatList');
            };
        }
    }, [connection, isConnected, userId]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleAddContactModal = () => {
        setIsAddContactModalOpen(!isAddContactModalOpen);
    };

    const handleChatClick = (chat) => {
        onChatSelect(chat);
    };

    const handleAddContact = (contactData) => {
        const newChat = {
            name: contactData.username || `Новый контакт (${contactData.phone})`,
            unread: 0,
            lastMessage: contactData.message || 'Новый контакт добавлен',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'online',
            isSentByUser: false,
            messageStatus: 'sent',
            isFavorite: false
        };

        setData([...data, newChat]);
    };

    // Функция для фильтрации чатов
    const filteredChats = (activeTab === 'favorites'
        ? data.filter((chat) => chat.isFavorite)
        : data)
        .filter((chat) => 
            chat.secondUser.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            // Если у чата нет lastMessage, ставим его в конец
            if (!a.lastMessage || !a.lastMessage.createdAt) return 1;
            if (!b.lastMessage || !b.lastMessage.createdAt) return -1;
            // Сортировка по убыванию времени (последние сообщения сверху)
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });

    return (
        <div className={cl.container}>
            {/* Шапка профиля с модальным окном */}
            <div className={cl.profileHeader}>
                <div className={cl.avatarContainer} onClick={toggleModal} style={{ cursor: 'pointer' }}>
                    <img src={user.avatarUrl} alt="Аватар" className={cl.avatarImage} />
                    <div className={`${cl.statusBadge} ${cl[user.status]}`}></div>
                </div>
                <div className={cl.profileInfo}>
                    <h3 className={cl.profileName}>{user.username}</h3>
                    <p className={cl.profileStatus}>{user.status}</p>
                </div>
                <div className={cl.profileActions}>
                    <button className={cl.iconButton}>
                        <IoSettingsOutline />
                    </button>
                    <button className={cl.iconButton}>
                        <IoIosMore />
                    </button>
                </div>
            </div>

            {/* Модальное окно профиля */}
            <Modal
                isOpen={isModalOpen}
                onClose={toggleModal}
                user={user}
            />

            {/* Модальное окно добавления контакта */}
            <AddContactModal
                isOpen={isAddContactModalOpen}
                onClose={toggleAddContactModal}
                onAddContact={handleAddContact}
            />

            {/* Кнопки "Подарки" и "Добавить чат" */}
            <div className={cl.actionButtons}>
                <button className={cl.actionButton}>
                    <FaGift className={cl.actionIcon} />
                    <span>Подарки</span>
                </button>
                <button className={cl.actionButton} onClick={toggleAddContactModal}>
                    <IoAddCircleOutline className={cl.actionIcon} />
                    <span>Добавить чат</span>
                </button>
            </div>

            {/* Поиск */}
            <div className={cl.searchPanel}>
                <div className={cl.searchInputContainer}>
                    <IoSearchOutline className={cl.searchIcon} />
                    <input
                        type="text"
                        placeholder="Поиск по каналам..."
                        className={cl.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Вкладки */}
            <div className={cl.tabsContainer}>
                <button
                    className={`${cl.tabButton} ${activeTab === 'favorites' ? cl.active : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    <IoStarOutline className={cl.tabIcon} />
                    <span>Избранное</span>
                </button>
                <button
                    className={`${cl.tabButton} ${activeTab === 'all' ? cl.active : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    <FaEnvelope className={cl.tabIcon} />
                    <span>Все каналы</span>
                </button>
            </div>

            {/* Список чатов */}
            <div className={cl.chatsList}>
                {filteredChats.map((chat, index) => (
                    <div key={index} onClick={() => handleChatClick(chat)} style={{ cursor: 'pointer' }}>
                        <ChatBox
                            name={chat.secondUser.username}
                            unread={10}
                            lastMessage={chat.lastMessage?.comment ?? "Нет сообщений"}
                            time={formatTimeFromISO(chat.lastMessage?.createdAt)}
                            status={getStatusString(chat.secondUser.onlineStatus)}
                            isFavorite={false}
                            messageStatus={"sent"}
                            isSentByUser={chat.lastMessage?.isSentByUser ?? false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatPanel;