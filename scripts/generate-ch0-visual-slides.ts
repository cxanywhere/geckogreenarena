import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface SlideConfig {
  slideNumber: number;
  title: string;
  content: string;
  bullets: string[];
  visualDescription: string;
}

const SLIDES: SlideConfig[] = [
  {
    slideNumber: 1,
    title: "Welcome to GeckoGreen",
    content: "The fastest growing locally owned lawn & pest company in Dallas/Fort Worth.",
    bullets: [
      "Today: who we are, how we operate, what we sell, how to win",
      "Next: Arena AI training + certification",
      "Your journey: Intro → Chapter 1 → Chapter 2 → Quiz → Roleplays → Certified"
    ],
    visualDescription: "A beautiful, lush green suburban lawn in Texas with a welcoming front door, bright sunny day, professional lawn care aesthetic"
  },
  {
    slideNumber: 2,
    title: "Who We Are",
    content: "Locally owned lawn & pest company serving the DFW metroplex.",
    bullets: [
      "20+ years of experience in North Texas",
      "Superior service focused on exceeding expectations",
      "We build winning reps through training, discipline, and teamwork"
    ],
    visualDescription: "Map silhouette of Dallas/Fort Worth Texas metroplex with green highlighting, professional team members in green polo shirts"
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
    ],
    visualDescription: "Diverse team of enthusiastic sales professionals high-fiving, team huddle, positive energy, green uniforms"
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
    ],
    visualDescription: "Grid of service icons: fertilizer spreader, lawn aerator, fire ant mound, healthy tree, pest control spray, mosquito crossed out"
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
    ],
    visualDescription: "Gamified progress path with checkpoints leading to a gold certification badge, arena/gladiator theme, achievement stars"
  },
  {
    slideNumber: 6,
    title: "Kickoff: Introductions",
    content: "Take a moment to introduce yourself and set your goals.",
    bullets: [
      "Share your name + background",
      "Your goal this season (income + growth)",
      "One skill you want to sharpen"
    ],
    visualDescription: "Team meeting setting, people introducing themselves, goal-setting imagery, collaborative atmosphere"
  },
  {
    slideNumber: 7,
    title: "How You Win (Training Rules)",
    content: "Your outcome = the effort you put in.",
    bullets: [
      "Take notes and treat training like the job",
      "Ask questions early",
      "Study in spare time",
      "Memorize key talk tracks",
      "Practice often—roleplay is the fastest path to confidence",
      "Repetition = Mastery"
    ],
    visualDescription: "Success ladder/staircase showing steps: notes, studying, memorizing, practicing, mastery trophy at top"
  },
  {
    slideNumber: 8,
    title: "Your Role: Neighborhood Marketing Rep",
    content: "You are the face of GeckoGreen at the door.",
    bullets: [
      "You make the first impression",
      "You set reasonable expectations",
      "You represent the brand at the door",
      "You grow, develop, and earn through performance",
      "You operate as part of a team"
    ],
    visualDescription: "Professional sales rep at a doorstep, confident posture, homeowner greeting, suburban home background"
  },
  {
    slideNumber: 9,
    title: "Work Hours & Field Reality",
    content: "Pre-season hours vary with weather and sunset.",
    bullets: [
      "The best reps win by showing up prepared",
      "Stay consistent",
      "Keep pace even when it gets hard",
      "Consistency beats motivation"
    ],
    visualDescription: "Timeline showing sun position afternoon to evening, sales rep walking through neighborhood, adaptable weather"
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
    ],
    visualDescription: "Flat-lay of professional gear: clean polo, ID badge, smartphone, notebook, clean shoes, organized layout"
  },
  {
    slideNumber: 11,
    title: "Daily Performance Goals",
    content: "Track these KPIs daily to measure your success.",
    bullets: [
      "Knocks: 125/day",
      "Contacts: 30/day",
      "Presentations: 15/day",
      "Sales: 3/day",
      "Callbacks: 2/day minimum"
    ],
    visualDescription: "Dashboard with gauges and meters showing KPIs, sales funnel visualization, green progress indicators"
  },
  {
    slideNumber: 12,
    title: "Team Culture (T.E.A.M.)",
    content: "T.E.A.M. = Together Everyone Achieves More",
    bullets: [
      "We are more successful together than apart",
      "Mutual respect and support makes everyone better",
      "We win by doing the basics consistently"
    ],
    visualDescription: "Team huddle with arms around shoulders, interlocking puzzle pieces, diverse group in green uniforms"
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
      "40+ hours training/year"
    ],
    visualDescription: "Service truck arriving at dawn, technician with equipment treating a lawn, professional service aesthetic"
  },
  {
    slideNumber: 14,
    title: "Customer Service & Administration",
    content: "The customer service team is the hub of operations.",
    bullets: [
      "Customer support and follow-up",
      "Scheduling of services",
      "Accounts receivable",
      "Supports production and sales",
      "HR support"
    ],
    visualDescription: "Hub-and-spoke diagram with customer service at center, connected to phone, calendar, invoice, clipboard icons"
  },
  {
    slideNumber: 15,
    title: "PTO Policy (BambooHR)",
    content: "All time-off requests must be submitted via BambooHR.",
    bullets: [
      "Call/text your manager after submitting",
      "Requests not in BambooHR will not be considered",
      "PTO accrues starting day 90: 1.54 hours/week",
      "PTO can be used after 90 days"
    ],
    visualDescription: "Simple 3-step process flow: computer submission, phone notification, approval checkmark, calendar with Day 90"
  },
  {
    slideNumber: 16,
    title: "PTO: Sick Time + Vacation Rules",
    content: "Know the difference between sick time and vacation requests.",
    bullets: [
      "Sick time: provide manager minimum 1.5 hours notice",
      "Vacation (>1 day off): submit at least 1 week in advance"
    ],
    visualDescription: "Two side-by-side cards comparing sick day (clock icon) vs vacation (calendar icon), clear visual distinction"
  },
  {
    slideNumber: 17,
    title: "Why Lawn Care Matters",
    content: "A beautiful lawn provides real value to homeowners.",
    bullets: [
      "Green, thick, beautiful, weed-free landscape",
      "Pride of ownership",
      "Protects property investment",
      "Environmental benefits",
      "Safe play area for children",
      "Convenience + safety"
    ],
    visualDescription: "Dramatic before/after split: left side weedy neglected lawn, right side lush green beautiful lawn, same house"
  },
  {
    slideNumber: 18,
    title: "How GeckoGreen Does It Better",
    content: "Our competitive advantages set us apart.",
    bullets: [
      "Customized approach for each lawn",
      "Licensed and trained specialists",
      "Best products available",
      "Friendly, helpful customer service"
    ],
    visualDescription: "4-quadrant grid showing: personalized clipboard, certification badge, premium product bottles, happy customer"
  },
  {
    slideNumber: 19,
    title: "Treatment System",
    content: "A series of properly timed treatments to improve and maintain the lawn.",
    bullets: [
      "Seasonal applications of:",
      "Fertilizers",
      "Weed controls",
      "Insect controls",
      "Disease controls",
      "Timing is critical"
    ],
    visualDescription: "Circular seasonal cycle: Winter (blue), Spring (light green), Summer (vibrant green), Fall (golden), clock overlay"
  },
  {
    slideNumber: 20,
    title: "Fertilizer Basics",
    content: "Fertilizer = food for plants.",
    bullets: [
      "Improves health and vigor",
      "Improves density and color",
      "Proper type/amount depends on grass type + season",
      "Timing is critical for visible results"
    ],
    visualDescription: "Close-up of healthy thick grass blades, side comparison thin pale grass vs thick vibrant green grass, soil cross-section showing roots"
  },
  {
    slideNumber: 21,
    title: "N-P-K Explained (30-2-6)",
    content: "Understanding the three key nutrients in fertilizer.",
    bullets: [
      "Nitrogen (N): greening + top growth",
      "Phosphorus (P): stronger roots",
      "Potassium (K): roots, water, disease resistance",
      "We match fertilizer to grass type and season"
    ],
    visualDescription: "Three colored bars N-P-K with icons: N=green leaf, P=root system below soil, K=shield/water droplet, underground view"
  },
  {
    slideNumber: 22,
    title: "Fertilizer Types",
    content: "Customers often ask about fertilizer options.",
    bullets: [
      "Organic vs mineral",
      "Slow release vs fast release",
      "Liquid vs dry",
      "Product choice varies by season"
    ],
    visualDescription: "Comparison icons: leaf vs crystal, clock vs lightning bolt, droplet vs granules, sun/rain weather icons"
  },
  {
    slideNumber: 23,
    title: "Grass Types in North Texas",
    content: "Know the common grass types in our service area.",
    bullets: [
      "Bermuda: warm-season, full sun, drought-tolerant, fine texture",
      "St. Augustine: warm-season, shade-tolerant, wide thick blades",
      "Rye: cool-season, fine blades, winter overseeding"
    ],
    visualDescription: "THREE REALISTIC CLOSE-UP PHOTOS of grass blade textures side by side: (1) Bermuda grass with thin wiry blades in full sun, (2) St. Augustine with thick wide flat blades showing distinctive boat-shaped tips, (3) Rye grass with fine soft bright green blades. Each clearly labeled. Botanical identification style."
  },
  {
    slideNumber: 24,
    title: "Weeds: Definition + Categories",
    content: "Weeds = plants growing where they are not wanted.",
    bullets: [
      "Many weeds grow rapidly and repeatedly",
      "Grassy weeds vs Broadleaf weeds",
      "Seasonal, Annual vs Perennial",
      "Controllable vs Non-controllable"
    ],
    visualDescription: "Split comparison: LEFT shows GRASSY WEED (crabgrass spreading in lawn), RIGHT shows BROADLEAF WEED (dandelion with distinctive leaves). Clear visual distinction between the two types."
  },
  {
    slideNumber: 25,
    title: "Common Weeds Customers Mention",
    content: "Be familiar with weeds homeowners commonly identify.",
    bullets: [
      "Grassy: Blue Stem, Dallisgrass, Crabgrass",
      "Broadleaf: Black Medic, Clover, Thistle, Dandelion, Oxalis"
    ],
    visualDescription: "WEED IDENTIFICATION GALLERY with 8 realistic photos: (1) Crabgrass with spreading fingers, (2) Dallisgrass clump, (3) Dandelion with yellow flower and jagged leaves, (4) White Clover with 3-leaf pattern, (5) Purple Thistle with spiny leaves, (6) Oxalis/wood sorrel with heart-shaped leaves, (7) Black Medic with tiny yellow flowers, (8) Blue Stem grass. Each weed shown clearly for field identification."
  },
  {
    slideNumber: 26,
    title: "Weed Control: Pre vs Post Emergent",
    content: "Best weed control is a thick, healthy lawn.",
    bullets: [
      "Pre-emergent: applied before weeds emerge, barrier under soil",
      "Post-emergent: applied after weeds visible, selective control",
      "We do not use non-selective products like Round-up"
    ],
    visualDescription: "Soil cross-section diagram: TOP shows pre-emergent barrier line blocking seedling from emerging, BOTTOM shows post-emergent spray targeting visible weed above ground. Clear before/after visualization."
  },
  {
    slideNumber: 27,
    title: "Post-Emergent Timeline",
    content: "Set proper expectations for weed treatment results.",
    bullets: [
      "Post-emergent acts like growth stimulant → weed dies",
      "Typical timeline: ~2 weeks",
      "Fast growers respond faster",
      "Multiple applications may be needed"
    ],
    visualDescription: "4-stage timeline: Day 1 spray application, Week 1 weed yellowing/curling, Week 2 weed brown/dying, Final clean lawn. Calendar marks showing progress."
  },
  {
    slideNumber: 28,
    title: "Diseases & Insects",
    content: "Understanding common lawn health issues.",
    bullets: [
      "Diseases: environmental stress, excess moisture, heat/cold",
      "Common contributors: dull mower blades, grass variety",
      "Insects: feed on foliage or roots",
      "Early detection is key"
    ],
    visualDescription: "Split image: TOP shows brown patch disease (circular dead spots in lawn), BOTTOM shows grub damage (white grubs underground eating roots). Diagnostic style."
  },
  {
    slideNumber: 29,
    title: "Add-On / Supplemental Services",
    content: "Additional services that enhance the core program.",
    bullets: [
      "Aeration: removes soil plugs, improves air/water/nutrients",
      "Grub treatment: preventative control",
      "Fire ant control: prevent or treat infestations"
    ],
    visualDescription: "Three service cards: (1) Aeration machine with soil plugs on lawn, (2) Grub lifecycle underground, (3) Fire ant mound with treatment being applied. Premium add-on styling."
  },
  {
    slideNumber: 30,
    title: "Homeowner Partnership",
    content: "Results do not happen overnight; we are partners.",
    bullets: [
      "Watering: ~1\"/week",
      "Mowing at proper height",
      "Manage heavy traffic & dog damage",
      "Reduce shade (tree trimming)",
      "Seeding thin areas when needed"
    ],
    visualDescription: "Partnership handshake between lawn pro and homeowner, checklist icons: sprinkler, lawn mower at correct height, tree trimming, grass seed bag"
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
    ],
    visualDescription: "Circular seasonal wheel: Winter (dormant brown), Spring (bright green emerging), Summer (lush dark green), Fall (golden green). Same lawn through seasons."
  },
  {
    slideNumber: 32,
    title: "Program Details",
    content: "10 total applications per year deliver comprehensive lawn care.",
    bullets: [
      "10 applications: 9 lawn + 1 spring aeration",
      "First 2: 3–4 weeks apart for boost",
      "Then: 4–5 week intervals",
      "Service calls available between treatments"
    ],
    visualDescription: "Annual calendar with 10 treatment dots marked, first 2 close together then evenly spaced, service truck icon visiting home repeatedly"
  },
  {
    slideNumber: 33,
    title: "Payment Options",
    content: "Customer receives email one day prior to service.",
    bullets: [
      "EasyPay: first application 50% off, auto-charge",
      "Prepay: pay upfront, up to 10% discount"
    ],
    visualDescription: "Two payment cards side by side: EasyPay with credit card and discount badge, Prepay with dollar signs and savings badge. Modern fintech style."
  },
  {
    slideNumber: 34,
    title: "What Customers Can Expect",
    content: "Set realistic timelines for improvement.",
    bullets: [
      "Easy weeds: 10–14 days",
      "Color improvement: ~14 days",
      "Difficult weeds: 3–4 treatments",
      "Thickness: 3–4 treatments",
      "End of year one: consistent color, fewer weeds, thicker turf"
    ],
    visualDescription: "Progress timeline from weedy thin lawn to beautiful thick lawn, milestone markers at 2 weeks, 1 month, 3 months, 1 year"
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
      "Lawn full of weeds"
    ],
    visualDescription: "6-panel grid showing problem areas: bare patch, worn path, dry stressed grass, shaded thin area, weed-filled section, poor mowing lines"
  },
  {
    slideNumber: 36,
    title: "How to Sell It (Simple Rule)",
    content: "Always tie feature → benefit.",
    bullets: [
      "Don't use all talking points at once",
      "Save some for objections",
      "Focus on what matters to THEM",
      "Listen first, then present solution"
    ],
    visualDescription: "Feature arrow pointing to Benefit visualization, sales rep in listening pose with homeowner, conversation bubbles"
  },
  {
    slideNumber: 37,
    title: "Why GeckoGreen Wins",
    content: "Our key differentiators that close deals.",
    bullets: [
      "Licensed specialists",
      "Strong customer service",
      "Free service calls",
      "Professional lawn analysis",
      "North Texas experience",
      "Locally owned",
      "Strong reviews"
    ],
    visualDescription: "Trophy/winner podium with competitive advantage badges radiating outward, championship aesthetic, green and gold"
  },
  {
    slideNumber: 38,
    title: "Quiz: Daily Goals",
    content: "What is the target number of knocks per day?",
    bullets: [
      "A) 50 knocks",
      "B) 75 knocks",
      "C) 125 knocks ✓",
      "D) 200 knocks"
    ],
    visualDescription: "Quiz card design with question prominently displayed, 4 multiple choice options, correct answer C highlighted in green"
  },
  {
    slideNumber: 39,
    title: "Quiz: Weed Control",
    content: "What is the difference between pre-emergent and post-emergent?",
    bullets: [
      "A) Grass type difference",
      "B) Before vs after weeds emerge ✓",
      "C) Liquid vs granular",
      "D) No difference"
    ],
    visualDescription: "Quiz card design with question prominently displayed, 4 multiple choice options, correct answer B highlighted in green"
  },
  {
    slideNumber: 40,
    title: "Quiz: Annual Program",
    content: "How many total applications are included in the annual program?",
    bullets: [
      "A) 6 applications",
      "B) 8 applications",
      "C) 10 applications ✓",
      "D) 12 applications"
    ],
    visualDescription: "Quiz card design with question prominently displayed, 4 multiple choice options, correct answer C highlighted in green"
  }
];

async function generateSlideImage(slide: SlideConfig): Promise<string | null> {
  const filename = `chapter0-slide-${slide.slideNumber.toString().padStart(2, '0')}.png`;
  console.log(`Generating slide ${slide.slideNumber}: ${slide.title}...`);

  const bulletText = slide.bullets.map(b => `• ${b}`).join('\n');
  
  const prompt = `Create a professional mobile training slide image in portrait orientation (9:16 aspect ratio).

This slide MUST combine BOTH readable text content AND supporting visual imagery.

=== TEXT CONTENT (must be clearly readable) ===
TITLE: ${slide.title}
SUBTITLE: ${slide.content}
BULLET POINTS:
${bulletText}

=== VISUAL IMAGERY (integrated with text) ===
${slide.visualDescription}

=== DESIGN REQUIREMENTS ===
1. LAYOUT: Top 40% for title and visual imagery, Bottom 60% for bullet points
2. TEXT: All text must be sharp, readable, well-formatted with good contrast
3. VISUALS: Integrate the visual imagery as a supporting element alongside or behind the title area
4. COLOR: Green theme (#22C55E accent), clean white/light background for text areas
5. STYLE: Professional corporate training slide, mobile-optimized
6. FORMAT: Portrait 9:16 aspect ratio

The visual imagery should enhance understanding of the topic, not obscure the text. Text readability is priority #1.`;

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
  console.log("Generating Chapter 0 slides with content + visuals...\n");
  
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
