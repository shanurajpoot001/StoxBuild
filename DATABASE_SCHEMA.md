# Database Schema Changes

## 📊 Updated User Schema

The User model now includes Stripe payment information:

```javascript
{
  _id: ObjectId,
  name: String,                    // User name
  email: String (unique),          // User email
  passwordHash: String,            // Hashed password
  stripeCustomerId: String,        // Stripe customer ID (created on first payment)
  walletBalance: Number,           // Current wallet balance (₹)
  totalDeposited: Number,          // Total amount deposited (₹)
  paymentMethods: [
    {
      stripePaymentMethodId: String, // Stripe payment method ID
      type: "card",                 // Payment method type
      isDefault: Boolean,           // Is default payment method
      lastFour: String,            // Last 4 digits of card
      brand: String,               // Card brand (Visa, Mastercard, etc)
      expiryMonth: Number,         // Expiry month
      expiryYear: Number,          // Expiry year
      addedAt: Date                // When the payment method was added
    }
  ],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 💳 Payment Schema (NEW)

New collection for tracking all payments:

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),              // Reference to user
  stripePaymentIntentId: String (unique),   // Stripe payment intent ID
  stripeSessionId: String,                  // Stripe session ID (if applicable)
  amount: Number,                           // Amount in INR (e.g., 1000 = ₹1000)
  currency: String ("inr"),                 // Payment currency
  status: String,                           // "pending", "succeeded", "failed", "canceled"
  paymentMethod: String,                    // "card", etc
  description: String,                      // "Wallet deposit"
  metadata: {
    transactionType: String,                // "deposit", "withdrawal", etc
    customData: Mixed                       // Any custom data
  },
  failureReason: String,                    // Reason if payment failed
  receipt: {
    receiptUrl: String,                     // Stripe receipt URL
    receiptNumber: String                   // Receipt number
  },
  refund: {
    refundId: String,                       // Refund ID if refunded
    refundedAt: Date,                       // When refunded
    refundReason: String                    // Reason for refund
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🔍 Database Indexes

### User Collection:
```javascript
{
  email: 1        // Unique index for faster lookups
}
```

### Payment Collection:
```javascript
{
  userId: 1,
  createdAt: -1  // Find recent payments for a user
}

{
  status: 1      // Find payments by status
}

{
  stripePaymentIntentId: 1  // Unique index for payment intent lookup
}
```

---

## 📈 Example Data

### User Document:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Raj Kumar",
  "email": "raj@example.com",
  "passwordHash": "$2a$10$...",
  "stripeCustomerId": "cus_1234567890",
  "walletBalance": 5000,
  "totalDeposited": 10000,
  "paymentMethods": [
    {
      "stripePaymentMethodId": "pm_1234567890",
      "type": "card",
      "isDefault": true,
      "lastFour": "4242",
      "brand": "visa",
      "expiryMonth": 12,
      "expiryYear": 2026,
      "addedAt": "2026-01-15T10:30:00.000Z"
    }
  ],
  "createdAt": "2026-01-10T08:00:00.000Z",
  "updatedAt": "2026-06-25T15:30:00.000Z"
}
```

### Payment Document:
```json
{
  "_id": "507f191e810c19729de860ea",
  "userId": "507f1f77bcf86cd799439011",
  "stripePaymentIntentId": "pi_1234567890abcdefgh",
  "stripeSessionId": null,
  "amount": 5000,
  "currency": "inr",
  "status": "succeeded",
  "paymentMethod": "card",
  "description": "Wallet deposit",
  "metadata": {
    "transactionType": "deposit",
    "customData": null
  },
  "failureReason": null,
  "receipt": {
    "receiptUrl": "https://pay.stripe.com/receipts/...",
    "receiptNumber": "ch_1234567890"
  },
  "refund": null,
  "createdAt": "2026-06-25T10:30:00.000Z",
  "updatedAt": "2026-06-25T10:30:00.000Z"
}
```

---

## 🔄 Payment Status Flow

```
Payment Created
    ↓
Status: "pending"
    ↓
User confirms payment with card
    ↓
Stripe processes payment
    ↓
↙─────────────┬────────────┘
│             │
✅ Succeeded  ❌ Failed
│             │
Status:       Status:
"succeeded"   "failed"
│             │
Wallet        No change
Updated       to wallet
│             │
Payment       failureReason
recorded      recorded
```

---

## 💾 Data Retention

- **Payments**: Keep permanently (for audit trail)
- **User Wallet**: Keep permanently (balance history)
- **Payment Methods**: Keep only while card is saved
- **Stripe IDs**: Keep permanently (for Stripe reconciliation)

---

## 🔐 Data Security

1. **Never store** full card numbers - Stripe handles this
2. **Encrypt** sensitive data in transit (HTTPS)
3. **Store** only Stripe payment method IDs
4. **Verify** all payments via webhook events
5. **Audit** all wallet transactions
6. **Rate limit** payment endpoints
7. **Use JWT** for authentication

---

## 📊 Useful Queries

### Get user's total spent:
```javascript
db.payments.aggregate([
  { $match: { userId: ObjectId("..."), status: "succeeded" } },
  { $group: { _id: "$userId", total: { $sum: "$amount" } } }
])
```

### Get recent payments:
```javascript
db.payments.find({ userId: ObjectId("...") })
  .sort({ createdAt: -1 })
  .limit(10)
```

### Get payment stats:
```javascript
db.payments.aggregate([
  { $match: { status: "succeeded" } },
  { $group: {
      _id: null,
      totalAmount: { $sum: "$amount" },
      totalPayments: { $sum: 1 }
    }
  }
])
```

### Find failed payments:
```javascript
db.payments.find({ status: "failed" })
  .sort({ createdAt: -1 })
```

---

## 🚀 Migration Notes

If you have existing users:

1. Existing users will have `null` `stripeCustomerId` initially
2. Stripe customer will be created on first payment attempt
3. No data loss - payments are added to existing users
4. Wallet balance defaults to 0 for existing users

---

## 📝 Backup Strategy

Before going to production:

1. **Backup MongoDB** - Full database backup
2. **Export Stripe data** - List of all customers/payments
3. **Test recovery** - Verify backups work
4. **Schedule regular backups** - Daily/Weekly

---

## ✅ Migration Checklist

- [ ] Added `stripeCustomerId` field to User
- [ ] Added `walletBalance` field to User
- [ ] Added `totalDeposited` field to User
- [ ] Added `paymentMethods` array to User
- [ ] Created Payment collection
- [ ] Added indexes to both collections
- [ ] Tested with sample data
- [ ] Documented schema changes
- [ ] Backed up database before changes

