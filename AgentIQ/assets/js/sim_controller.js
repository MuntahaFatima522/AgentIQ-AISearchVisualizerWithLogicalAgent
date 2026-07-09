/* ============================================================
   sim_controller.js — Main Simulation Controller (ES6 Module)
   ============================================================ */

import { SimState } from './sim_state.js';
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

let autoPlayInterval = null;

export const SimController = {
  initEngine(problemId, algoId, container = null) {
    this.pause();
    SimState.reset();

    const ProbClass = PROBLEM_MAP[problemId];
    const EngineClass = ENGINE_MAP[algoId];

    if (!ProbClass || !EngineClass) {
      console.error(`Invalid problem (${problemId}) or algorithm (${algoId}) selection.`);
      return null;
    }

    const problem = new ProbClass();
    const engine = new EngineClass(problem);

    SimState.problem = problem;
    SimState.algorithm = algoId;
    SimState.engine = engine;

    // Render initial state
    const initState = problem.getInitialState();
    problem.render(initState, container);

    return engine;
  },

  stepForward(container = null) {
    if (SimState.done) return { done: true };

    // Take snapshot of SimState before step
    SimState.snapshot();

    // Call engine step
    const res = SimState.engine.step();

    // Update state fields returned by the step execution
    SimState.step++;
    SimState.done = res.done;
    SimState.success = res.success || false;
    SimState.phase = res.pcPhase || '';
    if (res.cost !== undefined) SimState.cost = res.cost;
    if (res.path !== undefined) SimState.path = res.path;

    // Render updated state
    const currentVal = SimState.currentNode ? SimState.currentNode.state : SimState.problem.getInitialState();
    SimState.problem.render(currentVal, container);

    return res;
  },

  stepBackward(container = null) {
    this.pause();
    const restored = SimState.restoreSnapshot();
    if (restored) {
      // Re-render
      const currentVal = SimState.currentNode ? SimState.currentNode.state : SimState.problem.getInitialState();
      SimState.problem.render(currentVal, container);
    }
    return restored;
  },

  playAuto(speedMs, container = null, onStepCallback = null) {
    this.pause();
    autoPlayInterval = setInterval(() => {
      const res = this.stepForward(container);
      if (onStepCallback) onStepCallback(res);
      if (res.done) {
        this.pause();
      }
    }, speedMs);
  },

  pause() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  },

  reset(container = null) {
    this.pause();
    if (SimState.problem && SimState.algorithm) {
      return this.initEngine(SimState.problem.metadata.id, SimState.algorithm, container);
    }
    return null;
  }
};
