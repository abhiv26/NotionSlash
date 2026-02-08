# CLAUDE.md — Project Instructions for Claude Code
# This file is read automatically by Claude Code at the start of every session.
# It defines project-specific context, commands, and constraints.

## Tech Stack
- **Backend:** Python 3.12+ — FastAPI, Pydantic v2, SQLModel for persistence
- **Frontend:** Vite (React + TypeScript), Tailwind CSS v4, Lucide Icons
- **UI Components:** shadcn/ui (Radix Primitives)

## Commands

### One-time setup (frontend directory does not exist yet)
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install
```

### Development
```bash
# Backend (from repo root)
fastapi dev main.py

# Frontend (from frontend/)
npm run dev
```

### Testing
```bash
# Backend
pytest

# Frontend (from frontend/)
npm test
```

## Architecture Decisions
- Composition over inheritance for all components.
- Separate **UI Primitives** (shadcn) from **Feature Components**.
- Every component must handle `loading`, `empty`, and `error` states.

## Design Fidelity
- Priority is pixel-perfect visual fidelity: hover states, transitions, edge cases.
- If a design detail is unclear from the reference, ask for clarification or inspect the reference app's CSS. Do not guess.

## Workflow
1. Plan the component architecture and CSS strategy before writing code.
2. Generate code in small, testable chunks.
3. Visually verify against reference screenshots before moving to the next feature.
