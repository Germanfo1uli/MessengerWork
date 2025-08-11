import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/SettingsPage.module.css';
import { FiEye, FiEyeOff, FiGift } from 'react-icons/fi';
import Sidebar from './Sidebar';
import { useUser } from './Context/UserContext';
import { useTheme } from './Context/ThemeContext';

const Background = () => {
    return (
        <div className={styles.background}>
            <div className={styles.backgroundOverlay}></div>
        </div>
    );
};

const SettingsPage = ({ setIsModalOpen }) => {
    const { user, updateUser } = useUser();
    const { updateThemeSettings } = useTheme();
    const [bannerType, setBannerType] = useState(user.banner.type);
    const [bannerColor, setBannerColor] = useState(user.banner.type === 'color' ? user.banner.value : '#1a2a4d');
    const [bannerImage, setBannerImage] = useState(user.banner.type === 'image' ? user.banner.value : null);
    const [showPhone, setShowPhone] = useState(false);
    const [avatarBorderType, setAvatarBorderType] = useState('color');
    const [avatarBorderColor, setAvatarBorderColor] = useState(user.avatarBorderColor || '#4d79f6');
    const [avatarBorderImage, setAvatarBorderImage] = useState(null);
    const [maxGiftsSelected, setMaxGiftsSelected] = useState(false);
    const [avatar, setAvatar] = useState(user.avatarUrl);
    const [profileBackgroundColor, setProfileBackgroundColor] = useState(user.backgroundColor || '#071332');

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: user.username,
            tag: user.tag,
            email: user.email,
            phone: user.phone,
            status: user.status,
        },
    });

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerImage(reader.result);
                updateUser({ banner: { type: 'image', value: reader.result } });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
                updateUser({ avatarUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBorderImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarBorderImage(reader.result);
                updateUser({ avatarBorder: { type: 'image', value: reader.result } });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleColorChange = (e) => {
        setBannerColor(e.target.value);
        updateUser({ banner: { type: 'color', value: e.target.value } });
    };

    const handleBorderColorChange = (e) => {
        const newColor = e.target.value;
        setAvatarBorderColor(newColor);
        updateUser({ avatarBorderColor: newColor });
        updateThemeSettings({ avatarBorderColor: newColor });
    };

    const handleBackgroundColorChange = (e) => {
        const newColor = e.target.value;
        setProfileBackgroundColor(newColor);
        updateUser({ backgroundColor: newColor });
        updateThemeSettings({ backgroundColor: newColor });
    };

    const handleResetBanner = () => {
        setBannerType('color');
        setBannerColor('#1a2a4d');
        setBannerImage(null);
        updateUser({ banner: { type: 'color', value: '#1a2a4d' } });
    };

    const toggleGiftSelection = (id) => {
        const selectedCount = user.gifts.filter(gift => gift.selected).length;
        const isCurrentlySelected = user.gifts.find(gift => gift.id === id)?.selected;

        if (!isCurrentlySelected && selectedCount >= 3) {
            setMaxGiftsSelected(true);
            setTimeout(() => setMaxGiftsSelected(false), 2000);
            return;
        }

        const updatedGifts = user.gifts.map(gift =>
            gift.id === id ? { ...gift, selected: !gift.selected } : gift
        );
        updateUser({ gifts: updatedGifts });
    };

    const onSubmit = (data) => {
        updateUser(data);
        console.log('Form submitted:', data);
        console.log('Selected gifts:', user.gifts.filter(gift => gift.selected));
    };

    const maskPhoneNumber = (phone) => {
        if (showPhone) return phone;
        return phone.replace(/\+\d\s\(\d{3}\)\s\d{3}/, '+* (***) ***');
    };

    return (
        <div className={styles.container}>
            <Background />
            <Sidebar />
            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    <header className={styles.pageHeader}>
                        <h1>Настройки профиля</h1>
                        <p>Управляйте своей космической идентификацией</p>
                        <button
                            className={styles.viewProfileButton}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Просмотреть профиль
                        </button>
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
                                            onClick={() => {
                                                setBannerType('color');
                                                updateUser({ banner: { type: 'color', value: bannerColor } });
                                            }}
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
                                    <button
                                        className={styles.resetButton}
                                        onClick={handleResetBanner}
                                    >
                                        Сбросить фон
                                    </button>
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
                                            : `2px solid ${avatarBorderColor}`,
                                    backgroundImage: avatarBorderType === 'image' && avatarBorderImage
                                        ? `url(${avatarBorderImage})`
                                        : 'none',
                                    background: avatar ? `url(${avatar}) center/cover` : 'linear-gradient(135deg, #1e2b4d, #0f1a2e)',
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
                            <h2>{user.username}</h2>
                            <p className={styles.userEmail}>{user.email}</p>
                            <p className={styles.userStatus}>На связи</p>
                        </div>
                    </div>

                    <div className={styles.themeSection}>
                        <div className={styles.sectionHeader}>
                            <h3>Цвет фона профиля</h3>
                        </div>
                        <p className={styles.sectionDescription}>
                            Выберите цвет фона для вашего профиля
                        </p>
                        <div className={styles.colorPickerWrapper}>
                            <input
                                type="color"
                                value={profileBackgroundColor}
                                onChange={handleBackgroundColorChange}
                                className={styles.colorPicker}
                            />
                            <span className={styles.colorValue}>{profileBackgroundColor}</span>
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
                                            message: 'Неверный формат email',
                                        },
                                    })}
                                    className={styles.formInput}
                                />
                                {errors.email && <p className={styles.error}>{errors.email.message}</p>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Номер телефона</label>
                                <div className={styles.phoneInputWrapper}>
                                    <input
                                        {...register('phone', {
                                            required: 'Номер телефона обязателен',
                                            pattern: {
                                                value: /^\+\d\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
                                                message: 'Неверный формат номера',
                                            },
                                        })}
                                        className={styles.formInput}
                                        value={showPhone ? undefined : maskPhoneNumber(user.phone)}
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
                                        message: 'Статус не должен превышать 100 символов',
                                    },
                                })}
                                className={styles.formTextarea}
                            ></textarea>
                            {errors.status && <p className={styles.error}>{errors.status.message}</p>}
                        </div>

                        <div className={styles.giftsSection}>
                            <div className={styles.sectionHeader}>
                                <FiGift className={styles.sectionIcon} />
                                <h3>Витрина подарков</h3>
                                <span className={styles.giftsCounter}>
                                    {user.gifts.filter(gift => gift.selected).length}/3 выбрано
                                </span>
                            </div>
                            <p className={styles.sectionDescription}>
                                Выберите до 3 подарков, которые будут отображаться в вашем профиле
                            </p>

                            {maxGiftsSelected && (
                                <div className={styles.maxGiftsWarning}>
                                    Можно выбрать не более 3 подарков
                                </div>
                            )}

                            <div className={styles.giftsGrid}>
                                {user.gifts.map(gift => {
                                    const selectedCount = user.gifts.filter(g => g.selected).length;
                                    const isDisabled = !gift.selected && selectedCount >= 3;

                                    return (
                                        <div
                                            key={gift.id}
                                            className={`${styles.giftCard} ${gift.selected ? styles.selectedGift : ''} ${isDisabled ? styles.disabled : ''}`}
                                            onClick={() => !isDisabled && toggleGiftSelection(gift.id)}
                                        >
                                            <div className={styles.giftGlow}></div>
                                            <img
                                                src={gift.image}
                                                alt={gift.name}
                                                className={styles.giftImage}
                                            />
                                            <div className={styles.giftName}>{gift.name}</div>
                                            <div className={styles.giftCheckbox}>
                                                <input
                                                    type="checkbox"
                                                    checked={gift.selected}
                                                    onChange={() => !isDisabled && toggleGiftSelection(gift.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    disabled={isDisabled}
                                                />
                                            </div>
                                            {isDisabled && (
                                                <div className={styles.giftOverlay}></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={styles.actionButtons}>
                            <button type="submit" className={styles.saveButton}>
                                Сохранить изменения
                            </button>
                            <button type="button" className={styles.cancelButton}>
                                Отменить
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;