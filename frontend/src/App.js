import React from 'react';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Payment from './pages/Payment';
import Product from './pages/Product';
import LoginPage from './pages/LoginPage';
import UserOrders from './pages/UserOrders';
import UserProfile from './pages/UserProfile';
import ProductDetail from './pages/ProductDetail';
import PaymentReturn from './pages/PaymentReturn';
import AdminDashboard from './pages/AdminDashboard';
import AdminEditProduct from './pages/AdminEditProduct';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-wrapper">
            <Header />
            <div className="container main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/product" element={<Product />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/user" element={<UserProfile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/user/orders" element={<UserOrders />} />
                <Route path="/login-success" element={<LoginPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/payment-return" element={<PaymentReturn />} />
                <Route path="/admin/edit-product/:id" element={<AdminEditProduct />} />
                <Route path="*" element={<LoginPage />} />
              </Routes>
            </div>
            <Footer />
            <ToastContainer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;