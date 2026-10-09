import {
  MAX_REGULAR_POKEMON_TYPE,
  MIN_REGULAR_POKEMON_TYPE,
  PokemonType,
  type RegularPokemonType,
} from "#enums/pokemon-type";
import { TimeOfDay } from "#enums/time-of-day";
import { isBetween } from "#utils/common";
import { getEnumValues } from "#utils/enums";

/** The maximum candy a starter is allowed to have. */
export const MAX_STARTER_CANDY_COUNT = 9999;

export const DAY_TIME = Object.freeze([TimeOfDay.DAWN, TimeOfDay.DAY]);

export const NIGHT_TIME = Object.freeze([TimeOfDay.DUSK, TimeOfDay.NIGHT]);

/** The list of {@linkcode RegularPokemonType}s (excludes Typeless and Stellar) */
export const REGULAR_POKEMON_TYPES: readonly RegularPokemonType[] = Object.freeze(
  getEnumValues(PokemonType).filter(t => isBetween(t, MIN_REGULAR_POKEMON_TYPE, MAX_REGULAR_POKEMON_TYPE)),
) as RegularPokemonType[];
