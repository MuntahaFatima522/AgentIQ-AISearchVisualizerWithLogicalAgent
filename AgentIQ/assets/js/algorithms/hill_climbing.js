/* ============================================================
   hill_climbing.js — Hill Climbing Search Engine (ES6 Module)
   ============================================================ */

import { SimState } from '../sim_state.js';

export class HillClimbingEngine {
  constructor(problem, stateContext = SimState) {
    this.problem = problem;
    this.state = stateContext;
    this.reset();
  }

  reset() {
    this.state.reset();

    const init = this.problem.getInitialState();
    const label = this.problem.stateToString(init);
    const score = this.problem.evaluate(init);

    this.state.renderData = {
      current: init,
      currentLabel: label,
      currentScore: score,
      phase: 'init',
      successors: [],
      bestNeighbour: null,
      bestScore: score,
      stuck: false,
      restarts: 0,
      iterations: 0
    };

    this.state.currentNode = { state: init, label };
    this.state.cost = score;
    this.state.currentH = score;
    this.state.frontier = [];
  }

  step() {
    const rd = this.state.renderData;

    switch (rd.phase) {
      case 'init':
        // line 1: current <- MAKE-NODE(problem.INITIAL-STATE)
        rd.currentNode = { state: rd.current, label: rd.currentLabel };
        this.state.currentNode = rd.currentNode;
        this.state.path = [rd.currentLabel];

        rd.phase = 'loop_check';
        return { done: false, pcPhase: 'init' };

      case 'loop_check':
        // line 2: loop:
        rd.iterations++;
        if (this.problem.isGoal(rd.current)) {
          rd.phase = 'done';
          this.state.done = true;
          this.state.success = true;
          return { done: true, success: true, pcPhase: 'done', cost: rd.currentScore, path: this.state.path };
        }
        
        // Safety guard against infinite loops in flat plateaus
        if (rd.iterations > 1000) {
          rd.phase = 'fail';
          this.state.done = true;
          this.state.success = false;
          return { done: true, success: false, pcPhase: 'stuck', cost: rd.currentScore };
        }

        rd.phase = 'expand';
        return { done: false, pcPhase: 'loop' };

      case 'expand':
        // line 3: neighbours <- expand current node
        // Use Hill Climbing specific successor generation (such as 2-opt or min-conflicts)
        if (typeof this.problem.getHCSuccessors === 'function') {
          rd.successors = this.problem.getHCSuccessors(rd.current);
        } else {
          rd.successors = this.problem.getSuccessors(rd.current);
        }

        // populate frontier lists visually for user feedback
        this.state.frontier = rd.successors.slice(0, 10).map(s => this.problem.stateToString(s.state));

        rd.phase = 'best';
        return { done: false, pcPhase: 'expand' };

      case 'best':
        // line 4: best <- neighbor with lowest evaluation score
        let best = null;
        let bestVal = Infinity;

        rd.successors.forEach(succ => {
          const score = this.problem.evaluate(succ.state);
          if (score < bestVal) {
            bestVal = score;
            best = succ.state;
          }
        });

        rd.bestNeighbour = best;
        rd.bestScore = bestVal;

        rd.phase = 'check';
        return { done: false, pcPhase: 'best' };

      case 'check':
        // line 5: if score(best) >= score(current)
        rd.phase = 'move_or_stuck';
        return { done: false, pcPhase: 'check' };

      case 'move_or_stuck':
        if (!rd.bestNeighbour || rd.bestScore >= rd.currentScore) {
          // line 6: return current // stuck at local optimum
          rd.stuck = true;

          // Check if local optimum is actually the goal
          if (this.problem.isGoal(rd.current)) {
            rd.phase = 'done';
            this.state.done = true;
            this.state.success = true;
            return { done: true, success: true, pcPhase: 'done', cost: rd.currentScore, path: this.state.path };
          }

          // Random Restart Strategy if not goal
          if (rd.restarts < 20 && (this.problem.metadata.id === 'nqueens' || this.problem.metadata.id === 'sudoku' || this.problem.metadata.id === 'vacuum')) {
            rd.restarts++;
            const restartState = this.problem.getInitialState();
            const restartLabel = this.problem.stateToString(restartState);
            const restartScore = this.problem.evaluate(restartState);

            rd.current = restartState;
            rd.currentLabel = restartLabel;
            rd.currentScore = restartScore;
            rd.stuck = false;
            rd.currentNode = { state: restartState, label: restartLabel };
            this.state.currentNode = rd.currentNode;
            this.state.path = [restartLabel];
            this.state.cost = restartScore;
            this.state.currentH = restartScore;

            rd.phase = 'loop_check';
            return { done: false, pcPhase: 'stuck' };
          }

          rd.phase = 'fail';
          this.state.done = true;
          this.state.success = false;
          return { done: true, success: false, pcPhase: 'stuck', cost: rd.currentScore };
        } else {
          // line 7: current <- best // move to better neighbor
          const prevLabel = rd.currentLabel;
          if (!this.state.explored.has(prevLabel)) {
            this.state.explored.add(prevLabel);
            this.state.expandedCount++;
          }

          rd.current = rd.bestNeighbour;
          rd.currentLabel = this.problem.stateToString(rd.bestNeighbour);
          rd.currentScore = rd.bestScore;

          rd.currentNode = { state: rd.current, label: rd.currentLabel };
          this.state.currentNode = rd.currentNode;
          this.state.path.push(rd.currentLabel);
          this.state.cost = rd.currentScore;
          this.state.currentH = rd.currentScore;

          rd.phase = 'loop_check';
          return { done: false, pcPhase: 'move' };
        }

      case 'done':
        this.state.done = true;
        return { done: true, success: true, pcPhase: 'done', cost: this.state.cost, path: this.state.path };

      case 'fail':
        this.state.done = true;
        return { done: true, success: false, pcPhase: 'stuck', cost: this.state.cost };
    }

    return { done: true };
  }

  _reconstructPath(node) {
    return [node.label];
  }
}