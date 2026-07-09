/* ============================================================
   dfs.js — Depth-First Search Engine (ES6 Module)
   ============================================================ */

import { SimState } from '../sim_state.js';

export class DFSEngine {
  constructor(problem, stateContext = SimState) {
    this.problem = problem;
    this.state = stateContext;
    this.reset();
  }

  reset() {
    this.state.reset();
    
    const init = this.problem.getInitialState();
    const label = this.problem.stateToString(init);
    this.depthLimit = this.problem.metadata?.id === 'puzzle8' ? 8 : 80;

    this.state.renderData = {
      queue: [], // stores node objects: LIFO stack
      explored: [], // array of state strings
      phase: 'init',
      currentNode: null,
      successors: [],
      succIdx: 0,
      rootState: init,
      rootLabel: label
    };

    this.state.frontier = [label];
    this.state.currentNode = null;
  }

  step() {
    const rd = this.state.renderData;

    switch (rd.phase) {
      case 'init':
        // Setup initial frontier and check root goal
        const rootNode = {
          state: rd.rootState,
          parent: null,
          action: null,
          cost: 0,
          depth: 0,
          label: rd.rootLabel
        };
        rd.currentNode = rootNode;
        this.state.currentNode = rootNode;

        rd.phase = 'push_start';
        return { done: false, pcPhase: 'init' };

      case 'push_start':
        // line 3: frontier.push(node)
        const root = {
          state: rd.rootState,
          parent: null,
          action: null,
          cost: 0,
          depth: 0,
          label: rd.rootLabel
        };
        rd.queue.push(root);
        this.state.frontier = rd.queue.map(n => n.label);
        
        rd.phase = 'loop_check';
        return { done: false, pcPhase: 'push' };

      case 'loop_check':
        // line 5: loop:
        rd.phase = 'empty_check';
        return { done: false, pcPhase: 'loop' };

      case 'empty_check':
        // line 6: if frontier is empty -> return failure
        if (rd.queue.length === 0) {
          rd.phase = 'fail';
          this.state.done = true;
          this.state.success = false;
          return { done: true, success: false, pcPhase: 'fail' };
        }
        rd.phase = 'pop';
        return { done: false, pcPhase: 'empty' };

      case 'pop':
        // line 7: node <- frontier.pop()
        const node = rd.queue.pop();
        rd.currentNode = node;
        this.state.currentNode = node;
        this.state.frontier = rd.queue.map(n => n.label);
        
        // Reconstruct path so far
        this.state.path = this._reconstructPath(node);
        this.state.cost = node.cost;

        rd.phase = 'goal_check';
        return { done: false, pcPhase: 'pop' };

      case 'goal_check':
        // line 8: if GOAL-TEST(node) -> return solution
        if (this.problem.isGoal(rd.currentNode.state)) {
          rd.phase = 'done';
          this.state.done = true;
          this.state.success = true;
          return { done: true, success: true, pcPhase: 'done', cost: rd.currentNode.cost, path: this.state.path };
        }
        rd.phase = 'mark_explored';
        return { done: false, pcPhase: 'goal' };

      case 'mark_explored':
        // line 9: explored.add(node.state)
        const stateStr = this.problem.stateToString(rd.currentNode.state);
        
        // Add to explored if not already present
        if (!rd.explored.includes(stateStr)) {
          rd.explored.push(stateStr);
          this.state.explored.add(stateStr);
          this.state.expandedCount++;
        }

        rd.phase = 'expand';
        return { done: false, pcPhase: 'explore' };

      case 'expand':
        // line 10: for each action in actions
        rd.successors = this.problem.getSuccessors(rd.currentNode.state);
        rd.succIdx = 0;
        
        if (rd.successors.length > 0) {
          rd.phase = 'process_child';
        } else {
          rd.phase = 'loop_check';
        }
        return { done: false, pcPhase: 'expand' };

      case 'process_child':
        // line 11: child <- CHILD-NODE
        const succ = rd.successors[rd.succIdx];
        const childLabel = this.problem.stateToString(succ.state);
        const childNode = {
          state: succ.state,
          parent: rd.currentNode,
          action: succ.action,
          cost: rd.currentNode.cost + succ.cost,
          depth: rd.currentNode.depth + 1,
          label: childLabel
        };
        rd.activeChild = childNode;

        rd.phase = 'push_child';
        return { done: false, pcPhase: 'child' };

      case 'push_child':
        // line 12: if child not in explored and not in frontier
        const cLabel = rd.activeChild.label;
        const inExplored = rd.explored.includes(cLabel);
        const inFrontier = rd.queue.some(n => n.label === cLabel);

        if (rd.activeChild.depth > this.depthLimit) {
          // Keep DFS responsive for finite-state visual demos that can otherwise dive very deep.
        } else if (!inExplored && !inFrontier) {
          if (this.problem.isGoal(rd.activeChild.state)) {
            rd.phase = 'done';
            this.state.currentNode = rd.activeChild;
            this.state.path = this._reconstructPath(rd.activeChild);
            this.state.cost = rd.activeChild.cost;
            this.state.done = true;
            this.state.success = true;
            return { done: true, success: true, pcPhase: 'done', cost: rd.activeChild.cost, path: this.state.path };
          }

          // line 13: frontier.push(child)
          rd.queue.push(rd.activeChild);
          this.state.frontier = rd.queue.map(n => n.label);
        }

        // Next child
        rd.succIdx++;
        if (rd.succIdx < rd.successors.length) {
          rd.phase = 'process_child';
        } else {
          rd.phase = 'loop_check';
        }
        return { done: false, pcPhase: 'push' };

      case 'done':
        this.state.done = true;
        return { done: true, success: true, pcPhase: 'done', cost: this.state.cost, path: this.state.path };

      case 'fail':
        this.state.done = true;
        return { done: true, success: false, pcPhase: 'fail' };
    }

    return { done: true };
  }

  _reconstructPath(node) {
    const path = [];
    let cur = node;
    while (cur) {
      path.unshift(cur.label);
      cur = cur.parent;
    }
    return path;
  }
}
