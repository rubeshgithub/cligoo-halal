import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, ShieldCheck, Bike } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const RestaurantCard = ({ r, compact = false }) => {
  const { lang } = useApp();
  const deliveryLabel = `${r.delivery_min}–${r.delivery_max} min`;
  return (
    <Link to={`/restaurant/${r.id}`} className="group block lift">
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-[0_4px_20px_-8px_rgba(31,27,22,0.08)]">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={r.image} alt={r.name} loading="lazy"
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[11px] font-semibold text-[#2E7D32] shadow">
            <ShieldCheck className="w-3.5 h-3.5" /> Halal · {r.certification}
          </div>
          {r.new && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#3E8F8B] text-white text-[11px] font-bold shadow">
              NEW
            </div>
          )}
          {r.offers?.length > 0 && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#1F3B40] text-white text-[11px] font-medium shadow">
              {r.offers[0]}
            </div>
          )}
        </div>
        <div className={`p-${compact ? 3 : 4}`}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-[15px] text-[#1F3B40] line-clamp-1">{r.name}</h3>
            <span className="flex items-center gap-0.5 text-[13px] font-semibold text-[#1F3B40]">
              <Star className="w-3.5 h-3.5 fill-[#F5C7A1] text-[#F5C7A1]" /> {r.rating}
            </span>
          </div>
          <p className="text-[13px] text-[#5A6F72] mt-1 line-clamp-1">
            {(r.cuisine || []).map(c => c[0].toUpperCase() + c.slice(1)).join(' · ')}
          </p>
          <div className="flex items-center gap-3 mt-3 text-[12px] text-[#5A6F72]">
            <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {deliveryLabel}</span>
            <span className="inline-flex items-center gap-1"><Bike className="w-3.5 h-3.5" /> {r.delivery_fee.toFixed(2)} €</span>
            <span className="ml-auto text-[11px] text-[#9CB3B5]">{r.distance_km} km</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
