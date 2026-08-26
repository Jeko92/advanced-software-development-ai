/**
 * Challenge 06 — Conway's Game of Life (interactive CLI)
 *
 */

import { createInterface } from 'node:readline/promises';
import process from 'node:process';

// ---------------------------------------------------------------------------
// 1. Types & constants
// ---------------------------------------------------------------------------

type Grid = boolean[][];

interface Point {
  row: number;
  col: number;
}

const DEFAULT_ROWS = 50;
const DEFAULT_COLS = 50;
const ALIVE_CHAR = '■';
const DEAD_CHAR = ' ';
const FRAME_DELAY_MS = 200;
const MAX_SHAPE_PLACEMENT_ATTEMPTS = 100;

const MAX_HISTORY = 100;

const DENSITY_PRESETS = {
  few: 0.05,
  medium: 0.15,
  dense: 0.35,
} as const;

type DensityTier = keyof typeof DENSITY_PRESETS;

type ShapeName = 'block' | 'blinker' | 'glider' | 'pulsar';

interface ShapeDefinition {
  /** Alive cells as (row, col) offsets from a top-left anchor at (0, 0). */
  cells: readonly Point[];
  /** Bounding box size, derived from `cells` — used for placement bounds
   * checks. Compute this once (by hand or via a small reduce) rather than
   * recomputing it every placement attempt. */
  height: number;
  width: number;
}

const SHAPES: Record<ShapeName, ShapeDefinition> = {
  // ##
  // ##
  block: {
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
    height: 2,
    width: 2,
  },

  // #
  // #
  // #
  blinker: {
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
    ],
    height: 3,
    width: 1,
  },

  // .#.
  // ..#
  // ###
  glider: {
    cells: [
      { row: 0, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
    height: 3,
    width: 3,
  },

  // ..###...###..
  // .............
  // #....#.#....#
  // #....#.#....#
  // #....#.#....#
  // ..###...###..
  // .............
  // ..###...###..
  // #....#.#....#
  // #....#.#....#
  // #....#.#....#
  // .............
  // ..###...###..
  pulsar: {
    cells: [
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 0, col: 4 },
      { row: 0, col: 8 },
      { row: 0, col: 9 },
      { row: 0, col: 10 },

      { row: 2, col: 0 },
      { row: 2, col: 5 },
      { row: 2, col: 7 },
      { row: 2, col: 12 },
      { row: 3, col: 0 },
      { row: 3, col: 5 },
      { row: 3, col: 7 },
      { row: 3, col: 12 },
      { row: 4, col: 0 },
      { row: 4, col: 5 },
      { row: 4, col: 7 },
      { row: 4, col: 12 },

      { row: 5, col: 2 },
      { row: 5, col: 3 },
      { row: 5, col: 4 },
      { row: 5, col: 8 },
      { row: 5, col: 9 },
      { row: 5, col: 10 },

      { row: 7, col: 2 },
      { row: 7, col: 3 },
      { row: 7, col: 4 },
      { row: 7, col: 8 },
      { row: 7, col: 9 },
      { row: 7, col: 10 },

      { row: 8, col: 0 },
      { row: 8, col: 5 },
      { row: 8, col: 7 },
      { row: 8, col: 12 },
      { row: 9, col: 0 },
      { row: 9, col: 5 },
      { row: 9, col: 7 },
      { row: 9, col: 12 },
      { row: 10, col: 0 },
      { row: 10, col: 5 },
      { row: 10, col: 7 },
      { row: 10, col: 12 },

      { row: 12, col: 2 },
      { row: 12, col: 3 },
      { row: 12, col: 4 },
      { row: 12, col: 8 },
      { row: 12, col: 9 },
      { row: 12, col: 10 },
    ],
    height: 13,
    width: 13,
  },
};

// No Block by default: it's a permanent survivor, which would make total
// extinction mathematically impossible no matter how the rest of the
// board evolves. Still/oscillator/spaceship variety is available via
// "shapes" mode by asking for a Block explicitly.
const DEFAULT_SHAPE_COUNTS: Record<ShapeName, number> = {
  glider: 3,
  blinker: 2,
  pulsar: 1,
  block: 0,
};

/** Discriminated union: TypeScript (not a runtime null-check) guarantees a
 * 'random' config always carries `density` and a 'shapes' config always
 * carries `shapeCounts`. Switch on `mode` exhaustively wherever this is
 * consumed. */
type InitialStateConfig =
  | { mode: 'random'; density: number }
  | { mode: 'shapes'; shapeCounts: Record<ShapeName, number> };

interface GameConfig {
  rows: number;
  cols: number;
  initialState: InitialStateConfig;
}

// ---------------------------------------------------------------------------
// 2. Grid engine
// ---------------------------------------------------------------------------

const createEmptyGrid = (rows: number, cols: number): Grid => {
  const grid: Grid = [];
  if (rows < 1 || cols < 1) {
    throw new Error(
      `Rows and columns must each be at least 1 (got rows=${rows}, cols=${cols}).`,
    );
  }

  if (!Number.isInteger(rows) || !Number.isInteger(cols)) {
    throw new Error(
      `Rows and columns must be whole numbers (got rows=${rows}, cols=${cols}).`,
    );
  }

  for (let i = 0; i < rows; i++) {
    grid.push(Array.from({ length: cols }, () => false));
  }

  return grid;
};

const countLiveNeighbors = (grid: Grid, row: number, col: number): number => {
  const rows = grid.length;
  const cols = grid[0]!.length;

  let counter = 0;

  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dCol = -1; dCol <= 1; dCol++) {
      if (dRow === 0 && dCol === 0) {
        continue;
      }

      const neighborRow = (row + dRow + rows) % rows;
      const neighborCol = (col + dCol + cols) % cols;

      if (grid[neighborRow]![neighborCol]) {
        counter++;
      }
    }
  }

  return counter;
};

const computeNextGeneration = (grid: Grid): Grid => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const nextGrid = createEmptyGrid(rows, cols);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const liveNeighbors = countLiveNeighbors(grid, row, col);
      const isAlive = grid[row]![col];

      if (isAlive) {
        nextGrid[row]![col] = liveNeighbors === 2 || liveNeighbors === 3;
      } else {
        nextGrid[row]![col] = liveNeighbors === 3;
      }
    }
  }

  return nextGrid;
};

// ---------------------------------------------------------------------------
// 3. Initial-state builders (pure)
// ---------------------------------------------------------------------------

const fillRandomDensity = (grid: Grid, density: number): void => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      grid[row]![col] = Math.random() < density;
    }
  }
};

const shapeFitsInGrid = (
  shape: ShapeDefinition,
  rows: number,
  cols: number,
): boolean => {
  return shape.height <= rows && shape.width <= cols;
};

const tryPlaceShapeAt = (
  grid: Grid,
  shape: ShapeDefinition,
  anchor: Point,
): boolean => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  if (
    anchor.row < 0 ||
    anchor.col < 0 ||
    anchor.row + shape.height > rows ||
    anchor.col + shape.width > cols
  ) {
    return false;
  }

  for (const cell of shape.cells) {
    const targetRow = anchor.row + cell.row;
    const targetCol = anchor.col + cell.col;

    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        const checkRow = targetRow + dRow;
        const checkCol = targetCol + dCol;

        if (
          checkRow < 0 ||
          checkRow >= rows ||
          checkCol < 0 ||
          checkCol >= cols
        ) {
          continue;
        }

        if (grid[checkRow]![checkCol]) {
          return false;
        }
      }
    }
  }

  for (const cell of shape.cells) {
    const targetRow = anchor.row + cell.row;
    const targetCol = anchor.col + cell.col;

    grid[targetRow]![targetCol] = true;
  }

  return true;
};

const placeShapes = (
  grid: Grid,
  shapeCounts: Record<ShapeName, number>,
): void => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  for (const shapeName of Object.keys(shapeCounts) as ShapeName[]) {
    const shape = SHAPES[shapeName];
    const count = shapeCounts[shapeName];

    if (count <= 0) {
      continue;
    }

    if (!shapeFitsInGrid(shape, rows, cols)) {
      console.error(
        `Skipping ${shapeName}: its ${shape.height}x${shape.width} footprint doesn't fit in a ${rows}x${cols} grid.`,
      );
      continue;
    }

    for (let i = 0; i < count; i++) {
      let placed = false;

      for (let attempt = 0; attempt < MAX_SHAPE_PLACEMENT_ATTEMPTS; attempt++) {
        const anchor: Point = {
          row: Math.floor(Math.random() * (rows - shape.height + 1)),
          col: Math.floor(Math.random() * (cols - shape.width + 1)),
        };

        if (tryPlaceShapeAt(grid, shape, anchor)) {
          placed = true;
          break;
        }
      }

      if (!placed) {
        console.error(
          `Could not place ${shapeName} #${i + 1} after ${MAX_SHAPE_PLACEMENT_ATTEMPTS} attempts — the grid may be too crowded.`,
        );
      }
    }
  }
};

const buildInitialGrid = (config: GameConfig): Grid => {
  const grid = createEmptyGrid(config.rows, config.cols);

  switch (config.initialState.mode) {
    case 'random':
      fillRandomDensity(grid, config.initialState.density);
      break;
    case 'shapes':
      placeShapes(grid, config.initialState.shapeCounts);
      break;
    default: {
      const exhaustiveCheck: never = config.initialState;
      throw new Error(
        `Unhandled initial state mode: ${JSON.stringify(exhaustiveCheck)}`,
      );
    }
  }

  return grid;
};

// ---------------------------------------------------------------------------
// 4. Stability helpers (pure)
// ---------------------------------------------------------------------------

const isEmpty = (grid: Grid): boolean => {
  return grid.every((row) => row.every((cell) => !cell));
};

const gridsEqual = (a: Grid, b: Grid): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  for (let row = 0; row < a.length; row++) {
    const rowA = a[row]!;
    const rowB = b[row]!;

    if (rowA.length !== rowB.length) {
      return false;
    }

    for (let col = 0; col < rowA.length; col++) {
      if (rowA[col] !== rowB[col]) {
        return false;
      }
    }
  }

  return true;
};

// ---------------------------------------------------------------------------
// 5. Rendering
// ---------------------------------------------------------------------------

const renderGridToString = (grid: Grid): string => {
  const cols = grid[0]?.length ?? 0;
  // '+' at the corners, '-' along the top/bottom edges — one horizontal
  // segment per column, matching the width of each `|`-flanked row below.
  const horizontalBorder = `+${'-'.repeat(cols)}+`;

  const rows = grid.map((row) => {
    const line = row.map((cell) => (cell ? ALIVE_CHAR : DEAD_CHAR)).join('');
    return `|${line}|`;
  });

  return [horizontalBorder, ...rows, horizontalBorder].join('\n');
};

const printFrame = (grid: Grid, generation: number): void => {
  const clearScreen = '\x1B[H\x1B[2J';
  const frame = `Generation ${generation}\n${renderGridToString(grid)}\n`;

  process.stdout.write(clearScreen + frame);
};

const hideCursor = (): void => {
  process.stdout.write('\x1B[?25l');
};

const showCursor = (): void => {
  process.stdout.write('\x1B[?25h');
};

// ---------------------------------------------------------------------------
// 6. CLI prompts (I/O — node:readline/promises)
// ---------------------------------------------------------------------------

const parsePositiveInteger = (
  input: string,
  fallback: number,
  label: string,
): number => {
  if (input === '') {
    return fallback;
  }

  const parsed = Number(input);

  if (!Number.isInteger(parsed) || parsed < 1) {
    console.error(
      `"${input}" is not a positive whole number for ${label} — using ${fallback}.`,
    );
    return fallback;
  }

  return parsed;
};

const promptGridSize = async (
  rl: ReturnType<typeof createInterface>,
): Promise<{ rows: number; cols: number }> => {
  const rowsAnswer = (
    await rl.question(`Rows [default ${DEFAULT_ROWS}]: `)
  ).trim();
  const colsAnswer = (
    await rl.question(`Columns [default ${DEFAULT_COLS}]: `)
  ).trim();

  return {
    rows: parsePositiveInteger(rowsAnswer, DEFAULT_ROWS, 'rows'),
    cols: parsePositiveInteger(colsAnswer, DEFAULT_COLS, 'columns'),
  };
};

const isDensityTier = (value: string): value is DensityTier => {
  return value in DENSITY_PRESETS;
};

const promptInitialState = async (
  rl: ReturnType<typeof createInterface>,
): Promise<InitialStateConfig> => {
  const modeAnswer = (
    await rl.question(
      'Initial state — "random" density fill or specific "shapes"? [default random]: ',
    )
  )
    .trim()
    .toLowerCase();

  if (modeAnswer.startsWith('s')) {
    const shapeNames = Object.keys(SHAPES) as ShapeName[];
    const rawAnswers: Partial<Record<ShapeName, string>> = {};

    for (const shapeName of shapeNames) {
      rawAnswers[shapeName] = (
        await rl.question(
          `  ${shapeName} count [blank all four = use defaults]: `,
        )
      ).trim();
    }

    const allBlank = shapeNames.every((name) => rawAnswers[name] === '');

    if (allBlank) {
      return { mode: 'shapes', shapeCounts: DEFAULT_SHAPE_COUNTS };
    }

    const shapeCounts = {} as Record<ShapeName, number>;

    for (const shapeName of shapeNames) {
      const raw = rawAnswers[shapeName]!;

      if (raw === '') {
        shapeCounts[shapeName] = 0;
        continue;
      }

      const parsed = Number(raw);

      if (!Number.isInteger(parsed) || parsed < 0) {
        console.error(
          `"${raw}" is not a non-negative whole number for ${shapeName} — using 0.`,
        );
        shapeCounts[shapeName] = 0;
      } else {
        shapeCounts[shapeName] = parsed;
      }
    }

    return { mode: 'shapes', shapeCounts };
  }

  const densityAnswer = (
    await rl.question(
      'Density — "few", "medium", "dense", or a number 0-100 [default medium]: ',
    )
  )
    .trim()
    .toLowerCase();

  if (densityAnswer === '') {
    return { mode: 'random', density: DENSITY_PRESETS.medium };
  }

  if (isDensityTier(densityAnswer)) {
    return { mode: 'random', density: DENSITY_PRESETS[densityAnswer] };
  }

  const parsedPercent = Number(densityAnswer);

  if (
    Number.isFinite(parsedPercent) &&
    parsedPercent >= 0 &&
    parsedPercent <= 100
  ) {
    return { mode: 'random', density: parsedPercent / 100 };
  }

  console.error(
    `"${densityAnswer}" is not "few", "medium", "dense", or a number 0-100 — using medium.`,
  );

  return { mode: 'random', density: DENSITY_PRESETS.medium };
};

// ---------------------------------------------------------------------------
// 7. Main loop
// ---------------------------------------------------------------------------

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const main = async (): Promise<void> => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  const { rows, cols } = await promptGridSize(rl);
  const initialState = await promptInitialState(rl);

  rl.close();

  process.on('SIGINT', () => {
    showCursor();
    console.log('\nInterrupted — exiting.');
    process.exit(0);
  });

  let current = buildInitialGrid({ rows, cols, initialState });
  let generation = 0;

  const history: Grid[] = [];

  hideCursor();

  try {
    while (true) {
      printFrame(current, generation);

      if (isEmpty(current)) {
        console.log('\nGrid is empty — stopping.');
        break;
      }

      if (history.some((pastGrid) => gridsEqual(current, pastGrid))) {
        console.log('\nPattern repeated — stopping.');
        break;
      }

      history.push(current);
      if (history.length > MAX_HISTORY) {
        history.shift();
      }

      await sleep(FRAME_DELAY_MS);

      current = computeNextGeneration(current);
      generation += 1;
    }
  } finally {
    showCursor();
  }
};

await main();
