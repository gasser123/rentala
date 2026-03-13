import { Request, Response } from "express";
import { PaymentService } from "../services/payment-service";
import { ApplicationService } from "../services/application-service";
import { prisma } from "../prisma";
import { LocationService } from "../services/location-service";
import { LeaseService } from "../services/lease-service";
import { PropertyService } from "../services/property-service";
import Stripe from "stripe";
const paymentService = new PaymentService(prisma);
const propertyService = new PropertyService(
  prisma,
  new LocationService(prisma),
);

const applicationService = new ApplicationService(
  prisma,
  new LeaseService(prisma),
  propertyService,
);
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.query;
    if (!applicationId) {
      return res
        .status(400)
        .json({ message: "Missing applicationId in query parameters" });
    }
    const application = await applicationService.findUnique(
      Number(applicationId),
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    const { id } = req.user!;
    if (application.tenantCognitoId !== id) {
      return res.status(403).json({
        message: "Unauthorized to create checkout session for this application",
      });
    }

    if (application.status !== "Approved") {
      {
        return res.status(403).json({
          message: "Only approved applications can create checkout sessions",
        });
      }
    }
    const { applicationFee, pricePerMonth, securityDeposit } =
      application.property;
    const session = await paymentService.createCheckoutSession(
      {
        applicationFee,
        pricePerMonth,
        securityDeposit,
      },
      id,
      Number(applicationId),
    );
    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

export async function getSessionStatus(req: Request, res: Response) {
  try {
    const { sessionId } = req.query;
    const { id } = req.user!;
    if (!sessionId) {
      return res
        .status(400)
        .json({ message: "Missing sessionId in query parameters" });
    }
    const session = await paymentService.getSession(sessionId as string);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    if (session.metadata?.tenantId !== id) {
      return res.status(403).json({
        message: "Unauthorized to retrieve session status",
      });
    }
    res.json({
      status: session.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve session status" });
  }
}

export async function handleWebhook(request: Request, response: Response) {
  const payload = request.body;
  const sig = request.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  if (!sig) {
    return response.status(400).send("Missing Stripe signature");
  }
  let event;

  try {
    event = paymentService.constructStripeWebhookEvent(
      payload,
      sig,
      endpointSecret,
    );
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await paymentService.fulfillCheckout(event.data.object.id);
    }

    response.status(200).end();
  } catch (error) {
    if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
      console.error("Webhook signature verification failed:", error.message);
      return response.status(400).send(`Webhook Error: ${error.message}`);
    }
    console.error("Error handling webhook:", error);
    return response.status(500).send("Internal Server Error");
  }
}
