'use client';
import { supabase } from '@/lib/supabase';
import LocalModal from '../modal/page';
import { useState } from 'react';
import SuccessModal from '../success-modal/page';

type Props = {
  show: boolean;
  onClose: () => void;
  email: string;
};
const UpdatePasswordModal = ({ show, onClose, email }: Props) => {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const getPasswordUpdateLink = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://www.re-position.co/reset-password',
      });
      onClose();

      setShowSuccessModal(true);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalModal isOpen={show} onRequestClose={onClose}>
      <div className='flex flex-col items-center justify-center space-y-4 text-sm text-[#7c4b2f]'>
        <h2 className='font-semibold'>Update your password</h2>
        <input
          type='email'
          className='border border-[#3d3e3f] w-[240px] p-2 mt-1 outline-none bg-transparent '
          placeholder='email address'
          value={email}
          readOnly
        />
        <button
          className='border bg-[#523f3fab] text-[#f0efef] p-2  w-[240px] cursor-pointer'
          onClick={getPasswordUpdateLink}
        >
          {loading ? 'Loading...' : 'Confirm'}
        </button>
      </div>
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title='Email sent!'
          description='Check your email for the reset link'
        />
      )}
    </LocalModal>
  );
};

export default UpdatePasswordModal;
