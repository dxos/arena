# OXO Game Pad (Experimental)


# Serve ES Module

For the pad to be consumable from host app, we need to start a server that will provide the module via http:

```
yarn dist:watch
```

This will serve `dist/es` folder at http://localhost:5000/