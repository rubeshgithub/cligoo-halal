import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Mail, Phone, CreditCard, Bell, Heart, Repeat, ChevronRight, Home as HomeIcon, Building2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { orderApi } from '../lib/api';

const Account = () => {
  const { t, lang, user, authLoading } = useApp();
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { nav('/login'); return; }
    orderApi.list()
      .then(setOrders)
      .catch(()=>setOrders([]))
      .finally(()=>setLoading(false));
  }, [authLoading, user, nav]);

  if (authLoading || !user) return <main className="max-w-6xl mx-auto px-4 py-20 text-center text-ink-soft">…</main>;
  const name = user.name || 'Sofia';

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        {user.picture ? (
          <img src={user.picture} alt="" className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-saffron-400 text-ink flex items-center justify-center font-display text-2xl font-bold">
            {name[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">{name}</h1>
          <p className="text-sm text-ink-soft">{user.email} · <span className="text-emerald-700 font-semibold">{user.auth_provider}</span></p>
        </div>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="bg-white border border-clay rounded-full p-1 h-auto flex-wrap">
          <TabsTrigger value="orders"   className="rounded-full px-4 py-2 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">{t('account.orders')}</TabsTrigger>
          <TabsTrigger value="personal" className="rounded-full px-4 py-2 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">{t('account.personal')}</TabsTrigger>
          <TabsTrigger value="addresses" className="rounded-full px-4 py-2 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">{t('account.addresses')}</TabsTrigger>
          <TabsTrigger value="payments" className="rounded-full px-4 py-2 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">{t('account.payments')}</TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-full px-4 py-2 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">{t('account.preferences')}</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          {loading ? (
            <p className="text-sm text-ink-soft">Chargement…</p>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-clay p-8 text-center">
              <p className="text-sm text-ink-soft">{lang==='fr' ? "Vous n'avez pas encore de commande." : 'No orders yet.'}</p>
              <Link to="/restaurants" className="inline-block mt-4 h-10 px-5 leading-10 rounded-full bg-emerald-700 text-white font-semibold text-sm">
                {lang==='fr' ? 'Découvrir les restaurants' : 'Browse restaurants'}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(o => (
                <div key={o.id} className="bg-white rounded-2xl border border-clay p-4 flex items-center gap-4">
                  <img src={o.restaurant_image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-ink">{o.restaurant_name}</p>
                    <p className="text-xs text-ink-soft">
                      {new Date(o.created_at).toLocaleDateString()} · {o.items.length} {t('cart.items')} · {o.total.toFixed(2)} €
                    </p>
                    <span className={`inline-flex items-center gap-1 mt-1 text-[11px] font-semibold ${o.status === 'delivered' ? 'text-emerald-700' : 'text-emerald-700'}`}>
                      • {t(`track.status.${o.status}`)}
                    </span>
                  </div>
                  <Link to={`/order/${o.id}`} className="h-10 px-4 rounded-full bg-saffron-50 text-ink text-sm font-semibold inline-flex items-center gap-1 hover:bg-saffron-100">
                    <Repeat className="w-4 h-4" /> {t('track.title')}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="personal" className="mt-6">
          <div className="bg-white rounded-2xl border border-clay p-6 max-w-2xl space-y-4">
            {[
              { icon: Mail,  label: 'Email', value: user.email },
              { icon: Phone, label: lang==='fr' ? 'Téléphone' : 'Phone', value: '+33 6 12 34 56 78' },
            ].map((f,i) => (
              <div key={i} className="flex items-center gap-3 justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-saffron-50 flex items-center justify-center"><f.icon className="w-5 h-5 text-emerald-700" /></div>
                  <div>
                    <p className="text-xs text-ink-soft">{f.label}</p>
                    <p className="font-semibold text-sm text-ink">{f.value}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-mist" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="addresses" className="mt-6">
          <div className="grid sm:grid-cols-2 gap-3 max-w-3xl">
            {[
              { icon: HomeIcon, title: lang==='fr'?'Domicile':'Home',    addr: '10 Rue de Rivoli, 75001 Paris' },
              { icon: Building2, title: lang==='fr'?'Bureau':'Office',    addr: '5 Bd Haussmann, 75009 Paris' },
            ].map((a,i)=>(
              <div key={i} className="bg-white rounded-2xl border border-clay p-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-saffron-50 flex items-center justify-center"><a.icon className="w-5 h-5 text-emerald-700" /></div>
                <div>
                  <p className="font-semibold text-sm">{a.title}</p>
                  <p className="text-xs text-ink-soft">{a.addr}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <div className="bg-white rounded-2xl border border-clay p-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 rounded bg-ink flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
              <div className="flex-1">
                <p className="font-semibold text-sm">•••• •••• •••• 4242</p>
                <p className="text-xs text-ink-soft">{lang==='fr' ? 'Expire 08/28' : 'Expires 08/28'} · Stripe TEST</p>
              </div>
              <CreditCard className="w-5 h-5 text-ink-soft" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <div className="bg-white rounded-2xl border border-clay p-4 max-w-2xl space-y-3">
            {[
              { icon: Bell,  label: lang==='fr' ? 'Notifications push' : 'Push notifications' },
              { icon: Heart, label: lang==='fr' ? 'Favoris' : 'Favorites' },
            ].map((p,i)=>(
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-saffron-50 flex items-center justify-center"><p.icon className="w-5 h-5 text-emerald-700" /></div>
                  <p className="font-semibold text-sm">{p.label}</p>
                </div>
                <div className="w-11 h-6 rounded-full bg-emerald-700 relative">
                  <div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white" />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Account;
