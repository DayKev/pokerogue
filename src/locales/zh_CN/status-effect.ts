import { StatusEffectTranslationEntries } from "#app/interfaces/locales.js";

export const statusEffect: StatusEffectTranslationEntries = {
  none: {
    name: "无",
    description: "",
    obtain: "",
    obtainSource: "",
    activation: "",
    overlap: "",
    heal: ""
  },
  poison: {
    name: "中毒",
    description: "中毒",
    obtain: "{{pokemonNameWithAffix}}中毒了！",
    obtainSource: "{{pokemonNameWithAffix}}因{{sourceText}}中毒了！",
    activation: "{{pokemonNameWithAffix}}受到了毒的伤害！",
    overlap: "{{pokemonNameWithAffix}}已经中毒了！",
    heal: "{{pokemonNameWithAffix}}中的毒彻底清除了！"
  },
  toxic: {
    name: "剧毒",
    description: "中毒",
    obtain: "{{pokemonNameWithAffix}}中了剧毒！",
    obtainSource: "{{pokemonNameWithAffix}}因{{sourceText}}中了剧毒！",
    activation: "{{pokemonNameWithAffix}}受到了毒的伤害！",
    overlap: "{{pokemonNameWithAffix}}已经中毒了！",
    heal: "{{pokemonNameWithAffix}}中的毒彻底清除了！"
  },
  paralysis: {
    name: "麻痹",
    description: "麻痹",
    obtain: "{{pokemonNameWithAffix}}麻痹了，很难使出招式！",
    obtainSource: "{{pokemonNameWithAffix}}被{{sourceText}}麻痹了，很难使出招式！",
    activation: "{{pokemonNameWithAffix}}因身体麻痹而无法行动！",
    overlap: "{{pokemonNameWithAffix}}已经麻痹了！",
    heal: "{{pokemonNameWithAffix}}的麻痹治愈了！"
  },
  sleep: {
    name: "睡眠",
    description: "睡眠",
    obtain: "{{pokemonNameWithAffix}}睡着了！",
    obtainSource: "{{pokemonNameWithAffix}}因{{sourceText}}睡着了！",
    activation: "{{pokemonNameWithAffix}}正在呼呼大睡。",
    overlap: "{{pokemonNameWithAffix}}已经睡着了！",
    heal: "{{pokemonNameWithAffix}}醒了！"
  },
  freeze: {
    name: "冰冻",
    description: "冰冻",
    obtain: "{{pokemonNameWithAffix}}冻住了！",
    obtainSource: "{{pokemonNameWithAffix}}因{{sourceText}}冻住了！",
    activation: "{{pokemonNameWithAffix}}因冻住了而无法行动！",
    overlap: "{{pokemonNameWithAffix}}已经冻住了！",
    heal: "{{pokemonNameWithAffix}}治愈了冰冻状态！"
  },
  burn: {
    name: "灼伤",
    description: "灼伤",
    obtain: "{{pokemonNameWithAffix}}被灼伤了！",
    obtainSource: "{{pokemonNameWithAffix}}因{{sourceText}}被灼伤了！",
    activation: "{{pokemonNameWithAffix}}受到了灼伤的伤害！",
    overlap: "{{pokemonNameWithAffix}}已经被灼伤了！",
    heal: "{{pokemonNameWithAffix}}的灼伤治愈了！"
  },
} as const;
