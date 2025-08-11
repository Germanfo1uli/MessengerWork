import React, { useState, useEffect, useMemo, useRef } from 'react';
import cl from '../styles/ChatPanel.module.css';
import ChatBox from './ChatBox';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoIosMore } from 'react-icons/io';
import { IoSearchOutline } from 'react-icons/io5';
import { IoStarOutline } from 'react-icons/io5';
import { FaEnvelope, FaGift, FaShoppingCart, FaBox, FaAddressBook, FaQuestionCircle, FaBell } from 'react-icons/fa';
import Modal from './Modal';
import AddContactModal from './AddContactModal';
import HelpModal from './HelpModal';
import { apiRequest } from '../../../hooks/ApiRequest';
import { useAuth } from '../../../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import useMainHooks from '../../../hooks/UseMainHooks';
import debounce from 'lodash.debounce';
import { useTheme } from '../../SettingsPage/components/Context/ThemeContext';
import { useUser } from '../../SettingsPage/components/Context/UserContext';

const ChatPanel = ({ connection, onChatSelect, isConnected }) => {
    const { isLoading, userId, isAuthenticated, logout } = useAuth();
    const { user, updateUser } = useUser();
    const { themeSettings } = useTheme();
    const { theme, avatarBorderColor, backgroundColor } = themeSettings;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); // New state for HelpModal
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('favorites');
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            type: 'message',
            chatId: '123',
            message: 'Привет! Как дела?',
            username: 'Иван',
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            type: 'invitation',
            chatId: '456',
            username: 'Мария',
            createdAt: new Date(Date.now() - 3600000).toISOString()
        }
    ]);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
    const { formatTimeFromISO } = useMainHooks();
    const navigate = useNavigate();
    const moreButtonRef = useRef(null);
    const notificationsButtonRef = useRef(null);

    const fallbackUser = {
        username: user?.username || 'User',
        avatarUrl: user?.avatarUrl || '/default-avatar.png',
        status: user?.status || 'Offline'
    };

    const getThemeStyles = () => {
        switch (theme) {
            case 'cosmic':
                return {
                    containerBg: 'linear-gradient(180deg, #1a1a2e, #16213e)',
                    borderColor: 'rgba(138, 43, 226, 0.3)',
                    profileHeaderBg: 'rgba(20, 20, 50, 0.9)',
                    textColor: '#e0e0ff',
                    secondaryText: '#b0b0ff',
                    accentColor: '#8a2be2',
                    buttonHover: '#9b51e0',
                    menuBg: 'rgba(30, 30, 70, 0.98)',
                    inputBg: 'rgba(40, 40, 80, 0.7)',
                    inputBorder: 'rgba(138, 43, 226, 0.5)',
                    chatsListBg: 'rgba(15, 15, 35, 0.7)',
                    avatarBorder: '#8a2be2',
                    statusOnline: '#00ff9d',
                    statusIdle: '#f39c12',
                    statusBusy: '#e74c3c',
                    statusOffline: '#7b68ee',
                    notificationActive: '#ff4d4f',
                    noResultsBg: 'rgba(40, 40, 80, 0.5)',
                    noResultsBorder: 'rgba(138, 43, 226, 0.5)',
                    shadow: '0 4px 20px rgba(138, 43, 226, 0.25)',
                    hoverOpacity: '0.15',
                    tabActiveBg: 'rgba(138, 43, 226, 0.2)',
                    iconButtonBg: 'rgba(138, 43, 226, 0.2)',
                    iconButtonHoverBg: 'rgba(179, 136, 255, 0.3)',
                    searchInputBg: 'rgba(40, 40, 80, 0.7)',
                    searchBorder: 'rgba(138, 43, 226, 0.5)',
                    searchIconColor: '#b388ff',
                    iconButtonColor: '#b388ff',
                    iconButtonHoverColor: '#e1bee7'
                };
            case 'sunset':
                return {
                    containerBg: 'linear-gradient(180deg, #feb47b, #ff7e5f)',
                    borderColor: 'rgba(255, 126, 95, 0.3)',
                    profileHeaderBg: 'rgba(254, 180, 123, 0.9)',
                    textColor: '#5a2c0a',
                    secondaryText: '#7a4c2a',
                    accentColor: '#ff7e5f',
                    buttonHover: '#feb47b',
                    menuBg: 'rgba(254, 180, 123, 0.98)',
                    inputBg: 'rgba(255, 255, 255, 0.3)',
                    inputBorder: 'rgba(255, 126, 95, 0.5)',
                    chatsListBg: 'rgba(254, 180, 123, 0.7)',
                    avatarBorder: '#ff7e5f',
                    statusOnline: '#00cc66',
                    statusIdle: '#ff9900',
                    statusBusy: '#cc3300',
                    statusOffline: '#996633',
                    notificationActive: '#cc3300',
                    noResultsBg: 'rgba(255, 255, 255, 0.3)',
                    noResultsBorder: 'rgba(255, 126, 95, 0.4)',
                    shadow: '0 4px 20px rgba(255, 126, 95, 0.25)',
                    hoverOpacity: '0.2',
                    tabActiveBg: 'rgba(255, 126, 95, 0.25)',
                    iconButtonBg: 'rgba(255, 126, 95, 0.2)',
                    iconButtonHoverBg: 'rgba(254, 180, 123, 0.3)',
                    searchInputBg: 'rgba(255, 255, 255, 0.4)',
                    searchBorder: 'rgba(255, 126, 95, 0.6)',
                    searchIconColor: '#ff7e5f',
                    iconButtonColor: '#ff7e5f',
                    iconButtonHoverColor: '#ffb07b'
                };
            case 'ocean':
                return {
                    containerBg: 'linear-gradient(180deg, #00c6fb, #005bea)',
                    borderColor: 'rgba(0, 198, 251, 0.3)',
                    profileHeaderBg: 'rgba(0, 93, 234, 0.9)',
                    textColor: '#e0f7ff',
                    secondaryText: '#b0e7ff',
                    accentColor: '#00c6fb',
                    buttonHover: '#005bea',
                    menuBg: 'rgba(0, 93, 234, 0.98)',
                    inputBg: 'rgba(255, 255, 255, 0.3)',
                    inputBorder: 'rgba(0, 198, 251, 0.5)',
                    chatsListBg: 'rgba(0, 93, 234, 0.7)',
                    avatarBorder: '#00c6fb',
                    statusOnline: '#00ff9d',
                    statusIdle: '#ffcc00',
                    statusBusy: '#ff4d4f',
                    statusOffline: '#66ccff',
                    notificationActive: '#ff4d4f',
                    noResultsBg: 'rgba(255, 255, 255, 0.3)',
                    noResultsBorder: 'rgba(0, 198, 251, 0.4)',
                    shadow: '0 4px 20px rgba(0, 198, 251, 0.25)',
                    hoverOpacity: '0.2',
                    tabActiveBg: 'rgba(0, 198, 251, 0.25)',
                    iconButtonBg: 'rgba(0, 198, 251, 0.2)',
                    iconButtonHoverBg: 'rgba(0, 93, 234, 0.3)',
                    searchInputBg: 'rgba(255, 255, 255, 0.4)',
                    searchBorder: 'rgba(0, 198, 251, 0.6)',
                    searchIconColor: '#00c6fb',
                    iconButtonColor: '#00c6fb',
                    iconButtonHoverColor: '#66ccff'
                };
            case 'forest':
                return {
                    containerBg: 'linear-gradient(180deg, #38ef7d, #11998e)',
                    borderColor: 'rgba(56, 239, 125, 0.3)',
                    profileHeaderBg: 'rgba(17, 153, 142, 0.9)',
                    textColor: '#e0fff5',
                    secondaryText: '#b0ffea',
                    accentColor: '#00ff9d',
                    buttonHover: '#38ef7d',
                    menuBg: 'rgba(17, 153, 142, 0.98)',
                    inputBg: 'rgba(17, 153, 142, 0.3)',
                    inputBorder: 'rgba(56, 239, 125, 0.5)',
                    chatsListBg: 'rgba(17, 153, 142, 0.7)',
                    avatarBorder: '#00ff9d',
                    statusOnline: '#00ff9d',
                    statusIdle: '#ffcc00',
                    statusBusy: '#ff4d4f',
                    statusOffline: '#66cc99',
                    notificationActive: '#ff4d4f',
                    noResultsBg: 'rgba(255, 255, 255, 0.3)',
                    noResultsBorder: 'rgba(56, 239, 125, 0.4)',
                    shadow: '0 4px 20px rgba(56, 239, 125, 0.25)',
                    hoverOpacity: '0.2',
                    tabActiveBg: 'rgba(56, 239, 125, 0.25)',
                    iconButtonBg: 'rgba(0, 255, 157, 0.3)',
                    iconButtonHoverBg: 'rgba(56, 239, 125, 0.4)',
                    searchInputBg: 'rgba(17, 153, 142, 0.3)',
                    searchBorder: 'rgba(56, 239, 125, 0.6)',
                    searchIconColor: '#00ff9d',
                    iconButtonColor: '#ffffff',
                    iconButtonHoverColor: '#00ff9d'
                };
            case 'light':
                return {
                    containerBg: 'linear-gradient(180deg, #f0f0f0, #e0e0e0)',
                    borderColor: 'rgba(160, 160, 160, 0.2)',
                    profileHeaderBg: 'rgba(240, 240, 240, 0.9)',
                    textColor: '#333333',
                    secondaryText: '#666666',
                    accentColor: '#4b83f8',
                    buttonHover: '#6ba3ff',
                    menuBg: 'rgba(240, 240, 240, 0.98)',
                    inputBg: 'rgba(255, 255, 255, 0.95)',
                    inputBorder: 'rgba(160, 160, 160, 0.5)',
                    chatsListBg: 'rgba(240, 240, 240, 0.7)',
                    avatarBorder: '#4b83f8',
                    statusOnline: '#00cc66',
                    statusIdle: '#ff9900',
                    statusBusy: '#cc3300',
                    statusOffline: '#999999',
                    notificationActive: '#cc3300',
                    noResultsBg: 'rgba(255, 255, 255, 0.7)',
                    noResultsBorder: 'rgba(160, 160, 160, 0.4)',
                    shadow: '0 4px 20px rgba(160, 160, 160, 0.15)',
                    hoverOpacity: '0.15',
                    tabActiveBg: 'rgba(75, 131, 248, 0.2)',
                    iconButtonBg: 'rgba(75, 131, 248, 0.1)',
                    iconButtonHoverBg: 'rgba(107, 163, 255, 0.2)',
                    searchInputBg: 'rgba(255, 255, 255, 0.95)',
                    searchBorder: 'rgba(160, 160, 160, 0.5)',
                    searchIconColor: '#4b83f8',
                    iconButtonColor: '#4b83f8',
                    iconButtonHoverColor: '#6ba3ff'
                };
            default:
                return {
                    containerBg: 'linear-gradient(180deg, #1a1a2e, #16213e)',
                    borderColor: 'rgba(138, 43, 226, 0.3)',
                    profileHeaderBg: 'rgba(20, 20, 50, 0.9)',
                    textColor: '#e0e0ff',
                    secondaryText: '#b0b0ff',
                    accentColor: '#8a2be2',
                    buttonHover: '#9b51e0',
                    menuBg: 'rgba(30, 30, 70, 0.98)',
                    inputBg: 'rgba(40, 40, 80, 0.7)',
                    inputBorder: 'rgba(138, 43, 226, 0.5)',
                    chatsListBg: 'rgba(15, 15, 35, 0.7)',
                    avatarBorder: '#8a2be2',
                    statusOnline: '#00ff9d',
                    statusIdle: '#f39c12',
                    statusBusy: '#e74c3c',
                    statusOffline: '#7b68ee',
                    notificationActive: '#ff4d4f',
                    noResultsBg: 'rgba(40, 40, 80, 0.5)',
                    noResultsBorder: 'rgba(138, 43, 226, 0.5)',
                    shadow: '0 4px 20px rgba(138, 43, 226, 0.25)',
                    hoverOpacity: '0.15',
                    tabActiveBg: 'rgba(138, 43, 226, 0.2)',
                    iconButtonBg: 'rgba(138, 43, 226, 0.2)',
                    iconButtonHoverBg: 'rgba(179, 136, 255, 0.3)',
                    searchInputBg: 'rgba(40, 40, 80, 0.7)',
                    searchBorder: 'rgba(138, 43, 226, 0.5)',
                    searchIconColor: '#b388ff',
                    iconButtonColor: '#b388ff',
                    iconButtonHoverColor: '#e1bee7'
                };
        }
    };

    const themeStyles = getThemeStyles();

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
                    console.log(isAuthenticated);
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
                const chatsResponse = await apiRequest(`/api/chat/user/${userId}`, {
                    method: 'GET',
                    authenticated: isAuthenticated
                });

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
                setData(enhancedChats);

                if (!user?.username || !user?.avatarUrl || !user?.status) {
                    try {
                        const profileResponse = await apiRequest(`/api/user/${userId}`, {
                            method: 'GET',
                            authenticated: isAuthenticated
                        });
                        updateUser({
                            username: profileResponse.username || 'User',
                            avatarUrl: profileResponse.avatarUrl || '/default-avatar.png',
                            status: profileResponse.status || 'Offline'
                        });
                    } catch (error) {
                        console.error('Failed to fetch user profile:', error);
                        updateUser({
                            username: 'User',
                            avatarUrl: '/default-avatar.png',
                            status: 'Offline'
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch chats:', error);
            }
        };

        if (isLoading || !userId) {
            return;
        }

        if (!isAuthenticated && !isLoading) {
            logout();
            navigate('/');
            return;
        }

        fetchData();
    }, [isLoading, userId, isAuthenticated, logout, navigate, user, updateUser]);

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

                if (updatedChat.lastMessage && updatedChat.lastMessage.senderId !== userId) {
                    setNotifications((prev) => [
                        ...prev,
                        {
                            id: `${updatedChat.id}-${Date.now()}`,
                            type: 'message',
                            chatId: updatedChat.id,
                            message: updatedChat.lastMessage.comment,
                            username: updatedChat.secondUser?.username || 'Unknown',
                            createdAt: updatedChat.lastMessage.createdAt
                        }
                    ]);
                    setHasUnreadNotifications(true);
                }
            });

            connection.on('ReceiveInvitation', (invitation) => {
                setNotifications((prev) => [
                    ...prev,
                    {
                        id: `${invitation.chatId}-${Date.now()}`,
                        type: 'invitation',
                        chatId: invitation.chatId,
                        username: invitation.senderUsername || 'Unknown',
                        createdAt: new Date().toISOString()
                    }
                ]);
                setHasUnreadNotifications(true);
            });

            return () => {
                connection.off('UpdateChatList');
                connection.off('ReceiveInvitation');
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
            if (notificationsButtonRef.current && !notificationsButtonRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
                setHasUnreadNotifications(false);
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

    const toggleHelpModal = () => {
        setIsHelpModalOpen(!isHelpModalOpen); // Toggle HelpModal
    };

    const toggleMoreMenu = () => {
        setIsMoreMenuOpen(!isMoreMenuOpen);
    };

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        if (isNotificationsOpen) {
            setHasUnreadNotifications(false);
        }
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

    const getChatStatusClass = (onlineStatus) => {
        switch (onlineStatus) {
            case 1:
                return cl.online;
            case 0:
                return cl.offline;
            case 2:
                return cl.idle;
            case 3:
                return cl.busy;
            default:
                return cl.offline;
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
        <div
            className={cl.container}
            style={{
                background: themeStyles.containerBg,
                borderRight: `1px solid ${themeStyles.borderColor}`,
                boxShadow: themeStyles.shadow
            }}
        >
            <div
                className={cl.profileHeader}
                style={{ background: themeStyles.profileHeaderBg }}
            >
                <div className={cl.avatarContainer} onClick={toggleModal}>
                    {avatarError || !fallbackUser.avatarUrl ? (
                        <div
                            className={cl.avatarPlaceholder}
                            style={{
                                border: `2px solid ${themeStyles.avatarBorder}`,
                                background: `linear-gradient(135deg, ${themeStyles.accentColor}, ${themeStyles.buttonHover})`,
                                color: themeStyles.textColor
                            }}
                        >
                            {(fallbackUser.username && fallbackUser.username.length > 0) ? fallbackUser.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                    ) : (
                        <img
                            src={fallbackUser.avatarUrl}
                            alt="Аватар"
                            className={cl.avatarImage}
                            onError={handleAvatarError}
                            style={{ border: `2px solid ${themeStyles.avatarBorder}` }}
                        />
                    )}
                    <div
                        className={`${cl.statusBadge} ${fallbackUser.status.toLowerCase() === 'online' ? cl.online : cl.offline}`}
                        style={{
                            border: `2px solid ${themeStyles.profileHeaderBg}`,
                            background: fallbackUser.status.toLowerCase() === 'online' ? themeStyles.statusOnline : themeStyles.statusOffline
                        }}
                    ></div>
                </div>
                <div className={cl.profileInfo}>
                    <h3
                        className={cl.profileName}
                        style={{ color: themeStyles.textColor }}
                    >
                        {fallbackUser.username || 'User'}
                    </h3>
                    <p
                        className={cl.profileStatus}
                        style={{ color: themeStyles.secondaryText }}
                    >
                        {fallbackUser.status || 'Offline'}
                    </p>
                </div>
                <div className={cl.profileActions}>
                    <div className={cl.notificationsContainer} ref={notificationsButtonRef}>
                        <button
                            className={`${cl.iconButton} ${hasUnreadNotifications ? cl.notificationActive : ''}`}
                            onClick={toggleNotifications}
                            title="Уведомления"
                            style={{
                                color: hasUnreadNotifications ? themeStyles.notificationActive : themeStyles.accentColor
                            }}
                        >
                            <FaBell />
                        </button>
                        {isNotificationsOpen && (
                            <div
                                className={cl.notificationsMenu}
                                style={{
                                    background: themeStyles.menuBg,
                                    border: `1px solid ${themeStyles.borderColor}`,
                                    boxShadow: themeStyles.shadow
                                }}
                            >
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={cl.notificationItem}
                                            style={{ color: themeStyles.textColor }}
                                        >
                                            <span>
                                                {notification.type === 'message'
                                                    ? `Новое сообщение от ${notification.username}: ${notification.message}`
                                                    : `Новое приглашение от ${notification.username}`}
                                            </span>
                                            <span
                                                className={cl.notificationTime}
                                                style={{ color: themeStyles.secondaryText }}
                                            >
                                                {formatTimeFromISO(notification.createdAt)}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        className={cl.noNotifications}
                                        style={{ color: themeStyles.secondaryText }}
                                    >
                                        Нет новых уведомлений
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        className={cl.iconButton}
                        onClick={() => navigate('/settings')}
                        style={{ color: themeStyles.accentColor }}
                    >
                        <IoSettingsOutline />
                    </button>
                    <div className={cl.moreMenuContainer} ref={moreButtonRef}>
                        <button
                            className={cl.iconButton}
                            onClick={toggleMoreMenu}
                            title="Ещё"
                            style={{ color: themeStyles.accentColor }}
                        >
                            <IoIosMore />
                        </button>
                        {isMoreMenuOpen && (
                            <div
                                className={cl.moreMenu}
                                style={{
                                    background: themeStyles.menuBg,
                                    border: `1px solid ${themeStyles.borderColor}`,
                                    boxShadow: themeStyles.shadow
                                }}
                            >
                                <button
                                    className={cl.moreMenuItem}
                                    onClick={() => navigate('/gift')}
                                    style={{ color: themeStyles.textColor }}
                                >
                                    <FaGift className={cl.moreMenuIcon} />
                                    <span>Подарки</span>
                                </button>
                                <button
                                    className={cl.moreMenuItem}
                                    onClick={() => navigate('/marketplace')}
                                    style={{ color: themeStyles.textColor }}
                                >
                                    <FaShoppingCart className={cl.moreMenuIcon} />
                                    <span>Торговая площадка</span>
                                </button>
                                <button
                                    className={cl.moreMenuItem}
                                    onClick={() => navigate('/inventory')}
                                    style={{ color: themeStyles.textColor }}
                                >
                                    <FaBox className={cl.moreMenuIcon} />
                                    <span>Инвентарь</span>
                                </button>
                                <button
                                    className={cl.moreMenuItem}
                                    onClick={() => navigate('/contacts')}
                                    style={{ color: themeStyles.textColor }}
                                >
                                    <FaAddressBook className={cl.moreMenuIcon} />
                                    <span>Контакты</span>
                                </button>
                                <button
                                    className={cl.moreMenuItem}
                                    onClick={toggleHelpModal} // Updated to toggle HelpModal
                                    style={{ color: themeStyles.textColor }}
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
                user={fallbackUser}
            />

            <AddContactModal
                isOpen={isAddContactModalOpen}
                onClose={toggleAddContactModal}
                onAddContact={handleAddContact}
            />

            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={toggleHelpModal}
            />

            <div
                className={cl.searchPanel}
                style={{ background: themeStyles.profileHeaderBg }}
            >
                <div
                    className={cl.searchInputContainer}
                    style={{
                        background: themeStyles.searchInputBg,
                        border: `1px solid ${themeStyles.searchBorder}`,
                        boxShadow: themeStyles.shadow
                    }}
                >
                    <IoSearchOutline
                        className={cl.searchIcon}
                        style={{ color: themeStyles.searchIconColor }}
                    />
                    <input
                        type="text"
                        placeholder="Поиск по каналам..."
                        className={cl.searchInput}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{ color: themeStyles.textColor }}
                    />
                </div>
            </div>

            <div
                className={cl.tabsContainer}
                style={{
                    background: themeStyles.profileHeaderBg,
                    borderBottom: `1px solid ${themeStyles.borderColor}`
                }}
            >
                <button
                    className={`${cl.tabButton} ${activeTab === 'favorites' ? cl.active : ''}`}
                    onClick={() => setActiveTab('favorites')}
                    style={{
                        color: activeTab === 'favorites' ? themeStyles.textColor : themeStyles.secondaryText,
                        background: activeTab === 'favorites' ? themeStyles.tabActiveBg : 'transparent'
                    }}
                >
                    <IoStarOutline className={cl.tabIcon} />
                    <span>Избранное</span>
                </button>
                <button
                    className={`${cl.tabButton} ${activeTab === 'all' ? cl.active : ''}`}
                    onClick={() => setActiveTab('all')}
                    style={{
                        color: activeTab === 'all' ? themeStyles.textColor : themeStyles.secondaryText,
                        background: activeTab === 'all' ? themeStyles.tabActiveBg : 'transparent'
                    }}
                >
                    <FaEnvelope className={cl.tabIcon} />
                    <span>Все каналы</span>
                </button>
            </div>

            <div
                className={cl.chatsList}
                style={{
                    background: themeStyles.chatsListBg,
                    overflowY: 'auto',
                    flexGrow: 1
                }}
            >
                {filteredChats.length > 0 ? (
                    filteredChats.map((chat, index) => (
                        <div key={index} onClick={() => handleChatClick(chat)} style={{ cursor: 'pointer' }}>
                            <ChatBox
                                name={chat.secondUser.username}
                                unread={10}
                                lastMessage={chat.lastMessage?.comment ?? "Нет сообщений"}
                                time={formatTimeFromISO(chat.lastMessage?.createdAt)}
                                statusClass={getChatStatusClass(chat.secondUser.onlineStatus)}
                                isFavorite={chat.isFavorite}
                                messageStatus={"sent"}
                                isSentByUser={chat.lastMessage?.isSentByUser ?? false}
                            />
                        </div>
                    ))
                ) : searchQuery ? (
                    <div
                        className={cl.noResultsContainer}
                        style={{
                            background: themeStyles.noResultsBg,
                            border: `1px dashed ${themeStyles.noResultsBorder}`,
                            boxShadow: themeStyles.shadow
                        }}
                    >
                        <div
                            className={cl.noResultsIcon}
                            style={{ color: themeStyles.accentColor }}
                        >
                            <IoSearchOutline />
                        </div>
                        <h4
                            className={cl.noResultsTitle}
                            style={{ color: themeStyles.textColor }}
                        >
                            Ничего не найдено
                        </h4>
                        <p
                            className={cl.noResultsText}
                            style={{ color: themeStyles.secondaryText }}
                        >
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