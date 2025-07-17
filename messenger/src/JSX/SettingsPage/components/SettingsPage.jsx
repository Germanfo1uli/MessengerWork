import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/SettingsPage.module.css';
import { FiUser, FiGlobe, FiBell, FiShield, FiLogOut, FiEye, FiEyeOff, FiLock, FiTrash2 } from 'react-icons/fi';
import { RiSpaceShipLine } from 'react-icons/ri';

const Background = () => {
    return (
        <div className={styles.background}>
            <div className={styles.backgroundOverlay}></div>
        </div>
    );
};

const SettingsPage = () => {
    const [bannerType, setBannerType] = useState('color');
    const [bannerColor, setBannerColor] = useState('#1a2a4d');
    const [bannerImage, setBannerImage] = useState(null);
    const [showPhone, setShowPhone] = useState(false);
    const [avatarBorderType, setAvatarBorderType] = useState('color');
    const [avatarBorderColor, setAvatarBorderColor] = useState('#4d79f6');
    const [avatarBorderImage, setAvatarBorderImage] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: 'Командир Ковальски',
            tag: 'Капитан 1-го ранга',
            email: 'commander@starfleet.com',
            phone: '+7 (999) 123-45-67',
            status: 'Опытный командир с 15-летним стажем. Специализация: дальние космические миссии.',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Avatar file selected:', file);
        }
    };

    const handleBorderImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarBorderImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleColorChange = (e) => {
        setBannerColor(e.target.value);
    };

    const handleBorderColorChange = (e) => {
        setAvatarBorderColor(e.target.value);
    };

    const onSubmit = (data) => {
        console.log('Form submitted:', data);
    };

    const onPasswordChange = (data) => {
        console.log('Password change submitted:', data);
        setShowChangePassword(false);
    };

    const onDeleteAccount = () => {
        console.log('Account deletion confirmed');
        setShowDeleteConfirm(false);
    };

    const maskPhoneNumber = (phone) => {
        if (showPhone) return phone;
        return phone.replace(/\+\d\s\(\d{3}\)\s\d{3}/, '+* (***) ***');
    };

    return (
        <div className={styles.container}>
            <Background />
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <RiSpaceShipLine className={styles.logoIcon} />
                    <h2>Космические Настройки</h2>
                </div>
                <nav className={styles.navMenu}>
                    <button className={`${styles.navButton} ${styles.active}`}>
                        <FiUser className={styles.navIcon} />
                        <span>Профиль</span>
                    </button>
                    <button className={styles.navButton}>
                        <FiGlobe className={styles.navIcon} />
                        <span>Язык</span>
                    </button>
                    <button className={styles.navButton}>
                        <FiBell className={styles.navIcon} />
                        <span>Уведомления</span>
                    </button>
                    <button className={styles.navButton}>
                        <FiShield className={styles.navIcon} />
                        <span>Безопасность</span>
                    </button>
                    <button className={styles.navButton}>
                        <FiLogOut className={styles.navIcon} />
                        <span>Выход</span>
                    </button>
                </nav>
                <div className={styles.sidebarFooter}>
                    <div className={styles.statusLight}></div>
                    <span>Связь стабильная</span>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    <header className={styles.pageHeader}>
                        <h1>Настройки профиля</h1>
                        <p>Управляйте своей космической идентификацией</p>
                    </header>

                    <div className={styles.profileSection}>
                        <div className={styles.bannerCard}>
                            <div
                                className={styles.profileBanner}
                                style={{
                                    background: bannerImage ? `url(${bannerImage}) center/cover` : bannerColor,
                                }}
                            >
                                <div className={styles.bannerOverlay}></div>
                                <div className={styles.bannerControls}>
                                    <div className={styles.bannerToggle}>
                                        <button
                                            className={`${styles.toggleButton} ${bannerType === 'color' ? styles.activeToggle : ''}`}
                                            onClick={() => setBannerType('color')}
                                        >
                                            Цвет
                                        </button>
                                        <button
                                            className={`${styles.toggleButton} ${bannerType === 'image' ? styles.activeToggle : ''}`}
                                            onClick={() => setBannerType('image')}
                                        >
                                            Изображение
                                        </button>
                                    </div>
                                    {bannerType === 'color' && (
                                        <div className={styles.colorPickerWrapper}>
                                            <input
                                                type="color"
                                                value={bannerColor}
                                                onChange={handleColorChange}
                                                className={styles.colorPicker}
                                            />
                                            <span className={styles.colorValue}>{bannerColor}</span>
                                        </div>
                                    )}
                                    {bannerType === 'image' && (
                                        <label className={styles.imageUploadButton}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBannerChange}
                                                className={styles.fileInput}
                                            />
                                            Выбрать изображение
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={styles.avatarContainer}>
                            <div
                                className={styles.avatar}
                                style={{
                                    border: avatarBorderType === 'color'
                                        ? `2px solid ${avatarBorderColor}`
                                        : avatarBorderImage
                                            ? `2px solid transparent`
                                            : `2px solid rgba(77, 121, 246, 0.3)`,
                                    backgroundImage: avatarBorderType === 'image' && avatarBorderImage
                                        ? `url(${avatarBorderImage})`
                                        : 'none'
                                }}
                            >
                                <div className={styles.avatarGlow}></div>
                            </div>
                            <div className={styles.avatarButtons}>
                                <label className={styles.editAvatarBtn}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className={styles.fileInput}
                                    />
                                    <span>Изменить аватар</span>
                                </label>
                                <div className={styles.borderOptions}>
                                    <div className={styles.borderToggle}>
                                        <button
                                            className={`${styles.toggleButton} ${avatarBorderType === 'color' ? styles.activeToggle : ''}`}
                                            onClick={() => setAvatarBorderType('color')}
                                        >
                                            Цвет
                                        </button>
                                        <button
                                            className={`${styles.toggleButton} ${avatarBorderType === 'image' ? styles.activeToggle : ''}`}
                                            onClick={() => setAvatarBorderType('image')}
                                        >
                                            Изображение
                                        </button>
                                    </div>
                                    {avatarBorderType === 'color' ? (
                                        <div className={styles.borderColorPicker}>
                                            <input
                                                type="color"
                                                value={avatarBorderColor}
                                                onChange={handleBorderColorChange}
                                                className={styles.colorPicker}
                                            />
                                            <span>Цвет рамки</span>
                                        </div>
                                    ) : (
                                        <label className={styles.borderImageUpload}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBorderImageChange}
                                                className={styles.fileInput}
                                            />
                                            Выбрать рамку
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.profileInfo}>
                            <h2>Командир Ковальски</h2>
                            <p className={styles.userEmail}>commander@starfleet.com</p>
                            <p className={styles.userStatus}>На связи</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.formSection}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Имя пользователя</label>
                                <input
                                    {...register('username', { required: 'Имя пользователя обязательно' })}
                                    className={styles.formInput}
                                />
                                {errors.username && <p className={styles.error}>{errors.username.message}</p>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Тег юзера</label>
                                <input
                                    {...register('tag', { required: 'Тег обязателен' })}
                                    className={styles.formInput}
                                />
                                {errors.tag && <p className={styles.error}>{errors.tag.message}</p>}
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    {...register('email', {
                                        required: 'Email обязателен',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Неверный формат email'
                                        }
                                    })}
                                    className={styles.formInput}
                                />
                                {errors.email && <p className={styles.error}>{errors.email.message}</p>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Номер телефона (НЕ РАБОТАЕТ ЦЕНЗУРА)</label>
                                <div className={styles.phoneInputWrapper}>
                                    <input
                                        {...register('phone', {
                                            required: 'Номер телефона обязателен',
                                            pattern: {
                                                value: /^\+\d\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
                                                message: 'Неверный формат номера'
                                            }
                                        })}
                                        className={styles.formInput}
                                        value={showPhone ? undefined : maskPhoneNumber}
                                    />
                                    <button
                                        type="button"
                                        className={styles.phoneToggle}
                                        onClick={() => setShowPhone(!showPhone)}
                                    >
                                        {showPhone ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Статус</label>
                            <textarea
                                {...register('status', {
                                    maxLength: {
                                        value: 100,
                                        message: 'Статус не должен превышать 100 символов'
                                    }
                                })}
                                className={styles.formTextarea}
                            ></textarea>
                            {errors.status && <p className={styles.error}>{errors.status.message}</p>}
                        </div>

                        <div className={styles.actionButtons}>
                            <button type="submit" className={styles.saveButton}>
                                Сохранить изменения
                            </button>
                            <button type="button" className={styles.cancelButton}>
                                Отменить
                            </button>
                        </div>

                        <div className={styles.securitySection}>
                            <div className={styles.securityHeader}>
                                <FiLock className={styles.securityIcon} />
                                <h3>Изменить пароль</h3>
                            </div>
                            {showChangePassword ? (
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
                                                validate: value =>
                                                    value === document.querySelector('input[name="newPassword"]')?.value ||
                                                    'Пароли не совпадают'
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
                            ) : (
                                <button
                                    type="button"
                                    className={styles.changePasswordButton}
                                    onClick={() => setShowChangePassword(true)}
                                >
                                    Изменить пароль
                                </button>
                            )}
                        </div>

                        <div className={styles.deleteSection}>
                            <div className={styles.securityHeader}>
                                <FiTrash2 className={styles.deleteIcon} />
                                <h3>Удалить учётную запись</h3>
                            </div>
                            <p className={styles.deleteWarning}>
                                Удаление учётной записи приведёт к безвозвратной потере всех данных. Это действие нельзя отменить.
                            </p>
                            {showDeleteConfirm ? (
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
                            ) : (
                                <button
                                    type="button"
                                    className={styles.deleteButton}
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    Удалить учётную запись
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;