
/* ========== TSP ========== */
class TSPProblem {
  constructor() {
    this.cities={A:{x:0.15,y:0.20},B:{x:0.40,y:0.10},C:{x:0.70,y:0.15},D:{x:0.85,y:0.45},E:{x:0.65,y:0.75},F:{x:0.35,y:0.80},G:{x:0.10,y:0.60}};
    this.cityNames=Object.keys(this.cities);
  }
  _dist(a,b) { const ca=this.cities[a],cb=this.cities[b]; return Math.round(Math.sqrt((ca.x-cb.x)**2+(ca.y-cb.y)**2)*1000)/10; }
  getInitialState() { return {current:'A',visited:['A'],cost:0}; }
  isGoal(s)         { return s.visited.length===this.cityNames.length&&s.current==='A'; }
  stateToString(s)  { return `${s.current}|${s.visited.join(',')}`; }
  heuristic(s) {
    const unvisited=this.cityNames.filter(c=>!s.visited.includes(c));
    if(!unvisited.length) return this._dist(s.current,'A');
    return unvisited.reduce((sum,c)=>sum+this._dist(s.current,c)/unvisited.length,0);
  }
  evaluate(s) { return s.cost; }
  getSuccessors(s) {
    const succ=[]; const unvisited=this.cityNames.filter(c=>!s.visited.includes(c));
    if(!unvisited.length) { const d=this._dist(s.current,'A'); succ.push({state:{current:'A',visited:[...s.visited,'A'],cost:s.cost+d},action:'return A',cost:d}); }
    else unvisited.forEach(c=>{ const d=this._dist(s.current,c); succ.push({state:{current:c,visited:[...s.visited,c],cost:s.cost+d},action:`go ${c}`,cost:d}); });
    return succ;
  }
  getInitialRenderData() { return {cities:this.cities}; }
  renderState(state,openList,closedList,current) { CanvasRenderer.drawTSP(this.cities,state?state.visited:[],openList,closedList,state?state.current:null); }
}
