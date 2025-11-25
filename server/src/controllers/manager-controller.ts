import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ManagerService } from "../services/manager-services";
const prisma = new PrismaClient();
const managerService = new ManagerService(prisma);
export const getManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const manager = await managerService.findOne(cognitoId);
    if (!manager) {
      res.status(404).json({ message: "Manager not found" });
      return;
    }
    res.status(200).json(manager);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, email, phoneNumber, name } = req.body;
    const manager = await managerService.create({
      cognitoId,
      email,
      phoneNumber,
      name,
    });
    res.status(201).json(manager);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { email, phoneNumber, name } = req.body;
    const manager = await managerService.update({
      cognitoId,
      email,
      phoneNumber,
      name,
    });
    res.status(200).json(manager);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
