import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Logo from './Logo';

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
const AuthCallback = () => {
  const nav = useNavigate();
  const { exchangeGoogleSession, lang } = useApp();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash || '';
    const match = hash.match(/session_id=([^&]+)/);
    const sessionId = match ? decodeURIComponent(match[1]) : null;

    const run = async () => {
      if (!sessionId) {
        nav('/', { replace: true });
        return;
      }
      try {
        await exchangeGoogleSession(sessionId);
        // clear hash
        window.history.replaceState(null, '', window.location.pathname);
        nav('/account', { replace: true });
      } catch (e) {
        console.error('Google session exchange failed', e);
        nav('/login?error=google', { replace: true });
      }
    };
    run();
  }, [exchangeGoogleSession, nav]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Logo size={40} />
      <div className="w-10 h-10 rounded-full border-4 border-[#FDE4CC] border-t-[#3E8F8B] animate-spin" />
      <p className="text-sm text-[#5A6F72]">{lang === 'fr' ? 'Connexion en cours…' : 'Signing you in…'}</p>
    </div>
  );
};

export default AuthCallback;
