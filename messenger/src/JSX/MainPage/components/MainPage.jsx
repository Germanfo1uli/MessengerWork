import React from 'react';
import GroupNavigation from './GroupNavigation';

const MainPage = () => {
    return (
        <div style={{ display: 'flex' }}>
            <GroupNavigation />
            <main style={{ marginLeft: '60px', padding: '20px', flexGrow: 1 }}>
                <h1>Welcome to Main Page</h1>
                <p>This is the main content area.</p>
            </main>
        </div>
    );
};

export default MainPage;