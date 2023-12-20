import { z } from "zod";

export namespace Variation {
  export const Schema = z.object({ id: z.string(), displayName: z.string() });
}

export type Variation = z.infer<typeof Variation.Schema>;

export namespace GameProvides {
  export const Schema = z.object({
    game: z.object({
      displayName: z.string(),
      variations: z.array(Variation.Schema),
      timeControlOptions: z.unknown().optional(),
    }),
  });
}

export type GameProvides = z.infer<typeof GameProvides.Schema>;
