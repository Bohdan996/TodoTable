import Button from '@/components/ui/button';
import { 
  EditIcon, 
  TrashIcon 
} from '@/assets/icons';

import './TaskActions.scss';
import Tooltip from '@/components/ui/tooltip';

type TaskActionsProps = {
  setOpenEditForm: (e: React.MouseEvent) => void,
  setOpenDeleteModal: (e: React.MouseEvent) => void,
}

export default function TaskActions({
  setOpenEditForm,
  setOpenDeleteModal
}: TaskActionsProps) {

  return (
    <div className="TaskActions">
      <Tooltip
        content="Edit"
      >
        <Button 
          content={
            <EditIcon />
          } 
          color='secondary'
          size='sm'   
          action={setOpenEditForm}      
        />
      </Tooltip>
  
      <Tooltip
        content="Delete"
      >
        <Button 
          content={
            <TrashIcon />
          }
          color='secondary'
          size='sm'
          action={setOpenDeleteModal}            
        />
      </Tooltip>
    </div>
  )
}

