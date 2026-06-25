const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createStripeCustomer = async (email, name) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        registeredAt: new Date().toISOString(),
      },
    });
    return customer.id;
  } catch (error) {
    console.error("Error creating Stripe customer:", error.message);
    throw new Error("Failed to create Stripe customer");
  }
};

const createPaymentIntent = async (customerId, amount, currency = "inr", description = "") => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      description,
      metadata: {
        integration: "stocks_app",
      },
    });
    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    throw new Error("Failed to create payment intent");
  }
};

const retrievePaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Error retrieving payment intent:", error.message);
    throw new Error("Failed to retrieve payment intent");
  }
};

const confirmPaymentIntent = async (paymentIntentId, paymentMethodId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
    return paymentIntent;
  } catch (error) {
    console.error("Error confirming payment intent:", error.message);
    throw new Error("Failed to confirm payment");
  }
};

const listPaymentMethods = async (customerId) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });
    return paymentMethods.data;
  } catch (error) {
    console.error("Error listing payment methods:", error.message);
    throw new Error("Failed to list payment methods");
  }
};

const detachPaymentMethod = async (paymentMethodId) => {
  try {
    const result = await stripe.paymentMethods.detach(paymentMethodId);
    return result;
  } catch (error) {
    console.error("Error detaching payment method:", error.message);
    throw new Error("Failed to detach payment method");
  }
};

const refundPayment = async (paymentIntentId, amount = null) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount && { amount: Math.round(amount * 100) }),
    });
    return refund;
  } catch (error) {
    console.error("Error refunding payment:", error.message);
    throw new Error("Failed to process refund");
  }
};

const verifyWebhookSignature = (body, signature, secret) => {
  try {
    return stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    throw new Error("Invalid webhook signature");
  }
};

module.exports = {
  createStripeCustomer,
  createPaymentIntent,
  retrievePaymentIntent,
  confirmPaymentIntent,
  listPaymentMethods,
  detachPaymentMethod,
  refundPayment,
  verifyWebhookSignature,
  stripe,
};
