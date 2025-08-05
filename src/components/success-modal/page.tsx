'use client';

import LocalModal from '../modal/page';

type Props = {
  show: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonClick?: () => void;
};
const SuccessModal = ({
  show,
  onClose,
  title,
  description,
  buttonText,
  buttonClick,
}: Props) => {
  return (
    <LocalModal isOpen={show} onRequestClose={onClose}>
      <div className='font-sm space-y-3 flex flex-col items-center justify-center'>
        <div className='font-semibold text-[#7c4b2f]'>{title}</div>
        <div>{description}</div>
        {buttonText && buttonClick && (
          <button
            className='border border-[#38271c] text-[#38271c] p-2 text-sm w-[150px] h-[40px] hover:bg-[#7e5d5d54] rounded-[4px] '
            onClick={buttonClick}
          >
            {buttonText}
          </button>
        )}
      </div>
    </LocalModal>
  );
};

export default SuccessModal;
