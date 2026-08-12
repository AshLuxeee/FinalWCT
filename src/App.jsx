import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

// Admin Pages
import ManageJewelry from './pages/admin/ManageJewelry';
import ManageCustomers from './pages/admin/ManageCustomers';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';

// User Pages
import BrowseJewelry from './pages/user/BrowseJewelry';
import Cart from './pages/user/Cart';
import MyOrders from './pages/user/MyOrders';
import Profile from './pages/user/Profile';

import { useAuth } from './contexts/AuthContext';

// Basic Protected Route Component
function ProtectedRoute({ children, allowedRole }) {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and it doesn't match
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/user'} replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="jewelry" element={<ManageJewelry />} />
        <Route path="customers" element={<ManageCustomers />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="users" element={<ManageUsers />} />
      </Route>

      {/* User Routes */}
      <Route path="/user" element={
        <ProtectedRoute allowedRole="user">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<UserDashboard />} />
        <Route path="browse" element={<BrowseJewelry />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
