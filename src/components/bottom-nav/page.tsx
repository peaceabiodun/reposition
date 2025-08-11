'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsHandbag } from 'react-icons/bs';
import LanguageSelector from '../language-dropdown/page';
import { CgMenuRight } from 'react-icons/cg';
import { STORAGE_KEYS } from '@/utils/constants';
import { ShoppingBagType } from '@/utils/types';
import MobileMenu from '../mobile-menu/page';

const BottomNav = () => {
  const [scroll, setScroll] = useState(false);
  const router = useRouter();
  const [bagItems, setBagItems] = useState<ShoppingBagType[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 90);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array to run only once

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

  return (
    <div
      className={`${
        scroll
          ? 'fixed left-0 bottom-0 w-full  h-[45px] backdrop-blur-md z-[999]'
          : 'relative'
      }`}
    >
      <div className='max-w-[1700px] mx-auto flex justify-center gap-4 items-center h-[45px] px-4 py-6 relative'>
        <div className='flex gap-4'>
          <div className='relative'>
            <BsHandbag
              size={23}
              onClick={() => router.push('/bag')}
              className='cursor-pointer '
            />
            <span
              onClick={() => router.push('/bag')}
              className={`text-[10px] absolute text-[#3f2a16] top-[8px] ${
                scroll ? ' ' : ' '
              }  right-[4px] rounded-full p-2 w-4 h-4  flex items-center justify-center font-light cursor-pointer`}
            >
              {bagItems.length ?? '0'}
            </span>
          </div>
          <LanguageSelector position='top' />
          <CgMenuRight
            size={20}
            className='cursor-pointer '
            onClick={() => setShowMobileMenu(true)}
          />
        </div>
      </div>
      {showMobileMenu && (
        <MobileMenu
          show={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
};

export default BottomNav;
