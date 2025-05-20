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

const logoutSchema = z.object({
  userId: z.number(),
  refresh_token: z.string(),
});

const getProductsSchema = z.object({
  offset: z.number(),
  limit: z.number(),
});

const getProductSchema = z.object({
  id: z.number(),
});

const createProductSchema = z.object({
  name: z.string(),
  type_id: z.number(),
  brand_id: z.number(),
  rating: z.number(),
});

const deleteProductSchema = z.object({
  id: z.number(),
});

const updateProductSchema = z.object({
  productId: z.number(),
  productData: z.object({
    name: z.string(),
    type_id: z.number(),
    brand_id: z.number(),
    rating: z.number(),
  }),
});
