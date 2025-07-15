import React, { useState, useEffect } from 'react';
import {
    FiSearch,
    FiPhone,
    FiMoreVertical,
    FiPaperclip,
    FiSmile,
    FiSend
} from 'react-icons/fi';
import cl from '../styles/ChatWindow.module.css';

const ChatWindow = ({ activeChat }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (activeChat) {

            setMessages([
                { id: 1, text: 'Привет! Как дела?', isUser: false, time: '12:30' },
                { id: 2, text: 'Привет! Все отлично, спасибо!', isUser: true, time: '12:32' },
                { id: 3, text: 'Что планируешь на выходные?', isUser: false, time: '12:33' },
                { id: 4, text: 'Пока не решил, может сходим куда-нибудь?', isUser: true, time: '12:35' },
            ]);
        }
    }, [activeChat]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message,
                isUser: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleAvatarClick = () => {
        console.log(`Clicked on ${activeChat?.name}'s avatar`);

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
                        <h3>{activeChat.name}</h3>
                        <p className={cl.userStatus} data-status={activeChat.status}>
                            {activeChat.status === 'online' ? 'В сети' : 'Не в сети'}
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
                            <p>{msg.text}</p>
                            <span className={cl.messageTime}>{msg.time}</span>
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
        </div>
    );
};

export default ChatWindow;