'use client';
import { FaInstagram } from 'react-icons/fa';
import { MdMailOutline } from 'react-icons/md';
import { TbBrandTiktok } from 'react-icons/tb';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className='p-2 h-full text-black w-full relative'>
      <div className='flex flex-col items-center justify-center text-xs '>
        <div className='flex items-center gap-2'>
          <FaInstagram size={18} />
          <p>|</p>
          <MdMailOutline size={19} />
          <p>|</p>
          <TbBrandTiktok size={18} />
          <p>|</p>
          <FaXTwitter size={17} />
        </div>
        <span className='text-[10px] mt-1'>
          © {currentYear} Reposition, Inc.{' '}
        </span>
      </div>
    </div>
  );
};

export default Footer;
