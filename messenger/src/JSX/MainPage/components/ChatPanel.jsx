import React from 'react';
import cl from '../styles/ChatPanel.module.css'
import baseavatar from '../../../assets/images/baseavatar.jpg'
import ChatBox from './ChatBox'
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { IoSearchOutline } from 'react-icons/io5';
import { IoStarOutline } from 'react-icons/io5';
import { FaEnvelope } from 'react-icons/fa';

const ChatPanel = () => {
    const data = [
        {
            name: "Орбитальная станция",
            unread: 3,
            lastMessage: "Подготовка к стыковке нового модуля...",
            time: "12:45",
            status: "online"
        },
        {
            name: "Марсианская база",
            unread: 0,
            lastMessage: "Завершены геологические исследования...",
            time: "09:22",
            status: "idle"
        },
        {
            name: "Центр управления",
            unread: 7,
            lastMessage: "ТРЕВОГА: обнаружена аномалия в секторе 4...",
            time: "15:18",
            status: "busy"
        },
        {
            name: "Экипаж 'Прометей'",
            unread: 0,
            lastMessage: "Все системы в норме, продолжаем курс...",
            time: "07:33",
            status: "offline"
        }
    ]

    return (
        <div className={cl.container}>
            {/* Шапка профиля */}
            <div className={cl.profileHeader}>
                <div className={cl.avatarContainer}>
                    <img src={baseavatar} alt="Аватар" className={cl.avatarImage} />
                    <div className={cl.statusBadge}></div>
                </div>
                <div className={cl.profileInfo}>
                    <h3 className={cl.profileName}>Командир Ковальски</h3>
                    <p className={cl.profileStatus}>На связи</p>
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
                    <div key={index} className={cl.chatItem}>
                        <div className={cl.chatAvatar} data-status={chat.status}>
                            <span>{chat.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                        </div>
                        <div className={cl.chatContent}>
                            <div className={cl.chatHeader}>
                                <h4 className={cl.chatName}>{chat.name}</h4>
                                <span className={cl.chatTime}>{chat.time}</span>
                            </div>
                            <p className={cl.chatMessage}>
                                {chat.lastMessage}
                                {chat.unread > 0 && (
                                    <span className={cl.unreadCount}>{chat.unread}</span>
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatPanel;