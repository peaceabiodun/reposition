'use client';

import { truncateString } from '@/utils/functions';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { CiMenuKebab } from 'react-icons/ci';
import { useState } from 'react';
import { products } from '../page';
import { ProductType } from '@/utils/types';

const ManageProducts = () => {
  const dropDownLinks = [
    {
      text: 'Out of stock',
      link: '',
    },
    {
      text: 'Edit',
      link: '',
    },
    {
      text: 'Delete',
      link: '',
    },
  ];
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>();
  const handleSelectProduct = (id: number) => {
    setShowDropDown(!showDropDown);
  };
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
        {products.map((item, index) => (
          <div
            key={index}
            className='relative flex gap-3 justify-between items-center border-b border-gray-300 py-2'
          >
            <div className='flex gap-3'>
              <input type='checkbox' />
              <Image
                src={item.img}
                alt='product_image'
                width='60'
                height='60'
                className='h-[60px] object-cover'
              />
            </div>
            <p className='sm:hidden'>
              {truncateString(`${item.product_name}`, 3)}{' '}
            </p>
            <p className='hidden sm:flex'>
              {truncateString(`${item.product_name}`, 6)}{' '}
            </p>
            <div
              className='cursor-pointer '
              onClick={() => setShowDropDown(!showDropDown)}
            >
              <CiMenuKebab size={20} />
            </div>
            {showDropDown && (
              <div className='bg-[#ffffff] rounded-sm p-2 absolute right-2 top-14 shadow-md text-xs sm:text-sm flex flex-col gap-2'>
                {dropDownLinks.map((item, index) => (
                  <p key={index} className='hover:font-medium cursor-pointer'>
                    {item.text}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
