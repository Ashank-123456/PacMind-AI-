/**
 * @file searchAlgorithms.js
 * @description High-performance AI pathfinding engines powering Pac-Man and Ghost agents.
 * Implements A* Search with Manhattan distance heuristic and Breadth-First Search (BFS)
 * with low-allocation TypedArrays for maximum speed and sub-millisecond execution.
 */

import { GRID_CONFIG, TILE_TYPES } from '@/constants/gameConfig';

const { ROWS, COLS } = GRID_CONFIG;
const { WALL, GHOST_DOOR, PELLET, POWER_PELLET } = TILE_TYPES;

/**
 * 4-Directional Grid Offsets [dr, dc]: Up, Down, Left, Right
 */
const CARDINAL_DIRECTIONS = Object.freeze([
  [-1, 0], // Up
  [1, 0],  // Down
  [0, -1], // Left
  [0, 1],  // Right
]);

/**
 * Flattens 2D grid coordinates (row, col) into a 1D scalar index.
 * @param {number} row - Grid row index
 * @param {number} col - Grid column index
 * @returns {number} 1D index
 */
const toIndex = (row, col) => row * COLS + col;

/**
 * Computes the Manhattan (L1 norm) distance heuristic between two cells.
 * Formula: h(n) = |row_1 - row_2| + |col_1 - col_2|
 *
 * Admissible and consistent for 4-directional grid graphs without diagonal steps.
 *
 * @param {number} r1 - Starting row
 * @param {number} c1 - Starting col
 * @param {number} r2 - Target row
 * @param {number} c2 - Target col
 * @returns {number} Manhattan grid distance
 */
export function manhattanDistance(r1, c1, r2, c2) {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

/**
 * Executes A* Heuristic Search to find the optimal path from start to goal.
 * Utilizes f(n) = g(n) + h(n) to prioritize nodes that minimize total estimated path cost.
 *
 * @param {number[][]} maze - 2D matrix representing walls and open tiles
 * @param {{row: number, col: number}} start - Starting coordinate
 * @param {{row: number, col: number}} goal - Target coordinate
 * @param {boolean} [isGhost=false] - If true, permits passing through the ghost pen door
 * @returns {{
 *   path: Array<{row: number, col: number}>,
 *   nodesExplored: number,
 *   timeMs: number,
 *   cost: number
 * }}
 */
export function findPathAStar(maze, start, goal, isGhost = false) {
  const startTime = performance.now();

  if (!start || !goal) {
    return { path: [], nodesExplored: 0, timeMs: 0, cost: 0 };
  }

  // Trivial identical start and destination
  if (start.row === goal.row && start.col === goal.col) {
    return { path: [start], nodesExplored: 1, timeMs: 0, cost: 0 };
  }

  const startKey = toIndex(start.row, start.col);
  const goalKey = toIndex(goal.row, goal.col);

  // Fast TypedArray storage for node state
  const gCosts = new Int16Array(ROWS * COLS).fill(9999);
  const parentMap = new Int16Array(ROWS * COLS).fill(-1);

  gCosts[startKey] = 0;

  // Open list storing { row, col, fCost }
  const openList = [{
    row: start.row,
    col: start.col,
    fCost: manhattanDistance(start.row, start.col, goal.row, goal.col),
  }];

  let nodesExplored = 0;

  while (openList.length > 0) {
    // Locate node with minimum fCost
    let minIndex = 0;
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].fCost < openList[minIndex].fCost) {
        minIndex = i;
      }
    }

    const current = openList.splice(minIndex, 1)[0];
    const currentKey = toIndex(current.row, current.col);
    nodesExplored++;

    // Target reached
    if (currentKey === goalKey) {
      const path = reconstructPath(parentMap, currentKey, startKey);
      const executionTime = +(performance.now() - startTime).toFixed(3);
      return {
        path,
        nodesExplored,
        timeMs: executionTime,
        cost: path.length - 1,
      };
    }

    // Inspect 4-connected neighbors
    for (let i = 0; i < 4; i++) {
      const neighborRow = current.row + CARDINAL_DIRECTIONS[i][0];
      const neighborCol = current.col + CARDINAL_DIRECTIONS[i][1];

      // Boundary check
      if (
        neighborRow < 0 || neighborRow >= ROWS ||
        neighborCol < 0 || neighborCol >= COLS
      ) {
        continue;
      }

      const cellType = maze[neighborRow][neighborCol];
      if (cellType === WALL) continue;
      if (!isGhost && cellType === GHOST_DOOR) continue;

      const neighborKey = toIndex(neighborRow, neighborCol);
      const tentativeGCost = gCosts[currentKey] + 1;

      // Found a strictly cheaper path to neighbor
      if (tentativeGCost < gCosts[neighborKey]) {
        gCosts[neighborKey] = tentativeGCost;
        parentMap[neighborKey] = currentKey;

        const hCost = manhattanDistance(neighborRow, neighborCol, goal.row, goal.col);
        openList.push({
          row: neighborRow,
          col: neighborCol,
          fCost: tentativeGCost + hCost,
        });
      }
    }
  }

  // Destination unreachable
  return {
    path: [],
    nodesExplored,
    timeMs: +(performance.now() - startTime).toFixed(3),
    cost: Infinity,
  };
}

/**
 * Executes Breadth-First Search (BFS) to identify the unweighted shortest path.
 * Guarantees optimal step-count on unweighted 2D tile mazes.
 *
 * @param {number[][]} maze - 2D matrix
 * @param {{row: number, col: number}} start - Start coordinate
 * @param {{row: number, col: number}} goal - Destination coordinate
 * @param {boolean} [isGhost=false] - Whether entity can pass ghost house doors
 * @returns {{
 *   path: Array<{row: number, col: number}>,
 *   nodesExplored: number,
 *   timeMs: number,
 *   cost: number
 * }}
 */
export function findPathBFS(maze, start, goal, isGhost = false) {
  const startTime = performance.now();

  if (!start || !goal) {
    return { path: [], nodesExplored: 0, timeMs: 0, cost: 0 };
  }

  if (start.row === goal.row && start.col === goal.col) {
    return { path: [start], nodesExplored: 1, timeMs: 0, cost: 0 };
  }

  const startKey = toIndex(start.row, start.col);
  const goalKey = toIndex(goal.row, goal.col);

  const queue = [startKey];
  const visited = new Uint8Array(ROWS * COLS);
  const parentMap = new Int16Array(ROWS * COLS).fill(-1);

  visited[startKey] = 1;
  let nodesExplored = 0;

  while (queue.length > 0) {
    const currentKey = queue.shift();
    nodesExplored++;

    if (currentKey === goalKey) {
      const path = reconstructPath(parentMap, currentKey, startKey);
      return {
        path,
        nodesExplored,
        timeMs: +(performance.now() - startTime).toFixed(3),
        cost: path.length - 1,
      };
    }

    const row = Math.floor(currentKey / COLS);
    const col = currentKey % COLS;

    for (let i = 0; i < 4; i++) {
      const nextRow = row + CARDINAL_DIRECTIONS[i][0];
      const nextCol = col + CARDINAL_DIRECTIONS[i][1];

      if (nextRow < 0 || nextRow >= ROWS || nextCol < 0 || nextCol >= COLS) {
        continue;
      }

      const cellType = maze[nextRow][nextCol];
      if (cellType === WALL) continue;
      if (!isGhost && cellType === GHOST_DOOR) continue;

      const nextKey = toIndex(nextRow, nextCol);
      if (!visited[nextKey]) {
        visited[nextKey] = 1;
        parentMap[nextKey] = currentKey;
        queue.push(nextKey);
      }
    }
  }

  return {
    path: [],
    nodesExplored,
    timeMs: +(performance.now() - startTime).toFixed(3),
    cost: Infinity,
  };
}

/**
 * Identifies the optimal target pellet for Pac-Man using BFS wave expansion,
 * while proactively penalizing pathways traversing ghost threat zones.
 *
 * @param {number[][]} maze - 2D maze grid
 * @param {{row: number, col: number}} start - Pac-Man's current location
 * @param {Array<object>} ghosts - Array of active ghost agents
 * @param {boolean} frightenedMode - Whether ghosts are currently frightened
 * @returns {{row: number, col: number} | null} Selected target tile coordinate
 */
export function findSafestNearestPellet(maze, start, ghosts, frightenedMode) {
  // Construct danger cost map: cell key -> danger intensity (1 = adjacent, 2 = direct tile)
  const dangerMap = new Uint8Array(ROWS * COLS);

  if (!frightenedMode && ghosts && ghosts.length > 0) {
    for (const ghost of ghosts) {
      if (ghost.mode === 'chase' || ghost.mode === 'exiting') {
        const ghostRow = Math.round(ghost.row);
        const ghostCol = Math.round(ghost.col);

        if (ghostRow >= 0 && ghostRow < ROWS && ghostCol >= 0 && ghostCol < COLS) {
          dangerMap[toIndex(ghostRow, ghostCol)] = 2; // Direct danger

          for (const [dr, dc] of CARDINAL_DIRECTIONS) {
            const adjRow = ghostRow + dr;
            const adjCol = ghostCol + dc;
            if (adjRow >= 0 && adjRow < ROWS && adjCol >= 0 && adjCol < COLS) {
              const adjKey = toIndex(adjRow, adjCol);
              dangerMap[adjKey] = Math.max(dangerMap[adjKey], 1); // Adjacent risk
            }
          }
        }
      }
    }
  }

  const startKey = toIndex(start.row, start.col);
  const queue = [{ row: start.row, col: start.col, distance: 0 }];
  const visited = new Uint8Array(ROWS * COLS);
  visited[startKey] = 1;

  let safeCandidate = null;
  let fallbackCandidate = null;

  while (queue.length > 0) {
    const { row, col, distance } = queue.shift();
    const cellValue = maze[row][col];

    // Found an uneaten pellet or power pellet
    if (distance > 0 && (cellValue === PELLET || cellValue === POWER_PELLET)) {
      if (!fallbackCandidate) {
        fallbackCandidate = { row, col };
      }

      // Prioritize candidate devoid of immediate danger
      if (!dangerMap[toIndex(row, col)]) {
        safeCandidate = { row, col };
        break; // Closest safe pellet found!
      }
    }

    for (let i = 0; i < 4; i++) {
      const nextRow = row + CARDINAL_DIRECTIONS[i][0];
      const nextCol = col + CARDINAL_DIRECTIONS[i][1];

      if (nextRow < 0 || nextRow >= ROWS || nextCol < 0 || nextCol >= COLS) {
        continue;
      }

      const nextKey = toIndex(nextRow, nextCol);
      if (visited[nextKey]) continue;

      const nextCell = maze[nextRow][nextCol];
      if (nextCell === WALL || nextCell === GHOST_DOOR) continue;

      // Prune immediate fatal paths early if distance is small
      if (dangerMap[nextKey] === 2 && distance < 3) continue;

      visited[nextKey] = 1;
      queue.push({ row: nextRow, col: nextCol, distance: distance + 1 });
    }
  }

  if (safeCandidate) return safeCandidate;
  if (fallbackCandidate) return fallbackCandidate;

  // Ultimate fallback scan across full maze
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === PELLET || maze[r][c] === POWER_PELLET) {
        return { row: r, col: c };
      }
    }
  }

  return null;
}

/**
 * Reconstructs a sequential path array from the parent map pointers.
 *
 * @param {Int16Array} parentMap - Predecessor index map
 * @param {number} goalKey - 1D index of goal
 * @param {number} startKey - 1D index of start
 * @returns {Array<{row: number, col: number}>} Ordered coordinates from start to goal
 */
function reconstructPath(parentMap, goalKey, startKey) {
  const path = [];
  let current = goalKey;

  while (current !== -1) {
    path.unshift({
      row: Math.floor(current / COLS),
      col: current % COLS,
    });
    if (current === startKey) break;
    current = parentMap[current];
  }

  return path;
}
