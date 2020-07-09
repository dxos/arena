# Game Bot

## Development

BotFactory running in local-dev mode could be used during Bot development process. This will bypass WNS and IPFS and load bot directly from source. In order to start BotFactory, such command could be used from the root folder of the bot package:

```
$ wire bot factory start --local-dev
```

This will produce output that contains topic.

New instance of bot could be spawned using either CLI or Invitation Popup in GUI.

### CLI

In new terminal, use CLI to create a party:

```
$ wire party create
```

This command will send CLI into interactive mode.
Within the created party, create new game:

```
[wire]> game create
{"gameId":1588198293252}
```

From that, etiher make a first move, or invite a bot. In latter case bot will make first move.

Make move:

```
[wire]> game move a1 0
[wire]>

o| |
-+-+-
 | |
-+-+-
 | |

[wire]>
```

Invite bot using topic from BotFactory output and spec from recently created game:

```
[wire]> bot spawn --bot-id="wrn:bot:dxos.org/game#1.0.1" --topic <bot-factory-topic> --spec='{"gameId":1588198293252}'
```
