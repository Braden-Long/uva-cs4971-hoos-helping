# Stripe Payment Integration Setup

## Overview

This document describes the Stripe payment integration implementation for Hoos Helping. This is a **sandbox/test implementation** demonstrating how payments would work between taskers and helpers.

## What Was Implemented

### 1. Database Schema Changes

Added payment-related fields to the Prisma schema:

**User Model:**

- `stripeCustomerId` - Stripe customer ID for taskers making payments
- `stripeAccountId` - Stripe account ID for helpers receiving payments (for future Stripe Connect implementation)

**Task Model:**

- `stripePaymentIntentId` - Stripe PaymentIntent ID
- `paymentStatus` - Payment status (pending, authorized, paid, transferred, failed)

### 2. Stripe Utility Library (`lib/stripe.ts`)

Created helper functions for:

- Creating Stripe customers
- Creating products and prices for tasks
- Generating payment links

### 3. API Route

**POST `/api/tasks/[id]/payment-link`**

- Creates a Stripe payment link for a completed task
- Validates that user is the task creator
- Ensures task is completed and has an assigned helper
- Returns a Stripe-hosted payment link

### 4. UI Integration

Updated the task detail page (`app/app/tasks/[id]/page.tsx`) to show:

- Payment section for task owners on completed tasks
- "Create Payment Link" button
- Link to Stripe checkout when payment link is created
- Clear indication that this is sandbox mode for testing

## Setup Instructions

### 1. Get Your Stripe Test API Key

1. Log in to your Stripe dashboard: https://dashboard.stripe.com/
2. Make sure you're in **Test Mode** (toggle in the top-right corner)
3. Go to **Developers** → **API keys**
4. Copy your **Secret key** (starts with `sk_test_`)

### 2. Add to Environment Variables

Add the following line to your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

**Important:** Make sure to use the **test mode** secret key (starts with `sk_test_`), not the live key!

### 3. Add to Netlify (for deployed version)

1. Go to your Netlify dashboard
2. Navigate to: Site settings → Environment variables
3. Add a new variable:
   - Key: `STRIPE_SECRET_KEY`
   - Value: Your Stripe test secret key
4. Redeploy your site

## How to Test

### Local Testing

1. Add `STRIPE_SECRET_KEY` to your `.env` file (see above)
2. Start the development server: `npm run dev`
3. Create a test task or use an existing one
4. Assign a helper to the task
5. Mark the task as completed
6. As the task owner, you should see a "Payment" section
7. Click "Create Payment Link"
8. Click "Proceed to Payment" to be redirected to Stripe checkout
9. Use Stripe test card numbers to complete payment:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date, any CVC

### Testing on Deployed Version

Same process as local testing, but ensure `STRIPE_SECRET_KEY` is set in Netlify environment variables.

## Payment Flow

```
1. Tasker creates task with budget amount
   ↓
2. Helper applies and gets accepted
   ↓
3. Task is marked as "completed"
   ↓
4. Tasker clicks "Create Payment Link"
   → Stripe product and price are created
   → Payment link is generated
   ↓
5. Tasker clicks "Proceed to Payment"
   → Redirected to Stripe-hosted checkout page
   ↓
6. Tasker completes payment using test card
   → Payment is processed through Stripe (sandbox)
```

## Important Notes

### This is a Minimal Implementation

- **Sandbox only** - Uses Stripe test mode, no real money is charged
- **No automatic payouts** - Helpers don't actually receive money in this demo
- **No webhooks** - Payment status updates are not automated
- **No Stripe Connect** - For production, you'd need Stripe Connect to pay helpers

### For Production Implementation

To make this production-ready, you would need:

1. **Stripe Connect** - Set up Stripe Connect accounts for helpers to receive payments
2. **Webhooks** - Listen to Stripe webhook events to update payment status
3. **Payment Intents** - Use PaymentIntents instead of payment links for better control
4. **Transfer API** - Automatically transfer payments to helpers after completion
5. **Platform fees** - Take a percentage as platform fee
6. **Refunds** - Handle refund scenarios
7. **Escrow** - Hold payments in escrow until task completion

## Files Modified/Created

- `prisma/schema.prisma` - Added Stripe fields
- `lib/stripe.ts` - Stripe utility library (new)
- `app/api/tasks/[id]/payment-link/route.ts` - Payment link API (new)
- `app/app/tasks/[id]/page.tsx` - Added payment UI section
- `package.json` - Added `stripe` npm package

## Test Card Numbers

Use these test card numbers in Stripe checkout:

| Scenario           | Card Number         | Description                       |
| ------------------ | ------------------- | --------------------------------- |
| Success            | 4242 4242 4242 4242 | Payment succeeds                  |
| Decline            | 4000 0000 0000 0002 | Card declined                     |
| Insufficient funds | 4000 0000 0000 9995 | Insufficient funds                |
| 3D Secure          | 4000 0027 6000 3184 | Requires 3D Secure authentication |

Use any future expiry date and any 3-digit CVC.

## Troubleshooting

### "Missing STRIPE_SECRET_KEY" Error

- Ensure `STRIPE_SECRET_KEY` is added to `.env`
- Restart your development server after adding the key

### Payment Link Not Creating

- Check that task status is "completed"
- Ensure task has an assigned helper
- Verify you're the task owner
- Check server logs for Stripe API errors

### Test Cards Not Working

- Ensure you're using test mode API key (starts with `sk_test_`)
- Verify you're in Stripe test mode in the dashboard
- Use the exact card numbers listed above

## Resources

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Stripe Payment Links](https://stripe.com/docs/payment-links)
- [Stripe Connect (for production)](https://stripe.com/docs/connect)
