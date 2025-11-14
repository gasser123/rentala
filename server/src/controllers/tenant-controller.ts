import { PrismaClient } from "@prisma/client";
import { TenantService } from "../services/tenant-service";
import { Request, Response } from "express";
const prisma = new PrismaClient();
const tenantService = new TenantService(prisma);
export const getTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const tenant = await tenantService.findOne(cognitoId);
    if (!tenant) {
      res.status(404).json({ message: "Tenant not found" });
      return;
    }
    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, email, phoneNumber, name } = req.body;
    const tenant = await tenantService.create({
      cognitoId,
      email,
      phoneNumber,
      name,
    });
    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
