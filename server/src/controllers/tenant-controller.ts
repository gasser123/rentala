import { TenantService } from "../services/tenant-service";
import { Request, Response } from "express";
import { PropertyService } from "../services/property-service";
import { LocationService } from "../services/location-service";
import { prisma } from "../prisma";
const propertyService = new PropertyService(
  prisma,
  new LocationService(prisma)
);
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

export const updateTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { email, phoneNumber, name } = req.body;
    const tenant = await tenantService.update({
      cognitoId,
      email,
      phoneNumber,
      name,
    });
    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentResidences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const properties = await propertyService.findByTenantCognitoId(cognitoId);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;
    const propertyIdNumber = Number(propertyId);
    const updatedTenant = await tenantService.addFavoriteProperty(
      cognitoId,
      propertyIdNumber
    );
    if (updatedTenant) {
      res.json(updatedTenant);
    } else {
      res.status(409).json({ message: "Property already added as favorite" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;
    const propertyIdNumber = Number(propertyId);
    const updatedTenant = await tenantService.removeFavoriteProperty(
      cognitoId,
      propertyIdNumber
    );
    if (updatedTenant) {
      res.json(updatedTenant);
    } else {
      res
        .status(409)
        .json({ message: "Property is not included in favorites" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
