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
  // ============ CHAPTER 0: PRODUCT KNOWLEDGE ============

  {
    id: "p_platform_overview",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 1,
    title: "Monetate Platform Overview",
    content: `Monetate is an enterprise-grade experience optimization platform purpose-built for e-commerce and retail brands.

Core capabilities:
• 1:1 Personalization — deliver individualized experiences across web, mobile, email, and app
• A/B Testing & Experimentation — run rigorous tests with statistical confidence
• AI-Powered Product Recommendations — the MONET engine (Machine Optimization Network for E-commerce Technology) drives real-time, ML-based recommendations
• Audience Discovery & Segmentation — identify high-value segments automatically
• Real-Time Decisioning — make millions of personalization decisions per second
• Analytics & Reporting — unified dashboard for revenue attribution and experience performance

Monetate processes billions of data points daily for the world's leading retail brands, driving measurable lifts in conversion rate, average order value (AOV), and revenue per visitor (RPV).`,
    tags: ["overview", "platform", "monetate", "capabilities"],
    keywords: ["monetate", "platform", "overview", "personalization", "testing", "recommendations", "analytics", "e-commerce"]
  },
  {
    id: "p_personalization_engine",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 2,
    title: "Intelligent Personalization Engine",
    content: `Monetate's personalization engine enables true 1:1 experiences at scale.

Key features:
• Dynamic Content — swap hero banners, CTAs, promotions, and navigation based on visitor context
• Audience Targeting — target by behavior, geography, device, referral source, weather, loyalty status, and 150+ attributes
• Behavioral Triggers — respond to cart abandonment, browse patterns, scroll depth, and exit intent in real time
• Individualized Experiences — move beyond segments to true 1:1 personalization using ML models
• Omnichannel Orchestration — coordinate personalization across web, mobile web, native app, email, and in-store kiosks

How it works:
1. Monetate tag collects visitor signals (clicks, views, cart, purchase history)
2. Decision engine evaluates rules + ML models in <50ms
3. Personalized experience renders seamlessly — no page flicker, no latency
4. Results feed back into the learning loop for continuous optimization

Typical results: 8-15% lift in conversion rate within the first 90 days.`,
    tags: ["personalization", "engine", "1:1", "dynamic_content", "targeting"],
    keywords: ["personalization", "1:1", "dynamic content", "targeting", "behavioral", "triggers", "omnichannel", "individualized"]
  },
  {
    id: "p_ab_testing",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 3,
    title: "A/B Testing & Experimentation",
    content: `Monetate provides enterprise-grade experimentation capabilities for data-driven decision making.

Testing types:
• A/B Testing — compare two or more variants with statistical rigor
• Multivariate Testing (MVT) — test multiple elements simultaneously to find optimal combinations
• Feature Flags — safely roll out new features with percentage-based traffic allocation
• Server-Side Testing — test backend logic, pricing, and API responses without client-side dependencies
• Redirect Tests — test entirely different page layouts or flows

Key differentiators:
• Bayesian & Frequentist statistical engines — choose the right approach for your test
• Auto-allocation (Multi-Armed Bandit) — automatically shift traffic to winning variants
• Mutual exclusion groups — run multiple tests without interference
• Segment-level results — see how different audiences respond to each variant
• Revenue attribution — tie test results directly to dollars, not just clicks

Best practice: Run tests for a minimum of 2 full business cycles (typically 2 weeks) before declaring a winner.`,
    tags: ["testing", "experimentation", "ab_test", "mvt", "feature_flags"],
    keywords: ["a/b testing", "experimentation", "multivariate", "feature flags", "server-side", "statistical", "optimization"]
  },
  {
    id: "p_monet_engine",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 4,
    title: "Product Recommendations — MONET Engine",
    content: `MONET (Machine Optimization Network for E-commerce Technology) is Monetate's proprietary AI recommendation engine.

Recommendation strategies:
• Collaborative Filtering — "customers who bought X also bought Y"
• Content-Based — recommend based on product attributes (color, category, price range)
• Trending / Popular — surface items gaining momentum across the site
• Recently Viewed — re-engage shoppers with items they browsed
• Personalized Rankings — reorder category and search results based on individual affinity
• Cart-Based Cross-Sell — intelligent recommendations based on current cart contents
• Post-Purchase — recommend complementary items in order confirmation and email

MONET differentiators:
• Self-learning models that improve with every interaction — no manual rule tuning required
• Handles cold-start problem for new visitors using contextual signals
• Supports catalog sizes from 1,000 to 10M+ SKUs
• Real-time model updates (not batch overnight processing)
• Built-in A/B testing to measure recommendation strategy performance

Typical results: 15-30% of total e-commerce revenue influenced by MONET recommendations.`,
    tags: ["recommendations", "monet", "ai", "machine_learning", "product_discovery"],
    keywords: ["MONET", "recommendations", "product recommendations", "AI", "machine learning", "collaborative filtering", "cross-sell", "upsell"]
  },
  {
    id: "p_audience_segmentation",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 5,
    title: "Audience Discovery & Segmentation",
    content: `Monetate's audience tools help teams move beyond basic demographics to behavior-driven segmentation.

Capabilities:
• Automatic Audience Discovery — ML identifies high-value segments you didn't know existed
• Custom Segment Builder — combine 150+ attributes with AND/OR logic
• Predictive Segments — target visitors likely to convert, churn, or reach a spending threshold
• Lifecycle Segments — new visitor, returning, loyal, lapsed, win-back
• Real-Time Segment Membership — visitors are classified on every page load, not in batch

Segmentation attributes include:
• Behavioral: pages viewed, search queries, cart value, purchase frequency
• Contextual: device, browser, time of day, day of week, weather, location
• CRM/CDP: loyalty tier, lifetime value, last purchase date, email engagement
• Custom: any first-party data passed via tag or API

Use case: A fashion retailer discovered that mobile visitors from Instagram who viewed 3+ products had a 4x higher conversion rate when shown social proof messaging — a segment they never would have manually created.`,
    tags: ["audience", "segmentation", "discovery", "targeting", "predictive"],
    keywords: ["audience", "segmentation", "discovery", "targeting", "predictive", "segments", "behavioral", "lifecycle"]
  },
  {
    id: "p_realtime_decisioning",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 6,
    title: "Real-Time Decisioning",
    content: `Monetate's decisioning engine processes millions of personalization decisions per second with sub-50ms latency.

How it works:
• Every visitor interaction triggers a real-time evaluation against active experiences, tests, and recommendation models
• Decisions consider current session behavior, historical data, and contextual signals simultaneously
• No page flicker — decisions are made and rendered before the visitor sees the page
• Server-side decisioning available for headless and API-first architectures

Key capabilities:
• Priority-based experience resolution — when multiple experiences qualify, the highest-priority one wins
• Frequency capping — control how often a visitor sees a specific experience
• Geo-targeting with IP and GPS precision
• Weather-based triggers — promote relevant products based on local conditions
• Inventory-aware decisioning — suppress recommendations for out-of-stock items
• Dynamic pricing triggers — adjust messaging based on margin or clearance status

Scale: Monetate handles 100B+ decisions annually across its customer base.`,
    tags: ["decisioning", "real-time", "latency", "personalization"],
    keywords: ["real-time", "decisioning", "latency", "speed", "server-side", "priority", "frequency", "geo-targeting"]
  },
  {
    id: "p_analytics",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 7,
    title: "Analytics & Reporting Dashboard",
    content: `Monetate provides a unified analytics dashboard that connects personalization activities directly to revenue outcomes.

Core reports:
• Experience Performance — see conversion lift, revenue impact, and statistical confidence for every experience
• Revenue Attribution — understand how much incremental revenue each personalization drives
• Audience Insights — analyze segment behavior, size, and monetization potential
• Recommendation Performance — track click-through rate, add-to-cart rate, and revenue per recommendation widget
• Funnel Analysis — identify drop-off points and optimize the path to purchase
• Custom Dashboards — build role-specific views for marketing, merchandising, and executive teams

Key metrics tracked:
• Conversion Rate (CR)
• Average Order Value (AOV)
• Revenue Per Visitor (RPV)
• Click-Through Rate (CTR)
• Items Per Order
• Return Visitor Rate

Data export: Integrate with BI tools via API, data feeds, or native connectors to Snowflake, BigQuery, and Looker.`,
    tags: ["analytics", "reporting", "dashboard", "revenue", "attribution"],
    keywords: ["analytics", "reporting", "dashboard", "revenue", "attribution", "conversion", "AOV", "RPV", "metrics"]
  },
  {
    id: "p_integration",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 8,
    title: "Integration Architecture",
    content: `Monetate is designed to integrate seamlessly with modern e-commerce technology stacks.

Integration methods:
• JavaScript Tag — lightweight tag deployed via tag manager (Google Tag Manager, Tealium, Ensighten) or direct placement. Fastest path to deployment.
• REST APIs — server-side integration for headless commerce, native apps, and custom implementations
• SDKs — native iOS and Android SDKs for mobile app personalization
• Edge Delivery — CDN-level integration for fastest possible rendering (Akamai, Cloudflare, Fastly)

Platform connectors:
• Shopify Plus — native app with one-click install
• Salesforce Commerce Cloud (SFCC) — cartridge-based integration
• SAP Commerce (Hybris) — certified extension
• Adobe Commerce (Magento) — module-based integration
• Custom / Headless — full API support for any architecture

Data integrations:
• CDP: Segment, mParticle, Tealium AudienceStream
• Email: Klaviyo, Braze, Salesforce Marketing Cloud
• Analytics: Google Analytics 4, Adobe Analytics
• CRM: Salesforce CRM, HubSpot

Typical deployment: Tag-based implementation takes 2-4 weeks. Full API integration takes 4-8 weeks.`,
    tags: ["integration", "api", "sdk", "tag", "platforms"],
    keywords: ["integration", "API", "SDK", "tag", "Shopify", "Salesforce", "SAP", "Adobe", "headless", "CDP", "implementation"]
  },
  {
    id: "p_implementation_timeline",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 9,
    title: "Implementation Timeline",
    content: `Monetate implementations follow a proven methodology designed to deliver value quickly.

Typical timeline (4-8 weeks):
• Week 1-2: Kickoff, tag deployment, data validation, and QA
• Week 3-4: First experiences live (quick wins — hero banners, social proof, exit intent)
• Week 5-6: Recommendation widgets deployed, audience segments configured
• Week 7-8: Advanced personalization, A/B testing program launched, team training complete

What's included:
• Dedicated Implementation Manager
• Technical Solutions Architect
• Custom onboarding playbook tailored to your tech stack
• Hands-on training for marketing, merchandising, and analytics teams
• Launch readiness review and go-live support

Success factors:
• Tag deployed in the <head> for optimal performance
• Product catalog feed connected (for recommendations)
• Key stakeholders identified and engaged from day one
• 3-5 quick-win experiences prioritized for launch

Post-launch: Transition to Customer Success Manager for ongoing optimization support.`,
    tags: ["implementation", "timeline", "onboarding", "deployment"],
    keywords: ["implementation", "timeline", "deployment", "onboarding", "weeks", "launch", "quick wins", "training"]
  },
  {
    id: "p_security_compliance",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 10,
    title: "Platform Security & Compliance",
    content: `Monetate meets the highest standards of security and data privacy for enterprise customers.

Certifications & compliance:
• SOC 2 Type II certified — annual audit by independent third party
• GDPR compliant — full support for EU data protection requirements
• CCPA compliant — California Consumer Privacy Act ready
• PCI DSS Level 1 — payment card data handling (for relevant integrations)
• ISO 27001 aligned security practices

Data handling:
• All data encrypted in transit (TLS 1.2+) and at rest (AES-256)
• Data residency options: US, EU, APAC
• No PII required for personalization — works with anonymous visitor profiles
• Configurable data retention policies
• Right to erasure (GDPR Article 17) supported via API
• Cookie consent integration with OneTrust, Cookiebot, and custom implementations

Infrastructure:
• 99.99% uptime SLA
• Multi-region redundancy
• SOC-monitored 24/7
• Disaster recovery with <4 hour RTO

Enterprise buyers: Monetate passes InfoSec reviews at Fortune 500 companies regularly. We can provide our SOC 2 report, security questionnaire responses, and architecture diagrams upon request.`,
    tags: ["security", "compliance", "gdpr", "ccpa", "soc2"],
    keywords: ["security", "compliance", "GDPR", "CCPA", "SOC 2", "PCI", "encryption", "privacy", "data", "uptime"]
  },
  {
    id: "p_ecommerce_platforms",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 11,
    title: "Supported E-Commerce Platforms",
    content: `Monetate integrates with all major e-commerce platforms and custom-built storefronts.

Tier 1 (native connectors):
• Shopify Plus — native app, one-click install, automatic product catalog sync
• Salesforce Commerce Cloud (SFCC) — certified cartridge, SFRA compatible
• SAP Commerce (Hybris) — certified extension with full storefront integration
• Adobe Commerce / Magento — native module with Composer installation

Tier 2 (tag + API):
• BigCommerce Enterprise
• commercetools (headless)
• Elastic Path
• Kibo Commerce
• Custom / proprietary platforms

Headless commerce:
• Full REST API support for any headless architecture
• Works with React, Next.js, Vue, Nuxt, Angular storefronts
• Server-side rendering (SSR) compatible via API
• Edge-side integration available for CDN-level personalization

Key message for prospects: "If you have a website, Monetate can personalize it — regardless of your platform."`,
    tags: ["platforms", "ecommerce", "shopify", "salesforce", "sap", "adobe", "headless"],
    keywords: ["Shopify", "Salesforce", "SAP", "Adobe", "Magento", "BigCommerce", "headless", "platforms", "e-commerce", "commercetools"]
  },
  {
    id: "p_mobile_app",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 12,
    title: "Mobile & App Personalization",
    content: `Monetate extends personalization beyond the desktop to mobile web and native apps.

Mobile web:
• Responsive experience delivery — personalization adapts to mobile viewport
• Mobile-specific targeting — device type, OS version, screen size, touch vs click behavior
• Accelerated Mobile Pages (AMP) compatible
• Core Web Vitals optimized — no impact on LCP, FID, or CLS scores

Native app (iOS & Android):
• Native SDKs for iOS (Swift/Obj-C) and Android (Kotlin/Java)
• In-app personalization: content, recommendations, promotions, feature toggles
• Push notification targeting based on in-app behavior
• A/B testing for app UI elements and flows
• Works alongside existing analytics SDKs (Firebase, Amplitude, Mixpanel)

Cross-device:
• Identity resolution across web and app using customer ID or email hash
• Consistent experiences as shoppers move between devices
• Unified reporting across all channels`,
    tags: ["mobile", "app", "ios", "android", "cross-device"],
    keywords: ["mobile", "app", "iOS", "Android", "SDK", "native", "cross-device", "responsive", "push notification"]
  },
  {
    id: "p_email_sms",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 13,
    title: "Email & SMS Personalization",
    content: `Monetate powers personalized content within email and SMS campaigns at the moment of open.

Email personalization:
• Open-Time Content — images and recommendations update dynamically when the email is opened, not when it's sent
• Product Recommendations in Email — personalized product grids based on browse/purchase history
• Dynamic Banners — hero images that change based on recipient's location, weather, or segment
• Countdown Timers — real-time urgency for sales and promotions
• Works with any ESP: Klaviyo, Braze, Salesforce Marketing Cloud, Mailchimp, etc.

SMS personalization:
• Personalized landing pages linked from SMS messages
• Dynamic short links with individualized offers
• Behavior-triggered SMS campaigns (cart abandonment, browse abandonment)

Integration approach:
• Monetate-hosted image URLs embedded in email templates
• No ESP migration required — works alongside your existing email platform
• Recommendations update in real time even for emails sent days ago`,
    tags: ["email", "sms", "personalization", "open-time", "recommendations"],
    keywords: ["email", "SMS", "open-time", "personalization", "recommendations", "Klaviyo", "Braze", "ESP", "dynamic"]
  },
  {
    id: "p_social_proof",
    type: "slide",
    category: "product",
    chapter: 0,
    slideNumber: 14,
    title: "Social Proof & Urgency Messaging",
    content: `Monetate enables real-time social proof and urgency messaging to increase conversion.

Social proof features:
• "X people are viewing this item right now" — live viewer count
• "Y purchased in the last 24 hours" — recent purchase activity
• "Trending in your area" — location-based popularity signals
• Customer ratings and review snippets surfaced dynamically
• "Best seller" and "Staff pick" badges applied automatically based on data

Urgency messaging:
• Low stock alerts — "Only 3 left in your size"
• Countdown timers for sales, promotions, and shipping cutoffs
• Limited-time offer banners triggered by audience segment
• Free shipping threshold messaging — "Add $12 more for free shipping"

Key benefit: Social proof and urgency messaging are driven by real data, not fabricated numbers. This builds trust while creating authentic buying motivation.

Typical results: 5-12% conversion lift on product detail pages with social proof enabled.`,
    tags: ["social_proof", "urgency", "conversion", "messaging"],
    keywords: ["social proof", "urgency", "trending", "stock", "countdown", "shipping", "conversion", "FOMO"]
  },

  // ============ CHAPTER 1: SALES METHODOLOGY ============

  {
    id: "s_discovery_framework",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 1,
    title: "Discovery Call Framework",
    content: `A strong discovery call is the foundation of every Monetate deal. Your goal is to uncover pain, quantify impact, and identify the decision-making process.

Structure (45-60 minutes):
1) Rapport & Context (5 min) — Research their site beforehand. Reference specific observations: "I noticed your homepage shows the same hero banner to every visitor — is that intentional?"
2) Current State (15 min) — Understand their personalization maturity, tech stack, team structure, and current results
3) Pain & Impact (15 min) — Quantify the cost of NOT personalizing. What's their conversion rate? AOV? How much traffic goes un-monetized?
4) Vision & Priorities (10 min) — Where do they want to be in 12 months? What KPIs matter most?
5) Process & Timeline (5 min) — How do they evaluate vendors? Who else needs to be involved? Budget cycle?

Key discovery questions:
• "What percentage of your traffic converts today? What would a 1% improvement mean in revenue?"
• "How are you deciding what content to show different visitors right now?"
• "When a visitor comes back to your site, does the experience change based on their history?"
• "Who on your team would own personalization day-to-day?"
• "What's driving the urgency to solve this now vs. next quarter?"`,
    tags: ["discovery", "sales_process", "questions", "framework"],
    keywords: ["discovery", "call", "framework", "questions", "pain", "impact", "process", "timeline", "qualification"]
  },
  {
    id: "s_meddpicc",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 2,
    title: "MEDDPICC for Monetate",
    content: `Apply MEDDPICC to qualify and advance every Monetate opportunity.

M — Metrics: What KPIs will this impact? (CR, AOV, RPV, revenue per session, time on site, bounce rate)
E — Economic Buyer: Who signs the contract? (typically VP Digital, CMO, or CTO). Have you met them?
D — Decision Criteria: What are they evaluating? (ease of use, speed of implementation, recommendation quality, integrations, support)
D — Decision Process: What's the buying process? (vendor comparison → technical eval → POC → procurement → legal → sign)
P — Paper Process: Who handles procurement? What's their typical contract cycle? MSA required?
I — Identify Pain: What's broken today? (low conversion, poor mobile experience, manual merchandising, losing to competitors who personalize)
C — Champion: Who internally is advocating for Monetate? Can they sell when you're not in the room?
C — Competition: Who else are they evaluating? (Dynamic Yield, Optimizely, Adobe Target, in-house, doing nothing)

Red flags:
• No identified economic buyer by Stage 2
• Champion can't articulate why Monetate over alternatives
• "We're just exploring" with no timeline or budget
• Single-threaded to one contact`,
    tags: ["meddpicc", "qualification", "methodology", "sales_process"],
    keywords: ["MEDDPICC", "metrics", "economic buyer", "decision", "champion", "competition", "qualification", "pain"]
  },
  {
    id: "s_stakeholder_mapping",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 3,
    title: "Stakeholder Mapping",
    content: `Enterprise Monetate deals typically involve 5-8 stakeholders. Map them early.

Common stakeholders:
• CMO / VP Marketing — owns revenue goals, brand experience, cares about speed and results
• VP E-Commerce / Digital — day-to-day owner, evaluates UX impact and team capacity
• CTO / VP Engineering — evaluates technical architecture, security, performance impact
• Director of Analytics — wants measurement rigor, data integration, attribution clarity
• Merchandising Lead — cares about product recommendations, category page optimization
• IT / InfoSec — security review, data privacy, compliance
• Procurement — commercial terms, contract negotiation
• CFO / Finance — ROI justification, budget allocation

Stakeholder engagement tactics:
• Tailor your message to each persona's priorities (CMO = revenue; CTO = architecture; CFO = ROI)
• Provide persona-specific collateral (technical architecture doc for CTO, business case for CFO)
• Request introductions through your champion
• Host role-specific sessions (technical deep dive, business case review, security review)

Goal: No stakeholder should hear about Monetate for the first time during the final decision meeting.`,
    tags: ["stakeholders", "mapping", "personas", "enterprise"],
    keywords: ["stakeholder", "mapping", "CMO", "CTO", "VP", "procurement", "champion", "personas", "enterprise", "multi-threading"]
  },
  {
    id: "s_champion_building",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 4,
    title: "Building a Champion",
    content: `Your champion is the internal advocate who sells Monetate when you're not in the room.

What makes a strong champion:
• Has authority or strong influence in the decision process
• Personally benefits from Monetate's success (career advancement, team efficiency, hitting KPIs)
• Willing to share internal information (org chart, budget, competitive dynamics, decision timeline)
• Can and will advocate on your behalf in internal meetings
• Has access to the economic buyer

How to build a champion:
1) Make them look smart — provide insights about their industry and competitors
2) Arm them with ammo — create internal-facing materials they can share (one-pagers, ROI models, competitive comparisons)
3) Coach them on internal selling — "When your CTO asks about security, here's what to say..."
4) Give them early wins — help them show quick results to build internal credibility
5) Protect them — never share confidential information they've given you

Champion test questions:
• "If I'm not in the room for the final decision, what would you say?"
• "What concerns do you think your CTO will raise?"
• "Can you walk me through what the next internal meeting looks like?"`,
    tags: ["champion", "internal_advocate", "selling", "influence"],
    keywords: ["champion", "advocate", "influence", "internal", "selling", "coach", "arm", "ammo"]
  },
  {
    id: "s_multi_threading",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 5,
    title: "Multi-Threading Strategy",
    content: `Single-threaded deals die. Multi-threaded deals close.

Why multi-thread:
• Champions change roles, go on leave, or lose influence
• Different stakeholders have different objections — address them directly
• Broader engagement signals organizational commitment
• Reduces risk of last-minute blockers from unknown stakeholders

Multi-threading tactics:
• Ask your champion: "Who else would benefit from seeing this? Can we set up a session?"
• Host a discovery workshop with cross-functional attendees
• Send personalized follow-ups to each stakeholder after group meetings
• Create role-specific demo tracks (marketer view, developer view, analyst view)
• Leverage Monetate's solution engineers for technical stakeholder engagement
• Use LinkedIn to identify and connect with adjacent stakeholders

Tracking:
• Maintain a stakeholder map in your CRM with engagement status
• Target minimum 3 engaged contacts across 2+ departments
• Flag single-threaded deals in pipeline review — develop a plan to expand

Red flag: If you've only spoken to one person after 3+ meetings, the deal is at risk.`,
    tags: ["multi-threading", "stakeholders", "risk", "engagement"],
    keywords: ["multi-threading", "stakeholders", "contacts", "engagement", "risk", "single-threaded", "champion"]
  },
  {
    id: "s_demo_that_converts",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 6,
    title: "Running a Demo That Converts",
    content: `A great Monetate demo shows the prospect THEIR opportunity, not our features.

Pre-demo preparation:
• Browse their website and take screenshots of personalization gaps
• Note: generic homepage, same experience for new vs returning visitors, no social proof, basic product recommendations
• Prepare a "before and after" narrative using their actual site
• Identify 3 quick wins specific to their business

Demo structure (45 min):
1) Recap discovery pain points (5 min) — "Last time you mentioned X was costing you Y"
2) Show their site's current gaps (5 min) — screen share their actual website
3) Live demo of Monetate solving those gaps (20 min) — personalization, recommendations, testing
4) Customer proof points (5 min) — case studies from their industry/vertical
5) Implementation & timeline (5 min) — "Here's how we'd get you live in 6 weeks"
6) Next steps (5 min) — POC, technical review, or business case

Demo rules:
• NEVER demo for more than 20 minutes without asking a question
• Always tie features back to their specific pain
• Show, don't tell — use live examples over slides
• End with a clear next step, not "any questions?"`,
    tags: ["demo", "presentation", "selling", "conversion"],
    keywords: ["demo", "presentation", "convert", "before and after", "quick wins", "live", "preparation"]
  },
  {
    id: "s_poc_best_practices",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 7,
    title: "Proof of Concept (POC) Best Practices",
    content: `A POC should prove value, not provide free consulting. Set it up for success.

POC structure:
• Duration: 30-45 days (avoid open-ended timelines)
• Scope: 2-3 specific use cases tied to measurable KPIs
• Success criteria: Agreed upon BEFORE the POC starts (e.g., "5% lift in conversion on PDPs")
• Traffic allocation: Minimum 50% of traffic to test for statistical significance
• Executive sponsor: Named on both sides

POC checklist:
1) Mutual success plan document signed by both parties
2) Tag deployed and validated within first week
3) First experience live within 10 days
4) Weekly check-in calls with stakeholders
5) Mid-point review at day 15
6) Final results presentation to economic buyer

Negotiation tips:
• If they ask for a free POC, counter with: "We invest significant resources — let's agree on what success looks like so we both have skin in the game."
• Paid POCs convert at 85%+; free POCs convert at <40%
• If free POC is required, limit scope and duration strictly

After POC: Present results in a business case format showing annualized revenue impact, not just test metrics.`,
    tags: ["poc", "proof_of_concept", "trial", "evaluation"],
    keywords: ["POC", "proof of concept", "trial", "evaluation", "success criteria", "timeline", "paid", "free"]
  },
  {
    id: "s_business_case",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 8,
    title: "Business Case Development",
    content: `A compelling business case is often the difference between a deal that closes and one that stalls.

Business case components:
1) Current State — baseline conversion rate, AOV, revenue, and traffic volume
2) Problem Quantification — "You're leaving $X million on the table annually by showing every visitor the same experience"
3) Monetate Impact — projected lift based on industry benchmarks and/or POC results
4) Investment — Monetate platform cost, implementation services, team time
5) ROI Calculation — projected incremental revenue vs. total cost (target 5-10x ROI in Year 1)
6) Risk of Inaction — competitive pressure, rising CAC, declining conversion rates
7) Timeline to Value — "First results in 4-6 weeks, full optimization in 90 days"

ROI formula:
Incremental Revenue = (Monthly Sessions × Conversion Rate Lift × AOV)
Annual ROI = (Incremental Revenue × 12) / Annual Monetate Investment

Example: 5M monthly sessions × 0.5% CR lift × $85 AOV = $212,500/month = $2.55M/year
At $300K annual investment = 8.5x ROI

Pro tip: Always build the business case WITH your champion so they can present it internally.`,
    tags: ["business_case", "roi", "value", "investment"],
    keywords: ["business case", "ROI", "value", "investment", "revenue", "cost", "incremental", "return"]
  },
  {
    id: "s_roi_calculator",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 9,
    title: "ROI Calculator Usage",
    content: `The Monetate ROI Calculator is your most powerful tool for demonstrating financial impact.

Inputs required:
• Monthly unique visitors / sessions
• Current conversion rate
• Average order value (AOV)
• Current personalization maturity (none, basic, intermediate)
• Industry vertical

Outputs generated:
• Conservative, moderate, and aggressive revenue lift projections
• Monthly and annual incremental revenue
• Payback period (typically 2-4 months)
• 3-year total value projection

How to use effectively:
1) Run the calculator DURING discovery — "Let's plug in your numbers right now"
2) Let the prospect input their own data — builds ownership and trust
3) Start with conservative estimates — under-promise, over-deliver
4) Compare to the cost of doing nothing — "Every month you wait costs you approximately $X"
5) Save and share the output as a PDF for internal circulation

When prospects push back on projections:
• "These are based on actual results from 300+ e-commerce brands in our portfolio"
• "We can validate these projections with a 30-day POC on your actual traffic"
• "The conservative estimate alone pays for the platform 3x over"`,
    tags: ["roi", "calculator", "financial", "justification"],
    keywords: ["ROI", "calculator", "revenue", "projections", "payback", "financial", "impact", "conservative"]
  },
  {
    id: "s_qualifying_icp",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 10,
    title: "Qualifying Opportunities — ICP Fit",
    content: `Focus your time on accounts that match Monetate's Ideal Customer Profile (ICP).

ICP characteristics:
• Industry: E-commerce, retail, fashion, electronics, grocery, travel, financial services
• Revenue: $50M+ annual e-commerce revenue (sweet spot: $200M-$2B)
• Traffic: 1M+ monthly sessions (personalization impact scales with traffic)
• Team: Has or is building a digital marketing / e-commerce optimization team
• Tech stack: Modern e-commerce platform (Shopify Plus, SFCC, SAP, Adobe, headless)
• Budget: $150K-$500K+ annual software budget for optimization tools
• Pain: Experiencing flat or declining conversion rates, losing ground to competitors who personalize

Disqualification signals:
• <500K monthly sessions (ROI is harder to demonstrate)
• No e-commerce revenue (B2B lead gen only)
• No dedicated digital team (will struggle to operationalize)
• Active contract with competitor expiring in 18+ months
• "Just researching" with no budget or timeline

Scoring: Use a 1-5 scale on each ICP dimension. Accounts scoring 20+ are high priority.`,
    tags: ["icp", "qualification", "targeting", "fit"],
    keywords: ["ICP", "ideal customer profile", "qualification", "fit", "traffic", "revenue", "industry", "disqualify"]
  },
  {
    id: "s_cold_outreach",
    type: "script",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 11,
    title: "Cold Outreach Templates",
    content: `Effective cold outreach for Monetate focuses on the prospect's missed opportunity, not our features.

Email template — "The Gap" approach:
Subject: Quick observation about [Company] website

"Hi [Name],

I was browsing [Company].com and noticed something — your homepage shows the same experience to every visitor regardless of whether they're new, returning, or a loyal customer.

Brands like [similar company in their vertical] are using Monetate to personalize that experience and seeing 10-15% lifts in conversion as a result.

Would a 15-minute call to explore if this applies to you be worth it?

[Your name]"

LinkedIn approach:
"[Name], I noticed [Company] recently [launched new product line / redesigned site / expanded to new market]. Curious — are you personalizing the shopping experience for different customer segments, or is that on the roadmap? Happy to share what brands like [peer company] are doing."

Call opener:
"Hi [Name], this is [you] from Monetate. I work with e-commerce teams at brands like [customer name] helping them increase conversion through personalization. I had a quick observation about your site — do you have 90 seconds?"

Key principles: Personalize every outreach. Reference their actual website. Lead with insight, not product.`,
    tags: ["outreach", "cold", "email", "linkedin", "prospecting"],
    keywords: ["cold", "outreach", "email", "template", "LinkedIn", "prospecting", "opener", "approach"]
  },
  {
    id: "s_follow_up",
    type: "tip",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 12,
    title: "Meeting Follow-Up Best Practices",
    content: `The follow-up is where deals are won or lost. Execute consistently.

Within 2 hours of every meeting:
• Send a summary email with: key takeaways, agreed next steps, owners, and timeline
• Include any resources discussed (case studies, technical docs, ROI model)
• Confirm the next meeting date/time

Follow-up structure:
1) "Thank you for your time today. Here's what I heard..."
2) Restate their pain in their words (shows you listened)
3) Map Monetate capabilities to each pain point
4) Clear next step with a date: "I'll send the security questionnaire by Thursday and schedule a technical deep dive for the week of [date]"

Multi-stakeholder follow-up:
• Send personalized notes to each attendee referencing their specific questions
• Copy your champion on everything so they can track momentum
• Flag any risks or concerns to your champion privately

Follow-up cadence for unresponsive prospects:
• Day 1: Summary email
• Day 3: "Wanted to make sure you received the materials"
• Day 7: Share relevant industry insight or case study
• Day 14: "Checking in — has anything changed on your end?"
• Day 21: Break-up email — "It seems the timing may not be right..."`,
    tags: ["follow-up", "meetings", "communication", "cadence"],
    keywords: ["follow-up", "meeting", "email", "summary", "next steps", "cadence", "communication"]
  },
  {
    id: "s_competitive_positioning",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 13,
    title: "Competitive Positioning Strategy",
    content: `Position Monetate on strengths. Never lead by attacking competitors.

Positioning framework:
1) Acknowledge — "They're a solid company. Here's where we differ..."
2) Differentiate — focus on Monetate's unique strengths for THIS prospect
3) Prove — back it up with customer evidence and data

Monetate's unique positioning pillars:
• E-Commerce DNA — built for retail/e-commerce from day one, not retrofitted
• MONET AI Engine — proprietary recommendation technology that improves automatically
• Speed to Value — 4-8 week implementation vs. 3-6 months for competitors
• Marketer Empowerment — no-code experience builder means marketing teams don't need developers
• Proven Scale — billions of decisions daily across enterprise brands
• Customer Success Model — dedicated CSM + solutions architect, not just a help desk

When to play offense vs. defense:
• Offense: When we're first in the deal — set the evaluation criteria early
• Defense: When they're evaluating competitors — focus on differentiation and switching costs
• Displacement: When they have an incumbent — emphasize gaps in their current solution`,
    tags: ["competitive", "positioning", "strategy", "differentiation"],
    keywords: ["competitive", "positioning", "differentiation", "strategy", "strengths", "pillars", "offense", "defense"]
  },
  {
    id: "s_technical_evaluation",
    type: "slide",
    category: "sales_methodology",
    chapter: 1,
    slideNumber: 14,
    title: "Handling Technical Evaluations",
    content: `Technical evaluations are common in enterprise deals. Prepare thoroughly and involve your SE team early.

Common technical evaluation areas:
• Performance impact — page load time, Core Web Vitals, tag weight
• Data architecture — how data flows in/out, privacy controls, retention
• Security — SOC 2 report, encryption, pen test results, access controls
• Integration depth — API capabilities, webhook support, data connectors
• Scalability — traffic handling during peak (Black Friday, flash sales)
• Customization — how flexible is the platform for unique use cases

How to succeed:
1) Involve a Solutions Engineer from the first technical conversation
2) Proactively share the SOC 2 report and security questionnaire
3) Offer a technical sandbox for hands-on evaluation
4) Provide API documentation and sample code
5) Reference architectures for their specific platform (Shopify, SFCC, etc.)
6) Schedule a dedicated architecture review session

Key proof points:
• "Monetate handles 100B+ decisions annually with sub-50ms latency"
• "Our tag adds <50KB to page weight — less than a single product image"
• "We've passed InfoSec reviews at [major brand names] in their industry"

Never over-promise on technical capabilities. If we can't do something, say so and explain the workaround.`,
    tags: ["technical", "evaluation", "security", "architecture", "se"],
    keywords: ["technical", "evaluation", "security", "architecture", "performance", "API", "scalability", "SE", "solutions engineer"]
  },

  // ============ CHAPTER 2: OBJECTION HANDLING ============

  {
    id: "obj_have_competitor",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'We already have Optimizely / Dynamic Yield'",
    content: `This is one of the most common objections. The key is to NOT attack the competitor — instead, explore gaps.

Framework: Acknowledge → Explore → Differentiate

Step 1: Acknowledge their investment
Step 2: Ask about satisfaction and gaps
Step 3: Position Monetate's unique strengths for their specific gaps`,
    tags: ["objection", "competitor", "optimizely", "dynamic_yield", "displacement"],
    keywords: ["already have", "Optimizely", "Dynamic Yield", "competitor", "existing", "vendor", "switch"],
    roleplayId: "OBJ1",
    winningResponse: "That's great — it means you already see the value of personalization. I'm curious: how are you finding the recommendation engine? A lot of brands we talk to who use [competitor] say the recommendations require a ton of manual rules. With our MONET engine, the AI handles that automatically. Would it be worth a 15-minute comparison to see if there are gaps you could be filling?",
    losingResponse: "Oh, Optimizely? Yeah, we're way better than them. They're not really built for e-commerce."
  },
  {
    id: "obj_too_expensive",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'It's too expensive'",
    content: `Price objections are rarely about the number — they're about perceived value. Reframe the conversation around ROI.

Framework: Validate → Reframe → Quantify

Step 1: Validate their concern about budget responsibility
Step 2: Reframe from cost to investment with measurable return
Step 3: Quantify the cost of inaction`,
    tags: ["objection", "price", "expensive", "budget", "cost"],
    keywords: ["expensive", "too much", "cost", "budget", "price", "afford", "cheaper"],
    roleplayId: "OBJ2",
    winningResponse: "I appreciate you being upfront about that. Let me ask — if Monetate could generate $2.5M in incremental revenue this year based on your traffic, would a $300K investment feel expensive? Let me show you the math with your actual numbers. And honestly, the bigger cost might be doing nothing — every month without personalization, you're leaving revenue on the table that your competitors are capturing.",
    losingResponse: "I can probably get you a discount. Let me talk to my manager about pricing."
  },
  {
    id: "obj_built_inhouse",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'We built something in-house'",
    content: `In-house solutions are common at large enterprises. The key is to highlight the hidden costs and limitations without dismissing their team's work.

Framework: Respect → Expose Hidden Costs → Position Partnership

Step 1: Respect their engineering investment
Step 2: Explore what's working and what's not
Step 3: Position Monetate as extending their capabilities, not replacing their team`,
    tags: ["objection", "inhouse", "build", "custom", "engineering"],
    keywords: ["built", "in-house", "custom", "homegrown", "internal", "engineering", "build vs buy"],
    roleplayId: "OBJ3",
    winningResponse: "That's impressive — it shows your team really understands the importance of personalization. Out of curiosity, how many engineers maintain it? And how quickly can your marketing team launch a new experience without filing a dev ticket? What we hear from brands who've built internally is that the maintenance burden grows every year, and the marketing team ends up waiting in the dev queue. Monetate doesn't replace your engineering work — it actually frees your dev team to focus on core product while marketers run personalization independently.",
    losingResponse: "In-house solutions never work as well as purpose-built platforms. You should really switch."
  },
  {
    id: "obj_think_about_it",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'We need to think about it'",
    content: `"We need to think about it" usually means there's an unspoken concern. Your job is to surface it.

Framework: Agree → Isolate → Resolve

Step 1: Agree that it's a big decision
Step 2: Ask what specifically they need to think about
Step 3: Offer to address those specific concerns`,
    tags: ["objection", "stall", "think", "delay", "timing"],
    keywords: ["think about it", "need to think", "consider", "get back to you", "stall", "delay"],
    roleplayId: "OBJ4",
    winningResponse: "Absolutely — this is a significant decision and I want you to feel confident. Can I ask: is it more about the technical fit, the budget, or getting alignment from other stakeholders? If I knew what's weighing on you most, I could probably get you the right information to make that decision easier.",
    losingResponse: "Sure, take your time. Just let me know when you're ready."
  },
  {
    id: "obj_no_bandwidth",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'Our team doesn't have bandwidth'",
    content: `Bandwidth concerns are legitimate in lean e-commerce teams. Address by demonstrating how Monetate reduces workload, not adds to it.

Framework: Empathize → Reframe → Support Model

Step 1: Empathize with resource constraints
Step 2: Reframe Monetate as a bandwidth multiplier
Step 3: Highlight the implementation support and managed services`,
    tags: ["objection", "bandwidth", "resources", "team", "capacity"],
    keywords: ["bandwidth", "resources", "team", "capacity", "busy", "staff", "headcount", "no time"],
    roleplayId: "OBJ5",
    winningResponse: "I hear that a lot, and it's actually one of the main reasons brands choose Monetate. Right now, how much time does your team spend manually updating content, running reports, or managing product placement? Monetate automates most of that. Plus, our implementation team does the heavy lifting for the first 8 weeks, and your CSM provides ongoing hands-on support. Most clients tell us Monetate gives them time BACK rather than adding work.",
    losingResponse: "It's really not that much work. Just a quick tag implementation and you're good to go."
  },
  {
    id: "obj_in_contract",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'We're in a contract with another vendor'",
    content: `Being in a contract doesn't mean the deal is dead — it means you need to plan for the transition.

Framework: Acknowledge → Timeline → Value of Planning

Step 1: Acknowledge the existing commitment
Step 2: Determine when the contract expires
Step 3: Position starting the evaluation now as smart planning`,
    tags: ["objection", "contract", "vendor", "locked", "commitment"],
    keywords: ["contract", "locked in", "vendor", "committed", "renewal", "expiration"],
    roleplayId: "OBJ6",
    winningResponse: "Totally understand — I wouldn't expect you to break a contract. When does it come up for renewal? The reason I ask is that most evaluation and procurement processes take 2-3 months. If we start the conversation now, you'd be in a position to make a fully informed decision before your renewal date. Would it make sense to do a side-by-side comparison so you have options when that time comes?",
    losingResponse: "Most contracts have termination clauses. Want me to look into that for you?"
  },
  {
    id: "obj_show_roi",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'Show me the ROI first'",
    content: `Prospects who ask for ROI proof are actually buying signals — they want to be convinced. Give them the data.

Framework: Align → Model → Prove

Step 1: Align on which metrics matter to them
Step 2: Build an ROI model using their actual data
Step 3: Offer proof through case studies and/or POC`,
    tags: ["objection", "roi", "proof", "data", "evidence"],
    keywords: ["ROI", "prove it", "show me", "evidence", "data", "results", "proof", "numbers"],
    roleplayId: "OBJ7",
    winningResponse: "I love that question — let's build the case with your numbers. If you share your monthly sessions, conversion rate, and AOV, I can show you a conservative projection in 5 minutes. And if you want to validate it further, we can run a 30-day POC on your actual traffic. Brands in your space typically see 8-15% conversion lift, which at your traffic volume would translate to about $X per month in incremental revenue.",
    losingResponse: "We have lots of case studies on our website. I can send you a few links."
  },
  {
    id: "obj_privacy_compliance",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'We have privacy/compliance concerns'",
    content: `Privacy and compliance are legitimate enterprise concerns. Address them directly and confidently.

Framework: Validate → Educate → Evidence

Step 1: Validate that privacy is a critical priority
Step 2: Explain how Monetate handles data privacy by design
Step 3: Provide evidence (certifications, architecture, customer references)`,
    tags: ["objection", "privacy", "compliance", "gdpr", "security"],
    keywords: ["privacy", "compliance", "GDPR", "CCPA", "data", "security", "cookies", "consent"],
    roleplayId: "OBJ8",
    winningResponse: "Privacy should absolutely be a top concern — and it's one of our strongest areas. Monetate is SOC 2 Type II certified, GDPR and CCPA compliant, and we don't require PII to personalize. We work entirely with anonymous behavioral data. We also integrate with consent management platforms like OneTrust, so personalization only activates based on the visitor's consent preferences. I can share our SOC 2 report and connect you with our security team for a dedicated review. Would that help?",
    losingResponse: "Don't worry about that — we handle all the compliance stuff."
  },
  {
    id: "obj_dev_priority",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'Our dev team won't prioritize this'",
    content: `Dev team bottlenecks are the #1 reason personalization projects stall. Position Monetate as the solution to this exact problem.

Framework: Empathize → Reframe → Low-Dev Path

Step 1: Empathize with the challenge of competing for dev resources
Step 2: Reframe Monetate as reducing dev dependency, not increasing it
Step 3: Show the low-code / no-code implementation path`,
    tags: ["objection", "dev", "engineering", "priority", "resources"],
    keywords: ["dev team", "developers", "engineering", "priority", "backlog", "sprint", "technical resources"],
    roleplayId: "OBJ9",
    winningResponse: "That's exactly why brands use Monetate — to get personalization OUT of the dev backlog. With our visual editor and tag-based deployment, your marketing team can create and launch experiences without writing code. The initial tag deployment needs about 2-4 hours of dev time, and after that, marketers are self-sufficient. Would it help if I showed your dev lead the technical architecture so they can see how lightweight the integration actually is?",
    losingResponse: "It's really easy to implement. Your devs just need to add our tag."
  },
  {
    id: "obj_tried_before",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'We tried personalization before and it didn't work'",
    content: `Failed personalization attempts create skepticism. Your job is to understand what went wrong and show why Monetate would be different.

Framework: Explore → Diagnose → Differentiate

Step 1: Explore what they tried and what happened
Step 2: Diagnose the likely root cause
Step 3: Differentiate Monetate's approach from what failed`,
    tags: ["objection", "tried_before", "failed", "skepticism", "past"],
    keywords: ["tried", "before", "didn't work", "failed", "personalization", "past", "didn't see results"],
    roleplayId: "OBJ10",
    winningResponse: "That's really helpful context. Can you tell me more about what you tried and what the experience was like? Usually when personalization falls short, it's one of three things: the tool was too complex and the team couldn't use it, the implementation was never completed properly, or the approach was rule-based instead of AI-driven so it couldn't scale. Monetate is specifically designed to avoid all three — we have a no-code visual editor, a dedicated implementation team that gets you live in 4-6 weeks, and an AI engine that optimizes automatically. Would you be open to seeing how it's different?",
    losingResponse: "Well, that was probably a different tool. Monetate is way better."
  },
  {
    id: "obj_not_priority",
    type: "roleplay",
    category: "objection_handling",
    chapter: 2,
    title: "Objection: 'Not a priority right now'",
    content: `When personalization isn't a stated priority, your job is to connect it to what IS a priority.

Framework: Accept → Connect → Create Urgency

Step 1: Accept their prioritization
Step 2: Connect personalization to their existing priorities
Step 3: Create urgency through competitive pressure or cost of delay`,
    tags: ["objection", "priority", "timing", "not_now", "urgency"],
    keywords: ["not a priority", "not right now", "busy", "other priorities", "later", "next year", "backburner"],
    roleplayId: "OBJ11",
    winningResponse: "Fair enough. What IS your top priority for e-commerce this year? ... [listen] ... Interesting — because personalization directly impacts [their priority]. For example, if you're focused on increasing AOV, personalized recommendations typically drive 15-30% of total revenue for our clients. And every quarter without it is revenue left on the table. Would it be worth a quick call to see how it connects to what you're already working on?",
    losingResponse: "Okay, I'll follow up next quarter then."
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
    winningResponse: "Happy to send something over. Rather than a generic overview, I'd love to send you something specific to your business. I took a quick look at your site and noticed a few areas where brands like yours typically see quick wins. Can I put together a short personalized assessment? And would 15 minutes next Tuesday work to walk through it together? That way I'm not just adding to your inbox.",
    losingResponse: "Sure! I'll send you our brochure and case studies. Let me know what you think!"
  },

  // PRICING & PACKAGING (Chapter 2)
  {
    id: "pr_pricing_model",
    type: "slide",
    category: "pricing",
    chapter: 2,
    title: "Pricing Model",
    content: `Monetate pricing is based on monthly tracked sessions (MTS) — the number of unique visitor sessions personalized per month.

How it works:
• Session = one visitor's continuous browsing activity (expires after 30 min of inactivity)
• Pricing scales with traffic volume — higher traffic = lower per-session cost
• All features included in the platform — no per-feature charges
• Recommendations, testing, personalization, and analytics all included in the base platform

Typical ranges:
• 1-5M sessions/month: Higher per-session rate
• 5-25M sessions/month: Mid-tier pricing with volume discount
• 25M+ sessions/month: Enterprise custom pricing

Key messaging:
• "You're only paying for sessions we actually personalize"
• "As your business grows, your per-session cost decreases"
• "Compare this to the cost of acquiring those visitors via paid ads — personalization costs a fraction and drives more revenue from existing traffic"

Important: Never quote specific dollar amounts without checking the current pricing sheet. Pricing is updated quarterly.`,
    tags: ["pricing", "model", "sessions", "cost"],
    keywords: ["pricing", "cost", "sessions", "price", "rate", "model", "budget", "investment"]
  },
  {
    id: "pr_package_tiers",
    type: "slide",
    category: "pricing",
    chapter: 2,
    title: "Package Tiers",
    content: `Monetate offers three primary packages designed for different levels of personalization maturity.

Essentials:
• A/B testing and basic personalization
• Visual experience builder (no-code)
• Standard audience segmentation
• Basic analytics and reporting
• Email support
• Best for: Brands starting their personalization journey

Professional:
• Everything in Essentials, plus:
• MONET AI-powered product recommendations
• Advanced audience discovery
• Multivariate testing
• Server-side testing
• Dedicated Customer Success Manager
• Best for: Brands with active optimization programs

Enterprise:
• Everything in Professional, plus:
• 1:1 individualized personalization
• Real-time behavioral decisioning
• Advanced analytics with custom dashboards
• Priority support with named Solutions Architect
• Custom SLA and data residency options
• API access for headless/custom implementations
• Best for: Large-scale brands with sophisticated personalization needs

Note: Most enterprise deals land in Professional or Enterprise tier. Guide based on traffic volume and use case complexity.`,
    tags: ["packages", "tiers", "essentials", "professional", "enterprise"],
    keywords: ["package", "tier", "Essentials", "Professional", "Enterprise", "plan", "features", "included"]
  },
  {
    id: "pr_addons",
    type: "slide",
    category: "pricing",
    chapter: 2,
    title: "Add-On Modules",
    content: `Available add-on modules that can be bundled with any package tier:

• Email Personalization — open-time content, dynamic recommendations in email ($)
• Mobile App SDK — native iOS/Android personalization and testing ($)
• Advanced Recommendations — enhanced MONET models including visual similarity, NLP-based ($$)
• Managed Services — Monetate's optimization team builds and runs experiences on your behalf ($$$)
• Professional Services — custom implementation, migration from competitor, advanced integrations ($$)
• Data Integration Package — CDP/CRM connectors, custom data feeds, warehouse sync ($)
• Extended Analytics — custom reporting, data warehouse export, advanced attribution ($$)

Bundling strategy:
• Email + Web personalization bundle — popular with marketing-led buyers
• Recommendations + Testing bundle — popular with merchandising teams
• Full platform + Managed Services — popular with lean teams who want full-service optimization

Always position add-ons as solving a specific problem the prospect raised in discovery, never as an upsell.`,
    tags: ["addons", "modules", "upsell", "bundling"],
    keywords: ["add-on", "module", "email", "mobile", "managed services", "professional services", "bundle"]
  },
  {
    id: "pr_discount_authority",
    type: "slide",
    category: "pricing",
    chapter: 2,
    title: "Discount Authority & Approval Process",
    content: `Discounting guidelines to protect deal value and maintain pricing integrity.

Rep authority (no approval needed):
• Up to 10% discount on annual contracts
• Free implementation for 2+ year commitments
• Net-30 payment terms

Manager approval required:
• 11-20% discount
• Multi-year payment plans
• Custom SLA terms
• Pilot/POC pricing

VP/CRO approval required:
• 21%+ discount
• Free POC longer than 30 days
• Non-standard contract terms
• Revenue share or performance-based pricing

Discount best practices:
• Never lead with discount — always negotiate value first
• Ask for something in return: longer commitment, case study rights, reference customer agreement, larger scope
• "I can explore better pricing if we can commit to a 2-year term — would that work for your budget cycle?"
• Document the business justification for every discount over 10%

Important: Discounts given set the baseline for renewal. Discount thoughtfully.`,
    tags: ["discount", "approval", "pricing", "negotiation"],
    keywords: ["discount", "approval", "authority", "pricing", "negotiation", "deal", "terms", "concession"]
  },
  {
    id: "pr_contract_terms",
    type: "slide",
    category: "pricing",
    chapter: 2,
    title: "Contract Terms & SLAs",
    content: `Standard contract terms for Monetate agreements.

Contract structure:
• Standard term: 12 months (annual contract)
• Preferred term: 24-36 months (better pricing available)
• Billing: Annual upfront (default), quarterly available, monthly for Enterprise only
• Auto-renewal: 12-month auto-renewal with 60-day cancellation notice
• Payment terms: Net-30 (standard), Net-45/Net-60 available with approval

Standard SLA:
• 99.99% platform uptime guarantee
• <50ms decision engine response time
• 24-hour response time for P1 issues (critical/site down)
• 4-hour response time for P1 with Premium Support
• Dedicated CSM for Professional and Enterprise tiers

Negotiation points to watch:
• Prospects often push for month-to-month — counter with annual pricing advantage
• Data deletion clauses — standard 90-day post-termination deletion
• Liability caps — standard at 12 months of fees paid
• Custom DPA (Data Processing Agreement) for GDPR — available on request
• Procurement teams may require vendor insurance certificates — available from Legal

Tip: Involve your deal desk early for non-standard terms to avoid delays.`,
    tags: ["contract", "terms", "sla", "legal", "procurement"],
    keywords: ["contract", "terms", "SLA", "uptime", "billing", "renewal", "payment", "legal", "procurement"]
  },

  // COMPETITIVE INTELLIGENCE (Chapter 1)
  {
    id: "comp_dynamic_yield",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Intel: vs Dynamic Yield (Mastercard)",
    content: `Dynamic Yield was acquired by Mastercard in 2022. Understand how to position against them.

Their strengths:
• Strong brand recognition (Mastercard backing)
• Broad personalization capabilities
• Good UI/UX for marketers
• Growing data partnership with Mastercard's transaction data

Monetate advantages:
• E-commerce specialization — Monetate was built for retail, DY is generalizing across industries
• MONET recommendation engine — our AI recommendations outperform DY's rule-heavy approach
• Speed to value — our implementation is faster (4-8 weeks vs 8-16 weeks for DY)
• No Mastercard lock-in — DY is increasingly pushing Mastercard's ecosystem; Monetate is platform-neutral
• Customer success — our dedicated CSM + SA model provides deeper support than DY's scaled model
• Pricing transparency — DY's pricing has become less predictable post-acquisition

Displacement talking points:
• "How has the Mastercard acquisition affected your roadmap discussions with DY?"
• "Are you comfortable with your personalization vendor being owned by a payment processor?"
• "Have you noticed any changes in support quality or feature velocity since the acquisition?"

Win rate vs DY: ~55% in head-to-head evaluations.`,
    tags: ["competitive", "dynamic_yield", "mastercard", "displacement"],
    keywords: ["Dynamic Yield", "Mastercard", "DY", "competitor", "comparison", "vs", "displacement"]
  },
  {
    id: "comp_optimizely",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Intel: vs Optimizely",
    content: `Optimizely is primarily an experimentation platform that has expanded into personalization through acquisitions.

Their strengths:
• Strong A/B testing heritage and statistical rigor
• Good developer tools and feature flagging
• Growing CMS and content marketing capabilities
• Established brand in the experimentation space

Monetate advantages:
• Personalization depth — Monetate offers true 1:1 personalization; Optimizely is still primarily segment-based
• Product recommendations — MONET engine far exceeds Optimizely's basic recommendation capabilities
• E-commerce focus — Monetate is purpose-built for retail; Optimizely serves all industries generically
• Marketer empowerment — Monetate's visual editor is more intuitive for non-technical users
• Unified platform — personalization, testing, and recommendations in one platform vs Optimizely's multi-product suite
• Implementation — Monetate's e-commerce connectors provide faster integration

Key differentiator: Optimizely is an experimentation platform trying to add personalization. Monetate is a personalization platform with built-in experimentation. The distinction matters when personalization is the primary goal.

Competitive questions to ask:
• "Are you primarily looking for testing, personalization, or both?"
• "How important are AI-powered product recommendations to your strategy?"
• "Would you prefer one platform that does both, or separate best-of-breed tools?"`,
    tags: ["competitive", "optimizely", "testing", "experimentation"],
    keywords: ["Optimizely", "competitor", "comparison", "vs", "testing", "experimentation", "feature flags"]
  },
  {
    id: "comp_adobe_target",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Intel: vs Adobe Target",
    content: `Adobe Target is part of the Adobe Experience Cloud suite. It's most common in organizations heavily invested in Adobe's ecosystem.

Their strengths:
• Deep integration with Adobe ecosystem (Analytics, AEM, Campaign, CDP)
• Strong enterprise brand and existing relationships
• Automated Personalization (AP) and Auto-Target capabilities
• Global enterprise support infrastructure

Monetate advantages:
• Speed and agility — Monetate deploys in weeks; Adobe Target implementations often take 3-6 months
• Platform independence — works with any tech stack; Adobe Target works best within Adobe ecosystem
• Ease of use — Monetate's visual editor is significantly more intuitive; Adobe Target requires training
• Cost — Adobe Target is part of a larger suite and often requires bundled purchases; Monetate is standalone
• Recommendation quality — MONET outperforms Adobe Sensei in head-to-head tests for e-commerce
• Customer success — dedicated CSM vs Adobe's tiered support model (premium support is extra)

When you encounter Adobe Target:
• Often the prospect is already on Adobe Analytics + AEM — switching cost feels high
• Ask: "Are you getting full value from Adobe Target, or is it primarily used for basic A/B tests?"
• Many Adobe Target customers only use 20-30% of capabilities — Monetate can complement or replace
• Position: "Monetate works alongside Adobe Analytics — you don't have to rip anything out"

Key trigger: If they express frustration with Adobe's complexity or support, Monetate is an easy win.`,
    tags: ["competitive", "adobe", "target", "experience_cloud"],
    keywords: ["Adobe Target", "Adobe", "competitor", "comparison", "vs", "Experience Cloud", "Sensei"]
  },
  {
    id: "comp_bloomreach",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Intel: vs Bloomreach",
    content: `Bloomreach positions as a "Commerce Experience Cloud" combining search, merchandising, content, and personalization.

Their strengths:
• Strong product discovery and search capabilities
• Combined CMS + search + personalization narrative
• Growing CDP functionality
• Good mid-market presence

Monetate advantages:
• Personalization depth — Monetate's 1:1 personalization is more sophisticated than Bloomreach's segment-based approach
• Testing rigor — Monetate offers more advanced experimentation (MVT, server-side, mutual exclusion)
• Recommendation AI — MONET is purpose-built for product recommendations; Bloomreach's recommendations are secondary to search
• Enterprise scale — Monetate handles higher traffic volumes with better performance
• Specialization — Monetate focuses on doing personalization exceptionally well; Bloomreach spreads across search, CMS, and personalization

When competing against Bloomreach:
• Determine if the prospect needs search + personalization or personalization alone
• If search is the primary need, Bloomreach may be a better fit (and that's okay — qualify accordingly)
• If personalization is the primary need, Monetate wins on depth, AI, and testing capabilities
• Position: "Monetate integrates with your existing search solution (including Bloomreach Discovery) while providing best-in-class personalization"

Common scenario: Prospect uses Bloomreach for search but needs deeper personalization → Monetate complements Bloomreach.`,
    tags: ["competitive", "bloomreach", "search", "discovery"],
    keywords: ["Bloomreach", "competitor", "comparison", "vs", "search", "discovery", "commerce experience"]
  },
  {
    id: "comp_inhouse",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Intel: vs In-House Solutions",
    content: `In-house personalization solutions are Monetate's most common competitor, especially at large enterprises.

Common in-house approaches:
• Rule-based content targeting using CMS features
• Custom recommendation engines built on open-source ML frameworks
• A/B testing using Google Optimize (sunset) or open-source tools
• Data science team building models in Python/R

Hidden costs of in-house:
• Engineering time: 2-4 full-time engineers to build and maintain (cost: $400K-$800K/year)
• Opportunity cost: Those engineers could be building product features
• Time to market: Building from scratch takes 6-12 months; Monetate is live in 4-8 weeks
• Scale limitations: In-house solutions often break during traffic spikes (Black Friday)
• Feature gap: No visual editor, limited testing, basic analytics
• Technical debt: Maintenance burden grows every year

Positioning:
• Never dismiss their engineering work — "Your team clearly has strong capabilities"
• Focus on speed, scale, and freeing engineers: "Monetate handles personalization so your dev team can focus on core product"
• ROI comparison: "Is $300K/year for Monetate more or less than the engineering cost to maintain and improve your current solution?"

Build vs Buy decision framework:
• Build when: Personalization is your core product differentiator AND you have unlimited engineering resources
• Buy when: Personalization supports your business but isn't the core product (this is almost always the case)`,
    tags: ["competitive", "inhouse", "build", "buy", "custom"],
    keywords: ["in-house", "build", "custom", "homegrown", "build vs buy", "engineering", "internal"]
  },
  {
    id: "comp_algolia",
    type: "slide",
    category: "competitive",
    chapter: 1,
    title: "Competitive Intel: vs Algolia Recommend",
    content: `Algolia is primarily a search and discovery platform with an add-on recommendation product (Algolia Recommend).

Their strengths:
• Excellent search functionality with typo tolerance and relevance tuning
• Developer-friendly API-first approach
• Fast implementation for search use cases
• Growing product recommendation capabilities

Monetate advantages:
• Recommendation depth — MONET offers far more recommendation strategies (collaborative filtering, content-based, trending, cross-sell, post-purchase) vs Algolia's basic "frequently bought together" and "related products"
• Full personalization — Monetate personalizes the entire experience (content, layout, promotions, navigation), not just recommendations
• A/B testing — Monetate includes enterprise-grade testing; Algolia has limited testing for recommendations
• Audience segmentation — Monetate's audience engine is significantly more advanced
• No-code tools — Monetate's visual editor enables marketers; Algolia Recommend requires developer implementation
• Analytics — Monetate provides revenue attribution and business intelligence; Algolia focuses on search analytics

Positioning:
• Algolia is a search tool with recommendations added on. Monetate is a personalization platform with recommendations built in.
• "Monetate works alongside Algolia Search — use Algolia for search, Monetate for everything else"
• If search is not in scope, Algolia is not a real competitor

Common scenario: Prospect already uses Algolia for search, evaluating recommendation solutions → Monetate complements their Algolia investment.`,
    tags: ["competitive", "algolia", "search", "recommendations"],
    keywords: ["Algolia", "Recommend", "competitor", "comparison", "vs", "search", "recommendations"]
  },

  // ============ CUSTOMER SUCCESS & CASE STUDIES (Chapter 0) ============

  {
    id: "cs_implementation_stories",
    type: "slide",
    category: "customer_success",
    chapter: 0,
    title: "Implementation Success Stories",
    content: `Reference these success patterns when prospects ask about implementation experience.

Fashion retailer (mid-market):
• Challenge: Generic homepage, manual merchandising, 2.1% conversion rate
• Implementation: 5 weeks from contract to first experience live
• Results at 90 days: 12% lift in conversion rate, 8% increase in AOV, 22% increase in RPV
• Key wins: Personalized homepage hero, AI-powered "Complete the Look" recommendations, exit intent offers

Electronics brand (enterprise):
• Challenge: High traffic but low engagement, wanted to reduce bounce rate and improve cross-sell
• Implementation: 7 weeks including Salesforce Commerce Cloud integration
• Results at 90 days: 18% reduction in bounce rate, 25% lift in items per order, $4.2M incremental annual revenue
• Key wins: Behavioral product recommendations on PDP, personalized category page sort order, cart cross-sell

Grocery/CPG (enterprise):
• Challenge: Cookie-cutter experience for diverse customer base, needed regional personalization
• Implementation: 6 weeks with custom data feeds
• Results at 90 days: 9% conversion lift, 15% increase in basket size, significant improvement in promotional effectiveness
• Key wins: Weather-based product promotions, regional assortment personalization, loyalty tier-based experiences`,
    tags: ["case_studies", "implementation", "success", "results"],
    keywords: ["case study", "success", "implementation", "results", "fashion", "electronics", "grocery", "conversion", "revenue"]
  },
  {
    id: "cs_key_metrics",
    type: "slide",
    category: "customer_success",
    chapter: 0,
    title: "Key Metrics Customers Achieve",
    content: `Use these benchmark metrics in conversations, business cases, and ROI discussions.

Conversion rate impact:
• Average lift across all customers: 8-15% within first 90 days
• Top performers: 20-30% lift with mature personalization programs
• Quick wins (first 30 days): 3-5% lift from basic personalization (hero banners, social proof)

Revenue metrics:
• Average Revenue Per Visitor (RPV) increase: 10-20%
• Average Order Value (AOV) increase: 5-12%
• Revenue influenced by recommendations: 15-30% of total e-commerce revenue

Engagement metrics:
• Bounce rate reduction: 10-20%
• Pages per session increase: 15-25%
• Time on site increase: 10-20%
• Email click-through rate increase: 20-40% with open-time personalization

Efficiency metrics:
• Reduction in manual merchandising effort: 40-60%
• Faster time to launch experiences: from weeks (dev-dependent) to hours (marketer self-service)
• Testing velocity: 3-5x more tests run per quarter

Disclaimer: Always position metrics as "based on results across our customer base" — never guarantee specific outcomes.`,
    tags: ["metrics", "benchmarks", "results", "kpis"],
    keywords: ["metrics", "benchmarks", "conversion", "revenue", "AOV", "RPV", "engagement", "results", "KPI"]
  },
  {
    id: "cs_testimonial_templates",
    type: "script",
    category: "customer_success",
    chapter: 0,
    title: "Customer Testimonial Templates",
    content: `Use these testimonial patterns when crafting proposals and presentations. Customize with actual customer quotes when available.

For marketers:
"Before Monetate, we were showing the same homepage to every visitor. Now we run 50+ personalized experiences and our marketing team manages them all without dev support. Our conversion rate is up 14% and we're testing ideas at 4x the speed we were before."

For merchandising teams:
"The MONET recommendation engine changed our game. We went from manually curating product recommendations to letting AI handle it — and the results are dramatically better. Product recommendations now drive 25% of our online revenue."

For technical leaders:
"We evaluated multiple platforms and Monetate stood out for its architecture — lightweight tag, sub-50ms response times, and clean API documentation. Our engineers deployed it in 3 weeks and haven't had to touch it since. It just works."

For executives:
"Monetate paid for itself within the first quarter. We invested $280K annually and generated over $3M in incremental revenue in year one. The ROI conversation was easy — the numbers speak for themselves."

Pro tip: The most powerful testimonials reference specific metrics. Always try to include a number.`,
    tags: ["testimonials", "quotes", "proof", "references"],
    keywords: ["testimonial", "quote", "reference", "customer", "proof", "results", "said"]
  },
  {
    id: "cs_onboarding_overview",
    type: "slide",
    category: "customer_success",
    chapter: 0,
    title: "Onboarding Process Overview",
    content: `Monetate's onboarding process is designed to deliver value fast and build long-term success.

Onboarding team:
• Implementation Manager — project management and coordination
• Solutions Architect — technical integration and data setup
• Customer Success Manager — strategic guidance and optimization planning

Phase 1: Foundation (Weeks 1-2)
• Kickoff call with all stakeholders
• Tag deployment and data validation
• Product catalog feed connection
• User account setup and permissions
• Training: Platform basics and visual editor

Phase 2: Quick Wins (Weeks 3-4)
• Launch 3-5 initial experiences (personalized banners, social proof, exit intent)
• Configure basic audience segments
• Set up reporting dashboards
• Training: Audience builder and testing

Phase 3: Advanced (Weeks 5-8)
• Deploy MONET product recommendations
• Launch first A/B tests
• Configure advanced segments and triggers
• Training: Advanced personalization and analytics
• Optimization strategy workshop

Post-onboarding:
• Transition to ongoing CSM relationship
• Monthly business reviews
• Quarterly optimization strategy sessions
• Access to Monetate Academy (self-service learning)
• Customer community and knowledge base

Success metric: 100% of customers have at least 5 live experiences by end of onboarding.`,
    tags: ["onboarding", "process", "implementation", "training", "csm"],
    keywords: ["onboarding", "process", "implementation", "training", "kickoff", "launch", "CSM", "success"]
  },
];

export function searchKnowledgeBase(query: string, limit: number = 5): KnowledgeEntry[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  const scored = KNOWLEDGE_BASE.map(entry => {
    let score = 0;
    
    // Keyword matching (highest weight)
    for (const keyword of entry.keywords) {
      const kwLower = keyword.toLowerCase();
      if (queryLower.includes(kwLower)) {
        score += 8;
      }
      for (const word of queryWords) {
        if (kwLower.includes(word)) {
          score += 3;
        }
      }
    }
    
    // Tag matching
    for (const tag of entry.tags) {
      const tagLower = tag.toLowerCase();
      for (const word of queryWords) {
        if (tagLower.includes(word)) {
          score += 2;
        }
      }
    }
    
    // Title matching
    const titleLower = entry.title.toLowerCase();
    for (const word of queryWords) {
      if (titleLower.includes(word)) {
        score += 4;
      }
    }
    
    // Content matching (lower weight)
    const contentLower = entry.content.toLowerCase();
    for (const word of queryWords) {
      if (contentLower.includes(word)) {
        score += 1;
      }
    }
    
    // Boost roleplays if query mentions specific objections
    if (entry.type === "roleplay" && (
      queryLower.includes("handle") || 
      queryLower.includes("respond") || 
      queryLower.includes("say") ||
      queryLower.includes("objection")
    )) {
      score += 5;
    }
    
    // Boost scripts if query asks for examples
    if (entry.type === "script" && (
      queryLower.includes("script") || 
      queryLower.includes("example") || 
      queryLower.includes("what to say") ||
      queryLower.includes("template")
    )) {
      score += 5;
    }

    // Boost competitive entries for competitor queries
    if (entry.category === "competitive" && (
      queryLower.includes("vs") ||
      queryLower.includes("versus") ||
      queryLower.includes("competitor") ||
      queryLower.includes("compare") ||
      queryLower.includes("comparison") ||
      queryLower.includes("against")
    )) {
      score += 5;
    }

    // Boost pricing entries for pricing queries
    if (entry.category === "pricing" && (
      queryLower.includes("price") ||
      queryLower.includes("pricing") ||
      queryLower.includes("cost") ||
      queryLower.includes("discount") ||
      queryLower.includes("package") ||
      queryLower.includes("contract")
    )) {
      score += 5;
    }
    
    return { entry, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.entry);
}

export const searchKnowledge = searchKnowledgeBase;

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
