/* ============================================================
   pseudocodes.js — Pseudocode with line mapping for highlighting
   Each algorithm has: title, lines[] array, and stepToLine()
   stepToLine(stepPhase) returns 0-based line index to highlight
   stepPhase: 'init','pop','goal','expand','add','done','stuck'
   ============================================================ */

const PSEUDOCODES = {

  BFS: {
    title: "Breadth-First Search (BFS)",
    lines: [
      "function BFS(problem):",
      "  node ← INITIAL-STATE(problem)",
      "  if GOAL-TEST(node) → return SOLUTION",
      "  frontier ← Queue()   // FIFO queue",
      "  frontier.enqueue(node)",
      "  explored ← empty set",
      "  loop:",
      "    if frontier is EMPTY → return FAILURE",
      "    node ← frontier.dequeue()   // shallowest node",
      "    explored.add(node.state)",
      "    for each ACTION in ACTIONS(node.state):",
      "      child ← CHILD-NODE(problem, node, action)",
      "      if child.state NOT IN explored AND NOT IN frontier:",
      "        if GOAL-TEST(child) → return SOLUTION(child)",
      "        frontier.enqueue(child)",
      "  return FAILURE"
    ],
    stepToLine: (phase) => ({
      init:   1,
      check:  2,
      enqueue:4,
      loop:   6,
      empty:  7,
      pop:    8,
      explore:9,
      expand: 10,
      child:  11,
      goal:   13,
      add:    14,
      done:   13,
      fail:   15
    }[phase] ?? 8)
  },

  DFS: {
    title: "Depth-First Search (DFS)",
    lines: [
      "function DFS(problem):",
      "  node ← INITIAL-STATE(problem)",
      "  frontier ← Stack()   // LIFO stack",
      "  frontier.push(node)",
      "  explored ← empty set",
      "  loop:",
      "    if frontier is EMPTY → return FAILURE",
      "    node ← frontier.pop()   // deepest node",
      "    if GOAL-TEST(node) → return SOLUTION(node)",
      "    explored.add(node.state)",
      "    for each ACTION in ACTIONS(node.state):",
      "      child ← CHILD-NODE(problem, node, action)",
      "      if child.state NOT IN explored AND NOT IN frontier:",
      "        frontier.push(child)",
      "  return FAILURE"
    ],
    stepToLine: (phase) => ({
      init:   1,
      loop:   5,
      empty:  6,
      pop:    7,
      goal:   8,
      explore:9,
      expand: 10,
      child:  11,
      add:    13,
      done:   8,
      fail:   14
    }[phase] ?? 7)
  },

  UCS: {
    title: "Uniform Cost Search (UCS)",
    lines: [
      "function UCS(problem):",
      "  node ← INITIAL-STATE, path_cost = 0",
      "  frontier ← PriorityQueue()   // ordered by g(n)",
      "  frontier.insert(node, priority=0)",
      "  explored ← empty set",
      "  loop:",
      "    if frontier is EMPTY → return FAILURE",
      "    node ← frontier.pop_min()   // lowest g(n)",
      "    if GOAL-TEST(node) → return SOLUTION(node)",
      "    explored.add(node.state)",
      "    for each ACTION in ACTIONS(node.state):",
      "      child ← CHILD-NODE(problem, node, action)",
      "      child.cost ← node.cost + STEP-COST(action)",
      "      if child NOT IN explored AND NOT IN frontier:",
      "        frontier.insert(child, priority=child.cost)",
      "      elif child IN frontier WITH higher cost:",
      "        frontier.REPLACE(child)   // update cost",
      "  return FAILURE"
    ],
    stepToLine: (phase) => ({
      init:    1,
      loop:    5,
      empty:   6,
      pop:     7,
      goal:    8,
      explore: 9,
      expand:  10,
      child:   11,
      cost:    12,
      add:     13,
      replace: 15,
      done:    8,
      fail:    17
    }[phase] ?? 7)
  },

  Greedy: {
    title: "Greedy Best-First Search",
    lines: [
      "function GREEDY(problem, heuristic):",
      "  node ← INITIAL-STATE",
      "  frontier ← PriorityQueue()   // ordered by h(n)",
      "  frontier.insert(node, priority=h(node))",
      "  explored ← empty set",
      "  loop:",
      "    if frontier is EMPTY → return FAILURE",
      "    node ← frontier.pop_min()   // lowest h(n)",
      "    if GOAL-TEST(node) → return SOLUTION(node)",
      "    explored.add(node.state)",
      "    for each ACTION in ACTIONS(node.state):",
      "      child ← CHILD-NODE(problem, node, action)",
      "      if child NOT IN explored:",
      "        h ← heuristic(child.state)",
      "        frontier.insert(child, priority=h)",
      "  return FAILURE"
    ],
    stepToLine: (phase) => ({
      init:    1,
      loop:    5,
      empty:   6,
      pop:     7,
      goal:    8,
      explore: 9,
      expand:  10,
      child:   11,
      hcalc:   13,
      add:     14,
      done:    8,
      fail:    15
    }[phase] ?? 7)
  },

  AStar: {
    title: "A* Search",
    lines: [
      "function ASTAR(problem, heuristic):",
      "  node ← INITIAL-STATE, g=0, h=h(start)",
      "  frontier ← PriorityQueue()   // ordered by f(n)=g+h",
      "  frontier.insert(node, priority=f(node))",
      "  explored ← empty set",
      "  loop:",
      "    if frontier is EMPTY → return FAILURE",
      "    node ← frontier.pop_min()   // lowest f(n)",
      "    if GOAL-TEST(node) → return SOLUTION(node)",
      "    explored.add(node.state)",
      "    for each ACTION in ACTIONS(node.state):",
      "      child ← CHILD-NODE(problem, node, action)",
      "      child.g ← node.g + STEP-COST(action)",
      "      child.h ← heuristic(child.state)",
      "      child.f ← child.g + child.h",
      "      if child NOT IN explored AND NOT IN frontier:",
      "        frontier.insert(child, priority=child.f)",
      "      elif child IN frontier WITH higher f:",
      "        frontier.REPLACE(child)",
      "  return FAILURE"
    ],
    stepToLine: (phase) => ({
      init:    1,
      loop:    5,
      empty:   6,
      pop:     7,
      goal:    8,
      explore: 9,
      expand:  10,
      child:   11,
      gcalc:   12,
      hcalc:   13,
      fcalc:   14,
      add:     15,
      replace: 17,
      done:    8,
      fail:    19
    }[phase] ?? 7)
  },

  HillClimbing: {
    title: "Hill Climbing (Steepest Ascent)",
    lines: [
      "function HILL-CLIMBING(problem):",
      "  current ← MAKE-NODE(problem.INITIAL-STATE)",
      "  loop:",
      "    neighbours ← expand current node",
      "    best ← neighbour with lowest evaluation score",
      "    if score(best) ≥ score(current):",
      "      return current   // LOCAL OPTIMUM — no improvement",
      "    current ← best   // move to better neighbour",
      "  // Repeats until stuck or goal reached",
      "  // No backtracking — O(1) memory"
    ],
    stepToLine: (phase) => ({
      init:    1,
      loop:    2,
      expand:  3,
      best:    4,
      check:   5,
      stuck:   6,
      move:    7,
      done:    7,
      goal:    7
    }[phase] ?? 3)
  }
};

function getPseudocode(algoKey) {
  return PSEUDOCODES[algoKey] || {
    title: algoKey,
    lines: ["// Pseudocode not available for this algorithm."],
    stepToLine: () => 0
  };
}

export { PSEUDOCODES, getPseudocode };