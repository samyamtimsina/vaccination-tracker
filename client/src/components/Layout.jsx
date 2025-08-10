import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNav from './SideBar';
import Navbar from './NavBar';
const Layout = () => {
  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <SidebarNav />
        <main style={{ flex: 1, padding: '20px' }}>
          <Outlet />{' '}
        </main>
      </div>
    </div>
  );
};

export default Layout;
