export interface CharacterProfile {
  id: string;
  name: string;
  role: "rep" | "homeowner";
  storyId: string;
  description: string;
  portraitPrompt: string;
}

export const NEW_HOMEOWNERS: CharacterProfile[] = [
  {
    id: "homeowner-7",
    name: "Greg Lawson",
    role: "homeowner",
    storyId: "rp-ext-01",
    description: "Greg Lawson, a 48-year-old white man with a stocky build. He has short salt-and-pepper hair and a neatly trimmed goatee. He is wearing a dark green flannel shirt over a white t-shirt. He has a skeptical, analytical expression - the look of someone who researches everything before buying.",
    portraitPrompt: "Professional headshot portrait of Greg Lawson, a 48-year-old white man with a stocky build. He has short salt-and-pepper hair and a neatly trimmed goatee. He is wearing a dark green flannel shirt over a white t-shirt. He has a skeptical, analytical expression, like someone who researches everything before making decisions. Soft neutral background. High quality, realistic photography style, natural lighting."
  },
  {
    id: "homeowner-8",
    name: "Angela Foster",
    role: "homeowner",
    storyId: "rp-ext-02",
    description: "Angela Foster, a 52-year-old Black woman with medium-length curly hair styled elegantly. She is wearing a cream-colored blouse and pearl earrings. She has a warm but cautious demeanor - clearly successful and used to making careful decisions. Wedding ring visible.",
    portraitPrompt: "Professional headshot portrait of Angela Foster, a 52-year-old Black woman with medium-length curly hair styled elegantly. She is wearing a cream-colored blouse and pearl earrings. She has a warm but cautious expression, the look of a successful professional who makes careful decisions. Soft neutral background. High quality, realistic photography style, natural lighting."
  },
  {
    id: "homeowner-9",
    name: "Steve Kowalski",
    role: "homeowner",
    storyId: "rp-ext-03",
    description: "Steve Kowalski, a 35-year-old white man with a muscular build. He has short brown hair buzzed on the sides and a 5 o'clock shadow. He is wearing a worn gray t-shirt with grass stains. He has a proud, hands-on expression - clearly someone who takes pride in doing things himself.",
    portraitPrompt: "Professional headshot portrait of Steve Kowalski, a 35-year-old white man with a muscular build. He has short brown hair buzzed on the sides and a 5 o'clock shadow. He is wearing a worn gray t-shirt. He has a proud, hands-on expression, like someone who takes pride in doing yard work himself. Soft neutral background. High quality, realistic photography style, natural lighting."
  }
];

export interface PanelData {
  panelOrder: number;
  speaker: "rep" | "homeowner" | "narrator";
  dialogue: string;
  setting: string;
  emotion: string;
}

export interface ExtendedStoryData {
  roleplayId: string;
  title: string;
  subtitle: string;
  phase: string;
  description: string;
  orderIndex: number;
  panels: PanelData[];
}

export const EXTENDED_STORIES: ExtendedStoryData[] = [
  {
    roleplayId: "rp-ext-01",
    title: "The Skeptical Analyst",
    subtitle: '"I need to do my own research first."',
    phase: "Full Sale",
    description: "A complete knock-to-prepay-close journey with a research-oriented homeowner who needs proof at every step.",
    orderIndex: 7,
    panels: [
      { panelOrder: 1, speaker: "narrator", dialogue: "A sunny Saturday morning. Marcus approaches a well-maintained colonial home with a lawn that has some visible issues.", setting: "Suburban street, walking toward a nice colonial home", emotion: "confident" },
      { panelOrder: 2, speaker: "rep", dialogue: "Good morning! I'm Marcus with GeckoGreen. We're treating lawns in your neighborhood today.", setting: "At the front door, professional posture, friendly smile", emotion: "friendly" },
      { panelOrder: 3, speaker: "homeowner", dialogue: "Oh, I've seen your trucks around. What exactly do you guys do?", setting: "Greg at door, curious but guarded expression", emotion: "curious" },
      { panelOrder: 4, speaker: "rep", dialogue: "We specialize in full-service lawn care - fertilization, weed control, grub prevention. Mind if I take a quick look at your lawn?", setting: "Rep gesturing toward the lawn", emotion: "professional" },
      { panelOrder: 5, speaker: "homeowner", dialogue: "Sure, but I should tell you - I research everything before I buy anything.", setting: "Greg stepping outside, arms crossed", emotion: "skeptical" },
      { panelOrder: 6, speaker: "rep", dialogue: "I respect that. Let me show you exactly what I'm seeing so you have real data to work with.", setting: "Walking toward lawn together", emotion: "understanding" },
      { panelOrder: 7, speaker: "narrator", dialogue: "Marcus begins the lawn walk, pointing out specific issues.", setting: "Both on the front lawn, examining grass", emotion: "professional" },
      { panelOrder: 8, speaker: "rep", dialogue: "See this discoloration here? That's iron chlorosis - your soil pH is off. And these spots? Classic grub damage.", setting: "Kneeling near brown patches", emotion: "educational" },
      { panelOrder: 9, speaker: "homeowner", dialogue: "How do you know it's grubs and not just drought stress?", setting: "Greg leaning in, interested but testing", emotion: "analytical" },
      { panelOrder: 10, speaker: "rep", dialogue: "Great question. Watch this.", setting: "Rep pulling up a section of grass", emotion: "confident" },
      { panelOrder: 11, speaker: "narrator", dialogue: "Marcus pulls back the turf to reveal the root zone.", setting: "Close-up of damaged grass roots", emotion: "focused" },
      { panelOrder: 12, speaker: "rep", dialogue: "See how the roots are gone? Drought stress shows in the blades first. Grubs eat from below. Plus, your grass lifts up like carpet.", setting: "Showing the damaged roots", emotion: "educational" },
      { panelOrder: 13, speaker: "homeowner", dialogue: "Okay, that's actually really interesting. What would you do about it?", setting: "Greg's expression softening", emotion: "engaged" },
      { panelOrder: 14, speaker: "rep", dialogue: "We'd start with a grub treatment now to stop the damage, then reseed these areas. Our 8-application program also corrects the pH over time.", setting: "Standing, explaining professionally", emotion: "confident" },
      { panelOrder: 15, speaker: "homeowner", dialogue: "How much are we talking?", setting: "Greg with arms now uncrossed", emotion: "interested" },
      { panelOrder: 16, speaker: "rep", dialogue: "For your property size, the full annual program is $589. That covers everything - 8 treatments, grub prevention, weed control, and guaranteed results.", setting: "Rep showing tablet with pricing", emotion: "professional" },
      { panelOrder: 17, speaker: "homeowner", dialogue: "That's more than I expected. I'd need to compare that to other companies.", setting: "Greg looking hesitant", emotion: "resistant" },
      { panelOrder: 18, speaker: "rep", dialogue: "Totally fair. But let me ask - what would you be comparing? Most companies don't include grub prevention or the soil amendments you need.", setting: "Rep with open, non-defensive posture", emotion: "understanding" },
      { panelOrder: 19, speaker: "homeowner", dialogue: "I guess I'd need to check what's included in their programs...", setting: "Greg considering this point", emotion: "thoughtful" },
      { panelOrder: 20, speaker: "rep", dialogue: "Here's what I can tell you - we're the only company that guarantees results. If you're not satisfied, we retreat for free. No other company does that.", setting: "Rep making guarantee gesture", emotion: "confident" },
      { panelOrder: 21, speaker: "homeowner", dialogue: "A guarantee? What exactly does that cover?", setting: "Greg now more interested", emotion: "curious" },
      { panelOrder: 22, speaker: "rep", dialogue: "Everything. If weeds come back, we treat again. If you have grub damage, we fix it. If your lawn isn't greener, we keep working until it is.", setting: "Rep explaining with conviction", emotion: "trustworthy" },
      { panelOrder: 23, speaker: "homeowner", dialogue: "Okay, that's good to know. But $589 all at once is a lot.", setting: "Greg warming up but still budget conscious", emotion: "hesitant" },
      { panelOrder: 24, speaker: "rep", dialogue: "I hear you. Here's the thing - if you prepay today, I can take 10% off. That brings it to $530 for the whole year.", setting: "Rep offering the discount", emotion: "helpful" },
      { panelOrder: 25, speaker: "homeowner", dialogue: "10% off for prepaying?", setting: "Greg calculating in his head", emotion: "interested" },
      { panelOrder: 26, speaker: "rep", dialogue: "That's right. And I can split it into two payments if that helps - half today, half in 30 days.", setting: "Rep accommodating", emotion: "flexible" },
      { panelOrder: 27, speaker: "homeowner", dialogue: "Two payments would be easier. When would you start?", setting: "Greg now clearly considering it", emotion: "engaged" },
      { panelOrder: 28, speaker: "rep", dialogue: "We could have our first application done within the next 5-7 business days. You'll see results within 2 weeks.", setting: "Rep confident about timeline", emotion: "professional" },
      { panelOrder: 29, speaker: "homeowner", dialogue: "Alright. You've given me good information. Let's do the prepay with two payments.", setting: "Greg extending hand to shake", emotion: "decided" },
      { panelOrder: 30, speaker: "rep", dialogue: "Excellent choice. Let me get you set up right now. Your lawn is going to look amazing.", setting: "Shaking hands, both smiling", emotion: "success" },
      { panelOrder: 31, speaker: "narrator", dialogue: "By providing proof, addressing objections with data, and offering flexible prepay options, Marcus closed the skeptical analyst.", setting: "Wide shot of successful transaction on driveway", emotion: "success" }
    ]
  },
  {
    roleplayId: "rp-ext-02",
    title: "The Reluctant Decision-Maker",
    subtitle: '"I need to talk to my husband first."',
    phase: "Full Sale",
    description: "Navigating the spouse objection while demonstrating value and urgency to close a prepay sale.",
    orderIndex: 8,
    panels: [
      { panelOrder: 1, speaker: "narrator", dialogue: "Late afternoon at an upscale suburban home. The lawn has good bones but visible weed problems.", setting: "Upscale home with manicured landscaping", emotion: "observant" },
      { panelOrder: 2, speaker: "rep", dialogue: "Good afternoon! I'm Marcus with GeckoGreen. Beautiful home you have here.", setting: "At front door, professional and warm", emotion: "friendly" },
      { panelOrder: 3, speaker: "homeowner", dialogue: "Thank you! What can I help you with?", setting: "Angela at door, polite but busy", emotion: "polite" },
      { panelOrder: 4, speaker: "rep", dialogue: "We're doing lawn assessments in your neighborhood. I noticed a few things with your lawn - mind if I point them out?", setting: "Rep gesturing toward lawn", emotion: "professional" },
      { panelOrder: 5, speaker: "homeowner", dialogue: "I suppose... but my husband usually handles the lawn decisions.", setting: "Angela stepping out hesitantly", emotion: "hesitant" },
      { panelOrder: 6, speaker: "rep", dialogue: "I understand. I just want to make sure you have the information. Sometimes it helps to know what to discuss with him.", setting: "Rep being respectful, not pushy", emotion: "understanding" },
      { panelOrder: 7, speaker: "narrator", dialogue: "They walk onto the lawn together. Marcus points out weed patches.", setting: "Walking across the front lawn", emotion: "professional" },
      { panelOrder: 8, speaker: "rep", dialogue: "See these spreading here? This is crabgrass - it'll take over the whole lawn by fall if it's not treated now.", setting: "Pointing to crabgrass patches", emotion: "educational" },
      { panelOrder: 9, speaker: "homeowner", dialogue: "Oh wow, I didn't realize it was spreading that fast.", setting: "Angela looking concerned at the lawn", emotion: "surprised" },
      { panelOrder: 10, speaker: "rep", dialogue: "It's sneaky. And over here - these broadleaf weeds are competing with your grass for nutrients.", setting: "Moving to another problem area", emotion: "informative" },
      { panelOrder: 11, speaker: "homeowner", dialogue: "My husband has been trying to treat these himself, but they keep coming back.", setting: "Angela frustrated", emotion: "frustrated" },
      { panelOrder: 12, speaker: "rep", dialogue: "That's common with store-bought products. They kill what's visible but don't prevent regrowth. We use commercial-grade products that prevent new weeds.", setting: "Rep explaining the difference", emotion: "professional" },
      { panelOrder: 13, speaker: "homeowner", dialogue: "That makes sense. What would a program like that cost?", setting: "Angela now interested", emotion: "curious" },
      { panelOrder: 14, speaker: "rep", dialogue: "For your lawn size, the full annual program is $649. That's 8 treatments, all weed control, fertilization, and guaranteed results.", setting: "Rep with tablet showing plan", emotion: "confident" },
      { panelOrder: 15, speaker: "homeowner", dialogue: "That sounds reasonable, but I really should talk to my husband before committing.", setting: "Angela hesitating", emotion: "uncertain" },
      { panelOrder: 16, speaker: "rep", dialogue: "I completely understand. Is there anything specific he'd want to know that I can answer now?", setting: "Rep being helpful, not pushy", emotion: "supportive" },
      { panelOrder: 17, speaker: "homeowner", dialogue: "He'd probably ask about the guarantee and what happens if we're not happy.", setting: "Angela thinking about husband's concerns", emotion: "thoughtful" },
      { panelOrder: 18, speaker: "rep", dialogue: "Great question. We guarantee results - if your lawn doesn't improve or weeds return, we retreat at no charge. We don't stop until you're satisfied.", setting: "Rep explaining guarantee confidently", emotion: "trustworthy" },
      { panelOrder: 19, speaker: "homeowner", dialogue: "That's reassuring. He'd also ask about the timing - when would you start?", setting: "Angela engaged in conversation", emotion: "engaged" },
      { panelOrder: 20, speaker: "rep", dialogue: "We could start within the week. Honestly, the crabgrass is in a critical window right now - another few weeks and it seeds. Then you're fighting it next year too.", setting: "Rep creating appropriate urgency", emotion: "urgent" },
      { panelOrder: 21, speaker: "homeowner", dialogue: "I didn't know that. So waiting would make it worse?", setting: "Angela concerned about timing", emotion: "worried" },
      { panelOrder: 22, speaker: "rep", dialogue: "Unfortunately yes. Once it seeds, those seeds survive winter. Starting now stops the cycle.", setting: "Rep nodding seriously", emotion: "educational" },
      { panelOrder: 23, speaker: "narrator", dialogue: "Angela considers the information. Marcus can see she's almost ready.", setting: "Angela thinking, looking at lawn", emotion: "contemplative" },
      { panelOrder: 24, speaker: "rep", dialogue: "I'll tell you what - if you prepay today, I can give you 10% off the annual price. That's $584 instead of $649.", setting: "Rep offering incentive", emotion: "helpful" },
      { panelOrder: 25, speaker: "homeowner", dialogue: "That's a nice discount... but I still feel like I should check with him.", setting: "Angela wavering", emotion: "hesitant" },
      { panelOrder: 26, speaker: "rep", dialogue: "How about this - is he reachable by phone? You could give him a quick call and I can answer any questions he has directly.", setting: "Rep offering solution", emotion: "accommodating" },
      { panelOrder: 27, speaker: "homeowner", dialogue: "Actually, that's a good idea. Let me call him.", setting: "Angela pulling out phone", emotion: "decided" },
      { panelOrder: 28, speaker: "narrator", dialogue: "Angela calls her husband. After a brief conversation, she hands the phone to Marcus.", setting: "Angela on phone, then passing it", emotion: "transitional" },
      { panelOrder: 29, speaker: "rep", dialogue: "Hi, this is Marcus. Yes sir, I was just showing your wife the crabgrass situation... Right, it's spreading into the back too...", setting: "Marcus on phone, professional", emotion: "professional" },
      { panelOrder: 30, speaker: "narrator", dialogue: "After a two-minute conversation, Marcus hands the phone back.", setting: "Finishing phone call", emotion: "positive" },
      { panelOrder: 31, speaker: "homeowner", dialogue: "He said go ahead and sign us up for the prepay.", setting: "Angela smiling, relieved", emotion: "happy" },
      { panelOrder: 32, speaker: "rep", dialogue: "Perfect! Let me get you set up. You made a great decision - your lawn will look incredible.", setting: "Setting up on tablet", emotion: "success" },
      { panelOrder: 33, speaker: "narrator", dialogue: "By respecting the spouse concern, providing answers, creating urgency, and facilitating the phone call, Marcus closed the prepay sale.", setting: "Wide shot of transaction completing", emotion: "success" }
    ]
  },
  {
    roleplayId: "rp-ext-03",
    title: "The DIY Warrior",
    subtitle: '"I can do it myself for way less."',
    phase: "Full Sale",
    description: "Converting a proud DIY homeowner by showing the hidden costs and time investment of doing it themselves.",
    orderIndex: 9,
    panels: [
      { panelOrder: 1, speaker: "narrator", dialogue: "A Saturday afternoon. Steve is in his driveway working on his lawn mower when Marcus approaches.", setting: "Suburban home, homeowner by lawn mower", emotion: "casual" },
      { panelOrder: 2, speaker: "rep", dialogue: "Hey there! Looks like you're a hands-on guy. I'm Marcus with GeckoGreen.", setting: "Rep approaching casually", emotion: "friendly" },
      { panelOrder: 3, speaker: "homeowner", dialogue: "Yeah, I do everything myself. Mowing, edging, all of it. Saves me money.", setting: "Steve wiping hands, proud", emotion: "proud" },
      { panelOrder: 4, speaker: "rep", dialogue: "I can see that. Your lawn looks better than most on this street. You clearly put in the work.", setting: "Rep genuinely complimenting", emotion: "appreciative" },
      { panelOrder: 5, speaker: "homeowner", dialogue: "Thanks. So what are you selling?", setting: "Steve direct, no-nonsense", emotion: "direct" },
      { panelOrder: 6, speaker: "rep", dialogue: "Lawn treatment programs. But honestly, looking at your lawn, you're doing a lot right. Mind if I take a closer look?", setting: "Rep being genuine", emotion: "honest" },
      { panelOrder: 7, speaker: "homeowner", dialogue: "Sure, but I'm not interested in paying someone for something I can do myself.", setting: "Steve crossing arms", emotion: "resistant" },
      { panelOrder: 8, speaker: "narrator", dialogue: "They walk across the lawn. Marcus examines areas carefully.", setting: "Walking onto lawn together", emotion: "observant" },
      { panelOrder: 9, speaker: "rep", dialogue: "You're mowing at the right height. That's huge - most people cut too short. But I see some clover and henbit coming in.", setting: "Pointing to weed patches", emotion: "professional" },
      { panelOrder: 10, speaker: "homeowner", dialogue: "Yeah, I've been hitting those with weed killer from the hardware store. Works okay.", setting: "Steve defensive", emotion: "defensive" },
      { panelOrder: 11, speaker: "rep", dialogue: "It'll knock them down, but those products don't have residual control. They come right back.", setting: "Rep explaining calmly", emotion: "educational" },
      { panelOrder: 12, speaker: "homeowner", dialogue: "So I spray again. It's like $20 a bottle.", setting: "Steve doing math", emotion: "practical" },
      { panelOrder: 13, speaker: "rep", dialogue: "Fair point. Let me ask - how many bottles do you go through a year?", setting: "Rep genuinely curious", emotion: "curious" },
      { panelOrder: 14, speaker: "homeowner", dialogue: "I don't know... maybe 6 or 7? Plus the fertilizer. And I bought grub killer last year.", setting: "Steve counting on fingers", emotion: "calculating" },
      { panelOrder: 15, speaker: "rep", dialogue: "So that's probably $200-250 in products. Plus the spreader, the sprayer... your time.", setting: "Rep helping with math", emotion: "thoughtful" },
      { panelOrder: 16, speaker: "homeowner", dialogue: "My time is free. It's my day off, might as well be outside.", setting: "Steve shrugging", emotion: "dismissive" },
      { panelOrder: 17, speaker: "rep", dialogue: "I get that. But how many hours you think you spend on treatments, not counting mowing?", setting: "Rep asking genuinely", emotion: "curious" },
      { panelOrder: 18, speaker: "homeowner", dialogue: "I don't know... couple hours a month during season? Maybe 15-20 hours total.", setting: "Steve estimating", emotion: "thoughtful" },
      { panelOrder: 19, speaker: "rep", dialogue: "And if I told you I could get you better results, with products you can't buy retail, for about the same cost?", setting: "Rep making value proposition", emotion: "confident" },
      { panelOrder: 20, speaker: "homeowner", dialogue: "I'd say prove it.", setting: "Steve skeptical but interested", emotion: "challenging" },
      { panelOrder: 21, speaker: "rep", dialogue: "Fair. Our annual program is $499 for your lawn size. That's 8 professional applications.", setting: "Rep showing pricing", emotion: "professional" },
      { panelOrder: 22, speaker: "homeowner", dialogue: "That's more than I spend on products.", setting: "Steve pushing back", emotion: "resistant" },
      { panelOrder: 23, speaker: "rep", dialogue: "Maybe by $100-150. But our products are commercial grade - they last longer and work better. And you get those 20 hours back.", setting: "Rep reframing value", emotion: "persuasive" },
      { panelOrder: 24, speaker: "homeowner", dialogue: "What about the satisfaction of doing it myself?", setting: "Steve with genuine concern", emotion: "honest" },
      { panelOrder: 25, speaker: "rep", dialogue: "You still mow, edge, do your landscaping. That's the visible stuff. We just handle the chemistry that's honestly harder to get right without training.", setting: "Rep validating DIY identity", emotion: "understanding" },
      { panelOrder: 26, speaker: "homeowner", dialogue: "The chemistry is where I struggle. I never know the right timing.", setting: "Steve admitting weakness", emotion: "honest" },
      { panelOrder: 27, speaker: "rep", dialogue: "Exactly. That's what we're trained for - soil temps, growth cycles, weather timing. You focus on making it look sharp, we handle the science.", setting: "Rep positioning partnership", emotion: "collaborative" },
      { panelOrder: 28, speaker: "homeowner", dialogue: "Alright, I'm listening. What's included?", setting: "Steve now engaged", emotion: "interested" },
      { panelOrder: 29, speaker: "rep", dialogue: "8 treatments: early spring pre-emergent, two fertilizer rounds, weed control through summer, grub prevention, fall winterizer. All guaranteed.", setting: "Rep listing services", emotion: "professional" },
      { panelOrder: 30, speaker: "homeowner", dialogue: "And if I'm not happy?", setting: "Steve testing", emotion: "cautious" },
      { panelOrder: 31, speaker: "rep", dialogue: "We retreat until you are. No extra charge. If we can't fix it, you get your money back.", setting: "Rep stating guarantee", emotion: "confident" },
      { panelOrder: 32, speaker: "homeowner", dialogue: "That's better than the hardware store's return policy.", setting: "Steve smirking", emotion: "amused" },
      { panelOrder: 33, speaker: "rep", dialogue: "Right? And if you prepay today, I'll knock off 10%. Makes it $449 for the year.", setting: "Rep offering discount", emotion: "helpful" },
      { panelOrder: 34, speaker: "homeowner", dialogue: "$449 for the year, and I get my weekends back?", setting: "Steve considering seriously", emotion: "calculating" },
      { panelOrder: 35, speaker: "rep", dialogue: "Your treatment weekends, yeah. You still get to be out here doing the stuff you actually enjoy.", setting: "Rep reinforcing value", emotion: "encouraging" },
      { panelOrder: 36, speaker: "homeowner", dialogue: "You know what? Let's do it. My wife's been telling me to stop being stubborn.", setting: "Steve laughing, decided", emotion: "amused" },
      { panelOrder: 37, speaker: "rep", dialogue: "Smart man. Let me get you set up. Your lawn's going to look even better, and you'll wonder why you didn't do this sooner.", setting: "Setting up tablet", emotion: "success" },
      { panelOrder: 38, speaker: "narrator", dialogue: "By validating the DIY identity, showing true costs, and positioning partnership over replacement, Marcus converted the DIY warrior to a prepay customer.", setting: "Transaction completing, both satisfied", emotion: "success" }
    ]
  }
];
