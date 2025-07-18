import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiGlobe, FiBell, FiShield, FiLogOut } from 'react-icons/fi';
import { RiSpaceShipLine } from 'react-icons/ri';
import styles from '../styles/SettingsPage.module.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Определяем активную страницу на основе пути
    const getActivePath = () => {
        const path = location.pathname;
        if (path.startsWith('/settings')) return 'settings';
        if (path.startsWith('/language')) return 'language';
        if (path.startsWith('/appearance')) return 'appearance';
        if (path.startsWith('/security')) return 'security';
        if (path.startsWith('/home')) return 'exit';
        return 'settings'; // по умолчанию
    };

    const activePath = getActivePath();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <RiSpaceShipLine className={styles.logoIcon} />
                <h2>Космические Настройки</h2>
            </div>
            <nav className={styles.navMenu}>
                <button
                    className={`${styles.navButton} ${activePath === 'settings' ? styles.active : ''}`}
                    onClick={() => navigate('/settings')}
                >
                    <FiUser className={styles.navIcon} />
                    <span>Профиль</span>
                </button>
                <button
                    className={`${styles.navButton} ${activePath === 'language' ? styles.active : ''}`}
                    onClick={() => navigate('/language')}
                >
                    <FiGlobe className={styles.navIcon} />
                    <span>Язык</span>
                </button>
                <button
                    className={`${styles.navButton} ${activePath === 'appearance' ? styles.active : ''}`}
                    onClick={() => navigate('/appearance')}
                >
                    <FiBell className={styles.navIcon} />
                    <span>Внешний вид</span>
                </button>
                <button
                    className={`${styles.navButton} ${activePath === 'security' ? styles.active : ''}`}
                    onClick={() => navigate('/security')}
                >
                    <FiShield className={styles.navIcon} />
                    <span>Безопасность</span>
                </button>
                <button
                    className={`${styles.navButton} ${activePath === 'exit' ? styles.active : ''}`}
                    onClick={() => navigate('/home')}
                >
                    <FiLogOut className={styles.navIcon} />
                    <span>Выход</span>
                </button>
            </nav>
            <div className={styles.sidebarFooter}>
                <div className={styles.statusLight}></div>
                <span>Связь стабильная</span>
            </div>
        </aside>
    );
};

export default Sidebar;