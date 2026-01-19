import ColumnForm from '@/components/forms/columnForm';
import Modal from '../modal';
import type { ColumnFormValues } from '@/types/column';

import './ColumnFormModal.scss';

type ColumnFormModalProps = {
  type: "create" | "edit",
  defaultValues?: ColumnFormValues;
  closeAction: () => void;
}

export default function ColumnFormModal({
  type,
  defaultValues,
  closeAction
}: ColumnFormModalProps) {
  return (
    <Modal 
      title={type === "create"
        ? "Crete new column"
        : "Edit column"}
      closeAction={closeAction}
      form={<ColumnForm 
        type={type}
        defaultValues={defaultValues}
        closeAction={closeAction}
      />}
    />
  )
}
