# Kanban Board

A lightweight, shareable Kanban board that stores all data in the URL. No database, no accounts, no server-side storage.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## How It Works

### URL-Based Storage

All board data (tasks, columns, assignees) is encoded as base64 and stored in the URL query parameter:

```
https://your-app.com/?board=eyJjb2x1bW5zIjpbLi4uXSwidGFza3MiOlsuLi5dfQ==
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | Check with Biome |
