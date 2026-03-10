import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import fs from "fs";
import path from "path";
import { Buffer } from "node:buffer";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const geminiAi = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : new GoogleGenAI({
      apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "",
      httpOptions: {
        apiVersion: "",
        baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
      },
    });

const NARRATION_DIR = path.join(process.cwd(), "public", "uploads", "narration");

if (!fs.existsSync(NARRATION_DIR)) {
  fs.mkdirSync(NARRATION_DIR, { recursive: true });
}

export interface NarrationScript {
  slideIndex: number;
  title: string;
  script: string;
}

export interface NarrationResult {
  slideIndex: number;
  title: string;
  script: string;
  audioUrl: string;
}

function writeWavFile(filepath: string, pcmData: Buffer): void {
  const numChannels = 1;
  const sampleRate = 24000;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const headerSize = 44;

  const header = Buffer.alloc(headerSize);
  header.write("RIFF", 0);
  header.writeUInt32LE(dataSize + headerSize - 8, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  const wavBuffer = Buffer.concat([header, pcmData]);
  fs.writeFileSync(filepath, wavBuffer);
}

export async function generateNarrationScript(
  chapterTitle: string,
  slideIndex: number,
  slide: { title: string; content: string; bullets?: string[]; type: string }
): Promise<string> {
  const bulletText = slide.bullets?.map(b => `- ${b}`).join("\n") || "";

  const prompt = `You are a professional sales trainer delivering a presentation to a team of enterprise B2B SaaS sales representatives. Generate a natural, engaging voiceover narration script for the following presentation slide.

Chapter: ${chapterTitle}
Slide ${slideIndex + 1}: ${slide.title}
${slide.type === 'roleplay' ? '(This is a roleplay introduction slide)' : ''}

Slide content: ${slide.content}

Key points:
${bulletText}

Guidelines:
- Speak as if you're presenting live to a room of sales reps
- Be conversational but professional — like a top sales leader coaching their team
- Cover ALL the key points naturally, weaving them into the narration
- Use transitions and emphasis to keep it engaging
- Keep it between 45-90 seconds when spoken (roughly 120-220 words)
- Don't say "slide" or reference visual elements — just deliver the content
- For roleplay slides, set up the scenario and explain what reps need to practice
- End with a brief transition or takeaway that connects to the next concept

Return ONLY the narration script text, no formatting or labels.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_completion_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

export async function generateNarrationAudio(
  chapterSlug: string,
  slideIndex: number,
  script: string
): Promise<string> {
  const filename = `narration-${chapterSlug}-${slideIndex}-${Date.now()}.mp3`;
  const filepath = path.join(NARRATION_DIR, filename);

  try {
    const ttsPrompt = `Read the following sales training narration in a confident, professional, and engaging tone. Speak clearly at a moderate pace, as if presenting to a team of enterprise sales professionals:\n\n${script}`;

    const response = await geminiAi.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: ttsPrompt }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Orus" },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
      throw new Error("No audio data returned from Gemini TTS");
    }

    const wavFilename = filename.replace('.mp3', '.wav');
    const wavFilepath = path.join(NARRATION_DIR, wavFilename);
    const pcmBuffer = Buffer.from(audioData, "base64");
    writeWavFile(wavFilepath, pcmBuffer);
    return `/uploads/narration/${wavFilename}`;
  } catch (geminiError: any) {
    console.log(`[Narration] Gemini TTS failed (${geminiError?.status || 'unknown'}), falling back to Edge TTS`);
    
    const tts = new MsEdgeTTS();
    await tts.setMetadata("en-US-GuyNeural", OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const tempDir = path.join(NARRATION_DIR, `temp-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    await tts.toFile(tempDir, script);
    const tempFile = path.join(tempDir, "audio.mp3");
    if (fs.existsSync(tempFile)) {
      fs.renameSync(tempFile, filepath);
      fs.rmdirSync(tempDir);
    }

    return `/uploads/narration/${filename}`;
  }
}

export async function generateChapterNarration(
  chapterSlug: string,
  chapterTitle: string,
  slides: Array<{ title: string; content: string; bullets?: string[]; type: string }>
): Promise<NarrationResult[]> {
  const results: NarrationResult[] = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    console.log(`[Narration] Generating script for slide ${i + 1}/${slides.length}: ${slide.title}`);

    const script = await generateNarrationScript(chapterTitle, i, slide);
    console.log(`[Narration] Script generated (${script.length} chars). Generating audio...`);

    const audioUrl = await generateNarrationAudio(chapterSlug, i, script);
    console.log(`[Narration] Audio saved: ${audioUrl}`);

    results.push({
      slideIndex: i,
      title: slide.title,
      script,
      audioUrl,
    });

    if (i < slides.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}
