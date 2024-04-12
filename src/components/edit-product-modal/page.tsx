import { FaCheck } from 'react-icons/fa';
import { FileUploader } from '../file-uploader/page';
import LocalSideModal from '../side-modal/page';
import { AiOutlineDelete } from 'react-icons/ai';
import { ProductDetailType } from '@/utils/types';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type EditModalProps = {
  show: boolean;
  onClose: () => void;
  selectedProduct: ProductDetailType | undefined;
  refresh?: () => void;
};

type EditFormDataType = {
  name: string;
  price: string;
  description: string;
  weight: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  sold_out?: boolean;
};

const EditProductModal = ({
  show,
  onClose,
  selectedProduct,
  refresh,
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
        images: selectedProduct?.images,
        sizes: selectedProduct?.sizes,
        colors: selectedProduct?.colors,
        sold_out: selectedProduct?.sold_out,
      });
    }
  }, [selectedProduct]);

  const addSize = () => {
    if (!size) return;
    const sizes = [...formData.sizes, size];
    setFormData((data) => ({ ...data, sizes }));
    setSize('');
  };
  const addColor = () => {
    if (!color) return;
    const colors = [...formData.colors, color];
    setFormData((data) => ({ ...data, colors }));
    setColor('');
  };

  const handleRemoveSize = (index: number) => {
    const sizes = formData.sizes.filter((_, i) => i !== index);
    setFormData((data) => ({ ...data, sizes }));
  };

  const handleRemoveColor = (index: number) => {
    const colors = formData.colors.filter((_, i) => i !== index);
    setFormData((data) => ({ ...data, colors }));
  };

  const editProductDetails = async () => {
    setLoading(true);
    const payload = {
      name: formData?.name,
      price: formData?.price,
      description: formData?.description,
      weight: formData?.weight,
      images: formData?.images,
      sizes: formData?.sizes,
      colors: formData?.colors,
      sold_out: formData?.sold_out,
    };
    try {
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', selectedProduct?.id);
      console.log(data);
      onClose();
      refresh?.();
    } catch {
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
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
              value={formData?.weight ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) || value === '') {
                  setFormData({
                    ...formData,
                    weight: value === '' ? null : parseInt(value),
                  });
                }
              }}
            />
            <div className='border-y border-r rounded-r-sm rounded-l-none border-[#3d3e3f] p-2 my-2'>
              Kg
            </div>
          </div>
        </div>
        <p className='mb-2'>Product Image</p>
        <div className='flex flex-col gap-3'>
          {formData?.images.map((item, index) => (
            <FileUploader
              key={index}
              fileUrls={[item]}
              setFileUrls={(url) => {
                const updatedImages = [...formData.images];
                updatedImages[index] = url[0];
                setFormData({ ...formData, images: updatedImages });
              }}
              className='w-full text-sm'
            />
          ))}
        </div>

        <div className='flex my-3 gap-4'>
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
            {size && !formData.sizes.find((s) => s === size) ? (
              <FaCheck className='cursor-pointer' onClick={addSize} />
            ) : null}
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
                <div
                  onClick={() => handleRemoveSize(index)}
                  className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'
                >
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
            {color && !formData.colors.find((c) => c === color) ? (
              <FaCheck className='cursor-pointer' onClick={addColor} />
            ) : null}
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
                <div
                  onClick={() => handleRemoveColor(index)}
                  className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'
                >
                  <AiOutlineDelete className='cursor-pointer' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={editProductDetails}
          className='border border-[#909192] bg-[#523f3f9c] text-[#e4e0e0] rounded-sm p-2 mt-6 mb-9 text-sm w-full h-[40px] hover:bg-[#7e5d5dab]'
        >
          {loading ? 'Loading...' : 'Confirm'}
        </button>
      </div>
    </LocalSideModal>
  );
};

export default EditProductModal;
