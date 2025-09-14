import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import styled from 'styled-components';

const MainContent = styled.div<{ $sidebarOpen: boolean }>`
  margin-right: 0;
  transition: margin-right 0.3s ease;
  min-height: 100vh;

  @media (min-width: 769px) {
    margin-right: ${props => props.$sidebarOpen ? '280px' : '0'};
  }
`;

const PageContent = styled.main`
  padding: 24px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <MainContent $sidebarOpen={sidebarOpen}>
        <Header onMenuClick={toggleSidebar} />
        <PageContent>
          <Outlet />
        </PageContent>
      </MainContent>
    </>
  );
};

export default Layout;
