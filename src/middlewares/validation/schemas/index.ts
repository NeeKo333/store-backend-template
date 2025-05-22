import { z } from "zod";

export const registrationSchema = z.object({
  nickname: z.string(),
  password: z.string(),
  email: z.string().email("Некорректный email"),
  role: z.enum(["USER", "ADMIN", "MODERATOR"]),
});

export const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string(),
});

export const productSchema = z.object({
  name: z.string(),
  type_id: z.number(),
  brand_id: z.number(),
  rating: z.number(),
});

export const offsetLimitSchema = z.object({
  offset: z.preprocess((value) => {
    return value !== undefined ? Number(value) : undefined;
  }, z.number().min(0).optional().default(0)),
  limit: z.preprocess((value) => {
    return value !== undefined ? Number(value) : undefined;
  }, z.number().min(1).optional().default(10)),
});

export const idSchema = z.object({
  id: z.preprocess((value) => {
    return value !== undefined ? Number(value) : undefined;
  }, z.number()),
});
