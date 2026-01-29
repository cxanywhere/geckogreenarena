import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface SlideContent {
  slideNumber: number;
  title: string;
  content: string;
  bullets: string[];
}

const SLIDES: SlideContent[] = [
  {
    slideNumber: 1,
    title: "Welcome to GeckoGreen",
    content: "The fastest growing locally owned lawn & pest company in Dallas/Fort Worth.",
    bullets: [
      "Today: who we are, how we operate, what we sell, how to win",
      "Next: Arena AI training + certification",
      "Your journey: Intro → Chapter 1 → Chapter 2 → Quiz → Roleplays → Certified"
    ]
  },
  {
    slideNumber: 2,
    title: "Who We Are",
    content: "Locally owned lawn & pest company serving the DFW metroplex.",
    bullets: [
      "20+ years of experience in North Texas",
      "Superior service focused on exceeding expectations",
      "We build winning reps through training, discipline, and teamwork"
    ]
  },
  {
    slideNumber: 3,
    title: "Mission & Culture",
    content: "Mission: \"The most rewarding and fun sales job you've ever had.\"",
    bullets: [
      "Building confidence and communication skills",
      "Becoming consistent and professional",
      "Earning through performance",
      "You are not \"just selling\"—you are representing the brand"
    ]
  },
  {
    slideNumber: 4,
    title: "What We Do (Services We Offer)",
    content: "Complete lawn and pest care solutions for North Texas homeowners.",
    bullets: [
      "Lawn fertilization & weed control",
      "Aeration & grub control",
      "Fire ant control",
      "Tree and shrub care",
      "Residential pest control",
      "Mosquito control",
      "All services ladder into a complete year-round program"
    ]
  },
  {
    slideNumber: 5,
    title: "Your Certification Path (Arena AI)",
    content: "After this intro, you will complete your Arena AI certification.",
    bullets: [
      "Arena AI Chapter 1: product + fundamentals",
      "Arena AI Chapter 2: field execution + objections",
      "Quiz: prove you know the essentials",
      "Roleplays: prove you can run real conversations",
      "Outcome: Get certified and start the season ready to perform"
    ]
  },
  {
    slideNumber: 6,
    title: "Kickoff: Introductions",
    content: "Take a moment to introduce yourself and set your goals.",
    bullets: [
      "Share your name + background",
      "Your goal this season (income + growth)",
      "One skill you want to sharpen: starting conversations, handling objections, confidence at the door, or consistency and pace"
    ]
  },
  {
    slideNumber: 7,
    title: "How You Win (Training Rules)",
    content: "Your outcome = the effort you put in.",
    bullets: [
      "Take notes and treat training like the job",
      "Ask questions early (small confusion becomes big mistakes)",
      "Study in spare time",
      "Memorize key talk tracks and expectations",
      "Practice often—roleplay is the fastest path to confidence",
      "Repetition = Mastery"
    ]
  },
  {
    slideNumber: 8,
    title: "Your Role: Neighborhood Marketing Rep (NMR)",
    content: "You are the face of GeckoGreen at the door.",
    bullets: [
      "You make the first impression",
      "You set reasonable expectations (protects customer relationship)",
      "You represent the brand at the door",
      "You grow, develop, and earn through performance",
      "You operate as part of a team—not alone"
    ]
  },
  {
    slideNumber: 9,
    title: "Work Hours & Field Reality",
    content: "Pre-season hours vary with weather and sunset. Spring hours are typically afternoon and evening.",
    bullets: [
      "The best reps win by showing up prepared",
      "Stay consistent",
      "Keep pace even when it gets hard",
      "Consistency beats motivation"
    ]
  },
  {
    slideNumber: 10,
    title: "Professional Standards (Arrive Ready)",
    content: "Always Be Training. Show up prepared every day.",
    bullets: [
      "Positive attitude",
      "Badge + permit visible",
      "Fully charged company phone",
      "Clean clothing per company standards",
      "Neat overall appearance"
    ]
  },
  {
    slideNumber: 11,
    title: "Daily Performance Goals (Your Scorecard)",
    content: "Track these KPIs daily to measure your success.",
    bullets: [
      "Knocks: 125/day (leave fliers on every door)",
      "Contacts: 30/day",
      "Presentations: 15/day",
      "Sales: 3/day",
      "Callbacks: 2/day minimum",
      "Follow up with new customers as needed"
    ]
  },
  {
    slideNumber: 12,
    title: "Team Culture (T.E.A.M.)",
    content: "T.E.A.M. = Together Everyone Achieves More",
    bullets: [
      "We are more successful together than apart",
      "Mutual respect and support makes everyone better",
      "We win by doing the basics consistently—and helping others do the same"
    ]
  },
  {
    slideNumber: 13,
    title: "Your Partner: Production Team",
    content: "The production team starts at 6 AM and handles 15–25 treatments per day.",
    bullets: [
      "Target pace: 1 min / 1000 sq ft",
      "Communicate with customers",
      "Analyze needs and provide treatments",
      "Handle follow-up service calls",
      "Support sales efforts",
      "40+ hours training/year"
    ]
  },
  {
    slideNumber: 14,
    title: "Your Partner: Customer Service & Administration",
    content: "The customer service team is the hub of operations.",
    bullets: [
      "Customer support and follow-up",
      "Scheduling of services",
      "Accounts receivable",
      "Supports production and sales operations",
      "HR support"
    ]
  },
  {
    slideNumber: 15,
    title: "PTO Policy (BambooHR)",
    content: "All time-off requests must be submitted via BambooHR.",
    bullets: [
      "You must also call/text your manager after submitting",
      "Requests not in BambooHR will not be considered",
      "PTO accrues starting day 90: 1.54 hours/week (10 days/year)",
      "PTO can be used after 90 days"
    ]
  },
  {
    slideNumber: 16,
    title: "PTO: Sick Time + Vacation Rules",
    content: "Know the difference between sick time and vacation requests.",
    bullets: [
      "Sick time: provide manager minimum 1.5 hours notice to use PTO",
      "Vacation (>1 day off): submit request at least 1 week in advance in BambooHR"
    ]
  },
  {
    slideNumber: 17,
    title: "Lawn Care 101: Why Lawn Care Matters",
    content: "A beautiful lawn provides real value to homeowners.",
    bullets: [
      "Green, thick, beautiful, weed-free landscape",
      "Pride of ownership",
      "Protects property investment (landscape value matters)",
      "Environmental benefits: traps noise/dust, reduces erosion, improves air quality",
      "Safe play area for children",
      "Convenience + safety: we do it so customers don't have to"
    ]
  },
  {
    slideNumber: 18,
    title: "How GeckoGreen Does It Better",
    content: "Our competitive advantages set us apart.",
    bullets: [
      "Customized approach for each lawn",
      "Licensed and trained specialists",
      "Best products available",
      "Friendly, helpful customer service staff"
    ]
  },
  {
    slideNumber: 19,
    title: "How We Deliver Results (Treatment System)",
    content: "A series of properly timed treatments to improve and maintain the lawn.",
    bullets: [
      "We use seasonal applications of:",
      "Fertilizers",
      "Weed controls",
      "Insect controls",
      "Disease controls",
      "Supplemental services",
      "Timing is critical for visible results"
    ]
  },
  {
    slideNumber: 20,
    title: "Fertilizer Basics (What It Does)",
    content: "Fertilizer = food for plants.",
    bullets: [
      "Improves health and vigor",
      "Improves density and color",
      "Proper type/amount depends on grass type + season",
      "Timing is critical for visible results"
    ]
  },
  {
    slideNumber: 21,
    title: "N-P-K Explained (Example: 30-2-6)",
    content: "Understanding the three key nutrients in fertilizer.",
    bullets: [
      "Nitrogen (N): greening + top growth",
      "Phosphorus (P): stronger roots",
      "Potassium (K): stronger roots, water regulation, disease resistance",
      "We match fertilizer to grass type and season"
    ]
  },
  {
    slideNumber: 22,
    title: "Fertilizer Types (Customer Questions)",
    content: "Customers often ask about fertilizer options.",
    bullets: [
      "Organic vs mineral (plants cannot tell the difference)",
      "Slow release vs fast release",
      "Liquid vs dry (plants cannot tell the difference)",
      "Product choice varies by season/weather and lawn needs"
    ]
  },
  {
    slideNumber: 23,
    title: "Grass Types in North Texas",
    content: "Know the common grass types in our service area.",
    bullets: [
      "Bermuda: warm-season, full sun, drought-tolerant",
      "St. Augustine: warm-season, shade-tolerant, thick blades",
      "Rye: cool-season, used for winter overseeding"
    ]
  },
  {
    slideNumber: 24,
    title: "Weeds: Definition + Categories",
    content: "Weeds = plants growing where they are not wanted.",
    bullets: [
      "Many weeds grow rapidly and repeatedly",
      "Two major types: Grassy weeds and Broadleaf weeds",
      "Classifications: Seasonal timing, Annual vs perennial, Controllable vs non-controllable"
    ]
  },
  {
    slideNumber: 25,
    title: "Common Weeds Customers Mention",
    content: "Be familiar with weeds homeowners commonly identify.",
    bullets: [
      "Grassy weeds: Blue Stem, Dallisgrass, Crabgrass",
      "Broadleaf weeds: Black Medic, Clover, Thistle, Dandelion, Oxalis",
      "Customer language: \"spreads fast,\" \"deep roots,\" \"shows up in spring\""
    ]
  },
  {
    slideNumber: 26,
    title: "Weed Control: Pre-Emergent vs Post-Emergent",
    content: "Best weed control is a thick, healthy lawn.",
    bullets: [
      "Pre-emergent: applied before weeds emerge; creates a barrier under the soil",
      "Post-emergent: applied after weeds are visible; selective control",
      "We do not use non-selective products like Round-up"
    ]
  },
  {
    slideNumber: 27,
    title: "Customer Expectations: Post-Emergent Timeline",
    content: "Set proper expectations for weed treatment results.",
    bullets: [
      "Post-emergent acts like a growth stimulant → weed dies from accelerated growth",
      "Typical timeline: ~2 weeks",
      "Fast growers respond faster; slow growers take longer",
      "Multiple applications may be needed",
      "Weed seed build-up can create multiple generations"
    ]
  },
  {
    slideNumber: 28,
    title: "Diseases & Insects",
    content: "Understanding common lawn health issues.",
    bullets: [
      "Diseases: often driven by environmental stress/conditions + cultural practices",
      "Common contributors: excess moisture, heat/cold, dull mower blades, grass variety",
      "Insects: can feed on foliage or roots",
      "Recovery depends on insect type and early detection"
    ]
  },
  {
    slideNumber: 29,
    title: "Add-On / Supplemental Services",
    content: "Additional services that enhance the core program.",
    bullets: [
      "Aeration: removes soil plugs; improves air/water/nutrient movement; better roots; \"turns the lawn into a giant sponge\"",
      "Grub treatment: preventative control",
      "Fire ant control: prevent or treat infestations"
    ]
  },
  {
    slideNumber: 30,
    title: "Homeowner Partnership",
    content: "Results do not happen overnight; we are partners with the homeowner.",
    bullets: [
      "Watering: ~1\"/week depending on rainfall",
      "Mowing at proper height",
      "Manage heavy traffic & dog damage",
      "Reduce shade (tree trimming)",
      "Seeding/sodding/plugging thin areas when needed"
    ]
  },
  {
    slideNumber: 31,
    title: "Program Overview (Seasonal Cycle)",
    content: "Year-round care for consistent results.",
    bullets: [
      "Winter: prevention & preparation",
      "Spring: growth/color + weed control",
      "Summer: color/health + weed control",
      "Fall: health & prevention"
    ]
  },
  {
    slideNumber: 32,
    title: "Program Details",
    content: "10 total applications per year deliver comprehensive lawn care.",
    bullets: [
      "10 total applications/year: 9 lawn + 1 spring aeration",
      "First 2 applications: 3–4 weeks apart for a start-up boost",
      "Then: 4–5 week intervals",
      "Service calls available between treatments",
      "Coach customer to wait until after the first two applications before requesting service calls"
    ]
  },
  {
    slideNumber: 33,
    title: "Pre-Service Notification & Payment Options",
    content: "Customer receives an email one day prior to service.",
    bullets: [
      "EasyPay: first application 50% off; card charged day after service posts",
      "Prepay: pay upfront; up to 10% discount"
    ]
  },
  {
    slideNumber: 34,
    title: "What Customers Can Expect (No Shortcuts)",
    content: "Set realistic timelines for improvement.",
    bullets: [
      "Easy weeds: 10–14 days",
      "Color improvement: ~14 days (during fertilizer season)",
      "Difficult weeds: improvement by 3–4 treatments",
      "Winter dormancy is not death",
      "Thickness: improves over 3–4 treatments",
      "End of year one: more consistent color, fewer weeds, thicker turf"
    ]
  },
  {
    slideNumber: 35,
    title: "Common Challenges",
    content: "Be prepared to address these common issues.",
    bullets: [
      "Bare/thin spots",
      "Heavy traffic areas",
      "Poor mowing/watering habits",
      "Skipped applications",
      "Heavy shade",
      "Lawn full of weeds (requires patience)"
    ]
  },
  {
    slideNumber: 36,
    title: "How to Sell It (Simple Rule)",
    content: "Always tie feature → benefit.",
    bullets: [
      "Do not use all talking points at once; save some for objections",
      "Focus on what matters to THEM",
      "Listen first, then present the right solution"
    ]
  },
  {
    slideNumber: 37,
    title: "Why GeckoGreen Wins",
    content: "Our key differentiators that close deals.",
    bullets: [
      "Licensed specialists",
      "Strong customer service commitment",
      "Free service calls",
      "Professional lawn analysis on the first visit",
      "North Texas experience",
      "Locally owned/operated",
      "Seasonally adjusted, customized applications",
      "Strong reputation and reviews"
    ]
  }
];

async function generateSlideImage(slide: SlideContent): Promise<string | null> {
  const filename = `chapter0-slide-${slide.slideNumber.toString().padStart(2, '0')}.png`;
  console.log(`Generating slide ${slide.slideNumber}: ${slide.title}...`);

  const bulletText = slide.bullets.map(b => `• ${b}`).join('\n');
  
  const prompt = `Create a professional mobile training slide image in portrait orientation (9:16 aspect ratio).

This is a presentation slide that MUST display the following text content clearly and legibly:

TITLE: ${slide.title}

SUBTITLE: ${slide.content}

BULLET POINTS:
${bulletText}

DESIGN REQUIREMENTS:
- Professional corporate training slide design
- Green color theme (#22C55E as primary accent color)
- Clean white or light background for readability
- Title should be large and bold at the top
- Subtitle should be medium-sized below the title
- Bullet points should be clearly formatted with good spacing
- All text must be sharp, readable, and properly formatted
- Mobile-optimized portrait layout (9:16)
- Professional, clean, modern slide aesthetic
- DO NOT include any images or icons that obscure the text
- Text is the primary focus - make it the star of the slide`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      console.error("No response parts received");
      return null;
    }

    for (const part of parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        if (imageData) {
          const uploadsDir = path.join(process.cwd(), "public", "uploads", "chapter0-slides");
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          
          const filepath = path.join(uploadsDir, filename);
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync(filepath, buffer);
          
          console.log(`✓ Generated: ${filename}`);
          return `/uploads/chapter0-slides/${filename}`;
        }
      }
    }

    console.error("No image data in response");
    return null;
  } catch (error: any) {
    console.error(`Failed: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log("Generating Chapter 0 slides with content...\n");
  
  // Get slide range from command line args
  const startSlide = parseInt(process.argv[2]) || 1;
  const endSlide = parseInt(process.argv[3]) || SLIDES.length;
  
  console.log(`Generating slides ${startSlide} to ${endSlide}\n`);

  for (const slide of SLIDES) {
    if (slide.slideNumber >= startSlide && slide.slideNumber <= endSlide) {
      await generateSlideImage(slide);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log("\n✓ Done");
}

main().catch(console.error);
