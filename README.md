# Trivia Trek SPA

Single Page Application version of Trivia Trek built with the requested stack:

- **Node.js + npm** for tooling
- **React 19** + **React Router DOM** for UI and navigation
- **Tailwind CSS** for styling
- **Axios** for communicating with the backend
- **JSON-Server** (bundled in `public/db.json`) as the lightweight API layer

## Available Scripts

```bash
npm install          # install dependencies
npm run dev          # start Vite + JSON-Server concurrently
npm run client       # start only the React client
npm run server       # start only JSON-Server on http://localhost:3001
npm run build        # bundle the app for production
npm run preview      # preview the production build
```

## Project Highlights

- Multi-page experience (home, auth, dashboard, quiz flow, leaderboard, admin) powered by React Router.
- Tailwind-driven glassmorphism theme closely matching the original design.
- Axios API layer (`src/lib/api.js`) targeting JSON-Server endpoints (`users`, `questions`, `quizResults`, `badges`).
- Local authentication context with persistent sessions stored in `localStorage`.
- Admin tools for adding new questions directly into the JSON dataset.

## Backend (JSON-Server)

Data lives in `public/db.json`, along with custom routes under `public/routes.json`. Update these files to seed new users, quizzes, or badges. When `npm run server` is running you can access resources such as:

- http://localhost:3001/users
- http://localhost:3001/questions
- http://localhost:3001/quizResults
- http://localhost:3001/badges
"# Trivia_trek" 
