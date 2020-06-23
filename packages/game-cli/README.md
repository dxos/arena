# Game CLI

Game CLI is operable within a party, so one needs to create or join the party:

```
$ wire party create
```

List existing games:

```
[wire]> game list
[wire]> [{"__type_url":"testing.game.Game","gameId":1588200329869,"title":"Vaw."}]
```

Create new game:

```
[wire]> game create
{"gameId":1588200460978}
```

Play moves:

```
[wire]> game move a1 0
[wire]>

o| |
-+-+-
 | |
-+-+-
 | |

[wire]> game move a2 1
[wire]>

o|x|
-+-+-
 | |
-+-+-
 | |

[wire]> game move b1 0
[wire]>

o|x|
-+-+-
o| |
-+-+-
 | |
```
