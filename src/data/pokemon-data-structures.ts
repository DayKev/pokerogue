import { SpeciesWildEvolutionDelay } from "#app/data/balance/pokemon-evolutions";
import { GrowthRate } from "#app/data/exp";
import { Gender } from "#app/data/gender";
import { PokemonForm } from "#app/data/pokemon-species";
import { Type } from "#app/data/type";
import { Abilities } from "#enums/abilities";
import { Biome } from "#enums/biome";
import { Moves } from "#enums/moves";
import { Nature } from "#enums/nature";
import { Species } from "#enums/species";
import { TimeOfDay } from "#enums/time-of-day";
import { WeatherType } from "#enums/weather-type";

// #region stuff to create
export enum LegendType {
  NONE,
  SUBLEGENDARY,
  LEGENDARY,
  MYTHICAL
}
// #endregion

// #region just collecting/connecting information together
interface EvolutionConditions {
  level?: number;
  item?: any;
  move?: Moves | Moves[];
  moveOfType: Type; // onix -> steelix, ...
  timeOfDay?: TimeOfDay | TimeOfDay[];
  gender?: Gender;
  //spaceInParty?: boolean; // for shedinja; could be handled by the evolution function instead since you can't go "nincada -> shedinja" directly
  caughtPokemon?: unknown; // "mantyke -> mantine" (needs caught remoraid), ...
  typeInParty?: Type | Type[]; // pancham -> pangoro
  activeWeather?: WeatherType | WeatherType[];
  nature?: Nature | Nature[];
  // "tandemaus -> maushold (form)" uses rng... handle with evolution function? same with "dunsparce -> dudunsparce (form)"
  friendship?: number;
  biome?: Biome;
  // gimmighoul... :pikastare:
}

class PokemonEvolution {
  id: Species;
  preEvolution?: string; // "from"
  evolution?: {           // "to"
    conditions: EvolutionConditions;
    form?: string;
  };
  wildDelay?: SpeciesWildEvolutionDelay;
}

export class PokemonSpeciesData {
  id: Species;
  name: string;
  generation: number;
  legendType: LegendType;
  speciesText: string;
  type1: number;
  type2?: number;
  height: number;
  weight: number;
  ability1: Abilities;
  ability2?: Abilities;
  abilityHidden?: Abilities;
  baseStatTotal: number;
  baseHP: number;
  baseAtk: number;
  baseDef: number;
  baseSpatk: number;
  baseSpdef: number;
  baseSpd: number;
  catchRate: number;
  baseFriendship: number;
  baseExp: number;
  growthRate: GrowthRate;
  malePercent?: number;
  genderDiffs: boolean;
  canChangeForm: boolean;
  forms: PokemonForm[];
  evolutions: PokemonEvolution[];
  isStarterSelectable: boolean;
}
// #endregion
