# AgentIQ 🤖

An interactive AI search visualization and learning platform built as an
Artificial Intelligence course project (CSC-202L). Watch BFS, DFS, A*, UCS,
Greedy Best-First, and Hill Climbing solve 12 classic AI problems step by
step — with synchronized pseudocode, live frontier tracking, PEAS
formalization, and a dual-layer AI tutor (curated knowledge base + Google
Gemini) that answers questions grounded in the actual running simulation.

## Overview

AgentIQ lets a student watch an algorithm think, rather than trace it by
hand on paper. Every simulation runs alongside a live pseudocode panel that
highlights the exact line executing, a frontier/queue panel, and a PEAS
(Performance, Environment, Actuators, Sensors) panel that frames the problem
in the formal agent model. An AI assistant answers "why was this node
chosen?" using the real, live simulation state — not a generic textbook answer.

The app is a multi-page authenticated experience: users sign up / log in,
land on a dashboard tracking their progress across problems, pick a problem
and algorithm, then step through the simulation or run two algorithms
side-by-side for comparison.

## Pages / Flow

| Page | Purpose |
|---|---|
| Landing page | Feature overview and entry point |
| Login / Signup | Auth with localStorage-based session management |
| Dashboard | Progress tracking across 12 problems, problem selection |
| Algorithm Selection | Choose 1 algorithm to simulate, or 2 to compare |
| Simulation | Step-by-step run with pseudocode, frontier, and PEAS panels |
| Comparison | Two algorithms running side-by-side on the same problem |
| AI Assistant Modal | Available on every page for live Q&A |

## Features

- Six algorithm engines: BFS, DFS, A*, UCS, Greedy Best-First, Hill Climbing
- 12 problem domains: Maze, Robot Path, 8-Puzzle, N-Queens, Wumpus World, Vacuum World, Romania Map, Sudoku, TSP, Towers of Hanoi, Water Jug, Crypto-Arithmetic
- Synchronized pseudocode panel highlighting the active line at each step
- Live frontier/queue and explored-set visualization
- PEAS panel for every problem-algorithm pair
- Play / Pause / Step / Skip-to-End playback controls with adjustable speed
- Side-by-side algorithm comparison mode with per-algorithm stats
- Dual-layer AI assistant: a 700+ line hand-curated knowledge base for theory questions, with Google Gemini as fallback for live, simulation-specific questions
- Smart KB-to-Gemini routing based on query type and confidence scoring
- User authentication with localStorage session management and route guarding
- Dashboard with per-user progress tracking (problems completed, algorithms tried)
- Dark/light theme toggle

## Algorithms

| Algorithm | Type | Optimal? | Key Idea |
|---|---|---|---|
| BFS | Uninformed | Yes (unweighted) | Explores level by level |
| DFS | Uninformed | No | Explores depth-first, backtracks |
| UCS | Uninformed | Yes | Expands lowest cumulative cost first |
| Greedy Best-First | Informed | No | Expands lowest heuristic estimate |
| A* | Informed | Yes (admissible h) | Combines cost-so-far + heuristic |
| Hill Climbing | Local search | No | Greedily moves toward better neighbors |

## How to Run

This app requires sign-up/login and is not a fully offline single-file tool.

1. Clone the repository
2. Install dependencies and start the dev server (Vite):
```bash
   npm install
   npm run dev
```
3. Open the app in your browser, create an account, and pick a problem from the Dashboard
4. For the AI assistant's live simulation-specific answers, add a Gemini API key (see `.env.example`) — the knowledge base still works fully without one

> The simulation engines, renderers, and knowledge base run entirely
> client-side. Only the AI assistant's Gemini-powered fallback requires an
> API key and network access; concept-level questions are answered offline
> via the knowledge base.

## Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Gemini API](https://img.shields.io/badge/Gemini_API-8E75B2?style=flat&logo=googlegemini&logoColor=white)

## About

Built as a semester project for Artificial Intelligence. The goal was to implement and compare foundational uninformed,
informed, and local search algorithms in a realistic, interactive
environment — paired with an AI layer that explains *why* each algorithm
makes the decisions it does, grounded in the live simulation state rather
than static text.
