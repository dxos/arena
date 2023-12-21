import { z } from "zod";

export namespace Variation {
  export const Schema = z.object({ id: z.string(), displayName: z.string() });
}

export type Variation = z.infer<typeof Variation.Schema>;

export namespace GameProvides {
  export const Schema = z.object({
    game: z.object({
      id: z.string(),
      displayName: z.string(),
      variations: z.array(Variation.Schema),
      timeControlOptions: z.unknown().optional(),
    }),
  });
}

export const playerOrdering = ["creator-first", "random", "challenger-first"] as const;

export type PlayerOrdering = (typeof playerOrdering)[number];

export type GameProvides = z.infer<typeof GameProvides.Schema> & {
  game: {
    createGame: (
      id: string,
      variation: string,
      timeControl: unknown,
      players: [string, string],
      ordering: PlayerOrdering
    ) => void;
  };
};
