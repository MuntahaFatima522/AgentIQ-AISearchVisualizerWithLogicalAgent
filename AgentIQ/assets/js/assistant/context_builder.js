/* ============================================================
   context_builder.js — Simulation Prompt Context Builder (ES6 Module)
   ============================================================ */

import { SimState } from '../sim_state.js';

export function buildContextPrompt(customState = null, userQuestion = '') {
  const state = customState || SimState;
  const wantsDetailedAnswer = /\b(detail|detailed|explain|how|why|working|worked|step by step|complete)\b/i
    .test(userQuestion);

  if (!state.problem || !state.algorithm) {
    return `No simulation is running. Answer using general AI search knowledge only.
If the user asks about the current node, frontier, path, or live step costs, tell them to start a simulation (pick problem + algorithm, then Play/Step).`;
  }

  const problemName = state.problem.metadata.name;
  const problemDesc = state.problem.metadata.description;
  const algoId = state.algorithm;
  
  const currentLabel = state.currentNode ? state.currentNode.label : 'None (Simulation not started)';
  const frontierCount = state.frontier.length;
  const frontierSample = state.frontier.slice(0, 10).join(', ');
  const exploredCount = state.explored.size;
  const pathSample = state.path && state.path.length ? state.path.join(' ➔ ') : 'No path established yet';
  const lastPhase = state.phase || 'None';

  // Retrieve current metrics
  let gVal = 'N/A';
  let hVal = 'N/A';
  let fVal = 'N/A';

  if (state.currentNode) {
    const lbl = state.currentNode.label;
    if (state.gValues[lbl] !== undefined) gVal = state.gValues[lbl];
    if (state.hValues[lbl] !== undefined) hVal = state.hValues[lbl];
    if (state.fValues[lbl] !== undefined) fVal = state.fValues[lbl];
  }

  // Detect if this is a simulation-specific question
  const isSimulationQuestion = /\b(why|how|explain|current|frontier|path|node|next|step|cost|g\(n\)|h\(n\)|f\(n\)|chosen|selected)\b/i
    .test(userQuestion);

  const contextInstructions = isSimulationQuestion
    ? `INSTRUCTIONS FOR ANSWERING SIMULATION QUESTIONS:
1. Reference the actual live simulation state data provided below to answer questions about the current node, frontier, path, and costs.
2. Explain WHY the algorithm made specific choices using the actual numbers and metrics from the state (g(n), h(n), f(n), costs).
3. If the user asks "what's next?" or "what happens now?", explain the next logical phase in the algorithm (e.g., dequeuing from frontier, checking goal, expanding neighbors).
4. Use the current frontier, explored set, and path to give concrete, evidence-based answers.
5. Do NOT say you cannot see the simulation — you have all the data you need below.`
    : `GENERAL INSTRUCTIONS:
1. Answer questions about algorithms, search theory, PEAS models, and heuristics.
2. Use the simulation context to provide relevant examples when appropriate.`;

  return `You are AgentIQ, an expert AI tutor explaining AI search algorithms and this live simulation.
${contextInstructions}

CURRENT SIMULATION STATE:
━━━━━━━━━━━━━━━━━━━━━━━━
Problem:         ${problemName} (${problemDesc})
Algorithm:       ${algoId}
Status:          Step ${state.step} | ${state.done ? (state.success ? '✅ GOAL REACHED' : '❌ FAILED/STUCK') : '⏳ RUNNING'}
Current Node:    ${currentLabel}
Frontier Size:   ${frontierCount}
Frontier Sample: [${frontierSample}${frontierCount > 10 ? ' ...' : ''}]
Explored Count:  ${exploredCount}
Path So Far:     ${pathSample}
Path Cost g(n):  ${state.cost}
Current h(n):    ${hVal}
Current f(n):    ${fVal}
Last Phase:      ${lastPhase}
━━━━━━━━━━━━━━━━━━━━━━━━

OUTPUT FORMAT:
${wantsDetailedAnswer
    ? '- Provide a complete answer in 3-6 short paragraphs or bullets when detail is requested.'
    : '- Keep answers concise, around 120 words unless more detail is clearly needed.'}
- Use HTML tags like <b>...</b> for key terms instead of Markdown.
- Be educational, encouraging, and always reference the actual simulation data when answering.`;
}
export default buildContextPrompt;
