'use client';
import Header from '@/components/header/page';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const ProductDetails = () => {
  const sizeChart = ['SM', 'MD', 'LG', 'XL', '2XL', '3XL'];
  const [selectedSize, setSelectedSize] = useState('');
  const router = useRouter();
  return (
    <div className='w-full min-h-screen bg-[#ece8e3] p-3 xs:p-4'>
      <Header />
      <Link href='/' className='pt-3 gap-1 flex text-sm items-center'>
        <MdOutlineArrowBackIosNew size={20} />
        Back
      </Link>
      <div className='my-6 grid grid-cols-1 md:grid-cols-2'>
        <div className='flex items-center justify-center'>
          <Image
            src={'/img1.jpg'}
            alt='product_image'
            width='250'
            height='250'
          />
        </div>

        <div className=' mt-3 md:mt-0 flex flex-col items-center md:justify-center text-sm'>
          <h1 className='uppercase font-medium'>
            Reposition White Jacket [white]
          </h1>
          <p className='my-3'>$75</p>
          <div className='flex gap-1'>
            {sizeChart.map((item, index) => (
              <span
                key={index}
                onClick={() => setSelectedSize(item)}
                className={`${
                  selectedSize === item ? 'bg-gray-300 font-medium' : ''
                } p-1`}
              >
                {item}
              </span>
            ))}
          </div>
          <button
            onClick={() => router.push('/basket')}
            className='text-sm p-1 w-full border border-[#3d3e3f] mt-5'
          >
            Buy Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
