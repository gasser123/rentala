import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import multer from "multer";
import {
  createProperty,
  getProperties,
  getProperty,
  getPropertyLeases,
} from "../controllers/property-controller";
import { validateBodyMiddleware } from "../middleware/validate-body-middleware";
import { createPropertySchema } from "../zod-schemas/create-property-schema";
import crypto from "node:crypto";

export const propertyRoutes = Router();
const storage =
  process.env.NODE_ENV !== "production"
    ? multer.diskStorage({
        destination: "uploads/",
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + "-" + crypto.randomUUID();
          cb(null, uniqueSuffix + "-" + file.originalname);
        },
      })
    : multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});
propertyRoutes.get("/", getProperties);
propertyRoutes.get(
  "/:id/leases",
  authMiddleware(["manager", "tenant"]),
  getPropertyLeases,
);
propertyRoutes.get("/:id", getProperty);
propertyRoutes.post(
  "/",
  authMiddleware(["manager"]),
  upload.array("photos"),
  validateBodyMiddleware(createPropertySchema),
  createProperty,
);
