import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styles from './App.module.css';
import StarField from './JSX/WelcomePage/components/StarField';
import WelcomeScreen from './JSX/WelcomePage/components/WelcomeScreen';
import AuthScreen from './JSX/WelcomePage/components/AuthScreen';
import MainPage from './JSX/MainPage/components/MainPage';
import { AuthProvider } from './hooks/UseAuth';
import SettingsPage from './JSX/SettingsPage/components/SettingsPage';
import LanguageSettingsPage from './JSX/SettingsPage/components/LanguageSettingsPage';
import AppearanceSettings from './JSX/SettingsPage/components/AppearanceSettings';
import SecurityPage from './JSX/SettingsPage/components/SecurityPage';
import GiftPage from './JSX/GiftPage/components/GiftPage';
import TradingPlatformPage from './JSX/GiftPage/components/TradingPlatformPage';
import InventoryPage from './JSX/GiftPage/components/InventoryPage';
import GroupSettings from './JSX/SettingsPage/components/GroupSettings';
import { ThemeProvider } from './JSX/SettingsPage/components/Context/ThemeContext';
import { UserProvider } from './JSX/SettingsPage/components/Context/UserContext';
import Modal from './JSX/MainPage/components/Modal';

const AppContent = () => {
    const [currentScreen, setCurrentScreen] = useState('welcome');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();

    const noStarFieldPaths = ['/home', '/settings', '/language', '/appearance', '/security', '/gift', '/marketplace', '/inventory', '/groups'];

    return (
        <div className={styles.appContainer}>
            {!noStarFieldPaths.includes(location.pathname) && <StarField />}
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
                        <Route path="/home" element={<MainPage setIsModalOpen={setIsModalOpen} />} />
                        <Route path="/settings" element={<SettingsPage setIsModalOpen={setIsModalOpen} />} />
                        <Route path="/language" element={<LanguageSettingsPage />} />
                        <Route path="/appearance" element={<AppearanceSettings />} />
                        <Route path="/security" element={<SecurityPage />} />
                        <Route path="/gift" element={<GiftPage />} />
                        <Route path="/marketplace" element={<TradingPlatformPage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/groups" element={<GroupSettings />} />
                    </Routes>
                )}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <UserProvider>
                    <Router>
                        <AppContent />
                    </Router>
                </UserProvider>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;