import { KB } from './knowledge_base.js';
import { SimState } from '../sim_state.js';

/** Minimum score for a static KB entry to be considered at all. */
export const KB_CONFIDENCE_LOW = 8;
/** Score at or above this is labelled "high" confidence (for UI hints). */
export const KB_CONFIDENCE_HIGH = 12;

const KB_TRUSTED_TOPICS = new Set([
  'greeting', 'gratitude', 'farewell', 'concept', 'search',
  'algorithm', 'heuristic', 'theory', 'comparison', 'complexity',
  'problem', 'dynamic', 'peas'
]);

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Normalize typed input so it matches KB keywords like suggestion chips do. */
export function normalizeQuery(query) {
  return String(query)
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/[?!.,;:]+$/g, '')
    .replace(/\s+/g, ' ');
}

/** Avoid false positives: "ai" in "explain", "by" in "nearby", etc. */
function keywordMatchesQuery(q, kw) {
  const k = kw.toLowerCase().trim();
  if (!k) return false;
  if (k.length <= 4 || k.includes(' ')) {
    if (k.includes(' ')) return q.includes(k);
    return new RegExp(`\\b${escapeRegex(k)}\\b`, 'i').test(q);
  }
  return q.includes(k);
}

function formatPeasResponse(peas, problemName) {
  return `<b>PEAS for ${problemName}:</b><br>
• <b>Performance:</b> ${peas.performance}<br>
• <b>Environment:</b> ${peas.environment}<br>
• <b>Actuators:</b> ${peas.actuators}<br>
• <b>Sensors:</b> ${peas.sensors}`;
}

function matchPeasQuery(query) {
  const q = normalizeQuery(query);
  const peas = SimState.problem?.metadata?.peas;
  const problemName = SimState.problem?.metadata?.name || 'this problem';

  if (!peas) return null;

  const wantsPeas =
    /\bpeas\b/.test(q) ||
    /what is the peas|peas for this|peas description|peas of this/.test(q);

  const wantsPerformance = /\bperformance measure\b/.test(q) || (/\bperformance\b/.test(q) && wantsPeas);
  const wantsEnvironment = /\benvironment\b/.test(q) && (wantsPeas || /for this problem|for \w+/.test(q));
  const wantsActuators = /\bactuators?\b/.test(q) && wantsPeas;
  const wantsSensors = /\bsensors?\b/.test(q) && wantsPeas;

  if (!wantsPeas && !wantsPerformance && !wantsEnvironment && !wantsActuators && !wantsSensors) {
    return null;
  }

  if (wantsPerformance && !wantsPeas && q.includes('performance')) {
    return { found: true, response: `<b>Performance</b> (${problemName}): ${peas.performance}`, topic: 'peas', confidence: 'high', score: 16 };
  }
  if (wantsEnvironment && !wantsPeas) {
    return { found: true, response: `<b>Environment</b> (${problemName}): ${peas.environment}`, topic: 'peas', confidence: 'high', score: 16 };
  }
  if (wantsActuators) {
    return { found: true, response: `<b>Actuators</b> (${problemName}): ${peas.actuators}`, topic: 'peas', confidence: 'high', score: 16 };
  }
  if (wantsSensors) {
    return { found: true, response: `<b>Sensors</b> (${problemName}): ${peas.sensors}`, topic: 'peas', confidence: 'high', score: 16 };
  }

  if (wantsPeas) {
    return {
      found: true,
      response: formatPeasResponse(peas, problemName),
      topic: 'peas',
      confidence: 'high',
      score: 18
    };
  }

  return null;
}

export function hasActiveSimulation(state = SimState) {
  return Boolean(state?.problem && state?.algorithm);
}

/** Questions about live run state — answer via dynamic KB or Gemini, not static definitions. */
export function isLiveSimulationQuestion(query) {
  const q = normalizeQuery(query);
  if (/\b(current node|which node|current city|where is (the )?agent|frontier now|open list now|closed list now|current path|path so far|goal reached|is (the )?goal reached|next node|why (was )?(it|this|that) (chosen|selected)|why selected|cost now|f\(n\) now|g\(n\) now|h\(n\) now|h\(n\) of current|heuristic value of current)\b/.test(q)) {
    return true;
  }
  if (/\b(now|current|right now|this step|running|so far)\b/.test(q) &&
      /\b(frontier|open list|closed list|node|path|step|goal|g\(|h\(|f\(|cost|expand)\b/.test(q)) {
    return true;
  }
  return /\bwhy was .+ chosen\b/.test(q);
}

function currentNodeMetrics(state = SimState) {
  const lbl = state.currentNode?.label;
  const g = lbl != null
    ? (state.gValues[lbl] ?? state.currentNode?.cost ?? state.cost ?? 0)
    : (state.cost ?? 0);
  let h = 0;
  if (state.currentNode?.state && state.problem?.heuristic) {
    h = state.problem.heuristic(state.currentNode.state);
  } else if (lbl != null && state.hValues[lbl] !== undefined) {
    h = state.hValues[lbl];
  }
  const f = lbl != null && state.fValues[lbl] !== undefined ? state.fValues[lbl] : g + h;
  return { lbl, g, h, f };
}

function matchDynamicQuery(query) {
  const q = query.trim();
  const norm = normalizeQuery(query);

  let match = q.match(/what is the start state of (.+?)\??/i);
  if (match) {
    const probId = match[1].trim().toLowerCase().replace(/\s+/g, '_');
    const startStates = {
      romania: 'The start state for Romania Map is <b>Arad</b>.',
      puzzle8: 'The start state for 8-Puzzle is the scrambled tile configuration shown on the board.',
      nqueens: 'The start state for N-Queens is the initial queen placement on the board.',
      vacuum: 'The start state for Vacuum World is the agent at (0,0) with the initial dirt layout.',
      tsp: 'The start state for TSP is the tour starting at the first city.',
      sudoku: 'The start state for Sudoku is the given puzzle grid with clue cells fixed.',
      maze: 'The start state for Maze Navigation is cell <b>(0,0)</b>.',
      robot_path: 'The start state for Robot Path Planning is the robot at <b>(0,0)</b>.',
      'robot path': 'The start state for Robot Path Planning is the robot at <b>(0,0)</b>.',
      hanoi: 'The start state for Tower of Hanoi has all disks on Peg A.',
      waterjug: 'The start state for Water Jug is both jugs empty: <b>(0, 0)</b>.',
      missionaries: 'The start state is all 3 missionaries, 3 cannibals, and the boat on the left bank.',
      wumpus: 'The start state for Wumpus World is the agent at (0,0) facing east.'
    };
    const desc = startStates[probId] || null;
    if (desc) {
      return { found: true, response: desc, topic: 'dynamic', confidence: 'high', score: 16 };
    }
  }

  if (!hasActiveSimulation()) return null;

  if (/\b(current node|which node|current city|where is (the )?agent|what node)\b/.test(norm)) {
    const label = SimState.currentNode?.label;
    const response = label
      ? `The <b>current node</b> being expanded is <b>${label}</b> (step ${SimState.step}).`
      : `No node is being expanded yet — press <b>Play</b> or <b>Step</b> to start the simulation.`;
    return { found: true, response, topic: 'dynamic', confidence: 'high', score: 22 };
  }

  if (/\b(frontier|open list)\b/.test(norm) && /\b(now|current|what|show|size|list)\b/.test(norm)) {
    const count = SimState.frontier.length;
    const sample = SimState.frontier.slice(0, 12).join(', ') || '(empty)';
    return {
      found: true,
      response: `<b>Frontier (open list):</b> ${count} node(s).<br>${count ? `Next to expand: <b>${sample}</b>${count > 12 ? ' …' : ''}` : 'The frontier is empty — search may be finished or stuck.'}`,
      topic: 'dynamic',
      confidence: 'high',
      score: 20
    };
  }

  if (/\b(closed list|explored)\b/.test(norm) && /\b(now|current|what|show|size)\b/.test(norm)) {
    const count = SimState.explored?.size ?? 0;
    return {
      found: true,
      response: `<b>Explored (closed list):</b> ${count} node(s) fully expanded so far.`,
      topic: 'dynamic',
      confidence: 'high',
      score: 18
    };
  }

  if (/\b(current path|path so far)\b/.test(norm)) {
    const pathStr = SimState.path?.length ? SimState.path.join(' ➔ ') : 'No path yet';
    return {
      found: true,
      response: `<b>Path so far:</b> ${pathStr}<br><b>Path cost g(n):</b> ${SimState.cost ?? 0}`,
      topic: 'dynamic',
      confidence: 'high',
      score: 20
    };
  }

  if (/\b(goal reached|is (the )?goal|reached (the )?goal)\b/.test(norm)) {
    const status = SimState.done
      ? (SimState.success ? 'Yes — <b>goal reached</b>!' : 'No — search ended without reaching the goal.')
      : 'Not yet — the simulation is still running.';
    return { found: true, response: status, topic: 'dynamic', confidence: 'high', score: 18 };
  }

  if (/\b(f\(n\) now|g\(n\) now|h\(n\) now|cost now|current f|current g|current h)\b/.test(norm) ||
      (/\b(f\(n\)|g\(n\)|h\(n\))\b/.test(norm) && /\b(current|now)\b/.test(norm))) {
    const { lbl, g, h, f } = currentNodeMetrics();
    if (!lbl) {
      return {
        found: true,
        response: 'Start the simulation first — then I can report g(n), h(n), and f(n) for the current node.',
        topic: 'dynamic',
        confidence: 'high',
        score: 16
      };
    }
    return {
      found: true,
      response: `At node <b>${lbl}</b>: <b>g(n)=${g}</b>, <b>h(n)=${h}</b>, <b>f(n)=${f}</b>.`,
      topic: 'dynamic',
      confidence: 'high',
      score: 22
    };
  }

  match = q.match(/why was (.+?) chosen\??/i);
  if (match) {
    return explainWhyNodeChosen(match[1].trim());
  }

  if (/\bwhy (was )?(it|this|that) (chosen|selected)\b/i.test(norm) || /\bwhy selected\b/.test(norm)) {
    const label = SimState.currentNode?.label;
    if (label) return explainWhyNodeChosen(label);
  }

  match = q.match(/what is the g\(n\) cost of (.+?)\??/i);
  if (match) {
    const nodeLabel = match[1].trim();
    const g = SimState.gValues[nodeLabel] ?? SimState.currentNode?.cost ?? SimState.cost ?? 0;
    let pathStr = '';
    if (SimState.path?.length) pathStr = ` (path: ${SimState.path.join(' ➔ ')})`;
    return {
      found: true,
      response: `For node <b>${nodeLabel}</b>, path cost <b>g(n) = ${g}</b>${pathStr}.`,
      topic: 'dynamic',
      confidence: 'high',
      score: 20
    };
  }

  match = q.match(/what happens in the "?(.+?)"? step\??/i);
  if (match) {
    const phase = match[1].trim().toLowerCase();
    const phaseDescriptions = {
      init: 'Initialize the search and check if the start state is already the goal.',
      enqueue: 'Add the start node to the frontier.',
      enqueue_start: 'Enqueue the starting node before the main loop.',
      loop: 'Repeat until the goal is found or the frontier is empty.',
      loop_check: 'Continue the main loop while nodes remain to expand.',
      empty: 'If the frontier is empty, search fails — no solution exists.',
      empty_check: 'Test whether the frontier is empty.',
      dequeue: 'Remove the next node from the frontier for expansion.',
      goal_check: 'Check whether the current node is a goal state.',
      expand: 'Generate all successor states from the current node.',
      loop_successors: 'Process each successor one at a time.',
      check_explored: 'Skip successors already explored or already in the frontier.',
      enqueue_successor: 'Add valid successors to the frontier.'
    };
    const desc = phaseDescriptions[phase] || `In the <b>${phase}</b> step, the algorithm follows the pseudocode for that phase.`;
    return withConfidence(18, { found: true, response: desc, topic: 'dynamic' });
  }

  return null;
}

function explainWhyNodeChosen(nodeLabel) {
  const algoId = SimState.algorithm || 'the selected algorithm';
  const g = SimState.gValues[nodeLabel] ?? SimState.currentNode?.cost ?? SimState.cost ?? 0;
  const h = SimState.currentNode?.state && SimState.currentNode.label === nodeLabel
    ? (SimState.problem?.heuristic?.(SimState.currentNode.state) ?? SimState.hValues[nodeLabel] ?? 0)
    : (SimState.hValues[nodeLabel] ?? 0);
  const f = SimState.fValues[nodeLabel] ?? g + h;

  let explanation = '';
  if (algoId === 'BFS') {
    explanation = `In <b>Breadth-First Search (BFS)</b>, nodes are expanded in strict FIFO order. <b>${nodeLabel}</b> was chosen because it was the oldest unexpanded node at the front of the queue.`;
  } else if (algoId === 'DFS') {
    explanation = `In <b>Depth-First Search (DFS)</b>, nodes are expanded in LIFO order. <b>${nodeLabel}</b> was chosen because it was the most recently generated node on the stack.`;
  } else if (algoId === 'UCS') {
    explanation = `In <b>Uniform Cost Search (UCS)</b>, the node with the lowest g(n) is expanded first. <b>${nodeLabel}</b> had g(n) = <b>${g}</b>.`;
  } else if (algoId === 'Greedy') {
    explanation = `In <b>Greedy Best-First Search</b>, the node with lowest h(n) is expanded first. <b>${nodeLabel}</b> had h(n) = <b>${h}</b>.`;
  } else if (algoId === 'AStar') {
    explanation = `In <b>A* Search</b>, the node with lowest f(n)=g(n)+h(n) is expanded. <b>${nodeLabel}</b> had f(n)=<b>${f}</b> (g=<b>${g}</b>, h=<b>${h}</b>).`;
  } else if (algoId === 'HillClimbing') {
    explanation = `In <b>Hill Climbing</b>, <b>${nodeLabel}</b> was selected as a neighbor that improves the evaluation function.`;
  } else {
    explanation = `<b>${nodeLabel}</b> was selected by <b>${algoId}</b> according to its frontier ordering rules.`;
  }

  return withConfidence(22, { found: true, response: explanation, topic: 'dynamic' });
}

function withConfidence(score, result) {
  const confidence = score >= KB_CONFIDENCE_HIGH ? 'high' : score >= KB_CONFIDENCE_LOW ? 'low' : 'none';
  const confidencePercent = Math.min(100, Math.round((score / KB_CONFIDENCE_HIGH) * 100));
  return { ...result, score, confidence, confidencePercent };
}

function resolveResponse(entry) {
  const pid = SimState.problem?.metadata?.id || null;
  if (typeof entry.response === 'function') {
    return entry.response(pid);
  }
  return entry.response;
}

/** When no simulation is running, nudge user to start one for live-state questions. */
function matchNoSimRedirect(query) {
  if (hasActiveSimulation()) return null;
  if (!isLiveSimulationQuestion(query)) return null;

  return withConfidence(16, {
    found: true,
    response: `<b>Start a simulation</b> (choose a problem and algorithm, then press Play or Step) to ask about the current node, frontier, path, and costs.<br>Or ask me about <b>algorithms, PEAS, and heuristics</b> anytime!`,
    topic: 'redirection'
  });
}

export function matchKB(query) {
  if (!query) return { found: false, confidence: 'none', score: 0 };

  const peasMatch = matchPeasQuery(query);
  if (peasMatch) return peasMatch;

  const dynamicMatch = matchDynamicQuery(query);
  if (dynamicMatch) return dynamicMatch;

  const noSimMatch = matchNoSimRedirect(query);
  if (noSimMatch) return noSimMatch;

  const q = normalizeQuery(query);
  let best = null;
  let bestScore = 0;

  for (const entry of KB) {
    if (entry.noSim || entry.topic === 'redirection') continue;

    let score = 0;
    let matchesKeyword = false;

    for (const kw of entry.keywords) {
      if (keywordMatchesQuery(q, kw)) {
        const wordCount = kw.split(' ').length;
        score += wordCount * 6 + kw.length;
        matchesKeyword = true;
      }
    }

    if (!matchesKeyword) continue;

    if (entry.topic && keywordMatchesQuery(q, entry.topic)) {
      score += 12;
    }

    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore >= KB_CONFIDENCE_LOW) {
    return withConfidence(bestScore, {
      found: true,
      response: resolveResponse(best),
      topic: best.topic
    });
  }

  return { found: false, confidence: 'none', score: 0 };
}

/**
 * Use curated KB when we have a trusted match. Live simulation questions that only
 * matched static KB defer to Gemini (with simulation context) unless topic is dynamic/peas.
 * 
 * KEY PRINCIPLE: If there's an active simulation AND the question is about that simulation,
 * Gemini with simulation context should answer (unless KB has a strong dynamic/peas match).
 */
export function shouldUseKnowledgeBase(kbResult, query = '', state = SimState) {
  if (!kbResult?.found) return false;
  
  // Always use KB for explicit redirections (e.g., "start a simulation")
  if (kbResult.topic === 'redirection') {
    return !hasActiveSimulation(state);
  }
  
  // PEAS and dynamic questions always use KB (high-confidence simulation answers)
  if (kbResult.topic === 'dynamic' || kbResult.topic === 'peas') {
    return true;
  }
  
  // For other topics, only use KB if it's a trusted topic AND meets confidence threshold
  if (!KB_TRUSTED_TOPICS.has(kbResult.topic)) return false;
  if (kbResult.score < KB_CONFIDENCE_LOW) return false;

  // If there's an active simulation AND this looks like a simulation question,
  // prefer Gemini with context over generic KB unless KB has very high confidence.
  // This allows Gemini to answer simulation-specific variations not in static KB.
  if (hasActiveSimulation(state) && isLiveSimulationQuestion(query)) {
    // For concept/theory topics, use KB only if very confident
    if (kbResult.topic === 'concept' || kbResult.topic === 'theory') {
      return kbResult.score >= KB_CONFIDENCE_HIGH;
    }
    // For other topics during simulation, let Gemini answer with simulation context
    return false;
  }
  
  return true;
}
