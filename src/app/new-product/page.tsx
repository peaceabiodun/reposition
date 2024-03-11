import Link from 'next/link';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

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

      <div className='w-full text-sm'>
        <label className=''>Product Description</label>
        <textarea
          className='border border-[#3d3e3f] w-full h-[160px] p-2 mt-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='Describe your product'
        />
      </div>
      <div className='w-full text-sm'>
        <label className=''>Product Image</label>
        <input
          type='file'
          className='border border-[#3d3e3f] w-full h-[160px] p-2 mt-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
        />
      </div>
    </div>
  );
};

export default AddNewProduct;
