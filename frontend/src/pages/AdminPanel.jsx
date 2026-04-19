import React, { useState } from 'react';
import { LayoutDashboard, Store, Bike, Users, Settings, ShieldCheck, TrendingUp, Euro, ListOrdered, Star, Percent, Search, MoreHorizontal, Check, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ADMIN_METRICS, ADMIN_RESTAURANTS_PENDING, RESTAURANTS } from '../mock/mock';

const AdminPanel = () => {
  const { t, lang } = useApp();
  const [tab, setTab] = useState('dashboard');
  const [pending, setPending] = useState(ADMIN_RESTAURANTS_PENDING);
  const approve = (id) => setPending(p => p.filter(x => x.id !== id));

  const metrics = [
    { icon: Euro,        label: lang==='fr'?'GMV jour':'GMV today',             value: `${ADMIN_METRICS.gmv_today.toFixed(2)} €`, accent: '#2E7D32' },
    { icon: ListOrdered, label: lang==='fr'?'Commandes':'Orders',                value: ADMIN_METRICS.orders_today,              accent: '#FF6A35' },
    { icon: Store,       label: lang==='fr'?'Restaurants':'Restaurants',         value: ADMIN_METRICS.active_restaurants,        accent: '#1976D2' },
    { icon: Bike,        label: lang==='fr'?'Livreurs':'Couriers',               value: ADMIN_METRICS.active_drivers,            accent: '#FFB347' },
    { icon: Star,        label: lang==='fr'?'Note moy.':'Avg rating',            value: ADMIN_METRICS.avg_rating,                accent: '#8B5A2B' },
    { icon: Percent,     label: lang==='fr'?'Commission':'Commission',           value: `${ADMIN_METRICS.commission_today.toFixed(2)} €`, accent: '#2E7D32' },
  ];

  const tabs = [
    { id: 'dashboard',   icon: LayoutDashboard, label: lang==='fr'?'Tableau de bord':'Dashboard' },
    { id: 'restaurants', icon: Store,           label: lang==='fr'?'Restaurants':'Restaurants' },
    { id: 'drivers',     icon: Bike,            label: lang==='fr'?'Livreurs':'Couriers' },
    { id: 'customers',   icon: Users,           label: lang==='fr'?'Clients':'Customers' },
    { id: 'settings',    icon: Settings,        label: lang==='fr'?'Réglages':'Settings' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-[#6B6259] mb-1"><ShieldCheck className="w-4 h-4" /> {t('dash.admin')}</div>
      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#1F1B16] mb-6">CLIGOO Admin</h1>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <aside className="bg-white rounded-2xl border border-[#F1E6D6] p-3 h-fit sticky top-20">
          <nav className="space-y-1">
            {tabs.map(tb => (
              <button key={tb.id} onClick={()=>setTab(tb.id)}
                className={`w-full text-left inline-flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${tab===tb.id ? 'bg-[#FF6A35] text-white' : 'text-[#1F1B16] hover:bg-[#FFF4E8]'}`}>
                <tb.icon className="w-4 h-4" /> {tb.label}
              </button>
            ))}
          </nav>
        </aside>

        <section>
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {metrics.map((m,i)=>(
                  <div key={i} className="bg-white rounded-2xl border border-[#F1E6D6] p-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${m.accent}20`, color: m.accent }}>
                      <m.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-[#6B6259]">{m.label}</p>
                    <p className="font-display text-xl font-bold text-[#1F1B16]">{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-[#F1E6D6] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold">{lang==='fr'?'Volume commandes · 7 derniers jours':'Orders volume · last 7 days'}</h3>
                  <TrendingUp className="w-5 h-5 text-[#2E7D32]" />
                </div>
                <div className="h-48 flex items-end gap-3">
                  {[38, 52, 44, 63, 71, 58, 82].map((h,i)=>(
                    <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-2">
                      <div className="w-full rounded-t-lg bg-gradient-to-t from-[#FF6A35] to-[#FFB347] min-h-4" style={{ height: `${h}%` }} />
                      <span className="text-[10px] text-[#6B6259]">{['L','M','M','J','V','S','D'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#F1E6D6] p-5">
                <h3 className="font-display font-bold mb-3">{lang==='fr'?'Restaurants en attente de validation':'Pending restaurants'}</h3>
                <div className="divide-y divide-[#F1E6D6]">
                  {pending.map(p => (
                    <div key={p.id} className="py-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FFF4E8] flex items-center justify-center"><Store className="w-5 h-5 text-[#FF6A35]" /></div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{p.name}</p>
                        <p className="text-xs text-[#6B6259]">{p.owner} · {p.city} · {lang==='fr'?'Cert.':'Cert.'} {p.cert}</p>
                      </div>
                      <button onClick={()=>approve(p.id)} className="h-9 px-3 rounded-full bg-[#2E7D32] text-white text-xs font-semibold inline-flex items-center gap-1"><Check className="w-4 h-4" /> {lang==='fr'?'Approuver':'Approve'}</button>
                      <button onClick={()=>approve(p.id)} className="h-9 px-3 rounded-full bg-[#FFF4E8] text-[#1F1B16] text-xs font-semibold inline-flex items-center gap-1"><X className="w-4 h-4" /> {lang==='fr'?'Rejeter':'Reject'}</button>
                    </div>
                  ))}
                  {pending.length === 0 && <p className="text-sm text-[#6B6259] py-3">{lang==='fr'?'Aucune demande en attente.':'No pending requests.'}</p>}
                </div>
              </div>
            </div>
          )}

          {tab === 'restaurants' && (
            <div className="bg-white rounded-2xl border border-[#F1E6D6] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F1E6D6] flex items-center gap-3">
                <div className="flex-1 bg-[#FFF4E8] rounded-full h-10 px-4 flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#6B6259]" />
                  <input placeholder={lang==='fr'?'Rechercher...':'Search...'} className="flex-1 bg-transparent outline-none text-sm" />
                </div>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-[#FFF8F1] text-[#6B6259]">
                  <tr>
                    <th className="text-left p-3 font-semibold">{lang==='fr'?'Nom':'Name'}</th>
                    <th className="text-left p-3 font-semibold">Cert.</th>
                    <th className="text-left p-3 font-semibold">{lang==='fr'?'Note':'Rating'}</th>
                    <th className="text-left p-3 font-semibold">{lang==='fr'?'Commission':'Commission'}</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1E6D6]">
                  {RESTAURANTS.map(r => (
                    <tr key={r.id}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img src={r.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <span className="font-semibold">{r.name}</span>
                        </div>
                      </td>
                      <td className="p-3"><span className="px-2 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-semibold">{r.certification}</span></td>
                      <td className="p-3">{r.rating}</td>
                      <td className="p-3">30%</td>
                      <td className="p-3"><span className="text-[#2E7D32] font-semibold">{t('common.online')}</span></td>
                      <td className="p-3 text-right"><MoreHorizontal className="w-4 h-4 text-[#6B6259] ml-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'drivers' && (
            <div className="bg-white rounded-2xl border border-[#F1E6D6] p-5">
              <h3 className="font-display font-bold mb-3">{lang==='fr'?'Livreurs actifs':'Active couriers'}</h3>
              <p className="text-sm text-[#6B6259]">{ADMIN_METRICS.active_drivers} {lang==='fr'?'livreurs en ligne':'online couriers'}. {lang==='fr'?'Tous couverts par assurance MAIF Pro.':'All covered by MAIF Pro insurance.'}</p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {['Karim B.','Sarah L.','Mohamed A.','Ines K.'].map((n,i)=>(
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#FFF4E8]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6A35] to-[#FFB347] text-white flex items-center justify-center font-bold">{n[0]}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{n}</p>
                      <p className="text-xs text-[#6B6259]">4.{8-i} ★ · {120-i*15} {lang==='fr'?'courses':'deliveries'}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#2E7D32]">{t('common.online')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'customers' && (
            <div className="bg-white rounded-2xl border border-[#F1E6D6] p-8 text-center">
              <Users className="w-10 h-10 mx-auto text-[#FF6A35] mb-3" />
              <h3 className="font-display font-bold">2 184 {lang==='fr'?'clients actifs':'active customers'}</h3>
              <p className="text-sm text-[#6B6259] mt-1">{lang==='fr'?'Gestion complète disponible dans la V2.':'Full management in V2.'}</p>
            </div>
          )}

          {tab === 'settings' && (
            <div className="bg-white rounded-2xl border border-[#F1E6D6] p-6 space-y-4">
              <h3 className="font-display font-bold">{lang==='fr'?'Commissions plateforme':'Platform commissions'}</h3>
              {[
                { k: lang==='fr'?'Commission restaurant':'Restaurant commission', v: '30%' },
                { k: lang==='fr'?'Frais de service client':'Customer service fee',   v: '10%' },
                { k: lang==='fr'?'Frais livreur base':'Base courier fee',            v: '2,50 €' },
                { k: lang==='fr'?'Par km livreur':'Per km courier',                    v: '1,10 €' },
              ].map((r,i)=>(
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#F1E6D6] last:border-0">
                  <span className="text-sm text-[#1F1B16]">{r.k}</span>
                  <span className="text-sm font-semibold">{r.v}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminPanel;
