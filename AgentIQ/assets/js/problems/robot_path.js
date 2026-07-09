
/* ========== ROBOT PATH ========== */
class RobotPathProblem {
  constructor() {
    this.rows=12; this.cols=12; this.start=[0,0]; this.goal=[11,11];
    this.grid=this._generateGrid();
  }
  _generateGrid() {
    const g=Array.from({length:this.rows},()=>Array(this.cols).fill(0));
    [[2,2],[2,3],[2,4],[3,4],[4,4],[5,4],[5,5],[5,6],[7,7],[7,8],[8,8],[8,9],[9,9],[6,2],[6,3]].forEach(([r,c])=>{ if(g[r])g[r][c]=1; });
    g[0][0]=0; g[11][11]=0;
    return g;
  }
  getInitialState() { return [...this.start]; }
  isGoal(s)         { return s[0]===this.goal[0]&&s[1]===this.goal[1]; }
  stateToString(s)  { return `${s[0]},${s[1]}`; }
  heuristic(s)      { return Math.abs(s[0]-this.goal[0])+Math.abs(s[1]-this.goal[1]); }
  evaluate(s)       { return this.heuristic(s); }
  getSuccessors(s) {
    const succ=[]; const [r,c]=s;
    [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc])=>{
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<this.rows&&nc>=0&&nc<this.cols&&this.grid[nr][nc]===0) succ.push({state:[nr,nc],action:'move',cost:1});
    });
    return succ;
  }
  getInitialRenderData() { return {grid:this.grid,rows:this.rows,cols:this.cols}; }
  renderState(state,openList,closedList,current,pathNodes) {
    CanvasRenderer.drawGrid(this.grid,this.rows,this.cols,openList,closedList,current,pathNodes||[],{'0,0':'🤖','11,11':'🎯'});
  }
}
