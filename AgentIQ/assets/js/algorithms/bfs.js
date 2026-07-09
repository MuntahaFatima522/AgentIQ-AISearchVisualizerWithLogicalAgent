/* ============================================================
   bfs.js — Breadth-First Search Engine (ES6 Module)
   ============================================================ */

import { SimState } from '../sim_state.js';

export class BFSEngine {
  constructor(problem, stateContext = SimState) {
    this.problem = problem;
    this.state = stateContext;
    this.reset();
  }

  reset() {
    this.state.reset();
    
    const init = this.problem.getInitialState();
    const label = this.problem.stateToString(init);

    // Store search state in the stateContext.renderData to survive snapshoting / history-undos
    this.state.renderData = {
      queue: [], // stores node objects: { state, parent, action, cost, depth, label }
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

        // Check if root is goal (line 2)
        if (this.problem.isGoal(rd.rootState)) {
          rd.phase = 'done';
          this.state.done = true;
          this.state.success = true;
          this.state.path = [rd.rootLabel];
          this.state.cost = 0;
          return { done: true, success: true, pcPhase: 'done', cost: 0, path: this.state.path };
        }

        rd.phase = 'enqueue_start';
        return { done: false, pcPhase: 'init' };

      case 'enqueue_start':
        // line 4: frontier.enqueue(node)
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
        return { done: false, pcPhase: 'enqueue' };

      case 'loop_check':
        // line 6: loop:
        rd.phase = 'empty_check';
        return { done: false, pcPhase: 'loop' };

      case 'empty_check':
        // line 7: if frontier is empty -> return failure
        if (rd.queue.length === 0) {
          rd.phase = 'fail';
          this.state.done = true;
          this.state.success = false;
          return { done: true, success: false, pcPhase: 'fail' };
        }
        rd.phase = 'dequeue';
        return { done: false, pcPhase: 'empty' };

      case 'dequeue':
        // line 8: node <- frontier.dequeue()
        const node = rd.queue.shift();
        rd.currentNode = node;
        this.state.currentNode = node;
        this.state.frontier = rd.queue.map(n => n.label);
        
        // Reconstruct path so far
        this.state.path = this._reconstructPath(node);
        this.state.cost = node.cost;

        rd.phase = 'mark_explored';
        return { done: false, pcPhase: 'pop' };

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

        rd.phase = 'goal_check';
        return { done: false, pcPhase: 'child' };

      case 'goal_check':
        // line 12: if child not in explored and not in frontier
        const cLabel = rd.activeChild.label;
        const inExplored = rd.explored.includes(cLabel);
        const inFrontier = rd.queue.some(n => n.label === cLabel);

        if (!inExplored && !inFrontier) {
          // line 13: if GOAL-TEST(child)
          if (this.problem.isGoal(rd.activeChild.state)) {
            rd.phase = 'done';
            this.state.done = true;
            this.state.success = true;
            this.state.path = this._reconstructPath(rd.activeChild);
            this.state.cost = rd.activeChild.cost;
            return { done: true, success: true, pcPhase: 'done', cost: rd.activeChild.cost, path: this.state.path };
          }
          rd.phase = 'add_to_frontier';
        } else {
          // Skip child as it's already visited/in frontier
          rd.succIdx++;
          if (rd.succIdx < rd.successors.length) {
            rd.phase = 'process_child';
          } else {
            rd.phase = 'loop_check';
          }
        }
        return { done: false, pcPhase: 'child' };

      case 'add_to_frontier':
        // line 14: frontier.enqueue(child)
        rd.queue.push(rd.activeChild);
        this.state.frontier = rd.queue.map(n => n.label);

        // Next child
        rd.succIdx++;
        if (rd.succIdx < rd.successors.length) {
          rd.phase = 'process_child';
        } else {
          rd.phase = 'loop_check';
        }
        return { done: false, pcPhase: 'add' };

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