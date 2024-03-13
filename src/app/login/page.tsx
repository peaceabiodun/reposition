'use client';
import Link from 'next/link';
import { useState } from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const disableButton = !email && !password;
  return (
    <div className='w-full min-h-screen bg-[#dbd9d2] p-3 xs:p-4 text-sm  '>
      <Link href='/' className='mt-4 gap-1 flex text-sm items-center'>
        <MdOutlineArrowBackIosNew size={20} />
        Back
      </Link>
      <div className='flex justify-center'>
        <div className='w-full min-h-[88vh] sm:max-w-[350px] space-y-4 flex flex-col items-center justify-center'>
          <h3 className='font-semibold'>Login</h3>
          <p className='text-xs'> Are you the owner of this apllication ?</p>
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
          {disableButton && (
            <p className='text-xs text-red-500'>Please fill in all details</p>
          )}
          <button
            disabled={disableButton}
            className={`border border-[#3d3e3f] p-2 mt-6 w-full sm:max-w-[350px] cursor-pointer`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
