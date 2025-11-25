import { Router } from "express";
import {
  createManager,
  getManager,
  updateManager,
} from "../controllers/manager-controller";
export const managerRoutes = Router();
managerRoutes.get("/:cognitoId", getManager);
managerRoutes.put("/:cognitoId", updateManager);
managerRoutes.post("/", createManager);
