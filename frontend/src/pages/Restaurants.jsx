import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, MapPin, Search, X } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { useApp } from '../contexts/AppContext';
import { RESTAURANTS, CATEGORIES } from '../mock/mock';

const Restaurants = () => {
  const { t, lang, address } = useApp();
  const [params, setParams] = useSearchParams();
  const [cat, setCat] = useState(params.get('cat') || 'all');
  const [sort, setSort] = useState('recommended');
  const [maxDelivery, setMaxDelivery] = useState(60);
  const [priceLevels, setPriceLevels] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(()=>{
    const c = params.get('cat');
    if (c) setCat(c);
  }, [params]);

  const togglePrice = (p) => setPriceLevels(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev, p]);

  const filtered = useMemo(() => {
    let list = RESTAURANTS.filter(r => {
      if (cat !== 'all' && !r.cuisine.includes(cat)) return false;
      if (r.delivery_max > maxDelivery) return false;
      if (priceLevels.length && !priceLevels.includes(r.price_level)) return false;
      if (r.rating < minRating) return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    if (sort === 'rating') list.sort((a,b)=>b.rating-a.rating);
    else if (sort === 'delivery') list.sort((a,b)=>a.delivery_min-b.delivery_min);
    else if (sort === 'priceAsc') list.sort((a,b)=>a.price_level-b.price_level);
    return list;
  }, [cat, sort, maxDelivery, priceLevels, minRating, search]);

  const clearAll = () => {
    setCat('all'); setSort('recommended'); setMaxDelivery(60);
    setPriceLevels([]); setMinRating(0); setSearch('');
    setParams({});
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Top bar */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B6259]">
          <MapPin className="w-4 h-4 text-[#FF6A35]" />
          <span>{address || 'Paris, France'}</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#1F1B16] mt-2">
          {t('restos.title')}
        </h1>
        <p className="text-[#6B6259] mt-1">{filtered.length} {t('restos.results')}</p>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        <button onClick={()=>setCat('all')}
          className={`shrink-0 px-4 h-10 rounded-full text-sm font-semibold border ${cat==='all' ? 'bg-[#1F1B16] text-white border-[#1F1B16]' : 'bg-white text-[#1F1B16] border-[#F1E6D6] hover:border-[#FF6A35]'}`}>
          {lang==='fr' ? 'Tout' : 'All'}
        </button>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={()=>setCat(c.id)}
            className={`shrink-0 inline-flex items-center gap-2 pl-1 pr-4 h-10 rounded-full text-sm font-semibold border ${cat===c.id ? 'bg-[#1F1B16] text-white border-[#1F1B16]' : 'bg-white text-[#1F1B16] border-[#F1E6D6] hover:border-[#FF6A35]'}`}>
            <img src={c.image} alt="" className="w-8 h-8 rounded-full object-cover" />
            {lang==='fr' ? c.name_fr : c.name_en}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar filters */}
        <aside className="bg-white rounded-2xl border border-[#F1E6D6] p-5 h-fit sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 font-display font-bold text-[#1F1B16]">
              <SlidersHorizontal className="w-4 h-4" /> {t('filter.sort')}
            </div>
            <button onClick={clearAll} className="text-xs text-[#FF6A35] hover:underline">{t('filter.clear')}</button>
          </div>

          <div className="space-y-2 mb-5">
            {[
              ['recommended', t('sort.recommended')],
              ['rating',      t('sort.rating')],
              ['delivery',    t('sort.delivery')],
              ['priceAsc',    t('sort.priceAsc')],
            ].map(([k,label]) => (
              <label key={k} className="flex items-center gap-3 cursor-pointer text-sm">
                <input type="radio" name="sort" checked={sort===k} onChange={()=>setSort(k)} className="accent-[#FF6A35]" />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="mb-5">
            <p className="font-semibold text-sm mb-2">{t('filter.delivery')}</p>
            <input type="range" min="15" max="60" step="5" value={maxDelivery}
              onChange={(e)=>setMaxDelivery(+e.target.value)}
              className="w-full accent-[#FF6A35]" />
            <div className="text-xs text-[#6B6259] mt-1">≤ {maxDelivery} {t('common.minutes')}</div>
          </div>

          <div className="mb-5">
            <p className="font-semibold text-sm mb-2">{t('filter.price')}</p>
            <div className="flex gap-2">
              {[1,2,3].map(p => (
                <button key={p} onClick={()=>togglePrice(p)}
                  className={`h-9 px-3 rounded-full text-sm font-semibold border ${priceLevels.includes(p) ? 'bg-[#FF6A35] text-white border-[#FF6A35]' : 'bg-white border-[#F1E6D6] hover:border-[#FF6A35]'}`}>
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
                  className={`h-9 px-3 rounded-full text-sm font-semibold border ${minRating===rt ? 'bg-[#FF6A35] text-white border-[#FF6A35]' : 'bg-white border-[#F1E6D6] hover:border-[#FF6A35]'}`}>
                  {rt === 0 ? (lang==='fr' ? 'Tout' : 'Any') : `${rt}+`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* List */}
        <section>
          <div className="bg-white rounded-full border border-[#F1E6D6] focus-within:border-[#FF6A35] h-12 px-4 flex items-center gap-2 mb-5">
            <Search className="w-4 h-4 text-[#6B6259]" />
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={lang==='fr' ? 'Rechercher un restaurant...' : 'Search restaurants...'}
              className="flex-1 outline-none text-sm" />
            {search && (
              <button onClick={()=>setSearch('')} className="text-[#6B6259] hover:text-[#FF6A35]"><X className="w-4 h-4" /></button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-[#F1E6D6]">
              <p className="text-[#6B6259]">{lang==='fr' ? 'Aucun restaurant ne correspond à vos filtres.' : 'No restaurant matches your filters.'}</p>
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
