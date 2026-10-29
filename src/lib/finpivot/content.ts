import {
  articles,
  audiences,
  capabilities,
  channels,
  closeScript,
  firstWeek,
  flow,
  funnelMetrics,
  gates,
  partnerLine,
  products,
  questionGroups,
  rhythm,
  scripts,
  seoDirections,
  templateSeeds,
  topics,
  weeks,
  wontDo,
} from "@/lib/finpivot/copy";
import * as en from "@/lib/finpivot/en-content";
import type { Locale } from "@/lib/finpivot/glossary";
import { E2E_STEPS } from "@/lib/finpivot/flow";

const zh = {
  products,
  flow,
  wontDo,
  gates,
  audiences,
  capabilities,
  questionGroups,
  closeScript,
  scripts,
  partnerLine,
  channels,
  topics,
  seoDirections,
  weeks,
  funnelMetrics,
  rhythm,
  firstWeek,
  articles,
  templateSeeds,
  e2eSteps: E2E_STEPS,
};

const enPack = {
  products: en.products,
  flow: en.flow,
  wontDo: en.wontDo,
  gates: en.gates,
  audiences: en.audiences,
  capabilities: en.capabilities,
  questionGroups: en.questionGroups,
  closeScript: en.closeScript,
  scripts: en.scripts,
  partnerLine: en.partnerLine,
  channels: en.channels,
  topics: en.topics,
  seoDirections: en.seoDirections,
  weeks: en.weeks,
  funnelMetrics: en.funnelMetrics,
  rhythm: en.rhythm,
  firstWeek: en.firstWeek,
  articles: en.articles,
  templateSeeds: en.templateSeeds,
  e2eSteps: en.e2eSteps,
};

export function content(locale: Locale) {
  return locale === "en" ? enPack : zh;
}
