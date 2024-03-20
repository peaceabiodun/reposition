'use client';
import { useRouter } from 'next/navigation';
import { AiOutlineShopping } from 'react-icons/ai';
import { GoPerson } from 'react-icons/go';
import Typewriter from 'typewriter-effect';
import { TbShirt } from 'react-icons/tb';
import { STORAGE_KEYS } from '@/utils/constants';
import { Fragment, useEffect, useState } from 'react';
import LocalModal from '../modal/page';
import { supabase } from '@/lib/supabase';
import SuccessModal from '../success-modal/page';

const Header = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [scroll, setScroll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 20);
    });
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem(STORAGE_KEYS.USER_EMAIL) ?? '';
      setEmail(email ?? '');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ?? '';
      setToken(authToken ?? '');
    }
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setToken('');
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      setShowLogoutModal(false);
      setShowDropdown(false);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordUpdateLink = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.href}reset-password`,
      });
      setShowUpdatePasswordModal(false);
      setShowDropdown(false);
      setShowSuccessModal(true);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <div
        id={`${scroll ? 'sticky' : ''}`}
        className={`flex justify-between gap-4 items-center h-[40px] p-3 xs:p-4 ${
          scroll
            ? 'fixed top-0 w-full border-b border-[#a1a1a19c] h-[45px] bg-[#dbd9d2]'
            : ''
        }`}
      >
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
                setShowDropdown(!showDropdown);
              } else {
                router.push('/login');
              }
            }}
            className='cursor-pointer'
          />
          <AiOutlineShopping
            size={23}
            onClick={() => router.push('/bag')}
            className='cursor-pointer'
          />
          <span className='text-[10px] absolute top-[6px] right-[10px] bg-[#000000] rounded-full p-2 w-4 h-4 text-[#ffffff] flex items-center justify-center'>
            2
          </span>
        </div>
      </div>
      {showDropdown && (
        <div className='bg-[#ecebeb] rounded-sm p-2 absolute right-2 top-12 shadow-md text-xs sm:text-sm flex flex-col gap-2 z-[999]'>
          <div
            onClick={() => setShowUpdatePasswordModal(true)}
            className='hover:font-medium hover:bg-gray-50 p-1 cursor-pointer'
          >
            Update password
          </div>

          <div
            onClick={() => setShowLogoutModal(true)}
            className='hover:font-medium hover:bg-gray-50 p-1 cursor-pointer'
          >
            Logout
          </div>
        </div>
      )}
      {showUpdatePasswordModal && (
        <LocalModal
          isOpen={showUpdatePasswordModal}
          onRequestClose={() => setShowUpdatePasswordModal(false)}
        >
          <div className='flex flex-col items-center justify-center space-y-4 text-sm'>
            <h2>Update your password</h2>
            <input
              type='email'
              className='border border-[#3d3e3f] w-[240px] p-2 mt-1 outline-none bg-transparent '
              placeholder='email address'
              value={email}
              readOnly
            />
            <button
              className='border border-[#3d3e3f] p-2  w-[240px] cursor-pointer'
              onClick={getPasswordUpdateLink}
            >
              {loading ? 'Loading...' : 'Confirm'}
            </button>
          </div>
        </LocalModal>
      )}

      {showLogoutModal && (
        <LocalModal
          isOpen={showLogoutModal}
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <div className='flex flex-col space-y-3 text-sm items-center justify-center'>
            <h3 className='font-semibold'>Are you sure you want to Logout ?</h3>
            <button
              onClick={logout}
              className='border border-[#3d3e3f] p-2 w-full sm:max-w-[350px] cursor-pointer'
            >
              {loading ? 'Loading...' : 'Logout'}
            </button>
          </div>
        </LocalModal>
      )}

      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title='Email sent!'
          description='Check your email for the reset link'
        />
      )}
    </Fragment>
  );
};

export default Header;
