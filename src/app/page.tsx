'use client';
import ErrorModal from '@/components/error-modal/page';
import { supabase } from '@/lib/supabase';
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
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0–9._-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };
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
    <div className='w-full landing_bg bg-[#dbd9d2] text-sm relative min-h-[100vh]'>
      <div className='blur-bg flex justify-center  p-3 xs:p-4'>
        <div className=' w-full min-h-[88vh] sm:max-w-[450px] text-[#e4e0e0] space-y-6 flex flex-col items-center justify-center '>
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
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border-y border-l border-[#909192] rounded-none w-full h-[40px] p-2 outline-none bg-transparent placeholder:text-[#e4e0e0] '
            />
            <button
              disabled={!validateEmail(email)}
              onClick={signUp}
              className={`border border-[#909192] bg-[#523f3fab] h-[40px] font-normal p-2 w-[100px] cursor-pointer`}
            >
              {loading ? 'Loading...' : 'Welcome'}
            </button>
          </div>

          {!validateEmail(email) && email !== '' && (
            <p className='text-[10px] text-red-500'>
              Please input a valid email address
            </p>
          )}
          <div className='flex text-xs '>
            <p>Already have an account ?</p>
            <Link href={'/login'} className=' cursor-pointer text-[#ffe7ba]'>
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
