import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { translations } from '../i18n/translations';
import { authApi } from '../lib/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('cligoo_lang') || 'fr');
  const [address, setAddress] = useState(() => localStorage.getItem('cligoo_address') || '');
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cligoo_cart')) || { restaurantId: null, items: [] }; }
    catch { return { restaurantId: null, items: [] }; }
  });
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { localStorage.setItem('cligoo_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('cligoo_address', address); }, [address]);
  useEffect(() => { localStorage.setItem('cligoo_cart', JSON.stringify(cart)); }, [cart]);

  const refreshMe = useCallback(async () => {
    // skip if returning from Emergent OAuth (AuthCallback will handle session)
    if (window.location.hash?.includes('session_id=')) {
      setAuthLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => { refreshMe(); }, [refreshMe]);

  const login = async (email, password) => {
    const { user, token } = await authApi.login(email, password);
    localStorage.setItem('cligoo_token', token);
    setUser(user);
    return user;
  };

  const register = async (email, password, name) => {
    const { user, token } = await authApi.register(email, password, name);
    localStorage.setItem('cligoo_token', token);
    setUser(user);
    return user;
  };

  const googleSignIn = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/account';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const exchangeGoogleSession = async (sessionId) => {
    const { user, token } = await authApi.googleSession(sessionId);
    localStorage.setItem('cligoo_token', token);
    setUser(user);
    return user;
  };

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem('cligoo_token');
    setUser(null);
  };

  const t = (key) => translations[lang]?.[key] ?? translations.fr[key] ?? key;

  const addToCart = (restaurantId, item) => {
    setCart(prev => {
      if (prev.restaurantId && prev.restaurantId !== restaurantId) {
        return { restaurantId, items: [{ ...item, qty: 1 }] };
      }
      const existing = prev.items.find(i => i.id === item.id);
      const items = existing
        ? prev.items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev.items, { ...item, qty: 1 }];
      return { restaurantId, items };
    });
    setCartOpen(true);
  };

  const updateQty = (itemId, delta) => {
    setCart(prev => {
      const items = prev.items
        .map(i => i.id === itemId ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0);
      return { ...prev, items, restaurantId: items.length ? prev.restaurantId : null };
    });
  };

  const clearCart = () => setCart({ restaurantId: null, items: [] });

  const cartSubtotal = useMemo(
    () => cart.items.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );
  const cartCount = useMemo(
    () => cart.items.reduce((s, i) => s + i.qty, 0),
    [cart]
  );

  const value = {
    lang, setLang, t,
    address, setAddress,
    cart, cartOpen, setCartOpen,
    addToCart, updateQty, clearCart,
    cartSubtotal, cartCount,
    user, setUser, authLoading,
    login, register, googleSignIn, exchangeGoogleSession, logout, refreshMe,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
