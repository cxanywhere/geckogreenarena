import notionPersonas from "@/assets/notion-icon-personas.png";
import notionDemandgen from "@/assets/notion-persona-demandgen.png";
import notionCmo from "@/assets/notion-persona-cmo.png";
import notionAbm from "@/assets/notion-persona-abm.png";
import notionPerformance from "@/assets/notion-persona-performance.png";
import notionEcommerce from "@/assets/notion-persona-ecommerce.png";
import notionCto from "@/assets/notion-persona-cto.png";
import notionCfo from "@/assets/notion-persona-cfo.png";
import notionDigital from "@/assets/notion-persona-digital.png";
import notionSecurity from "@/assets/notion-persona-security.png";
import notionAnalyst from "@/assets/notion-persona-analyst.png";
import notionProduct from "@/assets/notion-persona-product.png";
import notionProcurement from "@/assets/notion-persona-procurement.png";
import notionMarketing from "@/assets/notion-persona-marketing.png";
import notionCx from "@/assets/notion-persona-cx.png";
import notionFounder from "@/assets/notion-persona-founder.png";
import notionInnovation from "@/assets/notion-persona-innovation.png";

export const personaIconMap: Record<string, string> = {
  "demand-gen-director": notionDemandgen,
  "vp-marketing-cmo": notionCmo,
  "abm-field-marketing-leader": notionAbm,
  "performance-marketing-manager": notionPerformance,
  "vp-ecommerce": notionEcommerce,
  "cto": notionCto,
  "cmo": notionCmo,
  "cfo": notionCfo,
  "director-digital": notionDigital,
  "it-security": notionSecurity,
  "data-analyst": notionAnalyst,
  "head-product": notionProduct,
  "procurement-lead": notionProcurement,
  "marketing-manager": notionMarketing,
  "cx-director": notionCx,
  "founder-ceo": notionFounder,
  "innovation-lead": notionInnovation,
};

export const defaultPersonaIcon = notionPersonas;

export function getPersonaIcon(slug: string): string {
  return personaIconMap[slug] || defaultPersonaIcon;
}
