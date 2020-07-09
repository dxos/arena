# Game Bot

This is a Bot for playing chess games.
Core model is located at [Chess Core](../../packages/chess-core/README.md).
Currently the bot is a player of black pieces, making random moves.

## Run the Bot locally

Use two terminals.

### First terminal

1. Run the factory:

```bash
cd examples/chess-bot
yarn wire bot factory start --local-dev
```

Copy the bot factory topic.

### Second terminal

1. Create or join a party:

```bash
yarn wire party create
// or
yarn wire party join <party ID> --url <copied invite URL>
```

2. Create or join a chess game:

```bash
chess create
// or
chess join 1588764145416
```

4. Spawn the bot:

```bash
bot spawn --bot-id="wrn:bot:dxos.org/chess" --topic <bot-factory-topic> --spec='{"id":1588764145416}'
```

4. Keep playing as a white player, as using [CLI](../../packages/chess-cli/README.md) or [App](../../apps/chess-app/README.md)

5. The bot will be responding as a black player

### Publishing

*Assuming MacOS at this point*

1. Pulish and register

```bash
yarn package:macos-x64
yarn wire bot publish
yarn wire bot register
```

2. Query to make sure it's there

```bash
yarn wire bot query --name 'dxos.org/chess'
```

3. Run the bot factory NOT-locally:

```bash
cd examples/chess-bot
yarn wire bot factory start
```

4. Spawn the bot as before. It will be downloaded from WNS/IPFS
