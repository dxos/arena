# editor (Experimental React App)

- `yarn` to install dependencies from root.
- `yarn start` to run app. Then open [http://localhost:8080/](http://localhost:8080/)

## Build, Publish & Deploy

Each build will be targeted for a specific public url or deploy path. The env variable `PUBLIC_URL` can be defined in the build process.

```
PUBLIC_URL=/editor yarn webpack -p
```

Then we can publish the dist folder using the `wire app` cli. 

```
yarn wire app publish
```

Register the version on the WNS

```
yarn wire register
```

And finally test locally:

```
yarn wire app serve --app wrn:app:wireline.io/editor --path /editor
```
