import { Request, Response } from "express";
import { LeaseService } from "../services/lease-service";
import { prisma } from "../prisma";
const leaseService = new LeaseService(prisma);
export const getLeases = async (req: Request, res: Response) => {
  try {
    const leases = await leaseService.getLeases();
    res.status(200).json(leases);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLeasePayments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payments = await leaseService.getLeasePayments(Number(id));
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
