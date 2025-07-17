import React, { useState } from 'react';
import ChatPanel from './ChatPanel.jsx';
import useSignalR from '../../../hooks/UseSignalR.js';
import GroupNavigation from './GroupNavigation';
import ChatWindow from './ChatWindow';

const MainPage = () => {
    const [activeChat, setActiveChat] = useState(null);
    const { connection, isConnected, startConnection, stopConnection } = useSignalR();

    const handleChatSelect = (chat) => {
        setActiveChat({
            ...chat,
            avatarText: chat.secondUser.username
                .split(' ')
                .map(word => word.charAt(0))
                .join('')
                .slice(0, 2)
                .toUpperCase(),
            avatarColor: `hsl(${Math.random() * 360}, 70%, 40%)`
        });
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <GroupNavigation />
            <div style={{ width: '350px', minWidth: '350px', borderRight: '1px solid #2f3136' }}>
                <ChatPanel
                    connection={connection}
                    onChatSelect={handleChatSelect}
                    isConnected={isConnected}
                />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <ChatWindow
                    connection={connection}
                    activeChat={activeChat}
                    isConnected={isConnected}
                />
            </div>
        </div>
    );
};

export default MainPage;