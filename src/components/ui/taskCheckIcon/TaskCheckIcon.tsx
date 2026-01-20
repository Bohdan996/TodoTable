import type { MouseEvent } from "react";
import clsx from 'clsx';

import { CheckIcon } from '@/assets/icons';
import { useBoardStore } from '@/store/boardStore';
import Tooltip from "../tooltip";

import './TaskCheckIcon.scss';

type TaskCheckIconProps = {
  id: string,
  completed: boolean
}

export default function TaskCheckIcon({
  id,
  completed
}: TaskCheckIconProps) {
  const updateTask = useBoardStore((s) => s.updateTask);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    updateTask({
      id,
      completed: !completed
    });
  }

  return (
    <Tooltip
      content={completed
        ? "Incomplete"
        : "Complete"
      }
    >
      <button 
        className={clsx("TaskCheckIcon", {
          "TaskCheckIcon--completed": completed
        })}
        onClick={onClick}
      >
        <CheckIcon />
      </button>
    </Tooltip>
  )
}
