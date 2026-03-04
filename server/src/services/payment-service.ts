import Stripe from "stripe";
export class PaymentService {
  stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
  }

  async createCheckoutSession(
    priceData: {
      pricePerMonth: number;
      securityDeposit: number;
      applicationFee: number;
    },
    tenantId: string,
  ) {
    const session = await this.stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: Object.entries(priceData).map(([key, value]) => ({
        price_data: {
          currency: "USD",
          product_data: {
            name:
              key === "pricePerMonth"
                ? "Monthly Payment"
                : key === "securityDeposit"
                  ? "Security Deposit"
                  : "Application Fee",
            description:
              key === "pricePerMonth"
                ? "one month payment for the rental property."
                : key === "securityDeposit"
                  ? "One-time security deposit for the rental property."
                  : "One-time application fee for processing the rental application.",
          },
          unit_amount: value * 100, // Stripe expects amounts in cents
        },
        quantity: 1,
      })),
      mode: "payment",
      return_url: `${process.env.CLIENT_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: tenantId,
      },
    });
    return session;
  }

  async getSession(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return session;
  }
}
