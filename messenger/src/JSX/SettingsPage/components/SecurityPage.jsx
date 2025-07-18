import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiShield, FiLock, FiKey, FiLink2, FiGithub, FiMail, FiTrash2 } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import styles from '../styles/SecurityPage.module.css';
import Sidebar from '../components/Sidebar';

const SecurityPage = () => {
    const [connectedAccounts, setConnectedAccounts] = useState({
        google: false,
        github: false
    });
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeSessions, setActiveSessions] = useState([
        { id: 1, device: 'Chrome on Windows', location: 'New York, USA', lastActive: '2025-07-18' },
        { id: 2, device: 'Safari on iPhone', location: 'London, UK', lastActive: '2025-07-17' }
    ]);

    const { register, handleSubmit, formState: { errors }, getValues } = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const toggleAccountConnection = (account) => {
        setConnectedAccounts(prev => ({
            ...prev,
            [account]: !prev[account]
        }));
    };

    const onPasswordChange = (data) => {
        console.log('Password change submitted:', data);
        setShowChangePassword(false);
    };

    const onDeleteAccount = () => {
        console.log('Account deletion confirmed');
        setShowDeleteConfirm(false);
    };

    const terminateSession = (sessionId) => {
        setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
        console.log(`Terminated session ${sessionId}`);
    };

    return (
        <div className={styles.pageContainer}>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1>Безопасность</h1>
                    <p>Управляйте настройками безопасности вашего аккаунта и подключенными сервисами</p>
                </div>

                <div className={styles.settingsContainer}>
                    <div className={styles.settingsPanel}>
                        <div className={styles.settingGroup}>
                            <h3><FiShield className={styles.settingIcon} /> Основные настройки безопасности</h3>
                            <div className={styles.securityCard}>
                                <div className={styles.securityItem}>
                                    <FiLock className={styles.securityIcon} />
                                    <div>
                                        <h4>Двухфакторная аутентификация</h4>
                                        <p>Добавьте дополнительный уровень защиты для вашего аккаунта</p>
                                    </div>
                                    <button className={styles.securityButton}>Включить</button>
                                </div>
                                <div className={styles.securityItem}>
                                    <FiKey className={styles.securityIcon} />
                                    <div>
                                        <h4>Смена пароля</h4>
                                        <p>Рекомендуем регулярно обновлять ваш пароль</p>
                                    </div>
                                    <button
                                        className={styles.securityButton}
                                        onClick={() => setShowChangePassword(true)}
                                    >
                                        Изменить
                                    </button>
                                </div>
                                {showChangePassword && (
                                    <div className={styles.passwordForm}>
                                        <div className={styles.formGroup}>
                                            <label>Текущий пароль</label>
                                            <input
                                                type="password"
                                                {...register('currentPassword', { required: 'Текущий пароль обязателен' })}
                                                className={styles.formInput}
                                            />
                                            {errors.currentPassword && <p className={styles.error}>{errors.currentPassword.message}</p>}
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Новый пароль</label>
                                            <input
                                                type="password"
                                                {...register('newPassword', {
                                                    required: 'Новый пароль обязателен',
                                                    minLength: {
                                                        value: 8,
                                                        message: 'Пароль должен содержать минимум 8 символов'
                                                    }
                                                })}
                                                className={styles.formInput}
                                            />
                                            {errors.newPassword && <p className={styles.error}>{errors.newPassword.message}</p>}
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Подтвердите пароль</label>
                                            <input
                                                type="password"
                                                {...register('confirmPassword', {
                                                    required: 'Подтверждение пароля обязательно',
                                                    validate: value => value === getValues('newPassword') || 'Пароли не совпадают'
                                                })}
                                                className={styles.formInput}
                                            />
                                            {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
                                        </div>
                                        <div className={styles.passwordButtons}>
                                            <button
                                                type="button"
                                                className={styles.saveButton}
                                                onClick={handleSubmit(onPasswordChange)}
                                            >
                                                Сохранить пароль
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.cancelButton}
                                                onClick={() => setShowChangePassword(false)}
                                            >
                                                Отмена
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className={styles.securityItem}>
                                    <FiTrash2 className={styles.securityIcon} style={{ color: '#ff4d4d' }} />
                                    <div>
                                        <h4>Удалить учётную запись</h4>
                                        <p>Безвозвратно удалит все данные аккаунта</p>
                                    </div>
                                    <button
                                        className={styles.securityButton}
                                        style={{ color: '#ff4d4d', borderColor: 'rgba(255, 107, 107, 0.3)' }}
                                        onClick={() => setShowDeleteConfirm(true)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                                {showDeleteConfirm && (
                                    <div className={styles.deleteConfirm}>
                                        <p>Вы уверены, что хотите удалить свою учётную запись?</p>
                                        <div className={styles.deleteButtons}>
                                            <button
                                                type="button"
                                                className={styles.deleteButton}
                                                onClick={onDeleteAccount}
                                            >
                                                Да, удалить
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.cancelButton}
                                                onClick={() => setShowDeleteConfirm(false)}
                                            >
                                                Отмена
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.settingGroup}>
                            <h3><FiLink2 className={styles.settingIcon} /> Привязанные аккаунты</h3>
                            <p className={styles.settingDescription}>
                                Подключите внешние сервисы для быстрого и безопасного входа
                            </p>

                            <div className={styles.accountsGrid}>
                                <div className={`${styles.accountCard} ${connectedAccounts.google ? styles.connected : ''}`}>
                                    <div className={styles.accountHeader}>
                                        <FaGoogle className={styles.accountIcon} style={{ color: '#4285F4' }} />
                                        <span>Google</span>
                                    </div>
                                    <p className={styles.accountStatus}>
                                        {connectedAccounts.google ? 'Привязан' : 'Не привязан'}
                                    </p>
                                    <button
                                        onClick={() => toggleAccountConnection('google')}
                                        className={styles.accountButton}
                                    >
                                        {connectedAccounts.google ? 'Отвязать' : 'Привязать'}
                                    </button>
                                </div>

                                <div className={`${styles.accountCard} ${connectedAccounts.github ? styles.connected : ''}`}>
                                    <div className={styles.accountHeader}>
                                        <FiGithub className={styles.accountIcon} style={{ color: '#333' }} />
                                        <span>GitHub</span>
                                    </div>
                                    <p className={styles.accountStatus}>
                                        {connectedAccounts.github ? 'Привязан' : 'Не привязан'}
                                    </p>
                                    <button
                                        onClick={() => toggleAccountConnection('github')}
                                        className={styles.accountButton}
                                    >
                                        {connectedAccounts.github ? 'Отвязать' : 'Привязать'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.settingGroup}>
                            <h3><FiMail className={styles.settingIcon} /> Активные сессии</h3>
                            <p className={styles.settingDescription}>
                                Просматривайте и управляйте активными сессиями на устройствах
                            </p>
                            <div className={styles.sessionList}>
                                {activeSessions.map(session => (
                                    <div key={session.id} className={styles.sessionItem}>
                                        <div>
                                            <h4>{session.device}</h4>
                                            <p>{session.location} - Последняя активность: {session.lastActive}</p>
                                        </div>
                                        <button
                                            className={styles.terminateButton}
                                            onClick={() => terminateSession(session.id)}
                                        >
                                            Завершить
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityPage;