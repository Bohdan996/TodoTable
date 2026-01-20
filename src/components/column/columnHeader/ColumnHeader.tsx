import { useState } from 'react';
import Dropdown from '@/components/ui/dropdown';
import Button from '@/components/ui/button';
import { 
  CompleteIcon,
  EditIcon, 
  IncompleteIcon, 
  SelectAllIcon, 
  TrashIcon 
} from '@/assets/icons';
import Modal from '@/components/ui/modal';
import { useBoardStore } from '@/store/boardStore';
import ColumnFormModal from '@/components/ui/columnFormModal';
import Tooltip from '@/components/ui/tooltip';
import { getContrastTextColor } from '@/utils/colors';
import { textTrimmer } from '@/utils/texts';

import './ColumnHeader.scss';

type ColumnHeaderProps = {
  title: string;
  color: string;
  columnId: string;
}

export default function ColumnHeader({ title, color, columnId }: ColumnHeaderProps) {
  const [isOpenDeleteModal, setDeleteModal] = useState(false);
  const [editColumnId, setEditColumnId] = useState("");

  const deleteColumnWithTasks = useBoardStore((s) => s.deleteColumnWithTasks);
  const selectAllTasksInColumn = useBoardStore((s) => s.selectAllTasksInColumn);
  const setColumnTaskFilter = useBoardStore((s) => s.setColumnTaskFilter);
  const columnTaskFilters = useBoardStore((s) => s.columnTaskFilters);
  
  const currentFilter = columnTaskFilters[columnId] || "all";

  const deleteColumn = () => {
    deleteColumnWithTasks(columnId);
    setDeleteModal(false);
  }

  const handleFilterToggle = (filterType: "completed" | "incompleted") => {
    if (currentFilter === filterType) {
      setColumnTaskFilter(columnId, "all");
    } else {
      setColumnTaskFilter(columnId, filterType);
    }
  }

  return (
    <div className="ColumnHeader">
      <div className="ColumnHeader__info">
        <Tooltip
          content={title}
          dontShow={title?.length < 20}
        >
          <h2 
            className="ColumnHeader__title"
            style={{ 
              backgroundColor: color,
              color: getContrastTextColor(color)
            }}
          >
            {textTrimmer(title)}
          </h2>
        </Tooltip>
      </div>

      <Dropdown>
        <Button
          content={<>
            <SelectAllIcon />
            Select all
          </>}
          size='sm'
          color='secondary'
          variant='transparent'
          contentPosition="left"
          fullWidth
          action={() => selectAllTasksInColumn(columnId)}
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
            <CompleteIcon />
            Show completed
          </>}
          action={() => handleFilterToggle("completed")}
          size='sm'
          color='secondary'
          variant='transparent'
          contentPosition="left"
          fullWidth
          activeState={currentFilter === "completed"}
        />

        <Button
          content={<>
            <IncompleteIcon />
            Show incompleted
          </>}
          action={() => handleFilterToggle("incompleted")}
          size='sm'
          color='secondary'
          variant='transparent'
          contentPosition="left"
          fullWidth
          activeState={currentFilter === "incompleted"}
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