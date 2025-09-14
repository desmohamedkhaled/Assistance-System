import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import Layout from '@/components/Layout/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Beneficiaries from '@/pages/Beneficiaries';
import Assistances from '@/pages/Assistances';
import AidFiles from '@/pages/AidFiles';
import Organizations from '@/pages/Organizations';
import Projects from '@/pages/Projects';
import Reports from '@/pages/Reports';
import Users from '@/pages/Users';
import Branches from '@/pages/Branches';
import Settings from '@/pages/Settings';
import RequestAssistance from '@/pages/RequestAssistance';
import MyRequests from '@/pages/MyRequests';
import AdminRequests from '@/pages/AdminRequests';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Role-based Protected Route Component
const RoleProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles: string[] 
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="request-assistance" element={
            <RoleProtectedRoute allowedRoles={['staff', 'beneficiary']}>
              <RequestAssistance />
            </RoleProtectedRoute>
          } />
          <Route path="my-requests" element={
            <RoleProtectedRoute allowedRoles={['beneficiary']}>
              <MyRequests />
            </RoleProtectedRoute>
          } />
          <Route path="admin-requests" element={
            <RoleProtectedRoute allowedRoles={['admin', 'branch_manager', 'approver']}>
              <AdminRequests />
            </RoleProtectedRoute>
          } />
          <Route path="beneficiaries" element={
            <RoleProtectedRoute allowedRoles={['admin', 'branch_manager', 'staff']}>
              <Beneficiaries />
            </RoleProtectedRoute>
          } />
          <Route path="assistances" element={
            <RoleProtectedRoute allowedRoles={['admin', 'branch_manager', 'staff']}>
              <Assistances />
            </RoleProtectedRoute>
          } />
          <Route path="aid-files" element={
            <RoleProtectedRoute allowedRoles={['admin', 'branch_manager']}>
              <AidFiles />
            </RoleProtectedRoute>
          } />
          <Route path="organizations" element={
            <RoleProtectedRoute allowedRoles={['admin', 'branch_manager']}>
              <Organizations />
            </RoleProtectedRoute>
          } />
          <Route path="projects" element={
            <RoleProtectedRoute allowedRoles={['admin', 'branch_manager']}>
              <Projects />
            </RoleProtectedRoute>
          } />
          <Route path="reports" element={
            <RoleProtectedRoute allowedRoles={['admin', 'branch_manager']}>
              <Reports />
            </RoleProtectedRoute>
          } />
          <Route path="users" element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <Users />
            </RoleProtectedRoute>
          } />
          <Route path="branches" element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <Branches />
            </RoleProtectedRoute>
          } />
          <Route path="settings" element={
            <RoleProtectedRoute allowedRoles={['admin', 'branch_manager']}>
              <Settings />
            </RoleProtectedRoute>
          } />
        </Route>
        <Route path="login" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="App">
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#333',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #e9ecef',
                },
                success: {
                  iconTheme: {
                    primary: '#28a745',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#dc3545',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
