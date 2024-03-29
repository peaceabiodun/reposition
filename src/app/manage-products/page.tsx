'use client';

import { truncateString } from '@/utils/functions';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { CiMenuKebab } from 'react-icons/ci';
import { useState } from 'react';
import { ProductType } from '@/utils/types';
import { useRouter } from 'next/navigation';
import DeleteModal from '@/components/delete-modal/page';
import EditProductModal from '@/components/edit-product-modal/page';
import { products } from '@/utils/data';

const ManageProducts = () => {
  const dropDownLinks = [
    {
      text: 'Edit Product',
      link: () => setShowEditModal(true),
    },
    {
      text: 'Delete Product',
      link: () => setShowDeleteModal(true),
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const handleSelectProduct = (product: ProductType) => {
    setSelectedProduct(product === selectedProduct ? null : product);
  };
  const router = useRouter();
  return (
    <div className='w-full min-h-screen bg-[#dbd9d2] p-3 xs:p-4'>
      <div className='mt-4 gap-1 flex justify-between text-sm items-center'>
        <Link href='/' className='flex gap-1'>
          <MdOutlineArrowBackIosNew size={20} />
          Back
        </Link>
        <button
          onClick={() => router.push('/new-product')}
          className='border border-[#3d3e3f]  p-2 text-xs md:text-sm'
        >
          Add product
        </button>
      </div>

      <h3 className='text-sm font-semibold text-center my-8'>
        Manage Your Products
      </h3>

      <div className='flex items-center justify-center'>
        <div className=' text-sm w-full md:max-w-[85vw] '>
          {products.map((item, index) => (
            <div
              key={index}
              className={`relative flex gap-3 justify-between items-center ${
                index === products.length - 1
                  ? ''
                  : 'border-b border-[#b9b9b96c]'
              }  py-2`}
            >
              <div className=''>
                <Image
                  src={item.img}
                  alt='product_image'
                  width='70'
                  height='70'
                  className='h-[70px] object-cover'
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
                onClick={() => handleSelectProduct(item)}
              >
                <CiMenuKebab size={20} />
              </div>
              {selectedProduct && selectedProduct === item && (
                <div className='bg-[#ecebeb] rounded-sm p-2 absolute right-2 top-14 shadow-md text-xs sm:text-sm flex flex-col gap-2 z-[999]'>
                  {dropDownLinks.map((item, index) => (
                    <p
                      key={index}
                      className='hover:font-medium hover:bg-gray-50 p-1 cursor-pointer'
                      onClick={item.link}
                    >
                      {item.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />

      <EditProductModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
};

export default ManageProducts;
