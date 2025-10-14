'use client';
import ErrorModal from '@/components/error-modal/page';
import { supabase } from '@/lib/supabase';
import { STORAGE_KEYS } from '@/utils/constants';
import { validateEmail } from '@/utils/functions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const disableButton = !email || !password;
  const login = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (data.session !== null) {
        localStorage.setItem(
          STORAGE_KEYS.AUTH_TOKEN,
          data.session.access_token
        );
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, data.user.email ?? '');
        localStorage.setItem(
          STORAGE_KEYS.USER_ROLE,
          data.user.user_metadata?.user_role ?? 'user'
        );
        localStorage.setItem(STORAGE_KEYS.USER_ID, data.user.id ?? '');
        router.push('/');
      } else {
        setShowErrorMessage(true);
      }
    } catch (err: any) {
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };
  const signup = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            user_role: 'user',
          },
        },
      });
      if (data.session !== null) {
        localStorage.setItem(
          STORAGE_KEYS.AUTH_TOKEN,
          data.session.access_token
        );
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, data?.user?.email ?? '');
        localStorage.setItem(
          STORAGE_KEYS.USER_ROLE,
          data?.user?.user_metadata?.user_role ?? 'user'
        );
        localStorage.setItem(STORAGE_KEYS.USER_ID, data?.user?.id ?? '');
        router.push('/');
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
    <div className='w-full min-h-screen login_bg bg-[#e4e2df] text-sm'>
      <div className='blur-bg p-3 xs:p-4 text-[#e4e0e0] '>
        {/* <Link
          href='/'
          className='mt-4 gap-1 flex text-sm items-center text-[#e4e0e0] '
        >
          <MdOutlineArrowBackIosNew size={20} />
          Back
        </Link> */}
        {showSignupForm ? (
          <div className='flex justify-center'>
            <div className='w-full min-h-[88vh] sm:max-w-[350px] space-y-6 flex flex-col items-center justify-center'>
              <Image
                src={'/logo.svg'}
                alt='logo'
                width={70}
                height={70}
                className='object-cover invert'
              />
              {/* <h3 className='font-semibold'>Create an account</h3> */}
              <p className='text-lg font-bold'> You&apos;re Almost There!</p>
              <input
                type='text'
                placeholder='Full Name'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className='border border-[#909192] w-full p-2 outline-none bg-transparent placeholder:text-[#e4e0e0] '
              />
              <input
                type='text'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value && !validateEmail(e.target.value)) {
                    setEmailError('Please enter a valid email address');
                  } else {
                    setEmailError('');
                  }
                }}
                pattern='[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
                className='border border-[#909192] w-full p-2 outline-none bg-transparent placeholder:text-[#e4e0e0] '
              />
              <div className='flex border border-[#909192] w-full p-2'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className=' w-full outline-none bg-transparent placeholder:text-[#e4e0e0] pr-3'
                />
                {showPassword ? (
                  <FaRegEyeSlash
                    size={20}
                    onClick={() => setShowPassword(!showPassword)}
                    className='cursor-pointer'
                  />
                ) : (
                  <IoEyeOutline
                    size={20}
                    onClick={() => setShowPassword(!showPassword)}
                    className='cursor-pointer'
                  />
                )}
              </div>
              {emailError && (
                <p className='text-xs text-red-800'>{emailError}</p>
              )}
              <button
                disabled={disableButton}
                onClick={signup}
                className={`border border-[#909192] bg-[#523f3fab] font-semibold rounded-sm p-2 mt-6 w-full sm:max-w-[350px] cursor-pointer`}
              >
                {loading ? 'Loading...' : 'Create Account'}
              </button>
              <p className='text-xs'>
                Already have an account?
                <span
                  onClick={() => setShowSignupForm(false)}
                  className='text-[#3b1010ab] font-semibold cursor-pointer ml-1'
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className='flex justify-center'>
            <div className='w-full min-h-[88vh] sm:max-w-[350px] space-y-6 flex flex-col items-center justify-center'>
              <Image
                src={'/logo.svg'}
                alt='logo'
                width={70}
                height={70}
                className='object-cover invert'
              />
              {/* <h3 className='font-semibold'>Login</h3> */}
              <p className='text-lg'>Welcome</p>
              <input
                type='text'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value && !validateEmail(e.target.value)) {
                    setEmailError('Please enter a valid email address');
                  } else {
                    setEmailError('');
                  }
                }}
                pattern='[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
                className='border border-[#909192] w-full p-2 outline-none bg-transparent placeholder:text-[#e4e0e0] '
              />
              <div className='flex border border-[#909192] w-full p-2'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className=' w-full outline-none bg-transparent placeholder:text-[#e4e0e0] pr-3'
                />
                {showPassword ? (
                  <FaRegEyeSlash
                    size={20}
                    onClick={() => setShowPassword(!showPassword)}
                    className='cursor-pointer'
                  />
                ) : (
                  <IoEyeOutline
                    size={20}
                    onClick={() => setShowPassword(!showPassword)}
                    className='cursor-pointer'
                  />
                )}
              </div>
              {emailError && (
                <p className='text-xs text-red-800'>{emailError}</p>
              )}
              <button
                disabled={disableButton}
                onClick={login}
                className={`border border-[#909192] bg-[#523f3fab] rounded-sm p-2 mt-6 w-full sm:max-w-[350px] cursor-pointer font-semibold`}
              >
                {loading ? 'Loading...' : 'Enter'}
              </button>
              <p className='text-xs'>
                Don&apos;t have an account?{' '}
                <span
                  onClick={() => setShowSignupForm(true)}
                  className='text-[#3b1010ab] font-semibold cursor-pointer ml-1'
                >
                  Register
                </span>
              </p>
            </div>
          </div>
        )}
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

export default AuthPage;
