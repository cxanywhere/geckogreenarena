import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface SlideConfig {
  slideNumber: number;
  title: string;
  content: string[];
  visualDescription: string;
}

const SLIDES: SlideConfig[] = [
  {
    slideNumber: 1,
    title: "Welcome to GeckoGreen",
    content: [
      "Intro to GeckoGreen",
      "Fastest growing locally owned lawn & pest company in Dallas/Fort Worth",
      "Today: who we are, how we operate, what we sell, how to win",
      "Next: Arena AI training + certification"
    ],
    visualDescription: "Full-bleed hero image of pristine green lawn with friendly sales rep at suburban doorstep greeting homeowner. Title block 'Intro to GeckoGreen' prominently displayed. Bottom journey strip showing icons: Intro → Chapter 1 → Chapter 2 → Quiz → Roleplays → Certified badge. Warm sunny Texas suburban setting."
  },
  {
    slideNumber: 2,
    title: "Who We Are",
    content: [
      "Locally owned lawn & pest company in DFW",
      "20+ years of experience",
      "Superior service focused on exceeding expectations",
      "We build winning reps through training, discipline, and teamwork"
    ],
    visualDescription: "DFW Dallas-Fort Worth map silhouette with glowing green service area highlight. Four tiles with icons: Local (map pin), 20+ Years (badge), Service Excellence (star), Growth (rising chart). Professional high-energy team photo strip at bottom showing diverse team in green uniforms."
  },
  {
    slideNumber: 3,
    title: "Mission & Culture",
    content: [
      "Mission: \"The most rewarding and fun sales job you've ever had.\"",
      "This season is about:",
      "• Building confidence and communication skills",
      "• Becoming consistent and professional",
      "• Earning through performance",
      "You are not \"just selling\"—you are representing the brand"
    ],
    visualDescription: "Large elegant mission quote card in center with premium typography. Background shows energetic team huddle of field reps gearing up for the day. Three badge icons at bottom: Confidence (chest up silhouette), Consistency (calendar check), Income (dollar rising). Motivational and inspiring feel."
  },
  {
    slideNumber: 4,
    title: "What We Do (Services We Offer)",
    content: [
      "• Lawn fertilization",
      "• Weed control",
      "• Aeration",
      "• Grub control",
      "• Fire ant control",
      "• Tree and shrub care",
      "• Residential pest control",
      "• Mosquito control"
    ],
    visualDescription: "8-card grid layout where each service has an icon and mini photo. Lawn fertilization (spreader), Weed control (spray bottle), Aeration (plug machine), Grub control (grub crossed out), Fire ant control (ant mound), Tree/shrub (healthy tree), Pest control (bug shield), Mosquito (mosquito crossed out). Bottom bar: 'All services ladder into a complete year-round program'. Clean organized grid."
  },
  {
    slideNumber: 5,
    title: "Your Certification Path (Arena AI)",
    content: [
      "After this intro, you will complete:",
      "• Arena AI Chapter 1: product + fundamentals",
      "• Arena AI Chapter 2: field execution + objections",
      "• Quiz: prove you know the essentials",
      "• Roleplays: prove you can run real conversations",
      "Outcome: Get certified and start the season ready to perform"
    ],
    visualDescription: "Gamified progress bar from 0% to 100% Certified with glowing milestone markers. Large 'GeckoGreen Certified NMR' badge design in gold and green at top. Mock Arena AI dashboard visual showing chapters, quiz, roleplays sections with progress meters. Achievement/gaming aesthetic."
  },
  {
    slideNumber: 6,
    title: "Kickoff: Introductions",
    content: [
      "• Name + background",
      "• Your goal this season (income + growth)",
      "One skill you want to sharpen:",
      "• Starting conversations",
      "• Handling objections",
      "• Confidence at the door",
      "• Consistency and pace"
    ],
    visualDescription: "'Introduce yourself' prompt cards in friendly welcoming design. Simple 'Goal Wall' layout with sticky-note style goals arranged on a board. Icons for each skill: conversation bubble, shield/objection deflect, confident stance silhouette, clock/pace meter. Collaborative team atmosphere."
  },
  {
    slideNumber: 7,
    title: "How You Win (Training Rules That Create Results)",
    content: [
      "Your outcome = effort you put in",
      "• Take notes and treat training like the job",
      "• Ask questions early (small confusion becomes big mistakes)",
      "• Study in spare time",
      "• Memorize key talk tracks and expectations",
      "• Practice often—roleplay is the fastest path to confidence"
    ],
    visualDescription: "6-step ladder infographic ascending upward: Notes → Study → Memorize → Practice → Roleplay → Results with icons at each step. 'Repetition = Mastery' stamp graphic in bold vintage motivational style. Success path visualization."
  },
  {
    slideNumber: 8,
    title: "Your Role: Neighborhood Marketing Rep (NMR)",
    content: [
      "• You make the first impression",
      "• You set reasonable expectations (protects customer relationship)",
      "• You represent the brand at the door",
      "• You grow, develop, and earn through performance",
      "• You operate as part of a team—not alone"
    ],
    visualDescription: "Two-panel illustration: Panel A shows professional rep greeting homeowner at door with friendly confident handshake. Panel B shows rep explaining a simple plan with clipboard to attentive homeowner. 'First Impression' headline with professional handshake icon. Suburban home doorstep setting."
  },
  {
    slideNumber: 9,
    title: "Work Hours & Field Reality",
    content: [
      "• Pre-season hours vary with weather and sunset",
      "• Spring hours typically afternoon and evening",
      "The best reps win by:",
      "• Showing up prepared",
      "• Staying consistent",
      "• Keeping pace even when it gets hard"
    ],
    visualDescription: "Seasonal timeline bar with sun position icons showing afternoon to evening work hours. Bold 'Consistency beats motivation' graphic in simple striking typography. Clock and calendar visuals. Sales rep walking through neighborhood at golden hour."
  },
  {
    slideNumber: 10,
    title: "Professional Standards (Arrive Ready)",
    content: [
      "• Positive attitude",
      "• Badge + permit",
      "• Fully charged company phone",
      "• Clean clothing per company standards",
      "• Neat overall appearance",
      "• Always Be Training"
    ],
    visualDescription: "Flat-lay gear photo showing: GeckoGreen badge, company smartphone fully charged, clean green polo shirt, professional notebook, pen arranged neatly on surface. 'Always Be Training' badge graphic designed like a military/scout patch in green and gold colors."
  },
  {
    slideNumber: 11,
    title: "Daily Performance Goals (Your Scorecard)",
    content: [
      "• Knocks: 125/day (leave fliers on every door)",
      "• Contacts: 30/day",
      "• Presentations: 15/day",
      "• Sales: 3/day",
      "• Call backs: 2/day minimum",
      "• Follow up with new customers as needed"
    ],
    visualDescription: "KPI dashboard with 6 tiles showing each metric with icons and numbers. Sales funnel graphic: Knocks → Contacts → Presentations → Sales flowing downward with decreasing widths. 'Daily pace' speedometer-style meter showing optimal green performance zone."
  },
  {
    slideNumber: 12,
    title: "Team Culture (T.E.A.M.)",
    content: [
      "T.E.A.M. = Together Everyone Achieves More",
      "• We are more successful together than apart",
      "• Mutual respect and support makes everyone better",
      "• We win by doing the basics consistently—and helping others do the same"
    ],
    visualDescription: "Team huddle photo of energetic sales team with arms together. Large 'T.E.A.M.' acronym graphic with each letter expanded: Together, Everyone, Achieves, More. Interlocking shapes or linked chain visual showing unity and connection. Green uniforms."
  },
  {
    slideNumber: 13,
    title: "Your Partner: Production Team",
    content: [
      "• Start time: 6 AM",
      "• 15–25 treatments/day (target pace: 1 min / 1000 sq ft)",
      "• Communicate with customers",
      "• Analyze needs and provide treatments",
      "• Handle follow-up service calls",
      "• Support sales efforts",
      "• 40+ hours training/year"
    ],
    visualDescription: "Day-in-the-life visual strip showing: green service truck → technician analyzing lawn → application spraying → customer note left at door → driving to next stop. '1 min / 1000 sq ft' performance badge. Professional lawn care technician imagery."
  },
  {
    slideNumber: 14,
    title: "Your Partner: Customer Service & Administration",
    content: [
      "• Customer support and follow-up",
      "• Scheduling of services",
      "• Accounts receivable",
      "• Supports production and sales operations",
      "• HR support"
    ],
    visualDescription: "Hub-and-spoke diagram with Customer Service center in middle, connected outward to icons: phone (support), calendar (scheduling), invoice (billing), headset (call center), HR badge. Professional office environment imagery."
  },
  {
    slideNumber: 15,
    title: "PTO Policy (BambooHR)",
    content: [
      "• All time-off requests must be submitted via BambooHR",
      "• You must also call/text your manager after submitting",
      "• Requests not in BambooHR will not be considered",
      "• PTO accrues starting day 90: 1.54 hours/week (10 days/year)",
      "• PTO can be used after 90 days"
    ],
    visualDescription: "Simple 3-step process flow: BambooHR app icon → Notify Manager (phone icon) → Approved (green checkmark). Calendar graphic highlighting 'Day 90' as important milestone. Clean corporate HR style."
  },
  {
    slideNumber: 16,
    title: "PTO: Sick Time + Vacation Rules",
    content: [
      "Sick time: provide manager minimum 1.5 hours notice to use PTO",
      "Vacation (>1 day off): submit request at least 1 week in advance in BambooHR"
    ],
    visualDescription: "Two side-by-side cards: Sick Day card (blue theme with clock icon + '1.5 hours notice' text), Vacation card (green theme with calendar icon + '1 week advance' text). Clean simple card-based design with clear visual distinction."
  },
  {
    slideNumber: 17,
    title: "Lawn Care 101: Why Lawn Care Matters",
    content: [
      "• Green, thick, beautiful, weed-free landscape",
      "• Pride of ownership",
      "• Protects property investment (landscape value matters)",
      "• Environmental benefits: traps noise/dust, reduces erosion, improves air quality",
      "• Safe play area for children",
      "• Convenience + safety: we do it so customers don't have to"
    ],
    visualDescription: "Dramatic before/after lawn transformation split image: left side weedy neglected lawn, right side lush beautiful green lawn (same house). Icon row: home (property value), leaf (environment), shield (protection), kids playing (safety), wind/air (air quality). 'Value Protection' callout badge."
  },
  {
    slideNumber: 18,
    title: "How GeckoGreen Does It Better",
    content: [
      "• Customized approach",
      "• Licensed and trained specialists",
      "• Best products available",
      "• Friendly, helpful customer service staff"
    ],
    visualDescription: "4-quadrant 'Our Advantage' grid with icon for each point: clipboard (customized), license badge (certified), premium bottle (products), smiling headset (service). Photo of professional technician inspecting lawn with tablet/clipboard. Premium feel with green and gold accents."
  },
  {
    slideNumber: 19,
    title: "How We Deliver Results (Treatment System)",
    content: [
      "A series of properly timed treatments to improve and maintain the lawn",
      "We use seasonal applications of:",
      "• Fertilizers",
      "• Weed controls",
      "• Insect controls",
      "• Disease controls",
      "• Supplemental services"
    ],
    visualDescription: "Circular 'seasonal cycle' diagram with 5 colored segments for each treatment type rotating through the year. 'Timing Matters' clock overlay in center. Beautiful healthy lawn background. Scientific but approachable design."
  },
  {
    slideNumber: 20,
    title: "Fertilizer Basics (What It Does)",
    content: [
      "Fertilizer = food for plants",
      "• Improves health and vigor",
      "• Improves density and color",
      "• Proper type/amount depends on grass type + season",
      "• Timing is critical for visible results"
    ],
    visualDescription: "Macro close-up of healthy vibrant green turf with 'Food for Plants' label. Mini side-by-side comparison below: thin sparse pale grass vs dense lush dark green grass. Scientific but approachable educational design."
  },
  {
    slideNumber: 21,
    title: "N-P-K Explained (Example: 30-2-6)",
    content: [
      "• Nitrogen (N): greening + top growth",
      "• Phosphorus (P): stronger roots",
      "• Potassium (K): stronger roots, water regulation, disease resistance",
      "Example: 30-2-6",
      "We match fertilizer to grass type and season"
    ],
    visualDescription: "Three vertical bars labeled N / P / K with heights 30/2/6 and function callouts for each nutrient. Root system illustration showing healthy deep roots in soil cross-section. Fertilizer bag visual with '30-2-6' label. Educational diagram style."
  },
  {
    slideNumber: 22,
    title: "Fertilizer Types (What Customers Ask)",
    content: [
      "• Organic vs mineral (plants cannot tell the difference)",
      "• Slow release vs fast release",
      "• Liquid vs dry (plants cannot tell the difference)",
      "• Product choice varies by season/weather and lawn needs"
    ],
    visualDescription: "Comparison grid with icons: leaf/mineral (organic vs synthetic), clock/lightning bolt (slow vs fast release), droplet/granules (liquid vs dry). Weather icons: sun/rain indicating seasonal adjustments. Clean comparison chart style."
  },
  {
    slideNumber: 23,
    title: "Grass Types in North Texas",
    content: [
      "• Bermuda",
      "• St. Augustine",
      "• Rye"
    ],
    visualDescription: "REALISTIC BOTANICAL FIELD GUIDE showing THREE large grass identification cards arranged side by side. BERMUDA GRASS: actual close-up photograph showing fine-textured dense blue-green thin wiry blades, aggressive spreading stolons, full sun indicator. ST. AUGUSTINE GRASS: actual photograph showing broad flat coarse-textured blades with distinctive boat-shaped tips, dark green color, thick stolons, shade tolerant indicator. RYE GRASS: actual photograph showing fine soft bright green blades in bunch-type growth pattern, cool-season indicator. Each card has clear label and sun/shade icons. Field identification guide style for sales reps to recognize grass types in customers' lawns."
  },
  {
    slideNumber: 24,
    title: "Weeds: Definition + Categories",
    content: [
      "Weeds = plants growing where they are not wanted",
      "Many weeds grow rapidly and repeatedly",
      "Two major types:",
      "• Grassy weeds",
      "• Broadleaf weeds",
      "Classifications: Seasonal timing matters",
      "• Annual vs perennial",
      "• Controllable vs non-controllable"
    ],
    visualDescription: "REALISTIC BOTANICAL IDENTIFICATION showing split-screen comparison: LEFT side shows ACTUAL grassy weed photo (narrow grass-like blades, crabgrass example spreading in lawn). RIGHT side shows ACTUAL broadleaf weed photo (wide distinctive leaves, dandelion example with jagged leaves). Clear visual distinction between the two weed types. 'Classification chips' at bottom showing labels: Seasonal, Annual, Perennial, Controllable. Educational diagram style for field recognition."
  },
  {
    slideNumber: 25,
    title: "Common Weeds Customers Mention",
    content: [
      "Grassy weeds: Blue Stem, Dallisgrass, Crabgrass",
      "Broadleaf weeds: Black Medic, Clover, Thistle, Dandelion, Oxalis"
    ],
    visualDescription: "REALISTIC WEED IDENTIFICATION GALLERY: 8 labeled photo cards arranged in 2 rows. TOP ROW (Grassy Weeds): (1) BLUE STEM - tall blue-tinged stems, (2) DALLISGRASS - clumpy tall grass with seed heads, (3) CRABGRASS - low spreading finger-like growth pattern. BOTTOM ROW (Broadleaf Weeds): (4) BLACK MEDIC - small yellow flowers with clover-like leaves, (5) CLOVER - three round leaves with white/pink flowers, (6) THISTLE - spiky purple flower with thorny leaves, (7) DANDELION - bright yellow flower with jagged leaves and puffball seed head, (8) OXALIS - heart-shaped leaves with small yellow flowers. Each card shows ACTUAL realistic photograph of the weed with clear name label and 'customer language' callout like 'spreads fast' 'deep roots' 'shows up in spring'. Field identification guide for sales reps."
  },
  {
    slideNumber: 26,
    title: "Weed Control: Pre-Emergent vs Post-Emergent",
    content: [
      "Best weed control is a thick, healthy lawn",
      "• Pre-emergent: applied before weeds emerge; creates a barrier under the soil",
      "• Post-emergent: applied after weeds are visible; selective control",
      "We do not use non-selective products like Round-up"
    ],
    visualDescription: "EDUCATIONAL SOIL CROSS-SECTION DIAGRAM showing underground view with grass roots and soil layers. PRE-EMERGENT section: orange/yellow protective barrier line visible below soil surface blocking weed seedlings from sprouting upward (seedlings shown being stopped). POST-EMERGENT section: spray target marker on visible weed above ground being treated with selective herbicide. 'Selective Only' badge with crossed-out Round-up bottle. Clean scientific illustration style showing how both treatments work."
  },
  {
    slideNumber: 27,
    title: "Setting Expectations: Timelines, Diseases, Insects",
    content: [
      "Post-Emergent Timeline:",
      "• Acts like growth stimulant → weed dies from accelerated growth",
      "• Typical timeline: ~2 weeks",
      "• Multiple applications may be needed",
      "Lawn Diseases:",
      "• Driven by environmental stress + cultural practices",
      "Turf Insects:",
      "• Can feed on foliage or roots",
      "• Recovery depends on early detection"
    ],
    visualDescription: "LEFT: Clean 14-day timeline strip (Day 0 application → Day 7 weed curling/yellowing → Day 14 weed dead) with 'what customer sees' notes at each stage. TOP-RIGHT: Fast vs Slow weed response cards (Dandelion=fast with speed icon, Thistle=slow with turtle icon). BOTTOM-RIGHT: Two icon panels - Disease (warning triangle with spotted leaf icon) and Insects (bug icon with root damage). Lawn texture background with thin divider lines for premium structure."
  },
  {
    slideNumber: 28,
    title: "Add-Ons + Homeowner Partnership",
    content: [
      "Supplemental Services:",
      "• Aeration: removes soil plugs; improves air/water/nutrient movement",
      "• Grub treatment: preventative control",
      "• Fire ant control: prevent or treat infestations",
      "Homeowner Responsibilities:",
      "• Watering: ~1\"/week depending on rainfall",
      "• Mowing at proper height",
      "• Manage heavy traffic & dog damage",
      "• Reduce shade (tree trimming)"
    ],
    visualDescription: "LEFT: Three large service cards with visuals - AERATION (soil cross-section with cylindrical plugs removed, 'sponge' metaphor graphic), GRUBS (root zone diagram with white grub illustration, preventative shield badge), FIRE ANTS (red ant mound icon with prevention/treatment toggle). RIGHT: 'Partnership Checklist' with icons: water droplet (watering), lawn mower (mowing height), paw print/foot (traffic management), tree with scissors (shade reduction). Bottom: 'GeckoGreen + Homeowner = Results' two-way handshake graphic."
  },
  {
    slideNumber: 29,
    title: "The Program: Complete Overview",
    content: [
      "Seasonal Focus: Winter (prevention) → Spring (growth) → Summer (health) → Fall (prevention)",
      "10 applications/year: 9 lawn + 1 spring aeration",
      "Payment Options:",
      "• EasyPay: first app 50% off, card charged after service",
      "• Prepay: up to 10% discount",
      "What to Expect:",
      "• Easy weeds: 10-14 days | Difficult weeds: 3-4 treatments",
      "• End of Year 1: better color, fewer weeds, thicker turf",
      "Why GeckoGreen: Licensed specialists, free service calls, local, customized"
    ],
    visualDescription: "Comprehensive premium program overview slide. TOP: 4-season circular diagram wheel (Winter blue → Spring light green → Summer vibrant green → Fall golden) with treatment icons. MIDDLE-LEFT: Payment option cards (EasyPay with 50% OFF badge and credit card, Prepay with 10% SAVINGS badge). MIDDLE-RIGHT: Customer expectations timeline showing lawn improvement over Year 1 from weedy to beautiful. BOTTOM: 'Why GeckoGreen' benefits strip with icons: license badge (specialists), phone (free calls), map pin (local), wrench (customized). Professional executive summary design."
  }
];

async function generateSlideImage(slide: SlideConfig): Promise<string | null> {
  const filename = `chapter0-slide-${slide.slideNumber}.png`;
  console.log(`Generating slide ${slide.slideNumber}: ${slide.title}...`);

  const bulletText = slide.content.map(line => line.startsWith('•') ? line : `• ${line}`).join('\n');
  
  const prompt = `Create a professional mobile training slide image in PORTRAIT orientation (9:16 aspect ratio) for GeckoGreen lawn care sales training app.

SLIDE ${slide.slideNumber}: "${slide.title}"

=== TEXT CONTENT TO DISPLAY (must be clearly readable) ===
TITLE: ${slide.title}

CONTENT:
${bulletText}

=== VISUAL ELEMENTS TO INCLUDE ===
${slide.visualDescription}

=== DESIGN REQUIREMENTS ===
1. PORTRAIT 9:16 aspect ratio optimized for mobile phones
2. GeckoGreen brand colors: primary emerald green (#22c55e), dark green (#166534), white text on green
3. Title at top in large bold white text on green header bar
4. Content area below with readable bullet points (good font size for mobile)
5. Supporting visuals integrated naturally - they should ENHANCE understanding, not overwhelm text
6. Clean modern professional corporate training design
7. High contrast for excellent readability
8. FOOTER: "GeckoGreen" text centered at bottom of slide in green

STYLE: Professional premium sales training material. Clean infographic style with engaging visuals. The slide should look like it belongs in a top-tier corporate training app. Text must be sharp and readable.`;

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
  console.log("Generating Chapter 0 slides (29 slides, no quizzes)...\n");
  
  const startSlide = parseInt(process.argv[2]) || 1;
  const endSlide = parseInt(process.argv[3]) || 29;
  
  console.log(`Generating slides ${startSlide} to ${endSlide}\n`);

  for (const slide of SLIDES) {
    if (slide.slideNumber >= startSlide && slide.slideNumber <= endSlide) {
      await generateSlideImage(slide);
      // Small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  console.log("\n✓ Done - all slides generated!");
}

main().catch(console.error);
