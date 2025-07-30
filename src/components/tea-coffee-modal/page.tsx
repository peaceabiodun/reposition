/* eslint-disable @next/next/no-img-element */
'use client';
import { STORAGE_KEYS } from '@/utils/constants';
import LocalModal from '../modal/page';
import { useEffect, useRef, useState } from 'react';
import { IoPlayCircle } from 'react-icons/io5';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (show && audioRef.current) {
      // Reset audio state when modal opens
      setIsAudioPlaying(false);
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  }, [show]);

  const handlePlayAudio = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsAudioPlaying(true);
      } catch (error) {
        console.log('Audio playback failed:', error);
      }
    }
  };

  return (
    <LocalModal
      isOpen={show}
      onRequestClose={onClose}
      contentClassName='w-[90%] sm:w-[500px] md:w-[750px] h-[550px]'
      backgroundColor='bg-transparent'
    >
      <audio
        ref={audioRef}
        src='/audio/reposition-welcome.mp3'
        preload='auto'
      />
      <div className='flex flex-col items-center justify-center'>
        <h2 className='text-xl font-semibold text-center text-white mb-5'>
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
      {!isAudioPlaying && (
        <div className='w-full h-full flex items-center justify-center absolute inset-0 bg-black/20 z-50'>
          <IoPlayCircle
            size={35}
            className='text-white cursor-pointer animate-pulse transition-all duration-300 hover:scale-110'
            onClick={handlePlayAudio}
          />
        </div>
      )}
    </LocalModal>
  );
};

export default TeaCoffeeModal;
