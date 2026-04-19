#!/usr/bin/env python3
"""
CLIGOO Backend API Testing Suite
Tests all backend endpoints as specified in the review request.
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Base URL from frontend/.env
BASE_URL = "https://cligoo-halal.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.failures = []
    
    def log_pass(self, test_name: str):
        print(f"✅ PASS: {test_name}")
        self.passed += 1
    
    def log_fail(self, test_name: str, error: str):
        print(f"❌ FAIL: {test_name} - {error}")
        self.failed += 1
        self.failures.append(f"{test_name}: {error}")
    
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*60}")
        print(f"TEST SUMMARY: {self.passed}/{total} passed")
        if self.failures:
            print(f"\nFAILURES:")
            for failure in self.failures:
                print(f"  - {failure}")
        print(f"{'='*60}")

def make_request(method: str, url: str, headers: Optional[Dict] = None, 
                json_data: Optional[Dict] = None, expected_status: int = 200) -> Dict[str, Any]:
    """Make HTTP request and return response data"""
    try:
        response = requests.request(method, url, headers=headers, json=json_data, timeout=30)
        
        result = {
            'status_code': response.status_code,
            'success': response.status_code == expected_status,
            'data': None,
            'error': None
        }
        
        try:
            result['data'] = response.json()
        except:
            result['data'] = response.text
            
        if not result['success']:
            result['error'] = f"Expected {expected_status}, got {response.status_code}"
            
        return result
    except Exception as e:
        return {
            'status_code': 0,
            'success': False,
            'data': None,
            'error': str(e)
        }

def test_health_endpoint(results: TestResults):
    """Test 1: Health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    
    response = make_request("GET", f"{API_BASE}/")
    if response['success'] and response['data'].get('service') == 'CLIGOO API':
        results.log_pass("Health endpoint returns service payload")
    else:
        results.log_fail("Health endpoint", response.get('error', 'Invalid response'))

def test_restaurants_endpoints(results: TestResults):
    """Test 2: Restaurants & Menus (public endpoints)"""
    print("\n=== Testing Restaurants & Menus ===")
    
    # Test basic restaurants list
    response = make_request("GET", f"{API_BASE}/restaurants")
    if response['success']:
        restaurants = response['data']
        if len(restaurants) == 8:
            results.log_pass("GET /api/restaurants returns 8 items")
        else:
            results.log_fail("GET /api/restaurants", f"Expected 8 items, got {len(restaurants)}")
    else:
        results.log_fail("GET /api/restaurants", response.get('error', 'Request failed'))
    
    # Test category filter
    response = make_request("GET", f"{API_BASE}/restaurants?cat=kebab")
    if response['success']:
        kebab_restaurants = response['data']
        if all(('kebab' in r.get('cuisine', []) for r in kebab_restaurants)):
            results.log_pass("GET /api/restaurants?cat=kebab filters correctly")
        else:
            results.log_fail("GET /api/restaurants?cat=kebab", "Filter not working correctly")
    else:
        results.log_fail("GET /api/restaurants?cat=kebab", response.get('error', 'Request failed'))
    
    # Test multiple filters and sorting
    response = make_request("GET", f"{API_BASE}/restaurants?max_delivery=25&sort=rating")
    if response['success']:
        filtered_restaurants = response['data']
        # Check if delivery_max <= 25 for all restaurants
        valid_delivery = all(r.get('delivery_max', 0) <= 25 for r in filtered_restaurants)
        # Check if sorted by rating (descending)
        ratings = [r.get('rating', 0) for r in filtered_restaurants]
        sorted_by_rating = ratings == sorted(ratings, reverse=True)
        
        if valid_delivery and sorted_by_rating:
            results.log_pass("GET /api/restaurants with filters and sorting works")
        else:
            results.log_fail("GET /api/restaurants filters/sort", "Filtering or sorting not working")
    else:
        results.log_fail("GET /api/restaurants filters/sort", response.get('error', 'Request failed'))
    
    # Test specific restaurant
    response = make_request("GET", f"{API_BASE}/restaurants/r1")
    if response['success']:
        restaurant = response['data']
        if (restaurant.get('name') == "Le Shawarma de Marrakech" and 
            restaurant.get('certification') == "AVS"):
            results.log_pass("GET /api/restaurants/r1 returns correct restaurant")
        else:
            results.log_fail("GET /api/restaurants/r1", "Restaurant data doesn't match expected")
    else:
        results.log_fail("GET /api/restaurants/r1", response.get('error', 'Request failed'))
    
    # Test non-existent restaurant
    response = make_request("GET", f"{API_BASE}/restaurants/does-not-exist", expected_status=404)
    if response['success']:
        results.log_pass("GET /api/restaurants/does-not-exist returns 404")
    else:
        results.log_fail("GET /api/restaurants/does-not-exist", "Should return 404")
    
    # Test restaurant menu
    response = make_request("GET", f"{API_BASE}/restaurants/r1/menu")
    if response['success']:
        menu = response['data']
        sections = menu.get('sections', [])
        if len(sections) >= 3:
            results.log_pass("GET /api/restaurants/r1/menu returns menu with 3+ sections")
        else:
            results.log_fail("GET /api/restaurants/r1/menu", f"Expected 3+ sections, got {len(sections)}")
    else:
        results.log_fail("GET /api/restaurants/r1/menu", response.get('error', 'Request failed'))
    
    # Test categories
    response = make_request("GET", f"{API_BASE}/categories")
    if response['success']:
        categories = response['data']
        if len(categories) == 10:
            results.log_pass("GET /api/categories returns 10 categories")
        else:
            results.log_fail("GET /api/categories", f"Expected 10 categories, got {len(categories)}")
    else:
        results.log_fail("GET /api/categories", response.get('error', 'Request failed'))

def test_jwt_auth(results: TestResults) -> Optional[str]:
    """Test 3: JWT Authentication - returns JWT token if successful"""
    print("\n=== Testing JWT Authentication ===")
    
    # Test user registration
    test_user = {
        "email": "test.user.cligoo@example.com",
        "password": "testpass123",
        "name": "Test User CLIGOO"
    }
    
    response = make_request("POST", f"{API_BASE}/auth/register", json_data=test_user)
    if response['success']:
        auth_data = response['data']
        if 'user' in auth_data and 'token' in auth_data:
            results.log_pass("POST /api/auth/register creates user and returns token")
            jwt_token = auth_data['token']
        else:
            results.log_fail("POST /api/auth/register", "Missing user or token in response")
            return None
    else:
        results.log_fail("POST /api/auth/register", response.get('error', 'Request failed'))
        return None
    
    # Test duplicate registration
    response = make_request("POST", f"{API_BASE}/auth/register", json_data=test_user, expected_status=400)
    if response['success']:
        results.log_pass("Duplicate registration returns 400")
    else:
        results.log_fail("Duplicate registration", "Should return 400 for duplicate email")
    
    # Test login with correct credentials
    login_data = {"email": test_user["email"], "password": test_user["password"]}
    response = make_request("POST", f"{API_BASE}/auth/login", json_data=login_data)
    if response['success']:
        auth_data = response['data']
        if 'token' in auth_data:
            results.log_pass("POST /api/auth/login with correct credentials returns token")
            jwt_token = auth_data['token']  # Update token
        else:
            results.log_fail("POST /api/auth/login", "Missing token in response")
    else:
        results.log_fail("POST /api/auth/login", response.get('error', 'Request failed'))
    
    # Test login with wrong password
    wrong_login = {"email": test_user["email"], "password": "wrongpassword"}
    response = make_request("POST", f"{API_BASE}/auth/login", json_data=wrong_login, expected_status=401)
    if response['success']:
        results.log_pass("POST /api/auth/login with wrong password returns 401")
    else:
        results.log_fail("POST /api/auth/login wrong password", "Should return 401")
    
    # Test /me endpoint with Bearer token
    headers = {"Authorization": f"Bearer {jwt_token}"}
    response = make_request("GET", f"{API_BASE}/auth/me", headers=headers)
    if response['success']:
        user_data = response['data']
        expected_fields = ['user_id', 'email', 'name', 'auth_provider']
        if all(field in user_data for field in expected_fields):
            if user_data.get('auth_provider') == 'jwt':
                results.log_pass("GET /api/auth/me with Bearer token returns user data")
            else:
                results.log_fail("GET /api/auth/me", f"Expected auth_provider='jwt', got {user_data.get('auth_provider')}")
        else:
            results.log_fail("GET /api/auth/me", "Missing required user fields")
    else:
        results.log_fail("GET /api/auth/me with Bearer", response.get('error', 'Request failed'))
    
    # Test /me endpoint without auth
    response = make_request("GET", f"{API_BASE}/auth/me", expected_status=401)
    if response['success']:
        results.log_pass("GET /api/auth/me without auth returns 401")
    else:
        results.log_fail("GET /api/auth/me without auth", "Should return 401")
    
    # Test logout
    response = make_request("POST", f"{API_BASE}/auth/logout")
    if response['success']:
        logout_data = response['data']
        if logout_data.get('ok') is True:
            results.log_pass("POST /api/auth/logout returns {ok: true}")
        else:
            results.log_fail("POST /api/auth/logout", "Should return {ok: true}")
    else:
        results.log_fail("POST /api/auth/logout", response.get('error', 'Request failed'))
    
    return jwt_token

def test_emergent_google_auth(results: TestResults):
    """Test 4: Emergent Google Auth"""
    print("\n=== Testing Emergent Google Auth ===")
    
    # Test without X-Session-ID header
    response = make_request("POST", f"{API_BASE}/auth/google/session", expected_status=400)
    if response['success']:
        results.log_pass("POST /api/auth/google/session without X-Session-ID returns 400")
    else:
        results.log_fail("POST /api/auth/google/session no header", "Should return 400")
    
    # Test with fake X-Session-ID header
    fake_headers = {"X-Session-ID": "fake-session-id-12345"}
    response = make_request("POST", f"{API_BASE}/auth/google/session", headers=fake_headers, expected_status=401)
    if response['success']:
        results.log_pass("POST /api/auth/google/session with fake X-Session-ID returns 401")
    else:
        results.log_fail("POST /api/auth/google/session fake header", "Should return 401 for invalid session")

def test_orders_api(results: TestResults, jwt_token: str):
    """Test 5: Orders API"""
    print("\n=== Testing Orders API ===")
    
    # Test orders without auth
    response = make_request("POST", f"{API_BASE}/orders", expected_status=401)
    if response['success']:
        results.log_pass("POST /api/orders without auth returns 401")
    else:
        results.log_fail("POST /api/orders without auth", "Should return 401")
    
    # Create order with auth
    headers = {"Authorization": f"Bearer {jwt_token}"}
    order_data = {
        "restaurant_id": "r1",
        "items": [
            {
                "id": "r1i1",
                "name": "Shawarma poulet XL",
                "price": 11.90,
                "qty": 2
            }
        ],
        "address": "10 Rue de Rivoli, 75001 Paris",
        "payment_method": "card",
        "tip": 2.0
    }
    
    response = make_request("POST", f"{API_BASE}/orders", headers=headers, json_data=order_data)
    if response['success']:
        order = response['data']
        order_id = order.get('id')
        
        # Verify order structure and calculations
        checks = []
        checks.append(('Order ID starts with CL-', order_id and order_id.startswith('CL-')))
        checks.append(('Subtotal = 23.80', order.get('subtotal') == 23.80))
        checks.append(('Service fee = 2.38 (10%)', order.get('service_fee') == 2.38))
        checks.append(('Delivery fee = 2.49', order.get('delivery_fee') == 2.49))
        checks.append(('Tip = 2.00', order.get('tip') == 2.00))
        checks.append(('Total = 30.67', order.get('total') == 30.67))
        
        stripe_split = order.get('stripe_split', {})
        checks.append(('Stripe mode = test', stripe_split.get('mode') == 'test'))
        checks.append(('Restaurant payout = 16.66', stripe_split.get('restaurant_payout') == 16.66))
        checks.append(('Platform fee = 9.52', stripe_split.get('platform_fee') == 9.52))
        checks.append(('Driver payout = 4.49', stripe_split.get('driver_payout') == 4.49))
        checks.append(('Restaurant account = acct_test_r1', stripe_split.get('restaurant_account') == 'acct_test_r1'))
        
        all_passed = all(check[1] for check in checks)
        if all_passed:
            results.log_pass("POST /api/orders creates order with correct calculations")
        else:
            failed_checks = [check[0] for check in checks if not check[1]]
            results.log_fail("POST /api/orders calculations", f"Failed: {', '.join(failed_checks)}")
    else:
        results.log_fail("POST /api/orders with auth", response.get('error', 'Request failed'))
        return
    
    # Test order below minimum
    small_order = {
        "restaurant_id": "r1",
        "items": [{"id": "r1i1", "name": "Small item", "price": 2.50, "qty": 1}],
        "address": "Test Address",
        "payment_method": "card",
        "tip": 0.0
    }
    
    response = make_request("POST", f"{API_BASE}/orders", headers=headers, json_data=small_order, expected_status=400)
    if response['success']:
        results.log_pass("POST /api/orders below minimum returns 400")
    else:
        results.log_fail("POST /api/orders below minimum", "Should return 400 for order below minimum")
    
    # Test get orders list
    response = make_request("GET", f"{API_BASE}/orders", headers=headers)
    if response['success']:
        orders = response['data']
        if isinstance(orders, list) and len(orders) > 0:
            results.log_pass("GET /api/orders returns order list")
        else:
            results.log_fail("GET /api/orders", "Should return list with orders")
    else:
        results.log_fail("GET /api/orders", response.get('error', 'Request failed'))
    
    # Test get specific order
    if order_id:
        response = make_request("GET", f"{API_BASE}/orders/{order_id}", headers=headers)
        if response['success']:
            results.log_pass(f"GET /api/orders/{order_id} returns order")
        else:
            results.log_fail(f"GET /api/orders/{order_id}", response.get('error', 'Request failed'))
        
        # Test get non-existent order
        response = make_request("GET", f"{API_BASE}/orders/CL-FAKEID", headers=headers, expected_status=404)
        if response['success']:
            results.log_pass("GET /api/orders/CL-FAKEID returns 404")
        else:
            results.log_fail("GET /api/orders/CL-FAKEID", "Should return 404")
        
        # Test status updates
        statuses = ["preparing", "ready", "delivering", "delivered"]
        for status in statuses:
            status_data = {"status": status}
            response = make_request("PATCH", f"{API_BASE}/orders/{order_id}/status", 
                                  headers=headers, json_data=status_data)
            if response['success']:
                updated_order = response['data']
                if updated_order.get('status') == status:
                    results.log_pass(f"PATCH /api/orders/{order_id}/status to {status}")
                else:
                    results.log_fail(f"PATCH status to {status}", "Status not updated correctly")
            else:
                results.log_fail(f"PATCH status to {status}", response.get('error', 'Request failed'))

def main():
    """Run all tests"""
    print("🚀 Starting CLIGOO Backend API Tests")
    print(f"Base URL: {BASE_URL}")
    print(f"API Base: {API_BASE}")
    
    results = TestResults()
    
    # Run all test suites
    test_health_endpoint(results)
    test_restaurants_endpoints(results)
    jwt_token = test_jwt_auth(results)
    test_emergent_google_auth(results)
    
    if jwt_token:
        test_orders_api(results, jwt_token)
    else:
        results.log_fail("Orders API tests", "Skipped due to JWT auth failure")
    
    # Print summary
    results.summary()
    
    # Exit with appropriate code
    sys.exit(0 if results.failed == 0 else 1)

if __name__ == "__main__":
    main()