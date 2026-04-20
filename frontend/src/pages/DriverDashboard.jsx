import React, { useState, useEffect } from 'react';
import { Bike, Euro, Clock, MapPin, Navigation2, ShieldCheck, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { DRIVER_JOBS, DRIVER } from '../mock/mock';

const DriverDashboard = () => {
  const { t, lang } = useApp();
  const [online, setOnline] = useState(true);
  const [jobs, setJobs] = useState(DRIVER_JOBS);
  const [active, setActive] = useState(null);
  const [earnings, setEarnings] = useState(87.40);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => {
      setPos(p => ({ x: Math.min(90, p.x + 0.6), y: Math.max(15, p.y - 0.4) }));
    }, 800);
    return () => clearInterval(iv);
  }, [active]);

  const accept = (j) => { setActive(j); setJobs(js => js.filter(x => x.id !== j.id)); };
  const complete = () => {
    if (!active) return;
    setEarnings(e => +(e + active.payout).toFixed(2));
    setActive(null);
    setPos({ x: 50, y: 50 });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <img src={DRIVER.photo} alt="" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <div className="inline-flex items-center gap-2 text-sm text-[#5A6F72]"><Bike className="w-4 h-4" /> {t('dash.driver')}</div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[#1F3B40]">{DRIVER.name}</h1>
          </div>
        </div>
        <button onClick={()=>setOnline(v=>!v)}
          className={`h-11 px-5 rounded-full font-semibold text-sm ${online ? 'bg-[#2E7D32] text-white' : 'bg-[#E8E0D0] text-[#5A6F72]'}`}>
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${online ? 'bg-white' : 'bg-[#A8BCBE]'}`} />
          {online ? t('common.online') : t('common.offline')}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Euro,        label: lang==='fr'?'Gains jour':'Today earnings', value: `${earnings.toFixed(2)} €`, accent: '#2E7D32' },
          { icon: Bike,        label: lang==='fr'?'Courses':'Deliveries',        value: '12',                     accent: '#3E8F8B' },
          { icon: Clock,       label: lang==='fr'?'En ligne':'Online',           value: '4h 12',                  accent: '#1976D2' },
          { icon: Star,        label: lang==='fr'?'Note':'Rating',               value: DRIVER.rating,            accent: '#F5C7A1' },
        ].map((m,i)=>(
          <div key={i} className="bg-white rounded-2xl border border-[#E8E0D0] p-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${m.accent}20`, color: m.accent }}>
              <m.icon className="w-5 h-5" />
            </div>
            <p className="text-xs text-[#5A6F72]">{m.label}</p>
            <p className="font-display text-xl font-bold text-[#1F3B40]">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="relative rounded-2xl overflow-hidden map-bg h-[420px] border border-[#E8E0D0]">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 0 70 Q 30 65 50 55 T 100 20" stroke="#FFFFFF" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.9" />
            <path d="M 10 20 Q 40 30 55 50 T 100 80" stroke="#FFFFFF" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
          </svg>
          <div className="absolute transition-all duration-700" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%,-50%)' }}>
            <div className="w-12 h-12 rounded-full bg-[#3E8F8B] shadow-lg flex items-center justify-center ping-soft">
              <Bike className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-xl p-3 shadow inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            <span className="text-xs font-semibold">{lang==='fr' ? 'Assurance MAIF Pro active' : 'MAIF Pro insurance active'}</span>
          </div>
          {active && (
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-xl">
              <p className="text-[11px] text-[#5A6F72]">{lang==='fr'?'Course active':'Active delivery'}</p>
              <div className="flex items-center gap-3 mt-1">
                <Navigation2 className="w-5 h-5 text-[#3E8F8B]" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{active.pickup} → {active.dropoff}</p>
                  <p className="text-xs text-[#5A6F72]">{active.distance_km} km · {active.time_min} min · {active.payout.toFixed(2)} €</p>
                </div>
                <button onClick={complete} className="h-9 px-4 rounded-full bg-[#2E7D32] text-white text-xs font-semibold">
                  {lang==='fr'?'Livré':'Delivered'}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-3">
          <h3 className="font-display font-bold text-[#1F3B40]">{lang==='fr'?'Courses disponibles':'Available jobs'}</h3>
          {jobs.length === 0 && !active && (
            <div className="bg-white rounded-2xl border border-[#E8E0D0] p-5 text-sm text-[#5A6F72] text-center">
              {lang==='fr'?'Aucune course pour le moment.':'No jobs at the moment.'}
            </div>
          )}
          {jobs.map(j => (
            <div key={j.id} className="bg-white rounded-2xl border border-[#E8E0D0] p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-[#5A6F72]">{j.id}</p>
                <p className="font-display font-bold text-[#2E7D32]">{j.payout.toFixed(2)} €</p>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-semibold inline-flex items-center gap-1"><MapPin className="w-4 h-4 text-[#3E8F8B]" /> {j.pickup}</p>
                <p className="text-sm text-[#5A6F72] inline-flex items-center gap-1"><MapPin className="w-4 h-4 text-[#1F3B40]" /> {j.dropoff}</p>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-[#5A6F72]">
                <span className="inline-flex items-center gap-1"><Bike className="w-3.5 h-3.5" /> {j.distance_km} km</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {j.time_min} min</span>
              </div>
              <button onClick={()=>accept(j)} className="w-full mt-3 h-10 rounded-full bg-[#3E8F8B] hover:bg-[#2F7A78] text-white font-semibold text-sm">
                {t('common.accept')}
              </button>
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
};

export default DriverDashboard;
