# Task Board

## About the project

Task Board is a lightweight Kanban-style productivity app where users can create boards, add tasks and organize them across three stages: To Do, In Progress, and Done.
The app supports drag-and-drop, board persistence and a clean, responsive UI.

## Key Features

### Frontend

- Responsive UI (desktop / mobile)
- Create & load board by ID
- Add / edit / delete tasks
- Drag & drop between columns
- Local persistence for active board
- Error handling (e.g., invalid board ID)

### Backend

- Node.js + Express REST API (used externally)
- MongoDB for data storage
- CRUD endpoints for boards & tasks

## Tech Stack

### Frontend

- React + Vite
- TypeScript
- Redux Toolkit + Redux Persist
- Axios
- CSS Modules
- Drag & Drop via @hello-pangea/dnd

### Backend

- Node.js + Express
- MongoDB + Mongoose

## How it Works

- A user enters or creates a board ID
- Board and tasks load from backend
- All drag-and-drop changes are saved
- Last used board ID stays in memory (localStorage)

## Getting Started:

```bash
Clone the repository:
git clone <your-repo-url>

Install dependencies:
npm install

Run locally:
npm run dev

Build for production:
npm run build
```

## About Me:

Hi! I'm Olga Ferubko, a Fullstack Developer passionate about crafting intuitive and responsive user interfaces. I'm constantly leveling up my skills in JavaScript and React and enjoy writing clean, maintainable code.

Feel free to connect with me:

GitHub: https://github.com/olgaferubko

Email: ferubko.olga@gmail.com

LinkedIn: https://www.linkedin.com/in/olga-ferubko/

Check it out:
Deployed and live here: https://task-board-frontend-pi.vercel.app/
