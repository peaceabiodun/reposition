'use client';
import ErrorModal from '@/components/error-modal/page';
import { supabase } from '@/lib/supabase';
import { STORAGE_KEYS } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import Typewriter from 'typewriter-effect';
import { useState } from 'react';
import Link from 'next/link';
import SuccessModal from '@/components/success-modal/page';

const SignUpNewUsers = () => {
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const disableButton = !email;
  const router = useRouter();

  const signUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,

        options: {
          data: {
            user_role: 'CUSTOMER',
            shouldCreateUser: false,
            emailRedirectTo: 'https://reposition-psi.vercel.app/home',
          },
        },
      });
      setShowSuccessModal(true);
      setEmail('');
      // if (data.user?.role === 'authenticated') {
      //   setShowSuccessModal(true);
      // } else {
      //   setShowErrorMessage(true);
      // }
    } catch (err: any) {
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='w-full bg-[#dbd9d2] p-3 xs:p-4 text-sm relative min-h-[100vh]  '>
      <div className='flex justify-center'>
        <div className='w-full min-h-[88vh] sm:max-w-[450px] space-y-4 flex flex-col items-center justify-center'>
          <h2 className='text-2xl font-semibold'>
            <Typewriter
              options={{
                strings: ['REPOSITION [ ]', 'REPOSITION [ ]'],
                autoStart: true,
                loop: true,
              }}
            />
          </h2>
          <p className='text-xs text-center'>
            Enter your email for early access - top members only.
          </p>
          <div className='flex w-full items-center'>
            <input
              type='text'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border-y border-l border-[#3d3e3f] rounded-none w-full h-[40px] p-2 outline-none bg-transparent placeholder:text-[#3d3e3f] '
            />
            <button
              disabled={disableButton}
              onClick={signUp}
              className={`border border-[#3d3e3f] h-[40px] p-2 w-[100px] cursor-pointer`}
            >
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </div>

          {disableButton && (
            <p className='text-xs text-red-500'>
              Please input a valid email address
            </p>
          )}
          <div className='flex text-xs'>
            <p>Already have an account ?</p>
            <Link href={'/login'} className='font-bold cursor-pointer'>
              Login here
            </Link>
          </div>
        </div>
      </div>
      {showErrorMessage && (
        <ErrorModal
          show={showErrorMessage}
          onClose={() => setShowErrorMessage(false)}
          description='Make sure you input a correct email address'
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title='You have successfully submitted your email'
          description='check your email to proceed'
        />
      )}
    </div>
  );
};

export default SignUpNewUsers;
