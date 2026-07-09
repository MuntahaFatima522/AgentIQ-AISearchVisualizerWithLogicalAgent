
/* ========== TOWER OF HANOI ========== */
class HanoiProblem {
  constructor(n=4) { this.n=n; this.initialPegs=[Array.from({length:n},(_,i)=>n-i),[],[]]; }
  getInitialState() { return this.initialPegs.map(p=>[...p]); }
  isGoal(s)         { return s[2].length===this.n; }
  stateToString(s)  { return s.map(p=>p.join('-')).join('|'); }
  heuristic(s)      { return this.n-s[2].length; }
  evaluate(s)       { return this.n-s[2].length; }
  getSuccessors(s) {
    const succ=[];
    for(let from=0;from<3;from++) {
      if(!s[from].length) continue;
      const disk=s[from][s[from].length-1];
      for(let to=0;to<3;to++) {
        if(from===to) continue;
        if(s[to].length&&s[to][s[to].length-1]<disk) continue;
        const ns=s.map(p=>[...p]); ns[from].pop(); ns[to].push(disk);
        succ.push({state:ns,action:`${['A','B','C'][from]}→${['A','B','C'][to]}`,cost:1});
      }
    }
    return succ;
  }
  renderState(state) { if(state) DOMRenderer.drawHanoi(state,this.n); }
}
