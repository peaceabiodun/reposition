'use client';

import ErrorModal from '@/components/error-modal/page';
import SuccessModal from '@/components/success-modal/page';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const disableButton = !password || !confirmPassword;
  const router = useRouter();

  const updatePassword = async () => {
    if (password !== confirmPassword) {
      setShowErrorMessage(true);
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      if (data.user?.role === 'authenticated') {
        setShowSuccessModal(true);
        router.push('/');
      } else {
        setShowErrorMessage(true);
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='w-full min-h-screen bg-[#dbd9d2] p-3 xs:p-4 text-sm  '>
      <Link href='/' className='mt-4 gap-1 flex text-sm items-center'>
        <MdOutlineArrowBackIosNew size={20} />
        Back
      </Link>
      <div className='flex justify-center'>
        <div className='w-full min-h-[88vh] sm:max-w-[350px] space-y-4 flex flex-col items-center justify-center'>
          <h3 className='font-semibold'>Reset Password</h3>
          <p className='text-xs'>
            {' '}
            Are you sure you want to reset your password ?
          </p>
          <input
            type='password'
            placeholder='New Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent placeholder:text-[#3d3e3f]'
          />
          <input
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent placeholder:text-[#3d3e3f]'
          />
          {disableButton && (
            <p className='text-xs text-red-500'>Please fill in all details</p>
          )}
          <button
            disabled={disableButton}
            className={`border border-[#3d3e3f] p-2 mt-6 w-full sm:max-w-[350px] cursor-pointer`}
            onClick={updatePassword}
          >
            {loading ? 'Loading...' : 'Confirm'}
          </button>
        </div>
      </div>
      {showErrorMessage && (
        <ErrorModal
          show={showErrorMessage}
          onClose={() => setShowErrorMessage(false)}
          description='Your passwords are incorrect'
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title='Password updated Successfully'
        />
      )}
    </div>
  );
};

export default ResetPassword;
