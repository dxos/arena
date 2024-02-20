import { Space } from "@dxos/react-client/echo";
import { z } from "zod";

export namespace Variation {
  export const Schema = z.object({ id: z.string(), displayName: z.string() });
}

export type Variation = z.infer<typeof Variation.Schema>;

export namespace GameProvides {
  export const Schema = z.object({
    game: z.object({
      id: z.string().describe("The unique identifier for the game"),
      displayName: z.string().describe("The display name of the game"),
      variations: z.array(Variation.Schema).describe("Possible variations of the game"),
      timeControlOptions: z.unknown().optional().describe("The time control options for the game"),
    }),
  });
}

export const playerOrdering = ["creator-first", "random", "challenger-first"] as const;

export type PlayerOrdering = (typeof playerOrdering)[number];

/**
 * The `GameProvides` interface outlines the requirements for every game in the
 * `arena-app`. This interface ensures that the game can be properly _managed_ and
 * _rendered_ by the game plugin.
 *
 * Each game is uniquely identified by an `id`. It also has a `displayName`
 * which is used for _presentation purposes_ in the UI.
 *
 * A game can have multiple `variations`. These variations could represent
 * different _modes_ or _levels_ of the game. For example, a game of chess could
 * have variations like '_Standard_', '_Fischer Random_', or '_Three-check_'.
 *
 * The `timeControlOptions` field represents the different time control
 * settings that can be applied to the game. This could include settings like
 * _time per move_, _total game time_, etc.
 *
 * The `createGame` function is a part of the `game` object within the
 * `GameProvides` interface. This function is used by the game plugin to
 * delegate control over how games are _created_ and _persisted_.
 */
export type GameProvides = z.infer<typeof GameProvides.Schema> & {
  game: {
    /**
     * Creates a new game with the provided parameters.
     *
     * @param room - The space where the game will be created.
     * @param id - The unique identifier for the game.
     * @param variation - The variation of the game to be created.
     *                  - (Must be one of the games supported variations.)
     * @param timeControl - The time control options for the game.
     * @param players - The players involved in the game, including the creator and challenger.
     * @param ordering - The ordering of the players.
     */
    createGame: (
      room: Space,
      id: string,
      variation: string,
      timeControl: unknown,
      players: { creatorId: string; challengerId: string },
      ordering: PlayerOrdering
    ) => void;
  };
};
