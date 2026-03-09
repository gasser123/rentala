import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
export class PaymentService {
  stripe: Stripe;
  constructor(private prisma: PrismaClient) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
  }

  async createCheckoutSession(
    priceData: {
      pricePerMonth: number;
      securityDeposit: number;
      applicationFee: number;
    },
    tenantId: string,
    applicationId: number,
  ) {
    try {
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
        return_url: `${process.env.CLIENT_URL}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          tenantId,
          applicationId,
        },
      });
      return session;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }

  async getSession(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      console.error("Error fetching checkout session:", error);
      throw error;
    }
  }

  async fulfillCheckout(sessionId: string) {
    try {
      const checkoutSession = await this.stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: ["line_items"],
        },
      );

      if (checkoutSession.payment_status !== "paid") {
        return;
      }

      const existingPayment = await this.prisma.payment.findUnique({
        where: { stripeSessionId: sessionId },
      });

      if (existingPayment) {
        return;
      }
      if (
        !checkoutSession.metadata ||
        !checkoutSession.metadata.tenantId ||
        !checkoutSession.metadata.applicationId
      ) {
        throw new Error(
          "Missing tenantId or applicationId in session metadata",
        );
      }
      const applicationId = checkoutSession.metadata.applicationId;
      await this.prisma.$transaction(async (tx) => {
        const application = await tx.application.findUnique({
          where: { id: Number(applicationId) },
          include: { property: true },
        });

        if (!application) {
          throw new Error("Application not found for fulfillment");
        }
        const lease = await tx.lease.create({
          data: {
            startDate: new Date(),
            endDate: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1),
            ),
            rent: application.property.pricePerMonth,
            deposit: application.property.securityDeposit,
            propertyId: application.propertyId,
            tenantCognitoId: application.tenantCognitoId,
            applicationId: application.id,
          },
        });
        await tx.payment.create({
          data: {
            stripeSessionId: sessionId,
            leaseId: lease.id,
            paymentDate: new Date(),
            currency: checkoutSession.currency || "usd",
            amountPaid: checkoutSession.amount_total ?? 0,
            paymentStatus: "Succeeded",
          },
        });

        // update the property to connect to the tenant
        await tx.property.update({
          where: {
            id: application.property.id,
          },
          data: {
            tenants: {
              connect: {
                cognitoId: checkoutSession.metadata?.tenantId,
              },
            },
          },
        });
      });
    } catch (error) {
      console.error("Error fulfilling checkout session:", error);
      throw error;
    }
  }

  constructStripeWebhookEvent(
    payload: string | Buffer,
    sig: string | string[],
    endpointSecret: string,
  ) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        sig,
        endpointSecret,
      );
      return event;
    } catch (error) {
      console.error("Error constructing Stripe webhook event:", error);
      throw error;
    }
  }
}
