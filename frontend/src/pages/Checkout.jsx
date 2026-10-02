import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Wallet, MapPin, MessageSquare, ShieldCheck, Bike, Store, Building2, LogIn } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { restaurantApi, orderApi } from '../lib/api';

const Checkout = () => {
  const { t, lang, cart, cartSubtotal, clearCart, address, user, authLoading } = useApp();
  const nav = useNavigate();
  const [resto, setResto] = useState(null);
  const [payment, setPayment] = useState('card');
  const [tip, setTip] = useState(2);
  const [instructions, setInstructions] = useState('');
  const [placing, setPlacing] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (cart.restaurantId) {
      restaurantApi.get(cart.restaurantId).then(setResto).catch(()=>setResto(null));
    }
  }, [cart.restaurantId]);

  if (!cart.items.length) {
    return <main className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-ink-soft">{t('cart.empty')}</p>
    </main>;
  }

  if (!resto) {
    return <main className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-ink-soft">Chargement...</p>
    </main>;
  }

  const deliveryFee = resto.delivery_fee;
  const serviceFee = +(cartSubtotal * 0.10).toFixed(2);
  const total = +(cartSubtotal + deliveryFee + serviceFee + tip).toFixed(2);
  const platformFee = +(cartSubtotal * 0.30 + serviceFee).toFixed(2);
  const restaurantPayout = +(cartSubtotal - cartSubtotal * 0.30).toFixed(2);
  const driverPayout = +(deliveryFee + tip).toFixed(2);

  const place = async () => {
    if (!user) { nav('/login'); return; }
    setPlacing(true); setErr('');
    try {
      const payload = {
        restaurant_id: resto.id,
        items: cart.items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image })),
        address: address || '10 Rue de Rivoli, 75001 Paris',
        instructions,
        payment_method: payment,
        tip,
      };
      const order = await orderApi.create(payload);
      localStorage.setItem('cligoo_last_order', JSON.stringify(order));
      clearCart();
      nav(`/order/${order.id}`);
    } catch (e) {
      setErr(e?.response?.data?.detail || (lang==='fr' ? 'Erreur lors de la commande' : 'Order failed'));
    } finally { setPlacing(false); }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <h1 className="font-display text-3xl font-bold text-ink mb-6">{t('checkout.title')}</h1>

      {!authLoading && !user && (
        <div className="mb-6 bg-saffron-50 border border-saffron-200 rounded-2xl p-4 flex items-center gap-3">
          <LogIn className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="text-sm flex-1">
            {lang==='fr' ? 'Connectez-vous pour finaliser votre commande.' : 'Log in to place your order.'}
          </p>
          <button onClick={()=>nav('/login')} className="h-9 px-4 rounded-full bg-emerald-700 text-white text-sm font-semibold">
            {t('nav.login')}
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-clay p-5">
            <h3 className="font-display font-bold flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-emerald-700" /> {t('checkout.address')}</h3>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-saffron-50">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center"><Building2 className="w-5 h-5 text-emerald-700" /></div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{user?.name || 'Sofia'} · Domicile</p>
                <p className="text-sm text-ink-soft">{address || '10 Rue de Rivoli, 75001 Paris'}</p>
              </div>
              <button className="text-xs font-semibold text-emerald-700">{lang==='fr' ? 'Modifier' : 'Edit'}</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-clay p-5">
            <h3 className="font-display font-bold flex items-center gap-2 mb-3"><MessageSquare className="w-4 h-4 text-emerald-700" /> {t('checkout.instructions')}</h3>
            <textarea value={instructions} onChange={e=>setInstructions(e.target.value)}
              rows={2}
              placeholder={lang==='fr' ? 'Ex. Code porte : 4567B, 3ème étage' : 'E.g. Door code 4567B, 3rd floor'}
              className="w-full rounded-xl border border-clay focus:border-emerald-700 outline-none p-3 text-sm" />
          </div>

          <div className="bg-white rounded-2xl border border-clay p-5">
            <h3 className="font-display font-bold flex items-center gap-2 mb-3"><CreditCard className="w-4 h-4 text-emerald-700" /> {t('checkout.payment')}</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { id: 'card',    icon: CreditCard, label: t('checkout.card') },
                { id: 'paypal',  icon: Wallet,     label: t('checkout.paypal') },
                { id: 'applepay',icon: Smartphone, label: t('checkout.applepay') },
              ].map(p => (
                <button key={p.id} onClick={()=>setPayment(p.id)}
                  className={`p-4 rounded-xl border text-left transition ${payment===p.id ? 'border-emerald-700 bg-saffron-50' : 'border-clay hover:border-emerald-700'}`}>
                  <p.icon className="w-5 h-5 mb-2 text-emerald-700" />
                  <p className="font-semibold text-sm">{p.label}</p>
                  <p className="text-xs text-ink-soft mt-0.5">{p.id==='card' ? '•••• 4242' : 'Stripe Connect'}</p>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-ink-soft mt-3 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              {lang==='fr' ? 'Mode TEST Stripe Connect — aucun débit réel. Intégration en production dès réception de vos clés API.' : 'Stripe Connect TEST mode — no real charge. Production integration once your API keys are provided.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-clay p-5">
            <h3 className="font-display font-bold flex items-center gap-2 mb-3"><Bike className="w-4 h-4 text-emerald-700" /> {t('checkout.tip')}</h3>
            <div className="flex flex-wrap gap-2">
              {[0,1,2,3,5].map(tv => (
                <button key={tv} onClick={()=>setTip(tv)}
                  className={`h-11 px-4 rounded-full text-sm font-semibold border ${tip===tv ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white border-clay hover:border-emerald-700'}`}>
                  {tv === 0 ? (lang==='fr' ? 'Aucun' : 'None') : `${tv.toFixed(2)} €`}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-ink zellige-light text-white rounded-2xl p-5">
            <h3 className="font-display font-bold flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4" /> {t('checkout.split.title')} <span className="ml-2 px-2 py-0.5 rounded-full bg-saffron-400 text-ink text-[10px] font-bold">TEST MODE</span>
            </h3>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 text-white/70"><Store className="w-4 h-4" /> {t('checkout.split.restaurant')}</div>
                <p className="font-display text-xl font-bold mt-1">{restaurantPayout.toFixed(2)} €</p>
                <p className="text-[10px] text-white/50 mt-1">acct_test_{resto.id}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 text-white/70"><Bike className="w-4 h-4" /> {t('checkout.split.driver')}</div>
                <p className="font-display text-xl font-bold mt-1">{driverPayout.toFixed(2)} €</p>
                <p className="text-[10px] text-white/50 mt-1">acct_test_driver_001</p>
              </div>
              <div className="bg-emerald-700/20 border border-emerald-700/40 rounded-xl p-3">
                <div className="flex items-center gap-2 text-saffron-400"><Building2 className="w-4 h-4" /> {t('checkout.split.platform')}</div>
                <p className="font-display text-xl font-bold mt-1">{platformFee.toFixed(2)} €</p>
                <p className="text-[10px] text-white/50 mt-1">CLIGOO</p>
              </div>
            </div>
          </div>
        </div>

        <aside>
          <div className="bg-white rounded-2xl border border-clay p-5 sticky top-20">
            <h3 className="font-display font-bold mb-4">{t('checkout.summary')}</h3>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-clay">
              <img src={resto.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
              <div>
                <p className="font-semibold text-sm">{resto.name}</p>
                <p className="text-xs text-ink-soft">{resto.delivery_min}–{resto.delivery_max} min</p>
              </div>
            </div>
            <div className="space-y-2 text-sm max-h-56 overflow-auto pr-1">
              {cart.items.map(i => (
                <div key={i.id} className="flex justify-between">
                  <span className="text-ink">{i.qty}× {i.name}</span>
                  <span className="text-ink">{(i.qty*i.price).toFixed(2)} €</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-clay space-y-1.5 text-sm">
              <div className="flex justify-between text-ink-soft"><span>{t('cart.subtotal')}</span><span>{cartSubtotal.toFixed(2)} €</span></div>
              <div className="flex justify-between text-ink-soft"><span>{t('cart.delivery')}</span><span>{deliveryFee.toFixed(2)} €</span></div>
              <div className="flex justify-between text-ink-soft"><span>{t('cart.service')}</span><span>{serviceFee.toFixed(2)} €</span></div>
              {tip > 0 && <div className="flex justify-between text-ink-soft"><span>{t('checkout.tip')}</span><span>{tip.toFixed(2)} €</span></div>}
              <div className="flex justify-between text-base font-bold text-ink pt-2 border-t border-clay"><span>{t('cart.total')}</span><span>{total.toFixed(2)} €</span></div>
            </div>
            {err && <p className="text-xs text-red-500 mt-2">{err}</p>}
            <button onClick={place} disabled={placing}
              className="w-full h-12 rounded-full bg-saffron-400 hover:bg-saffron-300 disabled:opacity-60 text-ink font-semibold mt-5">
              {placing ? (lang==='fr' ? 'Paiement en cours...' : 'Processing...') : `${t('checkout.place')} · ${total.toFixed(2)} €`}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
