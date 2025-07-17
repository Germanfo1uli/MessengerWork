// ChatPanelPreview.jsx
import React from 'react';
import styles from '../styles/ChatPanelPreview.module.css';

const ChatPanelPreview = ({
                              theme,
                              accentColor,
                              fontSize = 16,
                              fontFamily = 'system-ui',
                              spacing = 'normal',
                              avatarShape = 'round'
                          }) => {
    const getAvatarClass = () => {
        switch (avatarShape) {
            case 'square': return styles.square;
            case 'rounded-square': return styles.roundedSquare;
            default: return styles.round;
        }
    };

    const getSpacingClass = () => {
        switch (spacing) {
            case 'compact': return styles.compact;
            case 'spacious': return styles.spacious;
            default: return styles.normal;
        }
    };

    return (
        <div
            className={`${styles.previewPanel} ${getSpacingClass()}`}
            data-theme={theme}
            style={{
                '--accent-color': accentColor,
                '--font-size': `${fontSize}px`,
                '--font-family': fontFamily
            }}
        >
            <div className={styles.profileHeader}>
                <div className={`${styles.avatar} ${getAvatarClass()}`} style={{ borderColor: accentColor }}></div>
                <div className={styles.profileInfo}>
                    <h4>Пользователь</h4>
                    <p>В сети</p>
                </div>
            </div>
            <div className={styles.searchBar}></div>
            <div className={styles.chatList}>
                <div className={styles.chatItem} style={{ borderLeftColor: accentColor }}>
                    <div className={`${styles.chatAvatar} ${getAvatarClass()}`}></div>
                    <div className={styles.chatInfo}>
                        <h5>Чат 1</h5>
                        <p>Последнее сообщение...</p>
                    </div>
                </div>
                <div className={styles.chatItem}>
                    <div className={`${styles.chatAvatar} ${getAvatarClass()}`}></div>
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