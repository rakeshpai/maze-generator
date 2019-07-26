import { Maze } from "./types";
import { unvisitedNeighboursForCurrentCell, pickRandomlyFromList, pushCurrentCellToStack, removeWallBetweenCurrentCellAnd, setCurrentCell, markCellAsVisited, popFromStackToCurrentCell, initializeMaze, hasUnvisitedCells } from "./helpers";

type MazeDimensions = { width: number, height: number };
type MazeStreamArguments = MazeDimensions & {
  timeout: number,
  callback: (maze: Maze, done: boolean) => void
};

const makeMazePass = (maze: Maze) => {
  const neighbours = unvisitedNeighboursForCurrentCell(maze);
  
  if(neighbours.length) {
    const randomNeighbour = pickRandomlyFromList(neighbours);
    const m1 = pushCurrentCellToStack(maze);
    const m2 = removeWallBetweenCurrentCellAnd(randomNeighbour)(m1);
    const m3 = setCurrentCell(randomNeighbour.x, randomNeighbour.y)(m2);
    return markCellAsVisited(randomNeighbour.x, randomNeighbour.y)(m3);
  }

  if(maze.stack.length) {
    return popFromStackToCurrentCell(maze);
  }

  return maze;
}

export const generateMaze = ({ width, height }: MazeDimensions) => {
  let maze = initializeMaze(width, height);
  while(hasUnvisitedCells(maze)) {
    maze = makeMazePass(maze);
  }

  return maze;
};

export const generateMazeStream = ({ width, height, timeout, callback }: MazeStreamArguments) => {
  let maze = initializeMaze(width, height);
  callback(maze, hasUnvisitedCells(maze));

  const interval = setInterval(() => {
    if(hasUnvisitedCells(maze)) {
      maze = makeMazePass(maze);
      callback(maze, hasUnvisitedCells(maze));
    } else {
      clearInterval(interval);
    }
  }, timeout);

  return () => clearInterval(interval);
};
