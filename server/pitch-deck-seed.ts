export const HUBSPOT_DECK_ID = "pd-hubspot-linkedin-pilot";

export const hubspotDeck = {
  id: HUBSPOT_DECK_ID,
  slug: "hubspot-linkedin-pilot",
  clientName: "HubSpot",
  clientLogo: "",
  industry: "B2B SaaS / Marketing & Sales Technology",
  buyerName: "Kipp Bodnar",
  buyerRole: "CMO at HubSpot",
  buyerAvatar: "",
  buyerContext: `Kipp Bodnar is the CMO of HubSpot, a $2B+ revenue marketing and sales platform serving 200,000+ customers globally. HubSpot has historically relied on organic/inbound marketing as its core growth engine, with strong SEO, content marketing, and community. However, growth targets from the board are pushing the team to explore paid channels more aggressively, especially for enterprise upmarket motion. Kipp is analytical, metrics-driven, and skeptical of paid channels that can't prove pipeline contribution. He's open to LinkedIn but needs to see a clear case for why it complements HubSpot's inbound-first philosophy. Key concerns: brand safety, audience quality vs. cost, attribution to pipeline, and whether LinkedIn can reach the enterprise ICPs that organic can't.`,
  description: "Pitch a LinkedIn Ads pilot program to HubSpot's CMO. Make the case for why LinkedIn complements HubSpot's inbound-first strategy and can accelerate their enterprise upmarket motion.",
  difficulty: "Advanced",
  slideCount: 25,
  estimatedMinutes: 20,
  coverImage: "",
  orderIndex: 0,
};

export const hubspotSlides = [
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 0,
    title: "LinkedIn Marketing Solutions × HubSpot",
    subtitle: "Enterprise Growth Pilot Proposal",
    content: "Title slide introducing the partnership opportunity between LinkedIn Marketing Solutions and HubSpot. Set the tone: this is a strategic conversation about accelerating HubSpot's enterprise growth, not just another ad platform pitch.",
    talkingPoints: [
      "Thank you for your time, Kipp — I know how valuable it is",
      "Today's conversation is about how LinkedIn can complement HubSpot's inbound-first strategy",
      "We'll focus specifically on your enterprise upmarket motion",
      "This is a strategic partnership discussion, not a media buy pitch"
    ],
    evaluationCriteria: [
      "Sets professional, strategic tone",
      "Acknowledges HubSpot's inbound-first identity",
      "Frames conversation around their goals, not LinkedIn's products"
    ],
    imagePrompt: "Professional presentation title slide. LinkedIn Blue (#0A66C2) gradient background. Large white text: 'LinkedIn × HubSpot'. Subtitle: 'Enterprise Growth Pilot Proposal'. Both company logos represented abstractly. Clean, executive-level design. No real logos.",
    slideType: "title",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 1,
    title: "Agenda",
    subtitle: "What We'll Cover Today",
    content: "Set expectations for the meeting. Cover: 1) HubSpot's growth landscape, 2) The enterprise challenge, 3) Why LinkedIn fits, 4) Pilot proposal, 5) Success metrics, 6) Next steps.",
    talkingPoints: [
      "I've structured this around what I understand matters most to your team",
      "We'll start with your landscape, not ours — I want to make sure I have the picture right",
      "Then I'll share where I think LinkedIn can add value specifically",
      "We'll end with a concrete pilot plan and how we'd measure success"
    ],
    evaluationCriteria: [
      "Clear agenda that shows preparation",
      "Buyer-centric framing (their goals first)",
      "Mentions measurement/success criteria early"
    ],
    imagePrompt: "Clean agenda slide with LinkedIn Blue (#0A66C2) accents. Six numbered items in a vertical flow. Modern corporate presentation style. White background with blue section headers.",
    slideType: "agenda",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 2,
    title: "HubSpot at a Glance",
    subtitle: "What We Understand About Your Business",
    content: "Demonstrate deep understanding of HubSpot: $2.17B ARR, 200K+ customers, 7M+ monthly blog visitors, dominant in SMB/mid-market, now pushing enterprise with Operations Hub and Commerce Hub. Show you've done your homework.",
    talkingPoints: [
      "$2.17B ARR growing 20%+ YoY — impressive growth that the board wants to accelerate",
      "200,000+ customers across 120 countries — massive global footprint",
      "Dominant in SMB and mid-market segments with inbound methodology",
      "Recent push into enterprise with Operations Hub, Commerce Hub, and the Clearbit acquisition",
      "Question: Is this picture accurate? What would you add or correct?"
    ],
    evaluationCriteria: [
      "Shows genuine research about HubSpot's business",
      "Asks a discovery question to validate understanding",
      "Mentions specific products/acquisitions showing depth"
    ],
    imagePrompt: "Corporate overview slide showing key business metrics. Large numbers: $2.17B, 200K+, 120 countries. LinkedIn Blue accents. Clean data visualization with icons for revenue, customers, global presence.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 3,
    title: "The Inbound Machine",
    subtitle: "Why HubSpot's Organic Engine Is Legendary",
    content: "Acknowledge HubSpot's incredible inbound marketing success: 7M+ monthly blog visitors, HubSpot Academy with millions of certifications, massive social following, and thought leadership. This isn't about replacing inbound — it's about amplifying it.",
    talkingPoints: [
      "HubSpot literally wrote the book on inbound marketing — I'm not here to challenge that",
      "7M+ monthly blog visitors, Academy certifications, massive organic reach",
      "Your content engine is one of the strongest in B2B tech",
      "The question isn't whether inbound works — it's whether inbound alone can reach the enterprise buyers you're targeting next"
    ],
    evaluationCriteria: [
      "Genuinely respects HubSpot's inbound success (not performative)",
      "Pivots naturally from 'inbound works' to 'but enterprise is different'",
      "Doesn't trash-talk organic/inbound channels"
    ],
    imagePrompt: "Slide showing powerful content marketing metrics. Blog icon with '7M+ visitors', Academy icon with 'Millions of certs', social icons with follower counts. Green/growth arrows. Clean infographic style with LinkedIn Blue highlights.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 4,
    title: "The Enterprise Challenge",
    subtitle: "Where Inbound Alone Falls Short",
    content: "Present the strategic gap: enterprise buyers (VP+, C-suite at 1000+ employee companies) consume content differently. They don't google 'best CRM' — they rely on peer networks, analyst reports, and trusted recommendations. Inbound captures demand that exists; enterprise needs demand creation.",
    talkingPoints: [
      "Enterprise buyers — VPs, C-suite at 1000+ companies — don't typically find solutions through blog posts",
      "They rely on peer networks, analyst reports, board-level recommendations",
      "Inbound captures existing demand brilliantly. But for enterprise, you often need to create demand",
      "Discovery question: How are you currently reaching VP+ decision-makers at enterprise accounts?"
    ],
    evaluationCriteria: [
      "Articulates the enterprise gap without diminishing inbound",
      "Uses specific examples of enterprise buyer behavior",
      "Asks discovery question about their current approach"
    ],
    imagePrompt: "Slide showing two paths: 'SMB/Mid-Market' path (search, blog, self-serve) vs 'Enterprise' path (peer networks, analysts, executive referrals). Gap/bridge visual between them. LinkedIn Blue accents. Professional diagram.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 5,
    title: "The Audience You Need to Reach",
    subtitle: "HubSpot's Enterprise ICP on LinkedIn",
    content: "Show the LinkedIn audience opportunity: 67M+ senior decision-makers on LinkedIn. For HubSpot specifically: ~2.4M VP+ in IT/Marketing/Sales/RevOps at companies with 1000+ employees. These are the exact buyers who drive enterprise deals but rarely respond to inbound content.",
    talkingPoints: [
      "LinkedIn has 67M+ senior-level decision-makers globally",
      "For HubSpot's enterprise ICP specifically: approximately 2.4M VP+ professionals in IT, Marketing, Sales, and RevOps at 1000+ employee companies",
      "These professionals are on LinkedIn daily for business content — they're in a business mindset",
      "This is an audience you can't reach at scale through organic content or Google Ads"
    ],
    evaluationCriteria: [
      "Uses specific, relevant audience numbers",
      "Ties audience to HubSpot's actual ICP",
      "Differentiates LinkedIn's audience quality"
    ],
    imagePrompt: "Audience visualization slide. Large number '2.4M' in the center. Concentric circles showing VP+, IT/Marketing/Sales/RevOps, 1000+ employees. LinkedIn Blue professional silhouettes. Clean data visualization.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 6,
    title: "Professional Identity Targeting",
    subtitle: "Reaching Buyers by Who They Are, Not What They Search",
    content: "Explain LinkedIn's unique targeting advantage: targeting by professional identity (job title, function, seniority, company size, industry) vs. behavioral/intent targeting on other platforms. For enterprise sales, knowing WHO the person is matters more than what they searched.",
    talkingPoints: [
      "LinkedIn targets by professional identity — who someone is, not just what they searched",
      "Job title, function, seniority, company size, industry, skills — all first-party data",
      "For enterprise: you need to reach the CTO, VP of RevOps, or Head of Sales Enablement specifically",
      "Google can tell you someone searched 'CRM software' — LinkedIn can tell you they're the VP of Sales at a 5,000-person company making the decision"
    ],
    evaluationCriteria: [
      "Explains professional identity targeting clearly",
      "Contrasts with other platforms without bashing them",
      "Uses HubSpot-relevant targeting examples"
    ],
    imagePrompt: "Comparison slide: Left side 'Behavioral Targeting' (search queries, cookies, browsing) vs Right side 'Professional Identity' (job title, seniority, company, industry). LinkedIn Blue highlighting the professional identity side. Clean visual contrast.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 7,
    title: "Complementing Inbound, Not Competing",
    subtitle: "LinkedIn + HubSpot's Content Engine",
    content: "Position LinkedIn as an amplifier for HubSpot's existing content, not a replacement. HubSpot creates incredible content (blogs, reports, Academy courses) — LinkedIn can put that content in front of the right enterprise decision-makers who would never find it organically.",
    talkingPoints: [
      "HubSpot already creates world-class content — State of Marketing reports, Academy, blog",
      "The gap isn't content quality — it's distribution to enterprise decision-makers",
      "LinkedIn becomes the distribution channel for content you've already invested in creating",
      "Think of it as 'paid inbound' — using your best content, targeted to the right people"
    ],
    evaluationCriteria: [
      "Frames LinkedIn as complement, not competitor to inbound",
      "References specific HubSpot content assets",
      "Uses 'paid inbound' concept to bridge their philosophy"
    ],
    imagePrompt: "Venn diagram showing 'HubSpot Content Engine' (blog, academy, reports) overlapping with 'LinkedIn Distribution' (targeting, reach, enterprise). The overlap area labeled 'Paid Inbound'. LinkedIn Blue and orange HubSpot color accents.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 8,
    title: "Full-Funnel Advertising",
    subtitle: "Awareness → Consideration → Conversion",
    content: "Show LinkedIn's full-funnel capability: Awareness (Sponsored Content, Video Ads for thought leadership), Consideration (Document Ads, Conversation Ads for engagement), Conversion (Lead Gen Forms, Website Conversions for pipeline). Map each stage to HubSpot's funnel.",
    talkingPoints: [
      "LinkedIn supports the full buyer journey, not just top-of-funnel",
      "Awareness: Video and Sponsored Content to build brand with enterprise audiences",
      "Consideration: Document Ads to share your research reports, Conversation Ads for engagement",
      "Conversion: Lead Gen Forms with pre-filled data reduce friction — typically 2-5x higher conversion than landing pages",
      "This maps directly to HubSpot's own flywheel methodology"
    ],
    evaluationCriteria: [
      "Explains full-funnel clearly with specific ad formats",
      "Connects to HubSpot's flywheel/methodology",
      "Mentions Lead Gen Form conversion advantage"
    ],
    imagePrompt: "Funnel visualization with three stages: Awareness (wide top, video/content icons), Consideration (middle, document/conversation icons), Conversion (narrow bottom, lead form icons). LinkedIn Blue gradient. Clean professional infographic.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 9,
    title: "Case Study: Salesforce",
    subtitle: "Enterprise SaaS Peer Success Story",
    content: "Share a relevant case study: Salesforce used LinkedIn to target enterprise CIOs and VP+ buyers, achieving 40% lower cost-per-qualified-lead vs. other paid channels and 3.2x pipeline contribution. Key: they measured qualified pipeline, not just CPL.",
    talkingPoints: [
      "Salesforce — a company you know well — has been a strategic LinkedIn advertiser",
      "They targeted CIOs and VP+ at enterprise accounts for their platform play",
      "Result: 40% lower cost per qualified lead compared to other paid channels",
      "3.2x pipeline contribution — not just leads, but actual pipeline that converts",
      "The key insight: they measured on pipeline, not just cost per click"
    ],
    evaluationCriteria: [
      "Uses a relevant peer case study",
      "Focuses on qualified outcomes, not vanity metrics",
      "Draws parallels to HubSpot's situation"
    ],
    imagePrompt: "Case study slide with large metrics: '40% Lower CPQL' and '3.2x Pipeline'. Enterprise SaaS context. Before/after comparison visual. LinkedIn Blue accents with green success indicators. Professional results layout.",
    slideType: "case-study",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 10,
    title: "Case Study: Drift (Now Salesloft)",
    subtitle: "B2B SaaS Moving Upmarket",
    content: "Another relevant case: Drift used LinkedIn when moving from SMB to enterprise, using Document Ads + Lead Gen Forms to reach VP Sales and VP Marketing at mid-market and enterprise companies. Result: 65% of LinkedIn-sourced leads accepted by sales (vs. 30% from other channels).",
    talkingPoints: [
      "Drift faced a similar challenge to HubSpot — strong in SMB, needed to move upmarket",
      "They used LinkedIn Document Ads to share their 'Revenue Acceleration' research with enterprise buyers",
      "Lead Gen Forms captured VP Sales and VP Marketing contacts with pre-filled professional data",
      "65% of LinkedIn-sourced leads were sales-accepted vs. 30% from other paid channels",
      "The quality difference made the higher CPL actually more efficient"
    ],
    evaluationCriteria: [
      "Draws direct parallel to HubSpot's upmarket challenge",
      "Uses lead quality metrics, not just volume",
      "Explains why higher CPL can be more efficient"
    ],
    imagePrompt: "Case study results slide. Key metric: '65% Sales Acceptance Rate' vs '30% Other Channels'. B2B SaaS upmarket motion context. Quality vs quantity comparison visual. LinkedIn Blue with comparison bars.",
    slideType: "case-study",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 11,
    title: "Attribution & Measurement",
    subtitle: "Proving Pipeline Contribution",
    content: "Address Kipp's attribution concern head-on. LinkedIn's Conversion API integrates with HubSpot CRM to track the full journey from ad impression to closed-won revenue. Revenue Attribution Reports show which campaigns drove pipeline. CRM integration means HubSpot's own data validates LinkedIn's contribution.",
    talkingPoints: [
      "I know attribution is critical for you — it should be",
      "LinkedIn's Conversion API integrates directly with HubSpot CRM",
      "You can track the full journey: ad impression → lead → MQL → opportunity → closed-won",
      "Revenue Attribution Reports show exactly which campaigns drove pipeline",
      "Best part: the data lives in YOUR HubSpot CRM — you're validating with your own system"
    ],
    evaluationCriteria: [
      "Addresses attribution proactively",
      "Mentions CRM integration with HubSpot specifically",
      "Emphasizes buyer controls the data/validation"
    ],
    imagePrompt: "Attribution flow diagram: Ad Impression → Click → Lead → MQL → Opportunity → Closed Won. Each stage with data icons. HubSpot CRM integration callout. LinkedIn Blue gradient with measurement/analytics motif.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 12,
    title: "The LinkedIn-HubSpot Integration",
    subtitle: "Native CRM Sync",
    content: "Highlight the existing LinkedIn-HubSpot native integration: Lead Gen Form data syncs directly to HubSpot CRM, matched contact records, automatic lead scoring triggers, and bi-directional sync for audiences. HubSpot already built this integration — it's a signal they see LinkedIn's value.",
    talkingPoints: [
      "HubSpot already has a native LinkedIn integration — your engineering team built it",
      "Lead Gen Form submissions sync directly to HubSpot CRM as contacts",
      "Matched contact records, automatic workflow triggers, lead scoring",
      "You can build HubSpot audiences from CRM data for retargeting",
      "The infrastructure is already there — this is about using it strategically"
    ],
    evaluationCriteria: [
      "Mentions the native HubSpot-LinkedIn integration",
      "Shows practical workflow benefits",
      "Uses 'your team built this' to build credibility"
    ],
    imagePrompt: "Integration diagram showing LinkedIn and HubSpot connected. Data flow: leads, contacts, audiences, reporting flowing between platforms. Two-way arrows. LinkedIn Blue and HubSpot orange. Clean tech integration visual.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 13,
    title: "Proposed Pilot Strategy",
    subtitle: "A Focused 90-Day Enterprise Test",
    content: "Present the pilot proposal: 90-day focused test targeting HubSpot's enterprise ICP. Three phases — Phase 1 (Month 1): Awareness + content distribution, Phase 2 (Month 2): Consideration + Lead Gen, Phase 3 (Month 3): Retargeting + conversion. Clear success metrics defined upfront.",
    talkingPoints: [
      "Rather than a broad campaign, I'm proposing a focused 90-day pilot",
      "Three phases that build on each other — just like HubSpot's flywheel",
      "Month 1: Awareness — distribute your best enterprise content to VP+ audiences",
      "Month 2: Lead Gen — capture high-intent leads with Lead Gen Forms",
      "Month 3: Retargeting + conversion — nurture engaged audiences toward demos",
      "We define success metrics before we start, not after"
    ],
    evaluationCriteria: [
      "Presents a structured, phased approach",
      "Keeps the pilot focused and manageable",
      "Mentions defining success metrics upfront"
    ],
    imagePrompt: "90-day pilot timeline with three phases. Phase 1: Awareness (month 1), Phase 2: Lead Gen (month 2), Phase 3: Conversion (month 3). Timeline visual with milestones. LinkedIn Blue gradient. Professional project plan style.",
    slideType: "proposal",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 14,
    title: "Phase 1: Enterprise Awareness",
    subtitle: "Month 1 — Content Distribution to Enterprise ICPs",
    content: "Detail Phase 1: Use Sponsored Content and Video Ads to distribute HubSpot's State of Marketing report, enterprise case studies, and thought leadership to VP+ in Marketing, Sales, and RevOps at 1000+ employee companies. Goal: build awareness and engagement baseline.",
    talkingPoints: [
      "Phase 1 uses content you've already created — no new creative needed initially",
      "State of Marketing report, enterprise case studies, thought leadership videos",
      "Target: VP+ in Marketing, Sales, RevOps at companies with 1000+ employees",
      "Formats: Sponsored Content for reports, Video Ads for thought leadership",
      "KPIs: reach, engagement rate, video completion rate, website visits from enterprise",
      "Budget: approximately $15-20K for month 1"
    ],
    evaluationCriteria: [
      "Uses existing HubSpot content (not asking them to create new assets)",
      "Specific targeting criteria mentioned",
      "Clear KPIs for phase 1"
    ],
    imagePrompt: "Phase 1 detail slide: Content types (report, case study, video) flowing to audience (VP+ enterprise). Format icons: Sponsored Content, Video Ads. KPIs listed. LinkedIn Blue with month 1 timeline highlight.",
    slideType: "proposal",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 15,
    title: "Phase 2: Enterprise Lead Generation",
    subtitle: "Month 2 — Capturing High-Intent Signals",
    content: "Detail Phase 2: Based on Phase 1 engagement data, retarget engaged enterprise buyers with Lead Gen Forms offering exclusive content (enterprise ROI calculator, CRM migration guide, custom demo). Pre-filled forms reduce friction. Goal: qualified lead volume.",
    talkingPoints: [
      "Phase 2 builds on Phase 1 — we retarget people who engaged with your awareness content",
      "Lead Gen Forms with pre-filled professional data — name, title, company already there",
      "Offers: Enterprise ROI Calculator, CRM Migration Guide, Custom Demo Request",
      "These are warm audiences now — they've already engaged with your content",
      "KPIs: cost per lead, lead-to-MQL rate, sales acceptance rate",
      "Budget: approximately $25-30K for month 2"
    ],
    evaluationCriteria: [
      "Connects Phase 2 to Phase 1 data",
      "Explains Lead Gen Form advantage (pre-filled)",
      "Relevant offers for enterprise buyers"
    ],
    imagePrompt: "Phase 2 detail slide: Retargeting flow from Phase 1 engaged audience to Lead Gen Forms. Three offer types shown as cards. Conversion funnel visual. LinkedIn Blue with month 2 timeline highlight.",
    slideType: "proposal",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 16,
    title: "Phase 3: Pipeline Conversion",
    subtitle: "Month 3 — Accelerating to Revenue",
    content: "Detail Phase 3: Focus on converting leads to pipeline. Use Conversation Ads for demo booking, retarget website visitors with social proof content, and use Matched Audiences to target specific enterprise accounts (ABM approach). Goal: pipeline creation and acceleration.",
    talkingPoints: [
      "Phase 3 is about converting the leads and engagement into real pipeline",
      "Conversation Ads for direct demo booking — personalized, conversational format",
      "Retarget website visitors with customer testimonials and case studies",
      "ABM approach: upload your top 500 target enterprise accounts for focused reach",
      "KPIs: cost per opportunity, pipeline value, demo-to-opportunity conversion",
      "Budget: approximately $20-25K for month 3"
    ],
    evaluationCriteria: [
      "Clear conversion-focused strategy",
      "Mentions ABM/account targeting approach",
      "Pipeline metrics, not just lead metrics"
    ],
    imagePrompt: "Phase 3 detail slide: Conversion tactics — Conversation Ads, Retargeting, ABM Account Targeting. Pipeline funnel narrowing to opportunities. LinkedIn Blue with month 3 timeline highlight. Revenue icons.",
    slideType: "proposal",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 17,
    title: "Target Audience Specification",
    subtitle: "Who We'll Reach in This Pilot",
    content: "Detail the specific audience targeting for the pilot: Job titles (VP+, Director, C-suite), Functions (Marketing, Sales, RevOps, IT), Company sizes (1000-10,000 and 10,000+), Industries (Technology, Financial Services, Healthcare, Manufacturing), Geography (North America, UK, DACH).",
    talkingPoints: [
      "Let me show you exactly who we'd target — this should match your enterprise ICP",
      "Seniority: VP, Director, C-suite — the decision-makers and budget holders",
      "Functions: Marketing, Sales, Revenue Operations, IT — the buying committee",
      "Company size: 1,000 to 10,000+ employees — true enterprise",
      "Industries aligned with HubSpot's enterprise sweet spots",
      "Question: Does this match the ICP your enterprise sales team is pursuing?"
    ],
    evaluationCriteria: [
      "Specific, actionable targeting criteria",
      "Asks buyer to validate the ICP",
      "Covers the full buying committee, not just one role"
    ],
    imagePrompt: "Audience specification grid: Seniority (VP+, C-suite), Function (Marketing, Sales, RevOps), Company Size (1K-10K+), Industry (Tech, Finance, Healthcare). Clean table/grid layout. LinkedIn Blue accents.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 18,
    title: "Investment & Budget",
    subtitle: "90-Day Pilot Investment",
    content: "Present the budget: Total 90-day pilot investment of $60-75K across three phases. Break down by phase and compare to typical enterprise customer LTV ($100K+ ACV). Frame as investment vs. cost — one enterprise deal pays for the entire pilot many times over.",
    talkingPoints: [
      "Total 90-day pilot investment: $60-75K across three phases",
      "Phase 1 (Awareness): $15-20K — building the enterprise audience foundation",
      "Phase 2 (Lead Gen): $25-30K — the conversion phase, largest investment",
      "Phase 3 (Conversion): $20-25K — pipeline acceleration",
      "For context: one enterprise deal at HubSpot's ACV likely covers the entire pilot multiple times",
      "We're not asking for a year-long commitment — this is a 90-day test with clear go/no-go criteria"
    ],
    evaluationCriteria: [
      "Clear budget breakdown by phase",
      "Frames cost relative to deal value (ROI context)",
      "Emphasizes limited commitment (90-day test)"
    ],
    imagePrompt: "Budget slide: Three phase investment bars ($15-20K, $25-30K, $20-25K) totaling $60-75K. ROI comparison: pilot cost vs enterprise deal value. Clean financial presentation. LinkedIn Blue bars with dollar amounts.",
    slideType: "proposal",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 19,
    title: "Success Metrics & KPIs",
    subtitle: "How We'll Measure the Pilot",
    content: "Define clear success metrics: Primary — pipeline created from LinkedIn-sourced leads, cost per qualified opportunity, sales acceptance rate. Secondary — reach into target accounts, engagement rate, website visits from enterprise ICP. Go/no-go criteria defined at day 60.",
    talkingPoints: [
      "Let's agree on how we'll measure success before we start — not after",
      "Primary metrics: pipeline created, cost per qualified opportunity, sales acceptance rate",
      "Secondary metrics: enterprise reach, engagement rate, website traffic quality",
      "Day 60 checkpoint: we review Phase 1+2 data and make a go/no-go decision on Phase 3",
      "All data flows through your HubSpot CRM — you own the measurement",
      "Question: Are there other metrics your team would want to track?"
    ],
    evaluationCriteria: [
      "Pipeline-focused primary metrics (not vanity metrics)",
      "Mentions a checkpoint/review point",
      "Asks buyer about additional metrics they care about"
    ],
    imagePrompt: "KPI dashboard mockup: Primary metrics (pipeline, CPQO, sales acceptance) with target ranges. Secondary metrics listed below. Day 60 checkpoint callout. Clean measurement dashboard. LinkedIn Blue with green targets.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 20,
    title: "Brand Safety & Quality",
    subtitle: "Your Brand in a Professional Environment",
    content: "Address brand safety: LinkedIn is a professional environment — no misinformation, hate speech, or controversial content. Ads appear alongside professional content. Brand suitability controls available. HubSpot's brand appears in the context it deserves.",
    talkingPoints: [
      "I know brand safety matters deeply to HubSpot's marketing team",
      "LinkedIn is the only major ad platform where content is exclusively professional",
      "No misinformation, political content, or controversial adjacent placements",
      "Your ads appear alongside industry insights, career content, and business discussions",
      "Brand suitability controls let you choose exactly where your content appears",
      "This is the brand environment HubSpot's reputation deserves"
    ],
    evaluationCriteria: [
      "Addresses brand safety proactively",
      "Differentiates LinkedIn's professional environment",
      "Relevant to HubSpot's brand-conscious culture"
    ],
    imagePrompt: "Brand safety slide: LinkedIn professional environment vs other platforms. Shield icon with checkmarks: professional content, no misinformation, brand controls. Clean comparison. LinkedIn Blue with trust/safety motif.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 21,
    title: "Implementation Timeline",
    subtitle: "Getting Started in 2 Weeks",
    content: "Show the implementation plan: Week 1 — account setup, audience configuration, content selection. Week 2 — creative review, tracking setup, HubSpot CRM integration verification. Week 3 — campaign launch. Emphasize how quickly they can get started.",
    talkingPoints: [
      "We can go from sign-off to live campaigns in about two weeks",
      "Week 1: Account setup, audience configuration, and content selection from your existing library",
      "Week 2: Creative review, conversion tracking setup, and verify the HubSpot CRM integration",
      "Week 3: Campaign launch with Phase 1 awareness content",
      "You'll have a dedicated LinkedIn account team throughout the pilot",
      "No heavy lift from your team — we do the account setup and optimization"
    ],
    evaluationCriteria: [
      "Shows quick time to value",
      "Mentions minimal effort from buyer's team",
      "References dedicated support"
    ],
    imagePrompt: "Implementation timeline: Week 1 (Setup), Week 2 (Configuration), Week 3 (Launch). Gantt-chart style with milestones. Quick-start visual. LinkedIn Blue gradient timeline. Check marks at each milestone.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 22,
    title: "Your LinkedIn Support Team",
    subtitle: "Dedicated Partnership, Not Self-Serve",
    content: "Introduce the support model: dedicated account manager, campaign strategist, creative consultations, quarterly business reviews. This is a strategic partnership, not a self-serve ad account. HubSpot gets white-glove enterprise treatment.",
    talkingPoints: [
      "This pilot comes with full white-glove support — not a self-serve account",
      "Dedicated account manager as your single point of contact",
      "Campaign strategist for targeting and optimization recommendations",
      "Creative consultations to optimize ad formats and messaging",
      "Quarterly business reviews to align on performance and strategy",
      "You'll have direct access to LinkedIn's B2B marketing expertise"
    ],
    evaluationCriteria: [
      "Differentiates from self-serve experience",
      "Lists specific support benefits",
      "Positions as strategic partnership"
    ],
    imagePrompt: "Support team visual: Account Manager, Campaign Strategist, Creative Consultant icons arranged around a central HubSpot partner node. White-glove service motif. LinkedIn Blue with professional team illustration.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 23,
    title: "Why Now?",
    subtitle: "The Strategic Timing for This Pilot",
    content: "Create urgency: HubSpot's enterprise push is accelerating (Clearbit acquisition, Operations Hub), competitors are already using LinkedIn for enterprise reach, Q3/Q4 planning season is ideal for a pilot, and the sooner you start, the sooner you have data for next year's budget planning.",
    talkingPoints: [
      "Three reasons why the timing is right for this pilot",
      "First: HubSpot's enterprise motion is accelerating — Clearbit, Operations Hub, enterprise sales hires",
      "Second: your competitors are already investing in LinkedIn for enterprise reach",
      "Third: starting now gives you 90 days of data before annual budget planning",
      "If the pilot works, you'll have proof to scale. If it doesn't, you've invested a fraction of one enterprise deal to learn that"
    ],
    evaluationCriteria: [
      "Creates urgency without being pushy",
      "References real strategic timing factors",
      "Low-risk framing of the pilot"
    ],
    imagePrompt: "Timing slide with three compelling reasons. Clock/calendar motif. Strategic arrows converging on 'Now'. LinkedIn Blue with urgency indicators. Clean, executive-friendly design.",
    slideType: "content",
  },
  {
    deckId: HUBSPOT_DECK_ID,
    slideOrder: 24,
    title: "Recommended Next Steps",
    subtitle: "Moving Forward Together",
    content: "Close with clear next steps: 1) Align on ICP and success metrics (this week), 2) Account setup and content selection (next week), 3) Campaign launch (week 3), 4) Day 30 check-in, 5) Day 60 go/no-go review. Ask for the commitment.",
    talkingPoints: [
      "Here's what I'd recommend as next steps",
      "This week: align on ICP targeting and success metrics — I'll send a one-page brief",
      "Next week: account setup and select content from your existing library",
      "Week 3: launch Phase 1 awareness campaigns",
      "Day 30: first performance check-in with your team",
      "Day 60: formal go/no-go review before Phase 3",
      "Can we schedule a follow-up this week to finalize the ICP and metrics?"
    ],
    evaluationCriteria: [
      "Clear, actionable next steps",
      "Asks for a specific commitment (follow-up meeting)",
      "Keeps momentum with a timeline"
    ],
    imagePrompt: "Next steps slide: Five numbered action items with timeline. Handshake icon at bottom. Clear call-to-action. LinkedIn Blue with forward-motion arrows. Professional closing slide design.",
    slideType: "closing",
  },
];
