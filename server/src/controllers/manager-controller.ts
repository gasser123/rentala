import { prisma } from "../prisma";
import { Request, Response } from "express";
import { ManagerService } from "../services/manager-service";
import { PropertyService } from "../services/property-service";
import { LocationService } from "../services/location-service";

const locationService = new LocationService(prisma);
const propertyService = new PropertyService(prisma, locationService);
const managerService = new ManagerService(prisma);
export const getManager = async (
  req: Request,
  res: Response,
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
  res: Response,
): Promise<void> => {
  try {
    const { cognitoId, email, phoneNumber, name } = req.body;
    const { id: userId } = req.user!;
    if (cognitoId !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
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
  res: Response,
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { id: userId } = req.user!;
    if (cognitoId !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
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

export const getManagerProperties = async (req: Request, res: Response) => {
  try {
    const { cognitoId } = req.params;
    const properties = await propertyService.findByManagerCognitoId(cognitoId);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
