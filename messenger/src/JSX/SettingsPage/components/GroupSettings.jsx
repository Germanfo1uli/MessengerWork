import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiUsers, FiImage, FiSearch, FiX, FiCheck, FiLock, FiTrash2, FiPlus, FiEdit } from 'react-icons/fi';
import Sidebar from './Sidebar';
import styles from '../styles/GroupSettings.module.css';

const GroupSettings = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [groups, setGroups] = useState([
        {
            id: 1,
            name: 'Командование Звёздного Флота',
            description: 'Элитная команда космических исследований',
            avatar: 'https://i.imgur.com/JQ9qX1z.png',
            members: [
                { name: 'Командир Ковальски', role: 'Админ' },
                { name: 'Лейтенант Рипли', role: 'Член' },
                { name: 'Капитан Кирк', role: 'Член' },
            ],
            roles: [
                { name: 'Админ', permissions: { manageMembers: true, editSettings: true, postContent: true } },
                { name: 'Член', permissions: { manageMembers: false, editSettings: false, postContent: true } },
                { name: 'Картограф', permissions: { manageMembers: false, editSettings: false, postContent: true } },
            ],
            settings: { visibility: 'public', joinPolicy: 'open' },
        },
        {
            id: 2,
            name: 'Галактические Пионеры',
            description: 'Исследование новых горизонтов',
            avatar: 'https://i.imgur.com/8Km9tLL.png',
            members: [
                { name: 'Капитан Джейнвей', role: 'Админ' },
                { name: 'Офицер Спок', role: 'Член' },
            ],
            roles: [
                { name: 'Админ', permissions: { manageMembers: true, editSettings: true, postContent: true } },
                { name: 'Член', permissions: { manageMembers: false, editSettings: false, postContent: true } },
                { name: 'Исследователь', permissions: { manageMembers: false, editSettings: false, postContent: true } },
            ],
            settings: { visibility: 'private', joinPolicy: 'invite' },
        },
        {
            id: 3,
            name: 'Космические Навигаторы',
            description: 'Прокладка звёздных маршрутов',
            avatar: 'https://i.imgur.com/3Zq3Z8L.png',
            members: [
                { name: 'Навигатор Чехов', role: 'Админ' },
                { name: 'Пилот Сулу', role: 'Член' },
            ],
            roles: [
                { name: 'Админ', permissions: { manageMembers: true, editSettings: true, postContent: true } },
                { name: 'Член', permissions: { manageMembers: false, editSettings: false, postContent: true } },
                { name: 'Пилот', permissions: { manageMembers: false, editSettings: false, postContent: true } },
            ],
            settings: { visibility: 'public', joinPolicy: 'approval' },
        },
    ]);

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [newMemberName, setNewMemberName] = useState('');
    const [newRoleName, setNewRoleName] = useState('');
    const [editRole, setEditRole] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [captchaCode, setCaptchaCode] = useState('');
    const [userCaptchaInput, setUserCaptchaInput] = useState('');

    useEffect(() => {
        if (selectedGroup) {
            setValue('groupName', selectedGroup.name);
            setValue('groupDescription', selectedGroup.description);
            setValue('visibility', selectedGroup.settings.visibility);
            setValue('joinPolicy', selectedGroup.settings.joinPolicy);
        }
    }, [selectedGroup, setValue]);

    const generateCaptcha = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCaptchaCode(code);
        return code;
    };

    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
        setNewMemberName('');
        setNewRoleName('');
        setEditRole(null);
        setShowDeleteModal(false);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGroups(groups.map(g =>
                    g.id === selectedGroup.id ? { ...g, avatar: reader.result } : g
                ));
            };
            reader.readAsDataURL(file);
        }
    };

    const addMember = () => {
        if (!selectedGroup || !newMemberName.trim() || selectedGroup.members.some(m => m.name === newMemberName.trim())) {
            return;
        }
        setGroups(groups.map(g =>
            g.id === selectedGroup.id ? {
                ...g,
                members: [...g.members, { name: newMemberName.trim(), role: 'Член' }],
            } : g
        ));
        setNewMemberName('');
    };

    const removeMember = (memberName) => {
        if (selectedGroup) {
            setGroups(groups.map(g =>
                g.id === selectedGroup.id ? {
                    ...g,
                    members: g.members.filter(m => m.name !== memberName),
                } : g
            ));
        }
    };

    const updateMemberRole = (memberName, newRole) => {
        if (selectedGroup) {
            setGroups(groups.map(g =>
                g.id === selectedGroup.id ? {
                    ...g,
                    members: g.members.map(m =>
                        m.name === memberName ? { ...m, role: newRole } : m
                    ),
                } : g
            ));
        }
    };

    const addRole = () => {
        if (!selectedGroup || !newRoleName.trim() || selectedGroup.roles.some(r => r.name === newRoleName.trim())) {
            return;
        }
        setGroups(groups.map(g =>
            g.id === selectedGroup.id ? {
                ...g,
                roles: [...g.roles, { name: newRoleName.trim(), permissions: { manageMembers: false, editSettings: false, postContent: true } }],
            } : g
        ));
        setNewRoleName('');
    };

    const deleteRole = (roleName) => {
        if (selectedGroup && window.confirm(`Вы уверены, что хотите удалить роль "${roleName}"?`)) {
            setGroups(groups.map(g =>
                g.id === selectedGroup.id ? {
                    ...g,
                    roles: g.roles.filter(r => r.name !== roleName),
                    members: g.members.map(m =>
                        m.role === roleName ? { ...m, role: 'Член' } : m
                    ),
                } : g
            ));
        }
    };

    const editRoleSubmit = (roleName, permissions) => {
        if (editRole.name === 'Админ') {
            permissions.manageMembers = true;
            permissions.editSettings = true;
        }
        setGroups(groups.map(g =>
            g.id === selectedGroup.id ? {
                ...g,
                roles: g.roles.map(r =>
                    r.name === editRole.name ? { ...r, name: roleName, permissions } : r
                ),
                members: g.members.map(m =>
                    m.role === editRole.name ? { ...m, role: roleName } : m
                ),
            } : g
        ));
        setEditRole(null);
    };

    const initiateGroupDeletion = () => {
        if (selectedGroup) {
            setShowDeleteModal(true);
            generateCaptcha();
            setUserCaptchaInput('');
        }
    };

    const confirmGroupDeletion = () => {
        if (userCaptchaInput === captchaCode) {
            setGroups(groups.filter(g => g.id !== selectedGroup.id));
            setSelectedGroup(null);
            setShowDeleteModal(false);
        } else {
            alert('Неверный код CAPTCHA. Пожалуйста, попробуйте снова.');
        }
    };

    const onSubmit = (data) => {
        setGroups(groups.map(g =>
            g.id === selectedGroup.id ? {
                ...g,
                name: data.groupName,
                description: data.groupDescription,
                settings: {
                    visibility: data.visibility,
                    joinPolicy: data.joinPolicy,
                },
            } : g
        ));
        console.log('Настройки группы обновлены:', data);
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    <header className={styles.pageHeader}>
                        <h1>Управление группами</h1>
                        <p>Настройте свои космические сообщества с высокой точностью</p>
                    </header>

                    <div className={styles.groupsContainer}>
                        <div className={styles.groupsSidebar}>
                            <div className={styles.searchBar}>
                                <FiSearch className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Поиск групп..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={styles.searchInput}
                                />
                                {searchQuery && (
                                    <button
                                        className={styles.clearSearch}
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <FiX />
                                    </button>
                                )}
                            </div>
                            <div className={styles.groupsList}>
                                {filteredGroups.map(group => (
                                    <div
                                        key={group.id}
                                        className={`${styles.groupCard} ${selectedGroup?.id === group.id ? styles.selectedGroup : ''}`}
                                        onClick={() => handleGroupSelect(group)}
                                    >
                                        <img src={group.avatar} alt={group.name} className={styles.groupAvatar} />
                                        <div className={styles.groupInfo}>
                                            <h3>{group.name}</h3>
                                            <p>{group.description}</p>
                                            <span className={styles.memberCount}>
                                                {group.members.length} {group.members.length === 1 ? 'участник' : 'участников'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {filteredGroups.length === 0 && (
                                    <p className={styles.noResults}>Группы не найдены</p>
                                )}
                            </div>
                        </div>

                        {selectedGroup && (
                            <div className={styles.groupSettings}>
                                <div className={styles.groupHeader}>
                                    <div className={styles.avatarContainer}>
                                        <img src={selectedGroup.avatar} alt={selectedGroup.name} className={styles.groupAvatarLarge} />
                                        <label className={styles.editAvatarBtn}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className={styles.fileInput}
                                            />
                                            <FiImage />
                                        </label>
                                    </div>
                                    <div>
                                        <h2>{selectedGroup.name}</h2>
                                        <p>{selectedGroup.description}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className={styles.formSection}>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Название группы</label>
                                            <input
                                                {...register('groupName', {
                                                    required: 'Название группы обязательно',
                                                    minLength: { value: 3, message: 'Название должно содержать не менее 3 символов' },
                                                })}
                                                className={styles.formInput}
                                            />
                                            {errors.groupName && <p className={styles.error}>{errors.groupName.message}</p>}
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Видимость</label>
                                            <select
                                                {...register('visibility')}
                                                className={styles.formInput}
                                            >
                                                <option value="public">Публичная</option>
                                                <option value="private">Приватная</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Описание группы</label>
                                        <textarea
                                            {...register('groupDescription', {
                                                maxLength: {
                                                    value: 200,
                                                    message: 'Описание не должно превышать 200 символов',
                                                },
                                            })}
                                            className={styles.formTextarea}
                                        ></textarea>
                                        {errors.groupDescription && <p className={styles.error}>{errors.groupDescription.message}</p>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Политика присоединения</label>
                                        <select
                                            {...register('joinPolicy')}
                                            className={styles.formInput}
                                        >
                                            <option value="open">Открытая</option>
                                            <option value="approval">Требуется одобрение</option>
                                            <option value="invite">Только по приглашению</option>
                                        </select>
                                    </div>

                                    <div className={styles.rolesSection}>
                                        <h3>Роли</h3>
                                        <div className={styles.addRole}>
                                            <input
                                                type="text"
                                                placeholder="Введите название роли"
                                                value={newRoleName}
                                                onChange={(e) => setNewRoleName(e.target.value)}
                                                className={styles.formInput}
                                                style={{ padding: '10px 16px' }}
                                            />
                                            <button
                                                type="button"
                                                className={styles.addButton}
                                                onClick={addRole}
                                                disabled={!newRoleName.trim() || selectedGroup.roles.some(r => r.name === newRoleName.trim())}
                                                style={{ padding: '10px 20px' }}
                                            >
                                                <FiPlus /> Добавить
                                            </button>
                                        </div>
                                        <div className={styles.rolesList}>
                                            {selectedGroup.roles.map(role => (
                                                <div key={role.name} className={styles.roleItem}>
                                                    <span>{role.name}</span>
                                                    <div className={styles.roleActions}>
                                                        <button
                                                            type="button"
                                                            className={styles.editRoleButton}
                                                            onClick={() => setEditRole(role)}
                                                        >
                                                            <FiEdit />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={styles.removeRoleButton}
                                                            onClick={() => deleteRole(role.name)}
                                                            disabled={role.name === 'Админ' || role.name === 'Член'}
                                                            title={role.name === 'Админ' || role.name === 'Член' ? 'Базовые роли нельзя удалить' : 'Удалить роль'}
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.membersSection}>
                                        <h3>Участники</h3>
                                        <div className={styles.addMember}>
                                            <input
                                                type="text"
                                                placeholder="Введите имя участника"
                                                value={newMemberName}
                                                onChange={(e) => setNewMemberName(e.target.value)}
                                                className={styles.formInput}
                                            />
                                            <button
                                                type="button"
                                                className={styles.addButton}
                                                onClick={addMember}
                                                disabled={!newMemberName.trim() || selectedGroup.members.some(m => m.name === newMemberName.trim())}
                                            >
                                                <FiUsers /> Добавить
                                            </button>
                                        </div>
                                        <div className={styles.membersList}>
                                            {selectedGroup.members.map(member => (
                                                <div key={member.name} className={styles.memberItem}>
                                                    <div className={styles.memberInfo}>
                                                        <span>{member.name}</span>
                                                        <span className={styles.memberRole}>
                                                            {member.role === 'Админ' ? <FiLock /> : null} {member.role}
                                                        </span>
                                                    </div>
                                                    <div className={styles.memberActions}>
                                                        <select
                                                            value={member.role}
                                                            onChange={(e) => updateMemberRole(member.name, e.target.value)}
                                                            className={styles.roleSelect}
                                                        >
                                                            {selectedGroup.roles.map(role => (
                                                                <option key={role.name} value={role.name}>{role.name}</option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            type="button"
                                                            className={styles.removeButton}
                                                            onClick={() => removeMember(member.name)}
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.actionButtons}>
                                        <button type="submit" className={styles.saveButton}>
                                            <FiCheck /> Сохранить
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.cancelButton}
                                            onClick={() => setSelectedGroup(null)}
                                        >
                                            <FiX /> Отменить
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.deleteGroupButton}
                                            onClick={initiateGroupDeletion}
                                        >
                                            <FiTrash2 /> Удалить группу
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {editRole && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Редактировать роль: {editRole.name}</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const newRoleName = formData.get('roleName');
                                const permissions = {
                                    manageMembers: formData.get('manageMembers') === 'on',
                                    editSettings: formData.get('editSettings') === 'on',
                                    postContent: formData.get('postContent') === 'on',
                                };
                                editRoleSubmit(newRoleName, permissions);
                            }}
                        >
                            <div className={styles.formGroup}>
                                <label>Название роли</label>
                                <input
                                    name="roleName"
                                    defaultValue={editRole.name}
                                    className={styles.formInput}
                                    placeholder="Введите новое название роли"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Разрешения</label>
                                <div className={styles.permissionToggle}>
                                    <input
                                        type="checkbox"
                                        name="manageMembers"
                                        defaultChecked={editRole.permissions.manageMembers}
                                        id="manageMembers"
                                        disabled={editRole.name === 'Админ'}
                                    />
                                    <label htmlFor="manageMembers">Управление участниками {editRole.name === 'Админ' && '(обязательно для Админа)'}</label>
                                </div>
                                <div className={styles.permissionToggle}>
                                    <input
                                        type="checkbox"
                                        name="editSettings"
                                        defaultChecked={editRole.permissions.editSettings}
                                        id="editSettings"
                                        disabled={editRole.name === 'Админ'}
                                    />
                                    <label htmlFor="editSettings">Редактирование настроек {editRole.name === 'Админ' && '(обязательно для Админа)'}</label>
                                </div>
                                <div className={styles.permissionToggle}>
                                    <input
                                        type="checkbox"
                                        name="postContent"
                                        defaultChecked={editRole.permissions.postContent}
                                        id="postContent"
                                    />
                                    <label htmlFor="postContent">Публикация контента</label>
                                </div>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.saveButton}>
                                    <FiCheck /> Сохранить
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => setEditRole(null)}
                                >
                                    <FiX /> Отменить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Удалить группу: {selectedGroup.name}?</h3>
                        <p>Вы уверены, что хотите удалить эту группу? Это действие нельзя отменить.</p>
                        <div className={styles.formGroup}>
                            <label>Введите код: <strong>{captchaCode}</strong></label>
                            <input
                                type="text"
                                value={userCaptchaInput}
                                onChange={(e) => setUserCaptchaInput(e.target.value)}
                                className={styles.formInput}
                                placeholder="Введите код CAPTCHA"
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.saveButton}
                                onClick={confirmGroupDeletion}
                                disabled={userCaptchaInput.length !== 4}
                            >
                                <FiCheck /> Подтвердить
                            </button>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                <FiX /> Отменить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupSettings;