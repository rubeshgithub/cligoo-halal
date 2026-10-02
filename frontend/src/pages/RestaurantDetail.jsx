import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Bike, ShieldCheck, MapPin, Info, Plus, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { restaurantApi } from '../lib/api';

const RestaurantDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { t, lang, addToCart, cart, cartSubtotal, setCartOpen } = useApp();
  const [r, setR] = useState(null);
  const [menu, setMenu] = useState(null);
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([restaurantApi.get(id), restaurantApi.menu(id)])
      .then(([rest, m]) => {
        setR(rest); setMenu(m);
        setActiveSection(m?.sections?.[0]?.id);
      })
      .catch(()=>{ setR(null); })
      .finally(()=>setLoading(false));
  }, [id]);

  const sections = useMemo(() => {
    if (!menu) return [];
    if (!search) return menu.sections;
    return menu.sections.map(s => ({
      ...s,
      items: s.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    })).filter(s => s.items.length);
  }, [menu, search]);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-ink-soft">Chargement...</div>;
  if (!r) return <div className="p-10 text-center">Restaurant not found</div>;

  const cartCount = cart.items.reduce((s,i)=>s+i.qty, 0);

  return (
    <main>
      <section className="relative h-60 md:h-80">
        <img src={r.cover} alt={r.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
        <button onClick={()=>nav(-1)} className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow">
          <ArrowLeft className="w-4 h-4" />
        </button>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 relative">
        <div className="bg-white rounded-2xl border border-clay p-6 md:p-8 shadow-[0_10px_40px_-16px_rgba(31,27,22,0.18)]">
          <div className="flex flex-wrap items-start gap-4 justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-700 text-[11px] font-semibold text-white mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Halal · {r.certification}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">{r.name}</h1>
              <p className="text-ink-soft mt-1">{lang==='fr' ? r.description_fr : r.description_en}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-ink">
                <span className="inline-flex items-center gap-1 font-semibold"><Star className="w-4 h-4 fill-saffron-400 text-saffron-400" /> {r.rating} <span className="text-ink-soft font-normal">({r.reviews})</span></span>
                <span className="inline-flex items-center gap-1 text-ink-soft"><Clock className="w-4 h-4" /> {r.delivery_min}–{r.delivery_max} min</span>
                <span className="inline-flex items-center gap-1 text-ink-soft"><Bike className="w-4 h-4" /> {r.delivery_fee.toFixed(2)} €</span>
                <span className="inline-flex items-center gap-1 text-ink-soft"><MapPin className="w-4 h-4" /> {r.address}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-saffron-50 rounded-xl p-3 flex items-start gap-3 text-sm text-ink-soft">
            <Info className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <span>{lang==='fr' ? `Commande minimum : ${r.min_order.toFixed(2)} €. Paiement sécurisé Stripe Connect.` : `Minimum order: ${r.min_order.toFixed(2)} €. Secure payment via Stripe Connect.`}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-8 grid md:grid-cols-[220px_1fr] gap-8 pb-24">
        <aside className="hidden md:block">
          <div className="sticky top-20 space-y-1">
            {menu?.sections?.map(s => (
              <a key={s.id} href={`#${s.id}`} onClick={()=>setActiveSection(s.id)}
                 className={`block px-3 py-2 rounded-lg text-sm font-medium ${activeSection===s.id ? 'bg-saffron-50 text-emerald-700' : 'text-ink hover:bg-saffron-50'}`}>
                {lang==='fr' ? s.name_fr : s.name_en}
              </a>
            ))}
          </div>
        </aside>

        <section>
          <div className="bg-white rounded-full border border-clay focus-within:border-emerald-700 h-11 px-4 flex items-center gap-2 mb-6">
            <Search className="w-4 h-4 text-ink-soft" />
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={t('menu.search')} className="flex-1 outline-none text-sm" />
          </div>

          {sections.map(s => (
            <div key={s.id} id={s.id} className="mb-10">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">{lang==='fr' ? s.name_fr : s.name_en}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {s.items.map(item => (
                  <button key={item.id} onClick={()=>addToCart(r.id, item)}
                    className="group text-left flex gap-3 bg-white rounded-2xl border border-clay hover:border-emerald-700 hover:shadow-md transition p-3">
                    <div className="flex-1 min-w-0 py-1">
                      <p className="font-semibold text-[15px] text-ink">{item.name}</p>
                      <p className="text-xs text-ink-soft mt-1 line-clamp-2">{lang==='fr' ? item.desc_fr : item.desc_en}</p>
                      <p className="mt-2 text-sm font-bold text-ink">{item.price.toFixed(2)} €</p>
                    </div>
                    <div className="relative w-24 h-28 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full arch object-cover" />
                      <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-clay group-hover:bg-saffron-400 group-hover:border-saffron-400 flex items-center justify-center shadow">
                        <Plus className="w-4 h-4 text-ink" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[360px] z-40">
          <button onClick={()=>setCartOpen(true)}
            className="w-full h-14 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center justify-between px-5 shadow-2xl">
            <span>{cartCount} {t('cart.items')}</span>
            <span>{t('cart.checkout')}</span>
            <span>{cartSubtotal.toFixed(2)} €</span>
          </button>
        </div>
      )}
    </main>
  );
};

export default RestaurantDetail;
