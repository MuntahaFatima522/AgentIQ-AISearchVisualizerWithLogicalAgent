/* ============================================================
   problems_all.js — All 10 Problem Classes & Metadata
   ============================================================ */

import { CanvasRenderer } from '../renderers/canvas_renderer.js';
import { DOMRenderer } from '../renderers/dom_renderer.js';
import { SimState } from '../sim_state.js';

// Central Registry of Problems and Compatible Algorithms
export const PROBLEMS_METADATA = {
  romania: {
    id: 'romania',
    name: 'Romania Map',
    icon: '🗺️',
    description: 'Find the shortest path between cities in Romania using a weighted graph.',
    compatible: ['BFS', 'DFS', 'UCS', 'Greedy', 'AStar'],
    category: 'graph',
    renderer: 'canvas',
    peas: {
      performance: 'Minimize total path cost (distance in km) from start to goal city.',
      environment: 'Weighted undirected graph of Romanian cities with road distances.',
      actuators: 'Move along edges to adjacent cities.',
      sensors: 'Current city name, adjacent cities, edge costs, heuristic (straight-line distance).'
    }
  },
  puzzle8: {
    id: 'puzzle8',
    name: '8-Puzzle',
    icon: '🧩',
    description: 'Slide numbered tiles into order from a scrambled state.',
    compatible: ['BFS', 'DFS', 'UCS', 'AStar', 'HillClimbing'],
    category: 'board',
    renderer: 'dom',
    peas: {
      performance: 'Reach goal state in minimum number of moves.',
      environment: '3×3 grid with 8 numbered tiles and one blank space.',
      actuators: 'Slide a tile into the blank space (up, down, left, right).',
      sensors: 'Current tile positions, blank position, move history.'
    }
  },
  nqueens: {
    id: 'nqueens',
    name: 'N-Queens',
    icon: '♛',
    description: 'Place N queens on an N×N board with zero horizontal, vertical, or diagonal conflicts.',
    compatible: ['HillClimbing'],
    category: 'board',
    renderer: 'dom',
    peas: {
      performance: 'Place all N queens with zero conflicts.',
      environment: 'N×N chessboard, N queen pieces.',
      actuators: 'Place or move a queen on the board.',
      sensors: 'Current queen positions, attack conflicts per queen.'
    }
  },
  vacuum: {
    id: 'vacuum',
    name: 'Vacuum World',
    icon: '🧹',
    description: 'Navigate a grid and clean all dirty cells using minimal movements.',
    compatible: ['BFS', 'DFS', 'HillClimbing'],
    category: 'grid',
    renderer: 'dom',
    peas: {
      performance: 'Clean all cells with minimum moves. Penalty for re-visiting clean cells.',
      environment: 'Grid of cells, each either clean or dirty.',
      actuators: 'Move Left, Right, Up, Down; Suck (clean current cell).',
      sensors: 'Current cell position, dirt status of current cell.'
    }
  },
  wumpus: {
    id: 'wumpus',
    name: 'Wumpus World',
    icon: '👹',
    description: 'Navigate a cave, avoid the Wumpus and pits, and retrieve the gold.',
    compatible: ['BFS', 'DFS', 'UCS', 'AStar'],
    category: 'grid',
    renderer: 'dom',
    peas: {
      performance: '+1000 for grabbing gold, -1000 for death, -1 per action, -10 for shooting.',
      environment: '4×4 grid cave with Wumpus, pits, gold, and the agent.',
      actuators: 'Move Forward, Turn Left/Right, Grab, Shoot arrow, Climb out.',
      sensors: 'Breeze (near pit), Stench (near Wumpus), Glitter (gold nearby), Bump, Scream.'
    }
  },
  tsp: {
    id: 'tsp',
    name: 'Travelling Salesman (TSP)',
    icon: '✈️',
    description: 'Find the shortest tour visiting all cities exactly once and returning to the start.',
    compatible: ['Greedy', 'HillClimbing'],
    category: 'graph',
    renderer: 'canvas',
    peas: {
      performance: 'Minimize total tour distance visiting every city exactly once.',
      environment: 'Complete weighted graph of cities with distances.',
      actuators: 'Choose next unvisited city to travel to.',
      sensors: 'Current city, visited cities, remaining cities, tour cost so far.'
    }
  },
  sudoku: {
    id: 'sudoku',
    name: 'Sudoku',
    icon: '🔢',
    description: 'Fill a 9×9 Sudoku grid minimizing row, column, and box constraints.',
    compatible: ['HillClimbing'],
    category: 'board',
    renderer: 'dom',
    peas: {
      performance: 'Fill all cells correctly with no constraint violations.',
      environment: '9×9 grid with some pre-filled numbers (1–9).',
      actuators: 'Place a digit (1–9) in an empty cell.',
      sensors: 'Current grid state, empty cells, valid digits per cell.'
    }
  },
  maze: {
    id: 'maze',
    name: 'Maze Navigation',
    icon: '🌀',
    description: 'Find a path from start to goal through a generated grid of walls.',
    compatible: ['BFS', 'DFS', 'Greedy', 'AStar'],
    category: 'grid',
    renderer: 'canvas',
    peas: {
      performance: 'Reach exit in minimum steps.',
      environment: '2D grid maze with walls, open cells, start, and exit.',
      actuators: 'Move to adjacent open cell (up, down, left, right).',
      sensors: 'Current position, adjacent cell types, distance to exit.'
    }
  },
  robot_path: {
    id: 'robot_path',
    name: 'Robot Path Planning',
    icon: '🤖',
    description: 'Plan a collision-free path for a robot in a grid with obstacles.',
    compatible: ['BFS', 'DFS', 'UCS', 'Greedy', 'AStar'],
    category: 'grid',
    renderer: 'canvas',
    peas: {
      performance: 'Reach goal position with minimum cost, avoiding all obstacles.',
      environment: '2D grid with free cells, obstacle cells, start position, goal position.',
      actuators: 'Move to adjacent free cell (4-directional).',
      sensors: 'Current position, surrounding cell types, distance to goal.'
    }
  },
  hanoi: {
    id: 'hanoi',
    name: 'Tower of Hanoi',
    icon: '🗼',
    description: 'Move all disks from Peg A to Peg C. Larger disks cannot sit on top of smaller ones.',
    compatible: ['BFS', 'DFS'],
    category: 'board',
    renderer: 'dom',
    peas: {
      performance: 'Move all disks to target peg in minimum moves (optimal = 2^n − 1).',
      environment: 'Three pegs (A, B, C) and N disks of different sizes.',
      actuators: 'Move top disk from one peg to another (if smaller than top of destination).',
      sensors: 'Current state of all three pegs, disk positions.'
    }
  },
  waterjug: {
    id: 'waterjug',
    name: 'Water Jug',
    icon: '🧪',
    description: 'Measure exactly 2 gallons of water using a 4-gallon jug and a 3-gallon jug.',
    compatible: ['BFS', 'DFS', 'UCS'],
    category: 'math',
    renderer: 'dom',
    peas: {
      performance: 'Measure exactly 2 gallons in the 4-gallon jug using minimum actions.',
      environment: 'Two jugs (4-gallon and 3-gallon); water can be poured between them.',
      actuators: 'Fill a jug, empty a jug, pour from one jug into the other.',
      sensors: 'Current water level in each jug.'
    }
  },
  waterjug_compare: { // internal alias for compare
    id: 'waterjug_compare',
    name: 'Water Jug',
    icon: '🧪',
    description: 'Measure exactly 2 gallons of water using a 4-gallon jug and a 3-gallon jug.',
    compatible: ['BFS', 'DFS', 'UCS'],
    category: 'math',
    renderer: 'dom'
  },
  missionaries: {
    id: 'missionaries',
    name: 'Missionaries & Cannibals',
    icon: '🚣',
    description: 'Help 3 missionaries and 3 cannibals cross a river without the cannibals outnumbering them.',
    compatible: ['BFS', 'DFS', 'UCS'],
    category: 'math',
    renderer: 'dom',
    peas: {
      performance: 'Transport everyone to the far bank safely in minimum moves.',
      environment: 'River, boat (capacity 2), left and right banks with missionaries and cannibals.',
      actuators: 'Move the boat with 1 or 2 people across the river.',
      sensors: 'Counts on each bank, boat location, legal move constraints.'
    }
  }
};

/* ============================================================
   1. ROMANIA MAP PROBLEM
   ============================================================ */
export const ROMANIA_NODES = {
  Arad: { x: 0.10, y: 0.22, sld: 366 },
  Zerind: { x: 0.12, y: 0.12, sld: 374 },
  Oradea: { x: 0.18, y: 0.05, sld: 380 },
  Timisoara: { x: 0.08, y: 0.38, sld: 329 },
  Lugoj: { x: 0.18, y: 0.48, sld: 244 },
  Mehadia: { x: 0.20, y: 0.58, sld: 241 },
  Drobeta: { x: 0.16, y: 0.68, sld: 242 },
  Craiova: { x: 0.32, y: 0.76, sld: 160 },
  Sibiu: { x: 0.33, y: 0.30, sld: 253 },
  Rimnicu: { x: 0.38, y: 0.48, sld: 193 },
  Fagaras: { x: 0.50, y: 0.28, sld: 176 },
  Pitesti: { x: 0.52, y: 0.55, sld: 100 },
  Bucharest: { x: 0.68, y: 0.63, sld: 0 },
  Giurgiu: { x: 0.64, y: 0.77, sld: 77 },
  Urziceni: { x: 0.80, y: 0.58, sld: 80 },
  Hirsova: { x: 0.90, y: 0.53, sld: 151 },
  Eforie: { x: 0.96, y: 0.63, sld: 161 },
  Vaslui: { x: 0.88, y: 0.38, sld: 199 },
  Iasi: { x: 0.82, y: 0.22, sld: 226 },
  Neamt: { x: 0.72, y: 0.14, sld: 234 }
};

export const ROMANIA_EDGES = [
  { from: 'Arad', to: 'Zerind', cost: 75 },
  { from: 'Arad', to: 'Timisoara', cost: 118 },
  { from: 'Arad', to: 'Sibiu', cost: 140 },
  { from: 'Zerind', to: 'Oradea', cost: 71 },
  { from: 'Oradea', to: 'Sibiu', cost: 151 },
  { from: 'Timisoara', to: 'Lugoj', cost: 111 },
  { from: 'Lugoj', to: 'Mehadia', cost: 70 },
  { from: 'Mehadia', to: 'Drobeta', cost: 75 },
  { from: 'Drobeta', to: 'Craiova', cost: 120 },
  { from: 'Sibiu', to: 'Fagaras', cost: 99 },
  { from: 'Sibiu', to: 'Rimnicu', cost: 80 },
  { from: 'Rimnicu', to: 'Pitesti', cost: 97 },
  { from: 'Rimnicu', to: 'Craiova', cost: 146 },
  { from: 'Fagaras', to: 'Bucharest', cost: 211 },
  { from: 'Pitesti', to: 'Bucharest', cost: 101 },
  { from: 'Craiova', to: 'Pitesti', cost: 138 },
  { from: 'Bucharest', to: 'Giurgiu', cost: 90 },
  { from: 'Bucharest', to: 'Urziceni', cost: 85 },
  { from: 'Urziceni', to: 'Hirsova', cost: 98 },
  { from: 'Urziceni', to: 'Vaslui', cost: 142 },
  { from: 'Hirsova', to: 'Eforie', cost: 86 },
  { from: 'Vaslui', to: 'Iasi', cost: 92 },
  { from: 'Iasi', to: 'Neamt', cost: 87 }
];

export class RomaniaProblem {
  constructor() {
    this.start = 'Arad';
    this.goal = 'Bucharest';
    this.metadata = PROBLEMS_METADATA.romania;
  }
  getInitialState() { return this.start; }
  getGoalState() { return this.goal; }
  isGoal(state) { return state === this.goal; }
  stateToString(state) { return state; }
  heuristic(state) {
    return ROMANIA_NODES[state]?.sld ?? 999;
  }
  evaluate(state) {
    return this.heuristic(state);
  }
  getSuccessors(state) {
    const list = [];
    ROMANIA_EDGES.forEach(e => {
      if (e.from === state) list.push({ state: e.to, action: `Drive to ${e.to}`, cost: e.cost });
      else if (e.to === state) list.push({ state: e.from, action: `Drive to ${e.from}`, cost: e.cost });
    });
    return list;
  }
  getHCSuccessors(state) {
    return this.getSuccessors(state);
  }
  render(state, container, stateContext = SimState) {
    CanvasRenderer.drawGraph(
      ROMANIA_NODES,
      ROMANIA_EDGES,
      stateContext.frontier.map(n => typeof n === 'string' ? n : n.state),
      [...stateContext.explored],
      stateContext.currentNode ? stateContext.currentNode.state : null,
      stateContext.path,
      this.goal,
      this.start,
      container
    );
  }
}

/* ============================================================
   2. 8-PUZZLE PROBLEM
   ============================================================ */
export class Puzzle8Problem {
  constructor() {
    this.initial = [1, 2, 3, 0, 4, 6, 7, 5, 8]; // Fixed solvable setup
    this.goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    this.metadata = PROBLEMS_METADATA.puzzle8;
  }
  getInitialState() { return [...this.initial]; }
  getGoalState() { return [...this.goal]; }
  isGoal(state) { return state.join(',') === this.goal.join(','); }
  stateToString(state) { return state.join(','); }
  heuristic(state) {
    // Total Manhattan distance
    let dist = 0;
    for (let i = 0; i < 9; i++) {
      const val = state[i];
      if (val === 0) continue;
      const targetIdx = this.goal.indexOf(val);
      const currR = Math.floor(i / 3), currC = i % 3;
      const targetR = Math.floor(targetIdx / 3), targetC = targetIdx % 3;
      dist += Math.abs(currR - targetR) + Math.abs(currC - targetC);
    }
    return dist;
  }
  evaluate(state) {
    return this.heuristic(state);
  }
  getSuccessors(state) {
    const list = [];
    const blank = state.indexOf(0);
    const r = Math.floor(blank / 3), c = blank % 3;
    const moves = [
      { dr: -1, dc: 0, act: 'Slide Tile Down' }, // blank moves up
      { dr: 1, dc: 0, act: 'Slide Tile Up' },   // blank moves down
      { dr: 0, dc: -1, act: 'Slide Tile Right' }, // blank moves left
      { dr: 0, dc: 1, act: 'Slide Tile Left' }   // blank moves right
    ];
    moves.forEach(m => {
      const nr = r + m.dr, nc = c + m.dc;
      if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
        const nextBlank = nr * 3 + nc;
        const nextState = [...state];
        // Swap
        nextState[blank] = nextState[nextBlank];
        nextState[nextBlank] = 0;
        list.push({ state: nextState, action: m.act, cost: 1 });
      }
    });
    return list;
  }
  getHCSuccessors(state) {
    return this.getSuccessors(state);
  }
  render(state, container) {
    DOMRenderer.drawPuzzle8(state, container);
  }
}

/* ============================================================
   3. N-QUEENS PROBLEM (Hill Climbing Only)
   ============================================================ */
export class NQueensProblem {
  constructor(n = 8) {
    this.n = n;
    this.metadata = PROBLEMS_METADATA.nqueens;
  }
  getInitialState() {
    // Random row in each column
    return Array.from({ length: this.n }, () => Math.floor(Math.random() * this.n));
  }
  getGoalState() { return null; }
  isGoal(state) { return this.evaluate(state) === 0; }
  stateToString(state) { return state.join(','); }
  heuristic(state) { return this.evaluate(state); }
  evaluate(state) {
    // Count attacking pairs
    let conflicts = 0;
    for (let i = 0; i < this.n; i++) {
      for (let j = i + 1; j < this.n; j++) {
        // Same row, or diagonal
        if (state[i] === state[j] || Math.abs(state[i] - state[j]) === Math.abs(i - j)) {
          conflicts++;
        }
      }
    }
    return conflicts;
  }
  getSuccessors(state) {
    // Return all single-queen shifts
    const list = [];
    for (let c = 0; c < this.n; c++) {
      for (let r = 0; r < this.n; r++) {
        if (state[c] === r) continue;
        const nextState = [...state];
        nextState[c] = r;
        list.push({ state: nextState, action: `Move Q in col ${c} to row ${r}`, cost: 1 });
      }
    }
    return list;
  }
  // Hill climbing specific: Min-Conflicts selection
  getHCSuccessors(state) {
    // Find all conflicted columns
    const conflictedCols = [];
    for (let i = 0; i < this.n; i++) {
      let isConflicted = false;
      for (let j = 0; j < this.n; j++) {
        if (i === j) continue;
        if (state[i] === state[j] || Math.abs(state[i] - state[j]) === Math.abs(i - j)) {
          isConflicted = true;
          break;
        }
      }
      if (isConflicted) conflictedCols.push(i);
    }
    if (conflictedCols.length === 0) return [];

    // Pick random conflicted col
    const randCol = conflictedCols[Math.floor(Math.random() * conflictedCols.length)];
    
    // Evaluate row shifts for this col only
    const list = [];
    for (let r = 0; r < this.n; r++) {
      const nextState = [...state];
      nextState[randCol] = r;
      list.push({ state: nextState, action: `Slide Q${randCol} to row ${r}`, cost: 1 });
    }
    return list;
  }
  render(state, container) {
    // Identify conflicted columns
    const conflicts = [];
    for (let i = 0; i < this.n; i++) {
      for (let j = i + 1; j < this.n; j++) {
        if (state[i] === state[j] || Math.abs(state[i] - state[j]) === Math.abs(i - j)) {
          if (!conflicts.includes(i)) conflicts.push(i);
          if (!conflicts.includes(j)) conflicts.push(j);
        }
      }
    }
    DOMRenderer.drawNQueens(state, this.n, conflicts, container);
  }
}

/* ============================================================
   4. VACUUM WORLD PROBLEM
   ============================================================ */
export class VacuumProblem {
  constructor() {
    this.rows = 3;
    this.cols = 3;
    this.metadata = PROBLEMS_METADATA.vacuum;
  }
  getInitialState() {
    const dirty = new Set(['0,1', '1,0', '2,2', '1,2']);
    return { pos: [0, 0], dirty };
  }
  getGoalState() { return null; }
  isGoal(state) { return state.dirty.size === 0; }
  stateToString(state) {
    return `${state.pos[0]},${state.pos[1]}|${[...state.dirty].sort().join(';')}`;
  }
  heuristic(state) {
    return state.dirty.size;
  }
  evaluate(state) {
    return state.dirty.size + (state.dirty.has(`${state.pos[0]},${state.pos[1]}`) ? 1 : 0);
  }
  getSuccessors(state) {
    const list = [];
    const [r, c] = state.pos;
    const currentKey = `${r},${c}`;

    // Action: Suck
    if (state.dirty.has(currentKey)) {
      const nextDirty = new Set(state.dirty);
      nextDirty.delete(currentKey);
      list.push({ state: { pos: [r, c], dirty: nextDirty }, action: 'Suck Dirt', cost: 1 });
    }

    // Actions: Move Left, Right, Up, Down
    const dirs = [
      { dr: -1, dc: 0, act: 'Move Up' },
      { dr: 1, dc: 0, act: 'Move Down' },
      { dr: 0, dc: -1, act: 'Move Left' },
      { dr: 0, dc: 1, act: 'Move Right' }
    ];
    dirs.forEach(d => {
      const nr = r + d.dr, nc = c + d.dc;
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
        list.push({ state: { pos: [nr, nc], dirty: new Set(state.dirty) }, action: d.act, cost: 1 });
      }
    });
    return list;
  }
  getHCSuccessors(state) {
    return this.getSuccessors(state);
  }
  render(state, container) {
    DOMRenderer.drawVacuum(state, this.rows, this.cols, container);
  }
}

/* ============================================================
   5. WUMPUS WORLD PROBLEM
   ============================================================ */
export class WumpusProblem {
  constructor() {
    this.rows = 4;
    this.cols = 4;
    this.wumpus = [2, 2];
    this.gold = [1, 3];
    this.pits = [[2, 0], [3, 2]];
    this.metadata = PROBLEMS_METADATA.wumpus;
  }
  getInitialState() {
    return {
      pos: [0, 0],
      hasGold: false,
      wumpusAlive: true,
      visited: new Set(['0,0'])
    };
  }
  getGoalState() { return null; }
  isGoal(state) {
    return state.hasGold && state.pos[0] === 0 && state.pos[1] === 0;
  }
  stateToString(state) {
    return `${state.pos[0]},${state.pos[1]}|${state.hasGold}|${state.wumpusAlive}|${[...state.visited].sort().join(';')}`;
  }
  heuristic(state) {
    if (state.hasGold) {
      return Math.abs(state.pos[0] - 0) + Math.abs(state.pos[1] - 0);
    }
    return Math.abs(state.pos[0] - this.gold[0]) + Math.abs(state.pos[1] - this.gold[1]);
  }
  evaluate(state) {
    return this.heuristic(state);
  }
  _isSafe(pos) {
    if (this.pits.some(p => p[0] === pos[0] && p[1] === pos[1])) return false;
    if (this.wumpus[0] === pos[0] && this.wumpus[1] === pos[1]) return false;
    return true;
  }
  getSuccessors(state) {
    const succ = [];
    const [r, c] = state.pos;
    const moves = [
      { dr: -1, dc: 0, act: 'Move Up' },
      { dr: 1, dc: 0, act: 'Move Down' },
      { dr: 0, dc: -1, act: 'Move Left' },
      { dr: 0, dc: 1, act: 'Move Right' }
    ];
    
    moves.forEach(m => {
      const nr = r + m.dr, nc = c + m.dc;
      if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols || !this._isSafe([nr, nc])) return;
      
      const nv = new Set(state.visited);
      nv.add(`${nr},${nc}`);
      let ng = state.hasGold;
      if (!ng && nr === this.gold[0] && nc === this.gold[1]) ng = true;
      
      succ.push({
        state: {
          pos: [nr, nc],
          hasGold: ng,
          wumpusAlive: state.wumpusAlive,
          visited: nv
        },
        action: m.act,
        cost: 1
      });
    });
    
    return succ;
  }
  getHCSuccessors(state) {
    return this.getSuccessors(state);
  }
  render(state, container) {
    DOMRenderer.drawWumpus(state, this.rows, this.cols, this.wumpus, this.gold, this.pits, container);
  }
}

/* ============================================================
   6. TRAVELLING SALESMAN PROBLEM (TSP)
   ============================================================ */
export const TSP_CITIES = {
  A: { x: 0.15, y: 0.20 },
  B: { x: 0.40, y: 0.15 },
  C: { x: 0.70, y: 0.20 },
  D: { x: 0.85, y: 0.45 },
  E: { x: 0.65, y: 0.75 },
  F: { x: 0.35, y: 0.80 },
  G: { x: 0.15, y: 0.60 }
};

export class TSPProblem {
  constructor() {
    this.cityNames = Object.keys(TSP_CITIES);
    this.metadata = PROBLEMS_METADATA.tsp;
  }
  _dist(c1, c2) {
    const p1 = TSP_CITIES[c1], p2 = TSP_CITIES[c2];
    return Math.round(Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2) * 100);
  }
  getInitialState() {
    // Initial state is a complete path starting and ending at A
    const state = { path: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'], cost: 0 };
    state.cost = this.evaluate(state);
    return state;
  }
  getGoalState() { return null; }
  isGoal(state) {
    // In TSP search, we look for a valid path that minimizes cost. Local search restarts or stabilizes.
    return state.path.length === this.cityNames.length + 1 && state.path[0] === 'A' && state.path[state.path.length-1] === 'A';
  }
  stateToString(state) {
    return state.path.join('-');
  }
  heuristic(state) {
    return this.evaluate(state);
  }
  evaluate(state) {
    // Calculate total tour cost
    let total = 0;
    for (let i = 0; i < state.path.length - 1; i++) {
      total += this._dist(state.path[i], state.path[i+1]);
    }
    return total;
  }
  getSuccessors(state) {
    // Greedy-based successors: swap adjacent visited city indices
    const list = [];
    const path = [...state.path];
    for (let i = 1; i < path.length - 2; i++) {
      const nextPath = [...path];
      const tmp = nextPath[i];
      nextPath[i] = nextPath[i+1];
      nextPath[i+1] = tmp;
      const nextState = { path: nextPath, cost: 0 };
      nextState.cost = this.evaluate(nextState);
      list.push({ state: nextState, action: `Swap ${path[i]} and ${path[i+1]}`, cost: 1 });
    }
    return list;
  }
  getHCSuccessors(state) {
    // 2-opt swaps: reverse subsegments of the tour
    const list = [];
    const path = [...state.path];
    const n = path.length - 1; // ignore the final returning city duplicate
    for (let i = 1; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        // Reverse path between index i and j
        const nextPath = [...path];
        const sub = nextPath.slice(i, j + 1).reverse();
        for (let k = 0; k < sub.length; k++) {
          nextPath[i + k] = sub[k];
        }
        // Retain returning city loop
        nextPath[nextPath.length - 1] = nextPath[0];
        const nextState = { path: nextPath, cost: 0 };
        nextState.cost = this.evaluate(nextState);
        list.push({ state: nextState, action: `Reverse ${path[i]} to ${path[j]} (2-opt)`, cost: 1 });
      }
    }
    return list;
  }
  render(state, container) {
    CanvasRenderer.drawTSP(TSP_CITIES, state.path, [], [], state.path[state.path.length - 2] || 'A', container);
  }
}

/* ============================================================
   7. SUDOKU PROBLEM
   ============================================================ */
export class SudokuProblem {
  constructor() {
    // 9x9 Sudoku Board: 0 represents empty
    this.initialGrid = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];
    this.fixed = this.initialGrid.map(row => row.map(v => v !== 0));
    this.metadata = PROBLEMS_METADATA.sudoku;
  }
  getInitialState() {
    // Fill empty cells with random non-conflicting numbers inside each 3x3 box
    const grid = this.initialGrid.map(r => [...r]);
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        // Collect already fixed numbers inside box
        const used = new Set();
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const v = grid[boxRow*3 + r][boxCol*3 + c];
            if (v !== 0) used.add(v);
          }
        }
        // Fill remaining numbers
        const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => !used.has(x));
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const rowIdx = boxRow*3 + r;
            const colIdx = boxCol*3 + c;
            if (grid[rowIdx][colIdx] === 0) {
              grid[rowIdx][colIdx] = pool.pop();
            }
          }
        }
      }
    }
    return grid;
  }
  getGoalState() { return null; }
  isGoal(state) { return this.evaluate(state) === 0; }
  stateToString(state) { return state.map(r => r.join('')).join('|'); }
  heuristic(state) { return this.evaluate(state); }
  evaluate(state) {
    // Violations count (duplicate values in rows and columns)
    let violations = 0;
    // Row duplicates
    for (let r = 0; r < 9; r++) {
      const seen = new Set();
      for (let c = 0; c < 9; c++) {
        const v = state[r][c];
        if (seen.has(v)) violations++;
        seen.add(v);
      }
    }
    // Column duplicates
    for (let c = 0; c < 9; c++) {
      const seen = new Set();
      for (let r = 0; r < 9; r++) {
        const v = state[r][c];
        if (seen.has(v)) violations++;
        seen.add(v);
      }
    }
    return violations;
  }
  getSuccessors(state) {
    return this.getHCSuccessors(state);
  }
  getHCSuccessors(state) {
    // Generate successors by swapping any two non-fixed cells in the same 3x3 box
    const list = [];
    const boxRow = Math.floor(Math.random() * 3);
    const boxCol = Math.floor(Math.random() * 3);

    const nonFixedCells = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const row = boxRow*3 + r;
        const col = boxCol*3 + c;
        if (!this.fixed[row][col]) {
          nonFixedCells.push({ row, col });
        }
      }
    }

    if (nonFixedCells.length < 2) return [];

    // Create all pairs of swaps in this box
    for (let i = 0; i < nonFixedCells.length; i++) {
      for (let j = i + 1; j < nonFixedCells.length; j++) {
        const c1 = nonFixedCells[i], c2 = nonFixedCells[j];
        const nextState = state.map(r => [...r]);
        // Swap values
        const tmp = nextState[c1.row][c1.col];
        nextState[c1.row][c1.col] = nextState[c2.row][c2.col];
        nextState[c2.row][c2.col] = tmp;

        list.push({
          state: nextState,
          action: `Swap box (${boxRow},${boxCol}) values at (${c1.row},${c1.col}) ↔ (${c2.row},${c2.col})`,
          cost: 1
        });
      }
    }
    return list;
  }
  render(state, container) {
    // Detect conflicted cells
    const rowConflicts = Array.from({length:9}, () => new Set());
    const colConflicts = Array.from({length:9}, () => new Set());
    const conflicts = [];

    // Rows
    for (let r = 0; r < 9; r++) {
      const seen = {};
      for (let c = 0; c < 9; c++) {
        const v = state[r][c];
        if (seen[v] !== undefined) {
          conflicts.push([r, c]);
          conflicts.push([r, seen[v]]);
        }
        seen[v] = c;
      }
    }
    // Columns
    for (let c = 0; c < 9; c++) {
      const seen = {};
      for (let r = 0; r < 9; r++) {
        const v = state[r][c];
        if (seen[v] !== undefined) {
          conflicts.push([r, c]);
          conflicts.push([seen[v], c]);
        }
        seen[v] = r;
      }
    }

    DOMRenderer.drawSudoku(state, this.fixed, conflicts, container);
  }
}

/* ============================================================
   8. MAZE NAVIGATION PROBLEM
   ============================================================ */
export class MazeProblem {
  constructor() {
    this.rows = 11;
    this.cols = 11;
    this.start = [0, 0];
    this.goal = [10, 10];
    this.grid = [
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    this.metadata = PROBLEMS_METADATA.maze;
  }
  getInitialState() { return [...this.start]; }
  getGoalState() { return [...this.goal]; }
  isGoal(state) { return state[0] === this.goal[0] && state[1] === this.goal[1]; }
  stateToString(state) { return `${state[0]},${state[1]}`; }
  heuristic(state) {
    return Math.abs(state[0] - this.goal[0]) + Math.abs(state[1] - this.goal[1]);
  }
  evaluate(state) {
    return this.heuristic(state);
  }
  getSuccessors(state) {
    const list = [];
    const [r, c] = state;
    const dirs = [
      { dr: -1, dc: 0, act: 'Move Up' },
      { dr: 1, dc: 0, act: 'Move Down' },
      { dr: 0, dc: -1, act: 'Move Left' },
      { dr: 0, dc: 1, act: 'Move Right' }
    ];
    dirs.forEach(d => {
      const nr = r + d.dr, nc = c + d.dc;
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.grid[nr][nc] === 0) {
        list.push({ state: [nr, nc], action: d.act, cost: 1 });
      }
    });
    return list;
  }
  getHCSuccessors(state) {
    return this.getSuccessors(state);
  }
  render(state, container, stateContext = SimState) {
    CanvasRenderer.drawGrid(
      this.grid,
      this.rows,
      this.cols,
      stateContext.frontier.map(n => typeof n === 'string' ? n : n.stateToString ? n.stateToString() : `${n.state[0]},${n.state[1]}`),
      [...stateContext.explored],
      stateContext.currentNode ? `${stateContext.currentNode.state[0]},${stateContext.currentNode.state[1]}` : null,
      stateContext.path,
      { '0,0': '🟢', '10,10': '🏁' },
      container
    );
  }
}

/* ============================================================
   8b. ROBOT PATH PLANNING PROBLEM
   ============================================================ */
export class RobotPathProblem {
  constructor() {
    this.rows = 10;
    this.cols = 15;
    this.start = [0, 0];
    this.goal = [9, 14];
    this.grid = this._generateGrid();
    this.metadata = PROBLEMS_METADATA.robot_path;
  }

  _generateGrid() {
    const g = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    const walls = [
      [1, 3], [1, 4], [1, 5], [2, 5], [3, 5], [4, 5], [4, 6], [4, 7],
      [5, 7], [6, 7], [6, 8], [7, 8], [7, 9], [8, 9], [8, 10],
      [3, 2], [4, 2], [5, 2], [5, 3], [2, 10], [2, 11], [3, 11],
      [6, 2], [6, 3], [7, 3], [8, 3], [8, 4]
    ];
    walls.forEach(([r, c]) => {
      if (g[r] && c < this.cols) g[r][c] = 1;
    });
    g[this.start[0]][this.start[1]] = 0;
    g[this.goal[0]][this.goal[1]] = 0;
    return g;
  }

  getInitialState() { return [...this.start]; }
  getGoalState() { return [...this.goal]; }
  isGoal(state) { return state[0] === this.goal[0] && state[1] === this.goal[1]; }
  stateToString(state) { return `${state[0]},${state[1]}`; }
  heuristic(state) {
    return Math.abs(state[0] - this.goal[0]) + Math.abs(state[1] - this.goal[1]);
  }
  evaluate(state) { return this.heuristic(state); }
  getSuccessors(state) {
    const list = [];
    const [r, c] = state;
    const dirs = [
      { dr: -1, dc: 0, act: 'Move Up' },
      { dr: 1, dc: 0, act: 'Move Down' },
      { dr: 0, dc: -1, act: 'Move Left' },
      { dr: 0, dc: 1, act: 'Move Right' }
    ];
    dirs.forEach(d => {
      const nr = r + d.dr, nc = c + d.dc;
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.grid[nr][nc] === 0) {
        list.push({ state: [nr, nc], action: d.act, cost: 1 });
      }
    });
    return list;
  }
  getHCSuccessors(state) { return this.getSuccessors(state); }
  render(state, container, stateContext = SimState) {
    const goalKey = `${this.goal[0]},${this.goal[1]}`;
    CanvasRenderer.drawGrid(
      this.grid,
      this.rows,
      this.cols,
      stateContext.frontier.map(n => typeof n === 'string' ? n : n.stateToString ? n.stateToString() : `${n.state[0]},${n.state[1]}`),
      [...stateContext.explored],
      stateContext.currentNode ? `${stateContext.currentNode.state[0]},${stateContext.currentNode.state[1]}` : null,
      stateContext.path,
      { '0,0': '🤖', [goalKey]: '🎯' },
      container
    );
  }
}

/* ============================================================
   9. TOWER OF HANOI PROBLEM
   ============================================================ */
export class HanoiProblem {
  constructor(disks = 4) {
    this.n = disks;
    this.initialPegs = [Array.from({ length: disks }, (_, i) => disks - i), [], []];
    this.metadata = PROBLEMS_METADATA.hanoi;
  }
  getInitialState() {
    return this.initialPegs.map(p => [...p]);
  }
  getGoalState() { return [[], [], Array.from({ length: this.n }, (_, i) => this.n - i)]; }
  isGoal(state) {
    return state[2].length === this.n;
  }
  stateToString(state) {
    return state.map(p => p.join('-')).join('|');
  }
  heuristic(state) {
    return this.n - state[2].length;
  }
  evaluate(state) {
    return this.heuristic(state);
  }
  getSuccessors(state) {
    const list = [];
    const pegNames = ['A', 'B', 'C'];
    for (let from = 0; from < 3; from++) {
      if (state[from].length === 0) continue;
      const disk = state[from][state[from].length - 1];

      for (let to = 0; to < 3; to++) {
        if (from === to) continue;
        const destDisk = state[to][state[to].length - 1];

        // Valid move if destination is empty or top disk is larger than moving disk
        if (destDisk === undefined || destDisk > disk) {
          const nextState = state.map(p => [...p]);
          nextState[from].pop();
          nextState[to].push(disk);
          list.push({
            state: nextState,
            action: `Move Disk ${disk} peg ${pegNames[from]} ➔ peg ${pegNames[to]}`,
            cost: 1
          });
        }
      }
    }
    return list;
  }
  getHCSuccessors(state) {
    return this.getSuccessors(state);
  }
  render(state, container) {
    DOMRenderer.drawHanoi(state, this.n, container);
  }
}

/* ============================================================
   10. WATER JUG PROBLEM
   ============================================================ */
export class WaterJugProblem {
  constructor() {
    this.j1Max = 4;
    this.j2Max = 3;
    this.target = 2;
    this.metadata = PROBLEMS_METADATA.waterjug;
  }
  getInitialState() { return [0, 0]; }
  getGoalState() { return [this.target, 0]; } // Target in Jug 1
  isGoal(state) {
    return state[0] === this.target;
  }
  stateToString(state) { return state.join(','); }
  heuristic(state) {
    return Math.abs(state[0] - this.target);
  }
  evaluate(state) {
    return this.heuristic(state);
  }
  getSuccessors(state) {
    const list = [];
    const [j1, j2] = state;

    // Fill Jug 1
    if (j1 < this.j1Max) {
      list.push({ state: [this.j1Max, j2], action: 'Fill Jug 1 (4 Gal)', cost: 1 });
    }
    // Fill Jug 2
    if (j2 < this.j2Max) {
      list.push({ state: [j1, this.j2Max], action: 'Fill Jug 2 (3 Gal)', cost: 1 });
    }
    // Empty Jug 1
    if (j1 > 0) {
      list.push({ state: [0, j2], action: 'Empty Jug 1', cost: 1 });
    }
    // Empty Jug 2
    if (j2 > 0) {
      list.push({ state: [j1, 0], action: 'Empty Jug 2', cost: 1 });
    }
    // Pour Jug 1 ➔ Jug 2
    if (j1 > 0 && j2 < this.j2Max) {
      const amt = Math.min(j1, this.j2Max - j2);
      list.push({ state: [j1 - amt, j2 + amt], action: 'Pour Jug 1 ➔ Jug 2', cost: 1 });
    }
    // Pour Jug 2 ➔ Jug 1
    if (j2 > 0 && j1 < this.j1Max) {
      const amt = Math.min(j2, this.j1Max - j1);
      list.push({ state: [j1 + amt, j2 - amt], action: 'Pour Jug 2 ➔ Jug 1', cost: 1 });
    }

    return list;
  }
  getHCSuccessors(state) {
    return this.getSuccessors(state);
  }
  render(state, container) {
    DOMRenderer.drawWaterJug(state, this.j1Max, this.j2Max, container);
  }
}

/* ============================================================
   11. MISSIONARIES & CANNIBALS PROBLEM
   ============================================================ */
export class MissionariesProblem {
  constructor() {
    this.metadata = PROBLEMS_METADATA.missionaries;
  }
  getInitialState() {
    return [3, 3, 0]; // [mLeft, cLeft, boatSide] (0 = left bank, 1 = right bank)
  }
  getGoalState() { return [0, 0, 1]; }
  isGoal(state) {
    return state[0] === 0 && state[1] === 0 && state[2] === 1;
  }
  stateToString(state) { return state.join(','); }
  heuristic(state) {
    // Estimate based on people remaining on left side
    return (state[0] + state[1]) / 2;
  }
  evaluate(state) {
    return this.heuristic(state);
  }
  getSuccessors(state) {
    const list = [];
    const [mLeft, cLeft, side] = state;
    const mRight = 3 - mLeft;
    const cRight = 3 - cLeft;

    // Boat load actions: combinations of (M, C) up to 2 people: (1,0), (2,0), (0,1), (0,2), (1,1)
    const combinations = [
      { m: 1, c: 0, act: '1 Missionary' },
      { m: 2, c: 0, act: '2 Missionaries' },
      { m: 0, c: 1, act: '1 Cannibal' },
      { m: 0, c: 2, act: '2 Cannibals' },
      { m: 1, c: 1, act: '1 Missionary & 1 Cannibal' }
    ];

    combinations.forEach(combo => {
      let nextMLeft, nextCLeft, nextSide;
      let actionText = '';

      if (side === 0) { // Boat on Left, traveling to Right
        nextMLeft = mLeft - combo.m;
        nextCLeft = cLeft - combo.c;
        nextSide = 1;
        actionText = `Cross ${combo.act} to Right`;
      } else { // Boat on Right, traveling to Left
        nextMLeft = mLeft + combo.m;
        nextCLeft = cLeft + combo.c;
        nextSide = 0;
        actionText = `Return ${combo.act} to Left`;
      }

      const nextMRight = 3 - nextMLeft;
      const nextCRight = 3 - nextCLeft;

      // Validate boundary conditions
      if (nextMLeft >= 0 && nextMLeft <= 3 && nextCLeft >= 0 && nextCLeft <= 3) {
        // Validate Cannibals do not outnumber Missionaries on either bank
        const leftSafe = nextMLeft === 0 || nextMLeft >= nextCLeft;
        const rightSafe = nextMRight === 0 || nextMRight >= nextCRight;

        if (leftSafe && rightSafe) {
          list.push({
            state: [nextMLeft, nextCLeft, nextSide],
            action: actionText,
            cost: 1
          });
        }
      }
    });

    return list;
  }
  getHCSuccessors(state) {
    return this.getSuccessors(state);
  }
  render(state, container) {
    DOMRenderer.drawMissionaries(state, container);
  }
}
