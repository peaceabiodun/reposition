/* eslint-disable @next/next/no-img-element */
'use client';
import { STORAGE_KEYS } from '@/utils/constants';
import LocalModal from '../modal/page';

type ModalProps = {
  show: boolean;
  onClose: () => void;
};
const TeaCoffeeModal = ({ show, onClose }: ModalProps) => {
  return (
    <LocalModal
      isOpen={show}
      onRequestClose={onClose}
      contentClassName='w-[90%] sm:w-[800px] h-[550px]'
      backgroundColor='bg-[#fafafa41]'
    >
      <div className='flex flex-col items-center justify-center'>
        <h2 className='text-lg font-semibold text-center text-white mb-5'>
          WELCOME
        </h2>
        <div className='flex gap-4'>
          <div>
            <img
              src='/tea.png'
              alt='tea'
              className='sm:w-[320px] sm:h-[400px] w-[150px] h-[200px] hover:scale-105 transition-all duration-300 object-contain object-center'
              onClick={() => {
                localStorage.setItem(STORAGE_KEYS.BEVERAGE_SELECTED, 'Tea');
                onClose();
              }}
            />
            <p
              onClick={() => {
                localStorage.setItem(STORAGE_KEYS.BEVERAGE_SELECTED, 'Tea');
                onClose();
              }}
              className='text-center text-sm sm:text-base bg-[#fafafa41] p-2 cursor-pointer hover:bg-[#fafafa81] transition-all duration-300'
            >
              Tea please
            </p>
          </div>
          <div className='text-white text-lg font-semibold h-[300px] flex flex-col items-center justify-center'>
            OR
          </div>
          <div>
            <img
              src='/coffee.png'
              alt='coffee'
              className='sm:w-[320px] sm:h-[400px] w-[150px] h-[200px] hover:scale-105 transition-all duration-300 object-contain object-center'
              onClick={() => {
                localStorage.setItem(STORAGE_KEYS.BEVERAGE_SELECTED, 'Coffee');
                onClose();
              }}
            />
            <p
              onClick={() => {
                localStorage.setItem(STORAGE_KEYS.BEVERAGE_SELECTED, 'Coffee');
                onClose();
              }}
              className='text-center text-sm sm:text-base bg-[#fafafa41] p-2 cursor-pointer hover:bg-[#fafafa81] transition-all duration-300'
            >
              Coffee please
            </p>
          </div>
        </div>
      </div>
    </LocalModal>
  );
};

export default TeaCoffeeModal;
