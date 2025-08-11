import React from 'react';
import cl from '../styles/ContactsModal.module.css';
import { useTheme } from '../../SettingsPage/components/Context/ThemeContext';
import { FaAddressBook } from 'react-icons/fa';

const ContactsModal = ({ isOpen, onClose, onContactClick, onAddContactClick }) => {
    const { themeSettings } = useTheme();
    const { theme } = themeSettings;

    // Test contact
    const testContact = {
        id: 'test-contact-1',
        userId: 'test-user-1',
        username: 'Тестовый контакт',
        phone: '+1234567890',
        onlineStatus: 1,
    };

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
                    contactHoverBg: 'rgba(138, 43, 226, 0.2)',
                };
            case 'sunset':
                return {
                    modalBg: 'rgba(254, 180, 123, 0.98)',
                    textColor: '#5a2c0a',
                    secondaryText: '#7a4c2a',
                    borderColor: 'rgba(255, 126, 95, 0.5)',
                    buttonHover: '#feb47b',
                    shadow: '0 4px 20px rgba(255, 126, 95, 0.25)',
                    contactHoverBg: 'rgba(255, 126, 95, 0.2)',
                };
            case 'ocean':
                return {
                    modalBg: 'rgba(0, 93, 234, 0.98)',
                    textColor: '#e0f7ff',
                    secondaryText: '#b0e7ff',
                    borderColor: 'rgba(0, 198, 251, 0.5)',
                    buttonHover: '#005bea',
                    shadow: '0 4px 20px rgba(0, 198, 251, 0.25)',
                    contactHoverBg: 'rgba(0, 198, 251, 0.2)',
                };
            case 'forest':
                return {
                    modalBg: 'rgba(17, 153, 142, 0.98)',
                    textColor: '#e0fff5',
                    secondaryText: '#b0ffea',
                    borderColor: 'rgba(56, 239, 125, 0.5)',
                    buttonHover: '#38ef7d',
                    shadow: '0 4px 20px rgba(56, 239, 125, 0.25)',
                    contactHoverBg: 'rgba(56, 239, 125, 0.2)',
                };
            case 'light':
                return {
                    modalBg: 'rgba(240, 240, 240, 0.98)',
                    textColor: '#333333',
                    secondaryText: '#666666',
                    borderColor: 'rgba(160, 160, 160, 0.5)',
                    buttonHover: '#6ba3ff',
                    shadow: '0 4px 20px rgba(160, 160, 160, 0.15)',
                    contactHoverBg: 'rgba(75, 131, 248, 0.2)',
                };
            default:
                return {
                    modalBg: 'rgba(30, 30, 70, 0.98)',
                    textColor: '#e0e0ff',
                    secondaryText: '#b0b0ff',
                    borderColor: 'rgba(138, 43, 226, 0.5)',
                    buttonHover: '#9b51e0',
                    shadow: '0 4px 20px rgba(138, 43, 226, 0.25)',
                    contactHoverBg: 'rgba(138, 43, 226, 0.2)',
                };
        }
    };

    const modalStyles = getModalStyles();

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
                <h2 style={{ color: modalStyles.textColor }}>Контакты</h2>
                <div className={cl.contactList}>
                    <div
                        className={cl.contactItem}
                        onClick={() => onContactClick({
                            id: testContact.id,
                            secondUserId: testContact.userId,
                            type: 'Contact',
                            secondUser: {
                                username: testContact.username,
                                onlineStatus: testContact.onlineStatus,
                                contactTag: null,
                            },
                            isFavorite: false,
                            createdAt: new Date().toISOString(),
                            lastMessage: null,
                            joined: false,
                        })}
                        style={{
                            cursor: 'pointer',
                            padding: '10px',
                            borderBottom: `1px solid ${modalStyles.borderColor}`,
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = modalStyles.contactHoverBg)}
                        onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                        <span style={{ color: modalStyles.textColor }}>{testContact.username}</span>
                        <span style={{ color: modalStyles.secondaryText, fontSize: '0.8rem', marginLeft: '10px' }}>
                            {testContact.phone}
                        </span>
                    </div>
                </div>
                <button
                    className={cl.addContactButton}
                    onClick={onAddContactClick}
                    style={{
                        background: 'transparent',
                        color: modalStyles.textColor,
                        border: `1px solid ${modalStyles.borderColor}`,
                        padding: '8px 16px',
                        borderRadius: '4px',
                        marginTop: '15px',
                        cursor: 'pointer',
                    }}
                    onMouseOver={(e) => (e.target.style.background = modalStyles.buttonHover)}
                    onMouseOut={(e) => (e.target.style.background = 'transparent')}
                >
                    <FaAddressBook style={{ marginRight: '5px' }} />
                    Добавить новый контакт
                </button>
                <button
                    className={cl.closeButton}
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        color: modalStyles.textColor,
                        border: `1px solid ${modalStyles.borderColor}`,
                        padding: '8px 16px',
                        borderRadius: '4px',
                        marginTop: '10px',
                        cursor: 'pointer',
                    }}
                    onMouseOver={(e) => (e.target.style.background = modalStyles.buttonHover)}
                    onMouseOut={(e) => (e.target.style.background = 'transparent')}
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default ContactsModal;