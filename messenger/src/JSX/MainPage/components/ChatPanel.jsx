import React from 'react';
import cl from '../styles/ChatPanel.module.css'
import baseavatar from '../../../assets/images/baseavatar.jpg'

const ChatPanel = () => {
    return (
        <div className={cl.container}>
            <div className={cl.profilebox}>
                <img className={cl.imgbox} src={baseavatar} alt="Profile_Image"/>
                <div>
                    <p className={cl.p_username}>Гжегош Бженчишчи</p>
                    <p className={cl.p_status}>В сети</p>
                </div>
            </div>
        </div>
    );
}

export default ChatPanel;