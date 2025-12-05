import { NextFunction, Request, Response } from "express";
import z, { ZodError, ZodType } from "zod";

export const validateBodyMiddleware = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Invalid request body",
          errors: z.flattenError(error).fieldErrors,
        });
        return;
      }

      res.status(500).json({ message: "Internal server error" });
    }
  };
};
