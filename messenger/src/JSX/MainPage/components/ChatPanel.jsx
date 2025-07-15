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

const ChatPanel = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const data = [
        {
            name: 'Орбитальная станция',
            unread: 3,
            lastMessage: 'Подготовка к стыковке нового модуля...',
            time: '12:45',
            status: 'online',
        },
        {
            name: 'Марсианская база',
            unread: 0,
            lastMessage: 'Завершены геологические исследования...',
            time: '09:22',
            status: 'idle',
        },
        {
            name: 'Центр управления',
            unread: 7,
            lastMessage: 'ТРЕВОГА: обнаружена аномалия в секторе 4...',
            time: '15:18',
            status: 'busy',
        },
        {
            name: 'Экипаж "Прометей"',
            unread: 0,
            lastMessage: 'Все системы в норме, продолжаем курс...',
            time: '07:33',
            status: 'offline',
        },
    ];

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
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

            {/* Кнопки "Подарки" и "Добавить чат" */}
            <div className={cl.actionButtons}>
                <button className={cl.actionButton}>
                    <FaGift className={cl.actionIcon} />
                    <span>Подарки</span>
                </button>
                <button className={cl.actionButton}>
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
                    <ChatBox
                        key={index}
                        name={chat.name}
                        unread={chat.unread}
                        lastMessage={chat.lastMessage}
                        time={chat.time}
                        status={chat.status}
                        isFavorite={true}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChatPanel;