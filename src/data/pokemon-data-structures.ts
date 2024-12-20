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

// #region stuff to create/modify
export enum LegendType {
  NONE,
  SUBLEGENDARY,
  LEGENDARY,
  MYTHICAL
}

// formerly PartyMemberStrength, renamed for clarity
export enum EnemyPartyMemberStrength {
  WEAKEST,
  WEAKER,
  WEAK,
  AVERAGE,
  STRONG,
  STRONGER,
}

/**
 * change to linear evolution delay chance (ie: Bulbasaur evolves at 16 normally,
 * with medium delay it would have a 10% chance to be ivysaur
 * starting at lv17, 20% at lv18, ... and 100% chance to be ivysaur at lv26).
 *
 * higher "EnemyPartyMemberStrength" values would reduce the delay?
 * or use a separate delay value for trainers?
 *
 * increase # of enum members?
 *
 * rename from `SpeciesWildEvolutionDelay`
 */
export enum EnemyEvolutionDelay {
  NONE,
  SHORT,     // 5
  MEDIUM,    // 10
  LONG,      // 15
  VERY_LONG, // 20
  NEVER,
}
// #endregion

// #region just collecting/connecting information together, exact data structures tbd
interface EvolutionConditions {
  level?: number;
  item?: any; // gimmighoul goes here...?
  move?: Moves | Moves[];
  moveOfType?: Type; // onix -> steelix needs steel type move, ...
  timeOfDay?: TimeOfDay | TimeOfDay[];
  gender?: Gender;
  //spaceInParty?: boolean; // for shedinja; could be handled by the evolution function instead since you can't go "nincada -> shedinja" directly
  caughtPokemon?: unknown; // "mantyke -> mantine" (needs caught remoraid), ...
  typeInParty?: Type | Type[]; // currently only "pancham -> pangoro", kinda awkward
  activeWeather?: WeatherType | WeatherType[];
  nature?: Nature | Nature[];
  // "tandemaus -> maushold (form)" and "dunsparce -> dudunsparce (form)" uses rng... handle with evolution function?
  friendship?: number;
  biome?: Biome | Biome[];
}

class PokemonEvolution {
  preEvolution?: {
    id: Species;
    formKey?: string | null; // `null` = target pokemon has no forms but current does; `undefined` = use same form key
  };
  evolution: {
    id: Species;
    conditions: EvolutionConditions;
    formKey?: string | null; // same as above
    expectedEnemyEvolveLevel?: number; // used if the pokemon doesn't evolve by level, as a baseline
  };
  enemyDelay: EnemyEvolutionDelay = EnemyEvolutionDelay.NONE;
}

export class PokemonSpeciesData {
  id: Species;
  name: string;
  generation: number; // if we're separating pokemon by generation (ie: `generation-1.json`, ...), do we need to specify this as part of the pokemon object in the json file itself?
  legendType: LegendType = LegendType.NONE;
  speciesText: string;
  type1: number;
  type2?: number;
  height: number;
  weight: number;
  ability1: Abilities;
  ability2: Abilities = Abilities.NONE;
  abilityHidden: Abilities = Abilities.NONE;
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
  malePercent?: number; // `undefined` = genderless
  genderDiffs: boolean = false;
  canChangeForm: boolean = false;
  forms: PokemonForm[] = [];
  evolutions?: PokemonEvolution[];
  isStarterSelectable: boolean = false;
}
// #endregion
