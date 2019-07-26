export const locations = ['top', 'right', 'bottom', 'left'] as const;
export type Location = typeof locations[number];

export type Cell = {
  x: number,
  y: number,
  walls: { [key in Location]: boolean },
  visited: boolean
};

export type CellCoords = [number, number];

export type Maze = {
  width: number,
  height: number,
  cells: Cell[],
  stack: CellCoords[],
  currentCell: CellCoords
};

export type CellWithLocation = Cell & { location: Location };
