/* ============================================================
   canvas_renderer.js — Canvas Renderer (ES6 Module)
   ============================================================ */

export const CanvasRenderer = {
  canvas: null,
  ctx: null,

  init(canvasElement) {
    this.canvas = canvasElement || document.getElementById('sim-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // Set internal resolution based on CSS dimensions
    this.canvas.width = this.canvas.clientWidth || 560;
    this.canvas.height = this.canvas.clientHeight || 560;
  },

  clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  /* ============================================================
     drawGraph — Romania graph drawing
     ============================================================ */
  drawGraph(nodes, edges, openSet, closedSet, current, pathNodes, goalNode, startNode, canvasElement) {
    this.init(canvasElement);
    if (!this.ctx) return;
    this.clear();

    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // 1. Draw Edges
    edges.forEach(({ from, to, cost }) => {
      const a = nodes[from];
      const b = nodes[to];
      if (!a || !b) return;

      const ax = a.x * W;
      const ay = a.y * H;
      const bx = b.x * W;
      const by = b.y * H;

      const onPath = pathNodes && pathNodes.includes(from) && pathNodes.includes(to);

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);

      // Clean solid colors, NO shadows/glows
      if (onPath) {
        ctx.strokeStyle = '#3ecf8e'; // --accent-green
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = '#2a2f3d'; // --border
        ctx.lineWidth = 1.5;
      }
      ctx.stroke();

      // Draw cost text
      const mx = (ax + bx) / 2;
      const my = (ay + by) / 2;
      ctx.fillStyle = onPath ? '#3ecf8e' : '#8b91a8';
      ctx.font = `${Math.max(11, Math.floor(W * 0.024))}px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cost, mx, my - 6);
    });

    // 2. Draw Nodes
    Object.entries(nodes).forEach(([name, pos]) => {
      const x = pos.x * W;
      const y = pos.y * H;
      const r = Math.floor(W * 0.034);

      let fill = '#1a1e28'; // unexplored --bg-card
      let stroke = '#2a2f3d'; // --border
      let tc = '#8b91a8'; // --text-secondary

      if (name === current) {
        fill = '#f7934f'; // --accent-orange
        stroke = '#f7934f';
        tc = '#0d0f14';
      } else if (pathNodes && pathNodes.includes(name)) {
        fill = '#3ecf8e'; // --accent-green
        stroke = '#3ecf8e';
        tc = '#0d0f14';
      } else if (closedSet && closedSet.includes(name)) {
        fill = '#222736'; // --bg-elevated
        stroke = '#3d4460'; // --border-bright
        tc = '#3ecf8e';
      } else if (openSet && openSet.includes(name)) {
        fill = '#222736';
        stroke = '#4f8ef7'; // --accent-blue
        tc = '#4f8ef7';
      }

      // Draw start/goal dashed rings
      if (name === goalNode && name !== current) {
        ctx.beginPath();
        ctx.arc(x, y, r + 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#9b6dff'; // --accent-purple
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (name === startNode && name !== current) {
        ctx.beginPath();
        ctx.arc(x, y, r + 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#f7934f'; // --accent-orange
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Main Node Circle
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text Label
      ctx.fillStyle = tc;
      ctx.font = `bold ${Math.max(12, Math.floor(W * 0.026))}px "DM Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const short = name.length > 7 ? name.slice(0, 6) + '…' : name;
      ctx.fillText(short, x, y);
    });

    this._drawLegend(['Start', 'Goal', 'Current', 'Frontier', 'Explored', 'Path'],
                     ['#f7934f', '#9b6dff', '#f7934f', '#4f8ef7', '#3ecf8e', '#3ecf8e']);
  },

  /* ============================================================
     drawGrid — Maze drawing
     ============================================================ */
  drawGrid(grid, rows, cols, openSet, closedSet, current, pathCells, specialCells, canvasElement) {
    this.init(canvasElement);
    if (!this.ctx) return;
    this.clear();

    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const cw = W / cols;
    const ch = H / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r},${c}`;
        const val = grid[r][c];
        const x = c * cw;
        const y = r * ch;

        let bg = '#1e1e32'; // unexplored
        let border = '#3a3a5c';

        if (val === 1) {
          bg = '#2d3436'; // wall
          border = '#2d3436';
        } else if (key === current) {
          bg = '#fdcb6e'; // current — warm yellow
          border = '#fdcb6e';
        } else if (pathCells && pathCells.includes(key)) {
          bg = '#0984e3'; // path — bright blue
          border = '#0984e3';
        } else if (closedSet && closedSet.includes(key)) {
          bg = '#55efc4'; // explored — mint green
          border = '#55efc4';
        } else if (openSet && openSet.includes(key)) {
          bg = '#74b9ff'; // frontier — sky blue
          border = '#74b9ff';
        }

        ctx.fillStyle = bg;
        ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2);

        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, cw - 1, ch - 1);

        if (specialCells && specialCells[key]) {
          ctx.fillStyle = '#e8eaf0';
          ctx.font = `${Math.floor(Math.min(cw, ch) * 0.52)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(specialCells[key], x + cw / 2, y + ch / 2);
        }
      }
    }

    this._drawLegend(['Current', 'Path', 'Explored', 'Frontier', 'Wall'],
                     ['#fdcb6e', '#0984e3', '#55efc4', '#74b9ff', '#2d3436']);
  },

  /* ============================================================
     drawTSP — TSP cities and tour routing
     ============================================================ */
  drawTSP(cities, tour, openSet, closedSet, current, canvasElement) {
    this.init(canvasElement);
    if (!this.ctx) return;
    this.clear();

    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // 1. Draw Tour Path
    if (tour && tour.length > 1) {
      ctx.beginPath();
      ctx.moveTo(cities[tour[0]].x * W, cities[tour[0]].y * H);
      for (let i = 1; i < tour.length; i++) {
        if (!cities[tour[i]]) continue;
        ctx.lineTo(cities[tour[i]].x * W, cities[tour[i]].y * H);
      }
      ctx.strokeStyle = '#3ecf8e'; // --accent-green
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // 2. Draw Cities
    Object.entries(cities).forEach(([name, pos]) => {
      const x = pos.x * W;
      const y = pos.y * H;
      const r = Math.floor(W * 0.028);

      let fill = '#1a1e28'; // --bg-card
      let stroke = '#2a2f3d'; // --border

      if (name === current) {
        fill = '#f7934f'; // --accent-orange
        stroke = '#f7934f';
      } else if (tour && tour.includes(name)) {
        fill = '#222736'; // --bg-elevated
        stroke = '#3ecf8e'; // --accent-green
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#e8eaf0';
      ctx.font = `bold ${Math.max(12, Math.floor(W * 0.026))}px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, x, y);
    });
  },

  _drawLegend(labels, colors) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const fs = Math.max(11, Math.floor(W * 0.022));
    let lx = 12;
    const ly = H - 12 - fs;

    ctx.font = `${Math.max(10, Math.floor(W * 0.02))}px "Space Mono", monospace`;
    ctx.textBaseline = 'middle';

    labels.forEach((lbl, i) => {
      ctx.fillStyle = colors[i];
      ctx.fillRect(lx, ly - fs / 2, fs, fs);
      lx += fs + 4;
      ctx.fillStyle = '#8b91a8'; // --text-secondary
      ctx.textAlign = 'left';
      ctx.fillText(lbl, lx, ly);
      lx += ctx.measureText(lbl).width + 12;
    });
  }
};
