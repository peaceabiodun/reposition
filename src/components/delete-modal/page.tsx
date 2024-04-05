'use client';

import { ProductDetailType } from '@/utils/types';
import LocalModal from '../modal/page';

type DeleteModalProps = {
  show: boolean;
  onClose: () => void;
  selectedProduct: ProductDetailType | undefined;
  onButtonClick: () => void;
  loading?: boolean;
};
const DeleteModal = ({
  show,
  onClose,
  selectedProduct,
  onButtonClick,
  loading,
}: DeleteModalProps) => {
  return (
    <LocalModal isOpen={show} onRequestClose={onClose}>
      <div className='flex flex-col items-center justify-center text-sm '>
        <h3 className='font-semibold text-[#7c4b2f]'>
          Are you sure you want to delete {selectedProduct?.name} ?
        </h3>
        <p className='text-red-500 my-3'>This action cannot be reversed</p>
        <button
          onClick={onButtonClick}
          className='border bg-[#523f3fa4] text-[#f0efef] p-2 mt-2 text-sm w-[150px] h-[40px] hover:bg-[#7e5d5dab] '
        >
          {loading ? 'Loading...' : 'Delete'}
        </button>
      </div>
    </LocalModal>
  );
};

export default DeleteModal;
