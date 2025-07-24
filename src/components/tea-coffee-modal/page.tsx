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
          <video
            src='/videos/tea.mp4'
            autoPlay
            loop
            muted
            className='sm:w-[350px] sm:h-[400px] w-[150px] h-[200px] hover:border-2 border-white object-cover object-center'
            onClick={() => {
              localStorage.setItem(STORAGE_KEYS.BEVERAGE_SELECTED, 'Tea');
              onClose();
            }}
          />
          <div className='text-white text-lg font-semibold h-[300px] flex flex-col items-center justify-center'>
            OR
          </div>
          <video
            src='/videos/coffee.mp4'
            autoPlay
            loop
            muted
            className='sm:w-[350px] sm:h-[400px] w-[150px] h-[200px] hover:border-2 border-white object-cover'
            onClick={() => {
              localStorage.setItem(STORAGE_KEYS.BEVERAGE_SELECTED, 'Coffee');
              onClose();
            }}
          />
        </div>
      </div>
    </LocalModal>
  );
};

export default TeaCoffeeModal;
