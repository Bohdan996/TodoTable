import Button from "@/components/ui/button";

type BoardDesctopActionsType = {
  completeSelected: () => void;
  incompleteSelected: () => void;
  setOpenNewColumnModal: () => void;
  setOpenDeleteModal: () => void;
}

export default function BoardDesctopActions({
  completeSelected,
  incompleteSelected,
  setOpenNewColumnModal,
  setOpenDeleteModal,
}: BoardDesctopActionsType) {
  return (
    <>
      <Button 
        content="Complete"
        variant="outline"
        color="primary"
        size="md"
        action={completeSelected}
      />
    
      <Button 
        content="Incomplete"
        variant="outline"
        color="primary"
        size="md"
        action={incompleteSelected}
      />
    
      <Button 
        content="Move to column"
        variant="outline"
        color="primary"
        size="md"
        action={setOpenNewColumnModal}
      />
    
      <Button 
        content="Delete"
        variant="outline"
        color="primary"
        size="md"
        action={setOpenDeleteModal}
      />
    </>
  )
}
