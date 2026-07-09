/* ============================================================
   controller.js — Master initSimulation Dispatcher
   THIS is the single initSimulation() used by simulation.html.
   romania.js must NOT define its own initSimulation().
   ============================================================ */

function initSimulation(problemId, algoId) {
  const meta = PROBLEMS_META[problemId];
  if (!meta) { console.error('Unknown problem:', problemId); return null; }

  if (meta.renderer === 'canvas') CanvasRenderer.init();
  else DOMRenderer.init();

  const problemMap = {
    romania:    () => new RomaniaProblem('Arad','Bucharest'),
    puzzle8:    () => new Puzzle8Problem(),
    nqueens:    () => { const n=parseInt(document.getElementById('nqueens-n-val')?.textContent||'8'); return new NQueensProblem(n); },
    vacuum:     () => new VacuumProblem(4,4),
    wumpus:     () => new WumpusProblem(),
    maze:       () => { const sz=parseInt(document.getElementById('maze-size-val')?.value||'15'); return new MazeProblem(sz,sz); },
    tsp:        () => new TSPProblem(),
    hanoi:      () => new HanoiProblem(4),
    robot_path: () => new RobotPathProblem(),
    sudoku:     () => new SudokuProblem()
  };

  const engineMap = {
    BFS:          p => new BFSEngine(p),
    DFS:          p => new DFSEngine(p),
    UCS:          p => new UCSEngine(p),
    Greedy:       p => new GreedyEngine(p),
    AStar:        p => new AStarEngine(p),
    HillClimbing: p => new HillClimbingEngine(p)
  };

  const pFactory = problemMap[problemId];
  const eFactory = engineMap[algoId];
  if (!pFactory) { console.error('No problem factory for:', problemId); return null; }
  if (!eFactory) { console.error('No engine for:', algoId); return null; }

  try {
    const problem = pFactory();
    const engine  = eFactory(problem);
    console.log(`✅ Simulation ready: ${problemId} + ${algoId}`);
    return engine;
  } catch(e) {
    console.error('initSimulation error:', e);
    return null;
  }
}