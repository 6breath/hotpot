import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import CustomerLayout from './pages/Customer';
import Dashboard from './pages/Dashboard';
import Ingredient from './pages/Ingredient';
import Stock from './pages/Stock';
import StockRecord from './pages/StockRecord';
import Supplier from './pages/Supplier';
import Menu from './pages/Customer/Menu';
import CustomerOrder from './pages/Customer/Order';
import Profile from './pages/Customer/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<Navigate to="menu" replace />} />
          <Route path="menu" element={<Menu />} />
          <Route path="order" element={<CustomerOrder />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Menu />} />
        </Route>
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ingredients" element={<Ingredient />} />
          <Route path="stock" element={<Stock />} />
          <Route path="stock-records" element={<StockRecord />} />
          <Route path="suppliers" element={<Supplier />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;