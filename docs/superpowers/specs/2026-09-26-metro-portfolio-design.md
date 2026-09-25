# Metro Portfolio Design

## Purpose

Build a personal GitHub Pages site that serves two related purposes:

- present a concise portfolio and personal introduction;
- host small browser-based tools used while solving programming problems.

The site uses SvelteKit and a Windows Phone 8.1-inspired Metro interface. It should feel cohesive, remain easy to extend, and let new portfolio entries or tools be added mostly through data rather than duplicated markup.

## Technical Foundation

- Use SvelteKit with `adapter-static` for static GitHub Pages deployment.
- Give each actual tool a stable route under `/tools/[slug]` so it can be refreshed, bookmarked, and shared directly.
- Keep tile definitions separate from rendering components.
- Use TypeScript for tile data and validation.
- Avoid runtime services for the initial version; all content and tools run as static client-side assets.

## Information Architecture

The home page is a Metro-style start screen made entirely of tiles.

- A large introduction tile shows the name, role, and a short summary. It may optionally include a portrait.
- Portfolio, career, contact, and external links use ordinary tiles.
- Programming-problem tools are grouped inside a folder tile.
- Activating the tools folder slides the home grid left and brings the tool grid in from the right.
- Opening an individual tool navigates to its stable tool route.
- Browser history and the visible back control produce the same navigation result.

## Suggested Source Layout

```text
src/
├── lib/
│   ├── components/
│   │   ├── TileGrid.svelte
│   │   ├── TileRenderer.svelte
│   │   ├── StandardTile.svelte
│   │   ├── FolderTile.svelte
│   │   └── ActionTile.svelte
│   ├── tiles/
│   │   ├── types.ts
│   │   ├── presets.ts
│   │   └── home.ts
│   └── stores/
│       ├── navigation.ts
│       └── theme.ts
└── routes/
    ├── +page.svelte
    └── tools/
        └── [slug]/
            └── +page.svelte
```

`TileGrid` owns responsive placement. `TileRenderer` selects a tile component from the tile's discriminated type. Tile components own presentation and activation behavior, while the stores own navigation and theme state.

## Tile Model

Tiles use a discriminated union so each behavior is explicit and type-safe.

```ts
type TileSize = 'small' | 'medium' | 'wide' | 'large';

type BaseTile = {
  id: string;
  title: string;
  size: TileSize;
  color?: TileColor;
  icon?: string;
  ariaLabel?: string;
};

type StandardTile = BaseTile & {
  type: 'standard';
  description?: string;
  href?: string;
  contentComponent?: Component;
};

type FolderTile = BaseTile & {
  type: 'folder';
  children: Tile[];
};

type ActionTile = BaseTile & {
  type: 'action';
  action: 'toggle-theme';
};

type Tile = StandardTile | FolderTile | ActionTile;
```

Most tiles are data-only. `contentComponent` is an escape hatch for a small number of rich tiles, such as the introduction tile; it is not the default content mechanism.

Tile IDs must be unique within the full home tile tree. External destinations are identified during implementation with an explicit link property rather than inferred from URL text.

## Size Presets and Responsive Grid

The grid uses four size presets:

| Preset | Grid span |
| --- | --- |
| `small` | 1 × 1 |
| `medium` | 2 × 2 |
| `wide` | 4 × 2 |
| `large` | 4 × 4 |

Responsive column counts are:

- mobile: 4 columns;
- tablet: 6 columns;
- desktop: 8 columns maximum.

The content grid has a 1152 px maximum width. Overflow continues vertically, preserving the phone-like vertical scrolling model. Tiles flow to the next row when their requested span does not fit the remaining space.

## Visual Language

- Use square, flat tiles without rounded corners or drop shadows.
- Use narrow, consistent gaps between tiles.
- Use large page headings, restrained typography, and strong hierarchy inspired by Windows Phone 8.1.
- Place standard tile titles and icons near the lower-left corner.
- Use cyan blue as the default accent, while allowing controlled semantic tile colors through design tokens.
- Keep all foreground/background combinations at accessible contrast levels in both themes.

The design takes inspiration from Windows Phone rather than attempting a pixel-perfect reproduction. Portfolio readability and responsive behavior take priority where the historical interface conflicts with modern web use.

## Themes

The site supports light and dark themes.

- On the first visit, choose the operating system preference via `prefers-color-scheme`.
- Provide a small action tile that toggles directly between light and dark.
- Save an explicit user choice in `localStorage`.
- On later visits, the saved choice takes precedence over the operating system preference.
- Apply the initial theme before the main UI is painted to avoid a visible incorrect-theme flash.
- Define background, foreground, accent, focus, and tile colors as shared CSS custom properties.

Dark mode uses a black or near-black background with light text and cyan accents. Light mode uses a light gray background with dark text and a darker blue accent.

## Motion and Interaction

- Tiles give a short pressed response on pointer or keyboard activation.
- Folder navigation uses a horizontal slide: current content exits left and destination content enters from the right.
- Individual tools may use a restrained scale transition that suggests the selected tile opening.
- Interactive tiles have visible keyboard focus and semantic labels.
- Respect `prefers-reduced-motion` by replacing large movement with short fades or immediate state changes.
- Preserve usable pointer targets even where a tile is visually compact.

## Failure and Empty States

- Unknown tool routes show a Metro-styled 404 page with a way back to the tool list.
- Missing optional icons or content fall back to a title-only tile.
- Empty folders display an explicit empty-state message and a back control.
- Development validation reports unsupported sizes and duplicate IDs.
- External link behavior is explicit in tile data and visually or semantically identifiable.

## Verification

The initial implementation should include:

- TypeScript and Svelte type checking;
- unit tests for tile validation and preset mapping;
- component tests for grid rendering, folder navigation, and theme toggling;
- Playwright coverage for the main visitor flows.

The critical scenarios are the 4-, 6-, and 8-column layouts; direct and back navigation; theme restoration after reload; keyboard-only operation; reduced-motion behavior; and invalid tool routes.

## Initial Scope Boundaries

The first version establishes the reusable shell, sample portfolio content, the tools folder, and one simple demonstration tool route. It does not require a CMS, server-side API, authentication, analytics, or editable layout. New tools and portfolio entries can be added in later focused changes after the shared tile system is stable.
