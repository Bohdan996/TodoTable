import { useEffect, useRef } from 'react';

import type { ColumnType } from '@/types/column';
import BoardHeader from './boardHeader';
import { useColumns } from '@/store/boardSelectors';
import Column from '../column';

import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { useBoardStore } from '@/store/boardStore';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

import './Board.scss';

export default function Board() {
  const columns = useColumns();
  const reorderColumn = useBoardStore((s) => s.reorderColumn);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const boardElement = boardRef.current;
    if (!boardElement) return;

    const cleanupAutoScroll = autoScrollForElements({
      element: boardElement,
      canScroll: ({ source }) => {
        return source.data.type === 'task' || source.data.type === 'column';
      },
    });

    const cleanupMonitor = monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = source.data;
        const targetData = target.data;

        if (
          sourceData.type === 'column' &&
          targetData.type === 'column'
        ) {
          const state = useBoardStore.getState();
          
          const sourceIndex = state.columns.findIndex(
            (col) => col.id === sourceData.columnId
          );
          const targetIndex = state.columns.findIndex(
            (col) => col.id === targetData.columnId
          );

          if (sourceIndex === -1 || targetIndex === -1) return;

          const closestEdge = extractClosestEdge(targetData);
          const destinationIndex =
            closestEdge === 'left' ? targetIndex : targetIndex + 1;

          reorderColumn(sourceIndex, destinationIndex);
        }
      },
    });

    return () => {
      cleanupAutoScroll();
      cleanupMonitor();
    };
  }, [columns, reorderColumn]);

  return (
    <div className="Board">
      <BoardHeader />
      <div 
        ref={boardRef} 
        className="Board__content"
      >
        <ul className="Board__list">
          {columns.map((column: ColumnType) => (
            <Column key={column.id} item={column} />
          ))}
        </ul>
      </div>
    </div>
  );
}