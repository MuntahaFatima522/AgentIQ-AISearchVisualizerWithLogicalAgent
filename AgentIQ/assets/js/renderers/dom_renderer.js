/* ============================================================
   dom_renderer.js — DOM Renderer (ES6 Module)
   ============================================================ */

export const DOMRenderer = {
  getContainer(container) {
    if (container) return container;
    return document.getElementById('dom-board');
  },

  clear(container) {
    const parent = this.getContainer(container);
    if (parent) parent.innerHTML = '';
  },

  /* ============================================================
     8-Puzzle
     ============================================================ */
  drawPuzzle8(state, container) {
    this.clear(container);
    const parent = this.getContainer(container);
    if (!parent) return;

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:240px;height:240px;margin:auto;';

    state.forEach(val => {
      const cell = document.createElement('div');
      cell.style.cssText = `
        display:flex;align-items:center;justify-content:center;
        border-radius:var(--radius);font-family:var(--font-display);
        font-size:2rem;font-weight:700;transition:background var(--transition);
        user-select:none;cursor:default;
      `;
      if (val === 0) {
        cell.style.background = 'var(--bg-secondary)';
        cell.style.border = '2px dashed var(--border)';
      } else {
        cell.style.background = 'var(--accent-blue)';
        cell.style.color = '#ffffff';
        cell.style.border = '1px solid var(--border-bright)';
        cell.textContent = val;
      }
      wrap.appendChild(cell);
    });

    parent.appendChild(wrap);
  },

  /* ============================================================
     N-Queens
     ============================================================ */
  drawNQueens(queens, n, conflicts, container) {
    this.clear(container);
    const parent = this.getContainer(container);
    if (!parent) return;

    const size = 320;
    const cellSz = Math.floor(size / n);

    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:grid;
      grid-template-columns:repeat(${n},${cellSz}px);
      grid-template-rows:repeat(${n},${cellSz}px);
      border:2px solid var(--border);
      border-radius:var(--radius);
      overflow:hidden;
      margin:auto;
    `;

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const cell = document.createElement('div');
        const isLight = (r + c) % 2 === 0;
        const hasQueen = queens[c] === r;
        const isConflict = hasQueen && conflicts && conflicts.includes(c);

        cell.style.cssText = `
          width:${cellSz}px;height:${cellSz}px;
          display:flex;align-items:center;justify-content:center;
          font-size:${Math.floor(cellSz * 0.65)}px;
          background:${isConflict ? 'rgba(247, 79, 79, 0.2)' : isLight ? 'var(--bg-elevated)' : 'var(--bg-secondary)'};
          border:1px solid var(--border);
          transition:background var(--transition);
        `;

        if (hasQueen) {
          cell.textContent = '♛';
          cell.style.color = isConflict ? 'var(--accent-red)' : 'var(--accent-orange)';
        }

        wrap.appendChild(cell);
      }
    }
    parent.appendChild(wrap);
  },

  /* ============================================================
     Vacuum World
     ============================================================ */
  drawVacuum(state, rows, cols, container) {
    this.clear(container);
    const parent = this.getContainer(container);
    if (!parent) return;

    const cellSz = Math.floor(280 / Math.max(rows, cols));
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:grid;
      grid-template-columns:repeat(${cols},${cellSz}px);
      grid-template-rows:repeat(${rows},${cellSz}px);
      gap:4px;
      margin:auto;
    `;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        const key = `${r},${c}`;
        const isAgent = state.pos[0] === r && state.pos[1] === c;
        const isDirty = state.dirty.has(key);

        cell.style.cssText = `
          width:${cellSz}px;height:${cellSz}px;
          display:flex;align-items:center;justify-content:center;
          border-radius:var(--radius);font-size:${Math.floor(cellSz * 0.45)}px;
          background:${isAgent ? 'var(--bg-elevated)' : isDirty ? 'rgba(247, 147, 79, 0.12)' : 'var(--bg-card)'};
          border:2px solid ${isAgent ? 'var(--accent-orange)' : isDirty ? 'var(--accent-orange)' : 'var(--border)'};
          transition:all var(--transition);
        `;

        if (isAgent) {
          cell.textContent = '🤖';
        } else if (isDirty) {
          cell.textContent = '🟤';
        } else {
          cell.textContent = '⬜';
        }
        wrap.appendChild(cell);
      }
    }
    parent.appendChild(wrap);
  },

  /* ============================================================
     Sudoku
     ============================================================ */
  drawSudoku(grid, fixed, conflicts, container) {
    this.clear(container);
    const parent = this.getContainer(container);
    if (!parent) return;

    const cellSz = 34;
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:grid;grid-template-columns:repeat(9,${cellSz}px);
      grid-template-rows:repeat(9,${cellSz}px);
      border:3px solid var(--border-bright);border-radius:var(--radius);
      overflow:hidden;margin:auto;
    `;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        const val = grid[r][c];
        const isFixed = fixed && fixed[r][c];
        const isConflict = conflicts && conflicts.some(([cr, cc]) => cr === r && cc === c);

        const bt = r % 3 === 0 ? '2px solid var(--border-bright)' : '1px solid var(--border)';
        const bl = c % 3 === 0 ? '2px solid var(--border-bright)' : '1px solid var(--border)';

        cell.style.cssText = `
          width:${cellSz}px;height:${cellSz}px;
          display:flex;align-items:center;justify-content:center;
          font-family:var(--font-display);
          font-size:1.1rem;font-weight:${isFixed ? '700' : '400'};
          background:${isConflict ? 'rgba(247, 79, 79, 0.15)' : isFixed ? 'var(--bg-secondary)' : 'var(--bg-card)'};
          color:${isConflict ? 'var(--accent-red)' : isFixed ? 'var(--text-primary)' : 'var(--accent-blue)'};
          border-top:${bt};border-left:${bl};
          border-right:1px solid var(--border);
          border-bottom:1px solid var(--border);
        `;

        if (val !== 0) cell.textContent = val;
        wrap.appendChild(cell);
      }
    }
    parent.appendChild(wrap);
  },

  /* ============================================================
     Tower of Hanoi
     ============================================================ */
  drawHanoi(pegs, numDisks, container) {
    this.clear(container);
    const parent = this.getContainer(container);
    if (!parent) return;

    const colors = ['#4f8ef7', '#3ecf8e', '#f7934f', '#9b6dff', '#f7d44f'];
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:flex;gap:12px;align-items:flex-end;
      width:100%;justify-content:center;padding:1rem;margin:auto;
    `;

    const pegNames = ['A', 'B', 'C'];
    pegs.forEach((peg, pi) => {
      const pegWrap = document.createElement('div');
      pegWrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:3px;min-width:96px;';

      const disks = [...peg].reverse();
      const emptySlots = numDisks - disks.length;

      for (let i = 0; i < emptySlots; i++) {
        const empty = document.createElement('div');
        empty.style.cssText = 'height:20px;width:3px;background:rgba(255,255,255,0.06);';
        pegWrap.appendChild(empty);
      }

      disks.forEach(size => {
        const disk = document.createElement('div');
        const w = 24 + size * 14;
        disk.style.cssText = `
          height:20px;width:${w}px;
          background:${colors[(size - 1) % colors.length]};
          border-radius:4px;display:flex;align-items:center;justify-content:center;
          color:#000;font-size:0.7rem;font-weight:700;
          border:1px solid var(--border);
        `;
        disk.textContent = size;
        pegWrap.appendChild(disk);
      });

      const pole = document.createElement('div');
      pole.style.cssText = 'width:6px;height:12px;background:var(--border-bright);border-radius:3px;';
      pegWrap.appendChild(pole);

      const label = document.createElement('div');
      label.textContent = `Peg ${pegNames[pi]}`;
      label.style.cssText = 'font-size:0.75rem;color:var(--text-secondary);margin-top:4px;font-family:var(--font-display);font-weight:700;';
      pegWrap.appendChild(label);

      wrap.appendChild(pegWrap);
    });

    parent.appendChild(wrap);
  },

  /* ============================================================
     Water Jug
     ============================================================ */
  drawWaterJug(state, j1Max, j2Max, container) {
    this.clear(container);
    const parent = this.getContainer(container);
    if (!parent) return;

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:44px;align-items:flex-end;justify-content:center;height:240px;padding:1.5rem 0;margin:auto;';

    const renderJug = (curr, max, label) => {
      const jugCol = document.createElement('div');
      jugCol.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:8px;';

      const jugBody = document.createElement('div');
      const h = max * 44; // Scale height
      const fillPct = (curr / max) * 100;

      jugBody.style.cssText = `
        width:90px;height:${h}px;border:3px solid var(--border-bright);
        border-top:none;border-bottom-left-radius:8px;border-bottom-right-radius:8px;
        background:rgba(255,255,255,0.03);position:relative;overflow:hidden;
      `;

      const water = document.createElement('div');
      water.style.cssText = `
        position:absolute;bottom:0;left:0;right:0;
        height:${fillPct}%;background:var(--accent-blue);
        transition:height 0.25s ease;
      `;

      const labelTxt = document.createElement('div');
      labelTxt.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:0.9rem;text-shadow:0 1px 2px rgba(0,0,0,0.5);';
      labelTxt.textContent = `${curr} / ${max} Gal`;

      jugBody.appendChild(water);
      jugBody.appendChild(labelTxt);

      const name = document.createElement('div');
      name.style.cssText = 'font-size:0.8rem;color:var(--text-secondary);font-family:var(--font-display);font-weight:700;';
      name.textContent = label;

      jugCol.appendChild(jugBody);
      jugCol.appendChild(name);
      return jugCol;
    };

    wrap.appendChild(renderJug(state[0], j1Max, 'Jug 1 (4G)'));
    wrap.appendChild(renderJug(state[1], j2Max, 'Jug 2 (3G)'));
    parent.appendChild(wrap);
  },

  /* ============================================================
     Missionaries & Cannibals
     ============================================================ */
  drawMissionaries(state, container) {
    this.clear(container);
    const parent = this.getContainer(container);
    if (!parent) return;

    const [mLeft, cLeft, side] = state;
    const mRight = 3 - mLeft;
    const cRight = 3 - cLeft;

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;width:100%;max-width:440px;gap:20px;padding:1rem;margin:auto;';

    const renderBank = (mCount, cCount, title) => {
      const bank = document.createElement('div');
      bank.style.cssText = 'background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:12px;min-height:72px;display:flex;flex-direction:column;gap:6px;';

      const header = document.createElement('div');
      header.style.cssText = 'font-family:var(--font-display);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;';
      header.textContent = title;

      const people = document.createElement('div');
      people.style.cssText = 'display:flex;gap:4px;font-size:1.35rem;';

      // Missionaries
      for (let i = 0; i < mCount; i++) people.textContent += '👤';
      // Separator if both
      if (mCount > 0 && cCount > 0) people.innerHTML += '<span style="width:8px;display:inline-block;"></span>';
      // Cannibals
      for (let i = 0; i < cCount; i++) people.innerHTML += '💀';

      if (mCount === 0 && cCount === 0) {
        people.style.fontSize = '0.8rem';
        people.style.fontStyle = 'italic';
        people.style.color = 'var(--text-muted)';
        people.textContent = 'Empty Bank';
      }

      bank.appendChild(header);
      bank.appendChild(people);
      return bank;
    };

    // River
    const river = document.createElement('div');
    river.style.cssText = 'height:40px;background:rgba(79, 142, 247, 0.08);border:1px dashed rgba(79, 142, 247, 0.3);border-radius:var(--radius);display:flex;align-items:center;position:relative;padding:0 24px;';

    const boat = document.createElement('div');
    boat.style.cssText = `
      font-size:1.6rem;position:absolute;top:50%;transform:translateY(-50%);
      transition:left 0.35s ease;
      left:${side === 0 ? '24px' : 'calc(100% - 64px)'};
    `;
    boat.textContent = '🚣';
    river.appendChild(boat);

    wrap.appendChild(renderBank(mLeft, cLeft, 'Left Bank'));
    wrap.appendChild(river);
    wrap.appendChild(renderBank(mRight, cRight, 'Right Bank'));

    parent.appendChild(wrap);
  },

  /* ============================================================
     Wumpus World
     ============================================================ */
  drawWumpus(state, rows, cols, wumpus, gold, pits, container) {
    this.clear(container);
    const parent = this.getContainer(container);
    if (!parent) return;

    const cellSize = 60;
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:grid;
      grid-template-columns:repeat(${cols},${cellSize}px);
      gap:1px;width:${cols*cellSize}px;height:${rows*cellSize}px;
      margin:auto;background:var(--border);padding:2px;border-radius:var(--radius);
    `;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.style.cssText = `
          display:flex;align-items:center;justify-content:center;
          background:var(--bg-secondary);border:1px solid var(--border);
          font-size:1.8rem;position:relative;transition:all 0.2s;
        `;

        const posKey = `${r},${c}`;
        const isStart = r === 0 && c === 0;
        const isGold = gold && gold[0] === r && gold[1] === c;
        const isWumpus = wumpus && wumpus[0] === r && wumpus[1] === c;
        const isPit = pits && pits.some(p => p[0] === r && p[1] === c);
        const isVisited = state && state.visited && state.visited.has(posKey);
        const isAgent = state && state.pos[0] === r && state.pos[1] === c;

        if (isStart) {
          cell.style.background = 'rgba(34, 197, 94, 0.15)';
          cell.style.border = '2px solid var(--green)';
        } else if (isVisited) {
          cell.style.background = 'rgba(108, 99, 255, 0.08)';
        }

        if (isAgent) {
          const icon = document.createElement('div');
          icon.textContent = state.hasGold ? '🤖✨' : '🤖';
          icon.style.fontSize = '1.6rem';
          cell.appendChild(icon);
        } else if (isGold) {
          cell.textContent = '✨';
        } else if (isWumpus) {
          cell.textContent = '👹';
        } else if (isPit) {
          cell.textContent = '🕳️';
        }

        wrap.appendChild(cell);
      }
    }

    parent.appendChild(wrap);
  }
};

