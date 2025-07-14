import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import StarField from './JSX/WelcomePage/components/StarField';
import WelcomeScreen from './JSX/WelcomePage/components/WelcomeScreen';
import AuthScreen from './JSX/WelcomePage/components/AuthScreen';
// import HomePage from './JSX/HomePage';

const App = () => {
    const [currentScreen, setCurrentScreen] = useState('welcome');

    return (
        <Router>
            <div className={styles.appContainer}>
                <StarField />
                <div className={styles.spaceOverlay} />

                <div className={styles.contentContainer}>
                    <Routes>
                        <Route path="/" element={
                            currentScreen === 'welcome' ? (
                                <WelcomeScreen onEnter={() => setCurrentScreen('auth')} />
                            ) : (
                                <AuthScreen onBack={() => setCurrentScreen('welcome')} />
                            )
                        } />
                        {/*<Route path="/home" element={<HomePage />} />*/}
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;