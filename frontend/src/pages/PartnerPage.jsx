import React from 'react';
import { Store, TrendingUp, CreditCard, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const PartnerPage = () => {
  const { t, lang } = useApp();
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(135deg, #FFF4E8, #FFE0C2)' }} />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#FFD7B8] text-xs font-semibold text-[#2E7D32] mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> {lang==='fr' ? 'Réseau 100% Halal' : '100% Halal network'}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-[#1F1B16] leading-tight">
              {t('partner.cta.title')}
            </h1>
            <p className="mt-4 text-lg text-[#5A4F44] max-w-xl">{t('partner.cta.desc')}</p>

            <form className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              <input placeholder={lang==='fr'?'Nom du restaurant':'Restaurant name'} className="h-12 px-4 rounded-xl border border-[#F1E6D6] focus:border-[#FF6A35] outline-none bg-white" />
              <input placeholder={lang==='fr'?'Ville':'City'} className="h-12 px-4 rounded-xl border border-[#F1E6D6] focus:border-[#FF6A35] outline-none bg-white" />
              <input placeholder={lang==='fr'?'Email':'Email'} className="h-12 px-4 rounded-xl border border-[#F1E6D6] focus:border-[#FF6A35] outline-none bg-white sm:col-span-2" />
              <input placeholder={lang==='fr'?'Téléphone':'Phone'} className="h-12 px-4 rounded-xl border border-[#F1E6D6] focus:border-[#FF6A35] outline-none bg-white sm:col-span-2" />
              <button type="button" className="h-12 rounded-xl bg-[#FF6A35] hover:bg-[#E85A28] text-white font-semibold sm:col-span-2 inline-flex items-center justify-center gap-2">
                {t('partner.cta.button')} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
          <div className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <img src="https://images.pexels.com/photos/23325485/pexels-photo-23325485.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=800&w=700" alt="restaurant" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <h2 className="font-display text-3xl font-extrabold text-[#1F1B16] text-center">{lang==='fr' ? 'Pourquoi CLIGOO ?' : 'Why CLIGOO?'}</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            { icon: TrendingUp, title: lang==='fr'?'+ de commandes':'+ orders',     desc: lang==='fr'?'Accédez à une communauté de +2M de clients recherchant du Halal.':'Reach 2M+ customers searching for Halal food.' },
            { icon: CreditCard, title: lang==='fr'?'Paiement rapide':'Fast payouts', desc: lang==='fr'?'Stripe Connect verse votre part instantanément à chaque commande.':'Stripe Connect pays your share instantly on every order.' },
            { icon: Store,      title: lang==='fr'?'App restaurant gratuite':'Free restaurant app', desc: lang==='fr'?'Tablette, imprimante thermique incluses. Android POS compatible.':'Tablet and thermal printer included. Android POS compatible.' },
          ].map((f,i)=>(
            <div key={i} className="bg-white rounded-2xl border border-[#F1E6D6] p-6 lift">
              <div className="w-12 h-12 rounded-xl bg-[#FFF4E8] text-[#FF6A35] flex items-center justify-center mb-4"><f.icon className="w-6 h-6" /></div>
              <h3 className="font-display font-bold text-lg text-[#1F1B16]">{f.title}</h3>
              <p className="text-sm text-[#6B6259] mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-20">
        <div className="bg-white rounded-2xl border border-[#F1E6D6] p-8">
          <h3 className="font-display text-2xl font-bold text-[#1F1B16] mb-4">{lang==='fr'?'Ce qui est inclus':"What's included"}</h3>
          <ul className="grid sm:grid-cols-2 gap-3">
            {[
              lang==='fr'?'Vérification Halal (AVS, ARGML, MP)':'Halal verification (AVS, ARGML, MP)',
              lang==='fr'?'Onboarding accompagné':'Guided onboarding',
              lang==='fr'?'Photos professionnelles':'Professional photos',
              lang==='fr'?'Tableau de bord analytics':'Analytics dashboard',
              lang==='fr'?'Paiement hebdomadaire':'Weekly payouts',
              lang==='fr'?'Support 7/7':'7/7 support',
            ].map((x,i)=>(
              <li key={i} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-[#2E7D32]" /> {x}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default PartnerPage;
