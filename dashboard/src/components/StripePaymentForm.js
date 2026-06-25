import React, { useState, useEffect } from 'react';

// Simple Stripe integration without @stripe/js package
let stripeInstance = null;

const initStripe = async () => {
  if (!window.Stripe) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = () => {
        stripeInstance = window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
        resolve(stripeInstance);
      };
      script.onerror = () => reject(new Error('Failed to load Stripe'));
      document.head.appendChild(script);
    });
  } else {
    stripeInstance = window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    return Promise.resolve(stripeInstance);
  }
};

/**
 * Main Payment Form Component
 * Wrap your application with this to enable Stripe payments
 */
export function PaymentFormWrapper({ children }) {
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    initStripe().then(() => setStripeLoaded(true)).catch(err => console.error('Stripe init error:', err));
  }, []);

  if (!stripeLoaded) {
    return <div>{children}</div>;
  }
  return <div>{children}</div>;
}

/**
 * Deposit Component
 * Use this in your dashboard to allow users to add funds
 */
export function DepositFunds({ onSuccess, onError }) {
  const [amount, setAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch wallet balance on component mount
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/wallet', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setWalletBalance(data.walletBalance);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError(null);
  };

  const handleDeposit = async () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount < 100) {
      setError('Minimum deposit is ₹100');
      return;
    }

    setError(null);
    setSuccess(null);

    // Show payment form
    document.getElementById('payment-form-container').style.display = 'block';
  };

  return (
    <div style={styles.container}>
      <h3>Add Funds to Wallet</h3>
      
      <div style={styles.balanceBox}>
        <p>Current Balance: <strong>₹{walletBalance.toLocaleString()}</strong></p>
      </div>

      <div style={styles.inputGroup}>
        <label>Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
          min="100"
          step="100"
          style={styles.input}
        />
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <button 
        onClick={handleDeposit}
        style={{
          ...styles.button,
          opacity: amount && amount > 0 ? 1 : 0.5,
        }}
        disabled={!amount || amount <= 0}
      >
        Proceed to Payment
      </button>

      <div id="payment-form-container" style={{ display: 'none', marginTop: '20px' }}>
        <CheckoutForm 
          amount={parseFloat(amount)} 
          onSuccess={(data) => {
            setSuccess(`Payment successful! ₹${data.amount} added to wallet.`);
            setAmount('');
            setTimeout(() => {
              fetchWalletBalance();
              if (onSuccess) onSuccess(data);
            }, 2000);
          }}
          onError={(err) => {
            setError(err);
            if (onError) onError(err);
          }}
        />
      </div>
    </div>
  );
}

/**
 * Checkout Form Component
 * Handles the actual payment processing
 */
function CheckoutForm({ amount, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [cardElementRef, setCardElementRef] = useState(null);
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);

  useEffect(() => {
    // Initialize Stripe and Elements
    initStripe().then((stripeInstance) => {
      setStripe(stripeInstance);
      if (window.stripe && window.stripe.elements) {
        const elementsInstance = window.stripe.elements();
        setElements(elementsInstance);

        // Create and mount card element
        const cardElement = elementsInstance.create('card');
        cardElement.mount('#card-element');
        setCardElementRef(cardElement);
      }
    }).catch(err => {
      onError('Failed to initialize Stripe: ' + err.message);
    });

    return () => {
      if (cardElementRef) {
        cardElementRef.unmount();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !cardElementRef) {
      onError('Payment system not ready');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Step 1: Create payment intent on backend
      const intentResponse = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount,
          description: 'Wallet deposit',
        }),
      });

      const intentData = await intentResponse.json();
      if (!intentData.success) {
        throw new Error(intentData.message || 'Failed to create payment intent');
      }

      // Step 2: Create payment method from card element
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElementRef,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Step 3: Confirm payment on backend
      const confirmResponse = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentIntentId: intentData.paymentIntentId,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const confirmData = await confirmResponse.json();

      if (confirmData.success) {
        onSuccess({
          paymentIntentId: intentData.paymentIntentId,
          amount: amount,
          status: 'succeeded',
        });
        cardElementRef.clear();
      } else {
        throw new Error(confirmData.message || 'Payment confirmation failed');
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div id="card-element" style={styles.cardElement}></div>

      <button
        type="submit"
        disabled={loading}
        style={{
          ...styles.payButton,
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
      </button>

      <button
        type="button"
        onClick={() => {
          document.getElementById('payment-form-container').style.display = 'none';
        }}
        style={styles.cancelButton}
      >
        Cancel
      </button>
    </form>
  );
}

/**
 * Payment History Component
 * Display past payments
 */
export function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/history?limit=20', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.error('Error fetching payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h3>Payment History</h3>
      {payments.length === 0 ? (
        <p>No payments yet</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>₹{payment.amount.toLocaleString()}</td>
                <td>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: payment.status === 'succeeded' ? '#4caf50' : '#ff9800',
                  }}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
  balanceBox: {
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  form: {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  cardElement: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '15px',
    backgroundColor: '#fafafa',
  },
  payButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  cancelButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '14px',
  },
};
