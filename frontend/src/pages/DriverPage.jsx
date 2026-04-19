import React from 'react';
import { Bike, ShieldCheck, Clock, Euro, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const DriverPage = () => {
  const { t, lang } = useApp();
  return (
    <main>
      <section className="relative overflow-hidden bg-[#1F1B16] text-white">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,106,53,0.35), transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#FFB347] mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> {lang==='fr' ? 'Conforme URSSAF 2025' : 'URSSAF 2025 compliant'}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
              {t('driver.cta.title')}
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-xl">{t('driver.cta.desc')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="h-12 px-6 rounded-full bg-[#FFB347] text-[#1F1B16] font-semibold inline-flex items-center gap-2 hover:bg-[#FFC66E]">
                {t('driver.cta.button')} <ArrowRight className="w-4 h-4" />
              </button>
              <button className="h-12 px-6 rounded-full bg-white/10 text-white font-semibold hover:bg-white/15">
                {lang==='fr'?'Simulateur de gains':'Earnings simulator'}
              </button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              {[
                { v: '15€', l: lang==='fr'?'par heure moy.':'avg/hour' },
                { v: 'J+1',  l: lang==='fr'?'paiement':'payout' },
                { v: '24/7', l: 'support' },
              ].map((s,i)=>(
                <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="font-display text-2xl font-extrabold text-[#FFB347]">{s.v}</p>
                  <p className="text-[11px] text-white/70">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1755604708686-c7f3413e6ce3?w=900&q=80" alt="courier" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <h2 className="font-display text-3xl font-extrabold text-[#1F1B16] text-center">{lang==='fr'?'Livrer avec CLIGOO':'Deliver with CLIGOO'}</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            { icon: Clock,       title: lang==='fr'?'Horaires flexibles':'Flexible hours', desc: lang==='fr'?'Connectez-vous quand vous voulez, aucun minimum imposé.':'Go online whenever you want, no minimum hours.' },
            { icon: Euro,        title: lang==='fr'?'Paiements instantanés':'Instant payouts', desc: lang==='fr'?'Récupérez vos gains chaque jour via Stripe Connect.':'Cash out daily via Stripe Connect.' },
            { icon: ShieldCheck, title: lang==='fr'?'Assurance incluse':'Insurance included', desc: lang==='fr'?'Responsabilité civile pro et garantie matériel pendant vos courses.':'Professional liability and gear cover during deliveries.' },
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
        <div className="bg-[#FFF4E8] rounded-2xl border border-[#FFD7B8] p-8">
          <h3 className="font-display text-2xl font-bold text-[#1F1B16] mb-4">{lang==='fr'?'Comment commencer':'How to start'}</h3>
          <ol className="grid sm:grid-cols-4 gap-4">
            {[
              lang==='fr'?'Inscrivez-vous':'Sign up',
              lang==='fr'?'Fournissez vos documents':'Submit documents',
              lang==='fr'?'Activez votre assurance':'Activate insurance',
              lang==='fr'?'Commencez à livrer':'Start delivering',
            ].map((s,i)=>(
              <li key={i} className="bg-white rounded-xl p-4 relative">
                <div className="absolute -top-3 left-4 w-7 h-7 rounded-full bg-[#FF6A35] text-white font-display font-extrabold text-sm flex items-center justify-center">{i+1}</div>
                <p className="font-semibold text-sm text-[#1F1B16] mt-2">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
};

export default DriverPage;
