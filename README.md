# Arena

Arena is a browser based, extensible, plugin-driven, peer to peer multiplayer game arena based on [Composer](https://composer.dxos.org), an extensible application environment built on the [DXOS](https://dxos.org) platform.

[🎮 Arena demo](https://arena-app.vercel.app)

## Getting Started

### Run

Run the app with `pnpm`

```bash
pnpm install
pnpm serve
```

### Build

Build the app to the `out` folder

```bash
pnpm build
```

### Test

Run vitest tests with `pnpm`

```bash
pnpm test
```

or in watch mode with:

```bash
pnpm test watch
```

## Games

Currently, Arena supports a variety of games, including:
- **Chess**: The classic game of strategy and tactics.
- **Connect Four Advanced 3D (4x4x4)**: A three-dimensional twist on the beloved game, offering a complex and thrilling challenge.

**Missing your favorite game?** We're looking to expand Arena's collection. If you're interested in adding a new game, we welcome your contributions! Please feel free to submit a pull request.

### Implementing a new game plugin

When adding a new game to the arena-app, you'll be creating a game plugin that integrates with the overall app framework as well as game plugin host.

#### Understanding the plugin framework

The plugin architecture is based on the [@dxos/app-framework](https://github.com/dxos/dxos/tree/main/packages/sdk/app-framework), which facilitates the integration of new functionalities, such as games, into the app. A plugin typically includes metadata (`meta`) and capabilities it provides (`provides`), among other configurations.

The arena-app includes a core game plugin host that facilitates the management of individual game plugins. This core plugin exposes:

- [GameProvides](https://github.com/dxos/arena-app/blob/main/src/plugins/Game/GameProvides.ts) interface: This interface defines the contract that your game plugin must fulfill to integrate with the arena-app. It specifies the structure for game metadata, initialization, player assignment, and more.

- `shouldRenderGame` Helper Function: This utility helps determine whether your game should render a `surface`.

Game state is persisted and replicated using [ECHO](https://docs.dxos.org/guide/platform/). You will need to be familiar with creating, querying and manipulating [ECHO objects](https://docs.dxos.org/guide/platform/#objects) as well as interacting with [ECHO spaces](https://docs.dxos.org/guide/platform/#spaces).

It's important to note that different games have different rendering and data requirements. The game plugin host makes no assumptions about the shape of the game data or the user interface. This flexibility allows for a wide range of games to be implemented, from simple 2D board games to 3D games rendered with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction).

#### A minimal game example

```tsx
// my-game-plugin.tsx
import { PluginDefinition, SurfaceProvides } from "@dxos/app-framework";
import { create } from "@dxos/react-client/echo";
import { GameProvides } from "../Game/GameProvides";
import { shouldRenderGame } from "../Game/shouldRenderGame";
import { MyGameSurface } from "./components/MyGameSurface";

// --- Constants and Metadata -------------------------------------------
export const MyGamePluginMeta = { id: "myid", name: "My Game Plugin" };

// --- Plugin Definition ------------------------------------------------------
type MyGamePluginProvidesCapabilities = SurfaceProvides & GameProvides;

export default function MyGamePlugin(): PluginDefinition<MyGamePluginProvidesCapabilities> {
  return {
    meta: MyGamePluginMeta,

    provides: {
      surface: {
        component: ({ data, role }) => {
          if (shouldRenderGame(data, role, MyGamePluginMeta.id)) {
            return <MyGameSurface id={data.instanceId} />;
          }

          return null;
        },
      },
      game: {
        id: MyGamePluginMeta.id,
        displayName: "My Game Plugin",
        variations: [{ displayName: "Standard", id: "standard" }],
        timeControlOptions: undefined,

        createGame(room, id, variation, _timeControl, players, ordering) {
          // Initialise any starting game state, move arrays, etc. here
          let game = {};

          switch (ordering) {
            case "creator-first":
              game.players = {
                player1: players.creatorId,
                player2: players.challengerId,
              };
              break;
            case "challenger-first":
              game.players = {
                player1: players.challengerId,
                player2: players.creatorId,
              };
              break;
            case "random":
              const random = Math.random() > 0.5;
              game.players = {
                player1: random ? players.creatorId : players.challengerId,
                player2: random ? players.challengerId : players.creatorId,
              };
              break;
            default:
              throw new Error(`Unsupported ordering: ${ordering}`);
          }

          room.db.add(create({ type: "game-my-game-type", gameId: id, ...game }));
        },
      },
    },
  };
}

```

The rendered game surface is provided with some ECHO object ID, it's the game plugin authors responsibility to query and mutate the game object as required. Here's an example for a simple game surface:

```tsx
import { useQuery } from "@dxos/react-client/echo";
import { useActiveRoom } from "../../RoomManager/hooks/useActiveRoom";

export function MyGameSurface({ id }: { id: string }) {
  const space = useActiveRoom();
  let [dbGame] = useQuery(space, { type: "game-my-game-type", gameId: id });

  if (!dbGame) return null;

  // NOTE: Currently casting due to use of untyped `create` call
  //   Expect to migrate to ECHO Schema for type safety.
  return <GameImplementation game={dbGame as any as GameState}>;
}
```



## Contributing

Your contributions make Arena better for everyone. Whether you're adding new games, enhancing the platform, or fixing bugs, we welcome your pull requests.
