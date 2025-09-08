import { z } from "zod";

export const transformImageSchema = z.object({
  imageData: z.string(), // base64 encoded image
  mimeType: z.string(),
});

export const transformResponseSchema = z.object({
  success: z.boolean(),
  processedImageData: z.string().optional(),
  error: z.string().optional(),
});

export type TransformImageRequest = z.infer<typeof transformImageSchema>;
export type TransformImageResponse = z.infer<typeof transformResponseSchema>;
