'use client';
import Link from 'next/link';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const Login = () => {
  return (
    <div className='w-full min-h-screen bg-[#dbd9d2] p-3 xs:p-4 text-sm  '>
      <Link href='/' className='mt-4 gap-1 flex text-sm items-center'>
        <MdOutlineArrowBackIosNew size={20} />
        Back
      </Link>
      <div className='flex justify-center'>
        <div className='w-full min-h-[88vh] sm:max-w-[350px] space-y-4 flex flex-col items-center justify-center'>
          <h3>Login</h3>
          <p className='text-xs'> Are you the owner of this apllication ?</p>
          <input
            type='text'
            placeholder='Email'
            className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent placeholder:text-[#3d3e3f] '
          />
          <input
            type='password'
            placeholder='Password'
            className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent placeholder:text-[#3d3e3f] '
          />
          <button className='border border-[#3d3e3f] p-2 mt-6 w-full sm:max-w-[350px]'>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
