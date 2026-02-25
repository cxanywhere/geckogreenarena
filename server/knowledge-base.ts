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
  // ============ CHAPTER 0: MARKETSTAR OVERVIEW & SOLUTIONS ============

  {
    id: "p_platform_overview",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 1,
    title: "MarketStar Overview",
    content: `MarketStar is a global B2B sales outsourcing company and Everest Group PEAK Matrix® Leader (2025), purpose-built to help technology and SaaS companies accelerate revenue growth through outsourced sales teams.

Core Solutions:
• Sales Solutions — Pipeline Generation (SDR/BDR), New Business Acquisition (AE), Account Management
• Partner Channel Services — PAM recruitment, onboarding, enablement, performance management for resellers, VARs, MSPs, ISVs
• Customer Success — retention, engagement, lifetime value optimization
• Revenue Operations — playbooks, CRM/CPQ admin, content management, real-time rep enablement
• Demand Generation — Digital Marketing, Content & Creative, ABM, SEO/SEM, Lead Generation
• Sales as a Service® — flagship modular delivery model (Capability + Global Execution + Intelligent Scale™)
• Nytro.ai — AI-powered pitch intelligence platform for sales onboarding & readiness (acquired 2023)
• Gameplan — MarketStar Labs training and mentorship platform

Founded in 1988, MarketStar has nearly 40 years of experience, 3,950 employees, and operates across 90+ countries from offices in North America, EMEA, APAC, ANZ, and Latin America (HQ: Ogden, Utah). We serve 60+ world-class clients and have driven 500+ career advancements per year.

Leadership: Keith Titus (President & CEO), Paul Grant (COO).

Core Values — "Live the Six": You Belong, All In Everyday, Leaders Who Amplify, Masters of Our Craft, We Care, Creativity That Impacts.

Awards: 4 Stevie Awards (2025, including Gold for Demand Generation), Everest Group PEAK Matrix® Leader (2025).`,
    tags: ["overview", "platform", "marketstar", "capabilities", "demand_generation", "gameplan"],
    keywords: ["marketstar", "platform", "overview", "sales outsourcing", "B2B", "SDR", "BDR", "partner channel", "customer success", "revenue operations", "demand generation", "gameplan", "Live the Six"]
  },
  {
    id: "p_sales_solutions",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 2,
    title: "Sales Solutions — Pipeline Generation, New Business, Account Management",
    content: `MarketStar's Sales Solutions provide end-to-end outsourced sales capabilities across the full revenue cycle.

Pipeline Generation (SDR/BDR):
• Dedicated outbound SDR/BDR teams trained on your ICP, messaging, and tech stack
• Multi-channel prospecting: phone, email, LinkedIn, social selling
• Lead qualification using BANT, MEDDPICC, or custom frameworks
• CRM hygiene and data enrichment included
• Typical results: 30-50% increase in qualified pipeline within 90 days

New Business Acquisition (AE):
• Full-cycle Account Executives who demo, negotiate, and close
• Ramp-ready in 4-6 weeks vs 6-9 months for internal hires
• Quota-carrying reps with performance-based incentives aligned to client goals
• Supported by MarketStar's sales enablement, coaching, and Nytro.ai pitch intelligence platform

Account Management:
• Dedicated account managers for install base growth, renewals, and cross-sell/upsell
• Proactive outreach programs to increase adoption and expansion revenue
• Churn prevention through health scoring and early intervention
• Typical results: 15-25% increase in net revenue retention

Key differentiator: MarketStar reps are W-2 employees (not contractors), fully embedded in your brand, using your tools and processes. With 3,950 employees across 90+ countries, MarketStar provides global scale with local expertise.`,
    tags: ["sales", "pipeline", "SDR", "BDR", "AE", "account_management", "new_business"],
    keywords: ["sales solutions", "pipeline generation", "SDR", "BDR", "account executive", "new business", "account management", "outbound", "prospecting"]
  },
  {
    id: "p_partner_channel",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 3,
    title: "Partner Channel Services",
    content: `MarketStar's Partner Channel Services build, manage, and scale indirect sales ecosystems for technology companies.

Core capabilities:
• Partner Recruitment — identify, qualify, and recruit new resellers, VARs, MSPs, ISVs, and alliance partners
• Partner Onboarding — structured onboarding programs that accelerate partner time-to-first-deal
• Partner Enablement — training, certification, co-selling playbooks, and deal registration support
• Partner Account Management (PAM) — dedicated PAMs who drive partner engagement, pipeline, and revenue
• Performance Management — scorecards, QBRs, tier management, and incentive program administration

How it works:
1. MarketStar assesses your current partner ecosystem and identifies gaps
2. We recruit and onboard new partners aligned to your ICP and go-to-market strategy
3. Dedicated PAMs engage partners daily — co-selling, deal support, and enablement
4. Data-driven performance management drives accountability and ROI visibility

Key differentiator: MarketStar manages partner ecosystems for some of the world's largest tech companies. Our PAMs are trained in partner psychology, co-selling, and ecosystem development — not just account management. With 3,950 employees across 90+ countries, we provide global partner coverage.

Typical results: 40-60% increase in partner-sourced pipeline within 6 months.`,
    tags: ["partner", "channel", "PAM", "reseller", "VAR", "MSP", "ISV", "ecosystem"],
    keywords: ["partner channel", "PAM", "partner account manager", "reseller", "VAR", "MSP", "ISV", "recruitment", "enablement", "onboarding"]
  },
  {
    id: "p_customer_success",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 4,
    title: "Customer Success Services",
    content: `MarketStar's Customer Success practice helps technology companies retain customers, drive adoption, and maximize lifetime value.

Core capabilities:
• Onboarding & Adoption — structured programs to drive time-to-value and reduce time-to-first-success
• Health Scoring & Monitoring — proactive identification of at-risk accounts using data-driven health models
• Renewal Management — dedicated renewal teams that protect and grow recurring revenue
• Expansion & Upsell — identify and execute cross-sell/upsell opportunities within the install base
• Advocacy Programs — NPS management, reference cultivation, and customer advisory board facilitation

Engagement models:
• High-Touch CSM — dedicated Customer Success Managers for strategic accounts (1:20-50 ratio)
• Mid-Touch — pooled CSM model for mid-market accounts with proactive outreach cadences
• Tech-Touch — automated, scalable engagement for long-tail accounts using digital playbooks

Key metrics we impact:
• Net Revenue Retention (NRR): typical improvement of 10-20 points
• Gross Retention Rate (GRR): reduce churn by 15-30%
• Time-to-Value: compress onboarding by 40-60%
• Customer Health Score: improve portfolio health from yellow/red to green

MarketStar CSMs are trained in customer success methodology, product adoption science, and outcome-based engagement. Our 3,950-person global team serves clients across 90+ countries.`,
    tags: ["customer_success", "retention", "adoption", "NRR", "churn", "renewal"],
    keywords: ["customer success", "retention", "adoption", "churn", "NRR", "renewal", "health score", "onboarding", "lifetime value", "expansion"]
  },
  {
    id: "p_revenue_operations",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 5,
    title: "Revenue Operations Services",
    content: `MarketStar's Revenue Operations practice provides the operational backbone that enables high-performing sales teams.

Core capabilities:
• Sales Playbook Development — build, maintain, and optimize playbooks for every sales motion (outbound, inbound, partner, expansion)
• CRM & CPQ Administration — Salesforce, HubSpot, Dynamics 365 administration, customization, and data hygiene
• Content Management — sales collateral organization, version control, and enablement asset management
• Real-Time Rep Enablement — in-the-moment coaching, battle cards, competitive intel, and objection handling resources
• Reporting & Analytics — pipeline analytics, forecasting models, conversion funnel analysis, and rep performance dashboards
• Process Optimization — sales process mapping, stage definitions, handoff protocols, and SLA management

How it integrates:
RevOps is the connective tissue across MarketStar's sales, partner, and CS teams. Every engagement includes RevOps support to ensure:
• Data flows correctly between systems
• Reps have the right content at the right time
• Leadership has visibility into pipeline health and team performance
• Processes are documented, repeatable, and scalable

Key differentiator: Most outsourced sales providers hand you reps. MarketStar provides the entire operating system — people, process, technology, and data — so teams perform from day one. With nearly 40 years of experience and 3,950 employees across 90+ countries, we have the scale and expertise to deliver.`,
    tags: ["revops", "revenue_operations", "CRM", "playbook", "enablement", "analytics"],
    keywords: ["revenue operations", "RevOps", "CRM", "Salesforce", "HubSpot", "playbook", "enablement", "analytics", "process", "reporting"]
  },
  {
    id: "p_sales_as_a_service",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 6,
    title: "Sales as a Service® — Flagship Delivery Model",
    content: `Sales as a Service® is MarketStar's flagship modular delivery model that combines three pillars to deliver scalable, intelligent revenue growth.

The Three Pillars:

1. Capability — the right skills and expertise
• Trained, certified sales professionals (SDRs, AEs, PAMs, CSMs)
• Industry-specific knowledge and vertical expertise
• Continuous coaching, QA, and performance management
• Nytro.ai-powered pitch intelligence that gets reps certified and productive faster

2. Global Execution — the right presence everywhere
• 3,950 employees operating across 90+ countries
• Delivery centers across North America, EMEA, APAC, ANZ, and Latin America
• Follow-the-sun support models for 24/7 engagement
• Local market knowledge combined with global best practices

3. Intelligent Scale™ — the right data and technology
• AI-driven readiness assessment using Nytro.ai pitch intelligence
• Predictive analytics for pipeline health and conversion forecasting
• Dynamic capacity planning that scales up/down with demand
• Real-time dashboards and KPI visibility for clients

Why Sales as a Service® wins:
• Speed: Launch a fully operational sales team in 4-8 weeks (vs 6-12 months internally)
• Flexibility: Scale headcount up or down without the cost of hiring/firing
• Predictability: Fixed cost per rep with transparent SLAs and KPIs
• Expertise: Access nearly 40 years of sales execution best practices on day one

Sales as a Service® is not staff augmentation — it's an outcome-oriented engagement model with built-in management, enablement, technology, and continuous optimization.`,
    tags: ["sales_as_a_service", "delivery_model", "capability", "global_execution", "intelligent_scale"],
    keywords: ["Sales as a Service", "delivery model", "capability", "global execution", "Intelligent Scale", "modular", "outsourcing", "scalable"]
  },
  {
    id: "p_nytro_ai",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 7,
    title: "Nytro.ai — AI-Powered Pitch Intelligence Platform",
    content: `Nytro.ai is MarketStar's proprietary AI-powered pitch intelligence and readiness platform, acquired in 2023. Winner of Stevie Awards (2025).

IMPORTANT: Nytro.ai is a PITCH INTELLIGENCE platform for sales onboarding and readiness — it is NOT a real-time call coaching tool (that's Gong/Chorus). Nytro.ai focuses on pre-call preparation and certification.

Core capabilities:
• Pitch Upload & Scoring — reps record and submit pitch/demo recordings; AI scores them against top-performer benchmarks on clarity, persuasiveness, objection handling, and structure
• Onboarding Acceleration — new reps practice pitches and receive AI-generated feedback before going live with prospects
• Readiness Certification — reps must pass AI-graded pitch assessments before engaging with client prospects
• Improvement Insights — managers get data-driven insights on rep strengths and specific development areas
• Benchmarking — individual rep scores compared against top performers to identify best practices and skill gaps

How Nytro.ai works:
1. Rep records a pitch or demo (practice session or training exercise)
2. Rep uploads the recording to the Nytro.ai platform
3. AI engine analyzes content, structure, value prop clarity, objection handling, and persuasiveness
4. Scorecard generated comparing performance against top-performer benchmarks with specific improvement recommendations
5. Managers review scores and improvement insights to guide targeted coaching

Key differentiator: Most sales outsourcing firms rely on manual QA and coaching. Nytro.ai provides objective, data-driven pitch assessment at scale — ensuring every MarketStar rep is certified and ready before engaging with client prospects. This is fundamentally different from conversation intelligence tools like Gong or Chorus, which analyze live calls after they happen.

Impact: Reps onboarded with Nytro.ai reach full productivity 50% faster and achieve 25% higher conversion rates in their first 90 days.`,
    tags: ["nytro", "ai", "pitch_intelligence", "onboarding", "readiness", "coaching"],
    keywords: ["Nytro.ai", "AI", "pitch intelligence", "onboarding", "readiness", "coaching", "certification", "pitch scoring", "machine learning"]
  },
  {
    id: "p_global_footprint",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 8,
    title: "Global Footprint & Delivery Centers",
    content: `MarketStar operates across 90+ countries with 3,950 employees, strategically positioned to serve clients in every major market.

Regional presence:

North America:
• Ogden, Utah (Global HQ) — primary delivery center for North American clients
• Additional North American offices for local delivery

EMEA:
• Ireland — English-language hub for European enterprise clients
• Bulgaria — multilingual European delivery center
• Additional European presence for local markets

APAC & ANZ:
• Philippines — large-scale delivery center for APAC programs
• Australia — local delivery for ANZ market

Latin America:
• Mexico and Uruguay — Spanish and Portuguese language delivery

Deployment models:
• Onshore — same-country delivery for cultural alignment and compliance
• Nearshore — adjacent time zone delivery for cost optimization with proximity
• Offshore — global delivery for cost efficiency with 24/7 coverage
• Hybrid — blended models that combine onshore, nearshore, and offshore resources

Key stats: 3,950 employees | 90+ countries covered | 60+ world-class clients | 500+ career advancements per year

Key message: MarketStar provides global coverage with local expertise. Our delivery centers aren't call centers — they're sales offices with trained professionals, management infrastructure, and technology platforms.`,
    tags: ["global", "delivery_centers", "locations", "onshore", "nearshore", "offshore"],
    keywords: ["global", "delivery centers", "Ogden", "Utah", "Ireland", "Bulgaria", "Philippines", "Australia", "90+ countries", "nearshore", "offshore"]
  },
  {
    id: "p_implementation_timeline",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 9,
    title: "Implementation & Launch Timeline",
    content: `MarketStar engagements follow a proven launch methodology designed to deliver pipeline within the first 30 days of going live.

Typical timeline (4-8 weeks):
• Week 1-2: Kickoff, ICP definition, messaging framework, tool access, CRM setup
• Week 3-4: Rep recruitment, hiring, and initial training on product, market, and sales process
• Week 5-6: Nytro.ai pitch intelligence certification (reps submit practice pitches, receive AI-scored feedback, iterate until certified), QA review, and coaching ramp
• Week 7-8: Go-live with full prospecting cadence, first qualified meetings delivered

What's included in every engagement:
• Dedicated Program Manager (client-facing)
• Team Lead / Sales Manager for day-to-day coaching and performance management
• Revenue Operations support (CRM admin, reporting, playbook development)
• Nytro.ai onboarding and readiness certification
• Weekly and monthly performance reporting with KPI dashboards
• Quarterly Business Reviews (QBRs) with executive stakeholders

Success factors:
• Client provides product training materials and access to subject matter experts
• CRM and sales tool access provisioned before Week 3
• Stakeholders engaged for ICP and messaging alignment in Week 1
• 3-5 target account lists prioritized for initial outreach

Post-launch: Continuous optimization through coaching cycles, A/B message testing, and performance analytics.`,
    tags: ["implementation", "timeline", "onboarding", "launch", "deployment"],
    keywords: ["implementation", "timeline", "launch", "onboarding", "weeks", "ramp", "training", "go-live", "deployment"]
  },
  {
    id: "p_security_compliance",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 10,
    title: "Security, Compliance & Data Protection",
    content: `MarketStar meets enterprise-grade security and compliance requirements for handling sensitive client data and prospect information.

Certifications & compliance:
• SOC 2 Type II certified — annual audit by independent third party
• GDPR compliant — full support for EU data protection requirements across European operations
• CCPA compliant — California Consumer Privacy Act ready
• ISO 27001 aligned security practices
• PCI DSS compliant where required for payment-related programs

Data handling:
• All client data encrypted in transit (TLS 1.2+) and at rest (AES-256)
• Role-based access controls (RBAC) for all systems and tools
• Client data segregation — no cross-client data sharing
• Clean desk policies and physical security at all delivery centers
• Annual security awareness training for all employees
• Background checks for all employees handling client data

Operational security:
• Secure VPN access for remote and hybrid work
• DLP (Data Loss Prevention) controls on all endpoints
• Regular penetration testing and vulnerability assessments
• Incident response plan with defined SLAs
• Business continuity plans with <4 hour RTO across all delivery centers

Enterprise buyers: MarketStar passes InfoSec reviews at Fortune 500 technology companies. We provide SOC 2 reports, completed security questionnaires, and architecture documentation upon request.`,
    tags: ["security", "compliance", "gdpr", "ccpa", "soc2", "data_protection"],
    keywords: ["security", "compliance", "GDPR", "CCPA", "SOC 2", "encryption", "privacy", "data protection", "background check"]
  },
  {
    id: "p_technology_stack",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 11,
    title: "Technology Stack & Tool Integration",
    content: `MarketStar integrates with your existing sales technology stack — we don't require you to adopt new tools.

CRM platforms we work with:
• Salesforce — Sales Cloud, Service Cloud, Pardot/Marketing Cloud Account Engagement
• HubSpot — Sales Hub, Marketing Hub, Service Hub
• Microsoft Dynamics 365
• Custom / proprietary CRM systems

Sales engagement tools:
• Outreach, SalesLoft, Apollo, Salesloft
• LinkedIn Sales Navigator
• ZoomInfo, Cognism, 6sense, Bombora (intent data)
• Gong, Chorus (conversation intelligence — note: these are separate from Nytro.ai which focuses on pitch readiness, not live call analysis)

Communication platforms:
• Zoom, Microsoft Teams, Google Meet
• Dialpad, RingCentral, Aircall, Five9
• Slack, Microsoft Teams for internal collaboration

MarketStar-owned technology:
• Nytro.ai — AI-powered pitch intelligence and readiness certification platform (upload → score → improve)
• Gameplan — MarketStar Labs training and mentorship platform
• Custom reporting dashboards and analytics
• Performance management and coaching tools
• Quality assurance and call monitoring systems

Key message: "MarketStar reps use YOUR tools, YOUR CRM, YOUR brand identity. From the outside, they're indistinguishable from your internal team."`,
    tags: ["technology", "tools", "CRM", "salesforce", "hubspot", "integration"],
    keywords: ["technology", "tools", "CRM", "Salesforce", "HubSpot", "Outreach", "SalesLoft", "LinkedIn", "integration", "stack"]
  },
  {
    id: "p_verticals_industries",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 12,
    title: "Industry Verticals & Expertise",
    content: `MarketStar has deep expertise across technology verticals, with particular strength in SaaS, cloud infrastructure, and enterprise software.

Primary verticals:
• Enterprise SaaS — CRM, ERP, HCM, ITSM, security, collaboration
• Cloud & Infrastructure — IaaS, PaaS, cloud migration, managed services
• Cybersecurity — endpoint, network, identity, cloud security, compliance
• Data & Analytics — BI, data management, AI/ML platforms
• DevOps & Developer Tools — CI/CD, monitoring, APM, low-code/no-code
• Martech & Adtech — marketing automation, CRM, CDP, digital advertising
• Telecom & Unified Communications — UCaaS, CCaaS, SD-WAN

Industry-specific value:
• Trained reps who understand technical buyer personas and complex sales cycles
• Industry-specific talk tracks, objection handling, and competitive positioning
• Vertical-focused account targeting and ICP development
• Domain expertise accumulated over nearly 40 years and 60+ world-class client engagements

Key message: MarketStar doesn't provide generic callers — we provide industry-trained sales professionals who can have credible, technical conversations with your buyers. With 3,950 employees and nearly 40 years of experience, we have deep vertical expertise.`,
    tags: ["verticals", "industries", "SaaS", "cloud", "cybersecurity", "expertise"],
    keywords: ["verticals", "industries", "SaaS", "cloud", "cybersecurity", "enterprise software", "telecom", "martech", "expertise"]
  },
  {
    id: "p_key_stats",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 13,
    title: "MarketStar Key Statistics & Proof Points",
    content: `Key statistics that demonstrate MarketStar's scale, experience, and impact.

Company metrics:
• Founded: 1988 (nearly 40 years in business)
• Employees: 3,950 globally
• Countries covered: 90+
• Clients: 60+ world-class technology companies
• Career advancements: 500+ per year
• Client retention rate: 90%+ year-over-year
• Average client tenure: 5+ years
• Leadership: Keith Titus (President & CEO), Paul Grant (COO)

Core Values — "Live the Six":
• You Belong • All In Everyday • Leaders Who Amplify • Masters of Our Craft • We Care • Creativity That Impacts

Recognition:
• Everest Group PEAK Matrix® Leader for Sales Outsourcing (2025)
• 4 Stevie Awards (2025), including Gold for Demand Generation
• Consistently ranked among top sales outsourcing providers globally

Performance benchmarks:
• Average time to first qualified meeting: 2-3 weeks post-launch
• Average pipeline generated per SDR: $2-4M annually
• Rep ramp time: 50% faster than industry average (powered by Nytro.ai pitch intelligence)
• Quota attainment: 85%+ across client programs

Use these stats in conversations to establish credibility: "MarketStar has been doing this for nearly 40 years. We have 3,950 employees operating across 90+ countries, serve 60+ world-class clients, and are recognized by Everest Group as a PEAK Matrix Leader in sales outsourcing — plus we won 4 Stevie Awards in 2025."`,
    tags: ["stats", "proof_points", "metrics", "recognition", "credibility"],
    keywords: ["statistics", "proof points", "nearly 40 years", "3950 employees", "90+ countries", "PEAK Matrix", "Everest Group", "Stevie Awards", "Live the Six"]
  },
  {
    id: "p_engagement_models",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 14,
    title: "Engagement Models & Flexibility",
    content: `MarketStar offers flexible engagement models designed to match your growth stage, budget, and strategic objectives.

Engagement types:
• Dedicated Teams — fully embedded teams operating under your brand, using your tools, managed by MarketStar
• Shared / Pooled Resources — cost-efficient model for lower-volume programs or startups
• Project-Based — fixed-scope engagements for market entry, product launch, or territory expansion
• Hybrid — combination of dedicated and shared resources based on account tier

Scaling models:
• Ramp-Up — start with a pilot team (2-5 reps), prove ROI, then scale to full team
• Surge — rapidly deploy additional reps for seasonal demand, product launches, or event-driven campaigns
• Right-Size — dynamically adjust team size based on pipeline targets and market conditions
• Transition — build and train a team, then transition to internal ownership when ready

Contract flexibility:
• Minimum commitment: typically 6-12 months
• Scaling clause: add or reduce headcount with 30-60 day notice
• Performance guarantees: SLA-backed KPIs (meetings set, pipeline generated, deals closed)
• Pilot programs: 90-day proof-of-concept engagements available

Key message: "MarketStar gives you the flexibility to scale your sales organization like a technology platform — up, down, or sideways — without the fixed cost and risk of traditional hiring."`,
    tags: ["engagement_models", "flexibility", "scaling", "dedicated", "shared", "pilot"],
    keywords: ["engagement models", "dedicated teams", "shared resources", "pilot", "scaling", "flexibility", "ramp-up", "contract"]
  },

  // ============ CHAPTER 1: SALES METHODOLOGY ============

  {
    id: "s_discovery_framework",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 1,
    title: "Discovery Call Framework for Selling Outsourced Sales",
    content: `A strong discovery call is the foundation of every MarketStar deal. Your goal is to uncover sales pain, quantify the cost of underperformance, and identify the decision-making process.

Structure (45-60 minutes):
1) Rapport & Context (5 min) — Research their company, recent news, job postings. Reference specifics: "I noticed you have 15 SDR positions open on LinkedIn — how's that hiring going?"
2) Current State (15 min) — Understand their sales org structure, headcount, quota attainment, ramp time, turnover, and tech stack
3) Pain & Impact (15 min) — Quantify the cost of open territories, missed pipeline, slow ramp, and turnover. What's the revenue impact of every month with unfilled seats?
4) Vision & Priorities (10 min) — Where do they need to be in 12 months? New markets? New products? Partner ecosystem? Customer retention?
5) Process & Timeline (5 min) — How do they evaluate outsourcing partners? Who else needs to be involved? Budget cycle?

Key discovery questions:
• "What's your average rep ramp time from hire to full quota? What would it mean if you could cut that in half?"
• "How many open sales positions do you have right now? What's the monthly revenue impact of each unfilled seat?"
• "Have you tried outsourcing any sales functions before? What worked and what didn't?"
• "If you could wave a magic wand and solve one sales challenge this year, what would it be?"
• "Who on your leadership team is driving the decision to explore outsourced sales?"`,
    tags: ["discovery", "sales_process", "questions", "framework"],
    keywords: ["discovery", "call", "framework", "questions", "pain", "impact", "process", "timeline", "qualification", "outsourced sales"]
  },
  {
    id: "s_meddpicc",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 2,
    title: "MEDDPICC for Selling MarketStar",
    content: `Apply MEDDPICC to qualify and advance every MarketStar opportunity.

M — Metrics: What KPIs will this impact? (pipeline generated, meetings set, deals closed, revenue, NRR, partner-sourced revenue, ramp time, turnover cost)
E — Economic Buyer: Who signs the contract? (typically CRO, VP Sales, CEO, or COO). Have you met them?
D — Decision Criteria: What are they evaluating? (domain expertise, speed to launch, global coverage, technology/AI, cost per rep, cultural fit, quality management)
D — Decision Process: What's the buying process? (RFP → vendor comparison → reference calls → pilot proposal → procurement → legal → sign)
P — Paper Process: Who handles procurement? MSA required? Security questionnaire? What's their typical contract cycle?
I — Identify Pain: What's broken today? (can't hire fast enough, high turnover, missing pipeline targets, no partner channel, expanding internationally with no local presence)
C — Champion: Who internally is advocating for MarketStar? Can they sell when you're not in the room? Do they have organizational influence?
C — Competition: Who else are they evaluating? (Accenture Sales, TTEC, Teleperformance, Concentrix, building internally, doing nothing)

Red flags:
• No identified economic buyer by Stage 2
• Champion can't articulate why MarketStar over alternatives
• "We're just exploring" with no timeline, budget, or identified pain
• Single-threaded to one contact with no executive access
• They want to outsource but haven't addressed internal resistance`,
    tags: ["meddpicc", "qualification", "methodology", "sales_process"],
    keywords: ["MEDDPICC", "metrics", "economic buyer", "decision", "champion", "competition", "qualification", "pain", "outsourced sales"]
  },
  {
    id: "s_stakeholder_mapping",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 3,
    title: "Stakeholder Mapping for Enterprise Outsourced Sales Deals",
    content: `Enterprise MarketStar deals typically involve 5-8 stakeholders across sales, operations, finance, and IT. Map them early.

Common stakeholders:
• CRO / VP Sales — Primary economic buyer. Cares about pipeline, revenue, quota attainment, and cost-per-hire vs cost-per-outsourced-rep
• CEO / COO — Strategic buyer for large engagements. Cares about growth velocity, market expansion, and operational leverage
• VP Partnerships / Alliances — Key buyer for partner channel programs. Cares about partner recruitment, activation, and ecosystem revenue
• VP Customer Success — Buyer for CS outsourcing. Cares about NRR, churn, and customer health
• VP Sales Operations / RevOps — Technical evaluator. Cares about CRM integration, reporting, data security, and process alignment
• CFO / Finance — Budget approver. Cares about cost model (CapEx vs OpEx), ROI timeline, and contractual terms
• CISO / IT Security — Blocker if security requirements aren't met. Needs SOC 2, GDPR, access controls
• Procurement — Process owner for vendor onboarding, MSA negotiation, and compliance

Multi-threading strategy:
• Engage at least 3 stakeholders by Stage 2
• Ensure your champion can introduce you to the economic buyer
• Provide role-specific value: CRO gets ROI model, VP Ops gets integration plan, CFO gets TCO comparison
• Host a "Vision Workshop" that brings multiple stakeholders together early

Warning signs: If you're stuck with a single HR or recruiting contact, you may be positioned as "staffing" rather than a strategic sales partner.`,
    tags: ["stakeholders", "mapping", "enterprise", "multithreading", "champion"],
    keywords: ["stakeholder", "CRO", "VP Sales", "CEO", "COO", "VP Partnerships", "CFO", "multithreading", "champion", "economic buyer"]
  },
  {
    id: "s_value_framework",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 4,
    title: "Value Framework — Quantifying the ROI of Outsourced Sales",
    content: `Every MarketStar deal must be anchored in a clear, quantified business case. Use this framework.

Cost of the status quo:
• Cost per internal hire: $150K-$250K fully loaded (salary + benefits + equipment + training + management overhead)
• Average ramp time: 6-9 months to full productivity
• Annual turnover rate: 25-35% for SDR/BDR roles (industry average)
• Cost of a bad hire: 1.5-2x annual salary
• Revenue impact of unfilled territories: calculate monthly quota × months vacant

MarketStar value drivers:
• Speed: Teams live in 4-8 weeks vs 6-12 months to hire, train, and ramp internally
• Cost efficiency: 20-40% lower total cost vs internal teams when factoring in hiring, turnover, management, and overhead
• Expertise: Nearly 40 years of sales execution best practices applied from day one
• Scalability: Add or reduce reps with 30-60 day notice vs months of hiring/severance cycles
• Quality: Nytro.ai pitch intelligence certification, continuous coaching, and QA ensure consistent performance
• Risk reduction: Convert fixed headcount costs to variable OpEx, shift execution risk to MarketStar

ROI calculation example:
• 10 SDRs generating 200 qualified meetings/month × $50K average deal size × 20% close rate = $24M annual pipeline influence
• MarketStar cost: ~$1.2M/year
• Internal equivalent cost: ~$2M/year (before factoring turnover and ramp losses)
• Net ROI: 20x+ return on outsourced sales investment`,
    tags: ["value", "roi", "business_case", "cost", "framework"],
    keywords: ["value", "ROI", "business case", "cost", "TCO", "total cost", "ramp time", "turnover", "pipeline", "revenue"]
  },
  {
    id: "s_demo_methodology",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 5,
    title: "Demo / Presentation Methodology",
    content: `MarketStar sales presentations should be consultative, not feature-dumping. Follow this structure.

Presentation structure (45-60 minutes):
1) Recap Discovery Findings (5 min) — Summarize their pain, goals, and current state. "Last time we spoke, you mentioned three key challenges..."
2) MarketStar Overview (5 min) — Brief company credibility (nearly 40 years, 3,950 employees, 90+ countries, PEAK Matrix Leader 2025, 4 Stevie Awards). Don't dwell — move quickly to their problems.
3) Solution Design (20 min) — Present a custom solution mapped to their specific challenges. Show exactly how MarketStar would build their team, launch the program, and deliver results.
4) Case Study Proof (10 min) — Share 1-2 case studies from similar companies (same industry, similar challenge, comparable scale)
5) Commercial Framework (5 min) — High-level cost model, timeline, and engagement structure. Not a formal quote yet.
6) Next Steps (5 min) — Agree on specific actions: reference calls, security review, executive sponsor meeting, pilot proposal

Demo best practices:
• Personalize everything — use their company name, their ICP, their sales motion in examples
• Show Nytro.ai in action — demo of pitch intelligence scoring and certification process if possible
• Have a sample ramp plan specific to their product and market
• Bring a Program Manager or delivery leader to the call for credibility
• Ask questions throughout — "Does this align with how you'd want the program structured?"

Avoid: Generic capability decks, talking about MarketStar for 30+ minutes before addressing their needs, presenting without confirming who's on the call.`,
    tags: ["demo", "presentation", "methodology", "consultative", "solution_design"],
    keywords: ["demo", "presentation", "methodology", "solution design", "case study", "consultative", "proposal"]
  },
  {
    id: "s_champion_building",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 6,
    title: "Champion Building & Internal Selling",
    content: `Your champion is the person inside the prospect's organization who will sell MarketStar when you're not in the room. Building a strong champion is critical for enterprise deals.

Identifying a champion (must have all three):
• Power — organizational influence to affect the decision (director+ level)
• Pain — personally affected by the problem MarketStar solves
• Advocacy — willing to actively promote MarketStar internally, not just passively supportive

Champion development tactics:
• Provide "leave-behind" assets they can share: ROI calculator, case study deck, executive summary
• Coach them on how to present the business case to their leadership
• Give them ammunition for internal objections: "When your CFO asks about cost, here's the TCO comparison..."
• Share industry data and benchmarks that validate the outsourcing decision
• Make them look good by framing the initiative as their strategic idea

Testing champion strength:
• "If I put together a proposal, would you present it to your CRO this week?"
• "Can you walk me through the internal decision process and where you see potential pushback?"
• "Who else needs to be convinced, and what would move them?"

Red flag: If your "champion" won't introduce you to the economic buyer, they're a coach, not a champion. Respect the distinction and keep looking.`,
    tags: ["champion", "internal_selling", "advocacy", "multithreading"],
    keywords: ["champion", "internal selling", "advocacy", "power", "pain", "influence", "sponsor", "coach"]
  },
  {
    id: "s_pipeline_management",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 7,
    title: "Pipeline Management & Deal Stages",
    content: `Follow this stage-based pipeline framework for all MarketStar opportunities.

Stage 0: Target (0%)
• Account identified, research completed, outreach initiated

Stage 1: Discovery (10%)
• Discovery call completed, pain identified, stakeholders mapped
• Exit criteria: Confirmed pain, identified 2+ stakeholders, budget conversation initiated

Stage 2: Qualification (25%)
• MEDDPICC fully completed, champion identified, economic buyer engaged
• Exit criteria: Champion confirmed, decision criteria understood, timeline established

Stage 3: Solution Design (50%)
• Custom solution presented, case studies shared, commercial framework discussed
• Exit criteria: Prospect agrees solution fits their needs, moves to reference/evaluation phase

Stage 4: Proposal (75%)
• Formal proposal delivered with pricing, scope, SLAs, and timeline
• Exit criteria: Proposal reviewed, negotiation points identified, decision timeline confirmed

Stage 5: Negotiation (90%)
• Commercial and legal terms being negotiated, security review in progress
• Exit criteria: Business terms agreed, legal review underway, signature timeline set

Stage 6: Closed Won (100%)
• Contract signed, implementation kickoff scheduled

Hygiene rules:
• Update stage and close date weekly
• No deal stays in same stage for >30 days without action
• Every deal at Stage 3+ must have a mutual action plan
• Deals without champion and economic buyer access don't advance past Stage 2`,
    tags: ["pipeline", "stages", "deal_management", "forecasting"],
    keywords: ["pipeline", "stages", "deal", "forecast", "discovery", "qualification", "proposal", "negotiation", "close"]
  },

  // ============ CHAPTER 2: OBJECTION HANDLING ============

  {
    id: "obj_too_expensive",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'Outsourced sales is too expensive'",
    content: `Cost objections are common but typically stem from comparing MarketStar's per-rep rate to base salary alone — ignoring the full loaded cost of internal teams.

Framework: Acknowledge → Reframe → Prove

Step 1: Acknowledge the concern — budget sensitivity is valid
Step 2: Reframe from "cost per rep" to "total cost of revenue generation"
Step 3: Prove with a TCO comparison that includes hiring, training, turnover, management overhead, benefits, and ramp time`,
    tags: ["objection", "price", "cost", "expensive", "budget"],
    keywords: ["too expensive", "cost", "price", "budget", "can't afford", "cheaper", "expensive"],
    roleplayId: "OBJ1",
    winningResponse: "I completely understand — budget matters, and this needs to pencil out. Let me reframe the comparison. When you hire an SDR internally, the fully loaded cost is typically $150K-$250K per year when you factor in salary, benefits, equipment, management overhead, and training. And with 25-35% annual turnover, you're re-investing in hiring and ramp every year. With MarketStar, you get a fully managed, trained, and coached rep — with built-in management, QA, and technology — for significantly less than that all-in cost. Plus, we're live in 4-8 weeks instead of 6+ months. Would it help if I built out a side-by-side TCO comparison specific to your team?",
    losingResponse: "Our pricing is actually very competitive for what you get."
  },
  {
    id: "obj_control_concerns",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'We'll lose control of our sales process'",
    content: `Control concerns are the #1 objection in outsourced sales. Prospects fear that external reps won't represent their brand properly or follow their sales methodology.

Framework: Validate → Demonstrate → Guarantee

Step 1: Validate the concern — brand and process control is critical
Step 2: Demonstrate how MarketStar provides full transparency and client governance
Step 3: Guarantee with specific mechanisms: real-time dashboards, call monitoring, weekly reviews, Nytro.ai QA`,
    tags: ["objection", "control", "brand", "process", "transparency"],
    keywords: ["control", "lose control", "brand", "process", "methodology", "oversight", "transparency", "quality"],
    roleplayId: "OBJ2",
    winningResponse: "That's absolutely the right concern to raise — and honestly, if an outsourcing partner can't give you full control and visibility, you shouldn't work with them. Here's how MarketStar is different: your reps use YOUR CRM, YOUR email, YOUR tools, YOUR messaging. Every call is recorded and QA'd using Nytro.ai. You get real-time dashboards showing activity, pipeline, and conversion metrics. We do weekly performance reviews with your team and quarterly business reviews with leadership. Many of our clients tell us our reps are indistinguishable from their internal team. Would you like to speak with a current client who had the same concern?",
    losingResponse: "Don't worry, we're very good at what we do. You can trust us."
  },
  {
    id: "obj_tried_before",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'We tried outsourcing before and it didn't work'",
    content: `Failed outsourcing attempts create skepticism. Your job is to understand what went wrong and show why MarketStar would be different.

Framework: Explore → Diagnose → Differentiate

Step 1: Explore what they tried and what happened
Step 2: Diagnose the likely root cause (usually one of: wrong vendor, wrong scope, no enablement, no management layer)
Step 3: Differentiate MarketStar's approach from what failed`,
    tags: ["objection", "tried_before", "failed", "skepticism", "past_experience"],
    keywords: ["tried", "before", "didn't work", "failed", "outsourcing", "bad experience", "past"],
    roleplayId: "OBJ3",
    winningResponse: "I appreciate you sharing that — and honestly, you're not alone. A lot of our best clients came to us after a bad outsourcing experience. Can you tell me what happened? ... [listen] ... In our experience, most outsourcing failures happen for one of three reasons: the vendor used offshore call-center reps without sales training, there was no dedicated management layer, or the vendor didn't invest in learning your product and ICP deeply enough. MarketStar is fundamentally different — our reps are W-2 employees, not contractors. They go through Nytro.ai certification before they ever pick up the phone. And every team has a dedicated Program Manager and Team Lead who own quality and performance daily. Would you be open to hearing how we've specifically addressed those issues for companies in your space?",
    losingResponse: "Well, that was probably a different kind of outsourcing company. We're much better."
  },
  {
    id: "obj_culture_fit",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'Outsourced reps won't understand our product/culture'",
    content: `Product and culture fit concerns are legitimate — especially for companies with complex, technical products. Address this head-on with your onboarding and enablement story.

Framework: Agree → Explain → Prove

Step 1: Agree that product knowledge and cultural alignment are critical for sales success
Step 2: Explain MarketStar's onboarding, training, and certification process
Step 3: Prove with examples of complex technical products where MarketStar reps excel`,
    tags: ["objection", "culture", "product_knowledge", "training", "fit"],
    keywords: ["culture", "product knowledge", "understand", "technical", "complex", "training", "fit", "brand"],
    roleplayId: "OBJ4",
    winningResponse: "You're absolutely right — if the reps don't deeply understand your product and market, they'll do more harm than good. That's exactly why MarketStar invests so heavily in onboarding. Our reps go through 2-4 weeks of product-specific training before going live. They earn Nytro.ai pitch certification — meaning an AI system grades their ability to articulate your value proposition, handle objections, and navigate technical conversations before they ever talk to a prospect. We also embed reps in your culture: they attend your team meetings, use your Slack channels, and participate in your product launches. Several of our clients have told us they forget our reps aren't employees. Can I share an example from a company with a similarly complex product?",
    losingResponse: "We train our reps on your product during onboarding so they'll know it well enough."
  },
  {
    id: "obj_internal_hiring",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'We'd rather hire internally'",
    content: `The "build vs buy" objection is common. Position MarketStar not as a replacement for internal hiring but as a complement and accelerator.

Framework: Respect → Compare → Bridge

Step 1: Respect the desire to build an internal team — it shows they care about quality
Step 2: Compare timelines, costs, and risk profiles between internal and outsourced approaches
Step 3: Bridge to a "launch with MarketStar, then decide" approach`,
    tags: ["objection", "internal", "hiring", "build_vs_buy", "in_house"],
    keywords: ["hire internally", "in-house", "build ourselves", "own team", "internal hiring", "recruit"],
    roleplayId: "OBJ5",
    winningResponse: "I totally get that — and building a strong internal team should absolutely be part of your long-term strategy. The question is timeline and opportunity cost. Hiring 10 SDRs internally takes 3-6 months for recruiting, another 3-6 months for ramp, and you'll lose 3-4 of them to turnover in the first year. That's 6-12 months of missed pipeline. MarketStar can have a fully trained team producing qualified meetings in 4-8 weeks. Many of our clients use us to generate pipeline immediately while they build their internal team in parallel. Some eventually transition to fully internal; others keep a hybrid model. Either way, you're not leaving revenue on the table. Would a parallel approach like that make sense for your timeline?",
    losingResponse: "Internal hiring is really expensive and slow. You should just outsource it."
  },
  {
    id: "obj_not_priority",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'Not a priority right now'",
    content: `When outsourced sales isn't a stated priority, connect it to what IS a priority — revenue growth, market expansion, or operational efficiency.

Framework: Accept → Connect → Create Urgency

Step 1: Accept their prioritization
Step 2: Connect outsourced sales to their existing priorities
Step 3: Create urgency through competitive pressure or cost of delay`,
    tags: ["objection", "priority", "timing", "not_now", "urgency"],
    keywords: ["not a priority", "not right now", "busy", "other priorities", "later", "next year", "backburner"],
    roleplayId: "OBJ6",
    winningResponse: "Fair enough — you have a lot on your plate. What IS your top sales priority for this year? ... [listen] ... That's interesting — because that's exactly the kind of challenge outsourced sales solves. For example, if you're focused on entering a new market, MarketStar can have boots on the ground in 4-8 weeks with local language capabilities and market knowledge. Every quarter without pipeline is revenue your competitors are capturing. Would it be worth a 20-minute call to see if there's a fit for what you're already working on?",
    losingResponse: "Okay, I'll follow up next quarter then."
  },
  {
    id: "obj_data_security",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'We have data security concerns with external teams'",
    content: `Data security objections are common in enterprise deals, especially in regulated industries. Address this with facts and certifications, not hand-waving.

Framework: Validate → Substantiate → Facilitate

Step 1: Validate the concern — data security should be non-negotiable
Step 2: Substantiate with specific certifications and controls
Step 3: Facilitate a security review with your InfoSec team`,
    tags: ["objection", "security", "data", "compliance", "risk"],
    keywords: ["data security", "compliance", "risk", "security", "GDPR", "SOC 2", "access", "breach"],
    roleplayId: "OBJ7",
    winningResponse: "Data security should absolutely be a top concern — and it's one of our strongest areas. MarketStar is SOC 2 Type II certified, GDPR and CCPA compliant, and we have ISO 27001-aligned security practices. Every rep goes through background checks, works on secured endpoints with DLP controls, and has role-based access only to the systems required for their program. We have dedicated InfoSec staff who regularly work with enterprise security teams on reviews. I can share our SOC 2 report and schedule a dedicated security review call with our team and yours. Would that be helpful?",
    losingResponse: "Don't worry about that — we handle all the security stuff."
  },
  {
    id: "obj_quality_consistency",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'How do we know the quality will be consistent?'",
    content: `Quality consistency is a legitimate concern. Prospects worry that outsourced reps will be mediocre or that quality will degrade over time.

Framework: Acknowledge → Systematize → Prove

Step 1: Acknowledge that quality is what separates great outsourcing from bad outsourcing
Step 2: Show the systems that ensure quality: Nytro.ai, QA scoring, coaching cadences, performance management
Step 3: Prove with client references and retention metrics`,
    tags: ["objection", "quality", "consistency", "performance", "QA"],
    keywords: ["quality", "consistent", "performance", "standards", "QA", "coaching", "mediocre"],
    roleplayId: "OBJ8",
    winningResponse: "That's the exact right question — and it's what separates MarketStar from most outsourcing providers. Quality isn't something we hope for; it's engineered into every program. Every rep is Nytro.ai certified before going live. Every call is recorded and scored. Our Team Leads run daily coaching sessions and weekly performance reviews. We share real-time dashboards with you showing every KPI — meetings set, conversion rates, pipeline value, call quality scores. And our client retention rate is 90%+ because quality is consistent over time, not just at launch. Would you like to speak with a client who's been with us for 3+ years about how quality has held up?",
    losingResponse: "We have really good reps. You'll be happy with the quality."
  },
  {
    id: "obj_ramp_time",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'Ramp time — won't it take forever to get productive?'",
    content: `Ramp time concerns are valid. Position MarketStar's Nytro.ai-powered onboarding as a competitive advantage.

Framework: Understand → Quantify → Accelerate

Step 1: Understand their current ramp time for internal reps
Step 2: Quantify the cost of slow ramp (months of unproductive salary + lost pipeline)
Step 3: Show how MarketStar accelerates ramp with proven methodology and AI`,
    tags: ["objection", "ramp", "time", "productivity", "onboarding"],
    keywords: ["ramp time", "productivity", "onboarding", "training", "slow", "how long", "productive"],
    roleplayId: "OBJ9",
    winningResponse: "Great question. What's your current ramp time for internal SDRs? ... [listen] ... So if it's 6 months, that means you're paying a rep for half a year before they're fully productive. With MarketStar, we typically have reps setting qualified meetings within 2-3 weeks of go-live. Here's why: we've done this thousands of times, so we have a proven onboarding methodology. We use Nytro.ai to accelerate learning — reps practice against AI-simulated buyers and get instant feedback. And our Team Leads have managed similar programs across your industry. The net result is reps reaching full productivity 50% faster than industry average. Would you like to see our onboarding plan for a company similar to yours?",
    losingResponse: "Our reps ramp up pretty quickly — usually a few weeks."
  },
  {
    id: "obj_rep_turnover",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'What happens if our outsourced reps leave?'",
    content: `Turnover concerns highlight that prospects don't want to be dependent on individual reps. Show that MarketStar has a system, not just people.

Framework: Normalize → Systematize → Guarantee

Step 1: Normalize — some turnover is natural in any sales organization
Step 2: Systematize — show that MarketStar's bench strength and knowledge management ensure continuity
Step 3: Guarantee — MarketStar owns the replacement and re-ramp, not the client`,
    tags: ["objection", "turnover", "attrition", "continuity", "bench"],
    keywords: ["turnover", "attrition", "leave", "quit", "replacement", "continuity", "knowledge transfer"],
    roleplayId: "OBJ10",
    winningResponse: "That's a smart question, and here's the honest answer: some turnover happens in any sales org. The difference is what happens when it does. When an internal rep leaves, you're starting from scratch — posting the job, interviewing, hiring, and ramping for months. When a MarketStar rep transitions, we have bench strength ready. All tribal knowledge is captured in our CRM and playbook systems. We manage the backfill, and the new rep benefits from the same Nytro.ai onboarding that certified the original rep. Most importantly, your program momentum doesn't stop because it's owned by the team and the system, not one individual. Our client-facing attrition rate is significantly below industry average because of our investment in culture, career development, and compensation. Does that address the concern?",
    losingResponse: "Our turnover is really low, so you shouldn't worry about it."
  },
  {
    id: "obj_just_staffing",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'Isn't this just a staffing agency?'",
    content: `The "staffing" misperception is damaging. If prospects think you're temp staffing, they'll commoditize you on price. Differentiate clearly.

Framework: Distinguish → Elevate → Value

Step 1: Clearly distinguish MarketStar from staffing agencies
Step 2: Elevate the conversation to outcomes, not bodies
Step 3: Anchor value in the full operating system, not just headcount`,
    tags: ["objection", "staffing", "agency", "differentiation", "value"],
    keywords: ["staffing", "agency", "temp", "bodies", "headcount", "contractor", "staff aug"],
    roleplayId: "OBJ11",
    winningResponse: "Great question — and it's an important distinction. A staffing agency gives you resumes and you manage the reps yourself. MarketStar provides the entire sales operating system: we recruit, hire, train, manage, coach, QA, and optimize the team. Our reps are W-2 MarketStar employees. They come with dedicated management, Nytro.ai-powered enablement, RevOps support, and performance analytics. You set the strategy and KPIs; we handle execution. Think of it less like hiring temps and more like plugging into a proven sales engine that's already running. The analogy I use is: a staffing firm gives you ingredients, MarketStar serves you the finished dish. Would it help to walk through exactly what's included beyond the reps?",
    losingResponse: "No, we're much more than a staffing company. We do outsourced sales."
  },
  {
    id: "obj_send_info",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'Send me info and I'll review'",
    content: `"Send me info" is usually a polite dismissal. Your goal is to either convert it to a real conversation or qualify out.

Framework: Offer Value → Qualify Intent → Secure Next Step

Step 1: Offer to send something specific and valuable (not a generic brochure)
Step 2: Qualify whether there's genuine interest or this is a brush-off
Step 3: Secure a specific follow-up time`,
    tags: ["objection", "brush_off", "info", "stall", "email"],
    keywords: ["send info", "email me", "send materials", "brochure", "review", "look at it"],
    roleplayId: "OBJ12",
    winningResponse: "Happy to send something over. Rather than a generic overview, I'd love to put together something specific to your situation. I noticed you're expanding into [market/segment] and hiring for [roles]. I can put together a brief assessment showing how companies in your space have accelerated that motion with outsourced sales, including a rough cost comparison. Would it be helpful if I paired that with 15 minutes next Tuesday to walk through it together? That way I can answer questions and not just add to your inbox.",
    losingResponse: "Sure! I'll send you our brochure and case studies. Let me know what you think!"
  },

  // PRICING & ROI FRAMEWORKS (Chapter 2)
  {
    id: "pr_pricing_model",
    type: "slide",
    category: "pricing",
    chapter: 2,
    title: "Pricing Model — How MarketStar Engagements Are Priced",
    content: `MarketStar pricing is based on a per-rep, per-month model with transparent, all-inclusive pricing.

How it works:
• Each rep is priced on a monthly basis — fully loaded with management, training, technology, QA, and RevOps support
• Pricing varies by role type (SDR, AE, PAM, CSM) and delivery location (onshore, nearshore, offshore)
• All-inclusive: management, Nytro.ai, coaching, CRM admin, reporting, and performance analytics are included — no hidden fees
• Volume discounts available for larger teams (10+ reps)

Pricing tiers by delivery model:
• Onshore (US/Canada/Australia/Ireland): Premium pricing, highest cultural alignment
• Nearshore (Mexico/Uruguay): 20-30% lower than onshore, same time zones
• Offshore (Philippines/Bulgaria): 40-60% lower than onshore, 24/7 coverage capability
• Hybrid: Blended rates based on mix of locations

Key messaging:
• "Compare our per-rep cost to your fully loaded internal cost — salary, benefits, equipment, management overhead, recruiting, and turnover replacement"
• "With MarketStar, the cost is predictable and all-in. No surprise costs for hiring, training, or backfilling when someone leaves"
• "As you scale, per-rep costs decrease with volume commitments"

Important: Always compare MarketStar pricing to fully loaded internal costs, not just base salary. The TCO comparison is where we win.`,
    tags: ["pricing", "model", "cost", "per_rep", "monthly"],
    keywords: ["pricing", "cost", "per-rep", "monthly", "price", "rate", "model", "budget", "investment", "onshore", "nearshore", "offshore"]
  },
  {
    id: "pr_engagement_tiers",
    type: "slide",
    category: "pricing",
    chapter: 2,
    title: "Engagement Tiers & What's Included",
    content: `MarketStar offers three engagement tiers designed for different scales and maturity levels.

Starter:
• 2-5 dedicated reps
• Shared Team Lead (managing multiple small programs)
• Standard onboarding and Nytro.ai certification
• Weekly reporting and monthly QBR
• Best for: Companies testing outsourced sales for the first time

Growth:
• 6-20 dedicated reps
• Dedicated Team Lead
• Full RevOps support (CRM admin, playbook development, content management)
• Real-time dashboards and weekly performance reviews
• Quarterly optimization sprints with A/B message testing
• Best for: Companies scaling proven sales motions or expanding into new markets

Enterprise:
• 20+ reps across multiple functions (SDR + AE + CSM + PAM)
• Dedicated Program Manager + Team Leads
• Full RevOps team embedded
• Nytro.ai advanced analytics and custom coaching models
• Executive QBR with MarketStar leadership
• Custom SLAs and performance guarantees
• Best for: Large-scale, multi-function outsourced sales organizations

Note: Most initial engagements start at Starter or Growth tier and expand as ROI is proven.`,
    tags: ["tiers", "packages", "starter", "growth", "enterprise", "included"],
    keywords: ["tier", "package", "Starter", "Growth", "Enterprise", "included", "team lead", "program manager"]
  },
  {
    id: "pr_roi_calculator",
    type: "slide",
    category: "pricing",
    chapter: 2,
    title: "ROI Calculator & Business Case Framework",
    content: `Use this framework to build a compelling ROI case for every MarketStar opportunity.

Input variables (gather during discovery):
• Average deal size (ACV)
• Current pipeline generation rate per rep
• Current win rate
• Average ramp time for new hires
• Annual rep turnover rate
• Fully loaded cost per internal rep
• Number of reps needed
• Time to hire (days from job post to start date)

ROI calculation:
1. Pipeline impact: # of MarketStar reps × meetings/rep/month × avg deal size × win rate = annual influenced pipeline
2. Speed-to-revenue: Pipeline generated during months 2-6 that would have been lost to internal ramp time
3. Cost savings: (Internal fully loaded cost × headcount) - (MarketStar cost × headcount) = annual savings
4. Turnover avoidance: Internal turnover rate × cost of replacement × headcount = annual turnover cost avoided
5. Opportunity cost: Revenue from redirecting internal resources to higher-value activities

Example output (10 SDRs):
• Internal cost: $2.2M/year (fully loaded, including management, turnover replacement, and ramp losses)
• MarketStar cost: $1.4M/year (fully managed, all-inclusive)
• Pipeline generated: $30M annually
• ROI: 21:1 return on outsourced sales investment
• Break-even: Month 2

Key message: "This isn't a cost — it's an investment with a measurable return that starts producing in weeks, not months."`,
    tags: ["roi", "calculator", "business_case", "investment", "return"],
    keywords: ["ROI", "calculator", "business case", "return", "investment", "payback", "break-even", "pipeline", "revenue"]
  },
  {
    id: "pr_contract_terms",
    type: "slide",
    category: "pricing",
    chapter: 2,
    title: "Contract Terms & SLAs",
    content: `Standard contract terms for MarketStar engagements.

Contract structure:
• Standard term: 12 months (annual contract)
• Preferred term: 24-36 months (better pricing available for longer commitments)
• Pilot programs: 90-day proof-of-concept with defined success criteria
• Billing: Monthly invoicing (standard), quarterly prepay available for discount
• Auto-renewal: 12-month auto-renewal with 90-day cancellation notice
• Payment terms: Net-30 (standard), Net-45/Net-60 available with approval

Standard SLAs:
• Rep quality: Nytro.ai certification score ≥ 80% before go-live
• Ramp time: First qualified meetings within 3 weeks of go-live
• Reporting: Weekly performance reports, monthly trend analysis, quarterly business reviews
• Backfill: Replacement rep within 2-4 weeks of any transition
• Data security: SOC 2 Type II compliance maintained throughout engagement

Scaling provisions:
• Scale-up: Add reps with 30-day notice (recruiting and training included)
• Scale-down: Reduce reps with 60-day notice
• Performance guarantee: If agreed KPIs are not met within 90 days, MarketStar provides remediation plan at no additional cost

Negotiation guidance:
• Prospects often push for month-to-month — counter with annual pricing advantage (10-15% savings)
• Performance-based pricing (base + bonus for results) available for Growth and Enterprise tiers
• Involve deal desk early for non-standard terms to avoid delays`,
    tags: ["contract", "terms", "sla", "legal", "procurement", "pilot"],
    keywords: ["contract", "terms", "SLA", "billing", "renewal", "payment", "legal", "procurement", "pilot", "guarantee"]
  },
  {
    id: "pr_discount_authority",
    type: "slide",
    category: "pricing",
    chapter: 2,
    title: "Discount Authority & Approval Process",
    content: `Discounting guidelines to protect deal value and maintain pricing integrity.

Rep authority (no approval needed):
• Up to 5% discount on annual contracts
• Free pilot extension (up to 30 days) for active evaluation
• Net-30 payment terms

Manager approval required:
• 6-15% discount
• Performance-based pricing structures
• Custom SLA terms
• Pilot pricing below standard rates

VP/CRO approval required:
• 16%+ discount
• Free pilot longer than 90 days
• Non-standard contract terms
• Revenue share or success-fee-only pricing

Discount best practices:
• Never lead with discount — always negotiate value first
• Ask for something in return: longer commitment, case study rights, reference customer agreement, larger team size
• "I can explore better pricing if we commit to a 24-month term with a 15-rep minimum — would that work for your growth plan?"
• Document the business justification for every discount over 5%
• Frame as "investment optimization" not "discount"

Important: Discounts given set the baseline for renewal and expansion. Discount thoughtfully.`,
    tags: ["discount", "approval", "pricing", "negotiation"],
    keywords: ["discount", "approval", "authority", "pricing", "negotiation", "deal", "terms", "concession"]
  },

  // COMPETITIVE INTELLIGENCE (Chapter 1)
  {
    id: "comp_accenture",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Intel: vs Accenture Sales / Accenture Song",
    content: `Accenture is a global consulting giant with a sales outsourcing practice. Understand how to position MarketStar against them.

Their strengths:
• Massive brand recognition and global scale
• End-to-end business transformation capabilities (consulting + outsourcing)
• Large analyst teams for strategy and process design
• Deep enterprise relationships and existing contracts

MarketStar advantages:
• Sales specialization — MarketStar is 100% focused on sales execution; Accenture spreads across IT, consulting, BPO, and dozens of practices
• Speed to launch — MarketStar deploys in 4-8 weeks; Accenture typically takes 3-6 months due to consulting-heavy pre-work
• Cost efficiency — MarketStar's lean delivery model costs 30-50% less than Accenture's blended consulting + delivery rates
• Technology focus — MarketStar specializes in selling technology/SaaS products; Accenture serves all industries generically
• Flexibility — MarketStar scales up/down quickly; Accenture prefers large, multi-year commitments
• Nytro.ai — purpose-built pitch intelligence for sales readiness vs Accenture's generic tooling
• Client attention — Mid-market and growth-stage companies get senior attention at MarketStar; they're often a small engagement at Accenture

Displacement talking points:
• "How much of Accenture's proposal is consulting/strategy vs actual rep deployment?"
• "What's Accenture's timeline to have reps making calls?"
• "Are you comfortable with the total cost when you add Accenture's consulting fees on top of delivery?"

Win rate vs Accenture: ~60% when the buyer prioritizes speed, cost, and technology-industry expertise.`,
    tags: ["competitive", "accenture", "consulting", "displacement"],
    keywords: ["Accenture", "competitor", "comparison", "vs", "consulting", "displacement", "Accenture Song"]
  },
  {
    id: "comp_ttec",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Intel: vs TTEC",
    content: `TTEC is a large BPO and customer experience company with growing B2B sales outsourcing capabilities.

Their strengths:
• Large scale (60,000+ employees globally)
• Strong customer experience / contact center heritage
• Good technology platform (Humanify)
• Established offshore delivery in multiple geographies

MarketStar advantages:
• B2B sales DNA — MarketStar was founded for B2B sales outsourcing; TTEC's heritage is B2C contact centers and customer support
• Technology industry focus — MarketStar's reps sell SaaS, cloud, and enterprise technology daily; TTEC's sales teams skew toward telecom, insurance, and consumer
• Sales quality — MarketStar's Nytro.ai pitch-certified reps consistently outperform TTEC reps in complex B2B sales conversations
• Management depth — MarketStar provides dedicated sales management, not scaled BPO team leads managing 50+ agents
• Partner channel expertise — MarketStar has deep partner/channel capabilities; TTEC does not
• Cultural fit — MarketStar's sales-first culture attracts top B2B sales talent; TTEC's culture is support/service-oriented

Key differentiator: TTEC is a customer experience company that added sales. MarketStar is a sales company built from the ground up for B2B revenue generation.

Competitive questions:
• "Are they proposing contact center agents or dedicated B2B sales professionals?"
• "What's their experience selling your specific product category?"
• "Do they have a dedicated partner channel practice?"`,
    tags: ["competitive", "ttec", "bpo", "contact_center"],
    keywords: ["TTEC", "competitor", "comparison", "vs", "BPO", "contact center", "customer experience"]
  },
  {
    id: "comp_teleperformance",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Intel: vs Teleperformance",
    content: `Teleperformance is the world's largest BPO company with 410,000+ employees. They've been expanding into B2B sales outsourcing.

Their strengths:
• Massive global scale and delivery footprint
• Competitive pricing through offshore leverage
• Strong capabilities in customer support, collections, and B2C sales
• Growing enterprise client roster through acquisitions

MarketStar advantages:
• Specialization vs generalization — MarketStar is laser-focused on B2B technology sales; Teleperformance does everything from customer support to content moderation
• Rep quality — MarketStar recruits and trains B2B sales professionals; Teleperformance often deploys BPO agents on sales programs
• Management model — MarketStar's management-to-rep ratio (1:8-12) provides real coaching; Teleperformance's ratio (1:20-30) is supervision, not development
• Technology industry expertise — MarketStar reps understand SaaS, cloud, and enterprise tech; Teleperformance's tech knowledge is surface-level
• Nytro.ai — objective, AI-powered pitch intelligence and readiness certification vs Teleperformance's manual QA sampling
• Client size fit — Teleperformance optimizes for 100+ seat programs; MarketStar excels at 5-50 rep engagements with high quality

Positioning:
• "Teleperformance is great at scale BPO. MarketStar is great at high-quality B2B sales execution."
• "Ask Teleperformance what their average SDR tenure is on technology programs — then ask us."
• "The question isn't who has more agents. It's who will set higher-quality meetings for your AEs."`,
    tags: ["competitive", "teleperformance", "bpo", "scale"],
    keywords: ["Teleperformance", "competitor", "comparison", "vs", "BPO", "scale", "agents"]
  },
  {
    id: "comp_concentrix",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Intel: vs Concentrix",
    content: `Concentrix (formerly Convergys, merged with Webhelp) is a large CX outsourcing firm expanding into sales.

Their strengths:
• Large global footprint (300,000+ employees)
• Strong technology infrastructure for CX operations
• Growing digital/analytics capabilities through acquisitions
• Competitive offshore pricing

MarketStar advantages:
• Sales-first identity — Concentrix's core business is customer support; sales is an add-on, not the DNA
• B2B expertise — MarketStar's entire business is B2B technology sales; Concentrix's sales practice serves B2C and B2B generically
• Reps, not agents — MarketStar hires sales professionals with B2B experience; Concentrix often trains support agents to do sales
• Dedicated management — every MarketStar team has a dedicated, experienced sales leader, not a BPO operations manager
• Partner channel — MarketStar's PAM practice is unique; Concentrix has no equivalent
• AI-powered enablement — Nytro.ai pitch intelligence is purpose-built for sales readiness; Concentrix uses generic workforce management tools

When competing against Concentrix:
• Focus on outcomes, not inputs: "How many qualified meetings will their team set per month?"
• Highlight the difference between support metrics (AHT, CSAT) and sales metrics (meetings, pipeline, revenue)
• Ask for B2B technology references specifically — they may struggle to provide comparable case studies

Key message: "If you need customer support agents, Concentrix is excellent. If you need B2B sales professionals who can have credible conversations with your buyers, MarketStar is the clear choice."`,
    tags: ["competitive", "concentrix", "bpo", "cx"],
    keywords: ["Concentrix", "competitor", "comparison", "vs", "BPO", "CX", "Webhelp", "support"]
  },
  {
    id: "comp_inhouse",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Intel: vs Building Internally (In-House)",
    content: `Building an internal sales team is MarketStar's most common "competitor" — especially at growth-stage companies.

Why companies consider building internally:
• Desire for full control over the sales process
• Belief that internal reps will be more knowledgeable and motivated
• Long-term cost assumptions (incorrectly comparing salary to outsourced rates)
• Cultural preference for "owning" every function

Hidden costs of building internally:
• Recruiting: $15-25K per hire (recruiter fees, job postings, interview time)
• Ramp time: 6-9 months to full productivity = months of unproductive salary
• Turnover: 25-35% annual attrition for SDRs = constant re-hiring cycle
• Management: Need to hire team leads and managers (1:8 ratio minimum)
• Tools & tech: CRM, engagement platform, data providers, telephony ($2-5K/rep/month)
• HR & admin: Benefits, payroll, compliance, workspace
• Total cost: $150-250K per rep per year (fully loaded)

MarketStar positioning:
• Never dismiss their desire to build internally — "Building a great internal team is important"
• Focus on speed and risk: "MarketStar bridges the gap while you build, or augments your team permanently"
• ROI comparison: "Is the 6-12 months of lost pipeline worth the control premium?"
• Hybrid model: "Many clients run MarketStar alongside internal teams — outsourced for scale, internal for strategic accounts"

Build vs Outsource decision framework:
• Build when: You have unlimited time, budget, and management bandwidth, AND sales is your core competency
• Outsource when: You need speed, scale, flexibility, or expertise that you can't build fast enough internally`,
    tags: ["competitive", "inhouse", "build", "internal", "hiring"],
    keywords: ["in-house", "build", "internal", "hiring", "recruit", "own team", "build vs buy"]
  },
  {
    id: "comp_other_boutique",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Intel: vs Boutique / Niche Outsourcing Firms",
    content: `Smaller, niche outsourcing firms (e.g., demandDrive, Operatix, memoryBlue, Cience) sometimes compete for smaller engagements.

Their strengths:
• Nimble and fast-moving
• Sometimes lower per-rep pricing
• Can be focused on specific motions (e.g., outbound only)
• Personal attention from founders/leadership

MarketStar advantages:
• Scale — MarketStar can start small and scale to 100+ reps; boutiques max out at 20-30 and lose quality
• Global — MarketStar operates across 90+ countries with 3,950 employees; boutiques are typically US-only
• Full lifecycle — MarketStar covers SDR → AE → CS → PAM → RevOps → Demand Gen; boutiques typically only do SDR
• AI & technology — Nytro.ai pitch intelligence, Gameplan training platform, advanced analytics; boutiques rely on manual processes
• Stability — nearly 40 years in business, 60+ world-class clients; boutiques may be 3-5 years old with limited track record
• Enterprise-ready — SOC 2, GDPR, background checks, secure facilities; boutiques may not meet enterprise security requirements
• Depth of management — dedicated management layer, RevOps, and enablement; boutiques often have founders managing directly

Positioning:
• Don't disparage smaller firms — "They may be a fit for a very small engagement"
• Focus on growth trajectory: "Where do you need to be in 12-24 months? Can your outsourcing partner scale with you?"
• Emphasize risk: "What happens if your 3-person boutique firm loses a key team member? MarketStar's infrastructure ensures continuity."`,
    tags: ["competitive", "boutique", "niche", "small", "firms"],
    keywords: ["boutique", "niche", "small", "demandDrive", "Operatix", "memoryBlue", "Cience", "competitor"]
  },

  // ============ DEMAND GENERATION (Chapter 0) ============

  {
    id: "p_demand_generation",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 15,
    title: "Demand Generation Services",
    content: `MarketStar's Demand Generation practice combines digital marketing expertise with sales execution to fill the top of the funnel.

Core capabilities:
• Digital Marketing — paid media, display advertising, social media campaigns, and programmatic buying
• Content & Creative — content strategy, copywriting, design, video production, and landing page optimization
• Account-Based Marketing (ABM) — targeted campaigns for high-value accounts using intent data and personalized messaging
• SEO/SEM — search engine optimization, pay-per-click advertising, and keyword strategy
• Lead Generation — inbound lead capture, lead scoring, nurture campaigns, and MQL/SQL conversion optimization

How it integrates with sales:
Demand Generation works alongside MarketStar's SDR/BDR teams to create a seamless top-of-funnel engine:
1. Marketing generates awareness and captures inbound interest
2. Leads are scored and qualified using intent signals and engagement data
3. SDRs follow up on marketing-qualified leads with personalized outreach
4. Closed-loop reporting connects marketing spend to pipeline and revenue

Key differentiator: Most outsourced sales firms don't offer demand generation. MarketStar provides the full funnel — from awareness to closed deal — under one roof.

Awards: Gold Stevie Award (2025) for Demand Generation excellence.`,
    tags: ["demand_generation", "digital_marketing", "ABM", "SEO", "content", "lead_gen"],
    keywords: ["demand generation", "digital marketing", "ABM", "account-based marketing", "SEO", "SEM", "content", "creative", "lead generation", "inbound"]
  },

  // ============ GAMEPLAN (Chapter 0) ============

  {
    id: "p_gameplan",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 16,
    title: "Gameplan — MarketStar Labs Training & Mentorship Platform",
    content: `Gameplan is MarketStar Labs' training and mentorship platform designed to accelerate professional development for sales teams.

Core capabilities:
• Structured Training Programs — role-specific learning paths for SDRs, AEs, PAMs, and CSMs
• Mentorship Matching — connects junior reps with experienced mentors for guided development
• Skill Assessment — tracks competency development across key sales skills
• Career Pathing — maps development milestones aligned to career progression (supports 500+ career advancements per year)
• Knowledge Management — centralized repository of best practices, playbooks, and training materials

How Gameplan complements Nytro.ai:
• Nytro.ai focuses on PITCH READINESS — AI-scored pitch assessments and certification
• Gameplan focuses on CAREER DEVELOPMENT — ongoing training, mentorship, and skill building
• Together, they provide a complete enablement ecosystem: get certified fast (Nytro.ai) and keep growing (Gameplan)

Key differentiator: Most outsourced sales providers offer basic onboarding and then leave reps to figure it out. MarketStar invests in continuous development through both AI-powered assessment (Nytro.ai) and human-driven mentorship (Gameplan).`,
    tags: ["gameplan", "training", "mentorship", "labs", "development", "career"],
    keywords: ["Gameplan", "MarketStar Labs", "training", "mentorship", "career development", "learning", "skill assessment", "career pathing"]
  },

  // ============ CUSTOMER SUCCESS & CASE STUDIES (Chapter 0) ============

  {
    id: "cs_implementation_stories",
    type: "slide",
    category: "customer_success",
    chapter: 0,
    title: "Customer Success Story: Enterprise SaaS Pipeline Generation",
    content: `Client: Fortune 500 enterprise software company expanding into mid-market segment

Challenge:
• Internal AEs were focused on enterprise accounts ($500K+ ACV)
• Mid-market segment ($50-150K ACV) was completely underserved — millions in TAM left untouched
• Couldn't justify hiring 20 internal SDRs for an unproven market segment
• Needed to test mid-market motion before committing internal resources

MarketStar solution:
• Deployed 15 dedicated SDRs across US and Ireland delivery centers
• Built custom ICP, messaging framework, and prospecting cadence
• Nytro.ai-certified reps on product, competitive positioning, and mid-market buyer personas
• RevOps team built Salesforce dashboards and pipeline attribution reporting

Results at 6 months:
• 2,400+ qualified meetings set
• $45M in pipeline generated
• 18 deals closed worth $3.2M in ACV
• Client validated mid-market motion and expanded to 30 MarketStar reps in Year 2

Key quote from VP Sales: "MarketStar helped us prove a market segment was worth pursuing — without the risk and overhead of building an internal team from scratch."`,
    tags: ["case_study", "success", "enterprise", "SaaS", "pipeline"],
    keywords: ["case study", "success story", "enterprise SaaS", "pipeline", "SDR", "mid-market", "results", "meetings"]
  },
  {
    id: "cs_partner_channel_story",
    type: "slide",
    category: "customer_success",
    chapter: 0,
    title: "Customer Success Story: Partner Channel Acceleration",
    content: `Client: Global cybersecurity company needing to scale their partner ecosystem

Challenge:
• Had 200+ registered partners but only 30 were actively selling
• No dedicated Partner Account Manager (PAM) team — AEs were "managing" partners as a side task
• Partner-sourced revenue was 8% of total (target: 30%)
• Losing partner mindshare to competitors with dedicated channel teams

MarketStar solution:
• Deployed 8 dedicated PAMs across US, UK, and Australia
• Built partner segmentation model (Platinum / Gold / Silver / Bronze) with differentiated engagement cadences
• Created partner enablement program: product training, deal registration support, co-selling playbooks
• Implemented quarterly partner business reviews and incentive program management

Results at 12 months:
• Active selling partners increased from 30 to 120 (4x improvement)
• Partner-sourced pipeline grew from $15M to $65M annually
• Partner-sourced revenue grew from 8% to 22% of total revenue
• 45 new partners recruited and onboarded
• Partner satisfaction score improved from 6.2 to 8.5/10

Key quote from VP Partnerships: "We went from having a partner program on paper to having a world-class channel operation. MarketStar's PAM team completely transformed our ecosystem."`,
    tags: ["case_study", "success", "partner", "channel", "PAM"],
    keywords: ["case study", "success story", "partner channel", "PAM", "ecosystem", "reseller", "channel program"]
  },
  {
    id: "cs_customer_success_story",
    type: "slide",
    category: "customer_success",
    chapter: 0,
    title: "Customer Success Story: Customer Success & Retention",
    content: `Client: B2B SaaS company (cloud infrastructure) with growing churn problem

Challenge:
• Net Revenue Retention (NRR) had dropped from 115% to 98% over 18 months
• Customer Success team was reactive — only engaging when renewal was 30 days away
• No systematic health scoring or early warning system
• Expansion revenue stalled because CSMs were firefighting, not proactively selling

MarketStar solution:
• Deployed 12 dedicated CSMs in a pooled, mid-touch model (1:40 ratio)
• Built customer health scoring model using product usage, support tickets, and engagement signals
• Implemented proactive outreach cadence: 30-60-90 day onboarding, quarterly business reviews, renewal touchpoints starting at 120 days out
• Created expansion playbook for identifying and executing cross-sell/upsell opportunities

Results at 9 months:
• NRR improved from 98% to 118%
• Gross churn reduced by 40% (from 12% to 7% annually)
• Expansion revenue increased 65%
• Average time-to-value for new customers compressed from 90 days to 35 days
• 15 at-risk accounts saved worth $2.8M in ARR

Key quote from VP Customer Success: "MarketStar didn't just give us more CSM coverage — they gave us a system. Health scoring, proactive engagement, expansion playbooks. Our retention is the best it's been in three years."`,
    tags: ["case_study", "success", "customer_success", "retention", "NRR", "churn"],
    keywords: ["case study", "success story", "customer success", "retention", "NRR", "churn", "renewal", "expansion"]
  },
  {
    id: "cs_global_expansion_story",
    type: "slide",
    category: "customer_success",
    chapter: 0,
    title: "Customer Success Story: Global Market Expansion",
    content: `Client: US-based SaaS company expanding into European market for the first time

Challenge:
• No European presence — no office, no reps, no brand recognition in EMEA
• Needed to test European demand before committing to building a local team
• Required multi-language capabilities (English, French, German, Spanish, Italian)
• GDPR compliance critical for data handling

MarketStar solution:
• Deployed 6 SDRs from Ireland (English-speaking markets) and 4 from Bulgaria (multilingual European markets)
• Built EMEA-specific ICP, messaging, and prospecting cadences adapted for European buying norms
• Provided GDPR-compliant data handling and prospect engagement practices
• RevOps team configured Salesforce for EMEA territory management and pipeline tracking

Results at 12 months:
• 1,800+ qualified meetings set across 12 European countries
• $28M in EMEA pipeline generated
• First 8 European deals closed worth $1.5M ACV
• Client established permanent European office based on proven demand
• 4 MarketStar reps transitioned to client's internal European team

Key quote from CEO: "MarketStar gave us a beachhead in Europe without the risk of opening an office and hiring a team in a market we didn't fully understand yet. We went from zero to $1.5M in European ARR in one year."`,
    tags: ["case_study", "success", "global", "EMEA", "expansion", "international"],
    keywords: ["case study", "success story", "global expansion", "EMEA", "Europe", "international", "multilingual", "market entry"]
  },
  {
    id: "cs_nytro_impact",
    type: "slide",
    category: "customer_success",
    chapter: 0,
    title: "Customer Success Story: Nytro.ai Impact on Sales Performance",
    content: `Client: Cloud security company struggling with rep ramp time and inconsistent messaging quality

Challenge:
• Average ramp time for new SDRs: 8 months
• Call quality was inconsistent — top performers were 3x more productive than bottom performers
• Manual QA process only reviewed 5% of calls
• No objective way to measure readiness before reps engaged with prospects

MarketStar + Nytro.ai solution:
• Deployed 10 SDRs with Nytro.ai-powered onboarding and certification
• Reps practiced against AI-simulated buyer personas during training (no live prospects at risk)
• AI scored every practice pitch on: value prop clarity, objection handling, talk-to-listen ratio, technical accuracy
• Reps required to achieve 80%+ Nytro.ai score before going live
• Post-launch: AI continued scoring pitch recordings submitted by reps, identifying coaching opportunities systematically

Results:
• Ramp time reduced from 8 months to 3.5 months (56% faster)
• Average Nytro.ai quality score improved from 62% to 87% across the team within 90 days
• Bottom-performing reps improved to within 20% of top performers (vs 3x gap before)
• Meeting quality (meetings that converted to Stage 2) improved from 35% to 58%
• Manager coaching time reduced 40% because AI pre-identified specific development areas

Key quote from Enablement Director: "Nytro.ai didn't just speed up onboarding — it equalized our team. We went from having a few stars and a lot of average reps to having a consistently high-performing team."`,
    tags: ["case_study", "success", "nytro", "ai", "onboarding", "ramp", "quality"],
    keywords: ["case study", "success story", "Nytro.ai", "AI", "ramp time", "onboarding", "pitch quality", "coaching", "certification"]
  },
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
