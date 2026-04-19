import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, Search, Menu, User, Globe, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';

const Header = () => {
  const { t, lang, setLang, address, setAddress, cartCount, setCartOpen, user, logout } = useApp();
  const loc = useLocation();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [addr, setAddr] = useState(address);

  const isLanding = loc.pathname === '/';

  const saveAddr = (e) => {
    e.preventDefault();
    setAddress(addr);
    if (isLanding) nav('/restaurants');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#F1E6D6]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
        <Link to="/" className="shrink-0"><Logo /></Link>

        {!isLanding && (
          <form onSubmit={saveAddr} className="hidden md:flex items-center gap-2 flex-1 max-w-md bg-[#FFF4E8] rounded-full px-4 h-11 border border-transparent hover:border-[#FFD7B8] focus-within:border-[#FF6A35]">
            <MapPin className="w-4 h-4 text-[#FF6A35]" />
            <input
              value={addr}
              onChange={(e)=>setAddr(e.target.value)}
              placeholder={t('hero.address.placeholder')}
              className="bg-transparent flex-1 outline-none text-sm placeholder:text-[#B89A7E]"
            />
            <button type="submit" className="text-xs font-medium text-[#FF6A35] hover:text-[#E85A28]">OK</button>
          </form>
        )}

        <nav className="hidden lg:flex items-center gap-1 ml-auto">
          <Link to="/restaurants" className="px-3 py-2 text-sm font-medium text-[#2A241E] hover:text-[#FF6A35]">{t('nav.restaurants')}</Link>
          <Link to="/partner" className="px-3 py-2 text-sm font-medium text-[#2A241E] hover:text-[#FF6A35]">{t('nav.partner')}</Link>
          <Link to="/driver" className="px-3 py-2 text-sm font-medium text-[#2A241E] hover:text-[#FF6A35]">{t('nav.deliver')}</Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden sm:flex items-center gap-1 px-3 h-10 rounded-full text-sm font-medium text-[#2A241E] hover:bg-[#FFF4E8]">
                <Globe className="w-4 h-4" />
                {lang.toUpperCase()}
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={()=>setLang('fr')}>Français</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>setLang('en')}>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 h-10 rounded-full text-sm font-medium text-[#2A241E] hover:bg-[#FFF4E8]">
                  {user.picture ? (
                    <img src={user.picture} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6A35] to-[#FFB347] text-white flex items-center justify-center text-xs font-bold">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="hidden md:inline">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={()=>nav('/account')}>{t('nav.account')}</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>nav('/account')}>{t('nav.orders')}</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>nav('/restaurant-dashboard')}>{t('dash.restaurant')}</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>nav('/driver-dashboard')}>{t('dash.driver')}</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>nav('/admin')}>{t('dash.admin')}</DropdownMenuItem>
                <DropdownMenuItem onClick={async ()=>{ await logout(); nav('/'); }}>{t('nav.logout')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <button
                onClick={()=>nav('/login')}
                className="hidden sm:inline-flex h-10 px-4 rounded-full text-sm font-semibold text-[#2A241E] hover:bg-[#FFF4E8]"
              >
                {t('nav.login')}
              </button>
              <button
                onClick={()=>nav('/login')}
                className="h-10 px-4 rounded-full text-sm font-semibold text-white bg-[#1F1B16] hover:bg-[#2F2A24]"
              >
                {t('nav.signup')}
              </button>
            </>
          )}

          <button
            onClick={()=>setCartOpen(true)}
            className="relative h-10 w-10 rounded-full flex items-center justify-center bg-[#FFF4E8] hover:bg-[#FFE0C2]"
            aria-label="cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#1F1B16]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#FF6A35] text-white text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button className="lg:hidden h-10 w-10 rounded-full flex items-center justify-center hover:bg-[#FFF4E8]" onClick={()=>setMobileOpen(v=>!v)}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#F1E6D6] bg-white px-4 py-3 space-y-2">
          <Link to="/restaurants" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('nav.restaurants')}</Link>
          <Link to="/partner" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('nav.partner')}</Link>
          <Link to="/driver" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('nav.deliver')}</Link>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={()=>setLang('fr')}>FR</Button>
            <Button variant="outline" size="sm" onClick={()=>setLang('en')}>EN</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
