/* eslint-disable @next/next/no-img-element */
'use client';
import { STORAGE_KEYS } from '@/utils/constants';
import LocalModal from '../modal/page';

type ModalProps = {
  show: boolean;
  onClose: () => void;
  showConfirmationModal: () => void;
};

const TeaCoffeeModal = ({
  show,
  onClose,
  showConfirmationModal,
}: ModalProps) => {
  return (
    <LocalModal
      isOpen={show}
      onRequestClose={onClose}
      contentClassName='w-[90%] sm:w-[500px] md:w-[750px] h-[550px] z-[999]'
      backgroundColor='bg-transparent'
      hasCancelIcon={false}
    >
      <div className='flex flex-col items-center justify-center'>
        <h2 className='text-xl font-semibold text-center text-white mb-5 '>
          WELCOME
        </h2>
        <div className='flex gap-4'>
          <div>
            <img
              src='/tea.png'
              alt='tea'
              className='sm:w-[320px] sm:h-[400px] w-[150px] h-[200px] hover:scale-105 transition-all duration-300 object-contain object-center'
            />
            <div className='flex items-center justify-center'>
              <button
                onClick={() => {
                  localStorage.setItem(STORAGE_KEYS.BEVERAGE_SELECTED, 'Tea');
                  showConfirmationModal();
                }}
                className='text-sm sm:text-base text-[#F5F5DC] bg-[#38271c] p-2 cursor-pointer hover:bg-[#38271c8e] transition-all duration-300 w-full sm:w-[150px]'
              >
                TEA
              </button>
            </div>
          </div>
          <div className='text-white text-lg font-semibold h-[300px] flex flex-col items-center justify-center'>
            OR
          </div>
          <div>
            <img
              src='/coffee.png'
              alt='coffee'
              className='sm:w-[320px] sm:h-[400px] w-[150px] h-[200px] hover:scale-105 transition-all duration-300 object-contain object-center'
            />
            <div className='flex items-center justify-center'>
              <button
                onClick={() => {
                  localStorage.setItem(
                    STORAGE_KEYS.BEVERAGE_SELECTED,
                    'Coffee'
                  );
                  showConfirmationModal();
                }}
                className='text-sm sm:text-base text-[#F5F5DC] bg-[#38271c] p-2 cursor-pointer hover:bg-[#38271c8e] transition-all duration-300 w-full sm:w-[150px]'
              >
                COFFEE
              </button>
            </div>
          </div>
        </div>
      </div>
    </LocalModal>
  );
};

export default TeaCoffeeModal;
