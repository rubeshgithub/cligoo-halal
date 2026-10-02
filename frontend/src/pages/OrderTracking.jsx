import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, MessageSquare, ShieldCheck, Bike, Store, Check, Home, Store as StoreIcon, Video } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { orderApi } from '../lib/api';
import VideoCallModal from '../components/VideoCallModal';

const DRIVER = {
  name: 'Karim B.', rating: 4.9, vehicle_fr: 'Scooter', vehicle_en: 'Scooter',
  plate: 'AB-123-CD', photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80',
  insurance: 'MAIF Pro · Police n°FR-2025-8842173',
};
const STAGES = ['confirmed','preparing','ready','delivering','delivered'];

const OrderTracking = () => {
  const { id } = useParams();
  const { t, lang, user } = useApp();
  const [order, setOrder] = useState(null);
  const [driverPos, setDriverPos] = useState({ x: 20, y: 70 });
  const [error, setError] = useState('');
  const [videoOpen, setVideoOpen] = useState(false);

  const stageIdx = useMemo(() => STAGES.indexOf(order?.status || 'confirmed'), [order]);

  // Poll the order and auto-advance status (demo) via PATCH
  useEffect(() => {
    let t1, t2;
    const poll = async () => {
      try {
        const o = await orderApi.get(id);
        setOrder(o);
        const idx = STAGES.indexOf(o.status);
        if (idx >= 0 && idx < STAGES.length - 1) {
          t2 = setTimeout(async () => {
            try { await orderApi.setStatus(id, STAGES[idx + 1]); } catch {}
          }, 7000);
        }
      } catch (e) {
        setError(e?.response?.data?.detail || 'Order not found');
      }
    };
    poll();
    t1 = setInterval(poll, 5000);
    return () => { clearInterval(t1); clearTimeout(t2); };
  }, [id]);

  useEffect(() => {
    const iv = setInterval(() => {
      setDriverPos(p => ({
        x: Math.min(85, p.x + 0.8 + Math.random() * 0.4),
        y: Math.max(25, p.y - 0.6 - Math.random() * 0.3),
      }));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  if (error) return (
    <main className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-ink-soft">{error}</p>
      {!user && <Link to="/login" className="inline-block mt-4 h-10 px-5 leading-10 rounded-full bg-emerald-700 text-white font-semibold text-sm">{t('nav.login')}</Link>}
    </main>
  );

  if (!order) return <main className="max-w-3xl mx-auto px-4 py-20 text-center text-ink-soft">Chargement…</main>;

  const currentKey = STAGES[stageIdx >= 0 ? stageIdx : 0];
  const eta = Math.max(3, 25 - (stageIdx < 0 ? 0 : stageIdx) * 6);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-ink-soft mb-2">
        <span>{t('track.title')}</span>
        <span>·</span>
        <span className="font-mono">#{order.id}</span>
      </div>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-6">
        {t(`track.status.${currentKey}`)}
      </h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="relative rounded-2xl overflow-hidden map-bg h-[440px] border border-clay">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 0 70 Q 30 65 50 55 T 100 20" stroke="#FFFFFF" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.9" />
            <path d="M 10 20 Q 40 30 55 50 T 100 80" stroke="#FFFFFF" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M 0 40 Q 30 45 60 40 T 100 50" stroke="#FFFFFF" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.5" />
          </svg>

          <div className="absolute" style={{ left: '20%', top: '70%', transform: 'translate(-50%,-50%)' }}>
            <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <StoreIcon className="w-5 h-5 text-emerald-700" />
            </div>
            <p className="text-[11px] font-semibold mt-1 bg-white/90 px-2 py-0.5 rounded shadow inline-block">{order.restaurant_name}</p>
          </div>

          <div className="absolute transition-all duration-1000" style={{ left: `${driverPos.x}%`, top: `${driverPos.y}%`, transform: 'translate(-50%,-50%)' }}>
            <div className="w-12 h-12 rounded-full bg-iznik-700 shadow-lg flex items-center justify-center ping-soft">
              <Bike className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="absolute" style={{ left: '85%', top: '20%', transform: 'translate(-50%,-50%)' }}>
            <div className="w-10 h-10 rounded-full bg-ink shadow-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <p className="text-[11px] font-semibold mt-1 bg-white/90 px-2 py-0.5 rounded shadow inline-block">
              {lang==='fr' ? 'Vous' : 'You'}
            </p>
          </div>

          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-2xl p-3 shadow-lg">
            <p className="text-[11px] text-ink-soft leading-none">{t('track.eta')}</p>
            <p className="font-display text-2xl font-bold text-iznik-700">{eta} {t('common.minutes')}</p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-clay p-5">
            {STAGES.map((k, i) => (
              <div key={k} className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= stageIdx ? 'bg-emerald-700 text-white' : 'bg-clay text-ink-mist'}`}>
                    {i < stageIdx ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i+1}</span>}
                  </div>
                  {i < STAGES.length - 1 && <div className={`w-0.5 flex-1 min-h-8 ${i < stageIdx ? 'bg-emerald-700' : 'bg-clay'}`} />}
                </div>
                <div className="pb-5">
                  <p className={`text-sm font-semibold ${i === stageIdx ? 'text-emerald-700' : 'text-ink'}`}>
                    {t(`track.status.${k}`)}
                  </p>
                  {i === stageIdx && <p className="text-xs text-ink-soft mt-0.5">{lang==='fr' ? 'En cours...' : 'In progress...'}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-clay p-5">
            <p className="text-xs text-ink-soft mb-3">{t('track.driver')}</p>
            <div className="flex items-center gap-3">
              <img src={DRIVER.photo} alt="driver" className="w-14 h-14 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-display font-bold text-ink">{DRIVER.name}</p>
                <p className="text-xs text-ink-soft">{lang==='fr' ? DRIVER.vehicle_fr : DRIVER.vehicle_en} · {DRIVER.plate} · {DRIVER.rating}★</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 h-10 rounded-full bg-saffron-50 text-ink text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-saffron-100">
                <Phone className="w-4 h-4" /> {t('track.call')}
              </button>
              <button className="flex-1 h-10 rounded-full bg-saffron-50 text-ink text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-saffron-100">
                <MessageSquare className="w-4 h-4" /> {t('track.message')}
              </button>
            </div>
            <button onClick={()=>setVideoOpen(true)} className="w-full mt-2 h-10 rounded-full bg-iznik-700 hover:bg-iznik-900 text-white text-sm font-semibold inline-flex items-center justify-center gap-2">
              <Video className="w-4 h-4" /> {t('track.video')}
            </button>
            <div className="mt-4 flex items-start gap-2 text-[11px] text-ink-soft bg-emerald-50 p-2 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 mt-0.5" />
              <span>{lang==='fr' ? `Livreur assuré · ${DRIVER.insurance}` : `Insured courier · ${DRIVER.insurance}`}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-clay p-5">
            <p className="text-xs text-ink-soft">{t('checkout.summary')}</p>
            <p className="font-display text-lg font-bold text-ink mt-1">{order.total.toFixed(2)} €</p>
            <p className="text-xs text-ink-soft">{order.items.length} {t('cart.items')} · {order.payment_method.toUpperCase()}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] bg-saffron-50 rounded-lg p-2">
              <div>
                <div className="text-ink-soft">{t('checkout.split.restaurant')}</div>
                <div className="font-bold">{order.stripe_split.restaurant_payout.toFixed(2)} €</div>
              </div>
              <div>
                <div className="text-ink-soft">{t('checkout.split.driver')}</div>
                <div className="font-bold">{order.stripe_split.driver_payout.toFixed(2)} €</div>
              </div>
              <div>
                <div className="text-ink-soft">{t('checkout.split.platform')}</div>
                <div className="font-bold">{order.stripe_split.platform_fee.toFixed(2)} €</div>
              </div>
            </div>
            <Link to="/account" className="mt-4 block text-center h-10 rounded-full bg-ink text-white text-sm font-semibold leading-10">
              {t('account.orders')}
            </Link>
          </div>
        </aside>
      </div>

      <VideoCallModal open={videoOpen} onOpenChange={setVideoOpen} orderId={order.id} />
    </main>
  );
};

export default OrderTracking;
