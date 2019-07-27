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
} : MazeOptions): [ Maze | undefined, boolean ] => {
  const [ maze, setMaze ] = useState<Maze | undefined>(undefined);
  const [ done, setDone ] = useState(false);

  useEffect(() => {
    return generateMazeStream({
      width, height, timeout,
      callback: (m, d) => {
        setMaze(m);
        setDone(d);
      }
    });
  }, [width, height, animated, timeout]);

  return [ maze, done ];
};

export default useMaze;