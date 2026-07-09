
/* ========== MAZE ========== */
class MazeProblem {
  constructor(rows=15,cols=15) {
    this.rows=rows; this.cols=cols;
    this.start=[0,0]; this.goal=[rows-1,cols-1];
    this.grid=this._generateMaze();
  }
  _generateMaze() {
    const g=Array.from({length:this.rows},()=>Array(this.cols).fill(0));
    for(let r=0;r<this.rows;r++) for(let c=0;c<this.cols;c++) if(Math.random()<0.28) g[r][c]=1;
    g[0][0]=0; g[this.rows-1][this.cols-1]=0;
    // ensure path exists by carving a simple route
    for(let i=0;i<this.rows-1;i++) g[i][0]=0;
    for(let j=0;j<this.cols;j++) g[this.rows-1][j]=0;
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
      if(nr>=0&&nr<this.rows&&nc>=0&&nc<this.cols&&this.grid[nr][nc]===0)
        succ.push({state:[nr,nc],action:'move',cost:1});
    });
    return succ;
  }
  getInitialRenderData() { return {grid:this.grid,rows:this.rows,cols:this.cols}; }
  renderState(state,openList,closedList,current,pathNodes) {
    const specialCells={[`0,0`]:'🟢',[`${this.rows-1},${this.cols-1}`]:'🏁'};
    CanvasRenderer.drawGrid(this.grid,this.rows,this.cols,openList,closedList,current,pathNodes||[],specialCells);
  }
}
