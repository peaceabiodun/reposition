'use client';
import { useRouter } from 'next/navigation';
import { AiOutlineShopping } from 'react-icons/ai';
import { GoPerson } from 'react-icons/go';
import Typewriter from 'typewriter-effect';
import { TbShirt } from 'react-icons/tb';
import { STORAGE_KEYS } from '@/utils/constants';
import { Fragment, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SuccessModal from '../success-modal/page';
import { ShoppingBagType } from '@/utils/types';
import { MdMenuOpen } from 'react-icons/md';
import MobileMenu from '../mobile-menu/page';
import UpdatePasswordModal from '../update-password-modal/page';
import Image from 'next/image';

const Header = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [bagItems, setBagItems] = useState<ShoppingBagType[]>([]);
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

  const userRole =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_ROLE)
      : '';
  const userId =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_ID)
      : '';

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setToken('');
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
      setShowLogoutModal(false);
      setShowDropdown(false);
      router.refresh();
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const existingBagItemsJSON = localStorage.getItem(STORAGE_KEYS.BAG_ITEMS);
    if (existingBagItemsJSON) {
      const existingBagItems = JSON.parse(existingBagItemsJSON);
      setBagItems(existingBagItems ?? []);
      localStorage.setItem(
        STORAGE_KEYS.CART_LENGTH,
        (existingBagItems?.length ?? 0).toString()
      );
    }
  }, []);
  // const getBagItems = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('shopping-bag')
  //       .select('*')
  //       .eq('user_id', userId);
  //     setBagItems(data ?? []);
  //     localStorage.setItem(
  //       STORAGE_KEYS.CART_LENGTH,
  //       (data?.length ?? 0).toString()
  //     );
  //   } catch (err: any) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   getBagItems();
  // }, []);

  return (
    <Fragment>
      <div
        id={`${scroll ? 'sticky' : ''}`}
        className={` ${
          scroll
            ? 'fixed left-0 top-0 w-full border-b border-[#a1a1a19c] h-[45px] bg-[#dbd9d2] z-[999]'
            : ''
        }`}
      >
        <div className='max-w-[1500px] mx-auto flex justify-between gap-4 items-center h-[45px] p-4 relative'>
          <div className='flex gap-1'>
            <h2 className='font-bold text-sm sm:text-lg '>REPOSITION </h2>
            <Image
              src={'/logo.svg'}
              alt='logo'
              width={30}
              height={30}
              className='object-cover'
            />
          </div>
          {/* <h2 className='font-bold text-sm sm:text-lg flex gap-1'>
          REPOSITION{' '}
          <span className=''>
            <Typewriter
              options={{
                strings: ['[ ]', '[ ]'],
                autoStart: true,
                loop: true,
              }}
            />
          </span>
        </h2> */}

          <div
            className='text-[16px] font-light cursor-pointer hidden sm:flex'
            onClick={() => router.push('/we-are')}
          >
            We Are
          </div>
          <div className='flex gap-3'>
            {userRole === 'ADMIN' && (
              <TbShirt
                size={22}
                onClick={() => router.push('/manage-products')}
                className='cursor-pointer hidden sm:flex'
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
              className='cursor-pointer hidden sm:flex'
            />
            <div className='relative'>
              <AiOutlineShopping
                size={24}
                onClick={() => router.push('/bag')}
                className='cursor-pointer '
              />
              <span
                onClick={() => router.push('/bag')}
                className={`text-[10px] absolute ${
                  scroll ? 'top-[6px] ' : 'top-[7px]'
                }  right-[4px] rounded-full p-2 w-4 h-4 text-[#000000] flex items-center justify-center font-light cursor-pointer`}
              >
                {bagItems.length ?? '0'}
              </span>
            </div>
            <MdMenuOpen
              size={26}
              className='cursor-pointer sm:hidden'
              onClick={() => setShowMobileMenu(true)}
            />
          </div>
          {showDropdown && (
            <div className='bg-[#ecebeb] rounded-sm p-2 absolute right-2 top-12 shadow-md text-xs sm:text-sm flex flex-col gap-2 z-[999]'>
              <div
                onClick={() => setShowUpdatePasswordModal(true)}
                className='hover:font-light hover:bg-gray-50 p-1 cursor-pointer'
              >
                Update password
              </div>

              <div
                onClick={() => setShowLogoutModal(true)}
                className='hover:font-light hover:bg-gray-50 p-1 cursor-pointer'
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {showUpdatePasswordModal && (
        <UpdatePasswordModal
          show={showUpdatePasswordModal}
          onClose={() => setShowUpdatePasswordModal(false)}
          email={email}
        />
      )}

      {showLogoutModal && (
        <SuccessModal
          show={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          title='Are you sure you want to Logout ?'
          buttonText='Logout'
          buttonClick={logout}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title='Email sent!'
          description='Check your email for the reset link'
        />
      )}
      {showMobileMenu && (
        <MobileMenu
          show={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
        />
      )}
    </Fragment>
  );
};

export default Header;
