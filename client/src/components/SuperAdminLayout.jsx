import React from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';
import Navbar from './NavBar';

const SuperAdminLayout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ display: 'flex', flex: 1 }}>
                <SuperAdminSidebar />
                <main style={{ flex: 1, padding: '20px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;
