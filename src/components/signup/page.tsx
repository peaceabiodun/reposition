'use client';
import ErrorModal from '@/components/error-modal/page';
import { supabase } from '@/lib/supabase';
import Typewriter from 'typewriter-effect';
import { useState } from 'react';
import Link from 'next/link';
import SuccessModal from '@/components/success-modal/page';
import { useRouter } from 'next/navigation';
import { validateEmail } from '@/utils/functions';

const SignUpNewUsers = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const signUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            user_role: 'ADMIN',
          },
        },
      });

      setShowSuccessModal(true);
      setEmail('');
      router.push('/manage-products');
    } catch (err: any) {
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='text-sm w-full min-h-screen landing_bg bg-[#dbd9d2] '>
      <div className='blur-bg flex justify-center p-3 xs:p-4 h-[100vh]'>
        <div className=' w-full sm:max-w-[450px] text-[#e4e0e0] space-y-6 flex flex-col items-center justify-center '>
          <h2 className='text-2xl font-semibold'>
            <Typewriter
              options={{
                strings: ['REPOSITION [ ]', 'REPOSITION [ ]'],
                autoStart: true,
                loop: true,
              }}
            />
          </h2>
          <p className='text-sm text-center'>
            Enter your details for early access - top members only.
          </p>
          <div className='flex flex-col gap-6 w-full items-center'>
            <input
              type='text'
              placeholder='Email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border border-[#909192] rounded-none w-full h-[40px] p-2 outline-none bg-transparent placeholder:text-[#e4e0e0] '
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='border border-[#909192] w-full p-2 outline-none bg-transparent placeholder:text-[#e4e0e0]'
            />
            <button
              disabled={!validateEmail(email) && !password}
              onClick={signUp}
              className={`border border-[#909192] bg-[#523f3fab] h-[40px] font-normal p-2 w-full cursor-pointer`}
            >
              {loading ? 'Loading...' : 'Welcome'}
            </button>
          </div>

          {!validateEmail(email) && email !== '' && (
            <p className='text-[10px] text-red-500'>
              Please input a valid email address
            </p>
          )}
          <div className='flex text-xs font-semibold '>
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
          title='Welcome'
          description='You have successfully created an account'
        />
      )}
    </div>
  );
};

export default SignUpNewUsers;
