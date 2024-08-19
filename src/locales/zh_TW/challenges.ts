import { TranslationEntries } from "#app/interfaces/locales";

export const challenges: TranslationEntries = {
  "title": "適用挑戰條件",
  "illegalEvolution": "{{pokemon}} 進化成了不符合\n挑戰條件的寶可夢！",
  "singleGeneration": {
    "name": "單一世代",
    "desc": "你只能使用第{{gen}}\n世代的寶可夢",
    "desc_default": "你只能使用所選\n世代的寶可夢",
    "gen_1": "一",
    "gen_2": "二",
    "gen_3": "三",
    "gen_4": "四",
    "gen_5": "五",
    "gen_6": "六",
    "gen_7": "七",
    "gen_8": "八",
    "gen_9": "九",
  },
  "singleType": {
    "name": "單屬性",
    "desc": "你只能使用{{type}}\n屬性的寶可夢",
    "desc_default": "你只能使用所選\n屬性的寶可夢"
  },
  "freshStart": {
    "name": "Fresh Start",
    "desc": "You can only use the original starters, and only as if you had just started PokéRogue.",
    "value.0": "Off",
    "value.1": "On",
  },
  "inverseBattle": {
    "name": "逆轉之戰",
    "desc": "屬性相克關系被反轉，且沒有任何屬性對其他屬性免疫。\n禁用其他挑戰的成就。",
    "value.0": "關閉",
    "value.1": "開啓",
  }
} as const;
