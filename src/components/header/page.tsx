'use client';
import { useRouter } from 'next/navigation';
import { AiOutlineShopping } from 'react-icons/ai';
import { GoPerson } from 'react-icons/go';
import Typewriter from 'typewriter-effect';
import { TbShirt } from 'react-icons/tb';

const Header = () => {
  const router = useRouter();
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
        <TbShirt
          size={22}
          onClick={() => router.push('/manage-products')}
          className='cursor-pointer'
        />
        <GoPerson
          size={22}
          onClick={() => router.push('/login')}
          className='cursor-pointer'
        />
        <AiOutlineShopping
          size={23}
          onClick={() => router.push('/basket')}
          className='cursor-pointer'
        />
      </div>
    </div>
  );
};

export default Header;
