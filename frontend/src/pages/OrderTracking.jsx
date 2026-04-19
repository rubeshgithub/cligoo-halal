import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, MessageSquare, ShieldCheck, Bike, Store, Check, Home } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { RESTAURANTS, DRIVER } from '../mock/mock';

const STAGES = ['confirmed','preparing','ready','delivering','delivered'];

const OrderTracking = () => {
  const { id } = useParams();
  const { t, lang } = useApp();
  const [stage, setStage] = useState(0);
  const [driverPos, setDriverPos] = useState({ x: 20, y: 70 });

  let order = null;
  try { order = JSON.parse(localStorage.getItem('cligoo_last_order')); } catch {}
  const resto = RESTAURANTS.find(r => r.id === order?.restaurantId) || RESTAURANTS[0];

  useEffect(() => {
    const iv = setInterval(() => setStage(s => Math.min(s + 1, STAGES.length - 1)), 6000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setDriverPos(p => ({
        x: Math.min(85, p.x + 0.8 + Math.random() * 0.4),
        y: Math.max(25, p.y - 0.6 - Math.random() * 0.3),
      }));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const currentKey = STAGES[stage];
  const eta = Math.max(3, 25 - stage * 6);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-[#6B6259] mb-2">
        <span>{t('track.title')}</span>
        <span>·</span>
        <span className="font-mono">#{id}</span>
      </div>
      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#1F1B16] mb-6">
        {t(`track.status.${currentKey}`)}
      </h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Map mock */}
        <div className="relative rounded-2xl overflow-hidden map-bg h-[440px] border border-[#F1E6D6]">
          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 0 70 Q 30 65 50 55 T 100 20" stroke="#FFFFFF" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.9" />
            <path d="M 10 20 Q 40 30 55 50 T 100 80" stroke="#FFFFFF" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M 0 40 Q 30 45 60 40 T 100 50" stroke="#FFFFFF" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.5" />
          </svg>

          {/* Restaurant marker */}
          <div className="absolute" style={{ left: '20%', top: '70%', transform: 'translate(-50%,-50%)' }}>
            <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-[#FF6A35]" />
            </div>
            <p className="text-[11px] font-semibold mt-1 bg-white/90 px-2 py-0.5 rounded shadow inline-block">{resto.name}</p>
          </div>

          {/* Driver marker (animated) */}
          <div className="absolute transition-all duration-1000" style={{ left: `${driverPos.x}%`, top: `${driverPos.y}%`, transform: 'translate(-50%,-50%)' }}>
            <div className="w-12 h-12 rounded-full bg-[#FF6A35] shadow-lg flex items-center justify-center ping-soft">
              <Bike className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Home marker */}
          <div className="absolute" style={{ left: '85%', top: '20%', transform: 'translate(-50%,-50%)' }}>
            <div className="w-10 h-10 rounded-full bg-[#1F1B16] shadow-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <p className="text-[11px] font-semibold mt-1 bg-white/90 px-2 py-0.5 rounded shadow inline-block">
              {lang==='fr' ? 'Vous' : 'You'}
            </p>
          </div>

          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-2xl p-3 shadow-lg">
            <p className="text-[11px] text-[#6B6259] leading-none">{t('track.eta')}</p>
            <p className="font-display text-2xl font-extrabold text-[#1F1B16]">{eta} {t('common.minutes')}</p>
          </div>
        </div>

        <aside className="space-y-4">
          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-[#F1E6D6] p-5">
            {STAGES.map((k, i) => (
              <div key={k} className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= stage ? 'bg-[#FF6A35] text-white' : 'bg-[#F1E6D6] text-[#B8AD9C]'}`}>
                    {i < stage ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i+1}</span>}
                  </div>
                  {i < STAGES.length - 1 && <div className={`w-0.5 flex-1 min-h-8 ${i < stage ? 'bg-[#FF6A35]' : 'bg-[#F1E6D6]'}`} />}
                </div>
                <div className="pb-5">
                  <p className={`text-sm font-semibold ${i === stage ? 'text-[#FF6A35]' : 'text-[#1F1B16]'}`}>
                    {t(`track.status.${k}`)}
                  </p>
                  {i === stage && <p className="text-xs text-[#6B6259] mt-0.5">{lang==='fr' ? 'En cours...' : 'In progress...'}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Driver card */}
          <div className="bg-white rounded-2xl border border-[#F1E6D6] p-5">
            <p className="text-xs text-[#6B6259] mb-3">{t('track.driver')}</p>
            <div className="flex items-center gap-3">
              <img src={DRIVER.photo} alt="driver" className="w-14 h-14 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-display font-bold text-[#1F1B16]">{DRIVER.name}</p>
                <p className="text-xs text-[#6B6259]">{lang==='fr' ? DRIVER.vehicle_fr : DRIVER.vehicle_en} · {DRIVER.plate} · {DRIVER.rating}★</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 h-10 rounded-full bg-[#FFF4E8] text-[#1F1B16] text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#FFE0C2]">
                <Phone className="w-4 h-4" /> {t('track.call')}
              </button>
              <button className="flex-1 h-10 rounded-full bg-[#FFF4E8] text-[#1F1B16] text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#FFE0C2]">
                <MessageSquare className="w-4 h-4" /> {t('track.message')}
              </button>
            </div>
            <div className="mt-4 flex items-start gap-2 text-[11px] text-[#6B6259] bg-[#E8F5E9] p-2 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32] mt-0.5" />
              <span>{lang==='fr' ? `Livreur assuré · ${DRIVER.insurance}` : `Insured courier · ${DRIVER.insurance}`}</span>
            </div>
          </div>

          {/* Summary mini */}
          {order && (
            <div className="bg-white rounded-2xl border border-[#F1E6D6] p-5">
              <p className="text-xs text-[#6B6259]">{t('checkout.summary')}</p>
              <p className="font-display text-lg font-bold text-[#1F1B16] mt-1">{order.total.toFixed(2)} €</p>
              <p className="text-xs text-[#6B6259]">{order.items.length} {t('cart.items')} · {order.payment.toUpperCase()}</p>
              <Link to="/account" className="mt-4 block text-center h-10 rounded-full bg-[#1F1B16] text-white text-sm font-semibold leading-10">
                {t('account.orders')}
              </Link>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
};

export default OrderTracking;
