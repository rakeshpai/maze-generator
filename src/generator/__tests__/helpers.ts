import { initializeMaze, oppositeLocation, unvisitedNeighboursForCurrentCell, setCurrentCell, markCellAsVisited, removeWallBetweenCurrentCellAnd } from "../helpers";

it('should create a starting maze', () => {
  const maze = initializeMaze(10, 10);
  
  expect(maze.cells.length).toBe(100);
  expect(maze.width).toBe(10);
  expect(maze.height).toBe(10);
  expect(maze.currentCell[0]).toBe(0);
  expect(maze.currentCell[1]).toBe(0);
  expect(maze.stack).toEqual([]);

  for(let i = 0; i<10; i++) {
    for(let j=0; j<10; j++) {
      const cell = maze.cells[ (i * 10) + j ];
      expect(cell.x).toBe(i);
      expect(cell.y).toBe(j);
    }
  }
});

it('should return the opposite location', () => {
  expect(oppositeLocation('top')).toBe('bottom');
  expect(oppositeLocation('right')).toBe('left');
  expect(oppositeLocation('bottom')).toBe('top');
  expect(oppositeLocation('left')).toBe('right');
});

it('should return unvisited neighbours', () => {
  const maze1 = initializeMaze(10, 10);
  expect(unvisitedNeighboursForCurrentCell(maze1)).toMatchSnapshot();

  const maze2 = setCurrentCell(5, 5)(maze1);
  expect(unvisitedNeighboursForCurrentCell(maze2)).toMatchSnapshot();

  const maze3 = setCurrentCell(4, 5)(markCellAsVisited(5, 5)(maze2));
  expect(unvisitedNeighboursForCurrentCell(maze3)).toMatchSnapshot();
});

it('should remove cell walls', () => {
  const maze1 = initializeMaze(10, 10);
  const rightCell = unvisitedNeighboursForCurrentCell(maze1)
    .find(c => c.location === 'right');
  
  const maze2 = removeWallBetweenCurrentCellAnd(rightCell!)(maze1);

  expect(maze2.cells[0].walls.right).toBe(false);
  expect(maze2.cells[1].walls.left).toBe(false);
});