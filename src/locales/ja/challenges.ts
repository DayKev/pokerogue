import { TranslationEntries } from "#app/interfaces/locales";

export const challenges: TranslationEntries = {
  "title": "チャレンジを　設定",
  "illegalEvolution": "{{pokemon}}は　このチャレンジで\n対象外の　ポケモンに　なってしまった！",
  "singleGeneration": {
    "name": "単一世代",
    "desc": "{{gen}}世代からの　ポケモンしか　使えません",
    "desc_default": "選んだ　世代からの　ポケモンしか　使えません",
    "gen_1": "1",
    "gen_2": "2",
    "gen_3": "3",
    "gen_4": "4",
    "gen_5": "5",
    "gen_6": "6",
    "gen_7": "7",
    "gen_8": "8",
    "gen_9": "9",
  },
  "singleType": {
    "name": "単一タイプ",
    "desc": "{{type}}タイプの　ポケモンしか　使えません",
    "desc_default": "選んだ　タイプの　ポケモンしか　使えません"
    //types in pokemon-info
  },
  "freshStart": {
    "name": "出直し",
    "desc": "ポケローグを　始めた　ばかりの　ような　ままで　ゲーム開始の　最初のパートナーしか　使えません",
    "value.0": "オフ",
    "value.1": "オン",
  },
  "inverseBattle": {
    "name": "Inverse Battle",
    "desc": "Type matchups are reversed and no type is immune to any other type.\nDisables other challenges' achievements.",
    "value.0": "Off",
    "value.1": "On",
  }
} as const;
