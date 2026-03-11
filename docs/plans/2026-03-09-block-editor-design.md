# Block Editor — Design Document

**Date:** 2026-03-09
**Status:** Approved

## Goals

Build a drag-and-drop block editor that lets developers and non-technical users assemble emails visually from the existing React Email component library, with local persistence and HTML export.

## Stack

- **Vite + React** — separate app in `builder/`
- **dnd-kit** — drag-and-drop (palette → canvas, reorder)
- **@react-email/render** — renders block config to HTML
- **Tailwind CSS** — builder UI styling
- **localStorage** — persistence (named emails)
- **pnpm workspace** — imports shared components from `../src/components/`

## Architecture

```
Email-starter/
├── src/                          # Email templates (existing)
│   ├── components/
│   └── emails/
├── builder/                      # Block editor (new, separate Vite app)
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.tsx           # Main layout (sidebar + canvas + props panel)
│   │   │   ├── BlockPalette.tsx  # Left sidebar: available blocks to drag
│   │   │   ├── Canvas.tsx        # Center: sortable block list (dnd-kit)
│   │   │   ├── PropsPanel.tsx    # Right: edit selected block's properties
│   │   │   ├── Preview.tsx       # Iframe showing rendered email HTML
│   │   │   └── ExportBar.tsx     # Top bar: download HTML, copy to clipboard
│   │   ├── blocks/
│   │   │   ├── registry.ts      # Block type definitions + default props
│   │   │   └── renderers.tsx     # Maps block types → React Email components
│   │   ├── store/
│   │   │   └── editor.ts        # Editor state (block list, selection, persistence)
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── package.json                  # Root (existing)
└── pnpm-workspace.yaml          # Monorepo workspace
```

## Block System

| Block Type    | Maps To               | Editable Props                                 |
| ------------- | --------------------- | ---------------------------------------------- |
| `header`      | Header component      | title, logoUrl, logoAlt                        |
| `hero`        | Img + Heading + Text  | imageUrl, title, subtitle                      |
| `text`        | Text section          | content, alignment                             |
| `button`      | Button component      | text, href, variant (primary/secondary)        |
| `image`       | Img                   | src, alt, width                                |
| `two-column`  | Row + 2 Columns       | left content, right content                    |
| `three-column` | Row + 3 Columns      | content per column                             |
| `divider`     | Hr                    | color, spacing                                 |
| `footer`      | Footer component      | companyName, address, unsubscribeUrl, socials  |

Block state model:

```ts
interface Block {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
}
```

Editor state is an ordered `Block[]`. Drag-and-drop reorders the array.

## Data Flow

```
User drags/edits blocks
        ↓
  Editor state (Block[])  ←→  localStorage (auto-save)
        ↓
  renderers.tsx maps each Block → React Email JSX
        ↓
  render() from @react-email/render → HTML string
        ↓
  Preview iframe (srcDoc={html})
```

- Preview re-renders on every state change (debounced ~300ms)
- Auto-saves to localStorage on every action
- Multiple named emails supported

## UI Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [New Email ▼]  [My Emails ▼]       [Copy HTML] [↓ Download]│
├────────┬─────────────────────┬───────────────────────────────┤
│        │                     │                               │
│ Blocks │      Canvas         │    Properties / Preview       │
│        │                     │                               │
│ □ Header│  ┌───────────────┐ │  [Props tab] [Preview tab]   │
│ □ Hero  │  │ Header block  │ │                               │
│ □ Text  │  ├───────────────┤ │  Title: [________]           │
│ □ Button│  │ Hero block    │ │  Subtitle: [____]            │
│ □ Image │  ├───────────────┤ │  Image URL: [____]           │
│ □ 2-Col │  │ Text block    │ │                               │
│ □ 3-Col │  ├───────────────┤ │                               │
│ □ Divider│ │ Footer block  │ │                               │
│ □ Footer│  └───────────────┘ │                               │
│        │                     │                               │
└────────┴─────────────────────┴───────────────────────────────┘
```

- Left: Block palette — drag or click to add
- Center: Canvas — sortable blocks, click to select, hover for delete
- Right: Tabs between Properties editor and live Preview iframe

## State Management

useReducer + React context. Actions:

```ts
type Action =
  | { type: "ADD_BLOCK"; blockType: BlockType; index?: number }
  | { type: "REMOVE_BLOCK"; id: string }
  | { type: "MOVE_BLOCK"; activeId: string; overId: string }
  | { type: "UPDATE_PROPS"; id: string; props: Partial<Block["props"]> }
  | { type: "SELECT_BLOCK"; id: string | null }
  | { type: "LOAD_EMAIL"; name: string }
  | { type: "NEW_EMAIL" }
  | { type: "SAVE_EMAIL"; name: string };
```

## localStorage Schema

```ts
{
  "current": "My Newsletter",
  "emails": {
    "My Newsletter": Block[],
    "Welcome Email": Block[]
  }
}
```

Auto-saves on every action. No explicit save button.

## Export

- Download HTML: render() → Blob → download
- Copy to clipboard: render() → clipboard API

## Non-Goals

- No backend / database persistence
- No sending integration
- No collaborative editing
- No custom block creation UI (developers add blocks in code)
- No undo/redo (can be added later)
