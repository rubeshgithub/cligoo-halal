import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, Clock, ShieldCheck, CreditCard, Smartphone, Store, Bike, ArrowRight, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { restaurantApi } from '../lib/api';
import RestaurantCard from '../components/RestaurantCard';

const Landing = () => {
  const { t, lang, address, setAddress } = useApp();
  const nav = useNavigate();
  const [addr, setAddr] = useState(address);
  const [timeMode, setTimeMode] = useState('now');
  const catRef = useRef(null);
  const [cats, setCats] = useState([]);
  const [popular, setPopular] = useState([]);
  const [newOnes, setNewOnes] = useState([]);

  useEffect(() => {
    restaurantApi.categories().then(setCats).catch(()=>{});
    restaurantApi.list({ sort: 'rating' }).then(list => {
      setPopular(list.slice(0, 8));
      const sorted = [...list].sort((a,b) => (b.new?1:0) - (a.new?1:0));
      setNewOnes(sorted.slice(0, 8));
    }).catch(()=>{});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setAddress(addr || 'Paris');
    nav('/restaurants');
  };

  const scrollCats = (dir) => {
    if (catRef.current) catRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{
          background: 'linear-gradient(135deg, #FFF2E6 0%, #FADDC2 50%, #F8CFB0 100%)'
        }} />
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full -z-10"
             style={{ background: 'radial-gradient(circle, rgba(255,106,53,0.18), transparent 70%)' }} />
        <div className="absolute top-40 -left-32 w-[420px] h-[420px] rounded-full -z-10"
             style={{ background: 'radial-gradient(circle, rgba(255,179,71,0.22), transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-16 md:pb-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#F8CFB0] text-xs font-semibold text-[#2E7D32] mb-5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('footer.halal')} · AVS · ARGML
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[#1F3B40] leading-[1.05] whitespace-pre-line">
              {t('hero.title')}
            </h1>
            <p className="mt-5 text-lg text-[#3F5C60] max-w-xl">{t('hero.subtitle')}</p>

            <form onSubmit={handleSearch} className="mt-8 bg-white rounded-2xl p-2 shadow-[0_10px_40px_-12px_rgba(31,27,22,0.15)] flex flex-col gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 flex-1 px-3 min-w-0">
                  <MapPin className="w-5 h-5 text-[#3E8F8B] shrink-0" />
                  <input
                    value={addr}
                    onChange={(e)=>setAddr(e.target.value)}
                    placeholder={t('hero.address.placeholder')}
                    className="flex-1 h-12 outline-none text-[15px] placeholder:text-[#9CB3B5] min-w-0 bg-transparent"
                  />
                </div>
                <div className="hidden lg:flex items-center bg-[#FFF2E6] rounded-xl p-1 gap-1 shrink-0">
                  <button type="button" onClick={()=>setTimeMode('now')}
                    className={`px-3 h-10 rounded-lg text-sm font-medium ${timeMode==='now' ? 'bg-white text-[#1F3B40] shadow' : 'text-[#5A6F72]'}`}>
                    {t('hero.time.now')}
                  </button>
                  <button type="button" onClick={()=>setTimeMode('later')}
                    className={`px-3 h-10 rounded-lg text-sm font-medium ${timeMode==='later' ? 'bg-white text-[#1F3B40] shadow' : 'text-[#5A6F72]'}`}>
                    {t('hero.time.schedule')}
                  </button>
                </div>
                <button type="submit" className="h-12 px-5 shrink-0 whitespace-nowrap rounded-xl bg-[#3E8F8B] hover:bg-[#2F7A78] text-white font-semibold inline-flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> {t('hero.cta')}
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#5A6F72]">
              <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#3E8F8B]" /> 25 min en moyenne</span>
              <span className="inline-flex items-center gap-1.5"><Award className="w-4 h-4 text-[#3E8F8B]" /> 3 000+ restaurants certifiés</span>
              <span className="inline-flex items-center gap-1.5"><Bike className="w-4 h-4 text-[#3E8F8B]" /> Livreurs assurés</span>
            </div>
          </div>

          <div className="relative fade-up">
            <div className="relative aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1639664342827-2d68822c55c9?w=900&q=80" alt="halal" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F3B40]/60 via-transparent to-transparent" />
              <div className="absolute left-4 bottom-4 right-4 flex gap-3">
                <div className="flex-1 bg-white/95 backdrop-blur rounded-xl p-3 flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-[#FFF2E6] flex items-center justify-center"><Bike className="w-5 h-5 text-[#3E8F8B]" /></div>
                  <div>
                    <p className="text-[11px] text-[#5A6F72] leading-none">Livraison</p>
                    <p className="text-sm font-bold text-[#1F3B40]">22 min</p>
                  </div>
                </div>
                <div className="flex-1 bg-white/95 backdrop-blur rounded-xl p-3 flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-[#2E7D32]" /></div>
                  <div>
                    <p className="text-[11px] text-[#5A6F72] leading-none">Certifié</p>
                    <p className="text-sm font-bold text-[#1F3B40]">AVS Halal</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-lg hidden md:block">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3E8F8B] to-[#F5C7A1] text-white flex items-center justify-center font-bold">K</div>
                <div>
                  <p className="text-[11px] text-[#5A6F72]">Livreur · 4.9★</p>
                  <p className="text-sm font-bold">Karim est en route</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-6 md:mt-8">
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F3B40]">{t('categories.title')}</h2>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={()=>scrollCats(-1)} className="w-9 h-9 rounded-full bg-white border border-[#E8E0D0] hover:border-[#3E8F8B] flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={()=>scrollCats(1)} className="w-9 h-9 rounded-full bg-white border border-[#E8E0D0] hover:border-[#3E8F8B] flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div ref={catRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {cats.map(c => (
            <Link key={c.id} to={`/restaurants?cat=${c.id}`} className="shrink-0 w-[150px] group">
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#FFF2E6] lift">
                <img src={c.image} alt={c.id} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <p className="mt-2 text-sm font-semibold text-[#1F3B40] text-center">{lang==='fr' ? c.name_fr : c.name_en}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-14">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F3B40]">{t('popular.title')}</h2>
            <p className="text-[#5A6F72] mt-1">{t('popular.subtitle')}</p>
          </div>
          <Link to="/restaurants" className="text-sm font-semibold text-[#3E8F8B] hover:text-[#2F7A78] inline-flex items-center gap-1">
            {t('viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popular.map(r => <RestaurantCard key={r.id} r={r} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F3B40] text-center mb-10">{t('halal.title')}</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: ShieldCheck, title: t('halal.card1.title'), desc: t('halal.card1.desc'), color: '#2E7D32', bg: '#E8F5E9' },
            { icon: Bike,        title: t('halal.card2.title'), desc: t('halal.card2.desc'), color: '#3E8F8B', bg: '#FFF2E6' },
            { icon: CreditCard,  title: t('halal.card3.title'), desc: t('halal.card3.desc'), color: '#8B5A2B', bg: '#EAF4F3' },
          ].map((c,i)=>(
            <div key={i} className="bg-white rounded-2xl p-6 border border-[#E8E0D0] lift">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{background:c.bg}}>
                <c.icon className="w-6 h-6" style={{color:c.color}} />
              </div>
              <h3 className="font-display font-bold text-lg text-[#1F3B40]">{c.title}</h3>
              <p className="text-sm text-[#5A6F72] mt-2 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20">
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F3B40]">{t('new.title')}</h2>
          <Link to="/restaurants" className="text-sm font-semibold text-[#3E8F8B] hover:text-[#2F7A78] inline-flex items-center gap-1">
            {t('viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newOnes.map(r => <RestaurantCard key={r.id} r={r} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-24">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F3B40] text-center mb-10">{t('how.title')}</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: '1', title: t('how.step1.title'), desc: t('how.step1.desc') },
            { n: '2', title: t('how.step2.title'), desc: t('how.step2.desc') },
            { n: '3', title: t('how.step3.title'), desc: t('how.step3.desc') },
          ].map((s,i)=>(
            <div key={i} className="relative bg-white rounded-2xl p-6 border border-[#E8E0D0]">
              <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-[#3E8F8B] text-white font-display font-extrabold flex items-center justify-center shadow-lg">{s.n}</div>
              <h3 className="font-display font-bold text-lg text-[#1F3B40] mt-3">{s.title}</h3>
              <p className="text-sm text-[#5A6F72] mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-24">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F3B40] text-center mb-10">{t('apps.title')}</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Smartphone, title: t('apps.customer.title'), desc: t('apps.customer.desc'), link:'/restaurants' },
            { icon: Store,      title: t('apps.restaurant.title'), desc: t('apps.restaurant.desc'), link:'/restaurant-dashboard' },
            { icon: Bike,       title: t('apps.driver.title'), desc: t('apps.driver.desc'), link:'/driver-dashboard' },
          ].map((a,i)=>(
            <Link key={i} to={a.link} className="bg-gradient-to-br from-white to-[#FFF2E6] rounded-2xl p-6 border border-[#E8E0D0] lift">
              <div className="w-12 h-12 rounded-xl bg-[#3E8F8B] text-white flex items-center justify-center mb-4">
                <a.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#1F3B40]">{a.title}</h3>
              <p className="text-sm text-[#5A6F72] mt-2">{a.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#3E8F8B]">
                {t('viewAll')} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-24 mb-4 grid md:grid-cols-2 gap-5">
        <div className="rounded-3xl p-8 md:p-10 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3E8F8B, #5AA8A4)' }}>
          <Store className="absolute -right-4 -bottom-4 w-44 h-44 text-white/10" />
          <h3 className="font-display text-2xl md:text-3xl font-extrabold">{t('partner.cta.title')}</h3>
          <p className="mt-3 text-white/90 max-w-md">{t('partner.cta.desc')}</p>
          <Link to="/partner" className="mt-6 inline-flex h-12 px-6 rounded-full bg-white text-[#3E8F8B] font-semibold items-center gap-2 hover:bg-[#FFF2E6]">
            {t('partner.cta.button')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="rounded-3xl p-8 md:p-10 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1F3B40, #2A4A4E)' }}>
          <Bike className="absolute -right-4 -bottom-4 w-44 h-44 text-white/10" />
          <h3 className="font-display text-2xl md:text-3xl font-extrabold">{t('driver.cta.title')}</h3>
          <p className="mt-3 text-white/80 max-w-md">{t('driver.cta.desc')}</p>
          <Link to="/driver" className="mt-6 inline-flex h-12 px-6 rounded-full bg-[#F5C7A1] text-[#1F3B40] font-semibold items-center gap-2 hover:bg-[#FAD4B5]">
            {t('driver.cta.button')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Landing;
