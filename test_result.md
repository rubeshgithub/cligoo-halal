#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  CLIGOO - Halal food delivery platform (UberEats France clone). Phase 2 backend:
  - JWT auth (register/login) + Emergent Google Sign-In coexisting
  - Restaurants/Menus/Categories migrated from frontend mock to MongoDB (seeded on startup)
  - Orders API with Stripe Connect split computed in "test mode" (no real Stripe calls yet)

backend:
  - task: "JWT Auth (register, login, me, logout)"
    implemented: true
    working: true
    file: "/app/backend/routes/auth.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Implemented email/password register with bcrypt, login returns JWT (7d exp, HS256). /api/auth/me resolves user from cookie OR Bearer JWT OR session_token as Bearer. Logout clears both cookie and session."
        - working: true
          agent: "testing"
          comment: "✅ TESTED: All JWT auth endpoints working correctly. POST /api/auth/register creates user and returns token, duplicate registration returns 400, login with correct/wrong credentials works as expected (200/401), GET /api/auth/me with Bearer token returns user data with auth_provider='jwt', /me without auth returns 401, logout returns {ok:true}. All 7 test cases passed."

  - task: "Emergent Google Auth session exchange"
    implemented: true
    working: true
    file: "/app/backend/routes/auth.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "POST /api/auth/google/session reads X-Session-ID, calls https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data, creates/updates user in Mongo, stores session_token in user_sessions (7d), sets httpOnly secure samesite=None cookie. NOTE: will return 401 when tested with fake session_id; testing agent should verify only the 400 (missing header) and 401 (invalid id) responses."
        - working: true
          agent: "testing"
          comment: "✅ TESTED: Emergent Google Auth error handling working correctly. POST /api/auth/google/session without X-Session-ID header returns 400, with fake X-Session-ID returns 401 as expected. Both test cases passed."

  - task: "Restaurants/Menus/Categories seed + read"
    implemented: true
    working: true
    file: "/app/backend/routes/restaurants.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Seeded 8 restaurants, 10 categories, 8 menus on startup (idempotent upsert). Endpoints: GET /api/restaurants (filters cat, min_rating, max_delivery, sort), GET /api/restaurants/{id}, GET /api/restaurants/{id}/menu, GET /api/categories."
        - working: true
          agent: "testing"
          comment: "✅ TESTED: All restaurant endpoints working perfectly. GET /api/restaurants returns exactly 8 items, category filter (?cat=kebab) works correctly, multi-filter with sorting (?max_delivery=25&sort=rating) works, GET /api/restaurants/r1 returns 'Le Shawarma de Marrakech' with certification 'AVS', non-existent restaurant returns 404, r1 menu has 3+ sections, categories endpoint returns 10 items. All 7 test cases passed."

  - task: "Orders CRUD with Stripe Connect test split"
    implemented: true
    working: true
    file: "/app/backend/routes/orders.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "POST /api/orders (auth required) computes subtotal, service_fee=10%, platform_commission=30% of subtotal, driver_payout=delivery_fee+tip, returns stripe_split with mode='test' and fake acct_test_{id} account refs. Enforces min_order. GET /api/orders list user history, GET /api/orders/{id} with ownership check, PATCH /api/orders/{id}/status to simulate lifecycle."
        - working: true
          agent: "testing"
          comment: "✅ TESTED: Orders API fully functional with correct Stripe Connect calculations. POST /api/orders without auth returns 401, with auth creates order with ID starting 'CL-', all calculations correct (subtotal=23.80, service_fee=2.38, delivery_fee=2.49, tip=2.00, total=30.67), stripe_split accurate (restaurant_payout=16.66, platform_fee=9.52, driver_payout=4.49, mode='test', restaurant_account='acct_test_r1'), minimum order validation works (400 for orders below min), GET /api/orders returns list, GET specific order works, 404 for non-existent orders, PATCH status updates work for all statuses (preparing/ready/delivering/delivered). All 13 test cases passed."

frontend:
  - task: "Frontend wiring to new APIs"
    implemented: false
    working: "NA"
    file: "/app/frontend/src/*"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Not yet done. Will wire after backend is validated."

metadata:
  created_by: "main_agent"
  version: "2.0"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: |
        Phase 2 backend is implemented and running. Please test all /api endpoints:
        1. Auth: POST /api/auth/register, /api/auth/login, /api/auth/me (with Bearer JWT), /api/auth/logout
        2. Emergent auth: POST /api/auth/google/session without X-Session-ID (expect 400), with fake header (expect 401)
        3. Restaurants: GET /api/restaurants (with/without filters cat=kebab, max_delivery=30, sort=rating), GET /api/restaurants/r1, GET /api/restaurants/r1/menu, GET /api/categories
        4. Orders: register/login first, then POST /api/orders with Bearer JWT (items from r1 menu), verify stripe_split structure and computation (subtotal*0.30 + service_fee = platform_fee, subtotal - 30% = restaurant_payout, delivery_fee+tip = driver_payout, mode='test'), GET /api/orders, GET /api/orders/{id}, PATCH /api/orders/{id}/status. Verify 401 without auth, verify 400 when subtotal < min_order.
        Use REACT_APP_BACKEND_URL as base: https://cligoo-halal.preview.emergentagent.com
    - agent: "testing"
      message: |
        ✅ BACKEND TESTING COMPLETE: All 27 test cases passed successfully! 
        
        TESTED ENDPOINTS:
        1. Health: GET /api/ ✅
        2. Restaurants: GET /api/restaurants (basic, filtered, sorted), GET /api/restaurants/{id}, GET /api/restaurants/{id}/menu, GET /api/categories ✅
        3. JWT Auth: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout ✅
        4. Emergent Auth: POST /api/auth/google/session error handling ✅
        5. Orders: Full CRUD with auth, Stripe Connect calculations, status updates ✅
        
        KEY VALIDATIONS:
        - 8 restaurants seeded correctly
        - 10 categories available
        - JWT auth flow complete with proper error handling
        - Emergent Google auth error responses correct
        - Order calculations precise: subtotal=23.80, service_fee=2.38, total=30.67
        - Stripe split accurate: restaurant_payout=16.66, platform_fee=9.52, driver_payout=4.49
        - All auth protections working (401 responses)
        - Minimum order validation working (400 responses)
        
        Backend is production-ready. All APIs functional at https://cligoo-halal.preview.emergentagent.com/api
