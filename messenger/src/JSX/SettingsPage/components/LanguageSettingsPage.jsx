import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGlobe, FiChevronRight } from 'react-icons/fi';
import cl from '../styles/SettingsPage.module.css';
import styles from '../styles/LanguageSettingsPage.module.css';
import Sidebar from '../components/Sidebar';

const LanguageSettingsPage = () => {
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = React.useState('russian');

    const languages = [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
        { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
        { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
        { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
        { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    ];

    return (
        <div className={cl.container}>
            <Sidebar />
            <div className={cl.mainContent}>
                <div className={cl.contentWrapper}>
                    <header className={cl.pageHeader}>
                        <div className={styles.languageHeaderContent}>

                            <div>
                                <h1>Языковые настройки</h1>
                                <p>Выберите предпочитаемый язык интерфейса</p>
                            </div>
                        </div>
                    </header>

                    <div className={styles.languageContent}>
                        <div className={styles.currentLanguage}>
                            <div className={styles.currentLanguageInfo}>
                                <span className={styles.languageFlag}>🇷🇺</span>
                                <div>
                                    <h3>Русский</h3>
                                    <p>Текущий язык интерфейса</p>
                                </div>
                            </div>
                            <div className={styles.languageStatus}>
                                <span className={styles.activeBadge}>Активен</span>
                            </div>
                        </div>

                        <div className={styles.languageList}>
                            <h3 className={styles.languageListTitle}>Доступные языки</h3>
                            <div className={styles.languageItems}>
                                {languages.map((language) => (
                                    <div
                                        key={language.code}
                                        className={`${styles.languageItem} ${selectedLanguage === language.code ? styles.selectedLanguage : ''}`}
                                        onClick={() => setSelectedLanguage(language.code)}
                                    >
                                        <div className={styles.languageInfo}>
                                            <span className={styles.languageFlag}>{language.flag}</span>
                                            <div>
                                                <h4>{language.name}</h4>
                                                <p>{language.nativeName}</p>
                                            </div>
                                        </div>
                                        {selectedLanguage === language.code ? (
                                            <div className={styles.languageSelected}>
                                                <span className={styles.activeDot}></span>
                                            </div>
                                        ) : (
                                            <FiChevronRight className={styles.languageArrow} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.languageActions}>
                            <button className={cl.saveButton}>
                                Применить изменения
                            </button>
                            <button
                                className={cl.cancelButton}
                                onClick={() => navigate('/settings')}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LanguageSettingsPage;