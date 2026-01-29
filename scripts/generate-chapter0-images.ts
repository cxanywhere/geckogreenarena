import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface SlideImageConfig {
  slideNumber: number;
  title: string;
  prompt: string;
}

async function generateSlideImage(prompt: string, filename: string): Promise<string | null> {
  console.log(`Generating image: ${filename}...`);
  
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
          
          console.log(`✓ Generated: ${filepath}`);
          return `/uploads/chapter0-slides/${filename}`;
        }
      }
    }

    console.error("No image data in response");
    return null;
  } catch (error: any) {
    console.error(`Failed to generate image: ${error.message}`);
    return null;
  }
}

const SLIDE_IMAGE_CONFIGS: SlideImageConfig[] = [
  {
    slideNumber: 1,
    title: "Welcome to GeckoGreen",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration for a lawn care sales training slide.

SCENE:
- A pristine, perfectly manicured suburban lawn in North Texas
- A friendly, professional sales representative in a clean polo shirt greeting a homeowner at their front door
- Warm golden afternoon sunlight
- GeckoGreen branding colors: bright green (#22C55E) accents throughout
- DFW suburban neighborhood visible in background

STYLE:
- Modern, clean, professional corporate training aesthetic
- Portrait orientation optimized for mobile viewing
- Bright, welcoming, aspirational mood
- High quality illustration, not photorealistic
- NO text, NO words, NO logos, NO watermarks

MOOD: Welcoming, professional, the beginning of a great opportunity.`
  },
  {
    slideNumber: 2,
    title: "Who We Are",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration for a lawn care company overview slide.

SCENE:
- A stylized map silhouette of the Dallas/Fort Worth metroplex with a glowing service area
- 4 iconic tiles/badges representing: Local ownership, 20+ years experience, Service excellence, Team growth
- Professional team of lawn care specialists in the foreground
- Green and gold color accents

STYLE:
- Modern infographic/corporate style
- Portrait orientation for mobile
- Clean, professional, trustworthy aesthetic
- NO text, NO words, NO logos, NO watermarks

MOOD: Established, trustworthy, local expertise.`
  },
  {
    slideNumber: 3,
    title: "Mission & Culture",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration for a company culture slide.

SCENE:
- An energetic team huddle of diverse sales representatives
- High-fiving, motivational pose in an outdoor setting
- Three badge icons floating: Confidence star, Consistency checkmark, Income dollar sign
- Bright green uniforms/polo shirts
- Morning sunshine, positive energy

STYLE:
- Uplifting, motivational corporate training style
- Portrait orientation for mobile
- Vibrant green (#22C55E) and gold color palette
- NO text, NO words, NO logos, NO watermarks

MOOD: Inspiring, rewarding, team-oriented success.`
  },
  {
    slideNumber: 4,
    title: "What We Do (Services)",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing lawn care services.

SCENE:
- An 8-panel grid layout showing lawn care services:
  - Lawn fertilization (green grass with nutrients)
  - Weed control (before/after)
  - Aeration (soil with plugs)
  - Grub control (underground pest treatment)
  - Fire ant control (ant mound treatment)
  - Tree and shrub care (healthy plants)
  - Pest control (home protection)
  - Mosquito control (yard treatment)
- Each panel has an icon representation
- Green and professional color scheme

STYLE:
- Clean service menu/grid layout
- Portrait orientation for mobile
- Icons and illustrations, not photos
- NO text, NO words, NO labels, NO watermarks

MOOD: Comprehensive, professional, full-service provider.`
  },
  {
    slideNumber: 5,
    title: "Your Certification Path",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing a gamified training path.

SCENE:
- A vertical progress bar/path from 0% to 100% Certified
- Checkpoints along the path: Intro, Chapter 1, Chapter 2, Quiz, Roleplays
- A gold certification badge at the top showing "Certified NMR"
- Arena/gladiator themed elements (subtle colosseum in background)
- Achievement stars and progress markers

STYLE:
- Gamified, app-like achievement system design
- Portrait orientation for mobile
- Green (#22C55E) and gold color palette
- NO text, NO words, NO labels, NO watermarks

MOOD: Achievable, motivating, clear path to success.`
  },
  {
    slideNumber: 6,
    title: "Kickoff: Introductions",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration for a team introduction activity.

SCENE:
- A wall of colorful sticky notes or goal cards
- Silhouettes of team members raising hands to introduce themselves
- Name tags and goal-setting imagery
- Training room or outdoor team meeting setting
- Bright, collaborative atmosphere

STYLE:
- Friendly, workshop-style aesthetic
- Portrait orientation for mobile
- Warm, inviting colors with green accents
- NO text, NO words, NO names, NO watermarks

MOOD: Collaborative, personal, goal-oriented beginning.`
  },
  {
    slideNumber: 7,
    title: "How You Win",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing training success ladder.

SCENE:
- A 6-step ascending ladder or staircase infographic:
  - Step 1: Taking notes (notebook)
  - Step 2: Studying (books)
  - Step 3: Memorizing (brain icon)
  - Step 4: Practicing (target)
  - Step 5: Roleplay (conversation bubbles)
  - Step 6: Results (trophy)
- "Repetition = Mastery" theme (visual stamp or badge)
- Climbing figure progressing upward

STYLE:
- Motivational infographic style
- Portrait orientation for mobile
- Green and gold progression colors
- NO text, NO words, NO labels, NO watermarks

MOOD: Step-by-step success, dedication pays off.`
  },
  {
    slideNumber: 8,
    title: "Your Role: NMR",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing the NMR role.

SCENE:
- Split panel illustration:
  - Top panel: Sales rep making great first impression at doorstep, confident handshake
  - Bottom panel: Rep explaining a simple plan to homeowner, clear communication
- Professional appearance, clean uniform
- Suburban home setting
- Green brand colors throughout

STYLE:
- Two-panel comic/storyboard style
- Portrait orientation for mobile
- Professional training illustration
- NO text, NO words, NO speech bubbles, NO watermarks

MOOD: Professional, brand representative, first impression matters.`
  },
  {
    slideNumber: 9,
    title: "Work Hours & Field Reality",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing seasonal work hours.

SCENE:
- A timeline bar showing sun position from afternoon to evening
- A sales rep walking confidently through a neighborhood
- Weather elements: sun, clouds, showing adaptability
- Clock imagery showing different work hours
- "Consistency beats motivation" visual theme

STYLE:
- Timeline/schedule infographic style
- Portrait orientation for mobile
- Warm afternoon/evening lighting
- NO text, NO words, NO times, NO watermarks

MOOD: Adaptable, consistent, prepared for any conditions.`
  },
  {
    slideNumber: 10,
    title: "Professional Standards",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing professional gear checklist.

SCENE:
- A "flat-lay" style arrangement of professional gear:
  - Clean polo shirt with badge
  - ID badge and permit
  - Fully charged smartphone
  - Notebook/tablet
  - Clean shoes
- "Always Be Training" badge/patch graphic
- Organized, professional presentation

STYLE:
- Flat-lay product photography style illustration
- Portrait orientation for mobile
- Clean, organized, professional
- NO text, NO words, NO labels, NO watermarks

MOOD: Prepared, professional, ready to represent the brand.`
  },
  {
    slideNumber: 11,
    title: "Daily Performance Goals",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing daily KPI dashboard.

SCENE:
- A 6-tile KPI dashboard layout:
  - Knocks meter
  - Contacts counter
  - Presentations gauge
  - Sales target
  - Callbacks tracker
  - Follow-ups indicator
- A sales funnel visualization: Knocks → Contacts → Presentations → Sales
- Speedometer/gauge showing "daily pace"
- Green progress indicators

STYLE:
- Dashboard/metrics UI style
- Portrait orientation for mobile
- Clean data visualization
- NO text, NO numbers, NO labels, NO watermarks

MOOD: Measurable, trackable, goal-driven performance.`
  },
  {
    slideNumber: 12,
    title: "Team Culture - TEAM",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing team unity.

SCENE:
- A team huddle photo-style illustration
- Interlocking puzzle pieces or linked chain visual
- Diverse group of sales reps standing together
- Arms around shoulders, supportive poses
- Green uniforms/branding

STYLE:
- Team sports/unity aesthetic
- Portrait orientation for mobile
- Warm, collaborative feeling
- NO text, NO words, NO acronyms, NO watermarks

MOOD: Together, supportive, achieving more as a unit.`
  },
  {
    slideNumber: 13,
    title: "Your Partner: Production Team",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing the production team's day.

SCENE:
- A day-in-the-life strip showing:
  - Service truck arriving at dawn
  - Technician analyzing lawn condition
  - Application being made with professional equipment
  - Leaving customer note
  - Moving to next stop
- "1 min / 1000 sq ft" performance badge style
- Early morning golden light

STYLE:
- Sequential timeline/strip layout
- Portrait orientation for mobile
- Professional service aesthetic
- NO text, NO words, NO labels, NO watermarks

MOOD: Efficient, professional, supporting sales success.`
  },
  {
    slideNumber: 14,
    title: "Customer Service & Admin",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing customer service hub.

SCENE:
- A hub-and-spoke diagram with customer service at center
- Connected icons radiating outward:
  - Phone/headset (support)
  - Calendar (scheduling)
  - Invoice/payment (accounts)
  - Clipboard (operations)
  - Person (HR)
- Modern office setting in background
- Green brand colors

STYLE:
- Hub diagram/infographic style
- Portrait orientation for mobile
- Clean, organized, connected
- NO text, NO words, NO labels, NO watermarks

MOOD: Connected, supportive, organized operations center.`
  },
  {
    slideNumber: 15,
    title: "PTO Policy",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing PTO process.

SCENE:
- A simple process flow with 3 connected steps:
  - Computer/app submission
  - Phone notification to manager
  - Checkmark approval
- A calendar graphic highlighting "Day 90"
- Time accrual visualization

STYLE:
- Process flow diagram style
- Portrait orientation for mobile
- Clean HR/policy aesthetic
- NO text, NO words, NO dates, NO watermarks

MOOD: Clear process, organized, professional HR policy.`
  },
  {
    slideNumber: 16,
    title: "Sick Time + Vacation Rules",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing time-off types.

SCENE:
- Two side-by-side cards:
  - Left card: Clock icon for sick day (quick notice)
  - Right card: Calendar icon for vacation (advance planning)
- Visual comparison of different notice requirements
- Clean, organized policy visualization

STYLE:
- Comparison card layout
- Portrait orientation for mobile
- Professional HR policy aesthetic
- NO text, NO words, NO times, NO watermarks

MOOD: Clear distinction, easy to understand policies.`
  },
  {
    slideNumber: 17,
    title: "Why Lawn Care Matters",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing lawn care value.

SCENE:
- Dramatic before/after lawn transformation image
- Top: neglected, weedy lawn
- Bottom: lush, green, beautiful lawn
- Icon row showing benefits:
  - Home value
  - Environmental benefits
  - Family safety
  - Pride of ownership
- Suburban home backdrop

STYLE:
- Before/after comparison layout
- Portrait orientation for mobile
- Dramatic transformation effect
- NO text, NO words, NO labels, NO watermarks

MOOD: Transformative, valuable, pride-inspiring.`
  },
  {
    slideNumber: 18,
    title: "How GeckoGreen Does It Better",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing competitive advantages.

SCENE:
- A 4-quadrant "Our Advantage" grid:
  - Customized approach (personalized)
  - Licensed specialists (certification badge)
  - Best products (premium quality)
  - Great service (happy customer)
- A technician with tablet/clipboard inspecting lawn
- Professional, premium feel

STYLE:
- Quadrant grid layout
- Portrait orientation for mobile
- Premium service aesthetic
- NO text, NO words, NO labels, NO watermarks

MOOD: Superior, professional, differentiated from competition.`
  },
  {
    slideNumber: 19,
    title: "Treatment System",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing seasonal treatment cycle.

SCENE:
- A circular seasonal cycle diagram with 4-5 segments:
  - Winter (dormant preparation)
  - Spring (growth/color)
  - Summer (health/color)
  - Fall (preparation)
- Clock overlay showing "Timing Matters"
- Treatment application imagery
- Lawn transitioning through seasons

STYLE:
- Circular cycle/wheel diagram
- Portrait orientation for mobile
- Seasonal color transitions
- NO text, NO words, NO labels, NO watermarks

MOOD: Systematic, year-round care, timing is everything.`
  },
  {
    slideNumber: 20,
    title: "Fertilizer Basics",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing fertilizer concept.

SCENE:
- Macro close-up of healthy, dense grass blades
- "Food for plants" concept - nutrients flowing into roots
- Side-by-side comparison:
  - Thin, pale grass (unfertilized)
  - Thick, vibrant green grass (fertilized)
- Soil cross-section showing root health

STYLE:
- Educational diagram style
- Portrait orientation for mobile
- Rich green color emphasis
- NO text, NO words, NO labels, NO watermarks

MOOD: Scientific, educational, visible improvement.`
  },
  {
    slideNumber: 21,
    title: "N-P-K Explained",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing NPK nutrients.

SCENE:
- Three vertical bars labeled with visual icons:
  - N: Leaf/green growth (top growth)
  - P: Root system (stronger roots)
  - K: Shield/water droplet (disease resistance)
- Underground root illustration showing healthy development
- Soil layers visible
- Green, earthy color palette

STYLE:
- Nutrient chart/diagram style
- Portrait orientation for mobile
- Educational scientific aesthetic
- NO text, NO letters, NO numbers, NO watermarks

MOOD: Educational, scientific foundation, understanding the basics.`
  },
  {
    slideNumber: 22,
    title: "Fertilizer Types",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing fertilizer options.

SCENE:
- Comparison grid showing fertilizer types:
  - Organic vs Mineral (leaf vs crystal icons)
  - Slow release vs Fast release (clock vs lightning)
  - Liquid vs Dry (droplet vs granules)
- Weather icons: sun and rain for seasonal adjustments
- Product bags/containers stylized

STYLE:
- Comparison chart layout
- Portrait orientation for mobile
- Clean product differentiation
- NO text, NO words, NO labels, NO watermarks

MOOD: Informative, options available, customer education ready.`
  },
  {
    slideNumber: 23,
    title: "Grass Types in North Texas",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing grass identification.

SCENE:
- 3 "grass ID cards" arranged vertically:
  - Bermuda grass close-up (thin blades, full sun)
  - St. Augustine close-up (wide blades, shade tolerant)
  - Rye grass close-up (fine, cool season)
- Sun/shade icons indicating conditions
- Close-up blade detail for each type

STYLE:
- Identification card layout
- Portrait orientation for mobile
- Botanical illustration style
- NO text, NO words, NO labels, NO watermarks

MOOD: Educational, identification guide, local expertise.`
  },
  {
    slideNumber: 24,
    title: "Weeds: Definition + Categories",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing weed types.

SCENE:
- Split-screen comparison:
  - Left: Grassy weed example (crabgrass-like)
  - Right: Broadleaf weed example (dandelion-like)
- Classification chips/badges showing categories:
  - Seasonal timing
  - Annual vs Perennial
  - Controllable vs Non-controllable
- Unwanted plants in lawn context

STYLE:
- Comparison/classification layout
- Portrait orientation for mobile
- Clear visual distinction between types
- NO text, NO words, NO labels, NO watermarks

MOOD: Educational, identification skills, know your enemy.`
  },
  {
    slideNumber: 25,
    title: "Common Weeds",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing common weed gallery.

SCENE:
- Weed gallery grid with 8 visual cards:
  - Grassy: Blue Stem, Dallisgrass, Crabgrass
  - Broadleaf: Black Medic, Clover, Thistle, Dandelion, Oxalis
- Each weed illustrated clearly
- Visual cues for identification

STYLE:
- Gallery grid layout
- Portrait orientation for mobile
- Botanical illustration style
- NO text, NO words, NO names, NO watermarks

MOOD: Reference guide, identification ready, customer conversation prep.`
  },
  {
    slideNumber: 26,
    title: "Pre vs Post Emergent",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing weed control methods.

SCENE:
- Soil cross-section diagram:
  - Pre-emergent: barrier line below surface blocking seedlings from emerging
  - Post-emergent: target marker on visible weed being treated
- Thick healthy lawn as the first line of defense
- "Selective only" badge with crossed-out non-selective spray
- Underground and above-ground view

STYLE:
- Cross-section diagram style
- Portrait orientation for mobile
- Educational scientific aesthetic
- NO text, NO words, NO labels, NO watermarks

MOOD: Educational, treatment understanding, why we do what we do.`
  },
  {
    slideNumber: 27,
    title: "Post-Emergent Timeline",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing weed treatment timeline.

SCENE:
- Timeline showing weed treatment progression:
  - Day 1: Application
  - Week 1: Accelerated growth (weed getting bigger)
  - Week 2: Weed dying/yellowing
  - Result: Clean lawn
- Clock/calendar visual elements
- Multiple treatment cycle concept

STYLE:
- Timeline/progression diagram
- Portrait orientation for mobile
- Process visualization
- NO text, NO words, NO dates, NO watermarks

MOOD: Patient, process-oriented, setting expectations.`
  },
  {
    slideNumber: 28,
    title: "Diseases & Insects",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing lawn health issues.

SCENE:
- Two sections:
  - Top: Disease indicators (brown patches, fungus, stressed grass)
  - Bottom: Insect damage (grubs underground, surface feeding insects)
- Environmental factors: moisture, heat, dull mower blade icons
- Before/after treatment concept

STYLE:
- Problem identification layout
- Portrait orientation for mobile
- Diagnostic/educational style
- NO text, NO words, NO labels, NO watermarks

MOOD: Diagnostic, problem-solving, treatable conditions.`
  },
  {
    slideNumber: 29,
    title: "Add-On Services",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing supplemental services.

SCENE:
- Three service highlight cards:
  - Aeration: Soil plugs, better root growth, "giant sponge" concept
  - Grub Treatment: Underground prevention
  - Fire Ant Control: Mound treatment
- Premium add-on badge styling
- Enhanced lawn results imagery

STYLE:
- Service cards/feature highlights
- Portrait orientation for mobile
- Premium upsell aesthetic
- NO text, NO words, NO labels, NO watermarks

MOOD: Value-add, premium options, comprehensive care.`
  },
  {
    slideNumber: 30,
    title: "Homeowner Partnership",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing homeowner responsibilities.

SCENE:
- Partnership handshake between lawn pro and homeowner
- Checklist of homeowner duties visualized:
  - Sprinkler/watering (1" per week)
  - Mower at proper height
  - Dog/traffic management
  - Tree trimming for sunlight
  - Bare spot repair
- Two-way collaboration concept

STYLE:
- Partnership/collaboration layout
- Portrait orientation for mobile
- Cooperative, shared responsibility
- NO text, NO words, NO labels, NO watermarks

MOOD: Partnership, shared success, realistic expectations.`
  },
  {
    slideNumber: 31,
    title: "Seasonal Program Overview",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing year-round program.

SCENE:
- Four seasonal quadrants:
  - Winter: Dormant lawn, preparation (blue/gray)
  - Spring: Growing, greening, weed control (bright green)
  - Summer: Peak color, health maintenance (vibrant green)
  - Fall: Preparation, health focus (golden green)
- Circular seasonal flow
- Year-round care concept

STYLE:
- Seasonal wheel/cycle diagram
- Portrait orientation for mobile
- Color progression through seasons
- NO text, NO words, NO labels, NO watermarks

MOOD: Year-round commitment, seasonal expertise, complete care.`
  },
  {
    slideNumber: 32,
    title: "Program Details - 10 Applications",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing application schedule.

SCENE:
- Calendar/timeline showing 10 applications:
  - First 2: Close together (3-4 weeks) for boost
  - Remaining 8: Regular intervals (4-5 weeks)
  - 1 aeration treatment highlighted
- Service truck making visits
- Service call availability concept

STYLE:
- Schedule/calendar visualization
- Portrait orientation for mobile
- Treatment frequency chart
- NO text, NO words, NO numbers, NO watermarks

MOOD: Comprehensive, organized, complete annual program.`
  },
  {
    slideNumber: 33,
    title: "Payment Options",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing payment choices.

SCENE:
- Two payment option cards:
  - EasyPay: Credit card with discount badge, automatic payment
  - Prepay: Dollar signs, upfront payment, savings badge
- Email notification icon (pre-service reminder)
- Modern payment interface styling

STYLE:
- Payment option cards layout
- Portrait orientation for mobile
- Modern fintech/checkout aesthetic
- NO text, NO words, NO prices, NO watermarks

MOOD: Flexible, convenient, savings opportunity.`
  },
  {
    slideNumber: 34,
    title: "Customer Expectations Timeline",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing improvement timeline.

SCENE:
- Progression timeline:
  - 10-14 days: Easy weeds gone
  - 14 days: Color improvement visible
  - 3-4 treatments: Difficult weeds controlled
  - 3-4 treatments: Thickness improved
  - End of year 1: Full transformation
- Lawn improving over time visualization

STYLE:
- Progress timeline/journey map
- Portrait orientation for mobile
- Improvement progression visual
- NO text, NO words, NO dates, NO watermarks

MOOD: Patient progress, realistic expectations, visible results over time.`
  },
  {
    slideNumber: 35,
    title: "Common Challenges",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing lawn challenges.

SCENE:
- Problem areas visualization:
  - Bare/thin spots
  - Heavy traffic wear patterns
  - Shade areas under trees
  - Weed-filled sections
  - Poor mowing lines
- Challenge icons in a grid
- "Solvable with patience" concept

STYLE:
- Problem identification grid
- Portrait orientation for mobile
- Diagnostic/troubleshooting aesthetic
- NO text, NO words, NO labels, NO watermarks

MOOD: Honest about challenges, solutions available, patience required.`
  },
  {
    slideNumber: 36,
    title: "How to Sell It",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing sales technique.

SCENE:
- Feature → Benefit connection visualization:
  - Product feature on left
  - Arrow connecting to customer benefit on right
- Sales rep in conversation with homeowner
- Listening/asking questions pose
- Objection handling reserve concept

STYLE:
- Sales methodology diagram
- Portrait orientation for mobile
- Training/coaching aesthetic
- NO text, NO words, NO labels, NO watermarks

MOOD: Strategic, customer-focused, benefit-driven selling.`
  },
  {
    slideNumber: 37,
    title: "Why GeckoGreen Wins",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) illustration showing competitive advantages.

SCENE:
- Trophy/winner's podium concept
- Competitive advantage badges radiating:
  - Licensed specialists
  - Customer service commitment
  - Free service calls
  - Professional lawn analysis
  - North Texas experience
  - Locally owned
  - Customized applications
  - Strong reviews/reputation
- Premium quality feel

STYLE:
- Winner/advantages showcase
- Portrait orientation for mobile
- Premium, championship aesthetic
- NO text, NO words, NO labels, NO watermarks

MOOD: Winning, differentiated, the best choice.`
  },
  {
    slideNumber: 38,
    title: "Chapter 0 Cover",
    prompt: `Create a mobile-optimized portrait (9:16 aspect ratio) cover image for "Intro to GeckoGreen" training chapter.

SCENE:
- A new sales representative entering the GeckoGreen headquarters for the first day
- Clean, modern office with green branding
- Welcome atmosphere, orientation day
- DFW skyline visible through windows
- Green gecko mascot element subtly incorporated
- Training materials and welcome kit visible

STYLE:
- Welcoming, professional corporate style
- Portrait orientation for mobile
- Green (#22C55E) and white/gold color palette
- High quality, inspirational
- NO text, NO words, NO logos, NO watermarks

MOOD: New beginning, opportunity, welcome to the team.`
  }
];

async function main() {
  console.log("Generating Chapter 0 slide images with Gemini...\n");
  console.log(`Total slides to generate: ${SLIDE_IMAGE_CONFIGS.length}\n`);

  const results: { slide: number; title: string; path: string | null }[] = [];
  
  for (const config of SLIDE_IMAGE_CONFIGS) {
    console.log(`\n--- Slide ${config.slideNumber}: ${config.title} ---`);
    
    const filename = `chapter0-slide-${config.slideNumber.toString().padStart(2, '0')}.png`;
    const imagePath = await generateSlideImage(config.prompt, filename);
    
    results.push({
      slide: config.slideNumber,
      title: config.title,
      path: imagePath
    });
    
    // Small delay between API calls to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log("\n\n=== GENERATION COMPLETE ===\n");
  
  const successful = results.filter(r => r.path !== null);
  const failed = results.filter(r => r.path === null);
  
  console.log(`✓ Successfully generated: ${successful.length} images`);
  console.log(`✗ Failed: ${failed.length} images`);
  
  if (successful.length > 0) {
    console.log("\nGenerated images:");
    successful.forEach(r => console.log(`  Slide ${r.slide}: ${r.path}`));
  }
  
  if (failed.length > 0) {
    console.log("\nFailed slides:");
    failed.forEach(r => console.log(`  Slide ${r.slide}: ${r.title}`));
  }
}

main().catch(console.error);
