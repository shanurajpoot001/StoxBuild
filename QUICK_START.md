# Stripe Integration - Quick Start Guide

## ✅ What We've Done (Backend Ready)

### Created Files:
1. ✅ `backend/schemas/PaymentSchema.js` - Payment data model
2. ✅ `backend/model/PaymentModel.js` - Payment model
3. ✅ `backend/middleware/authMiddleware.js` - JWT authentication
4. ✅ `backend/utils/stripeHelper.js` - Stripe API helper functions
5. ✅ `backend/routes/payments.js` - All payment endpoints
6. ✅ `backend/schemas/UserSchema.js` - Updated with Stripe fields
7. ✅ `backend/index.js` - Integrated payment routes
8. ✅ `dashboard/src/components/StripePaymentForm.js` - React payment component

### Updated Files:
1. ✅ `backend/package.json` - Added Stripe dependency
2. ✅ `backend/.env.example` - Added Stripe environment variables

---

## 🚀 Quick Start (20 minutes)

### 1️⃣ Backend Setup (5 minutes)

```bash
cd backend
npm install
```

Update `.env` with your Stripe keys:
```bash
STRIPE_PUBLIC_KEY=pk_test_xxxxx  # From Stripe Dashboard
STRIPE_SECRET_KEY=sk_test_xxxxx  # From Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_xxxxx # From Stripe Dashboard
JWT_SECRET=your_secret_key
```

Start the backend:
```bash
npm start
```

You should see: `App started! DB started!`

---

### 2️⃣ Frontend Setup (5 minutes)

#### In Dashboard App:

```bash
cd dashboard
npm install @stripe/react-stripe-js @stripe/js
```

Create `.env`:
```bash
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

Update `src/index.js` to wrap with Stripe provider:

```jsx
import { PaymentFormWrapper } from './components/StripePaymentForm';

// Wrap your app
ReactDOM.render(
  <PaymentFormWrapper>
    <App />
  </PaymentFormWrapper>,
  document.getElementById('root')
);
```

---

### 3️⃣ Add Payment UI to Dashboard (5 minutes)

In your Dashboard component (e.g., `dashboard/src/components/Dashboard.js`):

```jsx
import { DepositFunds, PaymentHistory } from './StripePaymentForm';

export function Dashboard() {
  return (
    <div>
      {/* Your existing dashboard content */}
      
      {/* Add Payment Section */}
      <section style={{ marginTop: '40px' }}>
        <h2>Wallet</h2>
        <DepositFunds 
          onSuccess={(data) => {
            console.log('Payment successful:', data);
            // Refresh your dashboard/wallet
          }}
          onError={(error) => {
            console.error('Payment failed:', error);
          }}
        />
        
        <hr style={{ margin: '30px 0' }} />
        
        <PaymentHistory />
      </section>
    </div>
  );
}
```

Start the dashboard:
```bash
npm start
```

---

## 🧪 Test the Integration

### Using Stripe Test Cards:

| Card | Expiry | CVC | Result |
|------|--------|-----|--------|
| 4242 4242 4242 4242 | 12/26 | 123 | ✅ Success |
| 4000 0000 0000 0002 | 12/26 | 123 | ❌ Declined |

### Payment Flow:

1. Enter amount (minimum ₹100)
2. Click "Proceed to Payment"
3. Enter test card details
4. Click "Pay ₹{amount}"
5. See success message
6. Wallet balance updates
7. Payment appears in history

---

## 🔌 API Endpoints Reference

### Create Payment Intent
```bash
curl -X POST http://localhost:8080/api/payments/create-payment-intent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "description": "Wallet deposit"}'
```

### Confirm Payment
```bash
curl -X POST http://localhost:8080/api/payments/confirm \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paymentIntentId": "pi_xxx", "paymentMethodId": "pm_xxx"}'
```

### Get Wallet
```bash
curl http://localhost:8080/api/payments/wallet \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Payment History
```bash
curl "http://localhost:8080/api/payments/history?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔒 Production Checklist

Before going live:

- [ ] Switch to live Stripe keys (pk_live_, sk_live_)
- [ ] Set HTTPS for all URLs
- [ ] Configure webhook endpoint publicly
- [ ] Test with real payments
- [ ] Set up payment confirmation emails
- [ ] Monitor Stripe dashboard for disputes
- [ ] Enable 3D Secure for fraud prevention

---

## 🐛 Troubleshooting

### Issue: "STRIPE_PUBLIC_KEY is not defined"
**Solution:** Add `.env` file in dashboard with `REACT_APP_STRIPE_PUBLIC_KEY`

### Issue: "Stripe is not loaded"
**Solution:** Make sure `PaymentFormWrapper` wraps your app in `index.js`

### Issue: "Invalid token"
**Solution:** Ensure user is logged in and token is in localStorage

### Issue: Payment succeeds but wallet doesn't update
**Solution:** 
- Check backend logs for errors
- Verify MongoDB connection
- Restart backend server

### Issue: "Missing Stripe keys"
**Solution:** Add keys to `.env` in backend directory

---

## 📚 File Structure

```
backend/
├── middleware/
│   └── authMiddleware.js       ← JWT verification
├── model/
│   └── PaymentModel.js         ← Payment model
├── routes/
│   ├── auth.js
│   └── payments.js             ← Payment endpoints
├── schemas/
│   ├── PaymentSchema.js        ← Payment schema
│   └── UserSchema.js           ← Updated with Stripe
├── utils/
│   └── stripeHelper.js         ← Stripe API calls
├── package.json                ← Updated with stripe
├── .env.example                ← Updated
└── index.js                    ← Payment routes added

dashboard/
├── src/
│   ├── components/
│   │   └── StripePaymentForm.js ← Payment UI
│   └── index.js                 ← Wrap with PaymentFormWrapper
├── package.json
└── .env                         ← Add STRIPE_PUBLIC_KEY
```

---

## 🎯 Next Steps

1. **Get Stripe Account** - https://dashboard.stripe.com/register
2. **Get API Keys** - Developers → API Keys in Stripe Dashboard
3. **Follow Quick Start above**
4. **Test with test cards**
5. **Deploy to production** when ready

---

## ✨ Features Included

✅ Real-time payment processing
✅ Wallet balance tracking
✅ Payment history
✅ Multiple payment methods support
✅ Refund processing
✅ Webhook event handling
✅ Error handling & validation
✅ Test & production mode support
✅ Mobile responsive UI
✅ Secure JWT authentication

---

## 📞 Support

For issues:
1. Check [Stripe Documentation](https://stripe.com/docs)
2. Review error messages in backend logs
3. Check browser console for frontend errors
4. Verify `.env` variables are set correctly
5. Restart both frontend and backend servers

---

**You're all set! 🚀 Happy trading!**
