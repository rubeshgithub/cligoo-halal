import React, { useState } from 'react';
import { Store, Clock, CheckCircle2, XCircle, Printer, TrendingUp, Euro, ListOrdered, ChefHat, PackageCheck } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { INCOMING_ORDERS, RESTAURANTS } from '../mock/mock';

const STATUS_COLORS = {
  new:       { bg: '#FFF2E6', fg: '#3E8F8B', label_fr: 'Nouvelle',     label_en: 'New' },
  preparing: { bg: '#E3F2FD', fg: '#1976D2', label_fr: 'En préparation', label_en: 'Preparing' },
  ready:     { bg: '#E8F5E9', fg: '#2E7D32', label_fr: 'Prête',        label_en: 'Ready' },
};

const RestaurantDashboard = () => {
  const { t, lang } = useApp();
  const [orders, setOrders] = useState(INCOMING_ORDERS);
  const [online, setOnline] = useState(true);
  const resto = RESTAURANTS[0];

  const updateStatus = (id, status) => {
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
  };
  const reject = (id) => setOrders(os => os.filter(o => o.id !== id));

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-sm text-[#5A6F72]"><Store className="w-4 h-4" /> {t('dash.restaurant')}</div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#1F3B40]">{resto.name}</h1>
        </div>
        <button onClick={()=>setOnline(v=>!v)}
          className={`h-11 px-5 rounded-full font-semibold text-sm ${online ? 'bg-[#2E7D32] text-white' : 'bg-[#E8E0D0] text-[#5A6F72]'}`}>
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${online ? 'bg-white' : 'bg-[#A8BCBE]'}`} />
          {online ? t('common.online') : t('common.offline')}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: ListOrdered, label: t('common.today'),   value: '24', accent: '#3E8F8B' },
          { icon: Euro,        label: lang==='fr'?'Ventes':'Sales', value: '612,40 €', accent: '#2E7D32' },
          { icon: Clock,       label: lang==='fr'?'Temps moyen':'Avg time', value: '18 min', accent: '#1976D2' },
          { icon: TrendingUp,  label: lang==='fr'?'Taux accept.':'Accept rate', value: '96%', accent: '#F5C7A1' },
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

      <div className="bg-white rounded-2xl border border-[#E8E0D0] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E0D0]">
          <h3 className="font-display font-bold text-[#1F3B40]">{lang==='fr' ? 'Commandes en temps réel' : 'Live orders'}</h3>
          <button className="h-9 px-3 rounded-full bg-[#FFF2E6] text-[#1F3B40] text-xs font-semibold inline-flex items-center gap-1">
            <Printer className="w-4 h-4" /> {lang==='fr'?'Imprimante':'Printer'} POS
          </button>
        </div>
        <div className="divide-y divide-[#E8E0D0]">
          {orders.map(o => {
            const c = STATUS_COLORS[o.status];
            return (
              <div key={o.id} className="px-5 py-4 flex flex-wrap items-center gap-4">
                <div className="min-w-[90px]">
                  <p className="font-mono text-sm font-bold text-[#1F3B40]">{o.id}</p>
                  <p className="text-xs text-[#5A6F72]">{o.eta} {t('common.minutes')}</p>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <p className="font-semibold text-sm">{o.customer}</p>
                  <p className="text-xs text-[#5A6F72]">{o.items} {t('cart.items')} · {o.total.toFixed(2)} €</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: c.bg, color: c.fg }}>
                  {lang==='fr' ? c.label_fr : c.label_en}
                </span>
                <div className="flex gap-2 ml-auto">
                  {o.status === 'new' && (
                    <>
                      <button onClick={()=>updateStatus(o.id, 'preparing')} className="h-9 px-3 rounded-full bg-[#3E8F8B] text-white text-xs font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> {t('common.accept')}
                      </button>
                      <button onClick={()=>reject(o.id)} className="h-9 px-3 rounded-full bg-[#FFF2E6] text-[#1F3B40] text-xs font-semibold inline-flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {t('common.reject')}
                      </button>
                    </>
                  )}
                  {o.status === 'preparing' && (
                    <button onClick={()=>updateStatus(o.id, 'ready')} className="h-9 px-3 rounded-full bg-[#2E7D32] text-white text-xs font-semibold inline-flex items-center gap-1">
                      <ChefHat className="w-4 h-4" /> {lang==='fr'?'Marquer prête':'Mark ready'}
                    </button>
                  )}
                  {o.status === 'ready' && (
                    <button onClick={()=>reject(o.id)} className="h-9 px-3 rounded-full bg-[#1F3B40] text-white text-xs font-semibold inline-flex items-center gap-1">
                      <PackageCheck className="w-4 h-4" /> {lang==='fr'?'Remise au livreur':'Handed to courier'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {orders.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-[#5A6F72]">{lang==='fr'?'Aucune commande en cours.':'No active orders.'}</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default RestaurantDashboard;
