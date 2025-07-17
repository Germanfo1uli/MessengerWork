// ChatWindowPreview.js
import React from 'react';
import styles from '../styles/ChatWindowPreview.module.css';

const ChatWindowPreview = ({ theme, chatStyle, accentColor, fontSize }) => {
    const getMessageStyle = () => {
        switch (chatStyle) {
            case 'bubbles':
                return styles.bubbles;
            case 'minimal':
                return styles.minimal;
            case 'compact':
                return styles.compact;
            default:
                return styles.bubbles;
        }
    };

    return (
        <div className={styles.previewWindow} data-theme={theme}>
            <div className={styles.chatHeader}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}></div>
                    <h4>Чат</h4>
                </div>
            </div>
            <div className={styles.messages} style={{ fontSize: `${fontSize}px` }}>
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
            <div className={styles.inputArea}></div>
        </div>
    );
};

export default ChatWindowPreview;