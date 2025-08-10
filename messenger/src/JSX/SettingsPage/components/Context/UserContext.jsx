import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

const initialUser = {
    username: 'Командир Ковальски',
    tag: 'Капитан 1-го ранга',
    email: 'commander@starfleet.com',
    phone: '+7 (999) 123-45-67',
    status: 'Опытный командир с 15-летним стажем. Специализация: дальние космические миссии.',
    avatarUrl: null,
    banner: { type: 'color', value: '#1a2a4d' },
    gifts: [
        { id: 1, image: 'https://cdn1.ozone.ru/s3/multimedia-1-h/7548608069.jpg', name: 'Золотой лабубу', selected: true },
        { id: 2, image: 'https://avatars.mds.yandex.net/get-mpic/13527901/2a000001971b61fbaf300b399920a6a840f3/orig', name: 'Никита', selected: false },
        { id: 3, image: 'https://avatars.mds.yandex.net/i?id=3eaffa6d84e0523f6ed1786307f4e0a4_l-5295169-images-thumbs&n=13', name: 'Лабуба', selected: true },
        { id: 4, image: 'https://i.imgur.com/JQ9qX1z.png', name: 'Космический шлем', selected: false },
        { id: 5, image: 'https://i.imgur.com/8Km9tLL.png', name: 'Звездный меч', selected: true },
        { id: 6, image: 'https://i.imgur.com/3Zq3Z8L.png', name: 'Галактический щит', selected: false },
    ],
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('userProfile');
        return savedUser ? JSON.parse(savedUser) : initialUser;
    });

    useEffect(() => {
        localStorage.setItem('userProfile', JSON.stringify(user));
    }, [user]);

    const updateUser = (updates) => {
        setUser((prev) => ({ ...prev, ...updates }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);