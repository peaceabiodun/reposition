'use client';

import { FileUploader } from '@/components/file-uploader/page';
import Link from 'next/link';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';

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
        <p>Product Sizes</p>
        <div className=' border border-[#3d3e3f] w-full h-[160px] p-3 mt-2 overflow-y-scroll '>
          <p className=''>+ Add Sizes</p>
          <div className='flex items-center  gap-3'>
            <input
              type='text'
              className='border border-[#3d3e3f] w-[240px] p-2 mt-1 outline-none bg-transparent '
              placeholder='e.g Medium'
            />
            <FaCheck className='cursor-pointer' />
          </div>
          <div className='mt-6 text-sm space-y-3'>
            <div className='flex gap-3 items-center'>
              <span className='bg-[#d3d3d37c] shadow-sm p-2 rounded-sm w-[240px] '>
                Small
              </span>
              <div className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'>
                <AiOutlineDelete className='cursor-pointer' />
              </div>
            </div>
            <div className='flex gap-3 items-center'>
              <span className='bg-[#d3d3d37c] shadow-sm p-2 rounded-sm w-[240px] '>
                Medium
              </span>
              <div className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'>
                <AiOutlineDelete className='cursor-pointer' />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full text-sm my-4'>
        <p>Product Colors</p>
        <div className=' border border-[#3d3e3f] w-full h-[160px] p-3 mt-2 overflow-y-scroll '>
          <p className=''>+ Add Colors</p>
          <div className='flex items-center  gap-3'>
            <input
              type='text'
              className='border border-[#3d3e3f] w-[240px] p-2 mt-1 outline-none bg-transparent  '
            />
            <FaCheck className='cursor-pointer' />
          </div>
          <div className='mt-6 text-sm space-y-3'>
            <div className='flex gap-3 items-center'>
              <span className='bg-[#d3d3d37c] shadow-sm p-2 rounded-sm w-[240px] '>
                Red
              </span>
              <div className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'>
                <AiOutlineDelete className='cursor-pointer' />
              </div>
            </div>
            <div className='flex gap-3 items-center'>
              <span className='bg-[#d3d3d37c] shadow-sm p-2 rounded-sm w-[240px] '>
                Blue
              </span>
              <div className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'>
                <AiOutlineDelete className='cursor-pointer' />
              </div>
            </div>
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
