import React, { useState } from 'react';
import styles from './CSS/WelcomePage/App.module.css';
import StarField from './JSX/WelcomePage/StarField';
import WelcomeScreen from './JSX/WelcomePage/WelcomeScreen';
import AuthScreen from './JSX/WelcomePage/AuthScreen';

const App = () => {
    const [currentScreen, setCurrentScreen] = useState('welcome');

    return (
        <div className={styles.appContainer}>
            <StarField />
            <div className={styles.spaceOverlay} />

            <div className={styles.contentContainer}>
                {currentScreen === 'welcome' && (
                    <WelcomeScreen onEnter={() => setCurrentScreen('auth')} />
                )}

                {currentScreen === 'auth' && (
                    <AuthScreen onBack={() => setCurrentScreen('welcome')} />
                )}
            </div>
        </div>
    );
};

export default App;