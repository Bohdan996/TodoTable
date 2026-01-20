import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import TaskForm from '../forms/taskForm';
import { useBoardStore } from '@/store/boardStore';
import type { TaskType } from '@/types/task';
import Modal from '../ui/modal';
import TaskCheckIcon from '../ui/taskCheckIcon';
import TaskActions from './taskActions';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { highlightText } from '@/utils/texts';

import './Task.scss';

type TaskProps = {
  item: TaskType;
  columnId: string;
}

export default function Task({ item, columnId }: TaskProps) {
  const { id, title, completed } = item;
  const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<'top' | 'bottom' | null>(null);

  const searchQuery = useBoardStore((s) => s.searchQuery);
  const selectedTaskIds = useBoardStore((s) => s.selectedTaskIds);
  const fullRemoveTask = useBoardStore((s) => s.fullRemoveTask);
  const changeTaskSelectStatus = useBoardStore((s) => s.changeTaskSelectStatus);
  const moveTask = useBoardStore((s) => s.moveTask);
  const reorderTasksInColumn = useBoardStore((s) => s.reorderTasksInColumn);

  const taskRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const el = taskRef.current;
    if (!el || openEditForm) return;

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({
          type: 'task',
          taskId: id,
          columnId,
        }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: el,
        getData: ({ input, element }) => {
          const data = {
            type: 'task',
            taskId: id,
            columnId,
          };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        canDrop: ({ source }) => {
          return source.data.type === 'task' && source.data.taskId !== id;
        },
        onDragEnter: ({ self }) => {
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge as 'top' | 'bottom' | null);
        },
        onDrag: ({ self }) => {
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge as 'top' | 'bottom' | null);
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: ({ source, self }) => {
          setClosestEdge(null);

          const sourceData = source.data;
          const selfData = self.data;

          if (sourceData.type !== 'task') return;

          const sourceTaskId = sourceData.taskId as string;
          const sourceColumnId = sourceData.columnId as string;
          const targetTaskId = selfData.taskId as string;

          const state = useBoardStore.getState();
          const targetColumn = state.columns.find((c) => c.id === columnId);
          
          if (!targetColumn) return;

          const edge = extractClosestEdge(selfData);

          if (sourceColumnId === columnId) {
            const sourceIndex = targetColumn.taskIds.indexOf(sourceTaskId);
            const targetIndex = targetColumn.taskIds.indexOf(targetTaskId);

            if (sourceIndex === -1 || targetIndex === -1) return;

            let finalDestinationIndex = edge === 'bottom' 
              ? targetIndex + 1 
              : targetIndex;

            if (sourceIndex < finalDestinationIndex) {
              finalDestinationIndex = finalDestinationIndex - 1;
            }

            if (sourceIndex === finalDestinationIndex) return;
            
            reorderTasksInColumn(columnId, sourceIndex, finalDestinationIndex);
          } else {

            const targetIndex = targetColumn.taskIds.indexOf(targetTaskId);
            if (targetIndex === -1) return;

            const finalDestinationIndex = edge === 'bottom' 
              ? targetIndex + 1 
              : targetIndex;
            
            moveTask(sourceTaskId, sourceColumnId, columnId, finalDestinationIndex);
          }
        },
      })
    );
  }, [id, columnId, moveTask, reorderTasksInColumn, openEditForm]);

  const removeTask = () => {
    fullRemoveTask(columnId, id);
    setOpenDeleteModal(false);
  }

  return (
    <>
      {openEditForm ? (
        <TaskForm 
          type="edit"
          defaultValues={{
            id,
            title
          }}
          closeAction={() => setOpenEditForm(false)}
          columnId={item?.id}
        />
      ) : (
        <li
          ref={taskRef}
          className={clsx("Task", {
            "Task--selected": selectedTaskIds?.includes(id)
          })}
          style={{
            opacity: isDragging ? 0.5 : 1,
            position: 'relative',
          }}
          onClick={() => changeTaskSelectStatus(id)}
        >
          {closestEdge && <DropIndicator edge={closestEdge} gap="0px" />}
          
          <div className="Task__header">
            <TaskCheckIcon 
              id={id}
              completed={completed}
            />

            <TaskActions
              setOpenEditForm={(e: React.MouseEvent) => {
                e.stopPropagation();
                setOpenEditForm(true);
              }}
              setOpenDeleteModal={(e: React.MouseEvent) => {
                e.stopPropagation();
                setOpenDeleteModal(true);
              }}
            />
          </div>

          <p className={clsx("Task__name", {
            "Task__name--complete": completed
          })}>
            {highlightText(item?.title, searchQuery)}
          </p>
        </li>
      )}
      {isOpenDeleteModal && 
        <Modal
          title="Delete Task?"
          description="This action cannot be undone."
          closeAction={() => setOpenDeleteModal(false)}
          action={removeTask}
          actionBtnText="Delete"
        />
      }
    </>
  )
}