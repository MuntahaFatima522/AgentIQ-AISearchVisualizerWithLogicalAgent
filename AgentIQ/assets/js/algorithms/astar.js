/* ============================================================
   astar.js — A* Search Engine (ES6 Module)
   ============================================================ */

import { SimState } from '../sim_state.js';

export class AStarEngine {
  constructor(problem, stateContext = SimState) {
    this.problem = problem;
    this.state = stateContext;
    this.reset();
  }

  reset() {
    this.state.reset();
    
    const init = this.problem.getInitialState();
    const label = this.problem.stateToString(init);
    const rootH = this.problem.heuristic(init);

    this.state.renderData = {
      queue: [], // stores node objects: sorted by f(n)
      explored: [], // array of state strings
      phase: 'init',
      currentNode: null,
      successors: [],
      succIdx: 0,
      rootState: init,
      rootLabel: label,
      rootH: rootH
    };

    this.state.frontier = [label];
    this.state.currentNode = null;
  }

  step() {
    const rd = this.state.renderData;

    switch (rd.phase) {
      case 'init':
        rd.phase = 'insert_start';
        return { done: false, pcPhase: 'init' };

      case 'insert_start':
        // line 3: frontier.insert(node, priority=f(node))
        const root = {
          state: rd.rootState,
          parent: null,
          action: null,
          g: 0,
          h: rd.rootH,
          f: rd.rootH,
          depth: 0,
          label: rd.rootLabel
        };
        rd.queue.push(root);
        
        // Sort and populate frontier lists in SimState
        rd.queue.sort((a, b) => a.f - b.f);
        this.state.frontier = rd.queue.map(n => n.label);
        this.state.gValues[rd.rootLabel] = 0;
        this.state.hValues[rd.rootLabel] = rd.rootH;
        this.state.fValues[rd.rootLabel] = rd.rootH;
        
        this.state.currentH = rd.rootH;
        this.state.currentF = rd.rootH;

        rd.phase = 'loop_check';
        return { done: false, pcPhase: 'insert' };

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
        rd.phase = 'pop_min';
        return { done: false, pcPhase: 'empty' };

      case 'pop_min':
        // line 7: node <- frontier.pop_min()
        const node = rd.queue.shift(); // lowest f is first
        rd.currentNode = node;
        this.state.currentNode = node;
        this.state.frontier = rd.queue.map(n => n.label);
        
        // Reconstruct path so far
        this.state.path = this._reconstructPath(node);
        this.state.cost = node.g;
        this.state.currentH = node.h;
        this.state.currentF = node.f;

        rd.phase = 'goal_check';
        return { done: false, pcPhase: 'pop_min' };

      case 'goal_check':
        // line 8: if GOAL-TEST(node) -> return solution
        if (this.problem.isGoal(rd.currentNode.state)) {
          rd.phase = 'done';
          this.state.done = true;
          this.state.success = true;
          return { done: true, success: true, pcPhase: 'done', cost: rd.currentNode.g, path: this.state.path };
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
          g: 0, // temp
          h: 0, // temp
          f: 0, // temp
          cost: succ.cost, // step cost
          depth: rd.currentNode.depth + 1,
          label: childLabel
        };
        rd.activeChild = childNode;

        rd.phase = 'calc_g';
        return { done: false, pcPhase: 'child' };

      case 'calc_g':
        // line 12: child.g <- node.g + STEP-COST(action)
        rd.activeChild.g = rd.currentNode.g + rd.activeChild.cost;
        this.state.gValues[rd.activeChild.label] = rd.activeChild.g;

        rd.phase = 'calc_h';
        return { done: false, pcPhase: 'gcalc' };

      case 'calc_h':
        // line 13: child.h <- heuristic(child.state)
        const hVal = this.problem.heuristic(rd.activeChild.state);
        rd.activeChild.h = hVal;
        this.state.hValues[rd.activeChild.label] = hVal;

        rd.phase = 'calc_f';
        return { done: false, pcPhase: 'hcalc' };

      case 'calc_f':
        // line 14: child.f <- child.g + child.h
        const fVal = rd.activeChild.g + rd.activeChild.h;
        rd.activeChild.f = fVal;
        this.state.fValues[rd.activeChild.label] = fVal;

        rd.phase = 'update_frontier';
        return { done: false, pcPhase: 'fcalc' };

      case 'update_frontier':
        // line 15: if child not in explored and not in frontier
        const cLabel = rd.activeChild.label;
        const inExplored = rd.explored.includes(cLabel);
        const frontierIdx = rd.queue.findIndex(n => n.label === cLabel);

        if (!inExplored && frontierIdx === -1) {
          // line 16: frontier.insert(child, priority=child.f)
          rd.queue.push(rd.activeChild);
        } else if (frontierIdx !== -1) {
          // line 17: elif child in frontier with higher f
          if (rd.queue[frontierIdx].f > rd.activeChild.f) {
            // line 18: frontier.REPLACE(child)
            rd.queue[frontierIdx] = rd.activeChild;
          }
        }

        // Sort frontier priority queue by f(n) value
        rd.queue.sort((a, b) => a.f - b.f);
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