import { GoogleGenAI, Modality } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generatePersonaAvatar(
  personaName: string,
  attributes: string[]
): Promise<string> {
  const prompt = `Create a professional portrait avatar for a sales training persona called "${personaName}". 

This persona has these characteristics: ${attributes.join(", ")}.

Requirements:
- Create a realistic, diverse homeowner portrait that represents this buyer type
- The person should be at their front door or in their yard
- Natural lighting, high quality photo-realistic style
- Appropriate attire and setting for a homeowner
- Subtle green/emerald color accent in the background or lighting
- Professional headshot composition
- The expression and body language should reflect their personality (e.g., busy person looks pressed for time, skeptic looks questioning)

Generate a high-quality portrait avatar.`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const imageBuffer = Buffer.from(part.inlineData.data, "base64");
          const url = await uploadToCloudinary(imageBuffer, `persona_${personaName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now()}`);
          return url;
        }
      }
    }
    
    return "";
  } catch (error) {
    console.error(`Error generating avatar for ${personaName}:`, error);
    return "";
  }
}

async function uploadToCloudinary(buffer: Buffer, publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder: "arena-ai/personas",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
}
