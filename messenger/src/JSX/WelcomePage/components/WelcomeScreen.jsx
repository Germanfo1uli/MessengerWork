import React from 'react';
import styles from '../styles/WelcomeScreen.module.css';
import { Rocket, MessageCircle } from 'lucide-react';

const WelcomeScreen = ({ onEnter }) => {
    return (
        <div className={styles.welcomeContainer}>
            <div className={styles.welcomeContent}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoBackground}>
                        <div className={styles.logoPulse} />
                        <div className={styles.logoIcon}>
                            <MessageCircle className={styles.icon} />
                        </div>
                    </div>
                </div>

                <h1 className={styles.title}>IMAXIMUS</h1>

                <p className={styles.subtitle}>Добро пожаловать в космос общения</p>

                <p className={styles.description}>Соединяйтесь с друзьями по всей галактике</p>

                <div className={styles.buttonContainer}>
                    <button
                        onClick={onEnter}
                        className={styles.enterButton}
                        aria-label="Начать путешествие"
                    >
                        <Rocket className={styles.buttonIcon} />
                        Начать путешествие
                    </button>

                    <p className={styles.footerText}>Всё это время мы ждали вас</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;