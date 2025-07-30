/* eslint-disable @next/next/no-img-element */
'use client';

import { STORAGE_KEYS } from '@/utils/constants';
import LocalModal from '../modal/page';

type ModalProps = {
  show: boolean;
  onClose: () => void;
};

const BeverageConfirmationModal = ({ show, onClose }: ModalProps) => {
  const userBeverage =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.BEVERAGE_SELECTED)
      : '';

  return (
    <LocalModal
      isOpen={show}
      onRequestClose={onClose}
      contentClassName='w-[90%] sm:w-[500px] h-[550px]'
      backgroundColor='bg-transparent'
    >
      <div className='flex flex-col items-center justify-center gap-4'>
        <p className='flex items-center justify-center gap-1 text-white text-sm'>
          Find your
          {userBeverage === 'Tea' ? (
            <img
              src='/tea.png'
              alt='tea'
              className=' w-[100px] h-[100px] hover:scale-105 transition-all duration-300 object-contain object-center'
            />
          ) : (
            <img
              src='/coffee.png'
              alt='coffee'
              className=' w-[100px] h-[100px] hover:scale-105 transition-all duration-300 object-contain object-center'
            />
          )}
          at checkout
        </p>
        <p className='text-xs italic text-white text-center'>
          For every order, we donate $1 on your behalf to creative children with
          special needs in Africa
        </p>
        <button
          onClick={onClose}
          className='text-sm  text-[#F5F5DC] bg-[#38271c] p-2 cursor-pointer hover:bg-[#38271c8e] transition-all duration-300 w-[150px]'
        >
          Got it
        </button>
      </div>
    </LocalModal>
  );
};

export default BeverageConfirmationModal;
