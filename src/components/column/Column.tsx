import { useEffect, useRef, useState, memo } from 'react';

import ColumnHeader from './columnHeader';
import type { ColumnType } from '@/types/column';
import Button from '../ui/button';
import TaskForm from '../forms/taskForm';
import { useTasksByColumn } from '@/store/boardSelectors';
import type { TaskType } from '@/types/task';
import Task from '../task';
import { useBoardStore } from '@/store/boardStore';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { lightenColor } from '@/utils/colors';

import './Column.scss';

type ColumnProps = {
  item: ColumnType;
}

function Column({ item }: ColumnProps) {
  const [isOpenAddTaskModal, setOpenAddTaskModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<'left' | 'right' | null>(null);

  const tasksList = useTasksByColumn(item?.id);

  const columnRef = useRef<HTMLLIElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const moveTask = useBoardStore((s) => s.moveTask);

  useEffect(() => {
    const el = columnRef.current;
    const dragHandle = headerRef.current;
    const scrollContainer = bodyRef.current;
    
    if (!el || !dragHandle || !scrollContainer) return;

    const cleanups: Array<() => void> = [];

    cleanups.push(
      autoScrollForElements({
        element: scrollContainer,
        canScroll: ({ source }) => {
          return source.data.type === 'task';
        },
      })
    );

    cleanups.push(
      dropTargetForElements({
        element: scrollContainer,
        getData: () => ({
          type: 'column-body',
          columnId: item.id,
        }),
        canDrop: ({ source }) => {
          return source.data.type === 'task';
        },
        onDrop: ({ source }) => {
          if (source.data.type !== 'task') return;
          
          const taskId = source.data.taskId as string;
          const sourceColumnId = source.data.columnId as string;

          if (sourceColumnId === item.id) return;

          moveTask(taskId, sourceColumnId, item.id, item.taskIds.length);
        },
      })
    );

    cleanups.push(
      combine(
        draggable({
          element: el,
          dragHandle,
          getInitialData: () => ({
            type: 'column',
            columnId: item.id,
          }),
          onDragStart: () => setIsDragging(true),
          onDrop: () => setIsDragging(false),
        }),
        dropTargetForElements({
          element: el,
          getData: ({ input, element }) => {
            const data = {
              type: 'column',
              columnId: item.id,
            };

            return attachClosestEdge(data, {
              input,
              element,
              allowedEdges: ['left', 'right'],
            });
          },
          canDrop: ({ source }) => {
            return source.data.type === 'column' && source.data.columnId !== item.id;
          },
          onDragEnter: ({ self }) => {
            const edge = extractClosestEdge(self.data);
            setClosestEdge(edge as 'left' | 'right' | null);
          },
          onDrag: ({ self }) => {
            const edge = extractClosestEdge(self.data);
            setClosestEdge(edge as 'left' | 'right' | null);
          },
          onDragLeave: () => {
            setClosestEdge(null);
          },
          onDrop: () => {
            setClosestEdge(null);
          },
        })
      )
    );

    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, [item.id, item.taskIds.length, moveTask]);

  useEffect(() => {
    if (isOpenAddTaskModal) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      });
    }
  }, [isOpenAddTaskModal]);

  return (
    <li 
      ref={columnRef}
      className="Column"
      style={{ 
        border: `1.5px solid ${item.color}`,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: lightenColor(item.color),
      }}
    >
      {closestEdge && <DropIndicator edge={closestEdge} gap="0px" />}
      
      <div ref={headerRef} style={{ cursor: 'grab' }}>
        <ColumnHeader 
          title={item.title}
          color={item.color}
          columnId={item.id}
        />
      </div>

      <div 
        className="Column__body" 
        ref={bodyRef}
      >
        <ul className="Column__tasks">
          {tasksList?.map((task: TaskType) => (
            <Task 
              key={task?.id} 
              item={task} 
              columnId={item.id}
            />
          ))}
        </ul>

        {isOpenAddTaskModal && 
          <TaskForm 
            type="create"
            closeAction={() => setOpenAddTaskModal(false)}
            columnId={item?.id}
          />}
        
        <Button 
          content="+ Add Task"
          color="secondary"
          variant="transparent"
          action={() => setOpenAddTaskModal(true)}
          fullWidth
        />

        <div ref={bottomRef}/>
      </div>
    </li>
  )
}

export default Column;