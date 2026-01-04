import { GoogleGenAI, Modality } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateWarriorAvatar(
  photoBuffer: Buffer,
  userName: string
): Promise<{ profilePhotoUrl: string; warriorAvatarUrl: string }> {
  const profilePhotoUrl = await uploadToCloudinary(photoBuffer, `profile_${Date.now()}`);

  const base64Image = photoBuffer.toString("base64");

  const prompt = `Transform this person's photo into an epic warrior avatar for a sales training arena app called "Arena AI". 

Requirements:
- Keep the person's face recognizable but enhance it with warrior aesthetics
- Add dramatic lighting with green/emerald glows (the brand color)
- Include subtle warrior elements like armor accents, battle-ready expression, or a subtle shield/sword motif in the background
- Make it look powerful and confident - like a champion sales warrior
- Keep it professional and suitable for a business app profile picture
- The overall style should be sleek and modern, not medieval or fantasy
- Maintain the person's identity while making them look like a sales champion

Generate a high-quality warrior avatar portrait.`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    let warriorAvatarUrl = profilePhotoUrl;

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const imageBuffer = Buffer.from(part.inlineData.data, "base64");
          warriorAvatarUrl = await uploadToCloudinary(imageBuffer, `warrior_${Date.now()}`);
          break;
        }
      }
    }

    return { profilePhotoUrl, warriorAvatarUrl };
  } catch (error) {
    console.error("Error generating warrior avatar:", error);
    return { profilePhotoUrl, warriorAvatarUrl: profilePhotoUrl };
  }
}

async function uploadToCloudinary(buffer: Buffer, publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder: "arena-ai/avatars",
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
