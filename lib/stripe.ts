/**
 * Stripe Integration Library for Hoos Helping
 *
 * This module provides utilities for payment processing between taskers and helpers.
 *
 * Payment Flow:
 * 1. Tasker creates a task with a budget
 * 2. When task is completed, tasker pays helper via Stripe
 * 3. Payment is processed through Stripe (sandbox mode for testing)
 *
 * Note: This is a minimal implementation for demonstration purposes.
 * Production would require Stripe Connect for helper payouts.
 */

import Stripe from "stripe";

// Lazy initialization to avoid errors during build time
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

/**
 * Get or create a Stripe customer for a user
 * @param userId - User's database ID
 * @param email - User's email
 * @param name - User's name
 * @returns Stripe customer ID
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  const { PrismaClient } = await import("@/app/generated/prisma");
  const prisma = new PrismaClient();

  try {
    // Check if user already has a Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (user?.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    // Create new Stripe customer
    const stripe = getStripe();
    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
      metadata: {
        userId,
      },
    });

    // Save customer ID to database
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Create a Stripe product for a task
 * @param taskId - Task ID
 * @param title - Task title
 * @param description - Task description
 * @returns Stripe product ID
 */
export async function createTaskProduct(
  taskId: string,
  title: string,
  description?: string
): Promise<string> {
  const stripe = getStripe();
  const product = await stripe.products.create({
    name: `Task: ${title}`,
    description: description || undefined,
    metadata: {
      taskId,
    },
  });

  return product.id;
}

/**
 * Create a Stripe price for a task product
 * @param productId - Stripe product ID
 * @param amount - Amount in dollars
 * @returns Stripe price ID
 */
export async function createTaskPrice(
  productId: string,
  amount: number
): Promise<string> {
  // Convert dollars to cents for Stripe
  const amountInCents = Math.round(amount * 100);

  const stripe = getStripe();
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: amountInCents,
    currency: "usd",
  });

  return price.id;
}

/**
 * Create a payment link for a task
 * @param priceId - Stripe price ID
 * @param quantity - Quantity (always 1 for tasks)
 * @returns Payment link URL
 */
export async function createPaymentLink(
  priceId: string,
  quantity: number = 1
): Promise<string> {
  const stripe = getStripe();
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: priceId,
        quantity,
      },
    ],
  });

  return paymentLink.url;
}

/**
 * Create a complete payment link for a task
 * This is a convenience function that combines product, price, and payment link creation
 * @param taskId - Task ID
 * @param title - Task title
 * @param description - Task description
 * @param amount - Amount in dollars
 * @returns Payment link URL
 */
export async function createTaskPaymentLink(
  taskId: string,
  title: string,
  description: string,
  amount: number
): Promise<string> {
  // Create product
  const productId = await createTaskProduct(taskId, title, description);

  // Create price
  const priceId = await createTaskPrice(productId, amount);

  // Create payment link
  const paymentLinkUrl = await createPaymentLink(priceId, 1);

  return paymentLinkUrl;
}
