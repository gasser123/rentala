import { prisma } from "../prisma";
import { Request, Response } from "express";
import { PropertyService } from "../services/property-service";
import { PropertiesQuery } from "../types/properties/properties-query";
import { AmazonS3Service } from "../services/Amazon-s3-service";
import { randomUUID } from "node:crypto";
import axios from "axios";
import { LocationService } from "../services/location-service";

const locationService = new LocationService(prisma);
const propertyService = new PropertyService(prisma, locationService);
const amazonS3Service = new AmazonS3Service();
export const getProperties = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const propertiesQuery = req.query as unknown as PropertiesQuery;
    const properties = await propertyService.findFiltered(propertiesQuery);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProperty = async (req: Request, res: Response) => {
  try {
    const propertyId = parseInt(req.params.id, 10);
    const property = await propertyService.findById(propertyId);
    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPropertyLeases = async (req: Request, res: Response) => {
  try {
    const propertyId = parseInt(req.params.id, 10);
    const { id: userId, role } = req.user!;
    const property = await propertyService.findPropertyWithLeases(
      propertyId,
      userId,
      role,
    );
    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }
    res.json(property.leases);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const {
      address,
      city,
      state,
      country,
      postalCode,
      managerCognitoId,
      ...propertyData
    } = req.body;

    const { id: userId } = req.user!;
    if (managerCognitoId !== userId) {
      res.status(403).json({
        message: "Forbidden: Cannot create property for another manager",
      });
      return;
    }
    let photoUrls;
    if (process.env.NODE_ENV === "production") {
      photoUrls = await Promise.all(
        files.map(async (file) => {
          const uploadResult = await amazonS3Service.uploadToS3({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `properties/${randomUUID()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
          });
          return uploadResult.Location;
        }),
      );
    } else {
      photoUrls = files.map((file) => {
        const fileUrl = `http://127.0.0.1:${process.env.PORT}/uploads/${file.filename}`;
        return fileUrl;
      });
    }

    if (!photoUrls.every((url) => url !== undefined)) {
      throw new Error("Photo upload failed");
    }
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
      {
        street: address,
        city,
        state,
        country,
        postalcode: postalCode,
        format: "json",
        limit: "1",
      },
    ).toString()}`;
    const geocodingResponse = await axios.get(geocodingUrl, {
      headers: {
        "User-Agent": "Rentala-App",
      },
    });
    const [longtitude, latitude] =
      geocodingResponse.data[0]?.lon && geocodingResponse.data[0]?.lat
        ? [
            parseFloat(geocodingResponse.data[0]?.lon),
            parseFloat(geocodingResponse.data[0]?.lat),
          ]
        : [0, 0];

    const newProperty = await propertyService.create(
      {
        ...propertyData,
        photoUrls,
        amenities:
          typeof propertyData.amenities === "string"
            ? propertyData.amenities.split(",")
            : [],
        highlights:
          typeof propertyData.highlights === "string"
            ? propertyData.highlights.split(",")
            : [],
        isPetsAllowed: propertyData.isPetsAllowed === "true",
        isParkingIncluded: propertyData.isParkingIncluded === "true",
        pricePerMonth: parseFloat(propertyData.pricePerMonth),
        securityDeposit: parseFloat(propertyData.securityDeposit),
        applicationFee: parseFloat(propertyData.applicationFee),
        beds: parseInt(propertyData.beds, 10),
        baths: parseFloat(propertyData.baths),
        squareFeet: parseInt(propertyData.squareFeet, 10),
      },
      managerCognitoId,
      { address, city, state, country, postalCode },
      longtitude,
      latitude,
    );

    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
