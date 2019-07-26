import { useState, useEffect } from "react";
import { generateMazeStream } from "../generator";
import { Maze } from "../generator/types";

type MazeOptions = {
  width: number,
  height: number,
  animated: boolean,
  timeout: number
};

const useMaze = ({
  width, height,
  animated, timeout
} : MazeOptions) => {
  const [ maze, setMaze ] = useState<Maze | undefined>(undefined);
  useEffect(() => {
    return generateMazeStream({
      width, height, timeout,
      callback: m => setMaze(m)
    });
  }, [width, height, animated, timeout]);

  return [ maze ];
};

export default useMaze;