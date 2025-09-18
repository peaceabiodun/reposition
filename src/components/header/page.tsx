'use client';
import { useRouter } from 'next/navigation';
import { GoPerson } from 'react-icons/go';
import { TbShirt } from 'react-icons/tb';
import { STORAGE_KEYS } from '@/utils/constants';
import { Fragment, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SuccessModal from '../success-modal/page';
import { ShoppingBagType } from '@/utils/types';
import MobileMenu from '../mobile-menu/page';
import UpdatePasswordModal from '../update-password-modal/page';
import { BsCart2, BsHandbag } from 'react-icons/bs';
import LanguageSelector from '../language-dropdown/page';
import CurrencySelector from '../currency-selector/page';
import { CgMenuRight } from 'react-icons/cg';
import { MdClose, MdOutlineInventory } from 'react-icons/md';

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
        className={`absoluteleft-0 top-0 w-full h-[45px] backdrop-blur-md z-[999]`}
      >
        <div className='max-w-[1700px] mx-auto flex justify-between gap-4 items-center h-[45px] px-4 py-6 relative text-[#3f2a16]'>
          {/* <div className='gap-8 hidden lg:flex'>
            <p
              className='text-[16px] md:text-lg  cursor-pointer hidden lg:flex'
              onClick={() => router.push('/shop')}
            >
              Shop
            </p>
            <p
              className='text-[16px] md:text-lg  cursor-pointer hidden lg:flex'
              onClick={() => router.push('/our-story')}
            >
              Our Story
            </p>
            <p
              className='text-[16px] md:text-lg  cursor-pointer hidden lg:flex'
              onClick={() => router.push('/assemble')}
            >
              Join Assemble
            </p>
            <p
              className='text-[16px] md:text-lg  cursor-pointer hidden lg:flex'
              onClick={() => router.push('/our-impact')}
            >
              Our Impact
            </p>
          </div> */}
          <div
            onClick={() => router.push('/')}
            className='flex  cursor-pointer mr-16'
          >
            <h2 className='font-bold text-sm sm:text-xl md:text-3xl daikon text-[#3f2a16]'>
              REPOSITION{' '}
            </h2>
            {/* <Image
              src={'/logo.svg'}
              alt='logo'
              width={30}
              height={30}
              className='object-cover'
            /> */}
          </div>
          <div className='flex gap-3'>
            {/* {userRole === 'ADMIN' && (
              <MdOutlineInventory
                size={24}
                onClick={() => router.push('/manage-products')}
                className='cursor-pointer hidden lg:flex'
              />
            )} */}
            {/* <GoPerson
              size={22}
              onClick={() => {
                if (token) {
                  setShowDropdown(!showDropdown);
                } else {
                  router.push('/login');
                }
              }}
              className='cursor-pointer hidden lg:flex'
            /> */}
            <div className='relative'>
              <BsHandbag
                size={20}
                onClick={() => router.push('/bag')}
                className='cursor-pointer '
              />
              <span
                onClick={() => router.push('/bag')}
                className={`text-[9px] absolute text-[#3f2a16] top-[7px] ${
                  scroll ? ' ' : ' '
                }  right-[2px] rounded-full p-2 w-4 h-4  flex items-center justify-center font-light cursor-pointer`}
              >
                {bagItems.length ?? '0'}
              </span>
            </div>

            <LanguageSelector />
            <CurrencySelector />
            <button
              aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
              aria-pressed={showMobileMenu}
              onClick={() => setShowMobileMenu((prev) => !prev)}
              className='relative w-6 h-6 '
            >
              <CgMenuRight
                size={20}
                className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out ${
                  showMobileMenu
                    ? 'opacity-0 rotate-90 scale-75'
                    : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <MdClose
                size={20}
                className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out ${
                  showMobileMenu
                    ? 'opacity-100 rotate-0 scale-100'
                    : 'opacity-0 -rotate-90 scale-75'
                }`}
              />
            </button>
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

      <div
        id={`${scroll ? 'sticky' : ''}`}
        className={` ${
          scroll
            ? 'flex items-center justify-between gap-4 p-4 md:p-8 text-[#3f2a16] transition-all slide-in-from-top duration-500 cursor-pointer backdrop-blur-sm fixed left-0 top-0 w-full z-[999]'
            : ' hidden '
        } `}
      >
        <div className='relative'>
          <BsHandbag
            size={23}
            onClick={() => router.push('/bag')}
            className='cursor-pointer '
          />
          <span
            onClick={() => router.push('/bag')}
            className={`text-[10px] absolute top-[8px] ${
              scroll ? ' ' : ' '
            }  right-[4px]  rounded-full p-2 w-4 h-4  flex items-center justify-center cursor-pointer`}
          >
            {bagItems.length ?? '0'}
          </span>
        </div>
        <h2 className='font-bold text-sm sm:text-lg md:text-xl daikon '>
          REPOSITION
        </h2>

        <div>
          <button
            aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
            aria-pressed={showMobileMenu}
            onClick={() => setShowMobileMenu((prev) => !prev)}
            className='relative w-6 h-6'
          >
            <CgMenuRight
              size={20}
              className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out ${
                showMobileMenu
                  ? 'opacity-0 rotate-90 scale-75'
                  : 'opacity-100 rotate-0 scale-100'
              }`}
            />
            <MdClose
              size={20}
              className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out ${
                showMobileMenu
                  ? 'opacity-100 rotate-0 scale-100'
                  : 'opacity-0 -rotate-90 scale-75'
              }`}
            />
          </button>
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
