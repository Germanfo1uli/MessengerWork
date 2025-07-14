import React from 'react';
import cl from '../styles/ChatPanel.module.css'
import baseavatar from '../../../assets/images/baseavatar.jpg'
import ChatBox from './ChatBox'
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { IoSearchOutline } from 'react-icons/io5';
import { IoStarOutline } from 'react-icons/io5';
import { FaEnvelope } from 'react-icons/fa';

const ChatPanel = () => {

    const data = [
        {
            name: "Сука",
            unread: 5,
            lastMessage: "Я что похож на гея, помогите никите он сын бляди",
            time: "0:28"
        },
        {
            name: "Пидарасы",
            unread: 2,
            lastMessage: "Помогите :(((",
            time: "0:28"
        }
    ]

    return (
        <div className={cl.container}>
            <div className={cl.profilebox}>
                <img className={cl.imgbox} src={baseavatar} alt="Profile_Image"/>
                <div>
                    <p className={cl.p_username}>Гжегош</p>
                    <p className={cl.p_status}>В сети</p>
                </div>
                <div className={cl.prof_buttons_box}>
                    <div className={cl.svg_icon}>
                        <IoSettingsOutline />
                    </div>
                    <div className={cl.svg_icon}>
                        <IoIosMore />
                    </div>
                </div>
            </div>
            <div className={cl.buttons}>
                <div className={cl.search_box}>
                    <div className={cl.search_container}>
                        <IoSearchOutline className={cl.svg_search} />
                            <input
                                type="text"
                                className={cl.search_input}
                                placeholder="Поиск в галактике..."
                            />
                    </div>
                </div>
                <div className={cl.flexrow}>
                    <div className={cl.button_box}>
                        <IoStarOutline className={cl.svg_icon}/>
                        <p className={cl.p_status}>&nbsp;Избранное</p>
                    </div>
                    <div className={cl.button_box}>
                        <FaEnvelope className={cl.svg_icon}/>
                        <p className={cl.p_status}>&nbsp;Чаты</p>
                    </div>
                </div>
            </div>
            <div className={cl.chats_container}>
            {data.map((chat, index) => (
                <ChatBox 
                    key={index}
                    name={chat.name}
                    unread={chat.unread}
                    lastMessage={chat.lastMessage?.slice(0, 25) + (chat.lastMessage?.length > 25 ? "..." : "")}
                    time={chat.time}
                />
            ))}
            </div>
        </div>
    );
}

export default ChatPanel;