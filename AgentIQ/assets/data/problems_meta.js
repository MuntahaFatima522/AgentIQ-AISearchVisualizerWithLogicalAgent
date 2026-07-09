/* ============================================================
   problems_meta.js — Central Problem & Algorithm Registry
   All pages import this to know what problems/algos exist,
   what PEAS descriptions to show, and which renderer to use.
   ============================================================ */

const PROBLEMS_META = {

  romania: {
    id: "romania",
    title: "Romania Map Problem",
    icon: "🗺️",
    description: "Find the shortest path between cities in Romania using a weighted graph.",
    renderer: "canvas",   // canvas-based rendering
    defaultStart: "Arad",
    defaultGoal: "Bucharest",
    peas: {
      performance: "Minimize total path cost (distance in km) from start to goal city.",
      environment: "Weighted undirected graph of Romanian cities with road distances.",
      actuators: "Move along edges to adjacent cities.",
      sensors: "Current city name, adjacent cities, edge costs, heuristic (straight-line distance)."
    },
    algorithms: {
      uninformed: ["BFS", "DFS", "UCS"],
      informed:   ["Greedy", "AStar"],
      local:      []
    }
  },

  puzzle8: {
    id: "puzzle8",
    title: "8-Puzzle Problem",
    icon: "🧩",
    description: "Slide tiles to reach the goal configuration from a scrambled state.",
    renderer: "dom",
    peas: {
      performance: "Reach goal state in minimum number of moves.",
      environment: "3×3 grid with 8 numbered tiles and one blank space.",
      actuators: "Slide a tile into the blank space (up, down, left, right).",
      sensors: "Current tile positions, blank position, move history."
    },
    algorithms: {
      uninformed: ["BFS", "DFS", "UCS"],
      informed:   ["Greedy", "AStar"],
      local:      ["HillClimbing"]
    }
  },

  nqueens: {
    id: "nqueens",
    title: "N-Queens Problem",
    icon: "♛",
    description: "Place N queens on an N×N chessboard so no two queens threaten each other.",
    renderer: "dom",
    defaultN: 8,
    peas: {
      performance: "Place all N queens with zero conflicts.",
      environment: "N×N chessboard, N queen pieces.",
      actuators: "Place or move a queen on the board.",
      sensors: "Current queen positions, attack conflicts per queen."
    },
    algorithms: {
      uninformed: ["DFS"],
      informed:   [],
      local:      ["HillClimbing"]
    }
  },

  vacuum: {
    id: "vacuum",
    title: "Vacuum Cleaner World",
    icon: "🤖",
    description: "Navigate a grid world and clean all dirty cells using minimal actions.",
    renderer: "dom",
    peas: {
      performance: "Clean all cells with minimum moves. Penalty for re-visiting clean cells.",
      environment: "Grid of cells, each either clean or dirty.",
      actuators: "Move Left, Right, Up, Down; Suck (clean current cell).",
      sensors: "Current cell position, dirt status of current cell."
    },
    algorithms: {
      uninformed: ["BFS", "DFS", "UCS"],
      informed:   ["Greedy", "AStar"],
      local:      []
    }
  },

  wumpus: {
    id: "wumpus",
    title: "Wumpus World",
    icon: "👹",
    description: "Navigate a cave, avoid the Wumpus and pits, and retrieve the gold.",
    renderer: "dom",
    peas: {
      performance: "+1000 for grabbing gold, -1000 for death, -1 per action, -10 for shooting.",
      environment: "4×4 grid cave with Wumpus, pits, gold, and the agent.",
      actuators: "Move Forward, Turn Left/Right, Grab, Shoot arrow, Climb out.",
      sensors: "Breeze (near pit), Stench (near Wumpus), Glitter (gold nearby), Bump, Scream."
    },
    algorithms: {
      uninformed: ["BFS", "DFS", "UCS"],
      informed:   ["Greedy", "AStar"],
      local:      []
    }
  },

  maze: {
    id: "maze",
    title: "Maze Navigation",
    icon: "🌀",
    description: "Find a path from start to exit in a maze grid avoiding walls.",
    renderer: "canvas",
    peas: {
      performance: "Reach exit in minimum steps.",
      environment: "2D grid maze with walls, open cells, start, and exit.",
      actuators: "Move to adjacent open cell (up, down, left, right).",
      sensors: "Current position, adjacent cell types, distance to exit."
    },
    algorithms: {
      uninformed: ["BFS", "DFS", "UCS"],
      informed:   ["Greedy", "AStar"],
      local:      []
    }
  },

  tsp: {
    id: "tsp",
    title: "Travelling Salesman Problem",
    icon: "✈️",
    description: "Find the shortest route visiting all cities exactly once and returning to start.",
    renderer: "canvas",
    peas: {
      performance: "Minimize total tour distance visiting every city exactly once.",
      environment: "Complete weighted graph of cities with distances.",
      actuators: "Choose next unvisited city to travel to.",
      sensors: "Current city, visited cities, remaining cities, tour cost so far."
    },
    algorithms: {
      uninformed: ["UCS"],
      informed:   ["Greedy", "AStar"],
      local:      ["HillClimbing"]
    }
  },

  hanoi: {
    id: "hanoi",
    title: "Tower of Hanoi",
    icon: "🗼",
    description: "Move all disks from the source peg to the target peg using DFS.",
    renderer: "dom",
    defaultDisks: 4,
    peas: {
      performance: "Move all disks to target peg in minimum moves (optimal = 2^n - 1).",
      environment: "Three pegs (A, B, C) and N disks of different sizes.",
      actuators: "Move top disk from one peg to another (if smaller than top of destination).",
      sensors: "Current state of all three pegs, disk positions."
    },
    algorithms: {
      uninformed: ["DFS"],
      informed:   [],
      local:      []
    }
  },

  robot_path: {
    id: "robot_path",
    title: "Robot Path Planning",
    icon: "🦾",
    description: "Plan a collision-free path for a robot in a grid with obstacles.",
    renderer: "canvas",
    peas: {
      performance: "Reach goal position with minimum cost, avoiding all obstacles.",
      environment: "2D grid with free cells, obstacle cells, start position, goal position.",
      actuators: "Move to adjacent free cell (4-directional or 8-directional).",
      sensors: "Current position, surrounding cell types, distance to goal."
    },
    algorithms: {
      uninformed: ["BFS", "DFS", "UCS"],
      informed:   ["Greedy", "AStar"],
      local:      []
    }
  },

  sudoku: {
    id: "sudoku",
    title: "Sudoku Solver",
    icon: "🔢",
    description: "Fill a 9×9 Sudoku grid satisfying all row, column, and box constraints.",
    renderer: "dom",
    peas: {
      performance: "Fill all cells correctly with no constraint violations.",
      environment: "9×9 grid with some pre-filled numbers (1–9).",
      actuators: "Place a digit (1–9) in an empty cell.",
      sensors: "Current grid state, empty cells, valid digits per cell."
    },
    algorithms: {
      uninformed: ["DFS"],
      informed:   [],
      local:      ["HillClimbing"]
    }
  }
};

/* -------- Algorithm Display Names & Colors -------- */
const ALGO_META = {
  BFS:          { label: "BFS",           fullName: "Breadth-First Search",    type: "uninformed", color: "#60a5fa" },
  DFS:          { label: "DFS",           fullName: "Depth-First Search",      type: "uninformed", color: "#60a5fa" },
  UCS:          { label: "UCS",           fullName: "Uniform Cost Search",     type: "uninformed", color: "#60a5fa" },
  Greedy:       { label: "Greedy",        fullName: "Greedy Best-First Search",type: "informed",   color: "#4ade80" },
  AStar:        { label: "A*",            fullName: "A* Search",               type: "informed",   color: "#4ade80" },
  HillClimbing: { label: "Hill Climbing", fullName: "Hill Climbing",           type: "local",      color: "#fbbf24" }
};

/* -------- Tab labels -------- */
const TAB_LABELS = {
  uninformed: "Uninformed Search",
  informed:   "Informed Search",
  local:      "Local Search"
};

/* -------- Helper: get all problems as array -------- */
function getAllProblems() {
  return Object.values(PROBLEMS_META);
}

/* -------- Helper: get algorithms for a problem -------- */
function getAlgorithmsForProblem(problemId) {
  const problem = PROBLEMS_META[problemId];
  if (!problem) return { uninformed: [], informed: [], local: [] };
  return problem.algorithms;
}

/* -------- Helper: get PEAS for a problem -------- */
function getPEAS(problemId) {
  return PROBLEMS_META[problemId]?.peas || {};
}