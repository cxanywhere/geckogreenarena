import { db } from "./db";
import { eq } from "drizzle-orm";
import { abmAccounts, abmCommitteeMembers } from "@shared/schema";

const ACCOUNT_ID = "abm-meridian-001";

const MERIDIAN_ACCOUNT = {
  id: ACCOUNT_ID,
  slug: "meridian-health-systems",
  companyName: "Meridian Health Systems",
  industry: "Healthcare SaaS (B2B)",
  companySize: "800 employees, $120M ARR",
  description: "Meridian Health Systems is a fast-growing healthcare SaaS company that provides clinical workflow automation and patient engagement platforms to mid-market hospital systems. They've been relying heavily on Google Ads and organic SEO for demand generation but are seeing diminishing returns as their TAM becomes more specialized. Their board is pushing for 40% pipeline growth next year, and the leadership team is evaluating new channels to reach healthcare IT decision-makers.",
  currentStack: [
    "Google Ads (primary paid channel)",
    "HubSpot (CRM & marketing automation)",
    "WordPress (content/SEO)",
    "6sense (intent data, recently adopted)",
    "Salesforce (enterprise CRM, migrating from HubSpot)"
  ],
  strategicInitiative: "Expand pipeline 40% by penetrating hospital C-suite and IT leadership through targeted account-based campaigns. They need a channel that reaches senior healthcare executives who aren't searching on Google.",
  budgetSignal: "Has $400K in unallocated Q3 budget earmarked for 'new channel experimentation'. CFO wants a 90-day pilot with clear attribution to pipeline.",
  decisionTimeline: "Q3 budget allocation decision by end of next month. Pilot would need to launch within 60 days of approval.",
};

const COMMITTEE_MEMBERS = [
  {
    id: "abm-member-cmo",
    accountId: ACCOUNT_ID,
    name: "Dr. Sarah Chen",
    title: "Chief Marketing Officer",
    role: "Final decision-maker",
    influence: "Decision Maker — Has ultimate sign-off on new channel investments. Reports to CEO and presents marketing results to the board quarterly.",
    whatTheyCareAbout: [
      "Pipeline contribution and revenue attribution",
      "Brand credibility with hospital C-suite audiences",
      "Proving marketing's impact at board meetings",
      "Scaling demand gen without proportionally scaling headcount",
      "Competitive differentiation in a crowded healthcare SaaS market"
    ],
    resistanceTriggers: [
      "Vanity metrics without pipeline attribution",
      "Platforms that can't demonstrate healthcare audience reach",
      "Long ramp times without early signal of success",
      "Anything that feels like 'spray and pray' advertising"
    ],
    personalContext: "Dr. Chen came from a clinical background before moving into healthcare marketing. She values data-driven decisions and has a low tolerance for marketing that can't be tied to revenue. She's been burned by Facebook Ads in the past (poor audience quality for B2B healthcare).",
    openingLine: "Our Google Ads are still working reasonably well. Why would I divert budget to a platform I haven't tested when I have a board meeting in 6 weeks?",
    orderIndex: 0,
  },
  {
    id: "abm-member-vp-demand",
    accountId: ACCOUNT_ID,
    name: "Marcus Rivera",
    title: "VP of Demand Generation",
    role: "Champion / Internal advocate",
    influence: "Champion — Owns the pipeline number. Already exploring LinkedIn internally but needs help building the business case for Dr. Chen.",
    whatTheyCareAbout: [
      "Meeting the 40% pipeline growth target",
      "Quality of leads (MQL to SQL conversion rate)",
      "Reaching healthcare IT buyers who aren't on Google",
      "ABM alignment — targeting their 6sense intent accounts on LinkedIn",
      "Speed to launch and iterate on campaigns"
    ],
    resistanceTriggers: [
      "High CPL without quality justification",
      "Lack of integration with their existing HubSpot/6sense stack",
      "Campaigns that generate leads but not pipeline",
      "Being asked to commit large budgets before seeing proof"
    ],
    personalContext: "Marcus is your best ally. He's already been researching LinkedIn Ads on his own and has pitched it informally to Dr. Chen. He needs ammunition — case studies, ROI projections, and a clear pilot framework he can champion internally.",
    openingLine: "I've been looking at LinkedIn for a while, but I need to build a bulletproof business case. What can you show me that I can take to our CMO?",
    orderIndex: 1,
  },
  {
    id: "abm-member-perf-mktg",
    accountId: ACCOUNT_ID,
    name: "Jessica Park",
    title: "Performance Marketing Manager",
    role: "Technical evaluator",
    influence: "Evaluator — Will run the campaigns day-to-day. Her opinion on platform capabilities heavily influences Marcus and Dr. Chen.",
    whatTheyCareAbout: [
      "Campaign setup efficiency and platform UX",
      "Targeting precision (job title, seniority, company size filtering)",
      "Cost per lead and cost per opportunity benchmarks",
      "Conversion tracking and CRM integration",
      "A/B testing capabilities and optimization levers"
    ],
    resistanceTriggers: [
      "Platforms with limited optimization controls",
      "No conversion API or offline conversion tracking",
      "CPL significantly higher than Google Ads without clear quality justification",
      "Poor reporting granularity or attribution gaps"
    ],
    personalContext: "Jessica is a Google Ads power user who's skeptical of any platform that doesn't offer the same level of control. She's data-obsessed and will grill you on targeting mechanics, bidding strategies, and conversion tracking. Win her over with specifics, not generalities.",
    openingLine: "I'm running our Google Ads at a $45 CPL. Everything I've heard says LinkedIn is 3-4x that. Why would I recommend we move budget there?",
    orderIndex: 2,
  },
  {
    id: "abm-member-abm-lead",
    accountId: ACCOUNT_ID,
    name: "David Okonkwo",
    title: "Head of ABM & Field Marketing",
    role: "ABM strategist",
    influence: "Influencer — Manages the target account list and coordinates with sales. His alignment with a new channel determines whether sales supports it.",
    whatTheyCareAbout: [
      "Reaching specific accounts on their target list (450 hospital systems)",
      "Multi-threading into buying committees at target accounts",
      "Sales and marketing alignment on account engagement",
      "Account-level reporting and engagement metrics",
      "Coordinating digital campaigns with field events and direct outreach"
    ],
    resistanceTriggers: [
      "Broad targeting that wastes impressions on non-target accounts",
      "Inability to upload or match their target account list",
      "No account-level engagement reporting",
      "Channels that don't complement their sales team's direct outreach"
    ],
    personalContext: "David runs a sophisticated ABM program using 6sense for intent signals and coordinates closely with the sales team. He's excited about LinkedIn's Matched Audiences capability but wants to understand how it integrates with their existing account-based workflow.",
    openingLine: "We have a very specific list of 450 hospital systems we're going after. Can LinkedIn actually reach the decision-makers at those accounts, or is it too broad?",
    orderIndex: 3,
  },
  {
    id: "abm-member-cfo",
    accountId: ACCOUNT_ID,
    name: "Robert Nakamura",
    title: "CFO",
    role: "Budget gatekeeper",
    influence: "Gatekeeper — Controls the $400K experimental budget. Won't attend most meetings but will review the business case and ROI projections before approving.",
    whatTheyCareAbout: [
      "Clear ROI framework with measurable milestones",
      "Risk mitigation — ability to pause or scale back if results disappoint",
      "Pipeline-to-revenue attribution (not just lead volume)",
      "Comparison to current channel economics (Google Ads CAC)",
      "Contract flexibility and no long-term lock-in"
    ],
    resistanceTriggers: [
      "Marketing jargon without financial rigor",
      "Requests for large upfront commitments without proof",
      "Metrics he can't connect to revenue",
      "Vague timelines or unclear success criteria"
    ],
    personalContext: "Robert is a numbers person who views marketing as a growth investment that must be justified. He's not anti-marketing, but he's been burned by channels that promised leads but didn't deliver pipeline. He respects concise, financially rigorous arguments.",
    openingLine: "Marketing wants another $400K for a channel experiment. Walk me through the math on why this is a better use of capital than doubling down on what's already working.",
    orderIndex: 4,
  },
];

export async function seedAbmData() {
  const existing = await db.select().from(abmAccounts).where(eq(abmAccounts.slug, "meridian-health-systems")).limit(1);
  if (existing.length > 0) {
    console.log("  ABM account data already exists, skipping");
    return;
  }

  await db.insert(abmAccounts).values(MERIDIAN_ACCOUNT);
  console.log(`  Seeded ABM account: ${MERIDIAN_ACCOUNT.companyName}`);

  for (const member of COMMITTEE_MEMBERS) {
    await db.insert(abmCommitteeMembers).values(member);
    console.log(`  Seeded committee member: ${member.name} (${member.title})`);
  }
}
