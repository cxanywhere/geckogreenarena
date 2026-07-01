import { db } from "./db";
import { eq } from "drizzle-orm";
import { campaignBriefs, type InsertCampaignBrief } from "@shared/schema";

// 6 campaign briefs spanning varied objectives, industries, and difficulty.
// Each carries rich reference context the AI grader uses to judge coherence
// between objective ↔ targeting ↔ format ↔ messaging ↔ budget ↔ KPI.
export const CAMPAIGN_BRIEF_SEED: InsertCampaignBrief[] = [
  {
    slug: "northwind-saas-leadgen",
    title: "Fill the Pipeline for a Workflow SaaS",
    company: "Northwind Systems",
    industry: "Software / SaaS",
    difficulty: "Easy",
    objective: "Lead Generation",
    budgetRange: "$25,000 over 90 days ($275/day)",
    targetPersona:
      "Demand Generation Directors and VPs of Marketing at mid-market B2B SaaS companies (200-2,000 employees) in North America.",
    businessGoal:
      "Generate 300 marketing-qualified leads for a new workflow-automation product in one quarter, with a cost per lead under $85.",
    brief:
      "Northwind Systems just launched a workflow-automation platform for operations teams. Their SDR team needs a steady flow of qualified demo requests, but Google Ads is expensive for their non-search-intent category and their forms convert poorly. They want to test LinkedIn to reach in-market B2B buyers and capture leads with minimal friction. The CMO wants clear attribution from ad to lead so she can defend the spend.",
    constraints: [
      "Cost per lead must stay under $85",
      "Landing pages convert poorly, so on-platform capture is preferred",
      "Must reach senior demand-gen and marketing decision-makers, not junior staff",
      "90-day pilot with clear lead attribution",
    ],
    referenceContext: {
      objective:
        "Lead Generation is the correct objective — the goal is qualified leads/demo requests, not awareness or traffic.",
      targeting:
        "Target Marketing job function; Director/VP/CXO seniority; Software/SaaS industry; 201-5,000 company sizes; skills like Demand Generation, Marketing Strategy; North America. Avoid Entry/Manager-only seniority or overly broad global targeting that would balloon CPL.",
      format:
        "Lead Gen Forms are ideal because landing pages convert poorly and on-platform capture reduces friction. Sponsored Content pairs well to drive the form. Message Ads can supplement. Brand-only formats like broad Video for awareness would waste the lead budget.",
      messaging:
        "Speak to demand-gen pain (pipeline pressure, poor form conversion), lead with a concrete offer (demo, ROI calculator, gated benchmark report), and a clear lead-capture CTA like 'Request Demo' or 'Get the Report'. Avoid vague brand slogans.",
      budget:
        "$275/day daily budget is reasonable. Cost Cap or Maximum Delivery bidding suits lead gen with a CPL target. Concentrate budget on the best-performing audience rather than spreading thin.",
      measurement:
        "Primary KPI must be Leads / Cost Per Lead (CPL) to match the goal and the <$85 constraint. Supporting metrics: CTR, conversion rate, and Pipeline Influenced. Brand Lift or Reach as a primary KPI would be a mismatch.",
    },
    orderIndex: 0,
  },
  {
    slug: "vertex-fintech-awareness",
    title: "Launch Awareness for a Fintech Platform",
    company: "Vertex Capital Cloud",
    industry: "Financial Services",
    difficulty: "Medium",
    objective: "Brand Awareness",
    budgetRange: "$60,000 over 8 weeks ($1,070/day)",
    targetPersona:
      "CFOs, VPs of Finance, and Controllers at enterprise financial-services and fintech firms (1,000+ employees) in North America and the UK.",
    businessGoal:
      "Establish category awareness for a new treasury-management platform ahead of a major industry conference, reaching 70% of the target account list at least 3 times.",
    brief:
      "Vertex Capital Cloud is entering a crowded treasury-management market. Before their sales team starts outbound, marketing wants finance leaders at target enterprises to recognize the brand so cold outreach lands warmer. There is no lead target yet — this is a top-of-funnel awareness push timed to a flagship fintech conference in eight weeks. Success is measured by reach and frequency against a defined set of enterprise accounts.",
    constraints: [
      "This is top-of-funnel — no lead or conversion target for this phase",
      "Must reach senior finance decision-makers at large enterprises",
      "Campaign must ramp before the conference in 8 weeks",
      "Brand must appear premium and credible to a risk-averse finance audience",
    ],
    referenceContext: {
      objective:
        "Brand Awareness is correct — the goal is recognition and reach ahead of outbound, not leads or conversions this phase.",
      targeting:
        "Target Finance job function; Director/VP/CXO seniority; Financial Services industry; 1,001+ company sizes; skills like Financial Analysis; United States + United Kingdom. Junior seniority or SMB company sizes would miss the enterprise finance buyer.",
      format:
        "Sponsored Content (single image / thought-leadership) and Video Ads are ideal for awareness and reach. Document Ads can build credibility with finance audiences. Lead Gen Forms would be a mismatch since there is no lead goal this phase.",
      messaging:
        "Lead with credibility and category POV (security, control, trusted treasury management), premium and reassuring tone for risk-averse finance buyers, soft CTA like 'Learn More'. Avoid hard 'Request Demo' lead-capture CTAs.",
      budget:
        "High daily budget supports reach and frequency. Maximum Delivery bidding maximizes impressions/reach. Allocate to sustain frequency (~3x) across the account list before the conference.",
      measurement:
        "Primary KPI should be Reach (or Brand Lift / Impressions) to match the awareness + frequency goal. Supporting: frequency, video view rate, engagement. CPL or Conversions as primary KPI would be a mismatch for this phase.",
    },
    orderIndex: 1,
  },
  {
    slug: "helix-healthcare-conversions",
    title: "Drive Trial Sign-ups for a Healthcare Platform",
    company: "Helix Health Cloud",
    industry: "Healthcare",
    difficulty: "Hard",
    objective: "Website Conversions",
    budgetRange: "$45,000 over 6 weeks ($1,070/day)",
    targetPersona:
      "Directors of Clinical Operations, VPs of IT, and Chief Medical Information Officers at hospital systems and large healthcare providers (500+ employees) in the United States.",
    businessGoal:
      "Drive 150 free-trial activations of a clinical-workflow product from qualified healthcare decision-makers at a target cost per conversion under $300, tracked via website conversion pixel.",
    brief:
      "Helix Health Cloud has a strong free-trial funnel on their website but low awareness among the right clinical and IT leaders. They already have retargeting running and a clean conversion pixel. They want LinkedIn to send high-intent healthcare decision-makers to the trial page and optimize toward actual trial activations, not just clicks. The buying committee is complex, and compliance means messaging must be precise and credible.",
    constraints: [
      "Optimize toward on-site trial activations (conversion pixel is live)",
      "Cost per conversion must stay under $300",
      "Audience must be clinical/IT leaders at provider organizations, not vendors or SMB clinics",
      "Messaging must be compliant, precise, and credible for healthcare buyers",
    ],
    referenceContext: {
      objective:
        "Website Conversions is correct — the goal is on-site trial activations tracked by pixel, deeper in the funnel than traffic or leads.",
      targeting:
        "Target IT and Healthcare Services / Operations functions; Director/VP/CXO seniority; Healthcare industry; 501-10,000+ company sizes; skills like Healthcare Management; United States. Avoid broad global or SMB targeting and non-decision-maker seniority.",
      format:
        "Sponsored Content driving to the trial page, plus Conversation/Message Ads for high-intent nudges, work well with a conversion pixel. Video can warm the audience. Lead Gen Forms would capture leads but NOT optimize toward on-site activations, so it partly conflicts with the conversion goal.",
      messaging:
        "Precise, compliant, credibility-first copy addressing clinical workflow pain and outcomes, with a conversion CTA like 'Start Free Trial'. Avoid vague or non-compliant claims.",
      budget:
        "Concentrated budget with Cost Cap or Target Cost bidding to protect the <$300 CPA. Layer retargeting. Avoid spreading budget thinly across unrelated audiences.",
      measurement:
        "Primary KPI must be Conversions / Cost Per Conversion to match the goal and the <$300 constraint. Supporting: conversion rate, CTR, Pipeline Influenced. Reach or Impressions as primary KPI would be a mismatch.",
    },
    orderIndex: 2,
  },
  {
    slug: "forge-manufacturing-video",
    title: "Educate a Manufacturing Market with Video",
    company: "Forge Industrial IoT",
    industry: "Manufacturing",
    difficulty: "Medium",
    objective: "Video Views",
    budgetRange: "$35,000 over 6 weeks ($830/day)",
    targetPersona:
      "Plant Managers, VPs of Operations, and Directors of Engineering at industrial manufacturing firms (500-5,000 employees) in North America and DACH.",
    businessGoal:
      "Educate the market on a new predictive-maintenance solution by driving 250,000 qualified video views and a view rate above 25%, building a retargeting pool for a later conversion push.",
    brief:
      "Forge Industrial IoT built a predictive-maintenance product, but the concept is new to most plant leaders. Before asking for a demo, marketing wants to teach the market with a compelling 60-second explainer video and build a warm audience of engaged viewers to retarget later. This phase is about educating and earning attention, then measuring who watched enough to be worth retargeting.",
    constraints: [
      "This phase is education, not lead capture",
      "Must build a retargeting pool of engaged viewers for a later push",
      "Audience is operations/engineering leaders at industrial manufacturers",
      "Concept is unfamiliar, so the video must teach, not hard-sell",
    ],
    referenceContext: {
      objective:
        "Video Views is correct — the goal is qualified views and a view-rate threshold to build a retargeting pool, not leads or conversions yet.",
      targeting:
        "Target Operations and Engineering functions; Manager/Director/VP seniority; Manufacturing industry; 501-5,000 company sizes; North America + DACH. Avoid marketing-only functions or SMB sizes that miss the plant/ops buyer.",
      format:
        "Video Ads are the required primary format for a Video Views objective. Sponsored Content can amplify. Lead Gen Forms or Document Ads would not serve the video-education goal well.",
      messaging:
        "Educational, problem-framing copy that sets up the explainer (cost of unplanned downtime, what predictive maintenance is), soft CTA like 'Watch Now' / 'Learn More'. Avoid premature 'Request Demo' hard-sell.",
      budget:
        "Maximum Delivery bidding optimizes for cheap qualified views. $830/day sustains reach over 6 weeks. Allocate to the audiences most likely to watch through.",
      measurement:
        "Primary KPI must be Video Views / View Rate to match the goal and the 25% view-rate threshold. Supporting: completion rate, engagement, retargeting-pool size. CPL or Conversions as primary KPI would be a mismatch this phase.",
    },
    orderIndex: 3,
  },
  {
    slug: "atlas-proservices-engagement",
    title: "Grow Thought-Leadership Engagement",
    company: "Atlas Advisory Group",
    industry: "Professional Services",
    difficulty: "Easy",
    objective: "Engagement",
    budgetRange: "$18,000 over 8 weeks ($320/day)",
    targetPersona:
      "Partners, Directors, and VPs at management-consulting and professional-services firms (200-2,000 employees) across North America and the UK.",
    businessGoal:
      "Grow engagement on a new thought-leadership series to build follower base and social proof, targeting a 5%+ engagement rate and 4,000 new company-page followers.",
    brief:
      "Atlas Advisory Group is publishing a thought-leadership series to position its partners as category experts. Marketing wants senior professional-services leaders to react, comment, and follow the company page, building social proof that warms future business-development conversations. There's no lead goal — the win is genuine engagement and follower growth among the right senior audience.",
    constraints: [
      "Goal is engagement and follower growth, not leads",
      "Audience must be senior professional-services leaders (Partner/Director/VP)",
      "Engagement rate target is 5%+",
      "Content is thought-leadership, so messaging should invite conversation",
    ],
    referenceContext: {
      objective:
        "Engagement is correct — the goal is reactions, comments, and follows, not leads or conversions.",
      targeting:
        "Target Consulting / Business Development / Marketing functions; Director/VP/Owner-Partner seniority; Professional Services industry; 201-2,000 company sizes; United States + United Kingdom. Avoid junior seniority or unrelated industries.",
      format:
        "Sponsored Content (single image / document / thought-leadership posts) drives engagement well; Document Ads suit consulting insights. Lead Gen Forms or heavy conversion formats would be a mismatch for an engagement goal.",
      messaging:
        "Provocative, insight-led copy that invites reactions and comments, conversational tone, soft CTA like 'Follow for more' / 'Share your view'. Avoid hard-sell lead-capture language.",
      budget:
        "Modest $320/day with Maximum Delivery bidding optimizing for cheap engagements. Allocate to the highest-engaging content and audiences.",
      measurement:
        "Primary KPI should be Engagement Rate to match the goal, with follower growth and reach as supporting metrics. CPL or Conversions as primary KPI would be a mismatch.",
    },
    orderIndex: 4,
  },
  {
    slug: "beacon-cybersecurity-website-visits",
    title: "Drive Traffic to a Security Benchmark Report",
    company: "Beacon Security",
    industry: "Software / SaaS",
    difficulty: "Medium",
    objective: "Website Visits",
    budgetRange: "$30,000 over 6 weeks ($710/day)",
    targetPersona:
      "CISOs, VPs of IT Security, and Directors of Information Security at enterprises (1,000+ employees) in North America and EMEA.",
    businessGoal:
      "Drive 40,000 qualified visits to an interactive security-benchmark report at a cost per click under $9, seeding a high-intent audience for later conversion campaigns.",
    brief:
      "Beacon Security produced an interactive benchmark report that lives on their website (not gated). They want to drive qualified security leaders to explore it, both to demonstrate expertise and to build a warm on-site audience they can retarget with a conversion offer later. The report itself is the hook; the immediate win is qualified traffic at an efficient cost per click.",
    constraints: [
      "The report is ungated — the win is on-site visits, not form fills",
      "Cost per click must stay under $9",
      "Audience must be senior security leaders at large enterprises",
      "Traffic should be qualified enough to retarget for conversions later",
    ],
    referenceContext: {
      objective:
        "Website Visits is correct — the report is ungated so the goal is qualified clicks/traffic, not on-platform leads or conversions.",
      targeting:
        "Target IT / Information Technology function; Director/VP/CXO seniority; Software/SaaS + broader enterprise industries; 1,001+ company sizes; skills like Cybersecurity; North America + EMEA. Avoid SMB sizes or junior seniority.",
      format:
        "Sponsored Content driving clicks to the report is ideal; Document Ads or Carousel can tease the content. Lead Gen Forms would be a mismatch because the report is ungated and the goal is on-site visits.",
      messaging:
        "Curiosity-driven copy highlighting a benchmark insight ('See how your security posture compares'), credible security tone, click CTA like 'Read the Report' / 'View Benchmarks'. Avoid 'Request Demo' this phase.",
      budget:
        "Cost Cap or Maximum Delivery bidding to protect the <$9 CPC. $710/day sustains volume over 6 weeks. Allocate to audiences with the best CTR.",
      measurement:
        "Primary KPI should be Clicks / CTR (or Cost Per Click) to match the traffic goal and the <$9 CPC constraint. Supporting: landing-page visits, engagement, retargeting-pool size. Conversions or Reach as primary KPI would be a partial mismatch.",
    },
    orderIndex: 5,
  },
];

export async function seedCampaignBuilderData(): Promise<void> {
  const existing = await db.select().from(campaignBriefs);
  const existingSlugs = new Set(existing.map((b) => b.slug));

  let inserted = 0;
  let updated = 0;
  for (const brief of CAMPAIGN_BRIEF_SEED) {
    if (existingSlugs.has(brief.slug)) {
      // Keep briefs in sync without clobbering rep attempts (attempts key off briefId, unchanged).
      await db
        .update(campaignBriefs)
        .set({
          title: brief.title,
          company: brief.company,
          industry: brief.industry,
          difficulty: brief.difficulty,
          objective: brief.objective,
          budgetRange: brief.budgetRange,
          targetPersona: brief.targetPersona,
          businessGoal: brief.businessGoal,
          brief: brief.brief,
          constraints: brief.constraints,
          referenceContext: brief.referenceContext,
          orderIndex: brief.orderIndex,
        })
        .where(eq(campaignBriefs.slug, brief.slug));
      updated++;
    } else {
      await db.insert(campaignBriefs).values(brief);
      inserted++;
    }
  }
  console.log(`  Campaign Builder seeded: ${inserted} new, ${updated} updated briefs`);
}
