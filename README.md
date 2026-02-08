# NotionSlash

A pixel-perfect recreation of Notion's slash command menu, built with a React + TypeScript frontend and a FastAPI backend.

## Overview

NotionSlash provides a textarea-based editor that triggers a searchable command palette when the user types `/`. Commands are fetched from a Python API and displayed in a grouped, keyboard-navigable dropdown menu styled to match Notion's native UI.

## Tech Stack

| Layer    | Technology                                                  |
| -------- | ----------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons      |
| Backend  | Python 3.12+, FastAPI, Pydantic v2                          |
| Tooling  | ESLint, PostCSS, Autoprefixer                               |

## Project Structure

```
NotionSlash/
├── main.py                          # FastAPI server — single GET endpoint
├── commands.py                      # Command definitions and search logic
├── models.py                        # Pydantic models (Command, CommandGroup)
├── CLAUDE.md                        # Claude Code project instructions
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Editor.tsx            # Textarea editor with slash-trigger logic
    │   │   └── SlashMenu.tsx         # Command palette UI component
    │   ├── App.tsx                   # Root component
    │   ├── index.css                 # All custom styling (Notion-matched)
    │   └── main.tsx                  # React entry point
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.ts
    └── package.json
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+

### Backend

```bash
# Install dependencies
pip install fastapi uvicorn pydantic

# Start the dev server (runs on http://localhost:8000)
fastapi dev main.py
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (runs on http://localhost:5173)
npm run dev
```

Both servers must be running simultaneously. The frontend fetches commands from the backend at `http://localhost:8000/api/commands`.

## API

### `GET /api/commands`

Returns all available slash commands, grouped by category. Supports an optional `q` query parameter to filter commands by title, description, or keywords.

**Example request:**

```
GET /api/commands?q=head
```

**Example response:**

```json
{
  "groups": [
    {
      "category": "Basic blocks",
      "commands": [
        {
          "id": "heading_1",
          "title": "Heading 1",
          "description": "Big section heading.",
          "icon": "heading-1",
          "keywords": ["h1", "title"]
        }
      ]
    }
  ]
}
```

## Available Commands

### Basic blocks

| Command        | Description                              |
| -------------- | ---------------------------------------- |
| Text           | Just start writing with plain text.      |
| Page           | Embed a sub-page inside this page.       |
| To-do list     | Track tasks with a to-do list.           |
| Heading 1      | Big section heading.                     |
| Heading 2      | Medium section heading.                  |
| Heading 3      | Small section heading.                   |
| Table          | Add a simple table to this page.         |
| Bulleted list  | Create a simple bulleted list.           |
| Numbered list  | Create a list with numbering.            |
| Toggle list    | Toggles can hide and show content inside.|
| Quote          | Capture a quote.                         |
| Divider        | Visually divide blocks.                  |
| Link to page   | Link to an existing page.                |
| Callout        | Make writing stand out.                  |

### Media

| Command        | Description                              |
| -------------- | ---------------------------------------- |
| Image          | Upload or embed with a link.             |
| Web bookmark   | Save a link as a visual bookmark.        |
| Video          | Embed from YouTube, Vimeo...             |
| Audio          | Embed from SoundCloud, Spotify...        |
| Code           | Capture a code snippet.                  |
| File           | Upload or embed with a link.             |

### Embeds

| Command        | Description                              |
| -------------- | ---------------------------------------- |
| Equation       | Display a math equation.                 |

## Architecture

### Frontend Components

**`Editor.tsx`** — The main editor surface. Manages a `<textarea>` and detects `/` triggers to open the slash menu. Calculates caret coordinates to position the menu at the cursor. Handles command selection by replacing the `/query` text with the chosen command title.

**`SlashMenu.tsx`** — The command palette dropdown. Fetches grouped commands from the backend API, renders them with Lucide icons, and supports full keyboard navigation (Arrow Up/Down to move, Enter to select). Highlights the currently selected item.

### Backend

**`main.py`** — A minimal FastAPI application with a single `GET /api/commands` endpoint and CORS middleware for cross-origin requests from the frontend dev server.

**`commands.py`** — Defines all commands as a static list of `CommandGroup` objects. The `search_commands()` function filters commands by matching the query string against each command's title, description, and keywords (case-insensitive substring match).

**`models.py`** — Pydantic v2 models for `Command`, `CommandGroup`, and the `CommandsResponse` envelope.

## Keyboard Navigation

| Key        | Action                          |
| ---------- | ------------------------------- |
| `/`        | Open the slash command menu     |
| Arrow Down | Move selection down             |
| Arrow Up   | Move selection up               |
| Enter      | Insert the selected command     |

## Styling

All styles live in `frontend/src/index.css` using custom CSS classes prefixed with `notion-`. The design closely mirrors Notion's native slash menu:

- **Font:** Sohne / Inter / SF Pro Text fallback stack
- **Colors:** `#37352f` (text), `#8d8d8d` (descriptions), `#9b9b9b` (group headers)
- **Menu:** 320px wide, 420px max-height, 2px border-radius, subtle dual-layer box shadow
- **Icons:** 36x36px bordered containers with Lucide icons at 16px
