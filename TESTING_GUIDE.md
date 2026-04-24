# Testing Guide - House Rental App

## 🚀 Quick Start Testing

### Prerequisites
```bash
# Install and run the app
npm install
npm run install:all
npm run dev
```

Backend should be running on: `http://localhost:3001`
Frontend should be running on: `http://localhost:5173`

---

## 🔑 Test Credentials

- **Google Account**: johnny.khoihoang@gmail.com
- **Password**: (Use your actual Google password)

---

## 📋 Test Scenarios

### Test 1: Complete Login Flow ⭐

**Objective**: Verify user can login and access dashboard

**Steps**:
1. Open http://localhost:5173
2. Click "Đăng nhập với Google"
3. Use Google account to login
4. Should redirect to `/auth/callback`
5. Should auto-redirect to `/dashboard`
6. Should see "Chào mừng, [Name]! 👋"

**Expected Results**:
- ✅ Login successful
- ✅ Dashboard displays user name
- ✅ Token stored in localStorage
- ✅ No console errors
- ✅ Can refresh page without losing session

**Verification Steps**:
```javascript
// Open DevTools Console (F12)
localStorage.getItem('auth_token')  // Should return JWT token
localStorage.getItem('auth_user')   // Should return user object
```

---

### Test 2: Property Management

**Objective**: Verify property CRUD operations

#### 2.1: Create Property
1. On Dashboard, click "Thêm Nhà Mới" button
2. Fill in form:
   - Tên nhà: "Test House 1"
   - Loại nhà: "Căn hộ"
   - Địa chỉ: "123 Test Street"
   - Giá cho thuê: "5000000"
3. Click "Tạo"

**Expected**: Property appears in list immediately

#### 2.2: View Property Details
1. Click on property from list
2. Should see 8 tabs: Overview, Units, Tenants, Contracts, Finance, Documents, Reminders, Analytics
3. All tabs should load without errors

**Expected**: Property details display correctly

#### 2.3: Edit Property
1. On property details, click "Edit"
2. Change a value (e.g., price)
3. Click "Lưu"

**Expected**: Property updates and shows new value

#### 2.4: Delete Property
1. On property details, click "Delete" button
2. Confirm deletion
3. Should return to dashboard

**Expected**: Property removed from list

---

### Test 3: Unit Management

**Objective**: Verify unit CRUD within property

1. Create a property (Test 2.1)
2. Go to property details → Units tab
3. Should see default "Unit 1" auto-created

#### 3.1: Create Additional Unit
1. Click "Thêm Phòng"
2. Fill in: "Phòng 2", "Room 2", Status: "Available"
3. Click "Tạo"

**Expected**: New unit appears in list

#### 3.2: Update Unit
1. Click on unit
2. Change status or other fields
3. Click "Lưu"

**Expected**: Unit updates successfully

#### 3.3: Delete Unit
1. Click delete on unit
2. Confirm

**Expected**: Unit removed from list

---

### Test 4: Tenant Management

**Objective**: Verify tenant operations

1. Go to property → Tenants tab
2. Click "Thêm Người Thuê"
3. Fill in:
   - Tên: "Test Tenant"
   - Email: "tenant@test.com"
   - Phone: "0901234567"
4. Click "Tạo"

**Expected**: Tenant appears in list

---

### Test 5: Contract Management

**Objective**: Verify contract creation and management

1. Go to property → Contracts tab
2. Click "Tạo Hợp Đồng"
3. Fill in:
   - Unit: Select from dropdown
   - Tenant: Select from dropdown
   - Start Date: Today
   - End Date: Next month
   - Rent Amount: 5000000
4. Click "Tạo"

**Expected**: Contract created and appears in list

---

### Test 6: Financial Tracking

**Objective**: Verify income/expense recording

1. Go to property → Finance tab
2. Click "Thêm Giao Dịch"
3. Fill in:
   - Type: "Income"
   - Category: "Rent"
   - Amount: "5000000"
   - Date: Today
   - Description: "Monthly rent"
4. Click "Lưu"

**Expected**: Transaction appears in list and affects totals

---

### Test 7: Data Isolation (RLS)

**Objective**: Verify users cannot access each other's data

#### 7.1: Browser DevTools Check
1. Open DevTools → Network tab
2. Make an API call to properties
3. Check request headers: Should have `Authorization: Bearer [JWT]`
4. Check response: Should only show current user's properties

#### 7.2: Try Accessing Other User's Data
1. Get another user's property ID
2. Try direct API call:
```javascript
// In console
const token = localStorage.getItem('auth_token');
fetch('http://localhost:3001/api/properties/other-user-id', {
  headers: { Authorization: `Bearer ${token}` }
})
```

**Expected**: Should return 404 or 403 (not unauthorized data)

---

### Test 8: Logout

**Objective**: Verify logout clears session

1. Click user menu → "Đăng xuất"
2. Should redirect to `/login`
3. Token should be cleared

**Verification**:
```javascript
localStorage.getItem('auth_token')  // Should be null
```

---

### Test 9: Error Handling

**Objective**: Verify proper error messages

#### 9.1: Invalid Input
1. Try to create property with empty name
2. Should show validation error

#### 9.2: Network Error
1. Turn off backend server
2. Try to fetch properties
3. Should show error message

#### 9.3: Unauthorized Access
1. Manually remove token from localStorage
2. Try to access protected route
3. Should redirect to login

---

### Test 10: Responsive Design

**Objective**: Verify mobile responsiveness

1. Open DevTools → Toggle Device Toolbar
2. Test on different screen sizes:
   - iPhone 12 (390x844)
   - iPad (768x1024)
   - Desktop (1920x1080)
3. All UI should be readable and functional

**Expected**: No horizontal scrolling, elements properly sized

---

## 🐛 Debugging Tips

### Check Backend Health
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Test API
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### View Network Requests
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Check request/response for each API call

### Check LocalStorage
```javascript
// DevTools Console
console.log(localStorage);
console.log(JSON.parse(localStorage.getItem('auth_user')));
```

### Check JWT Token Validity
```javascript
// Online JWT decoder: https://jwt.io
// Or in console:
JSON.parse(atob(localStorage.getItem('auth_token').split('.')[1]))
```

---

## ✅ Acceptance Criteria

All tests should pass before marking as "ready for production":

- [x] Login works without errors
- [x] Can create/read/update/delete properties
- [x] Can manage units, tenants, contracts
- [x] Financial tracking works
- [x] Token persists after page refresh
- [x] Data isolated by user (RLS)
- [x] Error messages are clear
- [x] Responsive on mobile
- [x] No console errors
- [x] All endpoints protected with JWT

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Test 1 (Login): ☐ Pass ☐ Fail ☐ Issue: ___________
Test 2 (Properties): ☐ Pass ☐ Fail ☐ Issue: ___________
Test 3 (Units): ☐ Pass ☐ Fail ☐ Issue: ___________
Test 4 (Tenants): ☐ Pass ☐ Fail ☐ Issue: ___________
Test 5 (Contracts): ☐ Pass ☐ Fail ☐ Issue: ___________
Test 6 (Transactions): ☐ Pass ☐ Fail ☐ Issue: ___________
Test 7 (Data Isolation): ☐ Pass ☐ Fail ☐ Issue: ___________
Test 8 (Logout): ☐ Pass ☐ Fail ☐ Issue: ___________
Test 9 (Errors): ☐ Pass ☐ Fail ☐ Issue: ___________
Test 10 (Responsive): ☐ Pass ☐ Fail ☐ Issue: ___________

Overall Status: ☐ Ready ☐ Needs Fixes
Notes: ___________________________________________________________
```
