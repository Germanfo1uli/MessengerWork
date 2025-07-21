import React, { useState, useEffect, useMemo, useRef } from 'react';
import cl from '../styles/ChatPanel.module.css';
import ChatBox from './ChatBox';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoIosMore } from 'react-icons/io';
import { IoSearchOutline } from 'react-icons/io5';
import { IoStarOutline } from 'react-icons/io5';
import { FaEnvelope, FaGift, FaShoppingCart, FaBox, FaAddressBook, FaQuestionCircle } from 'react-icons/fa';
import Modal from './Modal';
import AddContactModal from './AddContactModal';
import { apiRequest } from '../../../hooks/ApiRequest';
import { useAuth } from '../../../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import useMainHooks from '../../../hooks/UseMainHooks';
import debounce from 'lodash.debounce';

const ChatPanel = ({ connection, onChatSelect, isConnected }) => {
    const { isLoading, userId, username, isAuthenticated, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('favorites');
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const { getStatusString, formatTimeFromISO } = useMainHooks();
    const navigate = useNavigate();
    const moreButtonRef = useRef(null);

    const debouncedServerSearch = useMemo(
        () =>
            debounce(async (query) => {
                if (query.length <= 1) {
                    setSearchResults([]);
                    setIsSearching(false);
                    return;
                }

                setIsSearching(true);
                try {
                    const response = await apiRequest(`/api/chat/search?userId=${userId}&query=${encodeURIComponent(query.substring(1))}`, {
                        method: 'GET',
                        authenticated: isAuthenticated
                    });

                    const enhancedChats = Array.isArray(response)
                        ? response.map(chat => ({
                            id: chat.id,
                            publicId: chat.publicId,
                            isFavorite: chat.isFavorite,
                            firstUserId: chat.firstUserId,
                            secondUserId: chat.secondUserId,
                            createdAt: chat.createdAt,
                            lastMessageAt: chat.lastMessageAt,
                            lastMessage: chat.lastMessage
                                ? {
                                    id: chat.lastMessage.id,
                                    chatId: chat.lastMessage.chatId,
                                    senderId: chat.lastMessage.senderId,
                                    comment: chat.lastMessage.comment,
                                    createdAt: chat.lastMessage.createdAt,
                                    username: chat.lastMessage.username,
                                    avatarImageId: chat.lastMessage.avatarImageId,
                                    isSentByUser: userId === chat.lastMessage.senderId
                                }
                                : null,
                            secondUser: {
                                username: chat.secondUser?.username ?? '',
                                onlineStatus: chat.secondUser?.onlineStatus ?? 0,
                                contactTag: chat.secondUser?.contactTag
                            },
                            joined: false
                        }))
                        : [];
                    setSearchResults(enhancedChats);
                } catch (error) {
                    console.error('Failed to search chats:', error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            }, 500),
        [isAuthenticated, userId]
    );

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
                        lastMessage: chat.lastMessage
                            ? {
                                ...chat.lastMessage,
                                isSentByUser: userId === chat.lastMessage.senderId
                            }
                            : null,
                        joined: false
                    }))
                    : [];

                setUser({
                    username: profileResponse.username || username,
                    status: getStatusString(profileResponse.onlineStatus),
                    avatarUrl: profileResponse.avatarUrl || '/default-avatar.png'
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
                        const secondUser = existingChat.secondUser || updatedChat.secondUser;
                        const mergedChat = {
                            ...existingChat,
                            ...updatedChat,
                            secondUser,
                            lastMessage: updatedChat.lastMessage
                                ? {
                                    ...updatedChat.lastMessage,
                                    isSentByUser: userId === updatedChat.lastMessage.senderId
                                }
                                : existingChat.lastMessage
                        };
                        const newData = [...prev];
                        newData[existingChatIndex] = mergedChat;
                        return newData;
                    }
                    return [...prev, { ...updatedChat, joined: false }];
                });
            });

            return () => {
                connection.off('UpdateChatList');
            };
        }
    }, [connection, isConnected, userId]);

    useEffect(() => {
        return () => {
            debouncedServerSearch.cancel();
        };
    }, [debouncedServerSearch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreButtonRef.current && !moreButtonRef.current.contains(event.target)) {
                setIsMoreMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleAddContactModal = () => {
        setIsAddContactModalOpen(!isAddContactModalOpen);
    };

    const toggleMoreMenu = () => {
        setIsMoreMenuOpen(!isMoreMenuOpen);
    };

    const handleChatClick = (chat) => {
        if (chat.id === '00000000-0000-0000-0000-000000000000') {
            setData((prev) => {
                if (!prev.some(c => c.secondUserId === chat.secondUserId)) {
                    return [...prev, { ...chat, joined: false }];
                }
                return prev;
            });
        }
        onChatSelect(chat);
    };

    const handleAddContact = (contactData) => {
        const newChat = {
            id: '00000000-0000-0000-0000-000000000000',
            publicId: 0,
            isFavorite: false,
            firstUserId: userId,
            secondUserId: contactData.userId || '00000000-0000-0000-0000-000000000000',
            createdAt: new Date().toISOString(),
            lastMessageAt: null,
            lastMessage: null,
            secondUser: {
                username: contactData.username || `Новый контакт (${contactData.phone})`,
                onlineStatus: 1,
                contactTag: null
            },
            joined: false
        };
        setData([...data, newChat]);
    };

    const handleAvatarError = () => {
        setAvatarError(true);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.startsWith('@')) {
            debouncedServerSearch(query);
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    };

    const filteredChats = useMemo(() => {
        const source = searchQuery.startsWith('@') ? searchResults : data;
        return (activeTab === 'favorites' ? source.filter((chat) => chat.isFavorite) : source)
            .filter((chat) =>
                chat.secondUser.username.toLowerCase().includes(
                    searchQuery.startsWith('@') ? searchQuery.substring(1).toLowerCase() : searchQuery.toLowerCase()
                )
            )
            .sort((a, b) => {
                if (!a.lastMessage || !a.lastMessage.createdAt) return 1;
                if (!b.lastMessage || !b.lastMessage.createdAt) return -1;
                return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
            });
    }, [data, searchResults, activeTab, searchQuery]);

    return (
        <div className={cl.container}>
            <div className={cl.profileHeader}>
                <div className={cl.avatarContainer} onClick={toggleModal} style={{ cursor: 'pointer' }}>
                    {avatarError || !user.avatarUrl ? (
                        <div className={cl.avatarPlaceholder}>
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    ) : (
                        <img
                            src={user.avatarUrl}
                            alt="Аватар"
                            className={cl.avatarImage}
                            onError={handleAvatarError}
                        />
                    )}
                    <div className={`${cl.statusBadge} ${cl[user.status]}`}></div>
                </div>
                <div className={cl.profileInfo}>
                    <h3 className={cl.profileName}>{user.username}</h3>
                    <p className={cl.profileStatus}>{user.status}</p>
                </div>
                <div className={cl.profileActions}>
                    <button
                        className={`${cl.iconButton} ${cl.giftButton}`}
                        onClick={() => navigate('/gift')}
                        title="Подарки"
                    >
                        <FaGift className={cl.giftIcon} />
                    </button>
                    <button
                        className={cl.iconButton}
                        onClick={() => navigate('/settings')}
                    >
                        <IoSettingsOutline />
                    </button>
                    <div className={cl.moreMenuContainer} ref={moreButtonRef}>
                        <button
                            className={cl.iconButton}
                            onClick={toggleMoreMenu}
                            title="Ещё"
                        >
                            <IoIosMore />
                        </button>
                        {isMoreMenuOpen && (
                            <div className={cl.moreMenu}>
                                <button
                                    className={cl.moreMenuItem}
                                    onClick={() => navigate('/marketplace')}
                                >
                                    <FaShoppingCart className={cl.moreMenuIcon} />
                                    <span>Торговая площадка</span>
                                </button>
                                <button
                                    className={cl.moreMenuItem}
                                    onClick={() => navigate('/inventory')}
                                >
                                    <FaBox className={cl.moreMenuIcon} />
                                    <span>Инвентарь</span>
                                </button>
                                <button
                                    className={cl.moreMenuItem}
                                    onClick={() => navigate('/contacts')}
                                >
                                    <FaAddressBook className={cl.moreMenuIcon} />
                                    <span>Контакты</span>
                                </button>
                                <button
                                    className={cl.moreMenuItem}
                                    onClick={() => navigate('/help')}
                                >
                                    <FaQuestionCircle className={cl.moreMenuIcon} />
                                    <span>Помощь</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={toggleModal}
                user={user}
            />

            <AddContactModal
                isOpen={isAddContactModalOpen}
                onClose={toggleAddContactModal}
                onAddContact={handleAddContact}
            />

            <div className={cl.searchPanel}>
                <div className={cl.searchInputContainer}>
                    <IoSearchOutline className={cl.searchIcon} />
                    <input
                        type="text"
                        placeholder="Поиск по каналам..."
                        className={cl.searchInput}
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

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

            <div className={cl.chatsList}>
                {filteredChats.length > 0 ? (
                    filteredChats.map((chat, index) => (
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
                    ))
                ) : searchQuery ? (
                    <div className={cl.noResultsContainer}>
                        <div className={cl.noResultsIcon}>
                            <IoSearchOutline />
                        </div>
                        <h4 className={cl.noResultsTitle}>Ничего не найдено</h4>
                        <p className={cl.noResultsText}>
                            {searchQuery.startsWith('@')
                                ? `Пользователь "${searchQuery.substring(1)}" не найден`
                                : `Чаты по запросу "${searchQuery}" не найдены`}
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ChatPanel;