'use client';
import { useRouter } from 'next/navigation';
import { AiOutlineShopping } from 'react-icons/ai';
import { GoPerson } from 'react-icons/go';
import Typewriter from 'typewriter-effect';
import { TbShirt } from 'react-icons/tb';
import { STORAGE_KEYS } from '@/utils/constants';
import { useEffect, useState } from 'react';
import LocalModal from '../modal/page';

const Header = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ?? '';
      setToken(authToken ?? '');
    }
  }, []);

  return (
    <div className='flex justify-between gap-4 items-center h-[28px]'>
      <h3 className='font-bold text-sm sm:text-lg flex gap-1'>
        REPOSITION{' '}
        <span className='md:hidden'>
          <Typewriter
            options={{
              strings: ['[ ]', '[ ]'],
              autoStart: true,
              loop: true,
            }}
          />
        </span>
      </h3>
      <div className='flex gap-3'>
        {token && (
          <TbShirt
            size={22}
            onClick={() => router.push('/manage-products')}
            className='cursor-pointer'
          />
        )}
        <GoPerson
          size={22}
          onClick={() => {
            if (token) {
              setShowLogoutModal(true);
            } else {
              router.push('/login');
            }
          }}
          className='cursor-pointer'
        />
        <AiOutlineShopping
          size={23}
          onClick={() => router.push('/basket')}
          className='cursor-pointer'
        />
      </div>
      {showLogoutModal && (
        <LocalModal
          isOpen={showLogoutModal}
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <div className='flex flex-col space-y-3 text-sm'>
            <h3 className='font-semibold'>Are you sure you want to Logout ?</h3>
            <button className='border border-[#3d3e3f] p-2 w-full sm:max-w-[350px] cursor-pointer'>
              Logout
            </button>
          </div>
        </LocalModal>
      )}
    </div>
  );
};

export default Header;
