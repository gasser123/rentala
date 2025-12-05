import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import multer from "multer";
import {
  createProperty,
  getProperties,
  getProperty,
} from "../controllers/property-controller";
import { validateBodyMiddleware } from "../middleware/validate-body-middleware";
import { createPropertySchema } from "../zod-schemas/create-property-schema";

export const propertyRoutes = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
propertyRoutes.get("/", getProperties);
propertyRoutes.get("/:id", getProperty);
propertyRoutes.post(
  "/",
  authMiddleware(["manager"]),
  upload.array("photos"),
  validateBodyMiddleware(createPropertySchema),
  createProperty
);
