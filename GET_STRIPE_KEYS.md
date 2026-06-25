# 📌 Stripe API Keys - Step-by-Step Guide

## 🎯 After You Login to Stripe Dashboard

Once you're logged in, follow these exact steps to get your API keys:

---

## Step 1️⃣: Go to Developers Menu

```
Dashboard Home
    ↓
Left Sidebar → Click "Developers" (or "Developer")
    ↓
You'll see a submenu with options
```

Look for these options in the left sidebar:
- `Developers` (main menu)
- `API keys` (submenu)
- `Webhooks` (submenu)

---

## Step 2️⃣: Navigate to API Keys

```
Click: Developers → API keys
```

You should see a page with:
- **Title:** "API Keys"
- **View:** You should be in "Standard Keys" (NOT Restricted Keys)
- **Mode:** Make sure it says "Test mode" (NOT Live mode)
```
┌─────────────────────────────────────┐
│ 🔘 Test mode  ⚪ Live mode          │
│                                     │
│ Make sure TEST MODE is selected!    │
└─────────────────────────────────────┘
```

---

## Step 3️⃣: Copy Your Test Keys

On the API Keys page, you'll see:

### 📋 Publishable Key
```
┌──────────────────────────────────────────┐
│ Publishable key                          │
│ pk_test_51.....................         │ ← COPY THIS
│ [Copy Button]                            │
└──────────────────────────────────────────┘
```
- Click the copy button
- Paste it somewhere safe
- **Keep it safe** - it's public but needed

### 🔑 Secret Key  
```
┌──────────────────────────────────────────┐
│ Secret key                               │
│ sk_test_51.....................         │ ← COPY THIS
│ [Copy Button] [Reveal]                   │
└──────────────────────────────────────────┘
```
- Click "Reveal" if needed
- Click the copy button
- Paste it somewhere safe
- **⚠️ KEEP THIS SECRET!** Never share it

---

## Step 4️⃣: Save the Keys

Create a text file on your computer (e.g., `stripe-keys-temp.txt`) and paste:

```
STRIPE_PUBLIC_KEY=pk_test_51.....
STRIPE_SECRET_KEY=sk_test_51.....
```

**⚠️ IMPORTANT:** 
- Don't commit this to Git
- Delete this file after adding to .env
- Never share these keys

---

## Step 5️⃣: Get Webhook Secret

1. Still in **Developers** section
2. Click **"Webhooks"** (in the submenu)
3. You should see: **"Endpoints"** section

```
┌──────────────────────────────────────────┐
│ Endpoints                                │
│                                          │
│ No endpoints yet? Click "Add an endpoint"│
│ [Add an endpoint] button                 │
└──────────────────────────────────────────┘
```

4. Click **"Add an endpoint"**

---

## Step 6️⃣: Configure Webhook Endpoint

A form will open:

```
┌──────────────────────────────────────────┐
│ Endpoint URL *                           │
│ ┌──────────────────────────────────────┐ │
│ │ http://localhost:8080/api/payments.. │ │
│ │ webhook                              │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ For now, use (for local testing):       │
│ http://localhost:8080/api/payments/webhook
│                                          │
│ Later (production):                      │
│ https://your-live-domain/api/payments/webhook
└──────────────────────────────────────────┘
```

Paste:
```
http://localhost:8080/api/payments/webhook
```

---

## Step 7️⃣: Select Webhook Events

Below the URL field, click **"Select events"** or **"Select all events"**

You need these events checked:
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`  
- ✅ `charge.refunded`

(Click on each to check them)

---

## Step 8️⃣: Add & Get Webhook Secret

1. Click **"Add endpoint"** button
2. You'll see your endpoint created!
3. Click on the endpoint row
4. You'll see: **"Signing secret"**

```
┌──────────────────────────────────────────┐
│ Signing secret                           │
│ whsec_test_51.....................      │ ← COPY THIS
│ [Copy] [Reveal]                          │
└──────────────────────────────────────────┘
```

5. Click **"Copy"** or **"Reveal"** then copy it

---

## ✅ Final Keys You Should Have

```
STRIPE_PUBLIC_KEY=pk_test_51.....
STRIPE_SECRET_KEY=sk_test_51.....
STRIPE_WEBHOOK_SECRET=whsec_test_51.....
```

Save all three!

---

## 🔧 Next: Add to Backend .env

Once you have all 3 keys, do this:

### 1. Open backend/.env
```bash
# Navigate to backend folder
cd backend

# Open .env file in text editor
# Add or update these lines:

STRIPE_PUBLIC_KEY=pk_test_51..... # Your public key
STRIPE_SECRET_KEY=sk_test_51.....  # Your secret key  
STRIPE_WEBHOOK_SECRET=whsec_test_51.....  # Your webhook secret
JWT_SECRET=your_jwt_secret_key     # Keep this or create new
```

### 2. Save the file

### 3. Install packages (if not done)
```bash
npm install
```

### 4. Start backend
```bash
npm start
```

**You should see:**
```
App started!
DB started!
```

---

## 🎨 Next: Add to Frontend .env

### 1. Create/Open dashboard/.env
```bash
# Go to dashboard folder
cd dashboard

# Create .env file if it doesn't exist
# Add this line:
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_51.....
```

### 2. Install Stripe packages
```bash
npm install @stripe/react-stripe-js @stripe/js
```

### 3. Start dashboard
```bash
npm start
```

---

## 🧪 Test the Payment Flow

1. Both backend and frontend are running
2. Go to dashboard in browser
3. Find "Add Funds to Wallet" section
4. Enter amount: `500` (₹500)
5. Click "Proceed to Payment"
6. Card form appears

Use **test card:**
```
Card Number: 4242 4242 4242 4242
Expiry:      12/26
CVC:         123
```

7. Click "Pay ₹500"
8. ✅ Should show success!

---

## 🆘 Troubleshooting

### Keys not working?
- Make sure you copied the FULL key
- Make sure it starts with `pk_test_` or `sk_test_`
- Make sure mode is "Test mode" (not Live)

### Can't see endpoints in Webhooks?
- Make sure you're in Developers → Webhooks
- Click "Add an endpoint"
- Sometimes it takes a moment to load

### Payment still not working?
1. Check backend is running: `npm start` in backend/
2. Check frontend is running: `npm start` in dashboard/
3. Check .env files have all keys
4. Check browser console (F12) for errors
5. Check backend terminal for errors

---

## 📱 Dashboard Path

When logged into Stripe:

```
Home
  ↓
Left Sidebar: "Developers"
  ↓
Submenu appears:
  - API keys     ← GO HERE FIRST
  - Webhooks     ← GO HERE SECOND
  - Logs
  - Events
  - More...
```

---

## ✨ You're All Set!

Once you have the 3 keys and add them to .env files, everything will work!

Follow the steps above and let me know when you have the keys! 🚀
