import React, { useState } from 'react';
import { FiArrowLeft, FiStar, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/TradingPlatformPage.module.css';

const TradingPlatformPage = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [walletBalance, setWalletBalance] = useState(1250);
    const [showStarModal, setShowStarModal] = useState(false);
    const [selectedStarPackage, setSelectedStarPackage] = useState(null);
    const navigate = useNavigate();

    const starPackages = [
        { id: 1, stars: 500, price: 99, discount: 0, popular: false },
        { id: 2, stars: 1200, price: 199, discount: 15, popular: true },
        { id: 3, stars: 3000, price: 399, discount: 25, popular: false },
        { id: 4, stars: 6500, price: 799, discount: 30, popular: true },
        { id: 5, stars: 15000, price: 1499, discount: 40, popular: false },
    ];

    const handleBuyStars = (packageId) => {
        const packageToBuy = starPackages.find(pkg => pkg.id === packageId);
        if (packageToBuy) {
            setWalletBalance(walletBalance + packageToBuy.stars);
            setSelectedStarPackage(packageId);
            setShowStarModal(false);
        }
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

    // Mock data for active listings
    const activeListings = [
        {
            id: 1,
            name: 'Космический корабль',
            image: 'https://example.com/spaceship.jpg',
            quantity: 1,
            price: 450,
            rarity: 'epic',
            seller: 'GalacticTrader',
            timeLeft: '2д 5ч'
        },
        {
            id: 2,
            name: 'Звёздный кристалл',
            image: 'https://example.com/crystal.jpg',
            quantity: 3,
            price: 150,
            rarity: 'rare',
            seller: 'StarCollector',
            timeLeft: '1д 12ч'
        },
        {
            id: 3,
            name: 'Легендарный артефакт',
            image: 'https://example.com/artifact.jpg',
            quantity: 1,
            price: 1200,
            rarity: 'legendary',
            seller: 'AncientOne',
            timeLeft: '3д 8ч'
        }
    ];

    // Mock data for trade history
    const tradeHistory = [
        {
            id: 101,
            item: 'Космический шлем',
            image: 'https://example.com/helmet.jpg',
            type: 'purchase',
            price: 320,
            counterparty: 'SpaceExplorer',
            date: '12.05.2023'
        },
        {
            id: 102,
            item: 'Набор планет',
            image: 'https://example.com/planets.jpg',
            type: 'sale',
            price: 580,
            counterparty: 'PlanetHunter',
            date: '08.05.2023'
        }
    ];

    // Mock data for purchase requests
    const purchaseRequests = [
        {
            id: 201,
            item: 'Редкий метеорит',
            image: 'https://example.com/meteorite.jpg',
            price: 750,
            seller: 'MeteorMiner',
            status: 'pending',
            date: '15.05.2023'
        }
    ];

    // Mock data for marketplace items
    const marketplaceItems = [
        {
            id: 301,
            name: 'Галактический компас',
            image: 'https://example.com/compass.jpg',
            quantity: 5,
            minPrice: 200,
            rarity: 'rare'
        },
        {
            id: 302,
            name: 'Тёмная материя',
            image: 'https://example.com/darkmatter.jpg',
            quantity: 2,
            minPrice: 800,
            rarity: 'epic'
        },
        {
            id: 303,
            name: 'Сверхновая звезда',
            image: 'https://example.com/supernova.jpg',
            quantity: 1,
            minPrice: 1500,
            rarity: 'legendary'
        },
        {
            id: 304,
            name: 'Квантовый двигатель',
            image: 'https://example.com/engine.jpg',
            quantity: 3,
            minPrice: 350,
            rarity: 'rare'
        },
        {
            id: 305,
            name: 'Чёрная дыра',
            image: 'https://example.com/blackhole.jpg',
            quantity: 1,
            minPrice: 2500,
            rarity: 'mythic'
        },
        {
            id: 306,
            name: 'Солнечный парус',
            image: 'https://example.com/sail.jpg',
            quantity: 4,
            minPrice: 180,
            rarity: 'common'
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'active':
                return (
                    <div className={styles.listingsContainer}>
                        <h3 className={styles.subSectionTitle}>Активные лоты</h3>
                        {activeListings.length > 0 ? (
                            <div className={styles.listingsGrid}>
                                {activeListings.map(item => (
                                    <div key={item.id} className={styles.listingCard} data-rarity={item.rarity}>
                                        <div className={styles.listingImageWrapper}>
                                            <div className={styles.listingGlow} style={{ '--rarity-color': getRarityColor(item.rarity) }} />
                                            <img src={item.image} alt={item.name} className={styles.listingImage} />
                                        </div>
                                        <div className={styles.listingInfo}>
                                            <h4 className={styles.listingName}>{item.name}</h4>
                                            <div className={styles.listingDetails}>
                                                <span>Кол-во: {item.quantity}</span>
                                                <span>Продавец: {item.seller}</span>
                                                <span>Осталось: {item.timeLeft}</span>
                                            </div>
                                            <div className={styles.listingPrice}>
                                                <FiStar className={styles.priceIcon} />
                                                <span>{item.price.toLocaleString()}</span>
                                            </div>
                                            <button className={styles.actionButton}>Купить сейчас</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <p>Нет активных лотов</p>
                            </div>
                        )}
                    </div>
                );
            case 'history':
                return (
                    <div className={styles.listingsContainer}>
                        <h3 className={styles.subSectionTitle}>История сделок</h3>
                        {tradeHistory.length > 0 ? (
                            <div className={styles.historyTable}>
                                <div className={styles.tableHeader}>
                                    <span>Предмет</span>
                                    <span>Тип</span>
                                    <span>Цена</span>
                                    <span>Контрагент</span>
                                    <span>Дата</span>
                                </div>
                                {tradeHistory.map(item => (
                                    <div key={item.id} className={styles.tableRow}>
                                        <div className={styles.tableCell}>
                                            <img src={item.image} alt={item.item} className={styles.historyImage} />
                                            <span>{item.item}</span>
                                        </div>
                                        <div className={styles.tableCell}>
                                            <span className={item.type === 'purchase' ? styles.purchaseBadge : styles.saleBadge}>
                                                {item.type === 'purchase' ? 'Покупка' : 'Продажа'}
                                            </span>
                                        </div>
                                        <div className={styles.tableCell}>
                                            <FiStar className={styles.priceIcon} />
                                            {item.price.toLocaleString()}
                                        </div>
                                        <div className={styles.tableCell}>{item.counterparty}</div>
                                        <div className={styles.tableCell}>{item.date}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <p>Нет истории сделок</p>
                            </div>
                        )}
                    </div>
                );
            case 'requests':
                return (
                    <div className={styles.listingsContainer}>
                        <h3 className={styles.subSectionTitle}>Мои запросы на покупку</h3>
                        {purchaseRequests.length > 0 ? (
                            <div className={styles.requestsGrid}>
                                {purchaseRequests.map(item => (
                                    <div key={item.id} className={styles.requestCard}>
                                        <div className={styles.requestImageWrapper}>
                                            <img src={item.image} alt={item.item} className={styles.requestImage} />
                                        </div>
                                        <div className={styles.requestInfo}>
                                            <h4>{item.item}</h4>
                                            <div className={styles.requestDetails}>
                                                <span>Продавец: {item.seller}</span>
                                                <span>Статус: <span className={styles.statusBadge}>{item.status === 'pending' ? 'Ожидание' : 'Завершено'}</span></span>
                                                <span>Дата: {item.date}</span>
                                            </div>
                                            <div className={styles.requestPrice}>
                                                <FiStar className={styles.priceIcon} />
                                                <span>{item.price.toLocaleString()}</span>
                                            </div>
                                            <button className={styles.cancelButton}>Отменить</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <p>Нет активных запросов</p>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
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
                        onClick={() => navigate('/gift')}
                    >
                        <FiArrowLeft size={24} />
                        Назад
                    </button>

                    <h1 className={styles.title}>Торговая площадка</h1>

                    <div className={styles.currency}>
                        <div className={styles.currencyDisplay} onClick={() => setShowStarModal(true)}>
                            <FiStar className={styles.currencyIcon} />
                            <span className={styles.currencyAmount}>{walletBalance.toLocaleString()}</span>
                            <button className={styles.addStarsButton}>
                                <FiPlus size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('active')}
                        >
                            Активные лоты
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'history' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            История сделок
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'requests' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('requests')}
                        >
                            Мои запросы
                        </button>
                    </div>

                    {renderTabContent()}

                    <div className={styles.marketplaceSection}>
                        <h2 className={styles.sectionTitle}>Подарки на продажу</h2>
                        <div className={styles.marketplaceGrid}>
                            {marketplaceItems.map(item => (
                                <div key={item.id} className={styles.marketplaceCard} data-rarity={item.rarity}>
                                    <div className={styles.marketplaceImageWrapper}>
                                        <div className={styles.marketplaceGlow} style={{ '--rarity-color': getRarityColor(item.rarity) }} />
                                        <img src={item.image} alt={item.name} className={styles.marketplaceImage} />
                                    </div>
                                    <div className={styles.marketplaceInfo}>
                                        <h3 className={styles.marketplaceName}>{item.name}</h3>
                                        <div className={styles.marketplaceDetails}>
                                            <span>Доступно: {item.quantity}</span>
                                            <div className={styles.marketplacePrice}>
                                                <span>Цена от: </span>
                                                <FiStar className={styles.priceIcon} />
                                                <span>{item.minPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <button className={styles.marketplaceButton}>Предложить цену</button>
                                    </div>
                                </div>
                            ))}
                        </div>
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

export default TradingPlatformPage;