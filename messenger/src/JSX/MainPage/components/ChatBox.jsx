import React, {useState, useEffect} from 'react';
import cl from '../styles/ChatBox.module.css'

const ChatBox = (props) => {
    const [avatarText, setAvatarText] = useState('');
    const [avatarColor, setAvatarColor] = useState('#4B0082');

    useEffect(() => {
        // Получаем первые буквы названия чата
        const initials = props.name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .slice(0, 2) // Берем только первые две буквы
            .toUpperCase();
        setAvatarText(initials);

        // Генерируем цвет на основе текущей даты
        const today = new Date();
        const hash = today.toDateString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const dynamicColor = `hsl(${hash % 360}, 70%, 40%)`; // Генерация цвета по HSV
        setAvatarColor(dynamicColor);
    }, [props]);

    return (
        <div className={cl.container}>
            <div className={cl.chatbox} style={{ backgroundColor: avatarColor }}>
                <span className={cl.avatar_text}>{avatarText}</span>
            </div>
            <div className={cl.chat_text}>
                <p className={cl.p_chatname}>{props.name}</p>
                <p className={cl.p_lastmes}>{props.lastMessage}</p>  
            </div>
            <div className={cl.right_box}>
                <p className={cl.p_date}>{props.time}</p>
                <span className={cl.unread_badge}>{props.unread}</span>
            </div>
        </div>
    );
}

export default ChatBox;