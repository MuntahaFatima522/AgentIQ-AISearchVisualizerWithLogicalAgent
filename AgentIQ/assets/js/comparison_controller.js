/* ============================================================
   comparison_controller.js — Comparison Controller (ES6 Module)
   ============================================================ */

import { BFSEngine } from './algorithms/bfs.js';
import { DFSEngine } from './algorithms/dfs.js';
import { UCSEngine } from './algorithms/ucs.js';
import { GreedyEngine } from './algorithms/greedy.js';
import { AStarEngine } from './algorithms/astar.js';
import { HillClimbingEngine } from './algorithms/hill_climbing.js';

import {
  RomaniaProblem,
  Puzzle8Problem,
  NQueensProblem,
  VacuumProblem,
  WumpusProblem,
  TSPProblem,
  SudokuProblem,
  MazeProblem,
  RobotPathProblem,
  HanoiProblem,
  WaterJugProblem,
  MissionariesProblem
} from './problems/problems_all.js';

const PROBLEM_MAP = {
  romania: RomaniaProblem,
  puzzle8: Puzzle8Problem,
  nqueens: NQueensProblem,
  vacuum: VacuumProblem,
  wumpus: WumpusProblem,
  tsp: TSPProblem,
  sudoku: SudokuProblem,
  maze: MazeProblem,
  robot_path: RobotPathProblem,
  hanoi: HanoiProblem,
  waterjug: WaterJugProblem,
  missionaries: MissionariesProblem
};

const ENGINE_MAP = {
  BFS: BFSEngine,
  DFS: DFSEngine,
  UCS: UCSEngine,
  Greedy: GreedyEngine,
  AStar: AStarEngine,
  HillClimbing: HillClimbingEngine
};

function cloneValue(value) {
  if (value instanceof Set) return new Set([...value].map(item => cloneValue(item)));
  if (Array.isArray(value)) return value.map(item => cloneValue(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneValue(item)]));
  }
  return value;
}

// Isolated state factory for parallel runs
function createIsolatedState() {
  return {
    problem: null,
    algorithm: null,
    engine: null,
    step: 0,
    frontier: [],
    explored: new Set(),
    currentNode: null,
    path: [],
    cost: 0,
    expandedCount: 0,
    fValues: {},
    gValues: {},
    hValues: {},
    phase: null,
    done: false,
    success: false,
    history: [],
    renderData: {},

    reset() {
      this.step = 0;
      this.frontier = [];
      this.explored = new Set();
      this.currentNode = null;
      this.path = [];
      this.cost = 0;
      this.expandedCount = 0;
      this.fValues = {};
      this.gValues = {};
      this.hValues = {};
      this.phase = null;
      this.done = false;
      this.success = false;
      this.history = [];
      this.renderData = {};
    },

    snapshot() {
      this.history.push({
        step: this.step,
        frontier: cloneValue(this.frontier),
        explored: new Set(this.explored),
        currentNode: this.currentNode ? cloneValue(this.currentNode) : null,
        path: cloneValue(this.path),
        cost: this.cost,
        expandedCount: this.expandedCount,
        fValues: {...this.fValues},
        gValues: {...this.gValues},
        hValues: {...this.hValues},
        phase: this.phase,
        done: this.done,
        success: this.success,
        renderData: cloneValue(this.renderData)
      });
    },

    restoreSnapshot() {
      if (this.history.length === 0) return false;
      const s = this.history.pop();
      this.step = s.step;
      this.frontier = s.frontier;
      this.explored = s.explored;
      this.currentNode = s.currentNode;
      this.path = s.path;
      this.cost = s.cost;
      this.expandedCount = s.expandedCount;
      this.fValues = s.fValues;
      this.gValues = s.gValues;
      this.hValues = s.hValues;
      this.phase = s.phase;
      this.done = s.done;
      this.success = s.success;
      this.renderData = s.renderData;
      return true;
    }
  };
}

export const run1 = createIsolatedState();
export const run2 = createIsolatedState();

let playInterval = null;

export const ComparisonController = {
  initComparison(problemId, algo1, algo2, container1, container2) {
    this.pauseBoth();
    run1.reset();
    run2.reset();

    const ProbClass = PROBLEM_MAP[problemId];
    if (!ProbClass) {
      console.error(`Invalid problem selection: ${problemId}`);
      return;
    }

    // Instantiate two problems
    const p1 = new ProbClass();
    const p2 = new ProbClass();

    // 1. Ensure identical seeds/configurations
    if (problemId === 'maze') {
      p2.grid = p1.grid.map(row => [...row]);
    } else if (problemId === 'vacuum') {
      p2.dirtyInit = new Set(p1.dirtyInit);
    }

    const sharedInitState = p1.getInitialState();
    // Override getInitialState to return exact same config copy
    p1.getInitialState = () => cloneValue(sharedInitState);
    p2.getInitialState = () => cloneValue(sharedInitState);

    // Instantiate engines with isolated state context
    const EngineClass1 = ENGINE_MAP[algo1];
    const EngineClass2 = ENGINE_MAP[algo2];

    if (!EngineClass1 || !EngineClass2) {
      console.error(`Invalid algorithms: ${algo1} vs ${algo2}`);
      return;
    }

    const e1 = new EngineClass1(p1, run1);
    const e2 = new EngineClass2(p2, run2);

    run1.problem = p1;
    run1.algorithm = algo1;
    run1.engine = e1;

    run2.problem = p2;
    run2.algorithm = algo2;
    run2.engine = e2;

    // Render initial board visual states
    p1.render(sharedInitState, container1, run1);
    p2.render(sharedInitState, container2, run2);
  },

  stepBoth(container1, container2) {
    let changed = false;

    // Step Left side
    if (!run1.done) {
      run1.snapshot();
      const res = run1.engine.step();
      run1.step++;
      run1.done = res.done;
      run1.success = res.success || false;
      run1.phase = res.pcPhase || '';
      if (res.cost !== undefined) run1.cost = res.cost;
      if (res.path !== undefined) run1.path = res.path;

      const currVal = run1.currentNode ? run1.currentNode.state : run1.problem.getInitialState();
      run1.problem.render(currVal, container1, run1);
      changed = true;
    }

    // Step Right side
    if (!run2.done) {
      run2.snapshot();
      const res = run2.engine.step();
      run2.step++;
      run2.done = res.done;
      run2.success = res.success || false;
      run2.phase = res.pcPhase || '';
      if (res.cost !== undefined) run2.cost = res.cost;
      if (res.path !== undefined) run2.path = res.path;

      const currVal = run2.currentNode ? run2.currentNode.state : run2.problem.getInitialState();
      run2.problem.render(currVal, container2, run2);
      changed = true;
    }

    return changed;
  },

  stepBackwardBoth(container1, container2) {
    this.pauseBoth();
    const r1 = run1.restoreSnapshot();
    const r2 = run2.restoreSnapshot();

    if (r1) {
      const currVal = run1.currentNode ? run1.currentNode.state : run1.problem.getInitialState();
      run1.problem.render(currVal, container1, run1);
    }
    if (r2) {
      const currVal = run2.currentNode ? run2.currentNode.state : run2.problem.getInitialState();
      run2.problem.render(currVal, container2, run2);
    }
    return r1 || r2;
  },

  playBoth(speedMs, container1, container2, onStepCallback = null) {
    this.pauseBoth();
    playInterval = setInterval(() => {
      const active = this.stepBoth(container1, container2);
      if (onStepCallback) onStepCallback();
      if (!active || (run1.done && run2.done)) {
        this.pauseBoth();
      }
    }, speedMs);
  },

  pauseBoth() {
    if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
    }
  },

  resetBoth(container1, container2) {
    this.pauseBoth();
    if (run1.problem && run2.problem) {
      this.initComparison(
        run1.problem.metadata.id,
        run1.algorithm,
        run2.algorithm,
        container1,
        container2
      );
    }
  }
};
