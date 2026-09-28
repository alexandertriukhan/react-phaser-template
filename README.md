# React + Phaser template

A starter for browser games where [Phaser](https://phaser.io) renders the game world on a canvas and [React](https://react.dev) renders menus, HUD and dialogs as regular DOM on top of it. The two sides share state through a [MobX](https://mobx.js.org) store.

The template ships with a tiny example: click the canvas to score points (Phaser → React), pause the scene from a React button (React → Phaser).

## Stack

- **Phaser 4**: game engine
- **React 19** + **CSS Modules**: UI layer
- **MobX 7** (`mobx-react-lite`): state shared between React and Phaser
- **TypeScript 7**, **Vite 8**: tooling
- **oxlint**, **Prettier**: linting and formatting

## Getting started

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:5173. Editing a scene restarts the game in place, without reloading the page or losing React state.

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload          |
| `npm run build`     | Type-check and build for production (`dist/`) |
| `npm run preview`   | Serve the production build locally            |
| `npm run typecheck` | Type-check only                               |
| `npm run lint`      | Lint with oxlint                              |
| `npm run format`    | Format with Prettier                          |

## Project structure

```
public/                  Static files served as-is (game assets go in public/assets/)
src/
  main.tsx               Entry point
  App.tsx                Root component
  styles/global.css      Global reset and design tokens (CSS variables)
  screens/GameScreen/    Game canvas with the HUD layered on top
  components/
    PhaserGame/          Creates and destroys the Phaser.Game
    Hud/                 Overlay UI
  game/                  Pure Phaser code, no React imports
    index.ts             startGame(): game config and scene list
    scenes/              Scenes
    utils/               Helpers such as disposeOnShutdown
  store/                 MobX stores shared by React and Phaser
```

`src/game` never imports React, and React talks to the game only through the store.

## How React and Phaser talk

Both sides import the same store. Keep in it what the UI needs to show or control (score, health, inventory, pause), not per-frame values like positions: every change re-renders the components that read it.

**Phaser → React.** The scene calls a store action, and components wrapped in `observer` re-render:

```ts
// in a scene
this.input.on('pointerdown', () => gameStore.addScore(1));
```

```tsx
// in a component
const Hud = observer(function Hud() {
  return <div>Score: {gameStore.score}</div>;
});
```

**React → Phaser.** The UI calls a store action, and the scene subscribes with a MobX `reaction`:

```ts
create() {
  disposeOnShutdown(
    this,
    reaction(
      () => gameStore.isPaused,
      isPaused => (isPaused ? this.scene.pause() : this.scene.resume()),
    ),
  );
}
```

Wrap every subscription that can outlive the scene in `disposeOnShutdown`: MobX reactions and listeners on game-wide emitters such as `this.scale`, `this.game.events` or `window`. Otherwise a restarted or destroyed scene keeps receiving updates.

## Adding content

- **Scenes**: create a class in `src/game/scenes/` and add it to the `scene` array in `src/game/index.ts`.
- **Assets**: put files in `public/assets/` (create the folder) and load them with a relative path: `this.load.image('hero', 'assets/hero.png')`.
- **Shaders and text files**: import them as strings with `?raw`: `import fragSrc from './glow.frag?raw'`.
- **UI**: add components under `src/components/Name/index.tsx` with styles in `styles.module.css` next to them. Colors and fonts come from the CSS variables in `src/styles/global.css`.

## Gotchas

- **Clicks through the HUD.** The overlay has `pointer-events: none` so clicks reach the canvas; buttons and other controls turn it back on with `pointer-events: auto`.
- **Typing into inputs.** Phaser's keyboard capture calls `preventDefault` on captured keys, so they can't be typed into React inputs. Call `this.input.keyboard?.disableGlobalCapture()` while a text field is open.
- **StrictMode.** React mounts components twice in development. `PhaserGame` defers game creation by one task, so only one game is ever created.

## Deployment

`npm run build` outputs a static site to `dist/`. Asset paths are relative, so the folder works from any sub-path: itch.io, GitHub Pages or any static hosting. Phaser is split into its own chunk, so players keep it cached between game updates.

## License

[MIT](LICENSE)
