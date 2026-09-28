# React + Phaser template

Phaser renders the game world on a canvas; React renders menus/HUD as DOM on top of it, styled with CSS Modules.

## Commands

- `npm run dev`: Vite dev server on :5173 (`.claude/launch.json` config `dev`)
- `npm run typecheck`: `tsc -b`
- `npm run lint`: oxlint
- `npm run format`: Prettier
- `npm run build`: typecheck + production build to `dist/`

Before calling a change done: `npm run typecheck && npm run lint && npm run build`, and for runtime changes check the game in the browser (console errors, one `<canvas>`).

## Versions: newer than most training data

- **Phaser 4**, not 3. Scene/GameObject API is mostly the same, but check `node_modules/phaser/types/phaser.d.ts` before using a v3 API from memory. There is no `resolution` config option.
- **MobX 7**: only `makeAutoObservable`/`makeObservable` or TC39 decorators (no legacy decorators). `observable.ref`/`computed.struct`/`action.bound` etc. are now named exports: `observableRef`, `computedStruct`, `actionBound`. React bindings come from `mobx-react-lite` (`observer`); don't add `mobx-react`'s `Provider`/`inject`.
- **TypeScript 7** (native `tsc`, no JS compiler API). This is why the linter is **oxlint**, not ESLint: `typescript-eslint` only supports TS < 6.1. Don't add ESLint without pinning TS 6.
- **Vite 8** (Rolldown): build options live under `build.rolldownOptions`, chunks under `output.codeSplitting`.

## Architecture

- `src/game/`: pure Phaser. Never imports React. `startGame(parent)` in `src/game/index.ts` is its only entry point.
- `src/components/`, `src/screens/`: React. `PhaserGame` owns the `Phaser.Game` lifecycle, `Hud` is the overlay.
- `src/store/`: MobX stores, the **only** bridge between the two worlds:
  - Phaser → React: a scene calls a store action, `observer` components re-render.
  - React → Phaser: UI calls a store action, the scene subscribes with `reaction()`.
- Static game assets go in `public/assets/` and load by relative URL (`this.load.image('hero', 'assets/hero.png')`), because `base: './'`. Shaders: `import src from './shader.frag?raw'`.

## Rules that prevent real bugs

- Wrap every subscription that outlives a scene in `disposeOnShutdown(scene, dispose)` (`src/game/utils`): MobX `reaction`/`autorun`, listeners on game-wide emitters (`this.scale`, `this.game.events`, `window`). Otherwise the scene leaks on restart and the store keeps calling a destroyed scene (every HMR update and StrictMode remount destroys the game).
- Don't write per-frame values (positions, timers) to the store: each change re-renders every observer that reads it. Store what the UI shows, throttle if needed.
- Overlay containers above the canvas use `pointer-events: none`; interactive children set `pointer-events: auto`.
- `PhaserGame`'s effect intentionally depends on `[startGame]` and defers creation with `setTimeout`. Don't "fix" either: `[]` breaks hot restart of scenes under StrictMode (React 19 Fast Refresh keeps the stale game), and creating the game synchronously boots a second game on StrictMode's dev remount.
- Phaser keyboard capture calls `preventDefault` on captured keys at window level, so it breaks typing into React inputs. Call `this.input.keyboard?.disableGlobalCapture()` (or disable the keyboard) while a text field is open.

## Conventions

- Components live in `Folder/index.tsx` with a default export, styles next to them in `Folder/styles.module.css` (camelCase class names, `import styles from './styles.module.css'`).
- Design tokens (colors, fonts) are CSS variables in `src/styles/global.css`; use `var(--…)` instead of hardcoded colors. No CSS-in-JS or UI kit.
- Prettier config in `.prettierrc` (single quotes, width 100). Code and comments are in English.
