# chess-cli

This is a CLI extension for playing chess games.
Core model is located at [Chess Core](../chess-core/README.md).

## Initial linking

Until this [issue](https://github.com/wirelineio/incubator/issues/886) is resolved, there are some step required in order to run/develop this extension outside of the `incubator` repository:

1. Link the chess cli package:
```bash
cd packages/chess-cli
yarn link
```

2. Use the linked cli package in incubator:
```bash
cd incubator
yarn link "@dxos/chess-cli"
```

3. That should solve the issue for now

## Running the CLI

Chess CLI is operable within a party, so one needs to create or join a party:

```bash
yarn wire party create
```

### Connecting to a browser party

1. Create the party in the browser
2. Copy the party ID
3. Create the invite link
4. Join the party from CLI:

```bash
yarn wire party join <party ID> --url <copied invite URL>
```

## Available commands

### Create

Create new game:

```bash
[wire]> chess create <title>
{"id":1588255463315}
```

### List

List existing games:

```bash
[wire]> chess list
[wire]> [{"__type_url":"testing.chess.Game","id":1588255463315,"title":"Sef."}]
```

### Join

Join an existing game:

```bash
[wire]> chess join 1588255463315
[wire]> [{"__type_url":"testing.chess.Game","id":1588255463315,"title":"Sef."}]
```

### Move

Make a move:

- `chess move <from> <to>`

Example:

```bash
[wire]> chess move a2 a3
[wire]> 
   +------------------------+
 8 | r  n  b  q  k  b  n  r |
 7 | p  p  p  p  p  p  p  p |
 6 | .  .  .  .  .  .  .  . |
 5 | .  .  .  .  .  .  .  . |
 4 | .  .  .  .  .  .  .  . |
 3 | P  .  .  .  .  .  .  . |
 2 | .  P  P  P  P  P  P  P |
 1 | R  N  B  Q  K  B  N  R |
   +------------------------+
     a  b  c  d  e  f  g  h
```
