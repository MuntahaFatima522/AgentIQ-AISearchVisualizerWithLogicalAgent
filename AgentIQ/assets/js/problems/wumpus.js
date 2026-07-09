
/* ========== WUMPUS ========== */
class WumpusProblem {
  constructor() {
    this.wumpus=[2,2]; this.gold=[1,3]; this.pits=[[2,0],[3,2]];
    this.initial={pos:[0,0],hasGold:false,wumpusAlive:true,visited:new Set(['0,0'])};
  }
  getInitialState() { return {...this.initial,visited:new Set(this.initial.visited)}; }
  isGoal(s)         { return s.hasGold&&s.pos[0]===0&&s.pos[1]===0; }
  stateToString(s)  { return `${s.pos}|${s.hasGold}|${s.wumpusAlive}|${[...s.visited].sort().join(';')}`; }
  heuristic(s) {
    if(s.hasGold) return Math.abs(s.pos[0])+Math.abs(s.pos[1]);
    return Math.abs(s.pos[0]-this.gold[0])+Math.abs(s.pos[1]-this.gold[1]);
  }
  evaluate(s) { return this.heuristic(s); }
  _safe(pos) {
    if(this.pits.some(p=>p[0]===pos[0]&&p[1]===pos[1])) return false;
    if(this.wumpus[0]===pos[0]&&this.wumpus[1]===pos[1]) return false;
    return true;
  }
  getSuccessors(s) {
    const succ=[]; const [r,c]=s.pos;
    [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc])=>{
      const nr=r+dr,nc=c+dc;
      if(nr<0||nr>3||nc<0||nc>3||!this._safe([nr,nc])) return;
      const nv=new Set(s.visited); nv.add(`${nr},${nc}`);
      let ng=s.hasGold;
      if(!ng&&nr===this.gold[0]&&nc===this.gold[1]) ng=true;
      succ.push({state:{pos:[nr,nc],hasGold:ng,wumpusAlive:s.wumpusAlive,visited:nv},action:'move',cost:1});
    });
    return succ;
  }
  renderState(state) {
    if(!state) return;
    DOMRenderer.drawWumpus(null,state.pos,new Set(state.visited),null,state.hasGold,this.gold,this.wumpus,this.pits);
  }
}
