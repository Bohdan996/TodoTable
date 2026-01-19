import Button from '../button';
import './Modal.scss';

type ModalProps = {
  title: string;
  description?: string;
  form?: React.ReactNode;
  closeAction: () => void;
  action?: () => void;
  actionBtnText?: string;
};

export default function Modal({ 
  title, 
  description,
  form,
  closeAction, 
  action,
  actionBtnText
}: ModalProps) {
  return (
    <div className="Modal">
      <div className="Modal__overlay" onClick={closeAction} />
      <div className="Modal__container">
        <h2 className="Modal__title">{title}</h2>
        {description && <p className="Modal__desk">
          {description}
        </p>}
        {form}
        <div className="Modal__btns">
          <Button 
            content={
              action || form
              ? "Cancel"
              : "Got it"
            }
            action={closeAction}
            variant="outline"
            color="primary"
            size="md"
            fullWidth={!action}
          />
          {action && 
            <Button 
              content={actionBtnText}
              action={action}
              variant="fill"
              color={actionBtnText === "Delete" 
                ? "danger"
                : "primary"}
              size="md"
            />
          }
        </div>
      </div>
    </div>
  )
}
