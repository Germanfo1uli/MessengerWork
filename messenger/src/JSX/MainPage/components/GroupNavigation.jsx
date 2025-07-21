import React, { useState } from 'react';
import styles from '../styles/GroupNavigation.module.css';

const GroupNavigation = () => {
    const [tooltip, setTooltip] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('create');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        theme: 'exploration',
        agreement: false,
        inviteLink: ''
    });
    const [avatarPreview, setAvatarPreview] = useState(null);

    const groups = [
        { avatar: 'https://avatars.mds.yandex.net/i?id=3a060b00307ec724a511c4e2d8f503bc_l-4120702-images-thumbs&n=13', name: 'Исследования', id: 'group1' },
        { avatar: 'https://avatars.mds.yandex.net/i?id=3a060b00307ec724a511c4e2d8f503bc_l-4120702-images-thumbs&n=13', name: 'Экипаж', id: 'group2' },
        { avatar: 'https://avatars.mds.yandex.net/i?id=3a060b00307ec724a511c4e2d8f503bc_l-4120702-images-thumbs&n=13', name: 'Флот', id: 'group3' }
    ];

    const handleAddGroup = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFormData({
            name: '',
            description: '',
            theme: 'exploration',
            agreement: false,
            inviteLink: ''
        });
        setAvatarPreview(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        handleCloseModal();
    };

    return (
        <>
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

                    <div
                        className={styles.addGroupButton}
                        onMouseEnter={() => setTooltip('Новая группа')}
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
                        {tooltip === 'Новая группа' && (
                            <span className={styles.tooltip}>Новая группа</span>
                        )}
                    </div>
                </div>
            </nav>

            {modalOpen && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={handleCloseModal}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e0e0ff">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>

                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {activeTab === 'create' ? 'Создайте свой сервер' : 'Присоединитесь к серверу'}
                            </h2>
                            <p className={styles.modalDescription}>
                                {activeTab === 'create'
                                    ? 'Объединяйтесь с единомышленниками для обсуждения космоса и технологий!'
                                    : 'Найдите сообщество по интересам и станьте его частью!'}
                            </p>
                            <div className={styles.tabs}>
                                <button
                                    className={`${styles.tabButton} ${activeTab === 'create' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('create')}
                                >
                                    Создать группу
                                </button>
                                <button
                                    className={`${styles.tabButton} ${activeTab === 'join' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('join')}
                                >
                                    Вступить в группу
                                </button>
                            </div>
                        </div>

                        <div className={styles.modalContent}>
                            {activeTab === 'create' ? (
                                <form onSubmit={handleSubmit} className={styles.createForm}>
                                    <div className={styles.avatarUpload}>
                                        <label className={styles.uploadLabel}>
                                            {avatarPreview ? (
                                                <div className={styles.avatarPreviewContainer}>
                                                    <img src={avatarPreview} alt="Аватар группы" className={styles.avatarPreview} />
                                                    <div className={styles.avatarOverlay}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.uploadPlaceholder}>
                                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="#e0e0ff">
                                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                                    </svg>
                                                    <span className={styles.uploadText}>Загрузить логотип</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className={styles.uploadInput}
                                            />
                                        </label>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="name">Название группы</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Введите название группы"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="description">Описание</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Опишите тематику вашей группы"
                                            rows="3"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="theme">Тематика группы</label>
                                        <select
                                            id="theme"
                                            name="theme"
                                            value={formData.theme}
                                            onChange={handleInputChange}
                                        >
                                            <option value="exploration">Космические исследования</option>
                                            <option value="science">Астрономия</option>
                                            <option value="fiction">Научная фантастика</option>
                                            <option value="technology">Космические технологии</option>
                                            <option value="community">Космическое сообщество</option>
                                        </select>
                                    </div>

                                    <div className={styles.agreement}>
                                        <input
                                            type="checkbox"
                                            id="agreement"
                                            name="agreement"
                                            checked={formData.agreement}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <label htmlFor="agreement">
                                            Я согласен с <a href="#" className={styles.termsLink}>Условиями группы</a> и <a href="#" className={styles.termsLink}>Правилами сообщества</a>
                                        </label>
                                    </div>

                                    <button type="submit" className={styles.submitButton}>
                                        Создать группу
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmit} className={styles.joinForm}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="inviteLink">Ссылка-приглашение</label>
                                        <input
                                            type="text"
                                            id="inviteLink"
                                            name="inviteLink"
                                            value={formData.inviteLink}
                                            onChange={handleInputChange}
                                            placeholder="https://cosmiclink.space/join/abc123xyz"
                                            required
                                        />
                                    </div>

                                    <div className={styles.example}>
                                        <p>Пример корректной ссылки:</p>
                                        <code>https://cosmiclink.space/join/abc123xyz</code>
                                    </div>

                                    <button type="submit" className={styles.submitButton}>
                                        Вступить в группу
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GroupNavigation;