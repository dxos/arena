# Game CLI

Game CLI is operable within a party, so one needs to create or join the party:

```
$ dx party create
```

List existing games:

```
[dx]> game list
[dx]> [{"id":1588200329869,"title":"Vaw."}]
```

Create new game:

```
[dx]> game create <title>
{"id":1588200460978, "title": "your title"}
```

Join a game:

```
[dx]> game join <id>

 | | 
-+-+-
 | | 
-+-+-
 | | 
```

Play moves:

```
[dx]> game move a1 0
[dx]>

o| |
-+-+-
 | |
-+-+-
 | |

[dx]> game move a2 1
[dx]>

o|x|
-+-+-
 | |
-+-+-
 | |

[dx]> game move b1 0
[dx]>

o|x|
-+-+-
o| |
-+-+-
 | |
```
