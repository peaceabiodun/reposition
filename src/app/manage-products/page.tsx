import { truncateString } from '@/utils/functions';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { CiMenuKebab } from 'react-icons/ci';

const ManageProducts = () => {
  return (
    <div className='w-full min-h-screen bg-[#ece8e3] p-3 xs:p-4'>
      <div className='mt-4 gap-1 flex justify-between text-sm items-center'>
        <Link href='/' className='flex gap-1'>
          <MdOutlineArrowBackIosNew size={20} />
          Back
        </Link>
        <button className='border border-[#3d3e3f]  p-2 text-xs md:text-sm'>
          Add product
        </button>
      </div>

      <h3 className='text-sm font-semibold text-center my-4'>
        Manage Your Products
      </h3>

      <div className='border border-[#3d3e3f] p-2 accent-transparent text-sm '>
        <div className='flex gap-3 justify-between items-center border-b border-gray-400 py-2'>
          <div className='flex gap-3'>
            <input type='checkbox' />
            <Image
              src={'/img1.jpg'}
              alt='product_image'
              width='60'
              height='60'
              className='h-[60px]'
            />
          </div>
          <p className='sm:hidden'>
            {truncateString('Reposition White Jacket [white]', 3)}{' '}
          </p>
          <p className='hidden sm:flex'>
            {truncateString('Reposition White Jacket [white]', 6)}{' '}
          </p>
          <div className='cursor-pointer'>
            <CiMenuKebab size={20} />
          </div>
        </div>

        <div className='flex gap-3 justify-between items-center py-2'>
          <div className='flex gap-3'>
            <input type='checkbox' />
            <Image
              src={'/img1.jpg'}
              alt='product_image'
              width='60'
              height='60'
              className='h-[60px]'
            />
          </div>
          <p className='sm:hidden'>
            {truncateString('Reposition White Jacket [white]', 3)}{' '}
          </p>
          <p className='hidden sm:flex'>
            {truncateString('Reposition White Jacket [white]', 6)}{' '}
          </p>
          <div className='cursor-pointer'>
            <CiMenuKebab size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
