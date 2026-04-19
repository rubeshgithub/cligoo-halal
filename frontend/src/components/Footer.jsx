import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import Logo from './Logo';
import { useApp } from '../contexts/AppContext';
import { CITIES } from '../mock/mock';

const Footer = () => {
  const { t } = useApp();
  return (
    <footer className="bg-[#1F1B16] text-[#E9E0D3] mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Logo size={26} className="mb-4" />
            <p className="text-sm text-[#B8AD9C] mb-4">
              {t('footer.halal')}
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#2E7D32]/15 text-[#7BC47F] border border-[#2E7D32]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              AVS · ARGML · Mosquée de Paris
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-[#B8AD9C]">
              <li><a href="#" className="hover:text-white">{t('footer.about')}</a></li>
              <li><a href="#" className="hover:text-white">{t('footer.careers')}</a></li>
              <li><a href="#" className="hover:text-white">{t('footer.press')}</a></li>
              <li><Link to="/partner" className="hover:text-white">{t('nav.partner')}</Link></li>
              <li><Link to="/driver" className="hover:text-white">{t('nav.deliver')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">{t('footer.discover')}</h4>
            <ul className="space-y-2 text-sm text-[#B8AD9C]">
              <li><Link to="/restaurants" className="hover:text-white">{t('footer.categories')}</Link></li>
              <li><a href="#" className="hover:text-white">{t('footer.blog')}</a></li>
              <li><a href="#" className="hover:text-white">{t('nav.help')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">{t('footer.cities')}</h4>
            <ul className="grid grid-cols-2 gap-y-1 text-sm text-[#B8AD9C]">
              {CITIES.slice(0,10).map(c => (
                <li key={c}><a href="#" className="hover:text-white">{c}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <p className="text-xs text-[#8E8678]">© {new Date().getFullYear()} CLIGOO SAS · RCS Paris 908 123 456 · {t('footer.rights')}</p>
          <div className="flex items-center gap-5 text-xs text-[#B8AD9C]">
            <a href="#" className="hover:text-white">{t('footer.terms')}</a>
            <a href="#" className="hover:text-white">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white">{t('footer.cookies')}</a>
          </div>
          <div className="flex items-center gap-3 text-[#B8AD9C]">
            <a href="#" aria-label="instagram" className="hover:text-white"><Instagram className="w-4 h-4" /></a>
            <a href="#" aria-label="twitter" className="hover:text-white"><Twitter className="w-4 h-4" /></a>
            <a href="#" aria-label="facebook" className="hover:text-white"><Facebook className="w-4 h-4" /></a>
            <a href="#" aria-label="linkedin" className="hover:text-white"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
