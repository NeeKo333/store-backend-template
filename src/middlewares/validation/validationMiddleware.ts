import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema, ZodType } from "zod";
import { HTTP_STATUSES } from "../../constants/HTTP_STATUSES.js";

interface schemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export const validationMiddleware = (schema: schemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        schema.body.parse(req.body);
      }

      if (schema.params) {
        schema.params.parse(req.params);
      }

      if (schema.query) {
        schema.query.parse(req.query);
      }
      next();
    } catch (error) {
      const zodError = error as ZodError;
      res.status(HTTP_STATUSES.BAD_REQUEST).json({
        message: "Validation error",
        errors: zodError.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
  };
};
