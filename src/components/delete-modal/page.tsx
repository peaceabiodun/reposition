'use client';

import LocalModal from '../modal/page';

type DeleteModalProps = {
  show: boolean;
  onClose: () => void;
};
const DeleteModal = ({ show, onClose }: DeleteModalProps) => {
  return (
    <LocalModal isOpen={show} onRequestClose={onClose}>
      <div className='flex flex-col items-center justify-center text-sm '>
        <h3 className='font-semibold'>
          Are you sure you want to delete Reposition White Jacket ?
        </h3>
        <p className='text-red-500 my-3'>This action cannot be reversed</p>
        <button className='border border-[#3d3e3f] p-2 mt-2 text-sm w-[150px] h-[40px] hover:bg-[#d3d6d6] '>
          Delete
        </button>
      </div>
    </LocalModal>
  );
};

export default DeleteModal;
