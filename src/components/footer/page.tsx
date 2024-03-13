'use client';
import { FaInstagram } from 'react-icons/fa';
import { MdMailOutline } from 'react-icons/md';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className='p-3 h-full text-black w-full relative'>
      <div className='flex flex-col items-center justify-center text-xs '>
        <div className='flex items-center gap-2'>
          <FaInstagram size={18} />
          <p>|</p>
          <MdMailOutline size={19} />
        </div>
        <span className='text-[10px] mt-1'>
          © {currentYear} Reposition, Inc.{' '}
        </span>
      </div>
    </div>
  );
};

export default Footer;
