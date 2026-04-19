import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthCallback from './components/AuthCallback';
import Landing from './pages/Landing';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Account from './pages/Account';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminPanel from './pages/AdminPanel';
import PartnerPage from './pages/PartnerPage';
import DriverPage from './pages/DriverPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from './components/ui/toaster';

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
function AppRouter() {
  const location = useLocation();
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderTracking />} />
        <Route path="/account" element={<Account />} />
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/driver" element={<DriverPage />} />
      </Routes>
      <Footer />
      <CartDrawer />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <AppProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AppProvider>
    </div>
  );
}

export default App;
