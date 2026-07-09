/* ============================================================
   state.js — Global Simulation State
   ============================================================ */
const SimState = {
  problemId:null, algoId:null,
  step:0, expanded:0, running:false, done:false, success:false,
  openList:[], closedList:[], current:null,
  path:[], cost:null,
  currentH:null, currentF:null,   // for A* display
  pcLine:0,                        // current pseudocode line index
  history:[],
  renderData:{},

  reset() {
    this.step=0; this.expanded=0; this.running=false; this.done=false; this.success=false;
    this.openList=[]; this.closedList=[]; this.current=null;
    this.path=[]; this.cost=null; this.currentH=null; this.currentF=null;
    this.pcLine=0; this.history=[]; this.renderData={};
  },

  snapshot() {
    this.history.push({
      step:this.step, expanded:this.expanded,
      openList:[...this.openList], closedList:[...this.closedList],
      current:this.current, path:[...this.path],
      cost:this.cost, currentH:this.currentH, currentF:this.currentF,
      pcLine:this.pcLine,
      renderData:JSON.parse(JSON.stringify(this.renderData))
    });
  },

  restoreSnapshot() {
    if (!this.history.length) return false;
    const s=this.history.pop();
    this.step=s.step; this.expanded=s.expanded;
    this.openList=s.openList; this.closedList=s.closedList;
    this.current=s.current; this.path=s.path;
    this.cost=s.cost; this.currentH=s.currentH; this.currentF=s.currentF;
    this.pcLine=s.pcLine; this.renderData=s.renderData;
    this.done=false; this.success=false;
    return true;
  },

  getUIState() {
    return {
      step:this.step, expanded:this.expanded,
      frontierSize:this.openList.length,
      cost:this.cost, currentH:this.currentH, currentF:this.currentF,
      current:this.current,
      openList:this.openList, closedList:this.closedList,
      path:this.path, pcLine:this.pcLine
    };
  }
};