import React from 'react';
import { Cell as CellType, locations } from '../generator/types';

type CellProps = {
  cell: CellType,
  cellWidth: number,
  cellHeight: number,
  isCurrent: boolean
};

const x = (cell: CellType) => cell.x;
const y = (cell: CellType) => cell.y;
const incx = (cell: CellType) => cell.x + 1;
const incy = (cell: CellType) => cell.y + 1;

const cellCoords = {
  top: { x1: x, y1: y, x2: incx, y2: y },
  right: { x1: incx, y1: y, x2: incx, y2: incy },
  bottom: { x1: x, y1: incy, x2: incx, y2: incy },
  left: { x1: x, y1: y, x2: x, y2: incy }
};

const cellLines = ({ cell, cellWidth, cellHeight }: CellProps) =>
  locations
    .filter(location => cell.walls[location])
    .map(location =>
      Object.entries(cellCoords[location])
        .reduce(
          (acc, [key, fn]) => ({
            ...acc,
            [key]: fn(cell) * (key.startsWith('x') ? cellWidth : cellHeight)
          }),
          { key: location, ['data-direction']: location }
        )
    )
    .map(coords => (
      <line
        {...coords}
        stroke="black"
        strokeWidth="1"
      />
    ));

const Cell: React.FC<CellProps> = props => (
  <g>
    {!props.cell.visited && (
      <rect
        x={props.cell.x * props.cellWidth}
        y={props.cell.y * props.cellHeight}
        width={props.cellWidth}
        height={props.cellHeight}
        fill={props.isCurrent ? 'red' : '#eee'}
      />
    )}

    {props.isCurrent && (
      <rect
        x={props.cell.x * props.cellWidth}
        y={props.cell.y * props.cellHeight}
        width={props.cellWidth}
        height={props.cellHeight}
        fill='red'
      />
    )}
    {cellLines(props)}
  </g>
);

export default Cell;