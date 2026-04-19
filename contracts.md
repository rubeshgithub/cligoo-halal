# CLIGOO Backend Contracts (Phase 2)

## Scope
- **Auth**: JWT email/password (register/login) + Google Sign-In via Emergent managed auth
- **Restaurants & Menus**: migrated from `frontend/src/mock/mock.js` to MongoDB (seeded on startup)
- **Orders**: create / read / list / status update, with **Stripe Connect Test Mode split** computed server-side
- **Payment**: NO real Stripe calls yet. Backend returns `stripe_split` object that matches what real Stripe Connect would produce. Swap to real Stripe in phase 3.

## MongoDB Collections

### users
```
{
  user_id: "user_<uuid>",    // custom id (MongoDB _id excluded with {_id:0})
  email: str (unique, lowercase),
  name: str,
  auth_provider: "jwt" | "google" | "both",
  picture: str | null,
  password_hash: str | null, // only if jwt provider
  created_at: datetime,
}
```

### user_sessions  (Google auth session tokens, 7d expiry)
```
{ user_id, session_token, expires_at, created_at }
```

### restaurants
```
{
  id: "r1", name, image, cover,
  cuisine: [str], rating, reviews,
  delivery_min, delivery_max, delivery_fee, min_order,
  price_level, certification, address, offers,
  new: bool, distance_km,
  description_fr, description_en
}
```

### menus
```
{
  restaurant_id: "r1",
  sections: [ { id, name_fr, name_en, items: [ { id, name, desc_fr, desc_en, price, image } ] } ]
}
```

### orders
```
{
  id: "CL-XXXXXX",
  user_id, restaurant_id,
  items: [ {id, name, price, qty, image} ],
  subtotal, delivery_fee, service_fee, tip, total,
  address, instructions, payment_method,
  status: "confirmed"|"preparing"|"ready"|"delivering"|"delivered",
  stripe_split: {
     restaurant_payout, driver_payout, platform_fee,
     restaurant_account, driver_account, mode: "test"
  },
  created_at, updated_at
}
```

## API Endpoints (all under /api)

### Auth
- POST /api/auth/register   body: {email, password, name}      -> {user, token}
- POST /api/auth/login      body: {email, password}            -> {user, token}
- POST /api/auth/google/session  header: X-Session-ID          -> {user, token} + sets httpOnly cookie
- GET  /api/auth/me         (cookie session_token OR Bearer)   -> user
- POST /api/auth/logout                                        -> {ok}

### Restaurants
- GET  /api/restaurants                    ?cat=&min_rating=&max_delivery=&sort=
- GET  /api/restaurants/{id}
- GET  /api/restaurants/{id}/menu
- GET  /api/categories

### Orders
- POST /api/orders          auth required
- GET  /api/orders/{id}     auth required
- GET  /api/orders          auth required (user's history)
- PATCH /api/orders/{id}/status  body: {status}

## Frontend changes (replace mock.js usage)

1. Create `/app/frontend/src/lib/api.js` — axios client + auth helpers
2. Add `AuthContext` methods: `register`, `login`, `googleSignIn`, `logout`, auto-load `me`
3. `Landing.jsx` & `Restaurants.jsx` & `RestaurantDetail.jsx`: fetch from `/api/restaurants`
4. `Checkout.jsx`: POST /api/orders -> returns order with real `id` and `stripe_split`
5. `OrderTracking.jsx`: GET /api/orders/{id} (polling every 5s for status changes)
6. `Account.jsx`: GET /api/orders list
7. Add `/login` page + `AuthCallback` component that handles Emergent session_id in URL hash
8. `mock.js` remains only for: static categories, admin dashboard KPIs, driver jobs (dashboards stay mock)

## Stripe Connect Test Mode logic
- platform_commission: 30% of food subtotal + 100% of service_fee
- restaurant_payout: subtotal - (subtotal * 30%)
- driver_payout: delivery_fee + tip
- Returned in order response as `stripe_split.mode="test"` with fake connected account IDs
