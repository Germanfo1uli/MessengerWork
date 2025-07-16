// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styles from './App.module.css';
import StarField from './JSX/WelcomePage/components/StarField';
import WelcomeScreen from './JSX/WelcomePage/components/WelcomeScreen';
import AuthScreen from './JSX/WelcomePage/components/AuthScreen';
import MainPage from './JSX/MainPage/components/MainPage';
import { AuthProvider } from './hooks/UseAuth';

const AppContent = () => {
    const [currentScreen, setCurrentScreen] = useState('welcome');
    const location = useLocation();

    return (
        <div className={styles.appContainer}>
            {location.pathname !== '/home' && <StarField />}
            <div className={styles.spaceOverlay} />

            <div className={styles.contentContainer}>
                {location.pathname === '/' ? (
                    currentScreen === 'welcome' ? (
                        <WelcomeScreen onEnter={() => setCurrentScreen('auth')} />
                    ) : (
                        <AuthScreen onBack={() => setCurrentScreen('welcome')} />
                    )
                ) : (
                    <Routes>
                        <Route path="/home" element={<MainPage />} />
                    </Routes>
                )}
            </div>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

export default App;