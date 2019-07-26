import { Lens } from 'monocle-ts';
import { Cell, Maze, locations, Location, CellWithLocation } from './types';

// Local helpers
const range = (max: number) =>
  (new Array(max)).fill(0).map((unused, index) => index);

const populateList = <T>(
  width: number, height: number, populator: (x: number, y: number) => T
): T[] => range(width).reduce<T[]>(
  (acc, x) => acc.concat(range(height).map(y => populator(x, y))),
  []
);

const inc = (x: number) => x + 1;
const dec = (x: number) => x - 1;
const id = <T>(x: T) => x;

export const pickRandomlyFromList = <T>(list: T[]) =>
  list[Math.floor(Math.random() * list.length)];

export const oppositeLocation = (location: Location) =>
  locations[(locations.indexOf(location) + 2) % locations.length];

const neighboursDefinition: [Location, (x: number) => number, (y: number) => number][] = [
  ['top', dec, id],
  ['left', id, dec],
  ['right', id, inc],
  ['bottom', inc, id]
];

const matchingCell = (x: number, y: number) => (cell: Cell) =>
  cell.x === x && cell.y === y;

// Lenses
const wallLens = (location: Location) => Lens.fromPath<Cell>()(['walls', location]);

const wallLenses: { [key in Location]: Lens<Cell, boolean> } = {
  top: wallLens('top'),
  right: wallLens('right'),
  bottom: wallLens('bottom'),
  left: wallLens('left')
}

const cellLens = (x: number, y: number) => new Lens<Maze, Cell>(
  maze => maze.cells.find(matchingCell(x, y))!,
  cell => maze => ({
    ...maze,
    cells: maze.cells.map(c => matchingCell(x, y)(c) ? cell : c)
  })
);

const currentCellLens = Lens.fromProp<Maze>()('currentCell');
const visitedLens = Lens.fromProp<Cell>()('visited');

// Maze helpers
export const initializeMaze = (width: number, height: number): Maze => {
  const cells = populateList(width, height, (x, y): Cell => ({
    x, y,
    walls: { top: true, right: true, bottom: true, left: true},
    visited: false
  }));

  return {
    width, height, cells,
    stack: [], currentCell: [ cells[0].x, cells[0].y ]
  };
};

export const hasUnvisitedCells = (maze: Maze) =>
  maze.cells.some(cell => !cell.visited);

export const pushCurrentCellToStack = (maze: Maze) =>
  ({ ...maze, stack: [ maze.currentCell, ...maze.stack ]})
  
export const popFromStackToCurrentCell = (maze: Maze) =>
  ({ ...maze, stack: maze.stack.slice(1), currentCell: maze.stack[0] });

const cellAt = (maze: Maze, x: number, y: number) => {
  if(x < 0 || x > maze.height - 1 || y < 0 || y > maze.width - 1) {
    return undefined;
  }

  return maze.cells[ (maze.width * x) + y ];
};

export const setCurrentCell = (x: number, y: number) =>
  currentCellLens.set([x, y]);

export const markCellAsVisited = (x: number, y: number) =>
  cellLens(x, y).compose(visitedLens).set(true);

const neighboursOfCurrentCell = (maze: Maze) =>
  neighboursDefinition.reduce<CellWithLocation[]>(
    (acc, [location, xOp, yOp]) => {
      const cell = cellAt(maze, xOp(maze.currentCell[0]), yOp(maze.currentCell[1]));
      if(!cell) return acc;

      return acc.concat({ ...cell, location })
    },
    []
  );

export const unvisitedNeighboursForCurrentCell = (maze: Maze) =>
  neighboursOfCurrentCell(maze)
    .filter((cell: CellWithLocation) => !cell.visited);

const removeCellWall = (cell: Cell, location: Location) =>
  cellLens(cell.x, cell.y).compose(wallLenses[location]).set(false);

export const removeWallBetweenCurrentCellAnd = (cell: CellWithLocation) => (maze: Maze): Maze => {
  const currentCell = cellLens(...maze.currentCell).get(maze);

  const tempMaze = removeCellWall(currentCell, cell.location)(maze);
  return removeCellWall(cell, oppositeLocation(cell.location))(tempMaze);
};

export const isCurrent = (cell: Cell) => (maze: Maze) => {
  const [x, y] = currentCellLens.get(maze)
  return cell.x === x && cell.y === y;
};
