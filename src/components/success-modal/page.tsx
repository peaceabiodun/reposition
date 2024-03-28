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
        <div className='font-semibold text-green-400'>{title}</div>
        <div>{description}</div>
        {buttonText ||
          (buttonClick && (
            <button
              className='border border-[#3d3e3f] p-2 text-sm w-full h-[40px]'
              onClick={buttonClick}
            >
              {buttonText}
            </button>
          ))}
      </div>
    </LocalModal>
  );
};

export default SuccessModal;
