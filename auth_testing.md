# CLIGOO Auth Testing Playbook

## Test User & Session creation (MongoDB)
```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  auth_provider: 'google',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Test endpoints
- POST /api/auth/register { email, password, name }
- POST /api/auth/login { email, password }
- POST /api/auth/google/session  (X-Session-ID header from Emergent callback)
- GET  /api/auth/me  (cookie session_token OR Bearer JWT)
- POST /api/auth/logout

## Restaurants & Orders
- GET  /api/restaurants?cat=kebab&max_delivery=30
- GET  /api/restaurants/{id}
- GET  /api/restaurants/{id}/menu
- POST /api/orders  (auth required)
- GET  /api/orders/{id}
- GET  /api/orders  (list user's orders, auth required)
- PATCH /api/orders/{id}/status { status }

## Success indicators
- /api/auth/me returns user
- Checkout creates order with stripe_split breakdown
- Tracking page loads real order
