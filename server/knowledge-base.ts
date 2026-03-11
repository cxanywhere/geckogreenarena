export interface KnowledgeEntry {
  id: string;
  type: "slide" | "roleplay" | "script" | "tip";
  category: "product" | "sales_methodology" | "objection_handling" | "pricing" | "competitive" | "customer_success";
  chapter: number;
  slideNumber?: number;
  title: string;
  content: string;
  tags: string[];
  keywords: string[];
  roleplayId?: string;
  phase?: number;
  winningResponse?: string;
  losingResponse?: string;
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [

  // ============ CHAPTER 0: LMS OVERVIEW & PRODUCTS ============

  {
    id: "p_lms_overview",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 1,
    title: "LinkedIn Marketing Solutions Overview",
    content: `LinkedIn Marketing Solutions (LMS) is LinkedIn's B2B advertising and demand generation business. It helps brands reach professional audiences using LinkedIn's first-party professional graph.

For a new rep, the simplest way to describe LMS is:
"LinkedIn helps marketers reach the right professional audience, with the right message, in a trusted business environment, and measure business impact across the funnel."

Why Buyers Use LMS:
• Build awareness with the right professional audience
• Reach specific B2B decision-makers who are hard to find elsewhere
• Generate qualified leads with higher conversion quality
• Influence buying committees across long sales cycles
• Prove marketing impact on pipeline and revenue
• Run integrated ABM and demand generation programs

Core Differentiators:
• Professional identity and declared profile data (not inferred)
• Strong B2B targeting and segmentation by job title, function, seniority, industry, company, skills
• Native environment for thought leadership and business content
• Full-funnel campaign options from awareness to lead generation and conversion
• Better fit for high-consideration B2B motions, enterprise sales, and ABM

How LMS Is Typically Sold:
LMS is sold consultatively rather than as a commodity media buy. A rep's role is to understand the buyer's business and GTM goals, diagnose funnel gaps, recommend the right mix of audiences, objectives, ad formats, and measurement, and tie LinkedIn performance to business outcomes.`,
    tags: ["overview", "lms", "linkedin", "advertising", "b2b", "demand_generation"],
    keywords: ["LinkedIn Marketing Solutions", "LMS", "B2B advertising", "demand generation", "professional audience", "targeting", "lead generation"]
  },

  {
    id: "p_campaign_objectives",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 2,
    title: "Campaign Objectives — Selling from Objective to Format",
    content: `LinkedIn organizes campaigns around common objectives. Reps should learn to sell from objective to format, not format to objective.

Common Campaign Objectives:
• Brand Awareness — maximize reach among target professional audiences
• Website Visits — drive qualified traffic to landing pages or content
• Engagement — increase interactions with content in the LinkedIn feed
• Video Views — build awareness and education through video content
• Lead Generation — capture leads using Lead Gen Forms or website conversions
• Website Conversions — drive specific actions on the advertiser's website
• Job Applicants — talent-focused objective (less relevant for marketing sales)

Beginner coaching point:
When a buyer asks "What should we run?" the rep should first ask "What business outcome matters most over the next quarter?"

Objective-First Selling Framework:
1. Start with the business goal (awareness, pipeline, conversion)
2. Match the objective to the goal
3. Select the right format for the objective
4. Define the audience
5. Choose the offer/CTA
6. Set success metrics aligned to the objective

Never start with "Do you want video ads?" Start with "What outcome matters most?"`,
    tags: ["objectives", "campaign", "awareness", "lead_generation", "conversions", "video_views"],
    keywords: ["campaign objectives", "brand awareness", "website visits", "engagement", "video views", "lead generation", "website conversions", "objective-first"]
  },

  {
    id: "p_sponsored_content",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 3,
    title: "Sponsored Content / Native Ads",
    content: `Sponsored Content ads appear in the LinkedIn feed and are central to most LMS campaigns.

Ad Formats:
• Single Image Ads — simple, effective, versatile
• Video Ads — explain, persuade, build credibility
• Carousel Ads — tell sequential stories, showcase multiple value props
• Document Ads — deliver depth with whitepapers, guides, reports
• Event Ads — promote webinars and events directly in feed
• Thought Leader Ads — amplify executive voices (availability varies by region)

What Sponsored Content is good for:
• Awareness and brand building
• Storytelling and thought leadership
• Education and mid-funnel engagement
• Lead generation when paired with forms or landing pages

Rep language:
"These formats help you show up where professionals are already consuming business content, which makes them especially useful for educating buyers and building familiarity before a sales conversation."

Key point: Sponsored Content is the workhorse of most campaigns. Reps should understand how each format serves different objectives and funnel stages.`,
    tags: ["sponsored_content", "native_ads", "feed_ads", "single_image", "video", "carousel", "document"],
    keywords: ["sponsored content", "native ads", "feed ads", "single image", "video ads", "carousel ads", "document ads", "event ads", "thought leader ads"]
  },

  {
    id: "p_lead_gen_forms",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 4,
    title: "Lead Gen Forms",
    content: `Lead Gen Forms are one of the most important products for new reps to understand. They are pre-filled using LinkedIn member profile data.

Why Lead Gen Forms matter:
• Pre-filled using LinkedIn profile data — reduces friction dramatically
• Members can submit without leaving LinkedIn
• Often used for content downloads, demo requests, webinar sign-ups, contact requests
• Can significantly improve conversion rates compared to sending users to external landing pages
• Data quality is generally high because it comes from the member's LinkedIn profile

When to recommend Lead Gen Forms:
• Buyer's landing page conversion rate is low
• The offer is straightforward (download, register, request)
• Lead quality matters more than volume
• The buyer wants to reduce friction in the conversion path

Rep language:
"If your challenge is that people click but do not convert, Lead Gen Forms can reduce drop-off by making it easier for high-intent users to submit their details without leaving LinkedIn."

Integration: Lead Gen Forms data can be synced to CRM systems and marketing automation platforms for seamless follow-up.`,
    tags: ["lead_gen_forms", "conversion", "leads", "pre_filled", "forms"],
    keywords: ["Lead Gen Forms", "lead generation", "conversion", "pre-filled", "form", "leads", "friction reduction", "CRM integration"]
  },

  {
    id: "p_messaging_ads",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 5,
    title: "Messaging Solutions",
    content: `LinkedIn offers messaging-based ad experiences for direct outreach in-platform.

Common value:
• More direct call-to-action than feed-based placements
• Useful for event promotion, webinar invites, content offers, and targeted engagement
• Best when the audience and offer are tightly aligned
• Feels more personal and action-oriented

When to recommend messaging ads:
• High-value audience segment with a specific, relevant offer
• Event or webinar promotion where a personal invite drives attendance
• Account-based plays where direct engagement with named accounts matters
• When feed ads alone aren't driving enough action

When NOT to recommend messaging ads:
• Broad awareness campaigns (use Sponsored Content instead)
• When the offer isn't specific or relevant enough to warrant a direct message
• When frequency limits would restrict reach too much

Rep language:
"For the right audience and offer, messaging can feel more personal and action-oriented than feed-only placements."`,
    tags: ["messaging", "direct_engagement", "inmail", "conversation_ads"],
    keywords: ["messaging ads", "InMail", "direct engagement", "conversation ads", "messaging solutions", "personal outreach"]
  },

  {
    id: "p_video_ads",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 6,
    title: "Video Ads",
    content: `Video is important for top and mid-funnel education on LinkedIn.

Best for:
• Explaining complex offerings that need more context than a static image
• Brand storytelling and establishing thought leadership
• Customer proof and case studies that build credibility
• Executive thought leadership content

Video performance considerations:
• Keep videos short (15-30 seconds for awareness, 1-2 minutes for education)
• Add captions — most LinkedIn users watch without sound
• Lead with the key message in the first 3-5 seconds
• Use video view objectives for awareness, or lead gen objectives with a CTA

Rep language:
"Video is particularly useful when the offer needs context or credibility, not just a static headline."

Measurement:
• Video completion rates by quartile (25%, 50%, 75%, 100%)
• Engagement rate and click-through rate
• Downstream conversions when paired with retargeting`,
    tags: ["video", "video_ads", "storytelling", "awareness"],
    keywords: ["video ads", "video content", "storytelling", "thought leadership", "brand", "awareness", "video completion"]
  },

  {
    id: "p_carousel_document_ads",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 7,
    title: "Carousel Ads & Document Ads",
    content: `Carousel Ads and Document Ads serve different but complementary roles in LMS campaigns.

Carousel Ads:
• Allow multiple cards within one ad unit
• Good for telling a sequential story, showcasing multiple products or value props
• Useful for explaining steps, frameworks, or processes
• Can highlight persona-specific messages within one creative
• Rep language: "This is useful when you need to educate the buyer in stages or show several solution paths without forcing everything into one creative."

Document Ads:
• Allow users to preview and engage with gated or ungated document-based content
• Good for whitepapers, guides, reports, case studies, research
• Bridge the gap between awareness and lead capture
• Users can preview content before deciding to download — higher intent
• Rep language: "If your audience needs more depth before taking action, this format can bridge the gap between awareness and lead capture."

Format selection guidance:
• Use Carousel when the message has multiple distinct points or options
• Use Document when the content is long-form and authoritative
• Both formats work well in the mid-funnel consideration stage`,
    tags: ["carousel", "document", "formats", "mid_funnel"],
    keywords: ["carousel ads", "document ads", "whitepaper", "guide", "report", "case study", "multi-card", "sequential"]
  },

  {
    id: "p_measurement_attribution",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 8,
    title: "Measurement and Attribution",
    content: `New reps do not need to become measurement experts on day one, but they must understand the buyer's pressure to prove ROI.

Measurement conversations often involve:
• CTR and engagement rates — basic performance indicators
• Lead volume and CPL — cost efficiency metrics
• Lead quality — are the leads the right people?
• Conversion rate — from lead to opportunity to closed deal
• Website actions and conversion tracking — post-click behavior
• Pipeline influence — did LinkedIn-sourced leads contribute to pipeline?
• Revenue attribution — can we connect LinkedIn spend to closed revenue?
• Matched audiences and retargeting — are we re-engaging interested prospects?

Key measurement principle for reps:
"We should define success based on what your business actually cares about — not just cheap clicks, but whether the campaign is producing the right type of buyer engagement and downstream pipeline."

Common measurement mistakes to avoid:
• Over-focusing on vanity metrics (impressions, clicks) without connecting to business outcomes
• Comparing LinkedIn CPL directly to Google/Meta CPL without adjusting for lead quality
• Not setting up conversion tracking before launching campaigns
• Measuring brand awareness campaigns on lead gen metrics (and vice versa)

Beginner guidance: Ask about lead quality, conversion quality, and business outcomes. Tie channel performance to actual sales value.`,
    tags: ["measurement", "attribution", "roi", "metrics", "conversion_tracking"],
    keywords: ["measurement", "attribution", "ROI", "CPL", "CTR", "conversion tracking", "pipeline", "revenue", "lead quality", "metrics"]
  },

  {
    id: "p_campaign_manager",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 9,
    title: "Campaign Manager & Business Manager",
    content: `A new rep should know these platforms and their basic value.

Campaign Manager:
• Where advertisers create, launch, and optimize LinkedIn ad campaigns
• Set objectives, define audiences, choose formats, set budgets and bids
• Monitor performance with real-time reporting and analytics
• Optimize campaigns based on performance data
• Self-service platform that advertisers use directly

Business Manager:
• Helps larger organizations manage ad accounts, pages, partners, and permissions at scale
• Governance layer for companies with multiple regions, brands, agencies, or stakeholders
• Centralized access management and permission controls
• Important for enterprise buyers with complex organizational structures

Rep language:
"If your team has multiple regions, brands, agencies, or stakeholders, LinkedIn has account management infrastructure to help keep governance and execution organized."

Why reps should care:
• Understanding Campaign Manager helps reps speak credibly about campaign setup and optimization
• Understanding Business Manager helps reps sell to enterprise buyers with complex needs
• Buyers will reference these platforms — reps should know what they do even if they don't demo them`,
    tags: ["campaign_manager", "business_manager", "platform", "tools"],
    keywords: ["Campaign Manager", "Business Manager", "platform", "ad accounts", "permissions", "governance", "self-service", "optimization"]
  },

  {
    id: "p_professional_graph",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 10,
    title: "The Professional Graph Advantage",
    content: `LinkedIn's core differentiator is the professional graph — first-party, declared data from 1B+ members. This is one of the most important concepts for new reps.

Targeting dimensions available:
• Job title — reach specific roles (e.g., "VP of Marketing", "Director of IT")
• Function — target by department (Marketing, Engineering, Finance, IT, HR, Operations)
• Seniority — reach decision-makers (C-Suite, VP, Director, Manager, Individual Contributor)
• Industry — target by company industry (Technology, Financial Services, Healthcare, etc.)
• Company — target by specific company names for ABM campaigns
• Company size — reach companies by employee count
• Skills — target based on member-declared skills and expertise
• Groups/interests — reach members engaged in specific professional communities

Why this matters for B2B:
• No other platform has this depth of professional identity data
• Targeting is based on what members declare about themselves, not inferred behavior
• Enables precise B2B audience building that Google and Meta cannot match
• Critical for ABM, where reaching the right person at the right company matters

Rep language:
"LinkedIn is especially useful when the audience definition matters — not just demographics, but job role, seniority, industry, and business relevance."`,
    tags: ["targeting", "professional_graph", "audience", "segmentation", "b2b"],
    keywords: ["professional graph", "targeting", "job title", "seniority", "function", "industry", "company", "skills", "audience", "segmentation"]
  },

  // ============ CHAPTER 1: DISCOVERY & BUYER CONVERSATIONS ============

  {
    id: "sm_discovery_framework",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 1,
    title: "The 7-Part Discovery Framework",
    content: `A beginner-friendly discovery flow that helps reps avoid feature-dumping.

Discovery Sequence:

1. Business Goal
• What are your top marketing or growth priorities this quarter?
• Are you focused more on awareness, lead generation, conversion, or expansion?
• What pressure is the team under right now?

2. Audience
• Who are you trying to reach?
• Which personas or decision-makers matter most?
• Are there named accounts or industries you care about most?

3. Funnel Problem
• Where is the biggest gap today: reach, engagement, conversion, lead quality, or sales follow-up?
• What happens after a lead comes in?

4. Current Motion
• Which channels are you using today?
• What is working well, and where are you disappointed?
• Have you used LinkedIn before? If yes, what did you run?

5. Offer and Content
• What are you asking the audience to do?
• What content or value exchange are you using — demo, webinar, report, consultation, case study?

6. Measurement
• How do you define success?
• Which metrics matter most internally?
• How do sales and marketing evaluate lead quality?

7. Stakeholders and Process
• Who is involved in evaluating a new channel or campaign strategy?
• Is there an agency or internal team who would execute?

Beginner coaching point: A great discovery call is one where the buyer feels understood before the rep recommends a product.`,
    tags: ["discovery", "framework", "questions", "consultative", "methodology"],
    keywords: ["discovery", "framework", "questions", "business goals", "audience", "funnel", "measurement", "stakeholders", "consultative selling"]
  },

  {
    id: "sm_buyer_persona_demand_gen",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 2,
    title: "Buyer Persona: Demand Generation Director",
    content: `The Demand Generation Director is focused on pipeline targets, conversion rates, and lead quality.

Goals:
• Hit MQL and pipeline targets
• Improve conversion rates
• Increase sales acceptance of leads

Pain points:
• Too many low-quality leads from existing channels
• Pressure to prove performance and justify spend
• Fragmented funnel reporting
• Difficulty reaching the right buying committee members

What they care about:
• Lead quality over volume
• Audience targeting precision
• Conversion performance
• Attribution and pipeline impact

What the rep should emphasize:
• Precision targeting by job title, function, seniority
• Lead Gen Forms for higher conversion rates
• Matched audiences and retargeting for full-funnel optimization
• LinkedIn as the channel that delivers leads sales actually wants

Discovery tips for this persona:
• "How does your sales team define a qualified lead today?"
• "What percentage of your MQLs get accepted by sales?"
• "Where are leads dropping out of your funnel?"`,
    tags: ["persona", "demand_gen", "director", "pipeline", "leads"],
    keywords: ["demand generation", "director", "MQL", "pipeline", "conversion", "lead quality", "persona", "buyer"]
  },

  {
    id: "sm_buyer_persona_vp_cmo",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 3,
    title: "Buyer Persona: VP of Marketing / CMO",
    content: `The VP of Marketing / CMO is a strategic leader balancing brand and demand.

Goals:
• Brand growth and strategic market positioning
• Pipeline contribution from marketing
• Executive-level reporting and board accountability

Pain points:
• Budget scrutiny — pressure to do more with less
• Need to align brand building with demand generation
• Board-level accountability for growth metrics
• Difficulty proving long-term brand impact alongside short-term pipeline

What they care about:
• Strategic outcomes, not just tactical metrics
• Audience quality — reaching decision-makers
• Share of voice among professional buyers
• Revenue impact and measurable business outcomes
• Brand credibility with the right audience

What the rep should emphasize:
• LinkedIn as a trusted business environment for brand credibility
• Full-funnel value from awareness through long buying cycle influence
• Executive audience access (C-Suite, VP, Director)
• Measurable business outcomes connected to pipeline and revenue

Discovery tips for this persona:
• "How do you balance brand investment with demand generation?"
• "What does your board care about most when evaluating marketing performance?"
• "How are you reaching senior decision-makers today?"`,
    tags: ["persona", "vp_marketing", "cmo", "brand", "executive"],
    keywords: ["VP marketing", "CMO", "brand", "demand", "executive", "board", "strategic", "persona", "buyer"]
  },

  {
    id: "sm_buyer_persona_abm",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 4,
    title: "Buyer Persona: ABM / Field Marketing Leader",
    content: `The ABM / Field Marketing Leader is account-obsessed and sales-aligned.

Goals:
• Reach specific target accounts
• Engage buying groups with multiple stakeholders
• Improve account penetration
• Coordinate marketing with sales outreach

Pain points:
• Hard to influence multiple stakeholders within target accounts
• Inconsistent engagement from named accounts despite ad spend
• Low personalization at scale — generic messaging doesn't resonate
• Difficulty proving account-level marketing impact

What they care about:
• Account penetration depth
• Stakeholder engagement across the buying committee
• Named-account strategy execution
• Sales and marketing alignment

What the rep should emphasize:
• Matched audiences — target by company, function, seniority, and role simultaneously
• Sequenced messaging across the buying committee
• Content tailored to account stage and persona
• LinkedIn as the only platform where ABM targeting uses real professional identity data

Discovery tips for this persona:
• "How many stakeholders do you typically need to influence in a target account?"
• "What content are you using to engage different roles within accounts?"
• "How do you measure account engagement today?"`,
    tags: ["persona", "abm", "field_marketing", "accounts", "buying_committee"],
    keywords: ["ABM", "account-based marketing", "field marketing", "target accounts", "buying committee", "account penetration", "persona", "buyer"]
  },

  {
    id: "sm_buyer_persona_performance",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 5,
    title: "Buyer Persona: Performance Marketing Manager",
    content: `The Performance Marketing Manager is data-driven and efficiency-focused.

Goals:
• Efficient spend with strong cost metrics
• Better conversion performance across channels
• Scalable testing and iteration

Pain points:
• High CPL concerns on LinkedIn compared to Google or Meta
• Questions about whether LinkedIn can scale efficiently
• Need for better optimization levers and testing capabilities
• Pressure to justify every dollar of ad spend

What they care about:
• Cost efficiency — CPL, CPA, cost per qualified opportunity
• Conversion metrics and platform optimization levers
• Testing and iteration — creative, audiences, offers

What the rep should emphasize:
• Quality versus raw volume — cost per qualified lead, not just CPL
• Objective-to-format alignment for maximum efficiency
• Conversion path optimization with Lead Gen Forms and retargeting
• Audience refinement and A/B testing capabilities
• Testing creative and offers by segment

Discovery tips for this persona:
• "How do you evaluate channel efficiency today — CPL alone or cost per opportunity?"
• "What does your testing framework look like?"
• "What would make you expand budget on a new channel?"

Key coaching point: This persona will challenge you on cost. Always reframe to quality and downstream impact.`,
    tags: ["persona", "performance_marketing", "manager", "efficiency", "testing"],
    keywords: ["performance marketing", "manager", "CPL", "CPA", "efficiency", "testing", "optimization", "persona", "buyer"]
  },

  {
    id: "sm_funnel_positioning",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 6,
    title: "How LMS Fits in a Modern B2B Funnel",
    content: `Reps must understand how LinkedIn fits across the B2B marketing funnel, not just at one stage.

Top Funnel — Awareness & Education:
• Objective: Brand Awareness, Video Views
• Formats: Video Ads, Single Image, Thought Leader Ads
• Goal: Build recognition and educate the market
• Metrics: Reach, impressions, video completion rate, engagement rate

Mid Funnel — Engagement & Consideration:
• Objective: Engagement, Website Visits
• Formats: Carousel Ads, Document Ads, Sponsored Content
• Goal: Deepen interest, build credibility, educate on solutions
• Metrics: Engagement rate, click-through rate, content consumption, time on site

Bottom Funnel — Lead Capture & Conversion:
• Objective: Lead Generation, Website Conversions
• Formats: Lead Gen Forms, Messaging Ads
• Goal: Capture qualified leads, drive demo requests, webinar registrations
• Metrics: CPL, lead quality, conversion rate, sales acceptance rate

Post-Click & Retargeting:
• Use matched audiences to re-engage people who have already interacted
• Build sequential campaigns that move prospects through the funnel
• Retarget website visitors, video viewers, and form openers

Key message: LinkedIn is a full-funnel platform, not just a lead gen channel.`,
    tags: ["funnel", "full_funnel", "awareness", "consideration", "conversion", "retargeting"],
    keywords: ["funnel", "awareness", "consideration", "conversion", "retargeting", "top funnel", "mid funnel", "bottom funnel", "full-funnel"]
  },

  // ============ CHAPTER 2: OBJECTION HANDLING ============

  {
    id: "oh_too_expensive",
    type: "slide",
    category: "objection_handling",
    chapter: 2,
    slideNumber: 1,
    title: "Objection: LinkedIn Is Too Expensive",
    content: `Common objection: "LinkedIn's CPL is always higher than other platforms."

What it usually means:
• They are comparing CPL to lower-cost channels like Google or Meta
• They are not yet valuing lead quality, conversion rates, or buying power
• They may be measuring the wrong metrics for a B2B channel

Good beginner response:
"That is a fair concern. The right comparison usually is not just cost per lead, but cost per qualified lead or cost per opportunity. For many B2B teams, LinkedIn is valuable because it helps them reach the right professional audience, not just the cheapest audience."

The 4-Step Objection Framework applied:
1. Acknowledge: "That's a fair concern — CPL is an important metric."
2. Clarify: "When you say expensive, are you comparing cost per lead or cost per qualified opportunity?"
3. Reframe: "A lower CPL can still be inefficient if the lead quality is poor or sales cannot convert it."
4. Recommend next step: "Let's look at what a pilot focused on qualified outcomes would look like."

Do NOT:
• Argue on CPM/CPC alone
• Get defensive about LinkedIn's pricing
• Promise that CPL will be lower than other channels`,
    tags: ["objection", "expensive", "cpl", "cost", "price"],
    keywords: ["too expensive", "CPL", "cost per lead", "price", "budget", "objection", "expensive"]
  },

  {
    id: "oh_already_use_google_meta",
    type: "slide",
    category: "objection_handling",
    chapter: 2,
    slideNumber: 2,
    title: "Objection: We Already Use Google and Meta",
    content: `Common objection: "Why not just put more budget into Google or Meta?"

What it usually means:
• They see LinkedIn as redundant rather than complementary
• They don't yet understand the role difference between channels
• They may not be reaching the right B2B buyers on their current channels

Good beginner response:
"That makes sense, and in many cases LinkedIn works best alongside those channels. Google is strong for active intent, while LinkedIn is powerful for reaching the right business audience earlier and more precisely, especially when you need to influence specific roles or buying groups."

How to position LMS vs other channels:
• Google: captures active demand (people searching) — LinkedIn creates demand with the right audience
• Meta: broad reach and retargeting — LinkedIn offers precision B2B targeting by job title, function, seniority
• LinkedIn: uniquely positioned for reaching specific professional audiences that other channels can't target precisely

Key reframe:
"Different channels play different roles. LinkedIn often adds value when you need precise professional reach and stronger alignment to B2B buying audiences."

Do NOT:
• Badmouth Google or Meta
• Claim LinkedIn is better at everything
• Ignore that the buyer has success with other channels`,
    tags: ["objection", "google", "meta", "channels", "competition"],
    keywords: ["Google", "Meta", "Facebook", "channels", "competition", "already using", "objection", "complementary"]
  },

  {
    id: "oh_tried_before",
    type: "slide",
    category: "objection_handling",
    chapter: 2,
    slideNumber: 3,
    title: "Objection: We Tried LinkedIn Before and It Didn't Work",
    content: `Common objection: "We tried LinkedIn last year and saw nothing meaningful."

What it usually means:
• There was likely a misalignment in campaign setup, not a channel problem
• Common root causes: wrong audience, weak creative, mismatched objective, poor conversion path, no sales follow-up

Good beginner response:
"I understand. Usually the next step is to unpack what was tested — audience, creative, offer, objective, follow-up process, and success metric. Often the issue is not the channel alone, but how the campaign was structured and measured."

Diagnostic questions to ask:
• "What audience did you target? How specific was the targeting?"
• "What creative and messaging did you use?"
• "What was the offer — content download, demo request, webinar?"
• "What campaign objective did you set?"
• "What was the conversion path — Lead Gen Form or landing page?"
• "How did sales follow up on the leads?"
• "What did you measure success by?"

Key coaching point:
This objection requires non-defensive curiosity. The goal is to understand what went wrong and offer to do a diagnostic review — not to argue that LinkedIn works.

Rep language:
"It would be helpful to understand what was tested before so we can separate channel fit from execution choices."`,
    tags: ["objection", "past_failure", "tried_before", "diagnostic"],
    keywords: ["tried before", "didn't work", "past failure", "LinkedIn before", "objection", "diagnostic"]
  },

  {
    id: "oh_audience_too_niche",
    type: "slide",
    category: "objection_handling",
    chapter: 2,
    slideNumber: 4,
    title: "Objection: Our Audience Is Too Niche",
    content: `Common objection: "Our TAM is tiny. I doubt LinkedIn is worth it."

What it usually means:
• They are used to scale-based channels and worry about reach
• They may not realize that niche audiences are LinkedIn's strength
• They are thinking in impressions, not in precision

Good beginner response:
"That is actually where LinkedIn can be especially useful. Because targeting is based on professional attributes, it can be a strong fit for niche B2B audiences where reaching the right title, function, or seniority matters more than raw scale."

How to reframe:
• Niche = targeting advantage, not limitation
• 500 right people > 50,000 wrong people
• LinkedIn's professional graph enables reaching exactly the roles that matter
• For enterprise and specialized B2B, quality of reach matters more than volume

Examples of niche segments that work well on LinkedIn:
• Cybersecurity leaders at enterprise companies
• VP-level decision-makers in specific industries
• IT buyers at companies of a certain size
• Finance leaders evaluating specific solutions

Key message:
"Quality over scale. LinkedIn can reach the 500 people who actually matter for your business better than any other platform."`,
    tags: ["objection", "niche", "audience", "targeting", "scale"],
    keywords: ["niche", "small audience", "too niche", "TAM", "targeting", "scale", "objection", "quality"]
  },

  {
    id: "oh_only_roi",
    type: "slide",
    category: "objection_handling",
    chapter: 2,
    slideNumber: 5,
    title: "Objection: We Only Care About Direct ROI",
    content: `Common objection: "We only care about results. What should we realistically measure?"

What it usually means:
• They want proof that LinkedIn spend translates to pipeline and revenue
• They may be measuring the wrong things (vanity metrics) and projecting frustration onto the channel
• This is actually a positive signal — they're outcome-focused

Good beginner response:
"Absolutely. Then we should start by defining what ROI means in your world — leads, meetings, qualified pipeline, opportunities, or closed revenue — and build the campaign and measurement approach around that."

How to handle:
1. Define ROI clearly with the buyer's language
2. Match the measurement approach to their funnel and sales motion
3. Connect campaign design to the business outcomes they care about
4. Set up proper conversion tracking and attribution before launching

Measurement alignment:
• If ROI = leads: focus on CPL, lead volume, and Lead Gen Form conversion rates
• If ROI = pipeline: focus on lead-to-opportunity conversion, pipeline influence, sales acceptance
• If ROI = revenue: focus on attributed pipeline and deal velocity from LinkedIn-sourced leads
• If ROI = efficiency: focus on cost per qualified opportunity vs. other channels

Rep language:
"What matters most is that the campaign structure reflects the actual business problem you are trying to solve."`,
    tags: ["objection", "roi", "measurement", "results", "pipeline"],
    keywords: ["ROI", "results", "measurement", "direct ROI", "pipeline", "revenue", "attribution", "objection"]
  },

  {
    id: "oh_objection_framework",
    type: "slide",
    category: "objection_handling",
    chapter: 2,
    slideNumber: 6,
    title: "The 4-Step Objection Framework",
    content: `A simple framework for handling any objection calmly and professionally.

The 4 Steps:

1. ACKNOWLEDGE — validate the concern without agreeing or arguing
• "That's a fair concern."
• "I hear that from a lot of marketing leaders."
• "I understand — that's important to get right."

2. CLARIFY — ask a follow-up question to understand the root cause
• "When you say expensive, are you comparing CPL or cost per opportunity?"
• "What specifically didn't work when you tried LinkedIn before?"
• "How do you define success for a channel like this?"

3. REFRAME — shift the conversation from their concern to a better lens
• "The real question isn't just cost per lead, but cost per qualified outcome."
• "Niche audiences are actually where LinkedIn's targeting is strongest."
• "Let's separate channel fit from execution choices."

4. RECOMMEND NEXT STEP — move forward with a concrete action
• "Let's do a diagnostic review of your previous campaign."
• "I'd suggest we start with a small pilot focused on your highest-priority audience."
• "Let me build a measurement framework that maps to your definition of ROI."

Why objections happen:
• Confusion — they don't understand how LinkedIn fits
• Risk sensitivity — worried about wasting budget
• Budget pressure — need to justify every dollar
• Prior disappointment — tried LinkedIn before with poor results
• Need for proof — want evidence before committing

Key coaching point: Objections are not rejections. They are requests for more information or better framing.`,
    tags: ["objection", "framework", "methodology", "handling"],
    keywords: ["objection framework", "acknowledge", "clarify", "reframe", "recommend", "handling", "methodology"]
  },

  // ============ COMPETITIVE POSITIONING ============

  {
    id: "comp_vs_google",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Positioning: LinkedIn vs Google Ads",
    content: `Understanding how LinkedIn compares to Google Ads helps reps position LMS effectively.

Google Ads strengths:
• Captures active intent — people searching for solutions
• Strong performance marketing engine with sophisticated bidding
• Massive reach across search, display, and YouTube
• Well-established measurement and attribution

Where LinkedIn wins:
• Professional audience targeting by job title, function, seniority, company, industry
• Reaches buyers BEFORE they search — demand creation, not just demand capture
• Better for reaching specific B2B buying committees
• Stronger fit for complex B2B sales cycles and account-based strategies
• Higher lead quality for B2B — leads are validated by professional identity
• Native environment for thought leadership and business content

Positioning framework:
• Google captures demand (people actively searching)
• LinkedIn creates demand (reaching the right people before they search)
• Best practice: use both together — LinkedIn for top/mid funnel targeting, Google for bottom funnel intent capture

Rep language:
"Google is great for capturing active demand. LinkedIn is great for creating demand with the right professional audience before they ever search. Many successful B2B programs use both."

Do NOT position as either/or — position as complementary.`,
    tags: ["competitive", "google", "search", "intent", "positioning"],
    keywords: ["Google", "Google Ads", "search", "intent", "competitive", "comparison", "demand capture", "demand creation"]
  },

  {
    id: "comp_vs_meta",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Positioning: LinkedIn vs Meta (Facebook/Instagram)",
    content: `Understanding how LinkedIn compares to Meta helps reps handle the "we already use Meta" objection.

Meta strengths:
• Massive reach and scale (3B+ users)
• Sophisticated optimization and bidding algorithms
• Strong retargeting capabilities
• Lower CPMs and CPLs for broad audiences
• Effective for B2C and some B2B plays

Where LinkedIn wins:
• Professional identity data — targeting by actual job title, function, seniority (not inferred)
• B2B buying committee reach — can target VP+ at specific companies
• Business context environment — members are in a professional mindset
• Higher lead quality for B2B — leads come with validated professional profiles
• Better fit for enterprise, ABM, and high-consideration B2B offers
• No mixing of personal/social context with professional messaging

Key differentiator:
Meta's targeting is based on inferred behavior and interests. LinkedIn's targeting is based on declared professional identity. For B2B, this difference matters enormously.

Rep language:
"Meta is great for broad reach and scale. LinkedIn is where you go when the audience definition matters — when you need to reach specific job titles, seniority levels, and companies."

Positioning:
• Meta: scale and cost efficiency for broad audiences
• LinkedIn: precision and quality for professional B2B audiences
• Together: Meta for scale awareness, LinkedIn for precision targeting and qualified engagement`,
    tags: ["competitive", "meta", "facebook", "instagram", "b2c"],
    keywords: ["Meta", "Facebook", "Instagram", "competitive", "comparison", "B2C", "scale", "reach", "targeting"]
  },

  {
    id: "comp_vs_other_b2b",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Positioning: LinkedIn vs Other B2B Platforms",
    content: `LinkedIn may compete with other B2B-focused platforms and channels. Here's how to position.

vs. Trade Publications / Industry Media:
• LinkedIn: broader professional reach, better targeting, self-service optimization
• Trade pubs: industry authority, editorial context, niche audience trust
• Position: LinkedIn complements trade media with precision targeting and performance measurement

vs. Programmatic / Display Networks:
• LinkedIn: professional identity targeting, higher quality for B2B
• Programmatic: scale, lower CPMs, broad reach
• Position: LinkedIn for precision B2B, programmatic for scale and retargeting

vs. ABM Platforms (Demandbase, 6sense, Terminus):
• ABM platforms: strong account identification and intent data
• LinkedIn: actual ad delivery to verified professional audiences within target accounts
• Position: LinkedIn is often the best execution layer for ABM strategy — use ABM platforms for account identification, LinkedIn for audience activation

vs. Content Syndication:
• Content syndication: lead volume at scale, often lower CPL
• LinkedIn: better audience quality, professional context, targeting precision
• Position: LinkedIn leads are higher quality and come from a verified professional environment

Key message for all competitive conversations:
"LinkedIn's unique advantage is the professional graph — the ability to reach verified professionals by their actual job title, function, seniority, and company. No other platform has this depth of B2B targeting."`,
    tags: ["competitive", "b2b", "abm_platforms", "programmatic", "content_syndication"],
    keywords: ["competitive", "B2B platforms", "Demandbase", "6sense", "Terminus", "programmatic", "content syndication", "trade media"]
  },

  // ============ BEGINNER TALK TRACKS ============

  {
    id: "tt_what_lms_is",
    type: "tip",
    category: "sales_methodology",
    chapter: 0,
    title: "Beginner Talk Track: What LMS Is",
    content: `"LinkedIn Marketing Solutions helps brands reach professional audiences in a business context, with campaigns designed around goals like awareness, lead generation, and conversion."

When to use: When someone asks "What do you sell?" or "What is LinkedIn Marketing Solutions?"

Key principles:
• Keep it simple and outcome-focused
• Don't list products — describe the value
• Use the buyer's language, not internal jargon

Extended version:
"LinkedIn helps marketers reach the right professional audience, with the right message, in a trusted business environment, and measure business impact across the funnel."`,
    tags: ["talk_track", "beginner", "elevator_pitch", "what_is_lms"],
    keywords: ["what is LMS", "elevator pitch", "talk track", "beginner", "explanation", "LinkedIn Marketing Solutions"]
  },

  {
    id: "tt_why_linkedin",
    type: "tip",
    category: "sales_methodology",
    chapter: 0,
    title: "Beginner Talk Track: Why LinkedIn",
    content: `"LinkedIn is especially useful when the audience definition matters — not just demographics, but job role, seniority, industry, and business relevance."

When to use: When someone asks "Why LinkedIn instead of other channels?"

Supporting points:
• Professional identity-based targeting (declared, not inferred)
• Trusted business environment for thought leadership
• Full-funnel capabilities from awareness to lead generation
• Better fit for high-consideration B2B motions and ABM

Extended version:
"LinkedIn can be especially powerful when you need to reach specific professional audiences and influence business buyers with the right message in a trusted context."`,
    tags: ["talk_track", "beginner", "why_linkedin", "differentiation"],
    keywords: ["why LinkedIn", "differentiation", "talk track", "beginner", "audience", "targeting", "professional"]
  },

  {
    id: "tt_why_lead_gen_forms",
    type: "tip",
    category: "sales_methodology",
    chapter: 0,
    title: "Beginner Talk Track: Why Lead Gen Forms",
    content: `"If your audience is clicking but not converting, reducing friction in the conversion path can make a meaningful difference."

When to use: When discussing conversion challenges or landing page performance

Supporting points:
• Pre-filled with LinkedIn profile data — reduces form abandonment
• Members stay within LinkedIn — no landing page friction
• Higher data quality from verified profiles
• Can improve conversion rates vs. external landing pages

Extended version:
"If your challenge is that people click but do not convert, Lead Gen Forms can reduce drop-off by making it easier for high-intent users to submit their details without leaving LinkedIn."`,
    tags: ["talk_track", "beginner", "lead_gen_forms", "conversion"],
    keywords: ["Lead Gen Forms", "conversion", "talk track", "beginner", "friction", "landing page", "form"]
  },

  {
    id: "tt_quality_matters",
    type: "tip",
    category: "sales_methodology",
    chapter: 0,
    title: "Beginner Talk Track: Why Quality Matters",
    content: `"The real question is not only how many leads came in, but whether they were the right people and whether they moved through the funnel."

When to use: When buyers are focused only on lead volume or CPL

Supporting points:
• Lead quality determines downstream conversion rates
• A lower CPL can still be inefficient if lead quality is poor
• Sales teams care about lead quality, not just volume
• LinkedIn's targeting drives higher-quality leads because it reaches verified professionals

Extended version:
"A lower CPL can still be inefficient if the lead quality is poor or sales cannot convert it. The right comparison is cost per qualified opportunity, not just cost per lead."`,
    tags: ["talk_track", "beginner", "quality", "leads", "cpl"],
    keywords: ["quality", "lead quality", "CPL", "talk track", "beginner", "volume", "qualified", "conversion"]
  },

  {
    id: "tt_start_discovery",
    type: "tip",
    category: "sales_methodology",
    chapter: 1,
    title: "Beginner Talk Track: How to Start Discovery",
    content: `"Before I recommend a campaign path, can I ask a few questions about your goals, audience, and what has or has not worked so far?"

When to use: At the beginning of any sales conversation, before recommending products

Why this works:
• Shows respect for the buyer's context
• Prevents feature-dumping
• Builds trust through genuine curiosity
• Leads to better recommendations

Follow-up questions:
• "What are your top marketing priorities this quarter?"
• "Who are you trying to reach?"
• "Where is the biggest gap in your funnel today?"
• "How do you define success?"

Key principle: Never pitch before you discover. A great rep asks before they tell.`,
    tags: ["talk_track", "beginner", "discovery", "opening"],
    keywords: ["discovery", "opening", "talk track", "beginner", "questions", "goals", "audience", "start"]
  },

  {
    id: "tt_handle_past_failure",
    type: "tip",
    category: "sales_methodology",
    chapter: 2,
    title: "Beginner Talk Track: How to Handle Past Failure",
    content: `"It would be helpful to understand what was tested before so we can separate channel fit from execution choices."

When to use: When the buyer says "We tried LinkedIn before and it didn't work"

Why this works:
• Non-defensive and curious
• Shifts from "LinkedIn doesn't work" to "let's diagnose what happened"
• Positions you as a helpful advisor, not a defensive seller

Follow-up diagnostic questions:
• "What audience did you target?"
• "What was the offer?"
• "How did you measure success?"
• "How did sales follow up on the leads?"
• "What campaign objective did you use?"

Key principle: The goal is to understand and diagnose, not to defend the platform.`,
    tags: ["talk_track", "beginner", "past_failure", "objection"],
    keywords: ["past failure", "tried before", "didn't work", "talk track", "beginner", "diagnostic", "objection"]
  },

  {
    id: "tt_position_vs_channels",
    type: "tip",
    category: "sales_methodology",
    chapter: 1,
    title: "Beginner Talk Track: How to Position Against Other Channels",
    content: `"Different channels play different roles. LinkedIn often adds value when you need precise professional reach and stronger alignment to B2B buying audiences."

When to use: When the buyer asks about LinkedIn vs. Google, Meta, or other channels

Key positioning:
• Google: captures active demand (search intent)
• Meta: broad reach and scale (B2C and some B2B)
• LinkedIn: precision professional targeting and demand creation (B2B)
• Best practice: complementary, not competitive

Extended version:
"Google captures people actively searching. Meta reaches people at scale. LinkedIn reaches verified professionals by their actual job title, seniority, and company — which matters when your buyer is a VP of IT at a Fortune 500, not just anyone interested in technology."

Do NOT:
• Badmouth other channels
• Claim LinkedIn is better at everything
• Ignore the buyer's success with other channels`,
    tags: ["talk_track", "beginner", "positioning", "channels", "competitive"],
    keywords: ["positioning", "channels", "Google", "Meta", "competitive", "talk track", "beginner", "complementary"]
  },

  {
    id: "tt_close_first_call",
    type: "tip",
    category: "sales_methodology",
    chapter: 2,
    title: "Beginner Talk Track: How to Close a First Call",
    content: `"Based on what you shared, I'd suggest we start by focusing on your highest-priority audience and testing a campaign approach aligned to that specific outcome."

When to use: At the end of a first discovery conversation

First call closing framework:
1. Summarize what you heard (goals, audience, challenges)
2. Recommend a clear next step (proposal, pilot plan, technical session)
3. Identify what additional information is needed from both sides
4. Agree on success criteria before moving forward

Example:
"Based on what you've shared — your focus on reaching VP-level IT buyers and improving lead quality — I'd recommend we put together a targeted pilot plan. I'll need your target account list and current lead benchmarks. Can we set up a follow-up next week to review the plan?"

Key principle: Always end with a concrete next step, not a vague "let's stay in touch."`,
    tags: ["talk_track", "beginner", "closing", "first_call", "next_steps"],
    keywords: ["close", "first call", "next steps", "talk track", "beginner", "follow-up", "proposal", "pilot"]
  },

  {
    id: "tt_sound_consultative",
    type: "tip",
    category: "sales_methodology",
    chapter: 2,
    title: "Beginner Talk Track: How to Sound Consultative",
    content: `"What matters most is that the campaign structure reflects the actual business problem you are trying to solve."

When to use: Any time you want to elevate the conversation from product features to business outcomes

What great beginner reps sound like:
• Calm — not rushed or anxious
• Curious — asking genuine questions
• Structured — organized thinking, not rambling
• Honest — admitting when they need to check on something
• Outcome-oriented — focused on business results, not product features
• Not defensive — treating objections as information, not attacks

Common beginner mistakes to avoid:
• Talking too much and not listening
• Pitching too many products at once
• Not asking how success is measured
• Using platform language instead of buyer language
• Treating every objection like a personal rejection

Key coaching principle:
"The best beginner reps do not try to sound advanced. They try to sound clear, thoughtful, and useful."`,
    tags: ["talk_track", "beginner", "consultative", "coaching"],
    keywords: ["consultative", "coaching", "talk track", "beginner", "business outcomes", "structured", "curious", "honest"]
  },

  // ============ PRODUCT POSITIONING FORMULAS ============

  {
    id: "pp_objective_format_mapping",
    type: "slide",
    category: "product",
    chapter: 1,
    title: "Product Positioning: Objective-to-Format Mapping",
    content: `How to recommend the right ad format based on the buyer's business objective.

Awareness goals → Brand Awareness objective:
• Single Image Ads for broad awareness
• Video Ads for storytelling and education
• Thought Leader Ads for executive credibility

Engagement goals → Engagement objective:
• Carousel Ads for multi-point stories
• Document Ads for in-depth education
• Video Ads for compelling narratives

Lead Generation goals → Lead Generation objective:
• Sponsored Content + Lead Gen Forms (primary recommendation)
• Messaging Ads for targeted outreach
• Document Ads with gated content

Website Conversion goals → Website Conversions objective:
• Single Image Ads driving to optimized landing pages
• Video Ads with strong CTAs
• Retargeting matched audiences

ABM goals → Engagement or Lead Gen objective:
• Matched Audiences targeting specific companies
• Carousel or Document Ads with account-relevant content
• Sequenced campaigns across the buying committee

Key principle: Always start with the objective, then select the format. Never lead with "Do you want video ads?"`,
    tags: ["product_positioning", "format_mapping", "objectives", "recommendation"],
    keywords: ["format mapping", "objective", "recommendation", "product positioning", "awareness", "lead gen", "engagement", "ABM"]
  },

  {
    id: "pp_starter_strategies",
    type: "slide",
    category: "product",
    chapter: 2,
    title: "Product Positioning: Starter Campaign Strategies",
    content: `Three beginner-friendly starter strategies reps can recommend.

Play 1: Demand Capture
• Objective: Lead Generation
• Format: Feed ads + Lead Gen Forms
• Offer: Report, demo request, or webinar registration
• Audience: Target by job title, function, and seniority
• Success metric: CPL, lead quality, sales acceptance rate
• Best for: Demand Gen Directors and Performance Marketing Managers

Play 2: Awareness & Education
• Objective: Brand Awareness or Engagement
• Format: Video, Document, or Single Image Ads
• Offer: Thought leadership content, category story, brand narrative
• Audience: Broad professional audience by industry and function
• Success metric: Reach, engagement rate, video completion, brand lift
• Best for: VPs of Marketing / CMOs

Play 3: ABM Influence
• Objective: Engagement or Lead Generation
• Format: Targeted content to key accounts using Matched Audiences
• Offer: Account-relevant asset, event invitation, or personalized content
• Audience: Specific companies + specific roles within those companies
• Success metric: Account penetration, stakeholder engagement, pipeline from target accounts
• Best for: ABM / Field Marketing Leaders

Planning logic: Start with business goal → Select audience → Match objective → Pick format → Choose CTA/offer → Define success metric → Plan follow-up and optimization.`,
    tags: ["starter_strategies", "plays", "campaign_planning", "pilot"],
    keywords: ["starter strategy", "pilot", "demand capture", "awareness", "ABM", "campaign planning", "plays", "beginner"]
  },

  {
    id: "pp_confidence_structure",
    type: "slide",
    category: "product",
    chapter: 2,
    title: "Product Positioning: Confidence Through Structure",
    content: `A response framework that helps beginner reps sound structured and confident in any conversation.

Use this 4-part structure:

1. What I heard
• Restate the buyer's goal or challenge in their own words
• Example: "It sounds like your biggest priority is improving the quality of leads your sales team is getting."

2. What that likely means
• Connect their stated goal to a common pattern or insight
• Example: "That usually means the targeting or conversion path needs refinement, not just more volume."

3. What I would test first
• Recommend a specific, focused starting point
• Example: "I'd suggest starting with a targeted campaign using Lead Gen Forms focused on your top-priority audience."

4. How I would measure success
• Define success in their terms
• Example: "We'd measure success by sales acceptance rate and cost per qualified opportunity, not just CPL."

Why this works:
• Shows you listened
• Demonstrates expertise without being pushy
• Provides a clear, logical path forward
• Makes the buyer feel understood

Executive summary version:
"LinkedIn tends to be strongest when the goal is to reach the right business audience with credible messaging and connect that engagement to meaningful funnel outcomes."`,
    tags: ["structure", "confidence", "framework", "positioning", "executive"],
    keywords: ["confidence", "structure", "framework", "executive summary", "positioning", "recommendation", "beginner"]
  }
];

export function formatKnowledgeForPrompt(entries: KnowledgeEntry[]): string {
  return entries.map((entry, i) => {
    let formatted = `[${i + 1}] ${entry.title} (Chapter ${entry.chapter})\n${entry.content}`;
    
    if (entry.winningResponse) {
      formatted += `\n\nWINNING RESPONSE: "${entry.winningResponse}"`;
    }
    if (entry.losingResponse) {
      formatted += `\nLOSING RESPONSE (avoid): "${entry.losingResponse}"`;
    }
    
    return formatted;
  }).join("\n\n---\n\n");
}

export function searchKnowledge(query: string): KnowledgeEntry[] {
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);

  return KNOWLEDGE_BASE
    .map(entry => {
      let score = 0;

      for (const word of queryWords) {
        if (entry.title.toLowerCase().includes(word)) score += 3;
        if (entry.content.toLowerCase().includes(word)) score += 1;
        if (entry.keywords.some(k => k.toLowerCase().includes(word))) score += 2;
        if (entry.tags.some(t => t.toLowerCase().includes(word))) score += 2;
      }

      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ entry }) => entry);
}

export function getKnowledgeByChapter(chapter: number): KnowledgeEntry[] {
  return KNOWLEDGE_BASE.filter(entry => entry.chapter === chapter);
}

export function getKnowledgeByCategory(category: KnowledgeEntry["category"]): KnowledgeEntry[] {
  return KNOWLEDGE_BASE.filter(entry => entry.category === category);
}

export function getKnowledgeById(id: string): KnowledgeEntry | undefined {
  return KNOWLEDGE_BASE.find(entry => entry.id === id);
}

export function getRoleplayKnowledge(roleplayId: string): KnowledgeEntry | undefined {
  return KNOWLEDGE_BASE.find(entry => entry.roleplayId === roleplayId);
}
