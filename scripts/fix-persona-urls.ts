import { db } from "../server/db";
import { buyerPersonas } from "../shared/schema";
import { eq } from "drizzle-orm";

const updates = [
  { slug: "busy-professional", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767646940/arena-ai/personas/persona_the_busy_professional_1767646940115.jpg" },
  { slug: "brush-off-defender", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767646960/arena-ai/personas/persona_the_brush_off_defender_1767646959392.jpg" },
  { slug: "rule-first-homeowner", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767646978/arena-ai/personas/persona_the_rule_first_homeowner_1767646978037.jpg" },
  { slug: "proud-diyer", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767646997/arena-ai/personas/persona_the_proud_diyer_1767646996498.jpg" },
  { slug: "loyal-existing-provider", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767647017/arena-ai/personas/persona_the_loyal_existing_provider_customer_1767647016967.jpg" },
  { slug: "looks-fine-optimist", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767647036/arena-ai/personas/persona_the_looks_fine_optimist_1767647036309.jpg" },
  { slug: "weed-indifferent", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767647054/arena-ai/personas/persona_the_weed_indifferent_homeowner_1767647053911.jpg" },
  { slug: "skeptic", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767647073/arena-ai/personas/persona_the_skeptic_1767647073173.jpg" },
  { slug: "price-first-shopper", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767647092/arena-ai/personas/persona_the_price_first_shopper_1767647091980.jpg" },
  { slug: "thats-expensive-reactor", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767647110/arena-ai/personas/persona_the_expensive_reactor_1767647109863.jpg" },
  { slug: "competitor-price-comparer", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767647128/arena-ai/personas/persona_the_competitor_price_comparer_1767647127556.jpg" },
  { slug: "payment-process-resister", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767647146/arena-ai/personas/persona_the_payment_process_resister_1767647146010.jpg" },
  { slug: "stallers", avatar: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1767647165/arena-ai/personas/persona_the_staller_1767647165193.jpg" },
];

async function fixUrls() {
  console.log("Updating persona avatar URLs...\n");
  
  for (const update of updates) {
    const result = await db.update(buyerPersonas)
      .set({ avatar: update.avatar })
      .where(eq(buyerPersonas.slug, update.slug))
      .returning({ slug: buyerPersonas.slug, avatar: buyerPersonas.avatar });
    
    console.log(`Updated ${update.slug}: ${result[0]?.avatar ? '✓' : '✗'}`);
  }
  
  console.log("\nVerifying updates...");
  const all = await db.select({ slug: buyerPersonas.slug, avatar: buyerPersonas.avatar }).from(buyerPersonas);
  for (const p of all) {
    console.log(`${p.slug}: ${p.avatar?.substring(0, 60)}...`);
  }
  
  process.exit(0);
}

fixUrls();
