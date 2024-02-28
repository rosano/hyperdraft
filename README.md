<a href="https://hyperdraft.rosano.ca"><img alt="Project logo" src="https://static.rosano.ca/wikiavec/identity.svg" width="64" /></a>

# [Hyperdraft](https://hyperdraft.rosano.ca)

_Turn your text notes into a website_

<a href="https://hyperdraft.rosano.ca">Hyperdraft</a> helps you organize your thinking with text notes, and makes it simple to turn them into a website. Inspired by modeless and keyboard-centric [Notational Velocity](http://notational.net/) it lets you quickly and easily network your ideas via a simple double-bracket syntax. Use it for ideas, todo lists, brainstorming, recipes, reading notes, journaling, or anything involving writing. Read the <a href="https://hyperdraft.rosano.ca">guide</a> for more details.

<a href="https://hyperdraft.rosano.ca/write"><img alt="Open app" src="http://static.rosano.ca/_shared/_RCSAppButton.svg" /></a>

## Architecture

The project follows a [Universal folder structure](https://rosano.hmm.garden/01f71kp52knc5nnv08qr9kzj3m) and is a large collection of mostly small modules or functions that are put together using [Svelte](https://svelte.dev) and [Rollup](https://rollupjs.org). With the exception of a few 'global' or 'magic' things such as the localization function `OLSKLocalized`, most resources used by a module should be in the same folder or referenced by path name.

Routing, rendering markdown content, and serving pages is done via a Node.js server (usually configured in the *controller.js* files).

## Development Setup

(For a deeper dive, watch [the tutorial](https://rosano.hmm.garden/01f62t5yseb053m024v1mczbzy)).

Install [Node.js and npm](https://nodejs.org/en/download/), then:

```
npm run setup
```

This should create an `.env` file if there is none. If you encounter errors referring to this file, you can find missing variables in `.env-sample`.

## Running

### Start the Rollup process to build and reload automatically

```
npm run watch
```

### Start the Node.js server to view in the browser

```
npm start
```

It should be accessible at <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.

## Testing

See [Testing logic and interfaces](https://rosano.hmm.garden/01f7v3hk3txz5d0v9ms467x8bz) for a tutorial.

### Run logic tests

```
npm test
```

### Run interface tests

```
npm test ui
```

To filter interface test paths by string:

```
npm test ui match=write
```

To filter interface test paths by JavaScript regular expressions:

```
npm test ui match='/(detail|vitrine)/'
```

## ❤️

Help me keep creating projects that are public, accessible for free, and open-source.

<a href="https://rosano.ca/back"><img alt="Become a backer" src="https://static.rosano.ca/_shared/_RCSBackButton.svg" /></a>

## License

The code is released under a [Hippocratic License](https://firstdonoharm.dev), modified to exclude its use for surveillance capitalism and also to require large for-profit entities to purchase a paid license.

## Questions

Feel free to reach out on [Mastodon](https://rosano.ca/mastodon) or [Twitter](https://rosano.ca/twitter).
