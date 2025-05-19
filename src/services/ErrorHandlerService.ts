import z from "zod";
import { ZodError } from "zod";
import { IErrorHandlerService } from "../types/error.types";
import { Prisma } from "@prisma/client";
import { CustomError } from "../utils/CustomError.js";

class ErrorHandlerService implements IErrorHandlerService {
  checkError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new CustomError("Prisma Error", error, "PrismaClientKnownRequestError");
    }

    if (error instanceof ZodError) {
      throw new CustomError(error.message, error, "ZodValidationError");
    }

    if (error instanceof CustomError) {
      throw error;
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unknown error");
  }

  handleError(error: unknown) {
    if (error instanceof CustomError) {
      switch (error.errorType) {
        case "PrismaClientKnownRequestError":
          const prismaError = error.data as Prisma.PrismaClientKnownRequestError;
          const code = prismaError.code;
          if (code === "P2002") {
            return {
              message: `Some field on model ${prismaError.meta?.modelName} are duplicate`,
            };
          }

          return {
            message: prismaError.message,
          };
        case "ZodValidationError":
          const zodError = error.data as z.ZodError;
          const issues = zodError.issues.map((issueObj) => issueObj.message).join(", ");
          return {
            message: issues,
          };
        default:
          return { message: "Unknow custom error" };
      }
    }

    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "Unknow error" };
  }
}

export const errorHandlerService = new ErrorHandlerService();
