import { useEffect, useState } from "react";
import { FaEdit, FaTimes, FaCircle, FaRegCircle, FaRocket, FaCopy, FaEye, FaEyeSlash, FaGift } from "react-icons/fa";
import { IoMdPlanet } from "react-icons/io";
import styles from '../styles/Modal.module.css';

const Modal = ({ isOpen, onClose, user }) => {
    const [isStatusHidden, setIsStatusHidden] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
        return () => (document.body.style.overflow = "unset");
    }, [isOpen]);

    const copyTag = () => {
        navigator.clipboard.writeText(user.tag || "#0000");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleStatusVisibility = () => {
        setIsStatusHidden(!isStatusHidden);
    };

    if (!isOpen) return null;

    const gifts = [
        { id: 1, image: "https://cdn1.ozone.ru/s3/multimedia-1-h/7548608069.jpg", name: "Золотой лабубу" },
        { id: 2, image: "https://avatars.mds.yandex.net/get-mpic/13527901/2a000001971b61fbaf300b399920a6a840f3/orig", name: "Никита" },
        { id: 3, image: "https://avatars.mds.yandex.net/i?id=3eaffa6d84e0523f6ed1786307f4e0a4_l-5295169-images-thumbs&n=13", name: "Лабуба" }
    ];

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Космический баннер */}
                <div className={styles.banner}>
                    <div className={styles.stars}></div>
                    <IoMdPlanet className={styles.planetIcon} />
                </div>

                {/* Аватар с индикатором онлайн-статуса */}
                <div className={styles.avatarWrapper}>
                    <img
                        src={user.avatarUrl || "https://i.imgur.com/3Zq3Z8L.png"}
                        alt="Аватар"
                        className={styles.avatar}
                    />
                    {!isStatusHidden ? (
                        <FaCircle className={styles.statusOnline} />
                    ) : (
                        <FaRegCircle className={styles.statusOffline} />
                    )}
                    <div className={styles.avatarGlow}></div>
                </div>

                {/* Информация о пользователе */}
                <div className={styles.userInfo}>
                    <h2 className={styles.username}>{user.username || "armisaelb"}</h2>
                    <div className={styles.userTag} onClick={copyTag}>
                        {user.tag || "#0000"}
                        <FaCopy className={styles.copyIcon} />
                        {copied && <span className={styles.copiedTooltip}>Скопировано!</span>}
                    </div>
                    <p className={styles.status}>{user.quote || "Исследую космос..."}</p>
                    <p className={styles.lastSeen}>
                        <FaRocket className={styles.rocketIcon} />
                        {isStatusHidden ? "Невидимка" : `В сети`}
                    </p>
                </div>

                {/* Витрина подарков */}
                <div className={styles.giftsSection}>
                    <div className={styles.sectionDivider}>
                        <span className={styles.dividerText}>КОСМИЧЕСКИЕ АРТЕФАКТЫ</span>
                    </div>
                    <div className={styles.giftsGrid}>
                        {gifts.map(gift => (
                            <div key={gift.id} className={styles.giftCard}>
                                <div className={styles.giftGlow}></div>
                                <img
                                    src={gift.image}
                                    alt={gift.name}
                                    className={styles.giftImage}
                                />
                                <div className={styles.giftName}>{gift.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Кнопка редактирования */}
                <button className={styles.editButton}>
                    <FaEdit className={styles.editIcon} /> Редактировать профиль
                </button>

                {/* Кнопка смены статуса */}
                <button
                    className={styles.statusButton}
                    onClick={toggleStatusVisibility}
                >
                    {isStatusHidden ? (
                        <>
                            <FaEye className={styles.statusIcon} /> Выйти из невидимки
                        </>
                    ) : (
                        <>
                            <FaEyeSlash className={styles.statusIcon} /> Включить невидимку
                        </>
                    )}
                </button>

                {/* Кнопка закрытия */}
                <button className={styles.closeButton} onClick={onClose}>
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default Modal;