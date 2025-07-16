import React, { useState } from 'react';
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

const ChatPanel = ({ onChatSelect }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    const [user] = useState({
        username: 'Командир Ковальски',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        bannerUrl: 'https://picsum.photos/600/200?random=1',
        lastSeen: 'На связи',
        status: 'online',
        quote: 'Каждый шаг становится бременем... Я теряю себя в лабиринте своих сомнений.',
        playingWorktest: true,
        editProfile: true,
        doNotDisturb: false,
        switchAccounts: false,
        copyUserId: false
    });

    const [data, setData] = useState([
        {
            name: 'Орбитальная станция',
            unread: 3,
            lastMessage: 'Подготовка к стыковке нового модуля...',
            time: '12:45',
            status: 'online',
            isSentByUser: false,
            messageStatus: 'read'
        },
        {
            name: 'Марсианская база',
            unread: 0,
            lastMessage: 'Завершены геологические исследования...',
            time: '09:22',
            status: 'idle',
            isSentByUser: true,
            messageStatus: 'delivered'
        },
        {
            name: 'Центр управления',
            unread: 7,
            lastMessage: 'ТРЕВОГА: обнаружена аномалия в секторе 4...',
            time: '15:18',
            status: 'busy',
            isSentByUser: false,
            messageStatus: 'sent'
        },
        {
            name: 'Экипаж "Прометей"',
            unread: 0,
            lastMessage: 'Все системы в норме, продолжаем курс...',
            time: '07:33',
            status: 'offline',
            isSentByUser: true,
            messageStatus: 'sending'
        },
    ]);

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
        // Здесь должна быть логика добавления контакта
        // Для примера просто добавим новый чат
        const newChat = {
            name: contactData.username || `Новый контакт (${contactData.phone})`,
            unread: 0,
            lastMessage: contactData.message || 'Новый контакт добавлен',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'online',
            isSentByUser: false,
            messageStatus: 'sent'
        };

        setData([...data, newChat]);
    };

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
                    <p className={cl.profileStatus}>{user.lastSeen}</p>
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
                    />
                </div>
            </div>

            {/* Вкладки */}
            <div className={cl.tabsContainer}>
                <button className={`${cl.tabButton} ${cl.active}`}>
                    <IoStarOutline className={cl.tabIcon} />
                    <span>Избранное</span>
                </button>
                <button className={cl.tabButton}>
                    <FaEnvelope className={cl.tabIcon} />
                    <span>Все каналы</span>
                </button>
            </div>

            {/* Список чатов */}
            <div className={cl.chatsList}>
                {data.map((chat, index) => (
                    <div key={index} onClick={() => handleChatClick(chat)} style={{ cursor: 'pointer' }}>
                        <ChatBox
                            name={chat.name}
                            unread={chat.unread}
                            lastMessage={chat.lastMessage}
                            time={chat.time}
                            status={chat.status}
                            isFavorite={true}
                            messageStatus={chat.messageStatus}
                            isSentByUser={chat.isSentByUser}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatPanel;