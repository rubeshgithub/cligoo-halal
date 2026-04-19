import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Wallet, MapPin, MessageSquare, ShieldCheck, Bike, Store, Building2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { RESTAURANTS, PRICING } from '../mock/mock';

const Checkout = () => {
  const { t, lang, cart, cartSubtotal, clearCart, address, user } = useApp();
  const nav = useNavigate();
  const resto = RESTAURANTS.find(r => r.id === cart.restaurantId);
  const [payment, setPayment] = useState('card');
  const [tip, setTip] = useState(2);
  const [instructions, setInstructions] = useState('');
  const [placing, setPlacing] = useState(false);

  if (!resto || cart.items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-[#6B6259]">{t('cart.empty')}</p>
      </main>
    );
  }

  const deliveryFee = resto.delivery_fee;
  const serviceFee = +(cartSubtotal * PRICING.service_fee_rate).toFixed(2);
  const total = +(cartSubtotal + deliveryFee + serviceFee + tip).toFixed(2);

  // Stripe Connect split (mock)
  const platformFee = +((cartSubtotal * PRICING.platform_commission) + (serviceFee)).toFixed(2);
  const restaurantPayout = +(cartSubtotal - (cartSubtotal * PRICING.platform_commission)).toFixed(2);
  const driverPayout = +(deliveryFee + tip).toFixed(2);

  const place = async () => {
    setPlacing(true);
    setTimeout(() => {
      const orderId = 'CL-' + Math.floor(100000 + Math.random() * 900000);
      const payload = {
        id: orderId, restaurantId: resto.id, items: cart.items, total,
        subtotal: cartSubtotal, deliveryFee, serviceFee, tip, payment,
        address: address || '10 Rue de Rivoli, 75001 Paris',
        placedAt: Date.now(),
      };
      localStorage.setItem('cligoo_last_order', JSON.stringify(payload));
      clearCart();
      nav(`/order/${orderId}`);
    }, 1200);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <h1 className="font-display text-3xl font-extrabold text-[#1F1B16] mb-6">{t('checkout.title')}</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-5">
          {/* Address */}
          <div className="bg-white rounded-2xl border border-[#F1E6D6] p-5">
            <h3 className="font-display font-bold flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-[#FF6A35]" /> {t('checkout.address')}</h3>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FFF4E8]">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center"><Building2 className="w-5 h-5 text-[#FF6A35]" /></div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{user?.name || 'Sofia'} · Domicile</p>
                <p className="text-sm text-[#6B6259]">{address || '10 Rue de Rivoli, 75001 Paris'}</p>
              </div>
              <button className="text-xs font-semibold text-[#FF6A35]">{lang==='fr' ? 'Modifier' : 'Edit'}</button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl border border-[#F1E6D6] p-5">
            <h3 className="font-display font-bold flex items-center gap-2 mb-3"><MessageSquare className="w-4 h-4 text-[#FF6A35]" /> {t('checkout.instructions')}</h3>
            <textarea value={instructions} onChange={e=>setInstructions(e.target.value)}
              rows={2}
              placeholder={lang==='fr' ? 'Ex. Code porte : 4567B, 3ème étage' : 'E.g. Door code 4567B, 3rd floor'}
              className="w-full rounded-xl border border-[#F1E6D6] focus:border-[#FF6A35] outline-none p-3 text-sm" />
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-[#F1E6D6] p-5">
            <h3 className="font-display font-bold flex items-center gap-2 mb-3"><CreditCard className="w-4 h-4 text-[#FF6A35]" /> {t('checkout.payment')}</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { id: 'card',    icon: CreditCard, label: t('checkout.card') },
                { id: 'paypal',  icon: Wallet,     label: t('checkout.paypal') },
                { id: 'applepay',icon: Smartphone, label: t('checkout.applepay') },
              ].map(p => (
                <button key={p.id} onClick={()=>setPayment(p.id)}
                  className={`p-4 rounded-xl border text-left transition ${payment===p.id ? 'border-[#FF6A35] bg-[#FFF4E8]' : 'border-[#F1E6D6] hover:border-[#FF6A35]'}`}>
                  <p.icon className="w-5 h-5 mb-2 text-[#FF6A35]" />
                  <p className="font-semibold text-sm">{p.label}</p>
                  <p className="text-xs text-[#6B6259] mt-0.5">{p.id==='card' ? '•••• 4242' : 'Stripe Connect'}</p>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#6B6259] mt-3 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
              {lang==='fr' ? 'Paiement mocké pour cette démo. Intégration Stripe Connect réelle dans la phase suivante.' : 'Payment mocked for this demo. Real Stripe Connect integration in the next phase.'}
            </p>
          </div>

          {/* Tip */}
          <div className="bg-white rounded-2xl border border-[#F1E6D6] p-5">
            <h3 className="font-display font-bold flex items-center gap-2 mb-3"><Bike className="w-4 h-4 text-[#FF6A35]" /> {t('checkout.tip')}</h3>
            <div className="flex flex-wrap gap-2">
              {[0,1,2,3,5].map(tv => (
                <button key={tv} onClick={()=>setTip(tv)}
                  className={`h-11 px-4 rounded-full text-sm font-semibold border ${tip===tv ? 'bg-[#FF6A35] text-white border-[#FF6A35]' : 'bg-white border-[#F1E6D6] hover:border-[#FF6A35]'}`}>
                  {tv === 0 ? (lang==='fr' ? 'Aucun' : 'None') : `${tv.toFixed(2)} €`}
                </button>
              ))}
            </div>
          </div>

          {/* Stripe Connect split preview */}
          <div className="bg-gradient-to-br from-[#1F1B16] to-[#2F2A24] text-white rounded-2xl p-5">
            <h3 className="font-display font-bold flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4" /> {t('checkout.split.title')}
            </h3>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 text-white/70"><Store className="w-4 h-4" /> {t('checkout.split.restaurant')}</div>
                <p className="font-display text-xl font-bold mt-1">{restaurantPayout.toFixed(2)} €</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 text-white/70"><Bike className="w-4 h-4" /> {t('checkout.split.driver')}</div>
                <p className="font-display text-xl font-bold mt-1">{driverPayout.toFixed(2)} €</p>
              </div>
              <div className="bg-[#FF6A35]/20 border border-[#FF6A35]/40 rounded-xl p-3">
                <div className="flex items-center gap-2 text-[#FFB347]"><Building2 className="w-4 h-4" /> {t('checkout.split.platform')}</div>
                <p className="font-display text-xl font-bold mt-1">{platformFee.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside>
          <div className="bg-white rounded-2xl border border-[#F1E6D6] p-5 sticky top-20">
            <h3 className="font-display font-bold mb-4">{t('checkout.summary')}</h3>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#F1E6D6]">
              <img src={resto.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
              <div>
                <p className="font-semibold text-sm">{resto.name}</p>
                <p className="text-xs text-[#6B6259]">{resto.delivery_min}–{resto.delivery_max} min</p>
              </div>
            </div>
            <div className="space-y-2 text-sm max-h-56 overflow-auto pr-1">
              {cart.items.map(i => (
                <div key={i.id} className="flex justify-between">
                  <span className="text-[#1F1B16]">{i.qty}× {i.name}</span>
                  <span className="text-[#1F1B16]">{(i.qty*i.price).toFixed(2)} €</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#F1E6D6] space-y-1.5 text-sm">
              <div className="flex justify-between text-[#6B6259]"><span>{t('cart.subtotal')}</span><span>{cartSubtotal.toFixed(2)} €</span></div>
              <div className="flex justify-between text-[#6B6259]"><span>{t('cart.delivery')}</span><span>{deliveryFee.toFixed(2)} €</span></div>
              <div className="flex justify-between text-[#6B6259]"><span>{t('cart.service')}</span><span>{serviceFee.toFixed(2)} €</span></div>
              {tip > 0 && <div className="flex justify-between text-[#6B6259]"><span>{t('checkout.tip')}</span><span>{tip.toFixed(2)} €</span></div>}
              <div className="flex justify-between text-base font-bold text-[#1F1B16] pt-2 border-t border-[#F1E6D6]"><span>{t('cart.total')}</span><span>{total.toFixed(2)} €</span></div>
            </div>
            <button onClick={place} disabled={placing}
              className="w-full h-12 rounded-full bg-[#FF6A35] hover:bg-[#E85A28] disabled:opacity-60 text-white font-semibold mt-5">
              {placing ? (lang==='fr' ? 'Paiement en cours...' : 'Processing...') : `${t('checkout.place')} · ${total.toFixed(2)} €`}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
