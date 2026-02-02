import { Request, Response } from "express";
import { LeaseService } from "../services/lease-service";
import { prisma } from "../prisma";
const leaseService = new LeaseService(prisma);
export const getLeases = async (req: Request, res: Response) => {
  try {
    const { id, role } = req.user!;
    const leases = await leaseService.getLeases(id, role);
    res.status(200).json(leases);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLeasePayments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user!;
    const lease = await leaseService.getLeaseById(Number(id));
    if (!lease) {
      return res.status(404).json({ message: "Lease not found" });
    }
    if (role === "tenant" && lease.tenantCognitoId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (role === "manager" && lease.property.managerCognitoId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const payments = await leaseService.getLeasePayments(Number(id));
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
