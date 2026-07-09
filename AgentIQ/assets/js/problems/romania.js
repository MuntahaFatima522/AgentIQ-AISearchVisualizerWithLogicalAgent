/* ============================================================
   romania.js — Romania Map Problem
   NOTE: No initSimulation() here — controller.js handles all.
   ============================================================ */

const ROMANIA_EDGES = [
  ['Arad','Zerind',75],['Arad','Timisoara',118],['Arad','Sibiu',140],
  ['Zerind','Oradea',71],['Oradea','Sibiu',151],
  ['Timisoara','Lugoj',111],['Lugoj','Mehadia',70],
  ['Mehadia','Drobeta',75],['Drobeta','Craiova',120],
  ['Sibiu','Fagaras',99],['Sibiu','Rimnicu',80],
  ['Rimnicu','Pitesti',97],['Rimnicu','Craiova',146],
  ['Fagaras','Bucharest',211],['Pitesti','Bucharest',101],
  ['Bucharest','Giurgiu',90],['Bucharest','Urziceni',85],
  ['Craiova','Pitesti',138],['Urziceni','Hirsova',98],
  ['Urziceni','Vaslui',142],['Hirsova','Eforie',86],
  ['Vaslui','Iasi',92],['Iasi','Neamt',87]
];

const ROMANIA_NODES = {
  Arad:      {x:0.10,y:0.20}, Zerind:    {x:0.12,y:0.10},
  Oradea:    {x:0.18,y:0.04}, Timisoara: {x:0.08,y:0.35},
  Lugoj:     {x:0.18,y:0.45}, Mehadia:   {x:0.20,y:0.55},
  Drobeta:   {x:0.16,y:0.65}, Craiova:   {x:0.32,y:0.74},
  Sibiu:     {x:0.33,y:0.28}, Rimnicu:   {x:0.38,y:0.46},
  Fagaras:   {x:0.50,y:0.25}, Pitesti:   {x:0.52,y:0.52},
  Bucharest: {x:0.66,y:0.60}, Giurgiu:   {x:0.62,y:0.74},
  Urziceni:  {x:0.78,y:0.55}, Hirsova:   {x:0.90,y:0.50},
  Eforie:    {x:0.96,y:0.60}, Vaslui:    {x:0.87,y:0.35},
  Iasi:      {x:0.80,y:0.20}, Neamt:     {x:0.70,y:0.12}
};

const SLD_TO_BUCHAREST = {
  Arad:366,Bucharest:0,Craiova:160,Drobeta:242,Eforie:161,
  Fagaras:176,Giurgiu:77,Hirsova:151,Iasi:226,Lugoj:244,
  Mehadia:241,Neamt:234,Oradea:380,Pitesti:100,Rimnicu:193,
  Sibiu:253,Timisoara:329,Urziceni:80,Vaslui:199,Zerind:374
};

function buildRomaniaGraph() {
  const g = {};
  ROMANIA_EDGES.forEach(([a,b,cost]) => {
    if(!g[a]) g[a]=[];
    if(!g[b]) g[b]=[];
    g[a].push({city:b,cost});
    g[b].push({city:a,cost});
  });
  return g;
}

class RomaniaProblem {
  constructor(start='Arad', goal='Bucharest') {
    this.start = start; this.goal = goal;
    this.graph = buildRomaniaGraph();
  }
  getInitialState()    { return this.start; }
  isGoal(state)        { return state === this.goal; }
  stateToString(state) { return state; }
  heuristic(state)     { return SLD_TO_BUCHAREST[state] ?? 999; }
  evaluate(state)      { return this.heuristic(state); }

  getSuccessors(state) {
    return (this.graph[state]||[]).map(({city,cost}) => ({state:city, action:`go ${city}`, cost}));
  }

  getInitialRenderData() {
    return { nodes:ROMANIA_NODES, edges:ROMANIA_EDGES };
  }

  renderState(state, openList, closedList, current, pathNodes) {
    CanvasRenderer.drawGraph(
      ROMANIA_NODES,
      ROMANIA_EDGES.map(([from,to,cost]) => ({from,to,cost})),
      openList, closedList, current, pathNodes,
      this.goal, this.start
    );
    // Update heuristic table
    if (typeof updateHeuristicTable === 'function') updateHeuristicTable(current);
  }
}