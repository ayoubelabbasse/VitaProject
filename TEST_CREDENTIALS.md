# 🔐 Test Credentials

## Default Users

### Admin User
- **Email**: `admin@vita.ma`
- **Password**: `admin123`
- **Role**: Admin
- **Redirect After Login**: `/admin` (Admin Dashboard)

### Customer User
- **Email**: `user@test.com`
- **Password**: `user123`
- **Role**: Customer
- **Redirect After Login**: `/` (Home)

## Creating New Users

### Registration
1. Navigate to `/register`
2. Fill in the form:
   - First Name
   - Last Name
   - Email
   - Phone
   - Password (min 8 characters)
   - Confirm Password
3. Click "Create Account"
4. **Redirect**: 
   - Admin role → `/admin`
   - Customer role → `/`

## Guest Checkout

Users can checkout **without logging in**:
1. Add products to cart
2. Go to `/checkout`
3. Fill in shipping information including **email address**
4. Complete payment
5. Order will be processed as guest

**Note**: Email is required for guest checkout to receive order confirmation.

## Login Features

### ✅ User Initials Display
- When logged in, user initials appear in header
- Click to see user menu:
  - User name and email
  - Admin Dashboard (if admin)
  - My Orders
  - Logout

### ✅ Navigation Without Login
- Users can browse products
- Users can add to cart
- Users can checkout as guest
- Login is optional for shopping

### ✅ Redirects
- Admin login → `/admin`
- Customer login → `/`
- Admin registration → `/admin`
- Customer registration → `/`
- Logout → `/`

## Testing Checklist

- [x] Admin can login and access dashboard
- [x] Customer can login and access home
- [x] Registration creates new user
- [x] User initials display in header
- [x] Guest checkout works with email
- [x] Shopping works without login
- [x] Proper redirects after login/register
- [x] Logout works correctly

## Reset Users

If you need to reset users to default:

```bash
node scripts/fix-users.js
```

This will recreate:
- `admin@vita.ma` / `admin123`
- `user@test.com` / `user123`
