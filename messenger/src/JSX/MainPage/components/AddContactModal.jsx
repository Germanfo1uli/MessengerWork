import React, { useState } from 'react';
import styles from '../styles/AddContactModal.module.css';

const AddContactModal = ({ isOpen, onClose, onAddContact }) => {
    const [activeTab, setActiveTab] = useState('username');
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const contactData = activeTab === 'username'
            ? { username: formData.username, message: formData.message }
            : { phone: formData.phone, message: formData.message };

        onAddContact(contactData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#e0e0ff">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>

                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Добавить новый контакт</h2>
                    <p className={styles.modalDescription}>
                        Найдите пользователя по никнейму или номеру телефона
                    </p>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'username' ? styles.active : ''}`}
                            onClick={() => setActiveTab('username')}
                        >
                            По никнейму
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'phone' ? styles.active : ''}`}
                            onClick={() => setActiveTab('phone')}
                        >
                            По номеру телефона
                        </button>
                    </div>
                </div>

                <div className={styles.modalContent}>
                    <form onSubmit={handleSubmit} className={styles.contactForm}>
                        {activeTab === 'username' ? (
                            <div className={styles.formGroup}>
                                <label htmlFor="username">Никнейм пользователя</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Введите никнейм (например, @commander)"
                                    required
                                />
                            </div>
                        ) : (
                            <div className={styles.formGroup}>
                                <label htmlFor="phone">Номер телефона</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+7 (XXX) XXX-XX-XX"
                                    required
                                />
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="message">Приветственное сообщение (необязательно)</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Напишите приветственное сообщение..."
                                rows="3"
                            />
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Добавить контакт
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddContactModal;