'use client';

import { FileUploader } from '@/components/file-uploader/page';
import Link from 'next/link';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';

const AddNewProduct = () => {
  return (
    <div className='w-full min-h-screen bg-[#dbd9d2] p-3 xs:p-4'>
      <Link href='/manage-products' className='flex gap-1 mt-4 text-sm'>
        <MdOutlineArrowBackIosNew size={20} />
        Back
      </Link>

      <h3 className='text-sm font-semibold text-center my-4'>
        Add New Product
      </h3>
      <div className='my-4 text-sm w-full flex flex-col sm:flex-row gap-4 sm:gap-6'>
        <div className='w-full'>
          <label className=''>Product Name</label>
          <input
            type='text'
            className='border border-[#3d3e3f] w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
            placeholder='e.g Utility Jacket'
          />
        </div>
        <div className='w-full'>
          <label className=''>Product Price</label>
          <input
            type='text'
            className='border border-[#3d3e3f] w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
            placeholder='$100'
          />
        </div>
      </div>

      <div className='w-full text-sm '>
        <label className=''>Product Description</label>
        <textarea
          className='border border-[#3d3e3f] w-full h-[160px] mt-2 p-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='Describe your product'
        />
      </div>
      {/* <div className='w-full text-sm'>
        <label className=''>Product Image</label>
        <input
          type='file'
          className='border border-[#3d3e3f] w-full h-[160px] p-2 mt-2 outline-none bg-transparent  '
        />
      </div> */}
      <div className='w-full text-sm my-2'>
        <label className=''>Product Image(s)</label>
        <FileUploader
          fileUrls={[]}
          setFileUrls={() => []}
          token=''
          className='w-full text-sm'
          isMultiple
        />
      </div>
      <div className='w-full text-sm mb-2'>
        <label>Product Sizes</label>
        <div className=' border border-[#3d3e3f] w-full h-[160px] p-2 mt-2 '>
          <div className='flex items-center gap-3'>
            <p className=''>+ Add Sizes</p>
            <input
              type='text'
              className='border border-[#3d3e3f] p-2 mt-1 outline-none bg-transparent  '
            />
            <FaCheck className='cursor-pointer' />
          </div>
          <div className='mt-6 text-sm flex gap-2'>
            <span className='bg-[#a3a7a7] p-2 rounded-sm'>XL</span>
            <span className='bg-[#a3a7a7] p-2 rounded-sm'>small</span>
          </div>
        </div>
      </div>

      <div className='w-full text-sm my-4'>
        <label>Product Colors</label>
        <div className=' border border-[#3d3e3f] w-full h-[160px] p-2 mt-2 '>
          <div className='flex items-center gap-3'>
            <p className=''>+ Add Colors</p>
            <input
              type='text'
              className='border border-[#3d3e3f] p-2 mt-1 outline-none bg-transparent  '
            />
            <FaCheck className='cursor-pointer' />
          </div>
          <div className='mt-6 text-sm flex gap-2'>
            <span className='bg-[#a3a7a7] p-2 rounded-sm'>White</span>
            <span className='bg-[#a3a7a7] p-2 rounded-sm'>Red</span>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <button className='border border-[#3d3e3f] p-2 mt-2 text-sm w-[150px] h-[40px] hover:bg-[#d3d6d6] '>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default AddNewProduct;
