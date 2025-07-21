import React, { useState } from 'react';
import { FiArrowLeft, FiStar, FiGift, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/GiftPage.module.css';

const GiftPage = () => {
    const [showStarModal, setShowStarModal] = useState(false);
    const [selectedStarPackage, setSelectedStarPackage] = useState(null);
    const navigate = useNavigate();

    const gifts = [
        { id: 1, name: 'Чвк Лабуби', price: 500, image: 'https://s0.rbk.ru/v6_top_pics/media/img/6/41/347473974424416.jpeg', rarity: 'rare' },
        { id: 2, name: 'ЗОЛОТОЙ ЛАБУБА', price: 148880, image: 'https://astrakhan.su/wp-content/uploads/2025/06/174938500795.jpg', rarity: 'legendary' },
        { id: 3, name: 'Ракета', price: 350, image: 'https://masterpiecer-images.s3.yandex.net/b33e6e4c706211ee8c902aacdc0146ad:upscaled', rarity: 'rare' },
        { id: 4, name: 'Комета', price: 150, image: 'https://i.pinimg.com/originals/31/4e/a2/314ea2963747fc502dc0cc5dc6479ec0.jpg', rarity: 'common' },
        { id: 5, name: 'Галактика', price: 800, image: 'https://i.pinimg.com/originals/d7/38/59/d73859d4e7792c0314b45fea9ee700e9.jpg', rarity: 'epic' },
        { id: 6, name: 'Спутник', price: 250, image: 'https://avatars.mds.yandex.net/i?id=ea97a812a31ab4cab52a9d31a063ead3-4422933-images-thumbs&n=13', rarity: 'common' },
        { id: 7, name: 'Орешик', price: 22000, image: 'https://avatars.mds.yandex.net/i?id=8ea361c6467f96f0761103fea81bba1207bef098-5709479-images-thumbs&n=13', rarity: 'legendary' },
        { id: 8, name: 'Туманность', price: 600, image: 'https://avatars.mds.yandex.net/get-mpic/1726038/img_id2148614872512381833.jpeg/orig', rarity: 'epic' },
        { id: 9, name: 'Астероид', price: 180, image: 'https://avatars.mds.yandex.net/i?id=3944d0a19add44cdf6fc0ae9b64bebe0_l-5496315-images-thumbs&n=13', rarity: 'common' },
        { id: 10, name: 'Солнечная система', price: 1500, image: 'https://avatars.mds.yandex.net/i?id=7233381704f85a54408b48e45ed03227_l-5235022-images-thumbs&n=13', rarity: 'legendary' },
    ];

    const cases = [
        {
            id: 1,
            name: 'Стартовый кейс',
            price: 500,
            contains: '3 случайных подарка (шанс на редкий)',
            rarity: 'common',
            image: 'https://i.imgur.com/JQlY5zD.png'
        },
        {
            id: 2,
            name: 'Галактический кейс',
            price: 1500,
            contains: '5 подарков (гарантированно 1 эпический)',
            rarity: 'rare',
            image: 'https://i.imgur.com/mXJjZfQ.png'
        },
        {
            id: 3,
            name: 'Космический кейс',
            price: 3500,
            contains: '7 подарков (гарантированно 2 эпических)',
            rarity: 'epic',
            image: 'https://i.imgur.com/Kv1cW9C.png'
        },
        {
            id: 4,
            name: 'Легендарный кейс',
            price: 7500,
            contains: '10 подарков (гарантированно 1 легендарный)',
            rarity: 'legendary',
            image: 'https://i.imgur.com/L8tT3hP.png'
        },
        {
            id: 5,
            name: 'Звездный кейс',
            price: 15000,
            contains: '15 подарков (гарантированно 2 легендарных)',
            rarity: 'mythic',
            image: 'https://i.imgur.com/VYpQxZg.png'
        },
    ];

    const starPackages = [
        { id: 1, stars: 500, price: 99, discount: 0, popular: false },
        { id: 2, stars: 1200, price: 199, discount: 15, popular: true },
        { id: 3, stars: 3000, price: 399, discount: 25, popular: false },
        { id: 4, stars: 6500, price: 799, discount: 30, popular: true },
        { id: 5, stars: 15000, price: 1499, discount: 40, popular: false },
    ];

    const handleBuyStars = (packageId) => {
        setSelectedStarPackage(packageId);
        console.log(`Buying package ${packageId}`);
        setShowStarModal(false);
    };

    const getRarityColor = (rarity) => {
        switch(rarity) {
            case 'common': return '#4d79f6';
            case 'rare': return '#4af';
            case 'epic': return '#a5f';
            case 'legendary': return '#fa5';
            case 'mythic': return '#f5a';
            default: return '#4d79f6';
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.backgroundEffects}>
                <div className={styles.stars}></div>
                <div className={styles.twinkling}></div>
                <div className={styles.nebula}></div>
            </div>

            <div className={styles.pageContent}>
                <div className={styles.header}>
                    <button
                        className={styles.backButton}
                        onClick={() => navigate('/home')}
                    >
                        <FiArrowLeft size={24} />
                        Назад
                    </button>
                    <div className={styles.currency}>
                        <button
                            className={styles.marketplaceButton}
                            onClick={() => navigate('/marketplace')}
                        >
                            <FiShoppingBag size={18} />
                            Торговая площадка
                        </button>
                        <div className={styles.currencyDisplay} onClick={() => setShowStarModal(true)}>
                            <FiStar className={styles.currencyIcon} />
                            <span className={styles.currencyAmount}>10,500</span>
                            <button className={styles.addStarsButton}>
                                <FiPlus size={18} />
                            </button>
                        </div>

                    </div>
                </div>

                <div className={styles.content}>
                    <h1 className={styles.title}>Космические подарки</h1>

                    <div className={styles.subtitleWrapper}>
                        <p className={styles.subtitle}>
                            Приобретайте уникальные подарки или открывайте кейсы с сюрпризами.
                            <span className={styles.highlight}> Каждый предмет можно отправить другу</span>, оставить себе или продать на торговой площадке.
                        </p>
                        <div className={styles.rarityLegend}>
                            <span style={{ color: '#4d79f6' }}>Обычный</span>
                            <span style={{ color: '#4af' }}>Редкий</span>
                            <span style={{ color: '#a5f' }}>Эпический</span>
                            <span style={{ color: '#fa5' }}>Легендарный</span>
                            <span style={{ color: '#f5a' }}>Мифический</span>
                        </div>
                    </div>

                    <div className={styles.giftsGrid}>
                        {gifts.map(gift => (
                            <div key={gift.id} className={styles.giftCard} data-rarity={gift.rarity}>
                                <div className={styles.giftImageWrapper}>
                                    <img src={gift.image} alt={gift.name} className={styles.giftImage} />
                                    <div className={styles.giftGlow} style={{ '--rarity-color': getRarityColor(gift.rarity) }} />
                                </div>
                                <div className={styles.giftInfo}>
                                    <h3 className={styles.giftName}>{gift.name}</h3>
                                    <div className={styles.giftPrice}>
                                        <FiStar className={styles.priceIcon} />
                                        <span>{gift.price.toLocaleString()}</span>
                                    </div>
                                    <button className={styles.buyButton}>Получить</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className={styles.casesTitle}>Космические кейсы</h2>
                    <div className={styles.casesContainer}>
                        {cases.map(caseItem => (
                            <div key={caseItem.id} className={styles.caseCard} data-rarity={caseItem.rarity}>
                                <div className={styles.caseGlow} style={{ '--rarity-color': getRarityColor(caseItem.rarity) }} />
                                <div className={styles.caseContent}>
                                    <div className={styles.caseImageWrapper}>
                                        <img src={caseItem.image} alt={caseItem.name} className={styles.caseImage} />
                                    </div>
                                    <h3 className={styles.caseName}>{caseItem.name}</h3>
                                    <p className={styles.caseContains}>{caseItem.contains}</p>
                                    <div className={styles.caseRarity} data-rarity={caseItem.rarity}>
                                        {caseItem.rarity === 'common' && 'Обычный'}
                                        {caseItem.rarity === 'rare' && 'Редкий'}
                                        {caseItem.rarity === 'epic' && 'Эпический'}
                                        {caseItem.rarity === 'legendary' && 'Легендарный'}
                                        {caseItem.rarity === 'mythic' && 'Мифический'}
                                    </div>
                                    <div className={styles.casePrice}>
                                        <FiStar className={styles.priceIcon} />
                                        <span>{caseItem.price.toLocaleString()}</span>
                                    </div>
                                    <button className={styles.openButton}>Открыть</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showStarModal && (
                <div className={styles.starModalOverlay}>
                    <div className={styles.starModal}>
                        <button className={styles.closeModal} onClick={() => setShowStarModal(false)}>
                            ×
                        </button>
                        <h2 className={styles.modalTitle}>Пополнить баланс</h2>
                        <p className={styles.modalSubtitle}>
                            <span className={styles.starHighlight}>Звёзды</span> — ваша космическая валюта для покупки уникального контента и эксклюзивных подарков в мессенджере! Дарите радость друзьям или украшайте свои чаты!
                        </p>
                        <div className={styles.starPackages}>
                            {starPackages.map(pkg => (
                                <div
                                    key={pkg.id}
                                    className={`${styles.starPackage} ${pkg.popular ? styles.popular : ''}`}
                                    onClick={() => handleBuyStars(pkg.id)}
                                >
                                    {pkg.popular && <div className={styles.popularBadge}>Выгодно!</div>}
                                    <div className={styles.starAmount}>
                                        <FiStar className={styles.starIcon} />
                                        {pkg.stars.toLocaleString()}
                                    </div>
                                    <div className={styles.packagePrice}>
                                        {pkg.discount > 0 && (
                                            <span className={styles.originalPrice}>
                                                {Math.round(pkg.price / (1 - pkg.discount/100))} ₽
                                            </span>
                                        )}
                                        <span className={styles.discountedPrice}>{pkg.price} ₽</span>
                                    </div>
                                    {pkg.discount > 0 && (
                                        <div className={styles.discountBadge}>-{pkg.discount}%</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <a href="/terms" className={styles.termsLink}>Условия соглашения</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GiftPage;