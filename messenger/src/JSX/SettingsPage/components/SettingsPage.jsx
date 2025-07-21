import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/SettingsPage.module.css';
import { FiEye, FiEyeOff, FiGift } from 'react-icons/fi';
import Sidebar from './Sidebar';

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
    const [maxGiftsSelected, setMaxGiftsSelected] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: 'Командир Ковальски',
            tag: 'Капитан 1-го ранга',
            email: 'commander@starfleet.com',
            phone: '+7 (999) 123-45-67',
            status: 'Опытный командир с 15-летним стажем. Специализация: дальние космические миссии.',
        }
    });

    // Состояние для витрины подарков
    const [gifts, setGifts] = useState([
        { id: 1, image: "https://cdn1.ozone.ru/s3/multimedia-1-h/7548608069.jpg", name: "Золотой лабубу", selected: true },
        { id: 2, image: "https://avatars.mds.yandex.net/get-mpic/13527901/2a000001971b61fbaf300b399920a6a840f3/orig", name: "Никита", selected: false },
        { id: 3, image: "https://avatars.mds.yandex.net/i?id=3eaffa6d84e0523f6ed1786307f4e0a4_l-5295169-images-thumbs&n=13", name: "Лабуба", selected: true },
        { id: 4, image: "https://i.imgur.com/JQ9qX1z.png", name: "Космический шлем", selected: false },
        { id: 5, image: "https://i.imgur.com/8Km9tLL.png", name: "Звездный меч", selected: true },
        { id: 6, image: "https://i.imgur.com/3Zq3Z8L.png", name: "Галактический щит", selected: false },
    ]);

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

    // Обработчик выбора подарка с ограничением
    const toggleGiftSelection = (id) => {
        const selectedCount = gifts.filter(gift => gift.selected).length;
        const isCurrentlySelected = gifts.find(gift => gift.id === id)?.selected;

        if (!isCurrentlySelected && selectedCount >= 3) {
            setMaxGiftsSelected(true);
            setTimeout(() => setMaxGiftsSelected(false), 2000);
            return;
        }

        setGifts(gifts.map(gift =>
            gift.id === id ? { ...gift, selected: !gift.selected } : gift
        ));
    };

    const onSubmit = (data) => {
        console.log('Form submitted:', data);
        const selectedGifts = gifts.filter(gift => gift.selected);
        console.log('Selected gifts:', selectedGifts);
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
                                <label>Номер телефона</label>
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
                                        value={showPhone ? undefined : maskPhoneNumber('+7 (999) 123-45-67')}
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

                        {/* Секция витрины подарков */}
                        <div className={styles.giftsSection}>
                            <div className={styles.sectionHeader}>
                                <FiGift className={styles.sectionIcon} />
                                <h3>Витрина подарков</h3>
                                <span className={styles.giftsCounter}>
                                    {gifts.filter(gift => gift.selected).length}/3 выбрано
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
                                {gifts.map(gift => {
                                    const selectedCount = gifts.filter(g => g.selected).length;
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