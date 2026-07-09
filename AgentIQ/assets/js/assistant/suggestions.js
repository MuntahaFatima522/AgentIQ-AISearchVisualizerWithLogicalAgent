/* ============================================================
   suggestions.js — Dynamic Question Chip Generator (ES6 Module)
   ============================================================ */

import { SimState } from '../sim_state.js';
import { SUGGESTION_POOL } from './knowledge_base.js';

/**
 * @param {object|null} customState
 * @param {'home'|'algo'|'simulation'} [pageType]
 */
export function getSuggestions(customState = null, pageType = null) {
  const state = customState || SimState;
  const problemId = state.problem?.metadata?.id;
  const algoId = state.algorithm;

  let pool = [];

  if (!problemId && !algoId) {
    pool = SUGGESTION_POOL.home;
  } else if (pageType === 'algo' || (!pageType && problemId && !state.currentNode)) {
    pool = SUGGESTION_POOL.algo[problemId] || SUGGESTION_POOL.home;
  } else if (problemId && algoId) {
    pool = SUGGESTION_POOL.simulation[problemId]?.[algoId]
      || SUGGESTION_POOL.algo[problemId]
      || SUGGESTION_POOL.home;
  } else {
    pool = SUGGESTION_POOL.home;
  }

  // Blend dynamic simulation hints when a run is active
  if (problemId && algoId && state.currentNode?.label) {
    const dynamic = [
      `Why was ${state.currentNode.label} chosen?`,
      `What is the g(n) cost of ${state.currentNode.label}?`
    ];
    pool = [...dynamic, ...pool];
  } else if (problemId && !pool.includes(`What is the start state of ${problemId}?`)) {
    pool = [`What is the start state of ${problemId}?`, ...pool];
  }

  return [...new Set(pool)].sort(() => Math.random() - 0.5).slice(0, 4);
}
