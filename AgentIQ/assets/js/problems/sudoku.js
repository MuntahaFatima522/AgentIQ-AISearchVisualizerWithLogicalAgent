
/* ========== SUDOKU ========== */
class SudokuProblem {
  constructor() {
    this.puzzle=[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]];
    this.fixed=this.puzzle.map(r=>r.map(v=>v!==0));
  }
  getInitialState() { return this.puzzle.map(r=>[...r]); }
  isGoal(s)         { return s.every(r=>r.every(v=>v!==0))&&this._conflicts(s).length===0; }
  stateToString(s)  { return s.map(r=>r.join('')).join('|'); }
  // heuristic = number of constraint violations (0 at goal)
  heuristic(s)      { return this._conflicts(s).length; }
  evaluate(s)       { return this._conflicts(s).length; }
  _conflicts(s) {
    const bad=[];
    for(let r=0;r<9;r++){ const seen={}; s[r].forEach((v,c)=>{ if(v&&seen[v]) bad.push([r,c]); else seen[v]=true; }); }
    for(let c=0;c<9;c++){ const seen={}; s.forEach((row,ri)=>{ const v=row[c]; if(v&&seen[v]) bad.push([ri,c]); else seen[v]=true; }); }
    return bad;
  }
  _validDigits(s,r,c) {
    const used=new Set();
    s[r].forEach(v=>v&&used.add(v));
    s.forEach(row=>row[c]&&used.add(row[c]));
    const br=Math.floor(r/3)*3,bc=Math.floor(c/3)*3;
    for(let dr=0;dr<3;dr++) for(let dc=0;dc<3;dc++){ const v=s[br+dr][bc+dc]; if(v) used.add(v); }
    return [1,2,3,4,5,6,7,8,9].filter(d=>!used.has(d));
  }
  _nextEmpty(s) { for(let r=0;r<9;r++) for(let c=0;c<9;c++) if(s[r][c]===0) return [r,c]; return null; }
  getSuccessors(s) {
    const empty=this._nextEmpty(s); if(!empty) return [];
    const [r,c]=empty;
    return this._validDigits(s,r,c).map(d=>{ const ns=s.map(row=>[...row]); ns[r][c]=d; return {state:ns,action:`place ${d} at (${r},${c})`,cost:1}; });
  }
  renderState(state) { if(state) DOMRenderer.drawSudoku(state,this.fixed,this._conflicts(state)); }
}