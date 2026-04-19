// CLIGOO — Mock data for V1 frontend (Halal food delivery clone of UberEats France)

export const CATEGORIES = [
  { id: 'kebab',    name_fr: 'Kebab',          name_en: 'Kebab',         image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80' },
  { id: 'shawarma', name_fr: 'Shawarma',       name_en: 'Shawarma',      image: 'https://images.unsplash.com/photo-1583665354191-634609954d54?w=400&q=80' },
  { id: 'burger',   name_fr: 'Burger Halal',   name_en: 'Halal Burger',  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
  { id: 'pizza',    name_fr: 'Pizza Halal',    name_en: 'Halal Pizza',   image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
  { id: 'tajine',   name_fr: 'Tajine',         name_en: 'Tajine',        image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&q=80' },
  { id: 'couscous', name_fr: 'Couscous',       name_en: 'Couscous',      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
  { id: 'sushi',    name_fr: 'Sushi Halal',    name_en: 'Halal Sushi',   image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80' },
  { id: 'chicken',  name_fr: 'Poulet frit',    name_en: 'Fried chicken', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80' },
  { id: 'lebanese', name_fr: 'Libanais',       name_en: 'Lebanese',      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80' },
  { id: 'dessert',  name_fr: 'Desserts',       name_en: 'Desserts',      image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80' },
];

export const CERTIFICATIONS = ['AVS', 'ARGML', 'Mosquée de Paris', 'SFCVH'];

const img = (url) => url.includes('?') ? url : url + '?w=800&q=80';

export const RESTAURANTS = [
  {
    id: 'r1',
    name: 'Le Shawarma de Marrakech',
    image: img('https://images.unsplash.com/photo-1639664342827-2d68822c55c9?w=800&q=80'),
    cover: img('https://images.unsplash.com/photo-1639664342827-2d68822c55c9?w=1600&q=80'),
    cuisine: ['shawarma','lebanese','kebab'],
    rating: 4.8, reviews: 1240,
    delivery_min: 20, delivery_max: 30,
    delivery_fee: 2.49, min_order: 12,
    price_level: 2,
    certification: 'AVS',
    address: '12 Rue de la République, 75011 Paris',
    offers: ['Nouveau client -20%'],
    new: false,
    distance_km: 1.2,
    description_fr: 'Shawarma traditionnel cuit à la broche, ingrédients frais et 100% Halal certifié AVS.',
    description_en: 'Traditional spit-cooked shawarma, fresh ingredients, 100% Halal AVS certified.'
  },
  {
    id: 'r2', name: 'Tajine & Co',
    image: img('https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&q=80'),
    cover: img('https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1600&q=80'),
    cuisine: ['tajine','couscous'], rating: 4.7, reviews: 860,
    delivery_min: 25, delivery_max: 40, delivery_fee: 1.99, min_order: 15,
    price_level: 2, certification: 'ARGML',
    address: '34 Rue du Faubourg, 75010 Paris',
    offers: ['Livraison offerte dès 25€'], new: false, distance_km: 2.4,
    description_fr: 'Cuisine marocaine authentique, tajines mijotés et couscous maison.',
    description_en: 'Authentic Moroccan cuisine, slow-cooked tajines and homemade couscous.'
  },
  {
    id: 'r3', name: 'Halal Smash House',
    image: img('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80'),
    cover: img('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&q=80'),
    cuisine: ['burger','chicken'], rating: 4.6, reviews: 2130,
    delivery_min: 15, delivery_max: 25, delivery_fee: 2.99, min_order: 10,
    price_level: 2, certification: 'AVS',
    address: '78 Bd de Strasbourg, 75010 Paris',
    offers: [], new: true, distance_km: 0.8,
    description_fr: 'Smash burgers premium, viande Halal, buns brioche maison.',
    description_en: 'Premium smash burgers, Halal beef, house-baked brioche buns.'
  },
  {
    id: 'r4', name: 'Pizza Al Sultan',
    image: img('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80'),
    cover: img('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80'),
    cuisine: ['pizza'], rating: 4.5, reviews: 980,
    delivery_min: 20, delivery_max: 35, delivery_fee: 1.49, min_order: 12,
    price_level: 1, certification: 'Mosquée de Paris',
    address: '5 Rue des Petites Écuries, 75010 Paris',
    offers: ['2 pizzas achetées = 1 offerte'], new: false, distance_km: 1.6,
    description_fr: 'Pizza napolitaine au four à bois, pepperoni de bœuf Halal.',
    description_en: 'Wood-fired Neapolitan pizza, Halal beef pepperoni.'
  },
  {
    id: 'r5', name: 'Sushi Halal Paris',
    image: img('https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80'),
    cover: img('https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1600&q=80'),
    cuisine: ['sushi'], rating: 4.9, reviews: 540,
    delivery_min: 30, delivery_max: 45, delivery_fee: 3.49, min_order: 18,
    price_level: 3, certification: 'SFCVH',
    address: '22 Avenue de la République, 75011 Paris',
    offers: ['Menu midi -15%'], new: true, distance_km: 2.9,
    description_fr: 'Sushis premium avec saumon certifié Halal et riz japonais.',
    description_en: 'Premium sushi with Halal-certified salmon and Japanese rice.'
  },
  {
    id: 'r6', name: 'Chicken Crunch Halal',
    image: img('https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80'),
    cover: img('https://images.unsplash.com/photo-1562967914-608f82629710?w=1600&q=80'),
    cuisine: ['chicken','burger'], rating: 4.4, reviews: 3210,
    delivery_min: 15, delivery_max: 25, delivery_fee: 0.99, min_order: 8,
    price_level: 1, certification: 'AVS',
    address: '101 Rue Montmartre, 75002 Paris',
    offers: ['Buckets famille -10€'], new: false, distance_km: 0.6,
    description_fr: 'Poulet frit croustillant, mariné 24h, 100% Halal.',
    description_en: 'Crispy fried chicken, 24h marinated, 100% Halal.'
  },
  {
    id: 'r7', name: 'Beirut Garden',
    image: img('https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80'),
    cover: img('https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=1600&q=80'),
    cuisine: ['lebanese','shawarma'], rating: 4.7, reviews: 720,
    delivery_min: 25, delivery_max: 40, delivery_fee: 2.49, min_order: 15,
    price_level: 2, certification: 'ARGML',
    address: '48 Rue Oberkampf, 75011 Paris',
    offers: [], new: false, distance_km: 2.1,
    description_fr: 'Mezzés libanais, falafels croustillants et grillades au feu de bois.',
    description_en: 'Lebanese mezze, crispy falafel and wood-fired grills.'
  },
  {
    id: 'r8', name: 'Baklava Dreams',
    image: img('https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=80'),
    cover: img('https://images.unsplash.com/photo-1519676867240-f03562e64548?w=1600&q=80'),
    cuisine: ['dessert'], rating: 4.9, reviews: 410,
    delivery_min: 20, delivery_max: 35, delivery_fee: 2.99, min_order: 10,
    price_level: 2, certification: 'AVS',
    address: '14 Rue de Charonne, 75011 Paris',
    offers: ['Pack découverte -20%'], new: true, distance_km: 1.9,
    description_fr: 'Pâtisseries orientales : baklava, knafeh, maamoul faits maison.',
    description_en: 'Oriental pastries: homemade baklava, knafeh, maamoul.'
  },
];

// Menus per restaurant id
export const MENUS = {
  r1: {
    sections: [
      { id: 's1', name_fr: 'Les plus populaires', name_en: 'Most popular', items: [
        { id: 'r1i1', name: 'Shawarma poulet XL', desc_fr: 'Poulet mariné, sauce blanche, frites, galette libanaise', desc_en: 'Marinated chicken, white sauce, fries, lebanese wrap', price: 11.90, image: img('https://images.unsplash.com/photo-1639664342827-2d68822c55c9?w=600&q=80') },
        { id: 'r1i2', name: 'Assiette mixte', desc_fr: 'Poulet, bœuf, riz basmati, houmous', desc_en: 'Chicken, beef, basmati rice, hummus', price: 15.50, image: img('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80') },
        { id: 'r1i3', name: 'Shawarma bœuf', desc_fr: 'Bœuf effiloché, oignons confits, sauce ail', desc_en: 'Pulled beef, caramelized onions, garlic sauce', price: 12.90, image: img('https://images.unsplash.com/photo-1583665354191-634609954d54?w=600&q=80') },
      ]},
      { id: 's2', name_fr: 'Accompagnements', name_en: 'Sides', items: [
        { id: 'r1i4', name: 'Frites maison', desc_fr: 'Frites fraîches coupées à la main', desc_en: 'Hand-cut fresh fries', price: 3.90, image: img('https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&q=80') },
        { id: 'r1i5', name: 'Houmous & pita', desc_fr: 'Houmous maison, pita chaude', desc_en: 'House hummus, warm pita', price: 5.50, image: img('https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80') },
      ]},
      { id: 's3', name_fr: 'Boissons', name_en: 'Drinks', items: [
        { id: 'r1i6', name: 'Ayran', desc_fr: 'Boisson au yaourt turc', desc_en: 'Turkish yogurt drink', price: 2.50, image: img('https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80') },
        { id: 'r1i7', name: 'Coca-Cola 33cl', desc_fr: '', desc_en: '', price: 2.90, image: img('https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=80') },
      ]},
    ]
  },
  r3: {
    sections: [
      { id: 's1', name_fr: 'Burgers signature', name_en: 'Signature burgers', items: [
        { id: 'r3i1', name: 'Double Smash Halal', desc_fr: '2 steaks smash, cheddar, oignons confits, sauce maison', desc_en: '2 smash patties, cheddar, caramelized onions, house sauce', price: 13.90, image: img('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80') },
        { id: 'r3i2', name: 'Chicken Crunch', desc_fr: 'Poulet croustillant, coleslaw, cornichons', desc_en: 'Crispy chicken, coleslaw, pickles', price: 11.50, image: img('https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80') },
      ]},
      { id: 's2', name_fr: 'Menus', name_en: 'Meals', items: [
        { id: 'r3i3', name: 'Menu Double Smash', desc_fr: 'Burger + frites + boisson', desc_en: 'Burger + fries + drink', price: 17.90, image: img('https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=80') },
      ]},
    ]
  },
  r4: {
    sections: [
      { id: 's1', name_fr: 'Pizzas', name_en: 'Pizzas', items: [
        { id: 'r4i1', name: 'Margherita', desc_fr: 'Tomate, mozzarella, basilic', desc_en: 'Tomato, mozzarella, basil', price: 9.90, image: img('https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80') },
        { id: 'r4i2', name: 'Pepperoni bœuf Halal', desc_fr: 'Pepperoni de bœuf Halal, mozzarella', desc_en: 'Halal beef pepperoni, mozzarella', price: 13.50, image: img('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80') },
        { id: 'r4i3', name: 'Sultan Spéciale', desc_fr: 'Bœuf épicé, merguez, oignons', desc_en: 'Spicy beef, merguez, onions', price: 14.90, image: img('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80') },
      ]},
    ]
  },
};

// Fill default menus for all other restaurants
RESTAURANTS.forEach(r => {
  if (!MENUS[r.id]) {
    MENUS[r.id] = {
      sections: [
        { id: 's1', name_fr: 'Spécialités', name_en: 'Specialties', items: [
          { id: r.id + 'i1', name: 'Plat signature', desc_fr: 'Spécialité du chef, 100% Halal', desc_en: 'Chef special, 100% Halal', price: 12.90, image: r.image },
          { id: r.id + 'i2', name: 'Assiette complète', desc_fr: 'Plat principal, accompagnement, boisson', desc_en: 'Main, side, drink', price: 16.50, image: r.cover },
          { id: r.id + 'i3', name: 'Option végétarienne', desc_fr: 'Version sans viande', desc_en: 'Meatless version', price: 10.90, image: img('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80') },
        ]},
        { id: 's2', name_fr: 'Boissons', name_en: 'Drinks', items: [
          { id: r.id + 'd1', name: 'Eau minérale', desc_fr: '50cl', desc_en: '50cl', price: 1.90, image: img('https://images.unsplash.com/photo-1550505095-81378a674395?w=600&q=80') },
          { id: r.id + 'd2', name: 'Coca-Cola', desc_fr: '33cl', desc_en: '33cl', price: 2.50, image: img('https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=80') },
        ]},
      ]
    };
  }
});

export const DRIVER = {
  name: 'Karim B.',
  rating: 4.9,
  vehicle_fr: 'Scooter',
  vehicle_en: 'Scooter',
  plate: 'AB-123-CD',
  phone: '+33 6 12 34 56 78',
  photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80',
  insurance: 'MAIF Pro · Police n°FR-2025-8842173',
};

export const ORDERS_HISTORY = [
  { id: 'o-2041', restaurantId: 'r3', date: '2025-07-08', total: 24.80, status: 'delivered', items: 3 },
  { id: 'o-2012', restaurantId: 'r1', date: '2025-07-02', total: 18.40, status: 'delivered', items: 2 },
  { id: 'o-1998', restaurantId: 'r4', date: '2025-06-28', total: 32.10, status: 'delivered', items: 4 },
  { id: 'o-1974', restaurantId: 'r8', date: '2025-06-20', total: 12.90, status: 'delivered', items: 1 },
];

// Restaurant dashboard sample orders
export const INCOMING_ORDERS = [
  { id: '#A-8872', customer: 'Sofia M.', items: 3, total: 28.40, eta: 12, status: 'new' },
  { id: '#A-8871', customer: 'Rachid H.', items: 2, total: 19.90, eta: 8, status: 'preparing' },
  { id: '#A-8870', customer: 'Léa T.', items: 5, total: 42.10, eta: 15, status: 'preparing' },
  { id: '#A-8869', customer: 'Yassine K.', items: 1, total: 11.90, eta: 3, status: 'ready' },
];

// Driver dashboard jobs
export const DRIVER_JOBS = [
  { id: 'D-331', pickup: 'Pizza Al Sultan', dropoff: '18 Rue de Lancry', distance_km: 1.8, payout: 6.80, time_min: 14 },
  { id: 'D-332', pickup: 'Halal Smash House', dropoff: '62 Bd Voltaire', distance_km: 2.3, payout: 7.90, time_min: 18 },
  { id: 'D-333', pickup: 'Tajine & Co', dropoff: '4 Rue du Temple', distance_km: 3.1, payout: 9.20, time_min: 22 },
];

// Admin panel metrics
export const ADMIN_METRICS = {
  gmv_today: 48230.55,
  orders_today: 1842,
  active_restaurants: 312,
  active_drivers: 187,
  avg_rating: 4.72,
  commission_today: 7234.58,
};

export const ADMIN_RESTAURANTS_PENDING = [
  { id: 'p1', name: 'Kebab de Belleville', cert: 'AVS', city: 'Paris 20', owner: 'M. El Amrani' },
  { id: 'p2', name: 'Bab El Medina', cert: 'ARGML', city: 'Lyon 3', owner: 'Mme Ait Said' },
  { id: 'p3', name: 'Couscous Royal', cert: 'Mosquée de Paris', city: 'Marseille 2', owner: 'M. Benali' },
];

export const CITIES = ['Paris','Lyon','Marseille','Lille','Toulouse','Bordeaux','Nice','Strasbourg','Nantes','Montpellier','Rennes','Saint-Étienne'];

// Pricing helpers (UberEats-style commission/structure - mock)
export const PRICING = {
  service_fee_rate: 0.10,   // 10%
  platform_commission: 0.30, // 30% (UberEats-like)
  driver_fee_min: 2.5,
  driver_fee_per_km: 1.1,
};
