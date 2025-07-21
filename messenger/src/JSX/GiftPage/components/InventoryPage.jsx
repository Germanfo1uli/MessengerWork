import React, { useState } from 'react';
import { FiArrowLeft, FiStar, FiGift, FiSearch, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/InventoryPage.module.css';

const InventoryPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRarity, setFilterRarity] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const navigate = useNavigate();

    const rarities = [
        { id: 'all', name: 'Все редкости' },
        { id: 'common', name: 'Обычные' },
        { id: 'rare', name: 'Редкие' },
        { id: 'epic', name: 'Эпические' },
        { id: 'legendary', name: 'Легендарные' },
        { id: 'mythic', name: 'Мифические' }
    ];

    const sortOptions = [
        { id: 'newest', name: 'Сначала новые' },
        { id: 'oldest', name: 'Сначала старые' },
        { id: 'rarity-asc', name: 'Редкость (по возрастанию)' },
        { id: 'rarity-desc', name: 'Редкость (по убыванию)' },
        { id: 'name-asc', name: 'Название (А-Я)' },
        { id: 'name-desc', name: 'Название (Я-А)' }
    ];

    // Mock данные инвентаря
    const inventoryItems = [
        {
            id: 1,
            name: 'Космический корабль',
            image: 'https://example.com/spaceship.jpg',
            quantity: 2,
            rarity: 'epic',
            dateAcquired: '2023-05-15',
            description: 'Исследуйте галактику на этом мощном корабле'
        },
        {
            id: 2,
            name: 'Звёздный кристалл',
            image: 'https://example.com/crystal.jpg',
            quantity: 5,
            rarity: 'rare',
            dateAcquired: '2023-05-10',
            description: 'Кристалл, наполненный энергией звёзд'
        },
        {
            id: 3,
            name: 'Легендарный артефакт',
            image: 'https://example.com/artifact.jpg',
            quantity: 1,
            rarity: 'legendary',
            dateAcquired: '2023-04-28',
            description: 'Древний артефакт невероятной силы'
        },
        {
            id: 4,
            name: 'Галактический компас',
            image: 'https://example.com/compass.jpg',
            quantity: 3,
            rarity: 'rare',
            dateAcquired: '2023-05-18',
            description: 'Никогда не теряйтесь в космосе'
        },
        {
            id: 5,
            name: 'Чёрная дыра',
            image: 'https://example.com/blackhole.jpg',
            quantity: 1,
            rarity: 'mythic',
            dateAcquired: '2023-05-20',
            description: 'Используйте с осторожностью!'
        },
        {
            id: 6,
            name: 'Солнечный парус',
            image: 'https://example.com/sail.jpg',
            quantity: 4,
            rarity: 'common',
            dateAcquired: '2023-05-05',
            description: 'Ловите солнечный ветер для движения'
        },
        {
            id: 7,
            name: 'Квантовый двигатель',
            image: 'https://example.com/engine.jpg',
            quantity: 2,
            rarity: 'rare',
            dateAcquired: '2023-05-12',
            description: 'Передвигайтесь быстрее скорости света'
        },
        {
            id: 8,
            name: 'Планета Земля',
            image: 'https://example.com/earth.jpg',
            quantity: 1,
            rarity: 'legendary',
            dateAcquired: '2023-05-01',
            description: 'Ваш собственный голубой шарик'
        }
    ];

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

    const getRarityName = (rarity) => {
        switch(rarity) {
            case 'common': return 'Обычный';
            case 'rare': return 'Редкий';
            case 'epic': return 'Эпический';
            case 'legendary': return 'Легендарный';
            case 'mythic': return 'Мифический';
            default: return 'Обычный';
        }
    };

    const filterItems = () => {
        let items = [...inventoryItems];

        // Фильтрация по поисковому запросу
        if (searchQuery) {
            items = items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Фильтрация по редкости
        if (filterRarity !== 'all') {
            items = items.filter(item => item.rarity === filterRarity);
        }

        // Фильтрация по вкладке
        if (activeTab === 'favorites') {
            // В реальном приложении здесь была бы проверка на избранное
            // items = items.filter(item => item.isFavorite);
        }

        // Сортировка
        items.sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return new Date(b.dateAcquired) - new Date(a.dateAcquired);
                case 'oldest':
                    return new Date(a.dateAcquired) - new Date(b.dateAcquired);
                case 'rarity-asc':
                    return Object.keys(rarities).indexOf(a.rarity) - Object.keys(rarities).indexOf(b.rarity);
                case 'rarity-desc':
                    return Object.keys(rarities).indexOf(b.rarity) - Object.keys(rarities).indexOf(a.rarity);
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });

        return items;
    };

    const filteredItems = filterItems();

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
                        onClick={() => navigate('/')}
                    >
                        <FiArrowLeft size={24} />
                        Назад
                    </button>

                    <h1 className={styles.title}>Мои подарки</h1>

                    <div className={styles.currency}>
                        <div className={styles.currencyDisplay}>
                            <FiGift className={styles.currencyIcon} />
                            <span className={styles.currencyAmount}>{filteredItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            Все подарки
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'favorites' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('favorites')}
                        >
                            Избранное
                        </button>
                    </div>

                    <div className={styles.inventoryControls}>
                        <div className={styles.searchContainer}>
                            <FiSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Поиск подарков..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <div className={styles.filterContainer}>
                                <FiFilter className={styles.filterIcon} />
                                <select
                                    className={styles.filterSelect}
                                    value={filterRarity}
                                    onChange={(e) => setFilterRarity(e.target.value)}
                                >
                                    {rarities.map(rarity => (
                                        <option key={rarity.id} value={rarity.id}>
                                            {rarity.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.sortContainer}>
                                <select
                                    className={styles.sortSelect}
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.inventoryGrid}>
                        {filteredItems.length > 0 ? (
                            filteredItems.map(item => (
                                <div key={item.id} className={styles.giftCard} data-rarity={item.rarity}>
                                    <div className={styles.giftImageWrapper}>
                                        <div className={styles.giftGlow} style={{ '--rarity-color': getRarityColor(item.rarity) }} />
                                        <img src={item.image} alt={item.name} className={styles.giftImage} />
                                        <div className={styles.quantityBadge}>
                                            x{item.quantity}
                                        </div>
                                    </div>
                                    <div className={styles.giftInfo}>
                                        <h3 className={styles.giftName}>{item.name}</h3>
                                        <div className={styles.giftRarity} style={{ color: getRarityColor(item.rarity) }}>
                                            {getRarityName(item.rarity)}
                                        </div>
                                        <p className={styles.giftDescription}>{item.description}</p>
                                        <div className={styles.giftFooter}>
                                            <span className={styles.giftDate}>
                                                Получен: {new Date(item.dateAcquired).toLocaleDateString()}
                                            </span>
                                            <div className={styles.giftActions}>
                                                <button className={styles.giftButton}>Подарить</button>
                                                <button className={styles.favoriteButton}>
                                                    <FiStar className={styles.favoriteIcon} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <FiGift size={64} className={styles.emptyIcon} />
                                <h3>Инвентарь пуст</h3>
                                <p>Здесь будут отображаться полученные вами подарки</p>
                                <button className={styles.exploreButton}>Исследовать магазин</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;