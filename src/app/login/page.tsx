'use client';
import ErrorModal from '@/components/error-modal/page';
import { supabase } from '@/lib/supabase';
import { STORAGE_KEYS } from '@/utils/constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const disableButton = !email ?? !password;
  const router = useRouter();

  const login = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (data.session !== null) {
        console.log(data);
        localStorage.setItem(
          STORAGE_KEYS.AUTH_TOKEN,
          data.session.access_token
        );
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, data.user.email ?? '');
        router.push('/home');
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
    <div className='w-full min-h-screen login_bg bg-[#dbd9d2] text-sm'>
      <div className='blur-bg p-3 xs:p-4 text-[#e4e0e0] '>
        <Link
          href='/'
          className='mt-4 gap-1 flex text-sm items-center text-[#e4e0e0] '
        >
          <MdOutlineArrowBackIosNew size={20} />
          Back
        </Link>
        <div className='flex justify-center'>
          <div className='w-full min-h-[88vh] sm:max-w-[350px] space-y-6 flex flex-col items-center justify-center'>
            <h3 className='font-semibold'>Login</h3>
            {/* <p className='text-xs'> Are you the owner of this apllication ?</p> */}
            <input
              type='text'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border border-[#909192] w-full p-2 outline-none bg-transparent placeholder:text-[#e4e0e0] '
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='border border-[#909192] w-full p-2 outline-none bg-transparent placeholder:text-[#e4e0e0]'
            />
            {disableButton && (
              <p className='text-xs '>Please fill in all details</p>
            )}
            <button
              disabled={disableButton}
              onClick={login}
              className={`border border-[#909192] bg-[#523f3fab] p-2 mt-6 w-full sm:max-w-[350px] cursor-pointer`}
            >
              {loading ? 'Loading...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
      {showErrorMessage && (
        <ErrorModal
          show={showErrorMessage}
          onClose={() => setShowErrorMessage(false)}
          description='Make sure you input the correct email and password'
        />
      )}
    </div>
  );
};

export default Login;
