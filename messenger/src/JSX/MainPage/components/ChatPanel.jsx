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

const ChatPanel = ({ onChatSelect }) => {
    const {isLoading, userId, username, isAuthenticated, logout} = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('favorites'); // Состояние для активной вкладки
    const [searchQuery, setSearchQuery] = useState(''); // Состояние для поискового запроса
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const [data, setData] = useState([]);

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
                
                console.log(userId, chatsResponse[0].lastMessage.senderId)
                
                console.log("Original:", chatsResponse);
                console.log("Enhanced:", enhancedChats); // Проверяем, что поле добавилось
    
                // 3. Обновляем состояние
                setUser({
                    username: profileResponse.username || username,
                    status: getStatusString(profileResponse.onlineStatus),
                    avatarUrl: '/default-avatar.png'
                });
                setData(enhancedChats); // ✅ Теперь должно работать
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
    }, [isLoading, userId, username, isAuthenticated, logout]);

    const getStatusString = (statusCode) => {
        switch(statusCode) {
            case 0: return 'offline';
            case 1: return 'online';
            case 2: return 'idle';
            case 3: return 'busy';
            default: return 'offline';
        }
    };

    function formatTimeFromISO(isoString) {
        if (!isoString) return ""; // Проверяем на пустую строку, null, undefined и т. д.
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return ""; 
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

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
    // ).filter((chat) =>
    //     chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );

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