import React from 'react';
import styles from '../styles/GroupNavigationPreview.module.css';

const GroupNavigationPreview = ({ theme }) => {
    return (
        <div className={`${styles.groupNavPreview} ${styles[theme]}`}>
            <nav className={styles.navPanel}>
                <button className={styles.homeButton}>
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                </button>
                <div className={styles.separator}></div>
                <div className={styles.groupList}>
                    {[1, 2, 3].map((group) => (
                        <div key={group} className={styles.groupItem}>
                            <div className={styles.avatarWrapper}>
                                <div className={styles.avatar}></div>
                            </div>
                        </div>
                    ))}
                    <div className={styles.addGroupButton}>
                        <div className={styles.avatarWrapper}>
                            <div className={styles.plusIcon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default GroupNavigationPreview;