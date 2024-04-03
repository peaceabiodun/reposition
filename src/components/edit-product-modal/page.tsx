import { FaCheck } from 'react-icons/fa';
import { FileUploader } from '../file-uploader/page';
import LocalSideModal from '../side-modal/page';
import { AiOutlineDelete } from 'react-icons/ai';
import { ProductDetailType } from '@/utils/types';
import { useEffect, useState } from 'react';

type EditModalProps = {
  show: boolean;
  onClose: () => void;
  selectedProduct: ProductDetailType | undefined;
};

type EditFormDataType = {
  name: string;
  price: string;
  description: string;
  weight: number | null;
  image: string;
  sizes: string[];
  colors: string[];
  sold_out?: boolean;
};

const EditProductModal = ({
  show,
  onClose,
  selectedProduct,
}: EditModalProps) => {
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');

  const [formData, setFormData] = useState({} as EditFormDataType);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct?.name,
        price: selectedProduct?.price,
        description: selectedProduct?.description,
        weight: selectedProduct?.weight,
        image: selectedProduct?.images[0],
        sizes: selectedProduct?.sizes,
        colors: selectedProduct?.colors,
        sold_out: selectedProduct?.sold_out,
      });
    }
  }, [selectedProduct]);
  const editProductDetails = () => {
    setLoading(true);
  };
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
          value={formData?.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <label className=''>Product Price</label>
        <input
          type='text'
          className='border border-[#3d3e3f] rounded-sm w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='$100'
          value={formData?.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />

        <label className=''>Product Description</label>
        <textarea
          className='border border-[#3d3e3f] rounded-sm w-full h-[160px] my-2 p-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='Describe your product'
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <div className='w-full'>
          <label className=''>Product Weight</label>
          <div className='flex w-full items-center'>
            <input
              type='tel'
              className='border-y border-l rounded-l-sm rounded-r-none border-[#3d3e3f] w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3]'
              placeholder='weight in kg'
              value={formData?.weight ?? 0}
              onChange={(e) =>
                setFormData({ ...formData, weight: parseInt(e.target.value) })
              }
            />
            <div className='border-y border-r rounded-r-sm rounded-l-none border-[#3d3e3f] p-2 my-2'>
              Kg
            </div>
          </div>
        </div>
        <p className='mb-2'>Product Image</p>
        <FileUploader
          fileUrls={[formData?.image] ?? []}
          setFileUrls={(url) => setFormData({ ...formData, image: url[0] })}
          token=''
          className='w-full text-sm'
        />

        <div className='flex my-2 gap-4'>
          <p className='font-semibold '>Out Of Stock</p>
          <input
            type='checkbox'
            className='accent-[#d3d3d3] cursor-pointer'
            checked={formData?.sold_out}
            onChange={(e) =>
              setFormData({ ...formData, sold_out: e.target.checked })
            }
          />
        </div>
        <p>Product Sizes</p>
        <div className='border border-[#3d3e3f] rounded-sm w-full p-3 my-2 h-[160px] overflow-y-scroll'>
          <p className=''>+ Add Sizes</p>
          <div className='flex items-center justify-between gap-3'>
            <input
              type='text'
              className='border border-[#3d3e3f] w-[240px] p-2 mt-1 outline-none bg-transparent'
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
            <FaCheck className='cursor-pointer' />
          </div>

          <div className='mt-6 text-sm space-y-3'>
            {formData?.sizes?.map((item, index) => (
              <div
                key={index}
                className='flex justify-between items-center gap-3'
              >
                <span className='bg-[#d3d3d37c] shadow-sm p-2 rounded-sm w-[240px] '>
                  {item}
                </span>
                <div className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'>
                  <AiOutlineDelete className='cursor-pointer' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p>Product Colors</p>
        <div className='border border-[#3d3e3f] rounded-sm w-full p-3 my-2 h-[160px] overflow-y-scroll'>
          <p className=''>+ Add Colors</p>
          <div className='flex items-center justify-between gap-3'>
            <input
              type='text'
              className='border border-[#3d3e3f] w-[240px] p-2 mt-1 outline-none bg-transparent'
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <FaCheck className='cursor-pointer' />
          </div>

          <div className='mt-6 text-sm space-y-3'>
            {formData?.colors?.map((item, index) => (
              <div
                key={index}
                className='flex justify-between gap-3 items-center'
              >
                <span className='bg-[#d3d3d37c] shadow-sm p-2 rounded-sm w-[240px] '>
                  {item}
                </span>
                <div className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'>
                  <AiOutlineDelete className='cursor-pointer' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className='border border-[#3d3e3f] rounded-sm p-2 mt-6 mb-9 text-sm w-full h-[40px] hover:bg-[#d3d3d3] '>
          {loading ? 'Loading...' : 'Confirm'}
        </button>
      </div>
    </LocalSideModal>
  );
};

export default EditProductModal;
