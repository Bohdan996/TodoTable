import { useForm } from "react-hook-form";

import { useColumns } from "@/store/boardSelectors";
import { useBoardStore } from "@/store/boardStore";
import Button from "@/components/ui/button";

import "./NewColumnForm.scss";
import Selector from "@/components/ui/selector";

type NewColumnFormType = {
  closeAction: () => void;
};

export default function NewColumnForm({
  closeAction,
}: NewColumnFormType) {
  const columns = useColumns();
  const moveSelectedTasksToColumn = useBoardStore(
    (state) => state.moveSelectedTasksToColumn
  );

  const { handleSubmit, control } = useForm({
    defaultValues: { targetColumnId: columns[0]?.id ?? "" },
  });

  const onSubmit = (data: { targetColumnId: string }) => {
    moveSelectedTasksToColumn(data.targetColumnId);
    closeAction();
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="NewColumnForm"
    >
      <Selector
        name="targetColumnId"
        control={control}
        options={columns.map((c) => ({ id: c.id, label: c.title }))}
      />

      <Button
        content="Save"
        type="submit"
        variant="fill"
        color="primary"
        fullWidth
      />
    </form>
  );
}

