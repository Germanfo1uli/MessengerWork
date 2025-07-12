import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from '../../CSS/WelcomePage/AuthScreen.module.css';
import { FcGoogle } from 'react-icons/fc';

const AuthScreen = ({ onBack }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('login');

    // Схема валидации для входа
    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Некорректный email')
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
        email: Yup.string()
            .email('Некорректный email')
            .required('Обязательное поле'),
        password: Yup.string()
            .min(6, 'Пароль должен содержать минимум 6 символов')
            .required('Обязательное поле'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
            .required('Обязательное поле')
    });

    const handleLogin = (values) => {
        console.log('Вход:', values);
        // Здесь будет логика входа
    };

    const handleRegister = (values) => {
        console.log('Регистрация:', values);
        // Здесь будет логика регистрации
    };

    const handleGoogleLogin = () => {
        console.log('Вход через Google');
        // Здесь будет логика входа через Google
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
                                    <Formik
                                        initialValues={{ email: '', password: '' }}
                                        validationSchema={loginSchema}
                                        onSubmit={handleLogin}
                                    >
                                        {({ isSubmitting }) => (
                                            <Form className={styles.authForm}>
                                                <div className={styles.inputGroup}>
                                                    <label htmlFor="email" className={styles.inputLabel}>
                                                        Email
                                                    </label>
                                                    <div className={styles.inputWrapper}>
                                                        <Mail className={styles.inputIcon} />
                                                        <Field
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            placeholder="ваш@email.com"
                                                            className={styles.authInput}
                                                        />
                                                    </div>
                                                    <ErrorMessage name="email" component="div" className={styles.errorMessage} />
                                                </div>

                                                <div className={styles.inputGroup}>
                                                    <label htmlFor="password" className={styles.inputLabel}>
                                                        Пароль
                                                    </label>
                                                    <div className={styles.inputWrapper}>
                                                        <Lock className={styles.inputIcon} />
                                                        <Field
                                                            id="password"
                                                            name="password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="Введите пароль"
                                                            className={`${styles.authInput} ${styles.passwordInput}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className={styles.passwordToggle}
                                                        >
                                                            {showPassword ? <EyeOff className={styles.eyeIcon} /> : <Eye className={styles.eyeIcon} />}
                                                        </button>
                                                    </div>
                                                    <ErrorMessage name="password" component="div" className={styles.errorMessage} />
                                                </div>

                                                <button
                                                    type="submit"
                                                    className={styles.submitButton}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Вход...' : 'Войти'}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>

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
                                    <Formik
                                        initialValues={{
                                            username: '',
                                            email: '',
                                            password: '',
                                            confirmPassword: ''
                                        }}
                                        validationSchema={registerSchema}
                                        onSubmit={handleRegister}
                                    >
                                        {({ isSubmitting }) => (
                                            <Form className={styles.authForm}>
                                                <div className={styles.inputGroup}>
                                                    <label htmlFor="username" className={styles.inputLabel}>
                                                        Имя пользователя
                                                    </label>
                                                    <div className={styles.inputWrapper}>
                                                        <User className={styles.inputIcon} />
                                                        <Field
                                                            id="username"
                                                            name="username"
                                                            type="text"
                                                            placeholder="Ваше имя"
                                                            className={styles.authInput}
                                                        />
                                                    </div>
                                                    <ErrorMessage name="username" component="div" className={styles.errorMessage} />
                                                </div>

                                                <div className={styles.inputGroup}>
                                                    <label htmlFor="email" className={styles.inputLabel}>
                                                        Email
                                                    </label>
                                                    <div className={styles.inputWrapper}>
                                                        <Mail className={styles.inputIcon} />
                                                        <Field
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            placeholder="ваш@email.com"
                                                            className={styles.authInput}
                                                        />
                                                    </div>
                                                    <ErrorMessage name="email" component="div" className={styles.errorMessage} />
                                                </div>

                                                <div className={styles.inputGroup}>
                                                    <label htmlFor="password" className={styles.inputLabel}>
                                                        Пароль
                                                    </label>
                                                    <div className={styles.inputWrapper}>
                                                        <Lock className={styles.inputIcon} />
                                                        <Field
                                                            id="password"
                                                            name="password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="Создайте пароль"
                                                            className={`${styles.authInput} ${styles.passwordInput}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className={styles.passwordToggle}
                                                        >
                                                            {showPassword ? <EyeOff className={styles.eyeIcon} /> : <Eye className={styles.eyeIcon} />}
                                                        </button>
                                                    </div>
                                                    <ErrorMessage name="password" component="div" className={styles.errorMessage} />
                                                </div>

                                                <div className={styles.inputGroup}>
                                                    <label htmlFor="confirmPassword" className={styles.inputLabel}>
                                                        Подтвердите пароль
                                                    </label>
                                                    <div className={styles.inputWrapper}>
                                                        <Lock className={styles.inputIcon} />
                                                        <Field
                                                            id="confirmPassword"
                                                            name="confirmPassword"
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="Повторите пароль"
                                                            className={styles.authInput}
                                                        />
                                                    </div>
                                                    <ErrorMessage name="confirmPassword" component="div" className={styles.errorMessage} />
                                                </div>

                                                <button
                                                    type="submit"
                                                    className={styles.submitButton}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Регистрация...' : 'Создать аккаунт'}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>
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