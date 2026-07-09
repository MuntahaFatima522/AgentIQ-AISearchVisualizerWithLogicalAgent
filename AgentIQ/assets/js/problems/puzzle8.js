/* ============================================================
   problems_all.js — All 9 remaining problems
   Fixed: NQueensProblem and SudokuProblem now have heuristic()
   Fixed: MazeProblem accepts size param
   Fixed: NQueensProblem accepts N param
   ============================================================ */

/* ========== 8-PUZZLE ========== */
class Puzzle8Problem {
  constructor() {
    this.initial = [1,2,3,4,0,5,6,7,8];
    this.goal    = [1,2,3,4,5,6,7,8,0];
  }
  getInitialState()    { return [...this.initial]; }
  isGoal(s)            { return s.join(',') === this.goal.join(','); }
  stateToString(s)     { return s.join(','); }
  heuristic(s) {
    let d=0;
    s.forEach((v,i)=>{ if(v===0) return; const gi=this.goal.indexOf(v); d+=Math.abs(Math.floor(i/3)-Math.floor(gi/3))+Math.abs(i%3-gi%3); });
    return d;
  }
  evaluate(s) { return this.heuristic(s); }
  getSuccessors(s) {
    const succ=[]; const bi=s.indexOf(0);
    const moves=[];
    if(bi%3>0) moves.push(-1); if(bi%3<2) moves.push(1);
    if(bi>2)   moves.push(-3); if(bi<6)   moves.push(3);
    moves.forEach(m=>{ const ns=[...s]; [ns[bi],ns[bi+m]]=[ns[bi+m],ns[bi]]; succ.push({state:ns,action:`move ${s[bi+m]}`,cost:1}); });
    return succ;
  }
  renderState(state) { if(state) DOMRenderer.drawPuzzle8(state); }
}
