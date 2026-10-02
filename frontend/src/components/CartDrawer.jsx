import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { useApp } from '../contexts/AppContext';
import { RESTAURANTS } from '../mock/mock';
import { Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';

const CartDrawer = () => {
  const { t, cart, cartOpen, setCartOpen, updateQty, cartSubtotal, clearCart } = useApp();
  const nav = useNavigate();
  const resto = RESTAURANTS.find(r => r.id === cart.restaurantId);
  const deliveryFee = resto?.delivery_fee ?? 0;
  const serviceFee = +(cartSubtotal * 0.10).toFixed(2);
  const total = +(cartSubtotal + deliveryFee + serviceFee).toFixed(2);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-white">
        <SheetHeader>
          <SheetTitle className="font-display">{t('cart.title')}{resto ? ` · ${resto.name}` : ''}</SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-saffron-50 flex items-center justify-center mb-4">
              <ShoppingBag className="w-7 h-7 text-emerald-700" />
            </div>
            <p className="text-sm text-ink-soft">{t('cart.empty')}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-3">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                  {item.image && <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{item.name}</p>
                    <p className="text-xs text-ink-soft">{item.price.toFixed(2)} €</p>
                  </div>
                  <div className="flex items-center gap-2 bg-saffron-50 rounded-full px-1 py-1">
                    <button onClick={()=>updateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-white hover:bg-saffron-100 flex items-center justify-center">
                      {item.qty === 1 ? <Trash2 className="w-3.5 h-3.5 text-ink-soft" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                    <button onClick={()=>updateQty(item.id, +1)} className="w-7 h-7 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-clay pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-ink-soft"><span>{t('cart.subtotal')}</span><span>{cartSubtotal.toFixed(2)} €</span></div>
              <div className="flex justify-between text-ink-soft"><span>{t('cart.delivery')}</span><span>{deliveryFee.toFixed(2)} €</span></div>
              <div className="flex justify-between text-ink-soft"><span>{t('cart.service')}</span><span>{serviceFee.toFixed(2)} €</span></div>
              <div className="flex justify-between pt-2 border-t border-clay text-base font-bold text-ink"><span>{t('cart.total')}</span><span>{total.toFixed(2)} €</span></div>

              <button
                onClick={() => { setCartOpen(false); nav('/checkout'); }}
                className="w-full mt-4 h-12 rounded-full bg-saffron-400 hover:bg-saffron-300 text-ink font-semibold"
              >
                {t('cart.checkout')} · {total.toFixed(2)} €
              </button>
              <button onClick={clearCart} className="w-full text-xs text-ink-soft hover:text-emerald-700 pt-2">
                {t('filter.clear')}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
