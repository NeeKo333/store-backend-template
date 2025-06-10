import z from "zod";
import { ZodError } from "zod";
import { IErrorHandlerService } from "../types/error.types";
import { Prisma } from "@prisma/client";
import { CustomError } from "../utils/CustomError.js";
import { HTTP_STATUSES } from "../constants/HTTP_STATUSES.js";

class ErrorHandlerService implements IErrorHandlerService {
  checkError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new CustomError("Prisma Error", error, "PrismaClientKnownRequestError");
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      throw new CustomError("Prisma Error", error, "PrismaClientUnknownRequestError");
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
          switch (code) {
            case "P2000":
              return {
                status: HTTP_STATUSES.BAD_REQUEST,
                message: `Value to field ${prismaError.meta?.target} too long`,
              };
            case "P2002":
              return {
                status: HTTP_STATUSES.BAD_REQUEST,
                message: `Some field on model ${prismaError.meta?.modelName} are duplicate`,
              };

            case "P2003":
              return {
                status: HTTP_STATUSES.BAD_REQUEST,
                message: `FK error: ${prismaError.meta?.field_name}`,
              };

            case "P2025":
              return {
                status: HTTP_STATUSES.NOT_FOUND,
                message: `The entry was not found or has already been deleted.`,
              };

            default:
              return {
                status: HTTP_STATUSES.INTERNAL_SERVER_ERROR,
                message: prismaError.message,
              };
          }

        case "PrismaClientUnknownRequestError":
          const prismaUnknowError = error.data as Prisma.PrismaClientUnknownRequestError;
          return {
            status: HTTP_STATUSES.INTERNAL_SERVER_ERROR,
            message: prismaUnknowError.message,
          };

        case "ZodValidationError":
          const zodError = error.data as z.ZodError;
          const issues = zodError.issues.map((issueObj) => issueObj.message).join(", ");
          return {
            status: HTTP_STATUSES.BAD_REQUEST,
            message: issues,
          };
        default:
          return { status: HTTP_STATUSES.INTERNAL_SERVER_ERROR, message: "Unknow custom error" };
      }
    }

    if (error instanceof Error) {
      return { status: HTTP_STATUSES.INTERNAL_SERVER_ERROR, message: error.message };
    }
    return { status: HTTP_STATUSES.INTERNAL_SERVER_ERROR, message: "Unknow error" };
  }
}

export const errorHandlerService = new ErrorHandlerService();
