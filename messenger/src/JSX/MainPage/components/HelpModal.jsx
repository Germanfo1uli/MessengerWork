import React from 'react';
import cl from '../styles/HelpModal.module.css';
import { useTheme } from '../../SettingsPage/components/Context/ThemeContext';

const HelpModal = ({ isOpen, onClose }) => {
    const { themeSettings } = useTheme();
    const { theme } = themeSettings;

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
                };
            case 'sunset':
                return {
                    modalBg: 'rgba(254, 180, 123, 0.98)',
                    textColor: '#5a2c0a',
                    secondaryText: '#7a4c2a',
                    borderColor: 'rgba(255, 126, 95, 0.5)',
                    buttonHover: '#feb47b',
                    shadow: '0 4px 20px rgba(255, 126, 95, 0.25)',
                };
            case 'ocean':
                return {
                    modalBg: 'rgba(0, 93, 234, 0.98)',
                    textColor: '#e0f7ff',
                    secondaryText: '#b0e7ff',
                    borderColor: 'rgba(0, 198, 251, 0.5)',
                    buttonHover: '#005bea',
                    shadow: '0 4px 20px rgba(0, 198, 251, 0.25)',
                };
            case 'forest':
                return {
                    modalBg: 'rgba(17, 153, 142, 0.98)',
                    textColor: '#e0fff5',
                    secondaryText: '#b0ffea',
                    borderColor: 'rgba(56, 239, 125, 0.5)',
                    buttonHover: '#38ef7d',
                    shadow: '0 4px 20px rgba(56, 239, 125, 0.25)',
                };
            case 'light':
                return {
                    modalBg: 'rgba(240, 240, 240, 0.98)',
                    textColor: '#333333',
                    secondaryText: '#666666',
                    borderColor: 'rgba(160, 160, 160, 0.5)',
                    buttonHover: '#6ba3ff',
                    shadow: '0 4px 20px rgba(160, 160, 160, 0.15)',
                };
            default:
                return {
                    modalBg: 'rgba(30, 30, 70, 0.98)',
                    textColor: '#e0e0ff',
                    secondaryText: '#b0b0ff',
                    borderColor: 'rgba(138, 43, 226, 0.5)',
                    buttonHover: '#9b51e0',
                    shadow: '0 4px 20px rgba(138, 43, 226, 0.25)',
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
                <h2 style={{ color: modalStyles.textColor }}>Помощь и поддержка</h2>
                <p style={{ color: modalStyles.secondaryText }}>
                    По всем вопросам и проблемам, пожалуйста, обращайтесь в нашу службу поддержки:
                </p>
                <ul style={{ color: modalStyles.textColor, listStyleType: 'none', padding: 0 }}>
                    <li>@Герман</li>
                    <li>@Евгений</li>
                    <li>@Никита</li>

                </ul>
                <button
                    className={cl.closeButton}
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        color: modalStyles.textColor,
                        border: `1px solid ${modalStyles.borderColor}`,
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

export default HelpModal;