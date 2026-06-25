# Stripe Payment Integration Guide

## 🎯 Overview
Real-time payment processing for your stocks trading application using Stripe. Users can deposit funds to their wallet using credit/debit cards.

## 📋 Backend Setup Complete ✅

The backend has been configured with:
- ✅ Payment routes (`/api/payments/*`)
- ✅ Payment model and schema
- ✅ Stripe integration helper
- ✅ Webhook handler for payment events
- ✅ User wallet management
- ✅ Payment history tracking

## 🔑 Step 1: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or login with your account
3. Go to **Developers → API Keys**
4. Copy your:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

5. Go to **Developers → Webhooks**
   - Click "Add an endpoint"
   - Set endpoint URL to: `https://your-backend-url/api/payments/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Copy the Signing Secret (starts with `whsec_`)

## 🔐 Step 2: Configure Environment Variables

Update `.env` file in backend:

```bash
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
JWT_SECRET=your_jwt_secret_key
```

## 📦 Step 3: Install Dependencies

```bash
cd backend
npm install
```

## 🚀 Step 4: API Endpoints

### 1. Create Payment Intent (Start Payment)
```http
POST /api/payments/create-payment-intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1000,           // Amount in INR (e.g., 1000 = ₹1000)
  "description": "Wallet deposit"
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_xxxxx_secret_xxxxx",
  "paymentIntentId": "pi_xxxxx",
  "paymentId": "mongodb_payment_id",
  "amount": 1000,
  "currency": "inr"
}
```

### 2. Confirm Payment (Process Payment)
```http
POST /api/payments/confirm
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentIntentId": "pi_xxxxx",
  "paymentMethodId": "pm_xxxxx"
}
```

### 3. Get Wallet Info
```http
GET /api/payments/wallet
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "walletBalance": 5000,
  "totalDeposited": 10000,
  "paymentMethods": [
    {
      "id": "pm_xxxxx",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "expMonth": 12,
        "expYear": 2026
      }
    }
  ]
}
```

### 4. Get Payment History
```http
GET /api/payments/history?limit=10&skip=0
Authorization: Bearer {token}
```

### 5. Refund Payment
```http
POST /api/payments/refund
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentIntentId": "pi_xxxxx",
  "amount": 500  // Optional: for partial refund
}
```

## 🎨 Frontend Implementation

### 1. Install Stripe.js Library

```bash
npm install @stripe/react-stripe-js @stripe/js
```

### 2. Create Payment Component

```jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export function PaymentForm({ onSuccess, amount }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onSuccess={onSuccess} amount={amount} />
    </Elements>
  );
}

function CheckoutForm({ onSuccess, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create payment intent
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: amount,
          description: 'Wallet deposit',
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      // Step 2: Confirm payment with card details
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Step 3: Confirm payment
      const confirmResponse = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          paymentIntentId: data.paymentIntentId,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const confirmData = await confirmResponse.json();
      if (confirmData.success) {
        onSuccess(confirmData);
      } else {
        setError(confirmData.error || 'Payment failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#fa755a' },
          },
        }}
      />
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      <button type="submit" disabled={!stripe || loading} style={{ marginTop: '10px' }}>
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </button>
    </form>
  );
}
```

### 3. Add Environment Variable

Create `.env` in frontend directory:
```bash
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
```

### 4. Usage in Your Dashboard

```jsx
import { PaymentForm } from './PaymentForm';

export function WalletDeposit() {
  const [amount, setAmount] = useState('');

  const handlePaymentSuccess = (data) => {
    alert(`Payment successful! Amount: ₹${data.amount}`);
    // Refresh wallet balance
    // Redirect to dashboard
  };

  return (
    <div>
      <h2>Add Funds to Wallet</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in ₹"
      />
      <PaymentForm amount={parseInt(amount)} onSuccess={handlePaymentSuccess} />
    </div>
  );
}
```

## 🧪 Testing with Stripe Test Cards

Use these in test mode:

| Card Number | Expiry | CVC | Status |
|---|---|---|---|
| 4242 4242 4242 4242 | Any future date | Any 3 digits | ✅ Success |
| 4000 0000 0000 0002 | Any future date | Any 3 digits | ❌ Decline |
| 4000 0025 0000 3155 | Any future date | Any 3 digits | ⚠️ Requires auth |

## 📊 Payment Flow

```
User Deposits Money
    ↓
Frontend: Create Payment Intent
    ↓
Backend: Generate client_secret
    ↓
Frontend: Collect card details
    ↓
Frontend: Confirm payment with Stripe
    ↓
Stripe: Process payment
    ↓
Webhook: Payment succeeded event
    ↓
Backend: Update wallet balance
    ↓
Database: Record payment + user wallet updated
    ↓
Frontend: Show success message
```

## 🔒 Security Checklist

- ✅ Never expose Stripe Secret Key on frontend
- ✅ Always verify tokens on backend
- ✅ Use HTTPS in production
- ✅ Handle webhook events securely
- ✅ Store payment records in database
- ✅ Don't store full card details (use payment methods)

## 🐛 Troubleshooting

### "Stripe is not defined"
- Make sure `REACT_APP_STRIPE_PUBLIC_KEY` is set
- Restart development server after adding .env

### "Invalid API Key"
- Check that you're using publishable key (pk_) on frontend
- Check that you're using secret key (sk_) on backend

### Webhook not receiving events
- Verify endpoint URL is publicly accessible
- Check webhook secret is correct
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:8080/api/payments/webhook`

### Payment intent confirmed but balance not updated
- Check database connection
- Verify webhook event was received
- Check error logs in backend

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Webhooks Guide](https://stripe.com/docs/webhooks)

## ✅ What's Ready Now

### Backend:
- Payment creation endpoint
- Payment confirmation endpoint
- Wallet balance retrieval
- Payment history
- Webhook handler
- Refund processing
- User model updated with Stripe fields

### What You Need to Do:

1. **Get Stripe API Keys** (5 minutes)
2. **Set Environment Variables** (2 minutes)
3. **Run `npm install`** in backend (3 minutes)
4. **Create Frontend Payment Component** (using the template above)
5. **Test with Stripe Test Cards** (5 minutes)

Total Setup Time: ~20 minutes! 🚀
