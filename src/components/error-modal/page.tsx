'use client';
import LocalModal from '../modal/page';

type Props = {
  show: boolean;
  onClose: () => void;
  description?: string;
};

const ErrorModal = ({ show, onClose, description }: Props) => {
  return (
    <LocalModal isOpen={show} onRequestClose={onClose}>
      <div className='font-sm space-y-3 flex flex-col items-center justify-center'>
        <div className='font-semibold text-red-500'>
          Sorry an error occured !
        </div>
        <div>{description}</div>
      </div>
    </LocalModal>
  );
};

export default ErrorModal;
