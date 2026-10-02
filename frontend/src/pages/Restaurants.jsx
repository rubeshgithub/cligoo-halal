import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, MapPin, Search, X } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { useApp } from '../contexts/AppContext';
import { restaurantApi } from '../lib/api';

const Restaurants = () => {
  const { t, lang, address } = useApp();
  const [params, setParams] = useSearchParams();
  const [cat, setCat] = useState(params.get('cat') || 'all');
  const [sort, setSort] = useState('recommended');
  const [maxDelivery, setMaxDelivery] = useState(60);
  const [priceLevels, setPriceLevels] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [search, setSearch] = useState('');
  const [cats, setCats] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ restaurantApi.categories().then(setCats).catch(()=>{}); }, []);

  useEffect(()=>{
    const c = params.get('cat');
    if (c) setCat(c);
  }, [params]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (cat && cat !== 'all') params.cat = cat;
    if (sort) params.sort = sort;
    if (maxDelivery < 60) params.max_delivery = maxDelivery;
    if (minRating > 0) params.min_rating = minRating;
    restaurantApi.list(params)
      .then(setList)
      .catch(()=>setList([]))
      .finally(()=>setLoading(false));
  }, [cat, sort, maxDelivery, minRating]);

  const togglePrice = (p) => setPriceLevels(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev, p]);

  const filtered = useMemo(() => {
    return list.filter(r => {
      if (priceLevels.length && !priceLevels.includes(r.price_level)) return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [list, priceLevels, search]);

  const clearAll = () => {
    setCat('all'); setSort('recommended'); setMaxDelivery(60);
    setPriceLevels([]); setMinRating(0); setSearch('');
    setParams({});
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>{address || 'Paris, France'}</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mt-2">
          {t('restos.title')}
        </h1>
        <p className="text-ink-soft mt-1">{filtered.length} {t('restos.results')}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        <button onClick={()=>setCat('all')}
          className={`shrink-0 px-4 h-10 rounded-full text-sm font-semibold border ${cat==='all' ? 'bg-ink text-white border-ink' : 'bg-white text-ink border-clay hover:border-emerald-700'}`}>
          {lang==='fr' ? 'Tout' : 'All'}
        </button>
        {cats.map(c => (
          <button key={c.id} onClick={()=>setCat(c.id)}
            className={`shrink-0 inline-flex items-center gap-2 pl-1 pr-4 h-10 rounded-full text-sm font-semibold border ${cat===c.id ? 'bg-ink text-white border-ink' : 'bg-white text-ink border-clay hover:border-emerald-700'}`}>
            <img src={c.image} alt="" className="w-8 h-8 rounded-full object-cover" />
            {lang==='fr' ? c.name_fr : c.name_en}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="bg-white rounded-2xl border border-clay p-5 h-fit sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 font-display font-bold text-ink">
              <SlidersHorizontal className="w-4 h-4" /> {t('filter.sort')}
            </div>
            <button onClick={clearAll} className="text-xs text-emerald-700 hover:underline">{t('filter.clear')}</button>
          </div>

          <div className="space-y-2 mb-5">
            {[
              ['recommended', t('sort.recommended')],
              ['rating',      t('sort.rating')],
              ['delivery',    t('sort.delivery')],
              ['priceAsc',    t('sort.priceAsc')],
            ].map(([k,label]) => (
              <label key={k} className="flex items-center gap-3 cursor-pointer text-sm">
                <input type="radio" name="sort" checked={sort===k} onChange={()=>setSort(k)} className="accent-emerald-700" />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="mb-5">
            <p className="font-semibold text-sm mb-2">{t('filter.delivery')}</p>
            <input type="range" min="15" max="60" step="5" value={maxDelivery}
              onChange={(e)=>setMaxDelivery(+e.target.value)}
              className="w-full accent-emerald-700" />
            <div className="text-xs text-ink-soft mt-1">≤ {maxDelivery} {t('common.minutes')}</div>
          </div>

          <div className="mb-5">
            <p className="font-semibold text-sm mb-2">{t('filter.price')}</p>
            <div className="flex gap-2">
              {[1,2,3].map(p => (
                <button key={p} onClick={()=>togglePrice(p)}
                  className={`h-9 px-3 rounded-full text-sm font-semibold border ${priceLevels.includes(p) ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white border-clay hover:border-emerald-700'}`}>
                  {'€'.repeat(p)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm mb-2">{t('filter.rating')}</p>
            <div className="flex gap-2">
              {[0, 4.0, 4.5, 4.8].map(rt => (
                <button key={rt} onClick={()=>setMinRating(rt)}
                  className={`h-9 px-3 rounded-full text-sm font-semibold border ${minRating===rt ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white border-clay hover:border-emerald-700'}`}>
                  {rt === 0 ? (lang==='fr' ? 'Tout' : 'Any') : `${rt}+`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section>
          <div className="bg-white rounded-full border border-clay focus-within:border-emerald-700 h-12 px-4 flex items-center gap-2 mb-5">
            <Search className="w-4 h-4 text-ink-soft" />
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={lang==='fr' ? 'Rechercher un restaurant...' : 'Search restaurants...'}
              className="flex-1 outline-none text-sm" />
            {search && (
              <button onClick={()=>setSearch('')} className="text-ink-soft hover:text-emerald-700"><X className="w-4 h-4" /></button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-[16/10] bg-white rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-clay">
              <p className="text-ink-soft">{lang==='fr' ? 'Aucun restaurant ne correspond à vos filtres.' : 'No restaurant matches your filters.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(r => <RestaurantCard key={r.id} r={r} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Restaurants;
