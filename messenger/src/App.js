// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styles from './App.module.css';
import StarField from './JSX/WelcomePage/components/StarField';
import WelcomeScreen from './JSX/WelcomePage/components/WelcomeScreen';
import AuthScreen from './JSX/WelcomePage/components/AuthScreen';
import MainPage from './JSX/MainPage/components/MainPage';
import { AuthProvider } from './hooks/UseAuth';
import SettingsPage from "./JSX/SettingsPage/components/SettingsPage";
import LanguageSettingsPage from "./JSX/SettingsPage/components/LanguageSettingsPage";
import AppearanceSettings from "./JSX/SettingsPage/components/AppearanceSettings";
import SecurityPage from "./JSX/SettingsPage/components/SecurityPage";

const AppContent = () => {
    const [currentScreen, setCurrentScreen] = useState('welcome');
    const location = useLocation();

    return (
        <div className={styles.appContainer}>
            {location.pathname !== '/home' || '/settings'  || '/language' || '/appearance' || '/security' && <StarField />}
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
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/language" element={<LanguageSettingsPage />} />
                        <Route path="/appearance" element={<AppearanceSettings />} />
                        <Route path="/security" element={<SecurityPage />} />
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