/* ============================================================
   router.js — Page State & Navigation Utility
   Handles passing problem/algorithm selection between pages
   using URL query params + sessionStorage as fallback.
   ============================================================ */

const Router = {

  /* ---- Read a query param from the current URL ---- */
  getParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  },

  /* ---- Navigate to algo-select page for a problem ---- */
  goToAlgoSelect(problemId) {
    window.location.href = `algo-select.html?problem=${encodeURIComponent(problemId)}`;
  },

  /* ---- Navigate to simulation page ---- */
  goToSimulation(problemId, algoId) {
    sessionStorage.setItem('sim_problem', problemId);
    sessionStorage.setItem('sim_algo',    algoId);
    window.location.href = `simulation.html?problem=${encodeURIComponent(problemId)}&algo=${encodeURIComponent(algoId)}`;
  },

  /* ---- Get current simulation context (used by simulation.html) ---- */
  getSimContext() {
    return {
      problemId: this.getParam('problem') || sessionStorage.getItem('sim_problem'),
      algoId:    this.getParam('algo')    || sessionStorage.getItem('sim_algo')
    };
  },

  /* ---- Build breadcrumb trail as HTML string ---- */
  buildBreadcrumb(items) {
    // items = [{ label, href }, ...] — last item has no href (current page)
    return items.map((item, i) => {
      const isLast = i === items.length - 1;
      if (isLast) {
        return `<span class="current">${item.label}</span>`;
      }
      return `<a href="${item.href}">${item.label}</a><span class="sep">›</span>`;
    }).join('');
  }
};