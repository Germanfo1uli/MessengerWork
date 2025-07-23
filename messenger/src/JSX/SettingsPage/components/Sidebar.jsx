import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiGlobe, FiBell, FiShield, FiLogOut, FiArrowLeft, FiUsers } from 'react-icons/fi';
import { RiSpaceShipLine } from 'react-icons/ri';
import styles from '../styles/SettingsPage.module.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getActivePath = () => {
        const path = location.pathname;
        if (path.startsWith('/settings')) return 'settings';
        if (path.startsWith('/groups')) return 'groups';
        if (path.startsWith('/language')) return 'language';
        if (path.startsWith('/appearance')) return 'appearance';
        if (path.startsWith('/security')) return 'security';
        return 'settings';
    };

    const activePath = getActivePath();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <RiSpaceShipLine className={styles.logoIcon} />
                <h2>Космические Настройки</h2>
            </div>

            {/* Кнопка "Назад" - теперь ведет на /home */}
            <button
                className={`${styles.navButton} ${styles.backButton}`}
                onClick={() => navigate('/home')}
            >
                <FiArrowLeft className={styles.navIcon} />
                <span>На главную</span>
            </button>

            <nav className={styles.navMenu}>
                <button
                    className={`${styles.navButton} ${activePath === 'settings' ? styles.active : ''}`}
                    onClick={() => navigate('/settings')}
                >
                    <FiUser className={styles.navIcon} />
                    <span>Профиль</span>
                </button>
                <button
                    className={`${styles.navButton} ${activePath === 'groups' ? styles.active : ''}`}
                    onClick={() => navigate('/groups')}
                >
                    <FiUsers className={styles.navIcon} />
                    <span>Группы</span>
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
            </nav>


            <div className={styles.exitSection}>
                <button
                    className={`${styles.navButton} ${styles.exitButton}`}
                    onClick={() => {
                        console.log('Выход из аккаунта');
                        navigate('/');
                    }}
                >
                    <FiLogOut className={styles.navIcon} />
                    <span>Выйти из аккаунта</span>
                </button>
            </div>

            <div className={styles.sidebarFooter}>
                <div className={styles.statusLight}></div>
                <span>Связь стабильная</span>
            </div>
        </aside>
    );
};

export default Sidebar;