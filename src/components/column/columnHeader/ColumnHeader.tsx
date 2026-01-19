import { useState } from 'react';
import Dropdown from '@/components/ui/dropdown';
import Button from '@/components/ui/button';
import { EditIcon, TrashIcon } from '@/assets/icons';
import Modal from '@/components/ui/modal';
import { useBoardStore } from '@/store/boardStore';
import ColumnFormModal from '@/components/ui/columnFormModal';

import './ColumnHeader.scss';

type ColumnHeaderProps = {
  title: string;
  color: string;
  columnId: string;
  tasksCount: number;
}

export default function ColumnHeader({ title, color, columnId, tasksCount }: ColumnHeaderProps) {
  const [isOpenDeleteModal, setDeleteModal] = useState(false);
  const [editColumnId, setEditColumnId] = useState("");

  const deleteColumnWithTasks = useBoardStore((s) => s.deleteColumnWithTasks);
  
  const deleteColumn = () => {
    deleteColumnWithTasks(columnId);
    setDeleteModal(false);
  }

  return (
    <div className="ColumnHeader">
      <div className="ColumnHeader__info">
        <h2 
          className="ColumnHeader__title"
          style={{ backgroundColor: color }}
        >
          {title}
        </h2>

        <p className="ColumnHeader__tasks-count">{tasksCount}</p>
      </div>

      <Dropdown>
        <Button
          content={<>
            <EditIcon />
            Select all
          </>}
          size='sm'
          color='secondary'
          variant='transparent'
          contentPosition="left"
          fullWidth
        />

        <Button
          content={<>
            <EditIcon />
            Edit
          </>}
          action={() => setEditColumnId(columnId)}
          size='sm'
          color='secondary'
          variant='transparent'
          contentPosition="left"
          fullWidth
        />

        <Button
          content={<>
            <TrashIcon />
            Delete
          </>}
          action={() => setDeleteModal(true)}
          size='sm'
          color='secondary'
          contentPosition="left"
          variant='transparent'
          fullWidth
        />
      </Dropdown>
      {isOpenDeleteModal && 
        <Modal
          title="Delete column?"
          description="All tasks inside it will be permanently removed."
          closeAction={() => setDeleteModal(false)}
          action={deleteColumn}
          actionBtnText="Delete"
        />
      }
      {editColumnId && 
        <ColumnFormModal 
          type="edit"
          defaultValues={{
            columnId,
            title,
            color
          }}
          closeAction={() => setEditColumnId("")}
        />
      }
    </div>
  )
}
