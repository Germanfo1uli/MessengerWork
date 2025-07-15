import React, { useState } from 'react';
import styles from '../styles/GroupNavigation.module.css';

const GroupNavigation = () => {
    const [tooltip, setTooltip] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);

    const groups = [
        { avatar: 'https://avatars.mds.yandex.net/i?id=3a060b00307ec724a511c4e2d8f503bc_l-4120702-images-thumbs&n=13', name: 'Exploration', id: 'group1' },
        { avatar: 'https://avatars.mds.yandex.net/i?id=3a060b00307ec724a511c4e2d8f503bc_l-4120702-images-thumbs&n=13', name: 'Crew', id: 'group2' },
        { avatar: 'https://avatars.mds.yandex.net/i?id=3a060b00307ec724a511c4e2d8f503bc_l-4120702-images-thumbs&n=13', name: 'Fleet', id: 'group3' }
    ];

    const handleAddGroup = () => {
        // Здесь будет логика открытия модального окна
        console.log('Open add group modal');
    };

    return (
        <nav className={styles.navPanel}>
            <button
                className={styles.homeButton}
                onClick={() => window.location.href = '/home'}
            >
                <svg width="24" height="24" fill="#e0e0ff" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
            </button>
            <div className={styles.separator}></div>
            <div className={styles.groupList}>
                {groups.map((group) => (
                    <div
                        key={group.id}
                        className={styles.groupItem}
                        onMouseEnter={() => setTooltip(group.name)}
                        onMouseLeave={() => setTooltip('')}
                        onClick={() => setSelectedGroup(group.id)}
                    >
                        <div className={`${styles.avatarWrapper} ${selectedGroup === group.id ? styles.selected : ''}`}>
                            <img src={group.avatar} alt={group.name} className={styles.avatar} />
                        </div>
                        {tooltip === group.name && (
                            <span className={styles.tooltip}>{group.name}</span>
                        )}
                    </div>
                ))}

                {/* Кнопка добавления новой группы */}
                <div
                    className={styles.addGroupButton}
                    onMouseEnter={() => setTooltip('Add new group')}
                    onMouseLeave={() => setTooltip('')}
                    onClick={handleAddGroup}
                >
                    <div className={styles.avatarWrapper}>
                        <div className={styles.plusIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e0e0ff">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                        </div>
                    </div>
                    {tooltip === 'Add new group' && (
                        <span className={styles.tooltip}>Add new group</span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default GroupNavigation;