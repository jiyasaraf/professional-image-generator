import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { GoogleGenAI, Modality } from "@google/genai";
import { transformImageSchema } from "@shared/schema";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and JPG files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post(
    "/api/transform-image",
    upload.single("image"),
    async (req: MulterRequest, res) => {
      try {
        console.log("Received request:", {
          hasFile: !!req.file,
          contentType: req.get("Content-Type"),
          body: Object.keys(req.body || {}),
          files: req.file
            ? {
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
              }
            : "No file",
        });

        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: "No image file provided",
          });
        }

        // Use environment variable for API key
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
          return res.status(500).json({
            success: false,
            error: "Server configuration error: API key not found",
          });
        }

        // Validate image data
        const validatedData = {
          imageData: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype,
          apiKey: apiKey,
        };

        // Initialize Gemini AI
        const ai = new GoogleGenAI({ apiKey: validatedData.apiKey });

        // Professional portrait transformation prompt
        const prompt = `Transform this headshot photo into a professional portrait while preserving the person's identity and facial features. Make the following enhancements:

1. Replace the background with a clean, neutral, professional studio-like background (soft gradient or solid professional color)
2. Transform clothing to professional business attire (business suit or formal shirt/blouse, professional colors)
3. Enhance hair styling and grooming to professional standards
4. Improve lighting, color balance, and overall image clarity
5. Maintain natural skin tone and facial features exactly as they are
6. Ensure the person looks polished and professional while keeping their authentic appearance
7. Ensure the person is looking directly into the camera
8. Ensure the person is standing straight and confidently
9. Ensure the person is wearing a professional tie or bow tie if appropriate
10. Ensure the person is wearing professional watches and glasses if appropriate

The result should look like a high-quality professional headshot suitable for LinkedIn, corporate websites, or business cards.`;

        const contents = [
          {
            inlineData: {
              data: validatedData.imageData,
              mimeType: validatedData.mimeType,
            },
          },
          prompt,
        ];

        // Use the correct model for image generation
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image-preview",
          contents: contents,
          config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
          },
        });

        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
          return res.status(500).json({
            success: false,
            error: "No response generated from AI model",
          });
        }

        const content = candidates[0].content;
        if (!content || !content.parts) {
          return res.status(500).json({
            success: false,
            error: "Invalid response format from AI model",
          });
        }

        // Extract generated image
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return res.json({
              success: true,
              processedImageData: `data:image/png;base64,${part.inlineData.data}`,
            });
          }
        }

        return res.status(500).json({
          success: false,
          error: "No image data found in AI response",
        });
      } catch (error: any) {
        console.error("Transform image error:", error);

        if (error.message?.includes("API key")) {
          return res.status(401).json({
            success: false,
            error:
              "Invalid API key. Please check your Gemini API key and try again.",
          });
        }

        if (error.message?.includes("quota")) {
          return res.status(429).json({
            success: false,
            error: "API quota exceeded. Please try again later.",
          });
        }

        return res.status(500).json({
          success: false,
          error: error.message || "Failed to process image. Please try again.",
        });
      }
    },
  );

  const httpServer = createServer(app);
  return httpServer;
}
