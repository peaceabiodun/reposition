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
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const disableButton = !email ?? !password;
  const router = useRouter();

  const signUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            user_role: 'CUSTOMER',
          },
        },
      });

      if (data.user?.role === 'authenticated') {
        setShowSuccessModal(true);
      } else {
        setShowErrorMessage(true);
      }
    } catch (err: any) {
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='w-full bg-[#dbd9d2] p-3 xs:p-4 text-sm relative min-h-[100vh]  '>
      <div className='flex justify-center'>
        <div className='w-full min-h-[88vh] sm:max-w-[350px] space-y-4 flex flex-col items-center justify-center'>
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
            Be one of the top 100 to get exclusive access to our latest
            collection and shop with unlimited offers
          </p>
          <input
            type='text'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent placeholder:text-[#3d3e3f] '
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent placeholder:text-[#3d3e3f]'
          />
          <div className='flex text-xs'>
            <p>Already have an account ?</p>
            <Link href={'/login'} className='font-bold cursor-pointer'>
              Login here
            </Link>
          </div>
          {disableButton && (
            <p className='text-xs text-red-500'>Please fill in all details</p>
          )}
          <button
            disabled={disableButton}
            onClick={signUp}
            className={`border border-[#3d3e3f] p-2 mt-6 w-full sm:max-w-[350px] cursor-pointer`}
          >
            {loading ? 'Loading...' : 'Confirm'}
          </button>
        </div>
      </div>
      {showErrorMessage && (
        <ErrorModal
          show={showErrorMessage}
          onClose={() => setShowErrorMessage(false)}
          description='Make sure you input the correct email and password'
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title='You have successfully Created an account with us'
          description='Please proceed to login with your details'
          buttonText='Login'
          buttonClick={() => router.push('/login')}
        />
      )}
    </div>
  );
};

export default SignUpNewUsers;
