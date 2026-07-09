/* ============================================================
   sim_state.js — Global Shared Simulation State
   ============================================================ */

export const SimState = {
  problem: null,         // problem instance
  algorithm: null,       // algorithm id
  engine: null,          // running engine instance
  step: 0,
  frontier: [],          // open list / queue (array of node states or objects)
  explored: new Set(),   // closed set of state strings
  currentNode: null,     // current node being expanded
  path: [],              // current path from start to current node
  cost: 0,               // path cost g(n) so far
  expandedCount: 0,      // total nodes expanded
  fValues: {},           // node mapping to f(n)
  gValues: {},           // node mapping to g(n)
  hValues: {},           // node mapping to h(n)
  phase: null,           // current pseudocode phase (string)
  done: false,
  success: false,
  history: [],           // for undo (stack of state snapshots)
  renderData: {},        // helper for problem-specific details

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
    // Take a deep clone copy of the mutable properties
    this.history.push({
      step: this.step,
      frontier: [...this.frontier],
      explored: new Set(this.explored),
      currentNode: this.currentNode ? {...this.currentNode} : null,
      path: [...this.path],
      cost: this.cost,
      expandedCount: this.expandedCount,
      fValues: {...this.fValues},
      gValues: {...this.gValues},
      hValues: {...this.hValues},
      phase: this.phase,
      done: this.done,
      success: this.success,
      renderData: JSON.parse(JSON.stringify(this.renderData))
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
