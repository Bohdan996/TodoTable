import NewColumnForm from '@/components/forms/newColumnForm';
import Modal from '../modal';

type NewColumnModalProps = {
  closeAction: () => void;
}

export default function NewColumnModal({ closeAction }: NewColumnModalProps) {
  return (
    <Modal 
      title="Select new column" 
      closeAction={closeAction}
      form={<NewColumnForm 
        closeAction={closeAction}
      />}
    />
  )
}
