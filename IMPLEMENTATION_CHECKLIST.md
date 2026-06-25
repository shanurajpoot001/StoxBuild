# 🚀 Stripe Integration - Implementation Checklist

## ✅ Backend Setup Completed

These items are already done for you:

- [x] Install Stripe package (`stripe` npm package)
- [x] Create Payment Schema (`backend/schemas/PaymentSchema.js`)
- [x] Create Payment Model (`backend/model/PaymentModel.js`)
- [x] Create Auth Middleware (`backend/middleware/authMiddleware.js`)
- [x] Create Stripe Helper Utils (`backend/utils/stripeHelper.js`)
- [x] Create Payment Routes (`backend/routes/payments.js`)
- [x] Update User Schema with Stripe fields
- [x] Add Payment routes to Express app
- [x] Generate complete documentation

---

## 📋 Your Checklist (Follow in Order)

### Phase 1: Stripe Account Setup (5 minutes)

- [ ] Go to https://dashboard.stripe.com/register
- [ ] Create Stripe account (or login if you have one)
- [ ] Verify email address
- [ ] Complete account setup
- [ ] Set up business details (India, currency: INR)

### Phase 2: Get API Keys (5 minutes)

- [ ] Login to Stripe Dashboard
- [ ] Click "Developers" in the left menu
- [ ] Click "API Keys"
- [ ] Find "Standard Keys" section
- [ ] **Copy Publishable Key** → Save it (starts with `pk_test_`)
- [ ] **Copy Secret Key** → Save it (starts with `sk_test_`)
- [ ] Keep these secure ⚠️ NEVER commit to Git

### Phase 3: Setup Webhook (5 minutes)

- [ ] Go to Developers → Webhooks
- [ ] Click "Add an endpoint"
- [ ] In "Endpoint URL" field, enter: `http://localhost:8080/api/payments/webhook`
  - Later change to: `https://your-live-backend-url/api/payments/webhook`
- [ ] Click "Select events"
- [ ] Check these events:
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
  - [ ] `charge.refunded`
- [ ] Click "Add endpoint"
- [ ] **Copy Signing Secret** → Save it (starts with `whsec_`)

### Phase 4: Backend Configuration (5 minutes)

- [ ] Go to `backend/` folder
- [ ] Open `.env` file
- [ ] Add these lines:
```env
STRIPE_PUBLIC_KEY=pk_test_xxxxx_from_phase2
STRIPE_SECRET_KEY=sk_test_xxxxx_from_phase2
STRIPE_WEBHOOK_SECRET=whsec_xxxxx_from_phase3
JWT_SECRET=your_existing_secret_or_new_one
```
- [ ] Save `.env` file
- [ ] Run `npm install` (if not done yet)
- [ ] Start backend: `npm start`
- [ ] You should see: `App started! DB started!`

### Phase 5: Frontend Configuration (5 minutes)

- [ ] Go to `dashboard/` folder
- [ ] Create `.env` file if it doesn't exist
- [ ] Add this line:
```env
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxxxx_from_phase2
```
- [ ] Install Stripe packages:
```bash
npm install @stripe/react-stripe-js @stripe/js
```
- [ ] Update `src/index.js` to wrap app with Stripe:
```jsx
import { PaymentFormWrapper } from './components/StripePaymentForm';

// Change this:
// ReactDOM.render(<App />, document.getElementById('root'));

// To this:
ReactDOM.render(
  <PaymentFormWrapper>
    <App />
  </PaymentFormWrapper>,
  document.getElementById('root')
);
```
- [ ] Save the file
- [ ] Start frontend: `npm start`

### Phase 6: Add Payment UI to Dashboard (5 minutes)

- [ ] Open `dashboard/src/components/Dashboard.js` (or your main dashboard component)
- [ ] Add this import at the top:
```jsx
import { DepositFunds, PaymentHistory } from './StripePaymentForm';
```
- [ ] Add this section in your JSX (where you want payments):
```jsx
<section style={{ marginTop: '40px', maxWidth: '500px', margin: '0 auto' }}>
  <h2>💰 Wallet</h2>
  <DepositFunds 
    onSuccess={(data) => {
      console.log('Payment successful!', data);
      // Refresh wallet display here
    }}
    onError={(error) => {
      console.error('Payment failed:', error);
    }}
  />
  
  <hr style={{ margin: '30px 0' }} />
  
  <PaymentHistory />
</section>
```
- [ ] Save the file
- [ ] Frontend will hot-reload

### Phase 7: Test Payment (10 minutes)

- [ ] Both frontend and backend are running
- [ ] Navigate to your Dashboard in the browser
- [ ] You should see "Add Funds to Wallet" section
- [ ] Enter amount: `500` (₹500)
- [ ] Click "Proceed to Payment"
- [ ] A card form appears
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Enter expiry: `12/26`
- [ ] Enter CVC: `123`
- [ ] Click "Pay ₹500"
- [ ] ✅ You should see "Payment successful! ₹500 added to wallet."
- [ ] Check "Payment History" - payment should appear
- [ ] Open browser developer tools (F12)
- [ ] Go to Application → Storage → LocalStorage
- [ ] Verify balance increased

### Phase 8: Test Error Handling (5 minutes)

- [ ] Try deposit with decline card: `4000 0000 0000 0002`
- [ ] ✅ Should show error message
- [ ] Try with expired card: use past date like `01/20`
- [ ] ✅ Should show validation error
- [ ] Try with low amount: `50`
- [ ] ✅ Should show "Minimum deposit is ₹100"

### Phase 9: Verify Webhook (5 minutes)

- [ ] Open Stripe Dashboard
- [ ] Go to Developers → Webhooks
- [ ] Find your endpoint
- [ ] Click on it
- [ ] Scroll to "Events"
- [ ] You should see recent events from your test
- [ ] ✅ Should have `payment_intent.succeeded` events

### Phase 10: (Optional) Local Webhook Testing

- [ ] Install Stripe CLI from: https://stripe.com/docs/stripe-cli
- [ ] Run in a new terminal:
```bash
stripe listen --forward-to localhost:8080/api/payments/webhook
```
- [ ] Copy the webhook signing secret it shows
- [ ] Update `STRIPE_WEBHOOK_SECRET` in your `.env`
- [ ] Restart backend
- [ ] Now test payments and see real-time webhook events

---

## 📊 Success Criteria

After completing all phases, verify:

- [x] Stripe account created ✅
- [x] API keys obtained ✅
- [x] Webhook configured ✅
- [x] Backend running without errors ✅
- [x] Frontend running without errors ✅
- [x] Payment form visible in dashboard ✅
- [x] Test payment processed successfully ✅
- [x] Payment appears in history ✅
- [x] Wallet balance updated ✅
- [x] Webhook events received ✅

---

## 🔧 Troubleshooting During Setup

### Issue: "Cannot find module 'stripe'"
**Solution:**
```bash
cd backend
npm install stripe
```

### Issue: "STRIPE_PUBLIC_KEY is not defined"
**Solution:**
- Add `.env` file in `dashboard/` folder
- Add: `REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxxxx`
- Restart frontend

### Issue: "TypeError: stripePromise is not defined"
**Solution:**
- Make sure `.env` file has `REACT_APP_STRIPE_PUBLIC_KEY`
- Restart development server
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Payment form not showing
**Solution:**
- Check browser console for errors (F12)
- Verify `PaymentFormWrapper` wraps your app in `index.js`
- Restart frontend

### Issue: "Invalid payment method"
**Solution:**
- Use test cards from Stripe docs (4242 4242... is correct)
- Verify card format: 16 digits, MM/YY, 3-digit CVC

### Issue: Webhook not working
**Solution:**
- Check webhook URL is exactly: `http://localhost:8080/api/payments/webhook`
- Verify backend is running
- Check backend logs for errors
- Use Stripe CLI to test locally

---

## 📱 After Setup: Next Steps

Once everything is working:

1. **Integrate Wallet Display** in your dashboard
   - Show current balance
   - Show total deposited
   - Show recent transactions

2. **Add Withdrawal Feature** (optional)
   - Let users withdraw to bank
   - Update wallet balance
   - Track withdrawals

3. **Add Transaction Fees** (optional)
   - Charge 1-2% on deposits
   - Show fee breakdown

4. **Email Notifications** (optional)
   - Send confirmation emails
   - Send receipt with transaction ID

5. **Payment Analytics** (optional)
   - Track total deposits
   - Monitor failed payments
   - Dashboard for metrics

---

## 🔐 Security Reminders

- ⚠️ **Never** expose `STRIPE_SECRET_KEY` on frontend
- ⚠️ **Never** commit `.env` to Git
- ⚠️ **Always** use HTTPS in production
- ⚠️ **Always** verify tokens on backend
- ✅ Stripe handles PCI compliance
- ✅ Use webhooks to verify payments
- ✅ Store payment records in database

---

## 📊 File Locations Quick Reference

```
Backend Config:     backend/.env
Frontend Config:    dashboard/.env
Payment Component:  dashboard/src/components/StripePaymentForm.js
Payment Routes:     backend/routes/payments.js
Payment Schema:     backend/schemas/PaymentSchema.js
User Schema:        backend/schemas/UserSchema.js
Auth Middleware:    backend/middleware/authMiddleware.js
Stripe Utils:       backend/utils/stripeHelper.js
```

---

## 🎯 Daily Checklist (After Setup)

### Every Day
- [ ] Check Stripe dashboard for new payments
- [ ] Monitor for failed payments
- [ ] Check backend logs for errors
- [ ] Verify database is working

### Every Week
- [ ] Review payment statistics
- [ ] Check for any disputes
- [ ] Test payment flow
- [ ] Backup database

### Before Production
- [ ] Get live Stripe keys (pk_live_, sk_live_)
- [ ] Update all .env files with live keys
- [ ] Test with real credit card
- [ ] Set up monitoring/alerts
- [ ] Enable 3D Secure
- [ ] Test webhook with live URL
- [ ] Backup database

---

## 📞 Getting Help

### If Something's Not Working:

1. **Check the docs:**
   - QUICK_START.md
   - STRIPE_SETUP_GUIDE.md
   - DATABASE_SCHEMA.md

2. **Check logs:**
   - Backend terminal output
   - Browser console (F12)
   - Stripe dashboard logs

3. **Check Stripe Dashboard:**
   - Developers → Webhook logs
   - See failed webhook events

4. **Ask on Stripe Support:**
   - https://support.stripe.com

---

## ✨ You're Almost Done!

Follow the checklist above and you'll have real-time payments working in ~30 minutes! 

```
Phase 1  [████] Stripe Account
Phase 2  [████] Get Keys
Phase 3  [████] Setup Webhook
Phase 4  [████] Backend Config
Phase 5  [████] Frontend Config
Phase 6  [████] Add UI
Phase 7  [████] Test Payment
Phase 8  [████] Test Errors
Phase 9  [████] Verify Webhook
Phase 10 [████] All Done! 🎉
```

**Happy payment processing! 💳✨**
