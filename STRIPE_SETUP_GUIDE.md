# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment processing for your MediComp application.

## Prerequisites

1. A Stripe account (create one at https://stripe.com)
2. Node.js and npm installed
3. Your MediComp backend server running

## Step 1: Get Your Stripe API Keys

1. Log in to your Stripe Dashboard
2. Go to **Developers** > **API Keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode)

## Step 2: Update Your Configuration

### Frontend Configuration

Update the Stripe publishable key in `scripts/stripe-payment.js`:

```javascript
// Replace this line:
this.stripe = Stripe('pk_test_51234567890abcdef');

// With your actual publishable key:
this.stripe = Stripe('pk_test_your_actual_publishable_key_here');
```

### Backend Configuration

Update the Stripe secret key in `server.js`:

```javascript
// Replace this line:
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdef');

// With your actual secret key:
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_actual_secret_key_here');
```

### Environment Variables (Recommended)

For production, use environment variables instead of hardcoding keys:

1. Create a `.env` file in your project root:
```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

2. Install dotenv package:
```bash
npm install dotenv
```

3. Add to the top of `server.js`:
```javascript
require('dotenv').config();
```

## Step 3: Install Dependencies

Install the Stripe package for your backend:

```bash
npm install stripe
```

## Step 4: Test the Integration

1. Start your backend server:
```bash
npm run dev
```

2. Open your MediComp application in a browser
3. Add some medicines to your cart
4. Click "Proceed to Checkout"
5. Fill in the payment form with test card numbers

## Step 5: Test Card Numbers

Use these test card numbers for testing:

### Successful Payments
- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005

### Failed Payments
- **Declined**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995
- **Expired card**: 4000 0000 0000 0069

### 3D Secure Authentication
- **Requires authentication**: 4000 0025 0000 3155

Use any future expiry date (e.g., 12/34) and any 3-digit CVC.

## Step 6: Webhook Setup (Optional)

For production, set up webhooks to handle payment events:

1. In your Stripe Dashboard, go to **Developers** > **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe-webhook`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the webhook signing secret
6. Update your environment variables with the webhook secret

## Step 7: Go Live

When ready for production:

1. Switch to live mode in your Stripe Dashboard
2. Get your live API keys
3. Update your configuration with live keys
4. Test with real payment methods
5. Update your webhook endpoints to use HTTPS

## Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Use HTTPS** in production
3. **Validate webhook signatures** to ensure requests are from Stripe
4. **Store sensitive data securely** and follow PCI compliance guidelines
5. **Use environment variables** for configuration

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that you're using the correct key (publishable vs secret)
   - Ensure the key is properly formatted

2. **"No such payment_intent" error**
   - Check that the client_secret is being passed correctly
   - Ensure the payment intent was created successfully

3. **CORS errors**
   - Make sure your backend server is running
   - Check that CORS is properly configured

4. **Payment form not showing**
   - Check browser console for JavaScript errors
   - Ensure Stripe.js is loaded correctly
   - Verify the card element is properly mounted

### Debug Mode

Enable Stripe debug mode by adding this to your frontend:

```javascript
// In scripts/stripe-payment.js
this.stripe = Stripe('pk_test_your_key', {
  apiVersion: '2023-10-16',
  locale: 'en'
});
```

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Test your integration: https://stripe.com/docs/testing

## Additional Features

You can extend this integration with:

- **Subscription payments** for recurring medicine orders
- **Apple Pay/Google Pay** integration
- **Multi-currency support**
- **Payment method management**
- **Refund processing**
- **Invoice generation**

Remember to test thoroughly in test mode before going live!
