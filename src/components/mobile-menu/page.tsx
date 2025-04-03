'use client';

import { useRouter } from 'next/navigation';
import LocalSideModal from '../side-modal/page';
import { useState } from 'react';
import UpdatePasswordModal from '../update-password-modal/page';
import { STORAGE_KEYS } from '@/utils/constants';
import SuccessModal from '../success-modal/page';
import { supabase } from '@/lib/supabase';

type ModalProps = {
  show: boolean;
  onClose: () => void;
};

const MobileMenu = ({ show, onClose }: ModalProps) => {
  const router = useRouter();
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userRole =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_ROLE)
      : '';

  const email =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
      : '';

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      : '';

  // const menuInfo = [
  //   {
  //     title: 'About Us',
  //     onClick: () => router.push('/home'),
  //   },
  //   {
  //     title: `${token && userRole === 'ADMIN' ? 'Manage Products' : ''}`,
  //     onClick: () => {
  //       if (token && userRole === 'ADMIN') {
  //         router.push('/manage-products');
  //       }
  //     },
  //   },
  //   {
  //     title: `${token ? 'Update Password' : ''}`,
  //     onClick: () => setShowUpdatePasswordModal(true),
  //   },
  //   {
  //     title: `${token ? 'Logout' : 'Login'}`,
  //     onClick: () => {
  //       if (token) {
  //         setShowLogoutModal(true);
  //       } else {
  //         router.push('/login');
  //       }
  //     },
  //   },
  // ];

  const menuInfo = [
    {
      title: 'We Are',
      onClick: () => router.push('/we-are'),
    },
    ...(token && userRole === 'ADMIN'
      ? [
          {
            title: 'Manage Products',
            onClick: () => router.push('/manage-products'),
          },
        ]
      : []),
    ...(token
      ? [
          {
            title: 'Update Password',
            onClick: () => setShowUpdatePasswordModal(true),
          },
        ]
      : []),
    {
      title: token ? 'Logout' : 'Login',
      onClick: () => {
        if (token) {
          setShowLogoutModal(true);
        } else {
          router.push('/');
        }
      },
    },
  ];

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      setShowLogoutModal(false);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <LocalSideModal isOpen={show} onRequestClose={onClose}>
      <div className='text-center font-semibold'>
        <h3 className='text-xl '>Reposition</h3>
        <h3 className='text-sm mt-1'>[New In]</h3>
      </div>
      <div className='flex flex-col gap-2 w-full h-full  justify-center '>
        {menuInfo?.map((item, index) => (
          <div
            key={index}
            onClick={item?.onClick}
            className='p-2 hover:bg-[#a3a3a37c] hover:font-semibold text-sm '
          >
            {item?.title}
          </div>
        ))}
      </div>
      {showUpdatePasswordModal && (
        <UpdatePasswordModal
          show={showUpdatePasswordModal}
          onClose={() => setShowUpdatePasswordModal(false)}
          email={email ?? ''}
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
    </LocalSideModal>
  );
};

export default MobileMenu;
