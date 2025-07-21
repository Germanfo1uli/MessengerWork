import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import styles from '../styles/AuthScreen.module.css';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/UseAuth.js';
import { apiRequest } from '../../../hooks/ApiRequest.js';

const AuthScreen = ({ onBack }) => {
    const {login} = useAuth();
    const [authError, setAuthError] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate();

    // Схема валидации для входа
    const loginSchema = Yup.object().shape({
        phone: Yup.string()
            .matches(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX')
            .required('Обязательное поле'),
        password: Yup.string()
            .min(6, 'Пароль должен содержать минимум 6 символов')
            .required('Обязательное поле')
    });

    // Схема валидации для регистрации
    const registerSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, 'Имя должно содержать минимум 3 символа')
            .required('Обязательное поле'),
        phone: Yup.string()
            .matches(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX')
            .required('Обязательное поле'),
        password: Yup.string()
            .min(6, 'Пароль должен содержать минимум 6 символов')
            .required('Обязательное поле'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
            .required('Обязательное поле')
    });

    const {
        register: loginRegister,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors, isSubmitting: isLoginSubmitting }
    } = useForm({
        resolver: yupResolver(loginSchema)
    });

    const {
        register: registerRegister,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
    } = useForm({
        resolver: yupResolver(registerSchema)
    });

    const handleLogin = async (data) => {
        try {
            const response = await apiRequest('/api/auth/login/phone', {
                method: 'POST',
                body: { Phone: data.phone, Password: data.password },
                authenticated: false
            });

            const jwtToken = response.token.tokenValue;
            const refreshToken = response.token.clientSecret;

            await login(jwtToken, refreshToken);

            navigate('/home');
        }
        catch (error) {
            setAuthError(error.message);
        }
    };

    const handleRegister = async (data) => {
        try {
            const response = await apiRequest('/api/auth/register', {
                method: 'POST',
                body: { Phone: data.phone, Username: data.username, Password: data.password },
                authenticated: false
            });

            const jwtToken = response.token.tokenValue;
            const refreshToken = response.token.clientSecret;

            await login(jwtToken, refreshToken);

            navigate('/home');
        }
        catch (error) {
            setAuthError(error.message);
        }
    };

    const handleGoogleLogin = () => {
        console.log('Вход через Google');
        // Здесь будет логика входа через Google
        navigate('/home');
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authContent}>
                <button
                    onClick={onBack}
                    className={styles.backButton}
                >
                    <ArrowLeft className={styles.backIcon} />
                    Назад
                </button>

                <div className={styles.authCard}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>
                            Присоединиться к IMAXIMUS
                        </h2>
                        <p className={styles.cardDescription}>
                            Войдите или создайте новый аккаунт
                        </p>
                    </div>

                    <div className={styles.cardContent}>
                        <div className={styles.tabsContainer}>
                            <div className={styles.tabsList}>
                                <button
                                    className={`${styles.tabTrigger} ${activeTab === 'login' ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab('login')}
                                >
                                    Вход
                                </button>
                                <button
                                    className={`${styles.tabTrigger} ${activeTab === 'register' ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab('register')}
                                >
                                    Регистрация
                                </button>
                            </div>

                            {/* Форма входа */}
                            {activeTab === 'login' && (
                                <div className={styles.tabContent}>
                                    {authError && <div className={styles.errorMessage}>{authError}</div>}
                                    <form onSubmit={handleLoginSubmit(handleLogin)} className={styles.authForm}>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="phone" className={styles.inputLabel}>
                                                Номер телефона
                                            </label>
                                            <div className={styles.inputWrapper}>
                                                <Mail className={styles.inputIcon} />
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="+..."
                                                    className={styles.authInput}
                                                    {...loginRegister("phone")}
                                                />
                                            </div>
                                            {loginErrors.phone && (
                                                <div className={styles.errorMessage}>{loginErrors.phone.message}</div>
                                            )}
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <label htmlFor="password" className={styles.inputLabel}>
                                                Пароль
                                            </label>
                                            <div className={styles.inputWrapper}>
                                                <Lock className={styles.inputIcon} />
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Введите пароль"
                                                    className={`${styles.authInput} ${styles.passwordInput}`}
                                                    {...loginRegister("password")}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className={styles.passwordToggle}
                                                >
                                                    {showPassword ? <EyeOff className={styles.eyeIcon} /> : <Eye className={styles.eyeIcon} />}
                                                </button>
                                            </div>
                                            {loginErrors.password && (
                                                <div className={styles.errorMessage}>{loginErrors.password.message}</div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            className={styles.submitButton}
                                            disabled={isLoginSubmitting}
                                        >
                                            {isLoginSubmitting ? 'Вход...' : 'Войти'}
                                        </button>
                                    </form>

                                    <div className={styles.socialAuth}>
                                        <p className={styles.socialDivider}>или войдите через</p>
                                        <button
                                            type="button"
                                            className={styles.googleButton}
                                            onClick={handleGoogleLogin}
                                        >
                                            <FcGoogle className={styles.googleIcon} />
                                            Google
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Форма регистрации */}
                            {activeTab === 'register' && (
                                <div className={styles.tabContent}>
                                    <form onSubmit={handleRegisterSubmit(handleRegister)} className={styles.authForm}>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="username" className={styles.inputLabel}>
                                                Имя пользователя
                                            </label>
                                            <div className={styles.inputWrapper}>
                                                <User className={styles.inputIcon} />
                                                <input
                                                    id="username"
                                                    type="text"
                                                    placeholder="Ваше имя"
                                                    className={styles.authInput}
                                                    {...registerRegister("username")}
                                                />
                                            </div>
                                            {registerErrors.username && (
                                                <div className={styles.errorMessage}>{registerErrors.username.message}</div>
                                            )}
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <label htmlFor="phone" className={styles.inputLabel}>
                                                Номер телефона
                                            </label>
                                            <div className={styles.inputWrapper}>
                                                <Mail className={styles.inputIcon} />
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="+..."
                                                    className={styles.authInput}
                                                    {...registerRegister("phone")} // Исправлено на registerRegister
                                                />
                                            </div>
                                            {registerErrors.phone && (
                                                <div className={styles.errorMessage}>{registerErrors.phone.message}</div>
                                            )}
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <label htmlFor="password" className={styles.inputLabel}>
                                                Пароль
                                            </label>
                                            <div className={styles.inputWrapper}>
                                                <Lock className={styles.inputIcon} />
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Создайте пароль"
                                                    className={`${styles.authInput} ${styles.passwordInput}`}
                                                    {...registerRegister("password")}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className={styles.passwordToggle}
                                                >
                                                    {showPassword ? <EyeOff className={styles.eyeIcon} /> : <Eye className={styles.eyeIcon} />}
                                                </button>
                                            </div>
                                            {registerErrors.password && (
                                                <div className={styles.errorMessage}>{registerErrors.password.message}</div>
                                            )}
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <label htmlFor="confirmPassword" className={styles.inputLabel}>
                                                Подтвердите пароль
                                            </label>
                                            <div className={styles.inputWrapper}>
                                                <Lock className={styles.inputIcon} />
                                                <input
                                                    id="confirmPassword"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Повторите пароль"
                                                    className={styles.authInput}
                                                    {...registerRegister("confirmPassword")}
                                                />
                                            </div>
                                            {registerErrors.confirmPassword && (
                                                <div className={styles.errorMessage}>{registerErrors.confirmPassword.message}</div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            className={styles.submitButton}
                                            disabled={isRegisterSubmitting}
                                        >
                                            {isRegisterSubmitting ? 'Регистрация...' : 'Создать аккаунт'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;