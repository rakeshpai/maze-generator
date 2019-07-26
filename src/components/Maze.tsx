import React from 'react';
import useMaze from '../hooks/useMaze';
import Cell from './Cell';
import { isCurrent } from '../generator/helpers';

type Props = {
  width?: number,
  height?: number,
  cellWidth?: number,
  cellHeight?: number
};

const Maze: React.FC<Props> = ({
  width = 200,
  height = 200,
  cellWidth = 20,
  cellHeight = 20
}) => {
  const [ maze ] = useMaze({
    width: Math.floor(width / cellWidth),
    height: Math.floor(height / cellHeight),
    timeout: 100, animated: true
  });

  console.log(maze);
  return (
    <svg width={width} height={height}>
      {maze && maze.cells.map(cell => (
        <Cell
          cell={cell}
          isCurrent={isCurrent(cell)(maze)}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          key={`cell-${cell.x}-${cell.y}`}
        />
      ))}
    </svg>
  )
};

export default Maze;
