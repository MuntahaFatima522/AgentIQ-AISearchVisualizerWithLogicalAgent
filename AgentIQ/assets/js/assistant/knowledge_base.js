/* ============================================================
   knowledge_base.js — Agent IQ Knowledge Base
   Pure generic knowledge — NO simulation context questions.
   All problems, all algorithms, PEAS, search types, concepts.
   ============================================================ */

function pidExtra(map, pid) {
  return map[pid] ? '<br><br>' + map[pid] : '';
}

export const KB = [
  // GREETINGS
  { keywords: ['hi', 'hello', 'hey', 'hii', 'helo', 'yo', 'sup', 'howdy', 'good morning', 'good afternoon', 'assalam', 'salaam'],
    response: `Hey! 👋 I'm <b>Agent IQ</b>, your AI learning assistant. Ask me anything about AI search algorithms, problems, PEAS, or search strategies!`,
    topic: 'greeting' },
  { keywords: ['okie', 'okeh', 'ok', 'okay', 'thank', 'thanks', 'thank you', 'thankyou', 'great', 'awesome', 'perfect', 'nice', 'well done'],
    response: `Glad that you understood 😊 Ask me anything else you'd like to know!`,
    topic: 'gratitude' },
  { keywords: ['by', 'bye', 'goodbye', 'see you', 'cya', 'later'],
    response: `Goodbye! 🚀 Keep exploring AI — you're doing great!`,
    topic: 'farewell' },

  // AI / SEARCH / AGENTS
  { keywords: ['ai', 'aritifcial intelligence', 'what is ai', 'what is artificial intelligence', 'artificial intelligence mean', 'ai mean', 'artificial intelligence'],
    response: `<b>Artificial Intelligence (AI)</b> is the science of making machines that can think, learn, and solve problems like humans. AI Search is a core area — it finds sequences of actions leading from an initial state to a goal state.`,
    topic: 'concept' },
  { keywords: ['search algo', 'search algorithm', 'what is search', 'what is search algorithm', 'search algorithm mean', 'why search'],
    response: `An <b>AI Search Algorithm</b> finds a path from an <b>initial state</b> to a <b>goal state</b> by exploring a state space. The agent tries different actions at each step until it reaches the goal. Different algorithms explore the space differently — by cost, depth, heuristic, etc.`,
    topic: 'concept' },
  { keywords: ['agent', 'what is agent', 'intelligent agent', 'rational agent', 'ai agent', 'what is an agent'],
    response: `An <b>AI Agent</b> perceives its environment through <b>sensors</b> and acts through <b>actuators</b>. A rational agent selects actions that <b>maximise its performance measure</b>.<br>Types: Simple Reflex, Model-Based, Goal-Based, Utility-Based, Learning agents.`,
    topic: 'concept' },
  { keywords: ['inference agent', 'what is inference agent', 'what is logical agent', 'logical agent', 'knowledge base agent', 'what is kb agent'],
    response: `A <b>Logical Agent</b> uses formal logic to represent knowledge and make inferences. It maintains a <b>Knowledge Base (KB)</b> of facts and uses inference rules to derive new facts and decide actions.<br>Example: In Wumpus World, the agent infers "cell (2,1) is safe" from "no stench felt at (1,1) and (1,2)".`,
    topic: 'concept' },

  // PEAS
  { keywords: ['what is peas', 'peas mean', 'peas stand', 'explain peas', 'peas framework', 'peas description', 'peas'],
    response: `<b>PEAS</b> = <b>P</b>erformance · <b>E</b>nvironment · <b>A</b>ctuators · <b>S</b>ensors<br><br>
A framework to fully describe an AI agent:<br>
• <b>Performance</b> — How is success measured? (minimize cost, maximize score…)<br>
• <b>Environment</b> — What world does the agent live in? (map, grid, board…)<br>
• <b>Actuators</b> — What actions can the agent take? (move, suck, shoot…)<br>
• <b>Sensors</b> — What can the agent perceive? (position, cost, stench…)`,
    topic: 'peas' },
  { keywords: ['performance', 'what is performance', 'performance measure', 'performance in peas', 'what does performance mean', 'define performance'],
    response: (pid) => {
      const m = {
        romania: 'In Romania, <b>Performance</b> = minimize total road distance (km) from Arad to Bucharest. Optimal = 418 km.',
        puzzle8: 'In 8-Puzzle, <b>Performance</b> = reach goal in minimum number of tile moves.',
        nqueens: 'In N-Queens, <b>Performance</b> = minimize queen conflicts. Goal = 0 conflicts.',
        vacuum: 'In Vacuum World, <b>Performance</b> = clean all cells with fewest actions. Penalty for unnecessary moves.',
        wumpus: 'In Wumpus World, <b>Performance</b> = +1000 gold, −1000 death, −1/action, −10 shoot.',
        maze: 'In Maze, <b>Performance</b> = reach exit in fewest steps.',
        tsp: 'In TSP, <b>Performance</b> = minimize total tour distance visiting all cities.',
        hanoi: 'In Hanoi, <b>Performance</b> = move all disks in minimum moves (optimal = 2^N−1).',
        robot_path: 'In Robot Path, <b>Performance</b> = shortest collision-free path to goal.',
        sudoku: 'In Sudoku, <b>Performance</b> = fill grid correctly with zero violations.'
      };
      return `<b>Performance Measure</b> defines how success is evaluated for the agent. It is what the agent is trying to optimise.${pidExtra(m, pid)}`;
    },
    topic: 'peas' },
  { keywords: ['environment', 'what is environment', 'environment in peas', 'environment mean', 'define environment', 'environment peas'],
    response: (pid) => {
      const m = {
        romania: 'In Romania, <b>Environment</b> = weighted graph of 20 cities connected by roads. Fully observable, static, discrete.',
        puzzle8: 'In 8-Puzzle, <b>Environment</b> = 3×3 grid with 8 tiles and 1 blank. Fully observable, deterministic.',
        nqueens: 'In N-Queens, <b>Environment</b> = N×N chessboard with N queens. Fully observable.',
        vacuum: 'In Vacuum World, <b>Environment</b> = grid of clean/dirty cells. Partially observable in basic version.',
        wumpus: 'In Wumpus World, <b>Environment</b> = 4×4 cave with Wumpus, Pits, Gold. <b>Partially observable</b> — agent only senses adjacent cells.',
        maze: 'In Maze, <b>Environment</b> = 2D grid with open cells and walls.',
        tsp: 'In TSP, <b>Environment</b> = complete weighted graph of cities with known distances.',
        hanoi: 'In Hanoi, <b>Environment</b> = three pegs (A,B,C) with N disks. Fully observable.',
        robot_path: 'In Robot Path, <b>Environment</b> = 2D grid with free cells and obstacles.',
        sudoku: 'In Sudoku, <b>Environment</b> = 9×9 grid with pre-filled numbers. Fully observable.'
      };
      return `<b>Environment</b> is the world the agent operates in. Environments can be: fully/partially observable, deterministic/stochastic, static/dynamic, discrete/continuous.${pidExtra(m, pid)}`;
    },
    topic: 'peas' },
  { keywords: ['actuator', 'what is actuator', 'actuators mean', 'actuators in peas', 'define actuator', 'what can agent do', 'agent actions'],
    response: (pid) => {
      const m = {
        romania: 'In Romania, <b>Actuators</b> = drive to any adjacent connected city.',
        puzzle8: 'In 8-Puzzle, <b>Actuators</b> = slide a tile (Up/Down/Left/Right) into the blank.',
        nqueens: 'In N-Queens, <b>Actuators</b> = DFS: place a queen in a row. Hill Climbing: move a queen to reduce conflicts.',
        vacuum: 'In Vacuum World, <b>Actuators</b> = Move (4 directions) or Suck (clean current cell).',
        wumpus: 'In Wumpus World, <b>Actuators</b> = Move Forward, Turn Left/Right, Grab, Shoot arrow, Climb out.',
        maze: 'In Maze, <b>Actuators</b> = move to adjacent open cell (Up/Down/Left/Right).',
        tsp: 'In TSP, <b>Actuators</b> = choose next city to travel to.',
        hanoi: 'In Hanoi, <b>Actuators</b> = move top disk from one peg to another (if valid).',
        robot_path: 'In Robot Path, <b>Actuators</b> = move to adjacent free cell.',
        sudoku: 'In Sudoku, <b>Actuators</b> = place digit 1–9 in an empty cell.'
      };
      return `<b>Actuators</b> are the mechanisms through which the agent acts on the environment — the agent's outputs or possible actions.${pidExtra(m, pid)}`;
    },
    topic: 'peas' },
  { keywords: ['sensor', 'what is sensor', 'sensors mean', 'sensors in peas', 'define sensor', 'what agent perceive', 'agent perceive'],
    response: (pid) => {
      const m = {
        romania: 'In Romania, <b>Sensors</b> = current city name, adjacent cities with road costs, SLD to Bucharest.',
        puzzle8: 'In 8-Puzzle, <b>Sensors</b> = full 3×3 tile configuration — all tile values and blank position.',
        nqueens: 'In N-Queens, <b>Sensors</b> = all queen positions and total conflict count.',
        vacuum: 'In Vacuum World, <b>Sensors</b> = whether current cell is dirty or clean.',
        wumpus: 'In Wumpus World, <b>Sensors</b> = Stench, Breeze, Glitter, Bump, Scream.',
        maze: 'In Maze, <b>Sensors</b> = current (row,col) position, adjacent cell types.',
        tsp: 'In TSP, <b>Sensors</b> = current city, unvisited cities, all inter-city distances, tour cost so far.',
        hanoi: 'In Hanoi, <b>Sensors</b> = complete state of all three pegs.',
        robot_path: 'In Robot Path, <b>Sensors</b> = current position, surrounding cell types, distance to goal.',
        sudoku: 'In Sudoku, <b>Sensors</b> = entire 9×9 grid — all filled and empty cells.'
      };
      return `<b>Sensors</b> are how the agent perceives its environment — its inputs for making decisions.${pidExtra(m, pid)}`;
    },
    topic: 'peas' },

  // SEARCH TYPES
  { keywords: ['what is uninformed search', 'uninformed search algorithm', 'uninformed search', 'blind search', 'explain uninformed', 'uninformed algorithm'],
    response: `<b>Uninformed Search</b> (Blind Search) explores without any knowledge of where the goal is.<br>
• Follows a fixed strategy with no domain knowledge<br>
• <b>Examples:</b> BFS, DFS, UCS<br>
• <b>Complete:</b> BFS ✓, UCS ✓, DFS ✗ | <b>Optimal:</b> UCS ✓, BFS ✓ (uniform), DFS ✗<br>
• <b>When to use:</b> No domain knowledge available about the goal`,
    topic: 'search' },
  { keywords: ['what is informed search', 'informed search algorithm', 'informed search', 'heuristic search', 'explain informed', 'informed algorithm'],
    response: `<b>Informed Search</b> uses a <b>heuristic h(n)</b> — domain knowledge estimating goal distance — to guide search.<br>
• Prioritises states that look more promising<br>
• <b>Examples:</b> Greedy Best-First Search, A*<br>
• Much faster than uninformed — avoids exploring bad states<br>
• Requires an admissible heuristic for A* to be optimal`,
    topic: 'search' },
  { keywords: ['what is local search', 'local search algorithm', 'explain local search', 'local search'],
    response: `<b>Local Search</b> works with one current state — no frontier, no search tree.<br>
• Moves to neighbouring states iteratively<br>
• <b>Examples:</b> Hill Climbing, Simulated Annealing, Genetic Algorithms<br>
• <b>Memory:</b> O(1) — only keeps current state<br>
• <b>Problem:</b> Gets stuck at local optima<br>
• <b>When to use:</b> Large spaces, want a good solution fast`,
    topic: 'search' },

  // BFS
  { keywords: ['bfs', 'what is bfs', 'explain bfs', 'bfs algorithm', 'breadth first search', 'breadth first', 'breadth-first search', 'how does bfs work', 'how bfs works', 'bfs mean', 'describe bfs', 'bfs search', 'bfs explained', 'how does breadth first work'],
    response: (pid) => {
      const ctx = {
        romania: 'In Romania, BFS explores cities level by level from Arad — first Zerind/Timisoara/Sibiu (depth 1), then their neighbours (depth 2). Finds fewest hops but not necessarily fewest km.',
        puzzle8: 'In 8-Puzzle, BFS tries all 1-move states first, then 2-move. Guarantees minimum move count.',
        maze: 'In Maze, BFS expands rings of cells outward from start — always finds shortest step count.',
        vacuum: 'In Vacuum World, BFS finds minimum-action cleaning sequence.',
        robot_path: 'In Robot Path, BFS finds shortest path in steps on the grid.'
      };
      return `<b>BFS — Breadth-First Search</b><br>
Explores level by level using a <b>FIFO queue</b>. All depth-1 nodes first, then depth-2, etc.<br>
• <b>Complete:</b> ✓ Yes &nbsp;• <b>Optimal:</b> ✓ Yes (uniform cost) &nbsp;• <b>Space:</b> O(b^d)<br>
• Uses a lot of memory — stores all nodes at current level${pidExtra(ctx, pid)}`;
    },
    topic: 'algorithm' },

  // DFS
  { keywords: ['dfs', 'what is dfs', 'explain dfs', 'dfs algorithm', 'depth first search', 'depth first', 'depth-first search', 'how does dfs work', 'how dfs works', 'dfs mean', 'describe dfs', 'dfs search', 'dfs explained', 'how does depth first work'],
    response: (pid) => {
      const ctx = {
        romania: 'In Romania, DFS dives deep — e.g. Arad→Sibiu→Fagaras→Bucharest — before backtracking. May not find shortest km path.',
        nqueens: 'In N-Queens, DFS places queens column by column, backtracking immediately on any conflict.',
        hanoi: 'In Tower of Hanoi, DFS maps the recursive solution perfectly — subproblems explored depth-first.',
        sudoku: 'In Sudoku, DFS fills cells one by one, backtracking when no valid digit exists.',
        maze: 'In Maze, DFS dives deep into corridors — may find a longer winding path.'
      };
      return `<b>DFS — Depth-First Search</b><br>
Dives deep along one path before backtracking, using a <b>LIFO stack</b>.<br>
• <b>Complete:</b> ✗ No (can loop) &nbsp;• <b>Optimal:</b> ✗ No &nbsp;• <b>Space:</b> O(bm) — very memory efficient${pidExtra(ctx, pid)}`;
    },
    topic: 'algorithm' },

  // UCS
  { keywords: ['ucs', 'what is ucs', 'explain ucs', 'uniform cost search', 'uniform cost', 'ucs algorithm', 'how does ucs work', 'how ucs works', 'ucs mean', 'describe ucs', 'uniform cost search explained'],
    response: (pid) => {
      const ctx = {
        romania: 'In Romania, UCS picks cheapest road next — finds optimal 418 km: Arad→Sibiu→Rimnicu→Pitesti→Bucharest.',
        tsp: 'In TSP, UCS explores tours in order of accumulated distance. Optimal but slow for many cities.',
        maze: 'In Maze (uniform costs), UCS behaves exactly like BFS.',
        robot_path: 'In Robot Path (uniform step cost), UCS = BFS.'
      };
      return `<b>UCS — Uniform Cost Search</b><br>
Expands node with <b>lowest path cost g(n)</b> using a min-priority queue.<br>
• <b>Complete:</b> ✓ Yes &nbsp;• <b>Optimal:</b> ✓ Always &nbsp;• Generalises BFS to weighted graphs${pidExtra(ctx, pid)}`;
    },
    topic: 'algorithm' },

  // GREEDY
  { keywords: ['greedy', 'what is greedy', 'explain greedy', 'greedy best first', 'greedy best-first', 'greedy algorithm', 'how does greedy work', 'greedy search', 'describe greedy', 'greedy best-first', 'greedy search explained', 'how does greedy best-first work'],
    response: (pid) => {
      const ctx = {
        romania: 'In Romania, Greedy picks city with smallest SLD to Bucharest. May find 450 km path instead of optimal 418 km.',
        maze: 'In Maze, Greedy always moves toward exit by Manhattan distance. Can get stuck behind walls.',
        tsp: 'In TSP, Greedy visits nearest unvisited city (nearest-neighbour). Fast but ~20-25% above optimal.',
        robot_path: 'In Robot Path, Greedy rushes toward goal but may take suboptimal routes around obstacles.'
      };
      return `<b>Greedy Best-First Search</b><br>
Expands node <b>closest to goal by h(n)</b> — ignores actual cost g(n).<br>
• <b>Complete:</b> ✗ No &nbsp;• <b>Optimal:</b> ✗ No &nbsp;• Fast but not always correct${pidExtra(ctx, pid)}`;
    },
    topic: 'algorithm' },

  // A*
  { keywords: ['a*', 'what is a*', 'explain a*', 'a star algorithm', 'a star', 'astar', 'how does a* work', 'how a* works', 'a star search', 'describe a*', 'why use a*', 'astar explained', 'f(n) = g(n) + h(n)'],
    response: (pid) => {
      const ctx = {
        romania: 'In Romania, A* uses g(n)=road distance + h(n)=SLD. Finds optimal 418 km with far fewer node expansions than UCS.',
        puzzle8: 'In 8-Puzzle, A* with Manhattan distance finds optimal moves while exploring far fewer states than BFS.',
        maze: 'In Maze, A* guides search toward exit — finds shortest path faster than BFS.',
        robot_path: 'In Robot Path, A* is the gold standard — used in real robotics, games, GPS navigation.',
        tsp: 'In TSP, A* uses lower-bound heuristic. Optimal but slow for many cities.'
      };
      return `<b>A* Search</b><br>
Uses <b>f(n) = g(n) + h(n)</b> — actual cost + heuristic estimate.<br>
• <b>Complete:</b> ✓ Yes &nbsp;• <b>Optimal:</b> ✓ Yes (admissible h) &nbsp;• Best of UCS + Greedy${pidExtra(ctx, pid)}`;
    },
    topic: 'algorithm' },

  // HILL CLIMBING
  { keywords: ['hill climbing', 'what is hill climbing', 'explain hill climbing', 'hill climb', 'hill climbing algorithm', 'how hill climbing works', 'steepest ascent', 'describe hill climbing', 'hill climbing explained', 'how does hill climbing work'],
    response: (pid) => {
      const ctx = {
        nqueens: 'In N-Queens, Hill Climbing starts with random queen positions, moves queens to reduce conflicts. Often solves 8-Queens quickly but can get stuck.',
        puzzle8: 'In 8-Puzzle, HC picks move giving lowest Manhattan distance. Gets stuck if no move improves heuristic.',
        tsp: 'In TSP, HC tries 2-opt swaps — reversing tour segments to reduce total distance.',
        sudoku: 'In Sudoku, HC swaps digits within boxes to reduce row/column violations.'
      };
      return `<b>Hill Climbing</b> (Local Search)<br>
Starts at a state and always moves to the <b>best neighbouring state</b>. No backtracking. O(1) memory.<br>
• <b>Complete:</b> ✗ No &nbsp;• <b>Optimal:</b> ✗ No &nbsp;• Can get stuck at local optima, plateaux, ridges${pidExtra(ctx, pid)}`;
    },
    topic: 'algorithm' },

  // HEURISTICS
  { keywords: ['heuristic', 'what is heuristic', 'heuristic function', 'explain heuristic', 'heuristic mean', 'what does h mean', 'h(n)', 'define heuristic', 'heuristic function', 'hn meaning'],
    response: `<b>Heuristic h(n)</b> = estimated cost from node n to the goal.<br>
Gives the algorithm domain knowledge to prioritise promising states.<br>
• <b>Admissible:</b> h(n) ≤ true cost — never overestimates → A* is optimal<br>
• <b>Informative:</b> closer to true cost = fewer nodes expanded<br>
Examples: Straight-Line Distance (Romania), Manhattan Distance (8-Puzzle, Maze, Robot Path)`,
    topic: 'heuristic' },
  { keywords: ['admissible', 'what is admissible', 'admissible heuristic', 'admissible mean', 'never overestimate', 'consistent heuristic', 'explain admissible'],
    response: `A heuristic is <b>admissible</b> if it <b>never overestimates</b> the true cost: h(n) ≤ h*(n).<br>
Why it matters: guarantees <b>A* finds the optimal solution</b>.<br>
• SLD to Bucharest ✓ — roads are always ≥ straight line<br>
• Manhattan distance ✓ — tiles can't teleport, actual moves ≥ Manhattan<br>
If h(n) = 0 always → admissible but uninformative (A* degenerates to UCS)`,
    topic: 'heuristic' },
  { keywords: ['consistent heuristic', 'monotone heuristic', 'what is consistent'],
    response: `<b>Consistent Heuristic:</b> h(n) ≤ cost(n,n') + h(n'). Every consistent heuristic is admissible. Consistency ensures A* never re-expands a node. SLD and Manhattan distance are both consistent.`,
    topic: 'heuristic' },
  { keywords: ['f(n)', 'what is f(n)', 'fn value', 'f value', 'f(n) mean', 'explain f', 'what is f', 'fn meaning', 'f of n', 'evaluation function astar', 'f n astar'],
    response: `<b>f(n) = g(n) + h(n)</b> — the evaluation function used by A*.<br>
• <b>g(n)</b> = actual cost from start to node n (known exactly)<br>
• <b>h(n)</b> = heuristic estimate from n to goal<br>
• <b>f(n)</b> = estimated total cost of cheapest solution through n<br>
A* always expands the node with the <b>lowest f(n)</b> first.`,
    topic: 'heuristic' },
  { keywords: ['g(n)', 'what is g(n)', 'gn value', 'g value', 'g(n) mean', 'path cost g', 'actual cost', 'cost from start', 'what is g', 'g n meaning', 'g of n', 'path cost', 'cost so far', 'gn cost'],
    response: (pid) => {
      const m = {
        romania: 'g(n) in Romania = total road distance (km) from Arad. g(Sibiu)=140, g(Rimnicu)=220, g(Pitesti)=317, g(Bucharest)=418.',
        puzzle8: 'g(n) in 8-Puzzle = number of tile moves from initial state.',
        maze: 'g(n) in Maze = number of steps from start cell.',
        robot_path: 'g(n) in Robot Path = number of grid steps from start.',
        tsp: 'g(n) in TSP = total tour distance accumulated so far.'
      };
      return '<b>g(n)</b> = actual path cost from initial state to node n. Sum of all step costs along the path taken.' + (m[pid] ? '<br>' + m[pid] : '');
    },
    topic: 'heuristic' },
  { keywords: ['h(n)', 'what is h(n)', 'hn value', 'h value', 'h(n) mean', 'heuristic value', 'what is h', 'h n heuristic', 'what does h mean'],
    response: (pid) => {
      const m = {
        romania: 'h(n) in Romania = Straight-Line Distance to Bucharest. h(Arad)=366, h(Sibiu)=253, h(Rimnicu)=193, h(Pitesti)=100, h(Bucharest)=0.',
        puzzle8: 'h(n) in 8-Puzzle = Manhattan distance — sum of tile distances from goal positions.',
        maze: 'h(n) in Maze = |row−exit_row| + |col−exit_col| (Manhattan to exit).',
        robot_path: 'h(n) in Robot Path = Manhattan distance to goal.',
        tsp: 'h(n) in TSP = estimated remaining distance to complete the tour.'
      };
      return '<b>h(n)</b> = heuristic estimate from current node to goal. h=0 at goal. Must be admissible for A* to be optimal.' + (m[pid] ? '<br>' + m[pid] : '');
    },
    topic: 'heuristic' },
  { keywords: ['manhattan', 'what is manhattan', 'manhattan distance', 'manhattan heuristic', 'manhattan mean', 'explain manhattan', 'city block distance'],
    response: (pid) => `<b>Manhattan Distance</b> = |r1−r2| + |c1−c2| between two grid cells.<br>
Counts minimum horizontal + vertical steps needed (no diagonals).<br>
Used in: 8-Puzzle, Maze, Robot Path Planning.<br>
<b>Admissible:</b> with 4-directional movement, actual path ≥ Manhattan distance always.${(pid === 'maze' || pid === 'robot_path') ? ' Used as h(n) in Maze/Robot Path.' : (pid === 'puzzle8' ? " Sum of each tile's distance from goal position." : '')}`,
    topic: 'heuristic' },
  { keywords: ['straight line distance', 'what is straight line distance', 'sld', 'straight-line distance', 'why sld admissible', 'sld heuristic', 'what is sld'],
    response: `<b>Straight-Line Distance (SLD)</b> to Bucharest is Romania's heuristic.<br>
Key values: Arad=366, Sibiu=253, Rimnicu=193, Fagaras=176, Pitesti=100, Bucharest=0.<br>
<b>Admissible because:</b> real road distance is always ≥ straight line. Roads curve, the straight line doesn't.`,
    topic: 'heuristic' },
  { keywords: ['misplaced tiles', 'misplaced', 'misplaced tiles heuristic'],
    response: '<b>Misplaced Tiles</b> counts how many tiles are not in their goal position. It is admissible for 8-puzzle. Simpler but less informative than Manhattan distance.',
    topic: 'heuristic' },

  // COMPLETENESS / OPTIMALITY / CONCEPTS
  { keywords: ['complete', 'what is complete', 'completeness', 'is algorithm complete', 'complete search', 'explain completeness', 'complete algorithm', 'is bfs complete', 'is dfs complete'],
    response: `<b>Completeness</b>: An algorithm is complete if it <b>guarantees finding a solution</b> when one exists.<br>
• BFS ✓ &nbsp;• UCS ✓ &nbsp;• A* ✓<br>
• DFS ✗ (can loop) &nbsp;• Greedy ✗ &nbsp;• Hill Climbing ✗ (local optima)`,
    topic: 'theory' },
  { keywords: ['optimal', 'what is optimal', 'optimality', 'optimal solution', 'optimal algorithm', 'explain optimality', 'find best solution', 'optimal algorithm', 'is bfs optimal', 'is astar optimal'],
    response: `<b>Optimality</b>: Algorithm always finds the <b>least-cost solution</b>.<br>
• UCS ✓ always &nbsp;• A* ✓ (admissible h) &nbsp;• BFS ✓ (uniform cost only)<br>
• DFS ✗ &nbsp;• Greedy ✗ &nbsp;• Hill Climbing ✗`,
    topic: 'theory' },
  { keywords: ['local optimum', 'what is local optimum', 'local optima', 'why stuck', 'get stuck', 'local maximum', 'plateau', 'ridge', 'local minimum', 'stuck hill climbing', 'plateau hill climbing'],
    response: `<b>Local Optimum</b>: A state better than all neighbours but NOT the global best.<br>
Hill Climbing stops here — no neighbour improves the score.<br>
• <b>Plateau</b> — all neighbours equal value<br>
• <b>Ridge</b> — must move sideways before improving<br>
Solutions: Random Restarts, Simulated Annealing, Beam Search`,
    topic: 'theory' },
  { keywords: ['frontier', 'what is frontier', 'open list', 'frontier mean', 'define frontier', 'frontier meaning', 'what is open list'],
    response: `<b>Frontier</b> = nodes discovered but not yet expanded. The boundary between explored and unexplored.<br>
• BFS: Queue (FIFO) &nbsp;• DFS: Stack (LIFO)<br>
• UCS: Min-PQ by g(n) &nbsp;• Greedy: Min-PQ by h(n) &nbsp;• A*: Min-PQ by f(n)`,
    topic: 'theory' },
  { keywords: ['closed list', 'closed set', 'explored set', 'visited nodes', 'what is closed list'],
    response: `<b>Closed List (Explored)</b> = nodes fully expanded. Prevents re-expanding and infinite loops.`,
    topic: 'theory' },
  { keywords: ['backtracking', 'what is backtracking', 'backtracking mean', 'explain backtracking', 'backtrack'],
    response: (pid) => {
      const m = {
        sudoku: 'In Sudoku: place digit → recurse → if stuck, undo and try next digit. Guaranteed to find solution.',
        nqueens: 'In N-Queens: place queen → if conflict, try next row → if all rows fail, backtrack to previous column.',
        puzzle8: 'In 8-Puzzle DFS: explore a move path → if dead end, backtrack and try another move.'
      };
      return '<b>Backtracking</b>: when a dead end is reached, undo the last decision and try the next alternative. Core technique in DFS-based solving.' + (m[pid] ? '<br>' + m[pid] : '');
    },
    topic: 'theory' },
  { keywords: ['state', 'what is state', 'state mean', 'define state'],
    response: (pid) => {
      const m = {
        romania: 'State in Romania = current city name. 20 possible states.',
        puzzle8: 'State in 8-Puzzle = arrangement of all 9 tiles, e.g. [1,2,3,4,0,5,6,7,8]. 181,440 reachable states.',
        nqueens: 'State in N-Queens = queens[col] = row of queen in each column.',
        vacuum: 'State in Vacuum = (agent position, set of dirty cells).',
        wumpus: 'State in Wumpus = (agent position, has_gold, wumpus_alive, visited cells).',
        maze: 'State in Maze = (row, col) of agent.',
        tsp: 'State in TSP = (current city, visited cities list, cost so far).',
        hanoi: 'State in Hanoi = disk arrangement on all 3 pegs.',
        robot_path: 'State in Robot Path = (row, col) of robot.',
        sudoku: 'State in Sudoku = complete 9×9 grid with current digit assignments (0=empty).'
      };
      return '<b>State</b> = complete description of the agent\'s current situation — everything needed to decide the next action.' + (m[pid] ? '<br>' + m[pid] : '');
    },
    topic: 'theory' },
  { keywords: ['state space', 'what is state space'],
    response: `<b>State Space:</b> All possible states connected by actions (a graph). Nodes=states, Edges=actions. Search finds a path from start to goal through this graph.`,
    topic: 'theory' },
  { keywords: ['goal', 'what is goal', 'goal state', 'goal test', 'what is the goal', 'goal mean'],
    response: (pid) => {
      const m = {
        romania: '<b>Goal</b>: Reach <b>Bucharest</b> from Arad. Optimal path = Arad→Sibiu→Rimnicu→Pitesti→Bucharest = <b>418 km</b>.',
        puzzle8: '<b>Goal</b>: Tile arrangement [1,2,3,4,5,6,7,8,0] — numbers in order, blank at bottom-right.',
        nqueens: '<b>Goal</b>: All N queens placed with <b>zero conflicts</b>. For 8-Queens, 92 solutions exist.',
        vacuum: '<b>Goal</b>: All grid cells are <b>clean</b> — dirty set is empty.',
        wumpus: '<b>Goal</b>: <b>Grab the gold and return to (1,1)</b> alive. +1000 for gold, −1000 for death.',
        maze: '<b>Goal</b>: Reach the <b>exit cell</b> from the start.',
        tsp: '<b>Goal</b>: Visit every city exactly once and return to start with <b>minimum total distance</b>.',
        hanoi: '<b>Goal</b>: All disks on <b>Peg C</b> in order. Requires 2^N−1 moves.',
        robot_path: '<b>Goal</b>: Robot reaches the target cell via shortest collision-free path.',
        sudoku: '<b>Goal</b>: Fully filled 9×9 grid with zero constraint violations.'
      };
      return m[pid] || 'The <b>goal state</b> is the target condition. Search ends when the goal test returns true.';
    },
    topic: 'theory' },
  { keywords: ['branching factor', 'what is branching factor', 'what is branching factor'],
    response: `<b>Branching Factor (b)</b> = average successors per node. Romania~2.5, 8-Puzzle~3, N-Queens=N*(N-1). High b means huge search tree — why heuristics are essential!`,
    topic: 'theory' },
  { keywords: ['queue', 'what is queue', 'fifo', 'fifo queue'],
    response: '<b>Queue (FIFO)</b> is First-In-First-Out data structure. Nodes added to back, removed from front. Used in BFS to expand nodes level-by-level.',
    topic: 'theory' },
  { keywords: ['stack', 'what is stack', 'lifo', 'lifo stack'],
    response: '<b>Stack (LIFO)</b> is Last-In-First-Out data structure. Nodes added and removed from top. Used in DFS to explore deeply first.',
    topic: 'theory' },
  { keywords: ['priority queue', 'what is priority queue'],
    response: '<b>Priority Queue</b> retrieves elements by priority (lowest cost first). Used in UCS, A*, and Greedy to select next node based on heuristic or cost.',
    topic: 'theory' },
  { keywords: ['successor', 'successor state', 'what is successor', 'child node'],
    response: '<b>Successor (or Child Node)</b> is any state that can be reached from the current state by applying a single action. All successors form the frontier.',
    topic: 'theory' },
  { keywords: ['action', 'what is action', 'operator', 'transition'],
    response: '<b>Action</b> (or Operator) is a transition function that moves from one state to another. Each state may have multiple possible actions.',
    topic: 'theory' },
  { keywords: ['tree search','tree', 'search tree', 'what is search tree', 'tree depth'],
    response: '<b>Search Tree</b> represents the space of all possible action sequences. Root is initial state, leaves are goal/terminal states. Depth is solution length.',
    topic: 'theory' },
  { keywords: ['node', 'what is node', 'search node'],
    response: '<b>Node</b> is a data structure in the search tree. It contains state, parent pointer, action taken, path cost, and depth information.',
    topic: 'theory' },
  { keywords: ['depth', 'what is depth', 'search depth', 'd'],
    response: '<b>Depth (d)</b> is the length of the path from the root node to a given node. Root has depth 0, each action increases depth by 1.',
    topic: 'theory' },
  { keywords: ['cost', 'path cost', 'step cost', 'what is cost'],
    response: '<b>Cost</b> is the total cumulative expense of a path. <b>Step Cost</b> is the cost of a single action. Used by UCS and A* to find least-cost solutions.',
    topic: 'theory' },

  // PROBLEMS
  { keywords: ['romania', 'what is romania', 'romania problem', 'romania map', 'explain romania', 'romania search problem', 'how romania works', 'romania problem explained', 'optimal path romania'],
    response: `<b>Romania Map Problem</b> (from Russell & Norvig, AIMA textbook)<br>
Find the shortest road route from <b>Arad to Bucharest</b> on a map of 20 Romanian cities connected by weighted roads.<br>
<b>Optimal path:</b> Arad → Sibiu → Rimnicu → Pitesti → Bucharest = <b>418 km</b><br>
Used to demonstrate BFS, DFS, UCS, Greedy, and A*.`,
    topic: 'problem' },
  { keywords: ['8-puzzle', '8 puzzle', 'what is 8 puzzle', '8 puzzle problem', 'explain 8 puzzle', 'sliding puzzle', 'eight puzzle', '8 puzzle explained', 'how 8 puzzle works', '8 puzzle goal'],
    response: `<b>8-Puzzle Problem</b><br>
3×3 grid with 8 numbered tiles and one blank space. Slide tiles into goal configuration.<br>
<b>Goal state:</b> [1,2,3 / 4,5,6 / 7,8,_]<br>
<b>State space:</b> 181,440 reachable states<br>
<b>Heuristics:</b> Misplaced tiles (weak) or Manhattan distance (strong)`,
    topic: 'problem' },
  { keywords: ['n-queens', 'n queens', 'what is n queens', 'n queens problem', 'explain n queens', 'queens problem', 'nqueens'],
    response: `<b>N-Queens Problem</b><br>
Place N queens on an N×N chessboard so <b>no two queens threaten each other</b>.<br>
Two queens conflict if same row, column, or diagonal.<br>
<b>8-Queens:</b> 92 distinct solutions<br>
<b>DFS:</b> column-by-column placement with backtracking<br>
<b>Hill Climbing:</b> random start, minimise conflicts`,
    topic: 'problem' },
  { keywords: ['what is vacuum', 'vacuum world', 'vacuum cleaner world', 'explain vacuum', 'vacuum problem'],
    response: `<b>Vacuum Cleaner World</b><br>
Robot vacuum moves on a grid, cleaning dirty cells.<br>
<b>Actions:</b> Move (Up/Down/Left/Right), Suck (clean current cell)<br>
<b>State:</b> agent position + dirt configuration of all cells<br>
<b>Goal:</b> all cells clean with minimum actions`,
    topic: 'problem' },
  { keywords: ['wumpus world problem', 'what is wumpus', 'wumpus world', 'explain wumpus', 'wumpus problem', 'wumpus game', 'what is wumpus world', 'wumpus world explained', 'wumpus rules', 'how wumpus works'],
    response: `<b>Wumpus World</b><br>
4×4 cave with a monster (Wumpus), deadly Pits, Gold, and the Agent.<br>
<b>Goal:</b> Grab the gold and return to (1,1) safely.<br>
<b>Scoring:</b> +1000 gold, −1000 death, −1/action, −10 shoot<br>
<b>Key:</b> Partially observable — agent reasons from 5 percepts only.`,
    topic: 'problem' },
  { keywords: ['stench', 'what is stench', 'stench mean', 'stench wumpus', 'explain stench'],
    response: `<b>Stench</b> is a percept in Wumpus World. The agent smells stench when it is in a cell <b>adjacent to the Wumpus</b> (up/down/left/right, not diagonal).<br>
By combining stench from multiple cells, the agent can logically infer the Wumpus's location.`,
    topic: 'problem' },
  { keywords: ['breeze', 'what is breeze', 'breeze mean', 'breeze wumpus', 'explain breeze'],
    response: `<b>Breeze</b> is perceived when the agent is in a cell <b>adjacent to a Pit</b>. Pits are deadly — falling in means −1000 and game over.<br>
If a cell has NO breeze, all adjacent cells are guaranteed pit-free — safe to visit.`,
    topic: 'problem' },
  { keywords: ['glitter', 'what is glitter', 'glitter mean', 'glitter wumpus', 'explain glitter'],
    response: `<b>Glitter</b> is perceived when the agent is in the <b>same cell as the Gold</b>.<br>
Upon perceiving Glitter → immediately use <b>Grab</b> action (+1000 points).<br>
Then navigate back to (1,1) and Climb out to win.`,
    topic: 'problem' },
  { keywords: ['pit', 'what is pit', 'pit wumpus', 'pit mean', 'explain pit', 'what is a pit'],
    response: `A <b>Pit</b> is a deadly hole in Wumpus World. Entering a pit = −1000, game over.<br>
Pits are detected indirectly via <b>Breeze</b> in adjacent cells.<br>
If no breeze → all neighbours are pit-free. Standard 4×4 world has 3 pits.`,
    topic: 'problem' },
  { keywords: ['what is the wumpus', 'wumpus monster', 'kill wumpus', 'shoot wumpus', 'wumpus mean', 'explain wumpus monster'],
    response: `The <b>Wumpus</b> is a monster in one cave cell. Entering it = −1000, game over.<br>
Detected by <b>Stench</b> in adjacent cells. The agent has <b>one arrow</b>.<br>
If arrow hits Wumpus → Scream percept, Wumpus dies, cell becomes safe. Shooting costs −10 points.`,
    topic: 'problem' },
  { keywords: ['gold', 'what is gold wumpus', 'gold in wumpus', 'find gold', 'grab gold'],
    response: `The <b>Gold</b> is the primary objective in Wumpus World. It is in one fixed cell.<br>
Agent detects it via <b>Glitter</b> percept (only when standing on gold cell).<br>
Grab it (+1000), then navigate back to (1,1) and Climb out to finish the game.`,
    topic: 'problem' },
  { keywords: ['perception', 'what is wumpus percepts', 'percepts wumpus', 'five percepts', 'wumpus senses'],
    response: `Wumpus World has <b>5 percepts</b>:<br>
1. <b>Stench</b> — Wumpus is adjacent<br>
2. <b>Breeze</b> — Pit is adjacent<br>
3. <b>Glitter</b> — Gold is here → Grab!<br>
4. <b>Bump</b> — Agent walked into a wall<br>
5. <b>Scream</b> — Arrow killed the Wumpus`,
    topic: 'problem' },
  { keywords: ['tsp', 'what is tsp', 'travelling salesman', 'tsp problem', 'explain tsp', 'salesman problem'],
    response: `<b>Travelling Salesman Problem (TSP)</b><br>
Find the shortest route visiting every city exactly once and returning to start.<br>
<b>NP-Hard</b> — (n−1)!/2 possible tours for n cities.<br>
<b>Greedy:</b> nearest-neighbour (fast, ~20-25% above optimal)<br>
<b>A*:</b> optimal but slow &nbsp;• <b>Hill Climbing:</b> 2-opt swaps to improve tour`,
    topic: 'problem' },
  { keywords: ['hanoi', 'tower of hanoi', 'what is tower of hanoi', 'hanoi problem', 'explain hanoi', 'what does hanoi mean', 'hanoi mean', 'tower of hanoi how', 'hanoi rules', 'hanoi optimal moves', 'how hanoi works'],
    response: `<b>Tower of Hanoi</b><br>
Move N disks from Peg A to Peg C using Peg B as auxiliary.<br>
<b>Rules:</b> (1) One disk at a time. (2) Larger disk cannot go on smaller disk.<br>
<b>Optimal moves:</b> 2^N − 1 (3 disks=7, 4 disks=15)<br>
<b>DFS</b> follows the recursive solution: move (N−1) to B, move N to C, move (N−1) to C.`,
    topic: 'problem' },
  { keywords: ['hanoi moves', 'how many moves hanoi', '2^n hanoi', 'minimum moves hanoi', 'optimal moves hanoi'],
    response: `Tower of Hanoi optimal moves = <b>2^N − 1</b><br>
• 3 disks → 7 moves &nbsp;• 4 disks → 15 moves<br>
• 5 disks → 31 moves &nbsp;• 10 disks → 1023 moves<br>
Recursive formula: move (N−1) A→B, disk N A→C, (N−1) B→C.`,
    topic: 'problem' },
  { keywords: ['robot path', 'robot path planning', 'what is robot path', 'explain robot path', 'robot problem', 'robot planning'],
    response: `<b>Robot Path Planning</b><br>
Find a collision-free path for a robot from start to goal on a 2D grid with obstacles.<br>
<b>A*</b> with Manhattan distance is the standard — used in real robotics, game AI, GPS.<br>
<b>BFS</b> finds shortest steps. <b>DFS</b> may find longer paths. <b>UCS</b> = BFS on uniform grids.`,
    topic: 'problem' },
  { keywords: ['sudoku', 'what is sudoku', 'sudoku problem', 'explain sudoku', 'sudoku solver', 'sudoku rules'],
    response: `<b>Sudoku Solver</b><br>
Fill 9×9 grid with digits 1−9 so each row, column, and 3×3 box contains each digit exactly once.<br>
<b>DFS + Backtracking:</b> fill next empty cell, try valid digits, backtrack if stuck.<br>
<b>Hill Climbing:</b> start with boxes filled, swap digits to reduce row/column violations.`,
    topic: 'problem' },
  { keywords: ['maze', 'what is maze', 'maze problem', 'explain maze', 'maze navigation'],
    response: `<b>Maze Navigation Problem</b><br>
Find path from start to exit in a 2D grid avoiding walls.<br>
<b>BFS:</b> shortest path in steps &nbsp;• <b>A*:</b> fastest with Manhattan heuristic<br>
<b>DFS:</b> dives deep — may find longer winding path`,
    topic: 'problem' },
  { keywords: ['conflict', 'what is conflict', 'conflict mean', 'queen attack', 'queens threaten', 'attacking queens'],
    response: (pid) => {
      if (pid === 'nqueens') return '<b>Conflict</b> in N-Queens: two queens share row, column, or diagonal. Hill Climbing minimises total conflicts. Goal = 0 conflicts.';
      if (pid === 'sudoku') return '<b>Conflict</b> in Sudoku: same digit appears twice in a row, column, or 3×3 box. Hill Climbing minimises conflict count.';
      return '<b>Conflict</b> = constraint violation — two entities in positions that violate the problem rules.';
    },
    topic: 'problem' },
  { keywords: ['what is sudoku constraint', 'sudoku constraint', 'sudoku rule', 'valid digit sudoku'],
    response: `Sudoku constraints: each digit 1−9 must appear <b>exactly once</b> in every row, column, and 3×3 box.<br>
DFS checks all three constraints before placing a digit. If no digit is valid, it backtracks.`,
    topic: 'problem' },
  { keywords: ['water jug', 'waterjug', 'what is water jug', 'water jug problem', 'explain water jug'],
    response: '<b>Water Jug</b> measures exactly 2 gallons in a 4-gal jug using a 3-gal jug. Operators: Fill, Empty, Pour. Heuristic: |j1 - 2|.',
    topic: 'problem' },
  { keywords: ['missionaries', 'cannibals', 'missionaries and cannibals', 'missionaries problem', 'explain missionaries'],
    response: '<b>Missionaries & Cannibals</b> transports 3M and 3C across a river. Cannibals cannot outnumber missionaries on either bank.',
    topic: 'problem' },

  // COMPARISONS
  { keywords: ['bfs vs dfs', 'difference bfs dfs', 'bfs or dfs', 'compare bfs dfs', 'which is better bfs dfs'],
    response: `<b>BFS vs DFS:</b><br>BFS = Queue (FIFO), explores level by level. <b>Complete ✓, Optimal ✓</b> (equal costs). Memory O(b^d).<br>DFS = Stack (LIFO), goes deep first. <b>Not complete ✗, Not optimal ✗</b>. Memory O(bm) — much less. Use BFS for shallow solutions, DFS when memory is tight.`,
    topic: 'comparison' },
  { keywords: ['greedy vs astar', 'a* vs greedy', 'astar vs greedy', 'compare greedy astar', 'greedy vs a*'],
    response: `<b>Greedy vs A*:</b><br>Greedy uses only <b>h(n)</b> — fast but NOT optimal. A* uses <b>f(n)=g(n)+h(n)</b> — optimal with admissible heuristic. Greedy follows a compass blindly; A* counts steps already taken too.`,
    topic: 'comparison' },
  { keywords: ['ucs vs astar', 'a* vs ucs', 'astar vs ucs', 'ucs vs a*'],
    response: `<b>UCS vs A*:</b> Both optimal. UCS uses only g(n); A* adds h(n). A* explores fewer nodes because h(n) guides it toward the goal. UCS = A* with h(n)=0 everywhere.`,
    topic: 'comparison' },
  { keywords: ['which algorithm is best', 'best algorithm', 'which algo to use', 'when to use bfs', 'when to use astar', 'choose algorithm'],
    response: (pid) => {
      const m = {
        romania: 'Romania → A* with SLD.',
        maze: 'Maze → A* with Manhattan distance.',
        puzzle8: '8-Puzzle → A* with Manhattan distance.',
        nqueens: 'N-Queens → Hill Climbing.',
        hanoi: 'Hanoi → DFS.',
        sudoku: 'Sudoku → DFS + backtracking.',
        tsp: 'TSP → Greedy or Hill Climbing.'
      };
      return (m[pid] ? m[pid] + '<br><br>' : '') + '<b>General:</b><br>Shortest steps→BFS | Optimal cost→UCS/A* | Large space+heuristic→A*/Greedy | Optimisation→Hill Climbing';
    },
    topic: 'comparison' },
  { keywords: ['bfs vs ucs', 'ucs vs bfs', 'difference bfs ucs', 'compare bfs ucs'],
    response: '<b>BFS vs UCS:</b> BFS assumes uniform step costs and expands level-by-level. UCS handles variable costs and expands by lowest path cost g(n). BFS is optimal only for uniform costs; UCS is always optimal.',
    topic: 'comparison' },
  { keywords: ['dfs vs bfs', 'dfs compared to bfs', 'difference between dfs and bfs'],
    response: '<b>DFS vs BFS:</b> DFS uses LIFO stack (linear space O(bm)), explores deep first, no guarantee of shortest path. BFS uses FIFO queue (exponential space O(bᵈ)), level-by-level, guarantees shortest path if costs equal.',
    topic: 'comparison' },
  { keywords: ['greedy best first search vs bfs', 'greedy vs bfs'],
    response: '<b>Greedy vs BFS:</b> BFS expands all nodes at depth d before d+1 (uninformed). Greedy uses heuristic h(n) to prioritize nodes closest to goal. Greedy is faster but not optimal; BFS is slower but optimal for uniform costs.',
    topic: 'comparison' },
  { keywords: ['hill climbing vs astar', 'astar vs hill climbing', 'hill climbing vs a*'],
    response: '<b>Hill Climbing vs A*:</b> Hill Climbing is local search with O(1) memory, gets stuck in local optima. A* is global search with O(bᵈ) memory, guaranteed optimal with admissible heuristic.',
    topic: 'comparison' },
  { keywords: ['greedy vs hill climbing', 'hill climbing vs greedy', 'compare hill climbing greedy'],
    response: '<b>Greedy Best-First vs Hill Climbing:</b> Greedy maintains frontier queue (memory O(bᵈ)) and explores all promising nodes. Hill Climbing keeps only current state (memory O(1)) and moves locally. Greedy more thorough but slower.',
    topic: 'comparison' },
  { keywords: ['dfs vs hill climbing', 'hill climbing vs dfs', 'compare dfs hill climbing'],
    response: '<b>DFS vs Hill Climbing:</b> DFS maintains stack of all unexplored children (memory O(bm)), explores paths exhaustively. Hill Climbing keeps only current state, moves to best neighbor. Hill Climbing faster but prone to local optima.',
    topic: 'comparison' },
  { keywords: ['informed vs uninformed', 'informed search vs uninformed', 'difference informed uninformed'],
    response: '<b>Informed vs Uninformed Search:</b> Uninformed (BFS, DFS, UCS) has no domain knowledge; searches all directions equally. Informed (Greedy, A*) uses heuristic h(n) to prioritize promising directions, expanding far fewer nodes.',
    topic: 'comparison' },
  { keywords: ['local search vs global search', 'global search vs local search'],
    response: '<b>Local vs Global Search:</b> Local search (Hill Climbing) keeps only current state, uses O(1) memory, fast but gets stuck at local optima. Global search (BFS, A*) keeps frontier, uses exponential memory, thorough but slower.',
    topic: 'comparison' },
  { keywords: ['a* vs ucs', 'ucs vs a*', 'astar vs ucs'],
    response: '<b>A* vs UCS:</b> A* is better because it uses both g(n) (path cost) and h(n) (heuristic estimate) to guide search. UCS only uses g(n), exploring in all directions. A* expands far fewer nodes while remaining optimal.',
    topic: 'comparison' },
  { keywords: ['bfs vs greedy', 'greedy vs bfs', 'compare bfs greedy'],
    response: '<b>BFS vs Greedy:</b> BFS is uninformed, expands level-by-level, uses exponential memory. Greedy is informed, prioritizes by h(n), uses less memory typically. BFS guarantees shortest path; Greedy is faster but not optimal.',
    topic: 'comparison' },
  { keywords: ['dfs vs ucs', 'ucs vs dfs', 'compare dfs ucs'],
    response: '<b>DFS vs UCS:</b> Both explore deeply initially. DFS is uninformed, not complete/optimal, uses linear memory O(bm). UCS is complete and optimal for any costs, uses exponential memory O(b^(C*/ε)).',
    topic: 'comparison' },
  { keywords: ['complete vs optimal', 'what is the difference between complete and optimal'],
    response: '<b>Complete vs Optimal:</b> <b>Complete</b> means the algorithm always finds a solution if one exists. <b>Optimal</b> means it finds the lowest-cost solution. BFS is complete and optimal (uniform costs); Greedy is neither.',
    topic: 'comparison' },

  // COMPLEXITY
  { keywords: ['bfs complexity', 'bfs time complexity', 'bfs space', 'bfs memory', 'time complexity bfs'],
    response: `<b>BFS:</b> Time O(b^d), Space O(b^d). Memory-hungry — b=10, d=10 means ~10 billion nodes!`,
    topic: 'complexity' },
  { keywords: ['bfs time complexity', 'time complexity bfs'],
    response: 'BFS time complexity is <b>O(bᵈ)</b>, where b is branching factor and d is depth of the shallowest solution.',
    topic: 'complexity' },
  { keywords: ['bfs space complexity', 'space complexity bfs', 'bfs memory'],
    response: 'BFS space complexity is <b>O(bᵈ)</b> because it must store all generated nodes in the frontier.',
    topic: 'complexity' },
  { keywords: ['dfs complexity', 'dfs time complexity', 'dfs space', 'dfs memory', 'time complexity dfs'],
    response: `<b>DFS:</b> Time O(b^m), Space O(b*m). Uses linear memory — only stores current path + siblings. Main advantage over BFS.`,
    topic: 'complexity' },
  { keywords: ['dfs time complexity', 'time complexity dfs'],
    response: 'DFS time complexity is <b>O(bᵐ)</b>, where m is maximum depth of the search tree. Can be very slow if search gets trapped down deep dead-ends.',
    topic: 'complexity' },
  { keywords: ['dfs space complexity', 'space complexity dfs', 'dfs memory'],
    response: 'DFS space complexity is <b>O(bm)</b>, which is linear. It only needs to store the path from the root to the current node, plus siblings.',
    topic: 'complexity' },
  { keywords: ['astar complexity', 'a* complexity', 'astar time complexity', 'time complexity astar'],
    response: `<b>A*:</b> O(b^d) worst case, but much better with a tight heuristic. Space is the weakness — keeps all nodes in memory. Tighter h(n) = fewer nodes expanded.`,
    topic: 'complexity' },
  { keywords: ['astar time complexity', 'time complexity astar'],
    response: 'A* time complexity is <b>O(bᵈ)</b>, but can be much better (even linear) with a highly informative and accurate heuristic.',
    topic: 'complexity' },
  { keywords: ['astar space complexity', 'space complexity astar', 'astar memory'],
    response: 'A* space complexity is <b>O(bᵈ)</b> because it retains all generated nodes in the priority queue frontier.',
    topic: 'complexity' },
  { keywords: ['ucs complexity', 'ucs time', 'ucs space', 'time complexity ucs'],
    response: `<b>UCS:</b> O(b^(1+C*/e)) where C*=optimal cost, e=min step cost. With equal costs behaves like BFS.`,
    topic: 'complexity' },
  { keywords: ['ucs time complexity', 'time complexity ucs'],
    response: 'UCS time complexity is <b>O(b^(1+⌊C*/ε⌋))</b> where C* is the optimal cost and ε is the minimum step cost.',
    topic: 'complexity' },
  { keywords: ['ucs space complexity', 'space complexity ucs', 'ucs memory'],
    response: 'UCS space complexity is <b>O(b^(1+⌊C*/ε⌋))</b> as it keeps all frontier nodes in memory.',
    topic: 'complexity' },
  { keywords: ['greedy time complexity', 'time complexity greedy'],
    response: 'Greedy Best-First search time complexity is <b>O(bᵐ)</b> in the worst case, but typically much faster.',
    topic: 'complexity' },
  { keywords: ['greedy space complexity', 'space complexity greedy', 'greedy memory'],
    response: 'Greedy space complexity is <b>O(bᵐ)</b> as it stores all nodes in the priority queue.',
    topic: 'complexity' },
  { keywords: ['hill climbing time complexity', 'time complexity hill climbing'],
    response: 'Hill climbing time complexity is <b>O(∞)</b> in case of loops/plateaus, but normally terminates quickly.',
    topic: 'complexity' },
  { keywords: ['hill climbing space complexity', 'space complexity hill climbing', 'hill climbing memory'],
    response: 'Hill climbing space complexity is <b>O(1)</b> as it only stores the current state. No search tree is maintained.',
    topic: 'complexity' },

  // 18. RESTARTS / LOCAL SEARCH DETAILS
  { keywords: ['random restarts', 'restart on stuck'],
    response: '<b>Random Restarts</b> periodically re-initializes Hill Climbing from a random state when stuck. This helps escape local optima and eventually find the global optimum.',
    topic: 'theory' },
  { keywords: ['simulated annealing', 'what is simulated annealing'],
    response: '<b>Simulated Annealing</b> is a local search strategy that accepts random worse moves with a decreasing probability (temperature) to escape local optima.',
    topic: 'theory' },
  { keywords: ['steepest descent', 'steepest ascent'],
    response: '<b>Steepest Descent/Ascent</b> is a Hill Climbing variant that evaluates all neighbors and moves to the one showing the maximum improvement.',
    topic: 'theory' },
  { keywords: ['min-conflicts', 'min conflicts'],
    response: '<b>Min-Conflicts</b> is a heuristic for constraint satisfaction problems. It selects a conflicted variable (e.g. column queen) and assigns it the value minimizing conflicts.',
    topic: 'heuristic' },
  { keywords: ['2-opt', '2 opt'],
    response: '<b>2-opt</b> is a local search operator for TSP. It deletes two edges and reconnects them in a reversed way, reducing total tour length if a cross-over is untangled.',
    topic: 'heuristic' },

  // EXTRA CONCEPTS
  { keywords: ['why astar good for maze', 'astar maze', 'best algorithm maze'],
    response: `A* is ideal for mazes: Manhattan distance is tight and admissible, explores toward the goal, and finds the shortest path. Typically expands 3-5× fewer cells than BFS on a 15×15 maze.`,
    topic: 'algorithm' },
  { keywords: ['how to understand astar', 'astar is confusing', 'explain astar simply'],
    response: `Think of A* like hiking: at every fork pick the path where f = steps already walked (g) + estimated distance to camp (h). Always pick lowest f. The estimate must be optimistic. That is A*!`,
    topic: 'concept' },
  { keywords: ['why learn ai', 'why study ai', 'ai important', 'is ai useful'],
    response: `AI search is the foundation of GPS (A*), game AI, robotics, and more! Understanding these makes machine learning and neural networks much easier. Keep going!`,
    topic: 'concept' }
];

/** Suggestion pools for assistant question chips (see suggestions.js). */
export const SUGGESTION_POOL = {
  home: [
    'What is PEAS?', 'What is BFS?', 'What is A*?', 'What is informed search?',
    'What is uninformed search?', 'What is local search?', 'What is a logical agent?',
    'What is a heuristic?', 'What is an AI agent?', 'What is DFS?', 'What is UCS?', 'What is Hill Climbing?'
  ],
  algo: {
    romania: ['What is Romania problem?', 'What is the goal in Romania?', 'What is SLD?', 'What is BFS?', 'What is A*?', 'What is UCS?', 'What is Greedy?', 'What is g(n)?', 'What is h(n)?', 'What is f(n)?'],
    puzzle8: ['What is 8-Puzzle?', 'What is the goal in 8-Puzzle?', 'What is Manhattan distance?', 'What is BFS?', 'What is A*?', 'What is Hill Climbing?', 'What is h(n)?'],
    nqueens: ['What is N-Queens?', 'What is a conflict?', 'What is DFS?', 'What is Hill Climbing?', 'What is backtracking?', 'What is local search?'],
    vacuum: ['What is Vacuum World?', 'What is the goal?', 'What are actuators?', 'What is BFS?', 'What is A*?'],
    wumpus: ['What is Wumpus World?', 'What is Stench?', 'What is Breeze?', 'What is Glitter?', 'What is a Pit?', 'What is the goal?', 'What is the Wumpus?'],
    maze: ['What is Maze Navigation?', 'What is Manhattan distance?', 'What is BFS?', 'What is A*?', 'What is the goal?'],
    tsp: ['What is TSP?', 'What is Greedy search?', 'What is Hill Climbing?', 'What is a local optimum?'],
    hanoi: ['What is Tower of Hanoi?', 'How many moves in Hanoi?', 'What is DFS?', 'What is the goal in Hanoi?'],
    robot_path: ['What is Robot Path Planning?', 'What is Manhattan distance?', 'What is A*?', 'What is the goal?'],
    sudoku: ['What is Sudoku?', 'What is backtracking?', 'What is DFS?', 'What is Hill Climbing?', 'What is a conflict?'],
    waterjug: ['What is Water Jug?', 'What is the goal?', 'What is BFS?', 'What is UCS?'],
    missionaries: ['What is Missionaries & Cannibals?', 'What is the goal?', 'What is BFS?', 'What is DFS?']
  },
  simulation: {
    romania: { BFS: ['What is BFS?', 'What is the goal in Romania?', 'Is BFS optimal?', 'What is g(n)?'], DFS: ['What is DFS?', 'Is DFS optimal?', 'What is backtracking?', 'What is the goal?'], UCS: ['What is UCS?', 'What is g(n)?', 'What is the optimal path?', 'Is UCS optimal?'], Greedy: ['What is Greedy?', 'What is SLD heuristic?', 'What is h(n)?', 'Is Greedy optimal?'], AStar: ['What is A*?', 'What is f(n)?', 'What is g(n)?', 'What is h(n)?'] },
    puzzle8: { BFS: ['What is BFS?', 'What is 8-Puzzle?', 'Is BFS optimal?'], DFS: ['What is DFS?', 'What is backtracking?', 'What is 8-Puzzle?'], UCS: ['What is UCS?', 'What is g(n)?'], Greedy: ['What is Manhattan distance?', 'What is h(n)?', 'Is Greedy optimal?'], AStar: ['What is A*?', 'What is Manhattan distance?', 'What is f(n)?'], HillClimbing: ['What is Hill Climbing?', 'What is a local optimum?', 'What is Manhattan distance?'] },
    nqueens: { DFS: ['What is N-Queens?', 'What is backtracking?', 'What is a conflict?'], HillClimbing: ['What is Hill Climbing?', 'What is a local optimum?', 'What is a conflict?'] },
    vacuum: { BFS: ['What is Vacuum World?', 'What is BFS?', 'What are actuators?'], DFS: ['What is DFS?', 'What is Vacuum World?'], UCS: ['What is UCS?', 'What is g(n)?'], Greedy: ['What is Greedy?', 'What is h(n)?'], AStar: ['What is A*?', 'What is f(n)?'] },
    wumpus: { BFS: ['What is Wumpus World?', 'What is Stench?', 'What is Breeze?', 'What is the goal?'], DFS: ['What is Wumpus World?', 'What is a Pit?', 'What is the Wumpus?'], UCS: ['What is UCS?', 'What is the goal?'], Greedy: ['What is Greedy?', 'What is h(n)?'], AStar: ['What is A*?', 'What is f(n)?'] },
    maze: { BFS: ['What is Maze Navigation?', 'What is BFS?', 'What is Manhattan distance?'], DFS: ['What is DFS?', 'What is Maze Navigation?'], UCS: ['What is UCS?', 'What is g(n)?'], Greedy: ['What is Greedy?', 'What is Manhattan distance?'], AStar: ['What is A*?', 'What is f(n)?', 'What is Manhattan distance?'] },
    tsp: { UCS: ['What is TSP?', 'What is g(n)?'], Greedy: ['What is TSP?', 'What is Greedy?'], AStar: ['What is A*?', 'What is f(n)?'], HillClimbing: ['What is Hill Climbing?', 'What is a local optimum?', 'What is TSP?'] },
    hanoi: { DFS: ['What is Tower of Hanoi?', 'How many moves in Hanoi?', 'What is DFS?'] },
    robot_path: { BFS: ['What is Robot Path Planning?', 'What is BFS?'], DFS: ['What is DFS?', 'What is Robot Path Planning?'], UCS: ['What is UCS?', 'What is g(n)?'], Greedy: ['What is Greedy?', 'What is Manhattan distance?'], AStar: ['What is A*?', 'What is f(n)?', 'What is Manhattan distance?'] },
    sudoku: { DFS: ['What is Sudoku?', 'What is backtracking?', 'What is DFS?'], HillClimbing: ['What is Hill Climbing?', 'What is a local optimum?', 'What is a conflict?'] },
    waterjug: { BFS: ['What is Water Jug?', 'What is BFS?'], UCS: ['What is UCS?', 'What is g(n)?'], AStar: ['What is A*?', 'What is f(n)?'] },
    missionaries: { BFS: ['What is Missionaries & Cannibals?', 'What is BFS?'], DFS: ['What is DFS?', 'What is the goal?'] }
  }
};
