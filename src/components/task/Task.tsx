import { useState } from 'react';
import clsx from 'clsx';

import TaskForm from '../forms/taskForm';
import { useBoardStore } from '@/store/boardStore';
import type { TaskType } from '@/types/task';
import Button from '../ui/button';
import Modal from '../ui/modal';
import { CheckIcon, EditIcon, TrashIcon } from '@/assets/icons';

import './Task.scss';

type TaskProps = {
  item: TaskType
}

export default function Task({item}: TaskProps) {
  const { id, title, columnId } = item;
  const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);

  const fullRemoveTask = useBoardStore((s) => s.fullRemoveTask);
    
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
            taskId: id,
            title
          }}
          closeAction={() => setOpenEditForm(false)}
          columnId={item?.id}
        />
      ) : (
        <li
          className={clsx("Task", {
            "Task--selected": false
          })}
        >
          <div className="Task__header">
            <div>1</div>

            <div className="Task__actions">
              <Button 
                content={
                  <CheckIcon />
                } 
                color='secondary'
                size='sm'         
              />
              
              <Button 
                content={
                  <EditIcon />
                } 
                color='secondary'
                size='sm'   
                action={() => setOpenEditForm(true)}      
              />

              <Button 
                content={
                  <TrashIcon />
                }
                color='secondary'
                size='sm'
                action={() => setOpenDeleteModal(true)}            
              />
            </div>
          </div>

          <p className="Task__name">{item?.title}</p>
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
