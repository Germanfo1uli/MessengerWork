
import React from 'react';
import styles from '../styles/ChatPanelPreview.module.css';

const ChatPanelPreview = ({ theme, accentColor }) => {
    return (
        <div className={styles.previewPanel} data-theme={theme}>
            <div className={styles.profileHeader}>
                <div className={styles.avatar} style={{ borderColor: accentColor }}></div>
                <div className={styles.profileInfo}>
                    <h4>Пользователь</h4>
                    <p>В сети</p>
                </div>
            </div>
            <div className={styles.searchBar}></div>
            <div className={styles.chatList}>
                <div className={styles.chatItem} style={{ borderLeftColor: accentColor }}>
                    <div className={styles.chatAvatar}></div>
                    <div className={styles.chatInfo}>
                        <h5>Чат 1</h5>
                        <p>Последнее сообщение...</p>
                    </div>
                </div>
                <div className={styles.chatItem}>
                    <div className={styles.chatAvatar}></div>
                    <div className={styles.chatInfo}>
                        <h5>Чат 2</h5>
                        <p>Последнее сообщение...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPanelPreview;