'use client';
import { AiOutlineShopping } from 'react-icons/ai';
import { GoPerson } from 'react-icons/go';
import Typewriter from 'typewriter-effect';

const Header = () => {
  return (
    <div className='flex justify-between gap-4 items-center'>
      <h3 className='font-bold text-sm sm:text-lg flex gap-1'>
        REPOSITION{' '}
        <span className='md:hidden'>
          <Typewriter
            options={{
              strings: ['[ ]', '[ ]'],
              autoStart: true,
              loop: true,
            }}
          />
        </span>
      </h3>
      <div className='flex gap-3'>
        <GoPerson size={22} />
        <AiOutlineShopping size={23} />
      </div>
    </div>
  );
};

export default Header;
