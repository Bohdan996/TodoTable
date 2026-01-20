import Button from '@/components/ui/button';
import Dropdown from '@/components/ui/dropdown';

type BoardMobileActionsProps = {
  completeSelected: () => void;
  incompleteSelected: () => void;
  setOpenNewColumnModal: () => void;
  setOpenDeleteModal: () => void;
}

export default function BoardMobileActions({
  completeSelected,
  incompleteSelected,
  setOpenNewColumnModal,
  setOpenDeleteModal,
}: BoardMobileActionsProps) {

  return (
    <Dropdown 
      variant="outline" 
      color="primary"
      size="md"
    >
      <Button 
        content="Complete"
        variant="transparent"
        color="secondary"
        size="sm"
        action={completeSelected}
        contentPosition="left"
      />
  
      <Button 
        content="Incomplete"
        variant="transparent"
        color="secondary"
        size="sm"
        action={incompleteSelected}
        contentPosition="left"
      />
  
      <Button 
        content="Move to column"
        variant="transparent"
        color="secondary"
        size="sm"
        action={setOpenNewColumnModal}
        contentPosition="left"
      />
  
      <Button 
        content="Delete"
        variant="transparent"
        color="secondary"
        size="sm"
        action={setOpenDeleteModal}
        contentPosition="left"
      />
    </Dropdown>
  )
}
