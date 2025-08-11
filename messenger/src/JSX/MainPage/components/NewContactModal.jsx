import React, { useState } from 'react';
import cl from '../styles/NewContactModal.module.css';
import { useTheme } from '../../SettingsPage/components/Context/ThemeContext';
import { FaAddressBook, FaTimes } from 'react-icons/fa';

const NewContactModal = ({ isOpen, onClose, onAddContact }) => {
    const { themeSettings } = useTheme();
    const { theme } = themeSettings;
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
    });
    const [errors, setErrors] = useState({});

    const getModalStyles = () => {
        switch (theme) {
            case 'cosmic':
                return {
                    modalBg: 'rgba(30, 30, 70, 0.98)',
                    textColor: '#e0e0ff',
                    secondaryText: '#b0b0ff',
                    borderColor: 'rgba(138, 43, 226, 0.5)',
                    buttonHover: '#9b51e0',
                    shadow: '0 4px 20px rgba(138, 43, 226, 0.25)',
                    inputBg: 'rgba(40, 40, 80, 0.7)',
                    inputBorder: 'rgba(138, 43, 226, 0.5)',
                };
            case 'sunset':
                return {
                    modalBg: 'rgba(254, 180, 123, 0.98)',
                    textColor: '#5a2c0a',
                    secondaryText: '#7a4c2a',
                    borderColor: 'rgba(255, 126, 95, 0.5)',
                    buttonHover: '#feb47b',
                    shadow: '0 4px 20px rgba(255, 126, 95, 0.25)',
                    inputBg: 'rgba(255, 255, 255, 0.3)',
                    inputBorder: 'rgba(255, 126, 95, 0.5)',
                };
            case 'ocean':
                return {
                    modalBg: 'rgba(0, 93, 234, 0.98)',
                    textColor: '#e0f7ff',
                    secondaryText: '#b0e7ff',
                    borderColor: 'rgba(0, 198, 251, 0.5)',
                    buttonHover: '#005bea',
                    shadow: '0 4px 20px rgba(0, 198, 251, 0.25)',
                    inputBg: 'rgba(255, 255, 255, 0.3)',
                    inputBorder: 'rgba(0, 198, 251, 0.5)',
                };
            case 'forest':
                return {
                    modalBg: 'rgba(17, 153, 142, 0.98)',
                    textColor: '#e0fff5',
                    secondaryText: '#b0ffea',
                    borderColor: 'rgba(56, 239, 125, 0.5)',
                    buttonHover: '#38ef7d',
                    shadow: '0 4px 20px rgba(56, 239, 125, 0.25)',
                    inputBg: 'rgba(17, 153, 142, 0.3)',
                    inputBorder: 'rgba(56, 239, 125, 0.5)',
                };
            case 'light':
                return {
                    modalBg: 'rgba(240, 240, 240, 0.98)',
                    textColor: '#333333',
                    secondaryText: '#666666',
                    borderColor: 'rgba(160, 160, 160, 0.5)',
                    buttonHover: '#6ba3ff',
                    shadow: '0 4px 20px rgba(160, 160, 160, 0.15)',
                    inputBg: 'rgba(255, 255, 255, 0.95)',
                    inputBorder: 'rgba(160, 160, 160, 0.5)',
                };
            default:
                return {
                    modalBg: 'rgba(30, 30, 70, 0.98)',
                    textColor: '#e0e0ff',
                    secondaryText: '#b0b0ff',
                    borderColor: 'rgba(138, 43, 226, 0.5)',
                    buttonHover: '#9b51e0',
                    shadow: '0 4px 20px rgba(138, 43, 226, 0.25)',
                    inputBg: 'rgba(40, 40, 80, 0.7)',
                    inputBorder: 'rgba(138, 43, 226, 0.5)',
                };
        }
    };

    const modalStyles = getModalStyles();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Имя обязательно';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Номер телефона обязателен';
        } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
            newErrors.phone = 'Недействительный номер телефона';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onAddContact(formData);
        setFormData({ username: '', phone: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={cl.modalOverlay}>
            <div
                className={cl.modalContent}
                style={{
                    background: modalStyles.modalBg,
                    border: `1px solid ${modalStyles.borderColor}`,
                    boxShadow: modalStyles.shadow,
                }}
            >
                <h2 style={{ color: modalStyles.textColor }}>Добавить новый контакт</h2>
                <form onSubmit={handleSubmit}>
                    <div className={cl.formGroup}>
                        <label style={{ color: modalStyles.textColor }}>Имя:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Введите имя"
                            style={{
                                background: modalStyles.inputBg,
                                border: `1px solid ${modalStyles.inputBorder}`,
                                color: modalStyles.textColor,
                                padding: '8px',
                                borderRadius: '4px',
                                width: '100%',
                            }}
                        />
                        {errors.username && (
                            <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.username}</span>
                        )}
                    </div>
                    <div className={cl.formGroup}>
                        <label style={{ color: modalStyles.textColor }}>Телефон:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Введите номер телефона"
                            style={{
                                background: modalStyles.inputBg,
                                border: `1px solid ${modalStyles.inputBorder}`,
                                color: modalStyles.textColor,
                                padding: '8px',
                                borderRadius: '4px',
                                width: '100%',
                            }}
                        />
                        {errors.phone && (
                            <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.phone}</span>
                        )}
                    </div>
                    <div className={cl.buttonContainer}>
                        <button
                            type="submit"
                            className={cl.closeButton}
                            style={{
                                background: 'transparent',
                                color: modalStyles.textColor,
                                border: `1px solid ${modalStyles.borderColor}`,
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                            onMouseOver={(e) => (e.target.style.background = modalStyles.buttonHover)}
                            onMouseOut={(e) => (e.target.style.background = 'transparent')}
                        >
                            <FaAddressBook style={{ marginRight: '5px' }} />
                            Добавить контакт
                        </button>
                        <button
                            className={cl.closeButton}
                            onClick={onClose}
                            style={{
                                background: 'transparent',
                                color: modalStyles.textColor,
                                border: `1px solid ${modalStyles.borderColor}`,
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                            onMouseOver={(e) => (e.target.style.background = modalStyles.buttonHover)}
                            onMouseOut={(e) => (e.target.style.background = 'transparent')}
                        >
                            <FaTimes style={{ marginRight: '5px' }} />
                            Закрыть
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewContactModal;