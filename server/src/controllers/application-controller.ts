import { Request, Response } from "express";
import { ApplicationService } from "../services/application-service";
import { prisma } from "../prisma";
import { LeaseService } from "../services/lease-service";
import { PropertyService } from "../services/property-service";
import { LocationService } from "../services/location-service";
import { TenantService } from "../services/tenant-service";

const propertyService = new PropertyService(
  prisma,
  new LocationService(prisma),
);

const applicationService = new ApplicationService(
  prisma,
  new LeaseService(prisma),
  propertyService,
);

const tenantService = new TenantService(prisma);
export const getapplications = async (req: Request, res: Response) => {
  try {
    const { userId, userType } = req.query;
    const applications = await applicationService.findApplications(
      String(userId),
      String(userType),
    );
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createApplication = async (req: Request, res: Response) => {
  try {
    let {
      applicationDate,
      status,
      propertyId,
      tenantCognitoId,
      name,
      email,
      phoneNumber,
      message,
    } = req.body;
    const property =
      await propertyService.findPropertyForApplication(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    status = "Pending";
    applicationDate = new Date().toISOString();
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    tenantCognitoId = req.user.id;
    const tenant = await tenantService.findOne(tenantCognitoId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    name = tenant.name;
    email = tenant.email;
    phoneNumber = tenant.phoneNumber;
    const newApplication = await applicationService.create(property, {
      applicationDate,
      email,
      message,
      name,
      phoneNumber,
      status,
      tenantCognitoId,
      propertyId,
    });

    res.status(201).json(newApplication);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await applicationService.findUnique(Number(id));
    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }
    const updatedApplication = await applicationService.updateApplicationStatus(
      application,
      status,
    );
    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
