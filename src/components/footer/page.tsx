'use client';
import { FaInstagram } from 'react-icons/fa';
import { MdMailOutline } from 'react-icons/md';
import { TbBrandTiktok } from 'react-icons/tb';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className='p-2 text-black w-full relative'>
      <div className='flex flex-col items-center justify-center text-xs '>
        <div className='mt-6 mb-10'>
          <p className='text-center'>Available payment methods</p>
          <div className='flex flex-wrap items-center gap-3'>
            <Image
              alt='master-card'
              src={'/master-card-icon.svg'}
              width={40}
              height={40}
            />
            <Image
              alt='visa-card'
              src={'/visa-icon.svg'}
              width={40}
              height={40}
            />

            <Image alt='verve-icon' src={'/verve.svg'} width={40} height={40} />
            <Image
              alt='american-express-icon'
              src={'/american-express.svg'}
              width={30}
              height={30}
            />
            <Image
              alt='bank-transfer-icon'
              src={'/bank-transfer-icon.svg'}
              width={30}
              height={30}
            />
            <Image
              alt='paystackicon'
              src={'/paystack1.png'}
              width={50}
              height={50}
            />
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <a
            href='https://www.instagram.com/reposition.co'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaInstagram size={18} />
          </a>
          <p>|</p>
          <a
            href='mailto:welcome@re-position.co'
            target='_blank'
            rel='noopener noreferrer'
          >
            <MdMailOutline size={19} />
          </a>
          <p>|</p>
          <a
            href='https://www.tiktok.com/@repositionglobal'
            target='_blank'
            rel='noopener noreferrer'
          >
            <TbBrandTiktok size={18} />
          </a>
          <p>|</p>
          <a
            href='https://twitter.com/repositionglo'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaXTwitter size={17} />
          </a>
        </div>
        <span className='text-[10px] mt-1'>© {currentYear} Reposition</span>
      </div>
    </div>
  );
};

export default Footer;
