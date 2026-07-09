
/* ========== N-QUEENS ========== */
class NQueensProblem {
  constructor(n=8) { this.n=n; }
  getInitialState() { return Array.from({length:this.n},()=>Math.floor(Math.random()*this.n)); }
  isGoal(s)         { return this._conflicts(s)===0; }
  stateToString(s)  { return s.join(','); }
  // heuristic = conflict count (admissible: 0 at goal)
  heuristic(s)      { return this._conflicts(s); }
  evaluate(s)       { return this._conflicts(s); }
  _conflicts(s) {
    let c=0;
    for(let i=0;i<this.n;i++)
      for(let j=i+1;j<this.n;j++)
        if(s[i]===s[j]||Math.abs(s[i]-s[j])===Math.abs(i-j)) c++;
    return c;
  }
  _conflictCols(s) {
    const bad=[];
    for(let i=0;i<this.n;i++) for(let j=i+1;j<this.n;j++)
      if(s[i]===s[j]||Math.abs(s[i]-s[j])===Math.abs(i-j)){ if(!bad.includes(i))bad.push(i); if(!bad.includes(j))bad.push(j); }
    return bad;
  }
  getSuccessors(s) {
    const succ=[];
    for(let c=0;c<this.n;c++) for(let r=0;r<this.n;r++) {
      if(r===s[c]) continue;
      const ns=[...s]; ns[c]=r;
      succ.push({state:ns,action:`col${c}→row${r}`,cost:1});
    }
    return succ;
  }
  renderState(state) { if(state) DOMRenderer.drawNQueens(state,this.n,this._conflictCols(state)); }
}
