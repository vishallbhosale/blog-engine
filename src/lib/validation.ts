import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long"),

  image: z
    .string()
    .trim()
    .url("Please enter a valid image URL"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters long"),
});

export type PostInput = z.infer<typeof postSchema>;