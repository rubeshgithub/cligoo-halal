# CLIGOO — Business Summary

*A plain-English overview for non-technical stakeholders.*

---

## What CLIGOO is

CLIGOO ("Click & Goo") is a **halal food delivery service for France** — think UberEats or Deliveroo, but built specifically around **halal-certified restaurants**. Customers order food, restaurants prepare it, drivers deliver it, and the business takes a commission on every order.

Two things make it stand out:
- **Halal trust** — every restaurant prominently shows its halal certification (AVS, ARGML, Mosquée de Paris, etc.), a real selling point for the target audience.
- **Live video calls** — a customer can video-call their delivery driver inside the app (e.g., "I'm on the 3rd floor, blue door"). Most big competitors don't offer this.

The app works in **both French and English**.

---

## Who can do what

**Customers (the public)** — Browse restaurants, filter by cuisine / rating / delivery time, view menus, add items to a cart, place an order, pay, **track the order live** (preparing → on its way → delivered), **video-call the driver**, and see their order history.

**Restaurants** — A dashboard to go online/offline, see incoming orders, view daily sales, and accept/update orders. *(Currently shows sample data, not yet connected to real orders.)*

**Drivers** — A dashboard to go online, see available delivery jobs, accept them, view earnings, and complete deliveries. *(Also sample data for now.)*

**Admins (the business)** — A control panel showing total sales, number of orders, active restaurants and drivers, ratings, and approving new restaurants. *(Sample data for now.)*

---

## What has been built so far

**The customer experience is genuinely working, end to end.** A customer can sign up, browse 8 sample restaurants, build an order, check out, and watch it being "delivered" with the driver video-call feature functioning. The behind-the-scenes engine that calculates the bill — food cost, service fee, delivery fee, tip, and how money splits between restaurant, driver, and platform — is built and tested.

- ✅ Customer side: working and tested
- ✅ Sign-up / login (including "Sign in with Google"): working
- ✅ Video calls: working
- ✅ The money-split logic: working and verified
- ⚠️ Restaurant, driver, and admin dashboards: designed and look complete, but showing **sample/demo data** — not yet wired to real live orders
- ❌ Real payments: not connected yet — it simulates the payment split but doesn't actually charge cards or pay out restaurants/drivers

---

## What's pending (to become a real, launchable business)

1. **Real payment processing** — the biggest gap. Today the app *calculates* who gets paid what, but no real money moves. Connecting a payment provider (Stripe) is the #1 priority.
2. **Connect the dashboards to real data** — make restaurant, driver, and admin screens show *actual* live orders instead of demo data.
3. **Proper roles & permissions** — securely distinguish customers, drivers, and restaurant owners, each with only the access they should have.
4. **Real restaurants & real images** — replace the 8 sample restaurants and stock photos with real onboarded restaurants, menus, and photos.
5. **Security hardening** — standard pre-launch tightening to safely handle real customer data and money.
6. **Real delivery tracking** — replace the mocked "driver on a map" with real GPS tracking.

---

## The potential — how this could grow

- **Self-service onboarding** for restaurants and drivers (forms exist but don't submit yet), so you can scale without manual setup.
- **Notifications** — "Your order is on its way," "New order received."
- **Ratings & reviews** — build trust between customers, restaurants, and drivers.
- **Promotions & loyalty** — discount codes, first-order offers, loyalty points (offers are displayed but not yet functional).
- **Multiple cities** — currently Paris-focused; the structure supports expanding across France.
- **Business analytics** — real charts on revenue, best-selling restaurants, peak hours.
- **Video calls as a marketing angle** — a genuine differentiator worth promoting.

---

## One-line takeaway

> **CLIGOO is a working halal-food-delivery prototype where the customer journey is fully functional and tested. To turn it into a live business, the main work remaining is connecting real payments, hooking up the restaurant/driver/admin dashboards to live orders, and onboarding real restaurants.**
