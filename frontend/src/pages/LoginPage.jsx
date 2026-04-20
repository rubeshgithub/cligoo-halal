import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Logo from '../components/Logo';

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.56-2.77c-.99.67-2.25 1.06-3.72 1.06-2.87 0-5.3-1.94-6.16-4.54H2.18v2.85A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.85Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.1 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.85C6.7 7.32 9.13 5.38 12 5.38Z" />
  </svg>
);

const LoginPage = () => {
  const { login, register, googleSignIn, t, lang } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const [mode, setMode] = useState('login'); // or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      if (mode === 'login') await login(email, password);
      else                  await register(email, password, name || email.split('@')[0]);
      nav('/account', { replace: true });
    } catch (ex) {
      setErr(ex?.response?.data?.detail || (lang==='fr' ? 'Erreur de connexion' : 'Authentication error'));
    } finally { setBusy(false); }
  };

  const isLogin = mode === 'login';
  const googleError = new URLSearchParams(loc.search).get('error') === 'google';

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-6">
        <Logo size={36} className="justify-center" />
      </div>
      <div className="bg-white rounded-2xl border border-[#E8E0D0] p-7">
        <h1 className="font-display text-2xl font-extrabold text-[#1F3B40]">
          {isLogin ? (lang==='fr' ? 'Bon retour chez CLIGOO' : 'Welcome back to CLIGOO')
                   : (lang==='fr' ? 'Créez votre compte' : 'Create your account')}
        </h1>
        <p className="text-sm text-[#5A6F72] mt-1 mb-6">
          {isLogin ? (lang==='fr' ? 'Connectez-vous pour commander' : 'Sign in to place an order')
                   : (lang==='fr' ? 'Rejoignez la communauté Halal' : 'Join the Halal community')}
        </p>

        <button onClick={googleSignIn}
          className="w-full h-12 rounded-xl bg-white border border-[#E8E0D0] hover:border-[#1F3B40] text-[#1F3B40] font-semibold inline-flex items-center justify-center gap-3 mb-4">
          <GoogleIcon />
          {lang==='fr' ? 'Continuer avec Google' : 'Continue with Google'}
        </button>
        {googleError && <p className="text-xs text-red-500 mb-3">{lang==='fr' ? 'La connexion Google a échoué. Réessayez.' : 'Google sign-in failed. Please retry.'}</p>}

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#E8E0D0]" />
          <span className="text-xs text-[#A8BCBE]">{lang==='fr' ? 'OU' : 'OR'}</span>
          <div className="flex-1 h-px bg-[#E8E0D0]" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {!isLogin && (
            <div className="flex items-center gap-2 h-12 px-4 rounded-xl border border-[#E8E0D0] focus-within:border-[#3E8F8B] bg-white">
              <User className="w-4 h-4 text-[#A8BCBE]" />
              <input value={name} onChange={e=>setName(e.target.value)}
                placeholder={lang==='fr' ? 'Prénom' : 'First name'}
                className="flex-1 outline-none text-sm" />
            </div>
          )}
          <div className="flex items-center gap-2 h-12 px-4 rounded-xl border border-[#E8E0D0] focus-within:border-[#3E8F8B] bg-white">
            <Mail className="w-4 h-4 text-[#A8BCBE]" />
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="vous@exemple.com" className="flex-1 outline-none text-sm" />
          </div>
          <div className="flex items-center gap-2 h-12 px-4 rounded-xl border border-[#E8E0D0] focus-within:border-[#3E8F8B] bg-white">
            <Lock className="w-4 h-4 text-[#A8BCBE]" />
            <input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)}
              placeholder={lang==='fr' ? 'Mot de passe (6+ car.)' : 'Password (6+ chars)'}
              className="flex-1 outline-none text-sm" />
          </div>
          {err && <p className="text-xs text-red-500">{err}</p>}
          <button type="submit" disabled={busy}
            className="w-full h-12 rounded-xl bg-[#3E8F8B] hover:bg-[#2F7A78] disabled:opacity-60 text-white font-semibold inline-flex items-center justify-center gap-2">
            {busy ? '…' : (isLogin ? (lang==='fr' ? 'Se connecter' : 'Log in')
                                    : (lang==='fr' ? 'Créer le compte' : 'Create account'))}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between mt-5 text-xs text-[#5A6F72]">
          <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" /> {lang==='fr' ? 'Chiffré & sécurisé' : 'Encrypted & secure'}</span>
          <button type="button" onClick={()=>{ setMode(isLogin?'signup':'login'); setErr(''); }} className="text-[#3E8F8B] font-semibold hover:underline">
            {isLogin ? (lang==='fr' ? 'Créer un compte' : 'Create an account')
                     : (lang==='fr' ? 'J\'ai déjà un compte' : 'I have an account')}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-[#5A6F72] mt-6">
        <Link to="/" className="hover:text-[#3E8F8B]">{lang==='fr' ? 'Retour à l\'accueil' : 'Back to home'}</Link>
      </p>
    </main>
  );
};

export default LoginPage;
