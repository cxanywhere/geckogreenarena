import notionPersonas from "@/assets/notion-icon-personas.png";
import notionBusy from "@/assets/notion-persona-busy.png";
import notionEcommerce from "@/assets/notion-persona-ecommerce.png";
import notionDemandgen from "@/assets/notion-persona-demandgen.png";
import notionCmo from "@/assets/notion-persona-cmo.png";
import notionCto from "@/assets/notion-persona-cto.png";
import notionBrushoff from "@/assets/notion-persona-brushoff.png";
import notionAbm from "@/assets/notion-persona-abm.png";
import notionRules from "@/assets/notion-persona-rules.png";
import notionCfo from "@/assets/notion-persona-cfo.png";
import notionPerformance from "@/assets/notion-persona-performance.png";
import notionDiy from "@/assets/notion-persona-diy.png";
import notionDigital from "@/assets/notion-persona-digital.png";
import notionLoyal from "@/assets/notion-persona-loyal.png";
import notionSecurity from "@/assets/notion-persona-security.png";
import notionOptimist from "@/assets/notion-persona-optimist.png";
import notionAnalyst from "@/assets/notion-persona-analyst.png";
import notionIndifferent from "@/assets/notion-persona-indifferent.png";
import notionSkeptic from "@/assets/notion-persona-skeptic.png";
import notionProduct from "@/assets/notion-persona-product.png";
import notionPrice from "@/assets/notion-persona-price.png";
import notionProcurement from "@/assets/notion-persona-procurement.png";
import notionMarketing from "@/assets/notion-persona-marketing.png";
import notionExpensive from "@/assets/notion-persona-expensive.png";
import notionComparer from "@/assets/notion-persona-comparer.png";
import notionCx from "@/assets/notion-persona-cx.png";
import notionPayment from "@/assets/notion-persona-payment.png";
import notionFounder from "@/assets/notion-persona-founder.png";
import notionInnovation from "@/assets/notion-persona-innovation.png";
import notionStaller from "@/assets/notion-persona-staller.png";

export const personaIconMap: Record<string, string> = {
  "busy-professional": notionBusy,
  "vp-ecommerce": notionEcommerce,
  "demand-gen-director": notionDemandgen,
  "vp-marketing-cmo": notionCmo,
  "cto": notionCto,
  "brush-off-defender": notionBrushoff,
  "abm-field-marketing-leader": notionAbm,
  "rule-first-homeowner": notionRules,
  "cmo": notionCmo,
  "abm-field-marketing": notionAbm,
  "cfo": notionCfo,
  "performance-marketing-manager": notionPerformance,
  "proud-diyer": notionDiy,
  "director-digital": notionDigital,
  "loyal-existing-provider": notionLoyal,
  "looks-fine-optimist": notionOptimist,
  "it-security": notionSecurity,
  "data-analyst": notionAnalyst,
  "weed-indifferent": notionIndifferent,
  "skeptic": notionSkeptic,
  "head-product": notionProduct,
  "price-first-shopper": notionPrice,
  "procurement-lead": notionProcurement,
  "marketing-manager": notionMarketing,
  "thats-expensive-reactor": notionExpensive,
  "competitor-price-comparer": notionComparer,
  "cx-director": notionCx,
  "payment-process-resister": notionPayment,
  "founder-ceo": notionFounder,
  "innovation-lead": notionInnovation,
  "stallers": notionStaller,
};

export const defaultPersonaIcon = notionPersonas;

export function getPersonaIcon(slug: string): string {
  return personaIconMap[slug] || defaultPersonaIcon;
}
