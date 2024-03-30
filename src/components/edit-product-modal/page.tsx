import { FaCheck } from 'react-icons/fa';
import { FileUploader } from '../file-uploader/page';
import LocalSideModal from '../side-modal/page';
import { AiOutlineDelete } from 'react-icons/ai';
import { ProductDetailType } from '@/utils/types';

type EditModalProps = {
  show: boolean;
  onClose: () => void;
  selectedProduct: ProductDetailType | null;
};

type EditFormDataType = {
  name: string;
};
const EditProductModal = ({
  show,
  onClose,
  selectedProduct,
}: EditModalProps) => {
  return (
    <LocalSideModal
      isOpen={show}
      onRequestClose={onClose}
      title='Edit Product Details'
    >
      <div className='text-sm mt-4'>
        <label className=''>Product Name</label>
        <input
          type='text'
          className='border border-[#3d3e3f] rounded-sm w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='e.g Utility Jacket'
        />

        <label className=''>Product Price</label>
        <input
          type='text'
          className='border border-[#3d3e3f] rounded-sm w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='$100'
        />

        <label className=''>Product Description</label>
        <textarea
          className='border border-[#3d3e3f] rounded-sm w-full h-[160px] my-2 p-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='Describe your product'
        />
        <div className='w-full'>
          <label className=''>Product Weight</label>
          <div className='flex w-full items-center'>
            <input
              type='tel'
              className='border-y border-l rounded-l-sm rounded-r-none border-[#3d3e3f] w-full p-2 mt-y outline-none bg-transparent placeholder:text-[#9fa1a3]'
              placeholder='weight in kg'
            />
            <div className='border-y border-r rounded-r-sm rounded-l-none border-[#3d3e3f] p-2 my-2'>
              Kg
            </div>
          </div>
        </div>
        <p className=''>Product Image(s)</p>
        <FileUploader
          fileUrls={[]}
          setFileUrls={() => []}
          token=''
          className='w-full text-sm '
          isMultiple
        />

        <div className='flex mb-2 gap-4'>
          <p className='font-semibold '>Out Of Stock</p>
          <input type='checkbox' className='accent-[#d3d3d3] cursor-pointer' />
        </div>
        <p>Product Sizes</p>
        <div className='border border-[#3d3e3f] rounded-sm w-full p-3 my-2 h-[160px] overflow-y-scroll'>
          <p className=''>+ Add Sizes</p>
          <div className='flex items-center justify-between gap-3'>
            <input
              type='text'
              className='border border-[#3d3e3f] w-[240px] p-2 mt-1 outline-none bg-transparent  '
            />
            <FaCheck className='cursor-pointer' />
          </div>

          <div className='mt-6 text-sm space-y-3'>
            <div className='flex justify-between items-center gap-3'>
              <span className='bg-[#d3d3d37c] shadow-sm p-2 rounded-sm w-[240px] '>
                XL
              </span>
              <div className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'>
                <AiOutlineDelete className='cursor-pointer' />
              </div>
            </div>

            <div className='flex justify-between items-center gap-3'>
              <span className='bg-[#d3d3d37c] shadow-sm p-2  rounded-sm w-[240px] '>
                Medium
              </span>
              <div className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'>
                <AiOutlineDelete className='cursor-pointer' />
              </div>
            </div>
          </div>
        </div>

        <p>Product Colors</p>
        <div className='border border-[#3d3e3f] rounded-sm w-full p-3 my-2 h-[160px] overflow-y-scroll'>
          <p className=''>+ Add Colors</p>
          <div className='flex items-center justify-between gap-3'>
            <input
              type='text'
              className='border border-[#3d3e3f] w-[240px] p-2 mt-1 outline-none bg-transparent  '
            />
            <FaCheck className='cursor-pointer' />
          </div>

          <div className='mt-6 text-sm space-y-3'>
            <div className='flex justify-between gap-3 items-center'>
              <span className='bg-[#d3d3d37c] shadow-sm p-2 rounded-sm w-[240px] '>
                Red
              </span>
              <div className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'>
                <AiOutlineDelete className='cursor-pointer' />
              </div>
            </div>

            <div className='flex justify-between gap-3 items-center'>
              <span className='bg-[#d3d3d37c] shadow-sm p-2 rounded-sm w-[240px] '>
                Yellow
              </span>
              <div className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'>
                <AiOutlineDelete className='cursor-pointer' />
              </div>
            </div>
          </div>
        </div>

        <button className='border border-[#3d3e3f] rounded-sm p-2 mt-6 mb-9 text-sm w-full h-[40px] hover:bg-[#d3d3d3] '>
          Confirm
        </button>
      </div>
    </LocalSideModal>
  );
};

export default EditProductModal;
