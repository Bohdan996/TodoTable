import { useState } from 'react';

import ColumnHeader from './columnHeader';
import type { ColumnType } from '@/types/column';
import Button from '../ui/button';
import PlusIcon from '@/assets/icons/PlusIcon';
import TaskForm from '../forms/taskForm';
import { useTasksByColumn } from '@/store/boardSelectors';
import type { TaskType } from '@/types/task';
import Task from '../task';

import './Column.scss';

type ColumnProps = {
  item: ColumnType;
}

export default function Column({ item }: ColumnProps) {
  const [isOpenAddTaskModal, setOpenAddTaskModal] = useState(false);

  const tasksList = useTasksByColumn(item?.id);

  return (
    <li 
      className="Column"
      style={{ border: `1.5px solid ${item.color}`}}
    >
      <ColumnHeader 
        title={item.title}
        color={item.color}
        columnId={item.id}
        tasksCount={tasksList?.length}
      />

      <div className="Column__body">
        <ul className="Column__tasks">
          {tasksList?.map((task: TaskType) => (
            <Task key={task?.id} item={task}/>
          ))}
        </ul>

        {isOpenAddTaskModal && 
          <TaskForm 
            type="create"
            closeAction={() => setOpenAddTaskModal(false)}
            columnId={item?.id}
          />}
        
        <Button 
          content={
            <>
              <PlusIcon />
              Add Task
            </>
          }
          color="secondary"
          variant="transparent"
          action={() => setOpenAddTaskModal(true)}
          fullWidth
        />
      </div>
    </li>
  )
}
