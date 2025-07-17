import React from 'react';
import styles from '../styles/ChatWindowPreview.module.css';

const ChatWindowPreview = ({
                               theme,
                               chatStyle = 'bubbles',
                               accentColor,
                               fontSize = 16,
                               fontFamily = 'system-ui',
                               cornerRadius = 12,
                               showShadow = true,
                               customBackground = null,
                               backgroundBlur = 0,
                               backgroundOpacity = 1
                           }) => {
    const getMessageStyle = () => {
        switch (chatStyle) {
            case 'minimal': return styles.minimal;
            case 'compact': return styles.compact;
            default: return styles.bubbles;
        }
    };

    return (
        <div
            className={styles.previewWindow}
            data-theme={theme}
            style={{
                '--accent-color': accentColor,
                '--font-size': `${fontSize}px`,
                '--font-family': fontFamily,
                '--corner-radius': `${cornerRadius}px`,
                '--message-shadow': showShadow ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                ...(customBackground && {
                    '--background-image': `url(${customBackground})`,
                    '--background-filter': `blur(${backgroundBlur}px)`,
                    '--background-opacity': backgroundOpacity
                })
            }}
        >
            <div className={styles.chatHeader}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}></div>
                    <h4>Чат</h4>
                </div>
            </div>
            <div className={styles.messages}>
                <div className={`${styles.message} ${styles.incoming} ${getMessageStyle()}`}>
                    Привет! Как дела?
                </div>
                <div
                    className={`${styles.message} ${styles.outgoing} ${getMessageStyle()}`}
                    style={{ backgroundColor: accentColor }}
                >
                    Отлично, спасибо!
                </div>
            </div>
            <div className={styles.inputArea}>
                <input type="text" placeholder="Написать сообщение..." />
                <button className={styles.sendButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatWindowPreview;