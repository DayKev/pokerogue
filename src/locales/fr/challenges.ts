import { TranslationEntries } from "#app/interfaces/locales";

export const challenges: TranslationEntries = {
  "title": "Paramètres du Challenge",
  "illegalEvolution": "{{pokemon}} est devenu\ninéligible pour ce challenge !",
  "singleGeneration": {
    "name": "Monogénération",
    "desc": "Vous ne pouvez choisir que des Pokémon de {{gen}} génération.",
    "desc_default": "Vous ne pouvez choisir que des Pokémon de la génération sélectionnée.",
    "gen_1": "1re",
    "gen_2": "2e",
    "gen_3": "3e",
    "gen_4": "4e",
    "gen_5": "5e",
    "gen_6": "6e",
    "gen_7": "7e",
    "gen_8": "8e",
    "gen_9": "9e",
  },
  "singleType": {
    "name": "Monotype",
    "desc": "Vous ne pouvez choisir que des Pokémon de type {{type}}.",
    "desc_default": "Vous ne pouvez choisir que des Pokémon du type sélectionné."
    //type in pokemon-info
  },
  "freshStart": {
    "name": "Nouveau départ",
    "desc": "Vous ne pouvez choisir que les starters de base du jeu, comme si vous le recommenciez.",
    "value.0": "Non",
    "value.1": "Oui",
  },
  "inverseBattle": {
    "name": "Inverse Battle",
    "desc": "Type matchups are reversed and no type is immune to any other type.\nDisables other challenges' achievements.",
    "value.0": "Off",
    "value.1": "On",
  }
} as const;
