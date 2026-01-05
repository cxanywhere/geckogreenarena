import { db } from "../server/db.js";
import { buyerPersonas } from "../shared/schema.js";
import { generatePersonaAvatar } from "../server/persona-image-service.js";
import { eq } from "drizzle-orm";

const personasData = [
  {
    slug: "busy-professional",
    name: "The Busy Professional",
    subtitle: "Time-poor, task-saturated decision maker",
    attributes: [
      "Time-poor, task-saturated, decision fatigue",
      "Wants a good outcome, minimal friction",
      "High responsiveness to structure and certainty"
    ],
    whatTheyCareAbout: [
      "Convenience, speed, predictable results",
      '"Make this easy for me"'
    ],
    whatTriggersResistance: [
      "Long explanations, vague benefits, unclear next steps",
      'Anything that feels like "a pitch"'
    ],
    howToWin: [
      "Opening: Use the ≤60-second container and a control question to keep them engaged.",
      'Turn & Burn: Move quickly to a visible issue—"show, don\'t tell."',
      "Value frame: Sell the outcome (less stress, pride, time back), not products.",
      "Close: Offer prepay as the default for simplicity; autopay as backup.",
      'Best proof: "We\'re already helping homes on your street with this exact issue."'
    ],
    bestPlays: [
      "Fast lawn walk: identify one problem area and connect to the program.",
      'Close with "Present → Protect → Prompt" (standard process + risk removal + decision prompt).'
    ],
    orderIndex: 1
  },
  {
    slug: "brush-off-defender",
    name: "The Brush-Off Defender",
    subtitle: '"Not interested," "Busy," short answers at the door',
    attributes: [
      "Defensive posture, wants to end the interaction quickly",
      "May not be truly opposed—just protecting time and space"
    ],
    whatTheyCareAbout: [
      "Respect, brevity, control of their doorway"
    ],
    whatTriggersResistance: [
      "Arguing, pushing, talking faster, ignoring cues"
    ],
    howToWin: [
      "Acknowledge + reframe: don't debate interest; shift to a specific lawn issue.",
      "Ask an either/or control question tied to what you see (edge weeds, thinning).",
      'Request micro-permission: "Mind if I show you real quick?"'
    ],
    bestPlays: [
      '"Most people weren\'t interested until I pointed out one thing…"',
      "Move to the lawn immediately; don't stay at the porch."
    ],
    orderIndex: 2
  },
  {
    slug: "rule-first-homeowner",
    name: 'The Rule-First / "No Soliciting" Homeowner',
    subtitle: "Compliance-oriented, boundary-driven",
    attributes: [
      "Compliance-oriented, boundary-driven",
      "May be open if they feel respected and safe"
    ],
    whatTheyCareAbout: [
      "Respecting rules, clarity of intent"
    ],
    whatTriggersResistance: [
      "Debating the sign/policy, continuing to talk after being stopped"
    ],
    howToWin: [
      "Acknowledge rule + clarify intent + ask micro-permission.",
      'Keep it short, visual, non-salesy: "I\'m flagging an issue I noticed."'
    ],
    bestPlays: [
      '"Not selling at the door" framing, then point to the lawn for 10–20 seconds.',
      "If denied: exit professionally (protect brand and future conversion)."
    ],
    orderIndex: 3
  },
  {
    slug: "proud-diyer",
    name: "The Proud DIYer",
    subtitle: "Identity tied to self-reliance and competence",
    attributes: [
      "Identity tied to self-reliance and competence",
      "Often knowledgeable but missing seasonal/timing nuances"
    ],
    whatTheyCareAbout: [
      "Respect for their effort, mastery, control"
    ],
    whatTriggersResistance: [
      'Implying they can\'t do it, "DIY doesn\'t work," jargon'
    ],
    howToWin: [
      "Validate identity first.",
      'Differentiate gently: "DIY usually misses this time-of-year issue."',
      "Ask permission to show a specific problem area (edge spread, early discoloration)."
    ],
    bestPlays: [
      "Position Gecko Green as a specialist in timing and consistency.",
      'Partnership framing: "You keep doing X; we handle seasonality and product timing."'
    ],
    orderIndex: 4
  },
  {
    slug: "loyal-existing-provider",
    name: "The Loyal Existing-Provider Customer",
    subtitle: "Already paying someone; avoids switching friction",
    attributes: [
      "Already paying someone; avoids switching friction",
      "Often dissatisfied in small ways but not motivated to change"
    ],
    whatTheyCareAbout: [
      'Stability, avoiding hassle, "don\'t make me start over"'
    ],
    whatTriggersResistance: [
      "Competitor attacks, replacement pressure"
    ],
    howToWin: [
      'Remove replacement fear: "Not trying to replace them."',
      'Isolate a visible gap: "Are they addressing weeds along this edge?"',
      'Offer a "second opinion" vibe: objective, calm, specific.'
    ],
    bestPlays: [
      "Outcome comparison (not price): consistency, seasonality, service calls, reliability.",
      "Close toward the problem they still have, not the provider they already have."
    ],
    orderIndex: 5
  },
  {
    slug: "looks-fine-optimist",
    name: 'The "Looks Fine" Optimist',
    subtitle: "Satisfied enough; low urgency",
    attributes: [
      "Satisfied enough; low urgency",
      "Doesn't notice early signs"
    ],
    whatTheyCareAbout: [
      "Avoiding unnecessary spending, maintaining status quo"
    ],
    whatTriggersResistance: [
      'Broad claims, "your lawn is bad," abstract explanations'
    ],
    howToWin: [
      'Validate: "Overall it does."',
      'Then isolate: "This is what I\'m flagging…"',
      "Point to an early signal (edge discoloration, spread line, thinning)."
    ],
    bestPlays: [
      "Prevention framing: protect healthy grass from spread.",
      'Connect to seasonal timing ("catching it early is cheaper/easier").'
    ],
    orderIndex: 6
  },
  {
    slug: "weed-indifferent",
    name: "The Weed-Indifferent Homeowner",
    subtitle: '"Weeds don\'t bother me."',
    attributes: [
      "Low aesthetic sensitivity",
      "Might care more about property value, kids/pets safety, or future hassle"
    ],
    whatTheyCareAbout: [
      "Avoiding bigger future problems, protecting what's already good"
    ],
    whatTriggersResistance: [
      'Aesthetic arguments, "it looks ugly" framing'
    ],
    howToWin: [
      "Reframe consequence: weeds spread and crowd out healthy grass.",
      'Keep discovery going: "What matters more—less work, safer yard, resale value?"'
    ],
    bestPlays: [
      "Prevention and protection framing (not pride).",
      "Minimal-hassle program narrative."
    ],
    orderIndex: 7
  },
  {
    slug: "skeptic",
    name: 'The Skeptic / "I Don\'t See the Issue"',
    subtitle: "Doubtful, needs proof",
    attributes: [
      "Doubtful, needs proof",
      "Wants clarity and competence"
    ],
    whatTheyCareAbout: [
      'Evidence, directness, not being "sold"'
    ],
    whatTriggersResistance: [
      "Long scientific lectures, abstract talk, hand-waving"
    ],
    howToWin: [
      "Show, don't tell: point to one unmistakable sign.",
      'Use plain language ("early sign," "spreading line," "thin patch").',
      'Confirm visually: "Do you see that?"'
    ],
    bestPlays: [
      "Use the 4-step diagnosis: observe → why → program tie-in → expectations.",
      "Then close value-first."
    ],
    orderIndex: 8
  },
  {
    slug: "price-first-shopper",
    name: "The Price-First Shopper",
    subtitle: '"How much is it?" early',
    attributes: [
      "Leads with cost to control conversation",
      "May be comparison shopping or anxious about being upsold"
    ],
    whatTheyCareAbout: [
      "Value clarity, fairness, no surprises"
    ],
    whatTriggersResistance: [
      "Immediate quoting without context (invites price-only comparison)"
    ],
    howToWin: [
      "Defer briefly: anchor value before price.",
      "Explain what the price covers and the outcome path.",
      "Then quote with confidence."
    ],
    bestPlays: [
      '"Price only makes sense after what it includes…"',
      "Use program structure + service calls + seasonal timing as value anchors."
    ],
    orderIndex: 9
  },
  {
    slug: "thats-expensive-reactor",
    name: 'The "That\'s Expensive" Reactor',
    subtitle: "Emotional reaction to price",
    attributes: [
      "Emotional reaction to price",
      "Often not rejecting; testing conviction"
    ],
    whatTheyCareAbout: [
      "Outcomes, permanence, avoiding wasted spend"
    ],
    whatTriggersResistance: [
      "Discounting immediately (signals inflated pricing)",
      "Defensive justification"
    ],
    howToWin: [
      'Normalize + re-anchor to outcome: "Most people said that before seeing results."',
      "Bring back to the problem you showed and the solution path.",
      "Only move to autopay as a structured alternative after attempting prepay."
    ],
    bestPlays: [
      'Outcome framing ("fix this permanently / control and reduction over time").',
      "Maintain calm and keep closing."
    ],
    orderIndex: 10
  },
  {
    slug: "competitor-price-comparer",
    name: "The Competitor-Price Comparer",
    subtitle: '"Another company is cheaper."',
    attributes: [
      "Anchored on price; may be burned before",
      "Wants confidence they're not overpaying"
    ],
    whatTheyCareAbout: [
      "Getting the problem solved, consistency, reliability"
    ],
    whatTriggersResistance: [
      "Attacking competitor, emotional language"
    ],
    howToWin: [
      "Reframe: cheaper often means fewer treatments or weaker consistency.",
      'Ask the real question: "Does the issue actually get solved?"',
      "Neutral tone, outcome comparison."
    ],
    bestPlays: [
      "Compare on: seasonal timing, full program, free service calls, reliability.",
      "Keep it respectful and factual."
    ],
    orderIndex: 11
  },
  {
    slug: "payment-process-resister",
    name: "The Payment-Process Resister",
    subtitle: '"Why do I have to pay now?"',
    attributes: [
      "Risk-sensitive, cautious, sometimes distrustful",
      "Needs reassurance and standard process clarity"
    ],
    whatTheyCareAbout: [
      "Fairness, guarantees, not being trapped"
    ],
    whatTriggersResistance: [
      '"That\'s just how we do it," defensiveness'
    ],
    howToWin: [
      "Normalize: everyone starts the same way (standard).",
      "Remove risk: guarantee/refund framing.",
      "Maintain close: prompt the decision again."
    ],
    bestPlays: [
      "Present → protect → prompt",
      "If needed: shift to autopay as backup without losing the close."
    ],
    orderIndex: 12
  },
  {
    slug: "stallers",
    name: "The Stallers",
    subtitle: '"I need to think about it" / "Send me something" / "I\'ll call you"',
    attributes: [
      "Avoids saying no; unresolved concern",
      "Often needs help clarifying decision criteria"
    ],
    whatTheyCareAbout: [
      "Confidence, clarity, reducing regret"
    ],
    whatTriggersResistance: [
      "Accepting the stall and leaving (you lose control)"
    ],
    howToWin: [
      "Isolate the concern: price, timing, treatment, trust.",
      'Convert "send me something" into decision criteria + next step control.',
      "Advance toward a decision on the spot when possible."
    ],
    bestPlays: [
      '"What part are you thinking through—price, timing, or the treatment itself?"',
      '"Before I go, what would you be deciding after you look it over?"'
    ],
    orderIndex: 13
  }
];

async function seedPersonas() {
  console.log("Starting to seed buyer personas...\n");
  
  for (const persona of personasData) {
    console.log(`Processing: ${persona.name}`);
    
    const existing = await db.select().from(buyerPersonas).where(eq(buyerPersonas.slug, persona.slug));
    
    if (existing.length > 0) {
      console.log(`  ✓ Already exists, skipping\n`);
      continue;
    }
    
    console.log(`  Generating AI avatar...`);
    const avatarUrl = await generatePersonaAvatar(persona.name, persona.attributes);
    console.log(`  Avatar URL: ${avatarUrl || "(failed)"}`);
    
    await db.insert(buyerPersonas).values({
      ...persona,
      avatar: avatarUrl || null,
    });
    
    console.log(`  ✓ Created successfully\n`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log("Done seeding all buyer personas!");
}

seedPersonas().catch(console.error);
