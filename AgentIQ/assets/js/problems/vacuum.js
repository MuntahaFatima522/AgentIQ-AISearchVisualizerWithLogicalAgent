
/* ========== VACUUM ========== */
class VacuumProblem {
  constructor(rows=4,cols=4) {
    this.rows=rows; this.cols=cols;
    this.dirtyInit=new Set();
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) if(Math.random()>0.5) this.dirtyInit.add(`${r},${c}`);
    this.dirtyInit.add('0,0');
  }
  getInitialState() { return {pos:[0,0],dirty:new Set(this.dirtyInit)}; }
  isGoal(s)         { return s.dirty.size===0; }
  stateToString(s)  { return `${s.pos[0]},${s.pos[1]}|${[...s.dirty].sort().join(';')}`; }
  heuristic(s)      { return s.dirty.size; }
  evaluate(s)       { return s.dirty.size; }
  getSuccessors(s) {
    const succ=[]; const [r,c]=s.pos; const key=`${r},${c}`;
    if(s.dirty.has(key)){ const nd=new Set(s.dirty); nd.delete(key); succ.push({state:{pos:[r,c],dirty:nd},action:'Suck',cost:1}); }
    [[-1,0,'Up'],[1,0,'Down'],[0,-1,'Left'],[0,1,'Right']].forEach(([dr,dc,nm])=>{
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<this.rows&&nc>=0&&nc<this.cols) succ.push({state:{pos:[nr,nc],dirty:new Set(s.dirty)},action:nm,cost:1});
    });
    return succ;
  }
  renderState(state) {
    if(!state) return;
    const grid=Array.from({length:this.rows},()=>Array(this.cols).fill(0));
    DOMRenderer.drawVacuum(grid,this.rows,this.cols,state.pos,state.dirty);
  }
}
