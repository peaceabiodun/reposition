'use client';

import LocalModal from '../modal/page';

type Props = {
  show: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
};
const SuccessModal = ({ show, onClose, title, description }: Props) => {
  return (
    <LocalModal isOpen={show} onRequestClose={onClose}>
      <div className='font-sm space-y-3 flex flex-col items-center justify-center'>
        <div className='font-semibold text-green-400'>{title}</div>
        <div>{description}</div>
      </div>
    </LocalModal>
  );
};

export default SuccessModal;
