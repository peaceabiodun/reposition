import { FaCheck } from 'react-icons/fa';
import { FileUploader } from '../file-uploader/page';
import LocalSideModal from '../side-modal/page';
import { AiOutlineDelete } from 'react-icons/ai';
import { ProductDetailType } from '@/utils/types';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { STORAGE_KEYS } from '@/utils/constants';
import { ENUM_PRODUCT_FILTER_LIST } from '@/utils/enum';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import ErrorModal from '../error-modal/page';

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
  frequently_bought?: boolean;
  category: string;
  pre_order?: boolean;
};

const EditProductModal = ({
  show,
  onClose,
  selectedProduct,
  refresh,
}: EditModalProps) => {
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categoryOptions = [
    { name: ENUM_PRODUCT_FILTER_LIST.SHIRTS },
    { name: ENUM_PRODUCT_FILTER_LIST.SHORTS },
    { name: ENUM_PRODUCT_FILTER_LIST.SHOES },
    { name: ENUM_PRODUCT_FILTER_LIST.SUIT },
    { name: ENUM_PRODUCT_FILTER_LIST.COAT },
    { name: ENUM_PRODUCT_FILTER_LIST.PANTS },
    { name: ENUM_PRODUCT_FILTER_LIST.BAGS },
    { name: ENUM_PRODUCT_FILTER_LIST.ACCESSORIES },
    { name: ENUM_PRODUCT_FILTER_LIST.TSHIRTS },
    { name: ENUM_PRODUCT_FILTER_LIST.HOODIES },
    { name: ENUM_PRODUCT_FILTER_LIST.HAT },
    { name: ENUM_PRODUCT_FILTER_LIST.JACKET },
  ];

  const [formData, setFormData] = useState({} as EditFormDataType);
  const userEmail =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
      : '';

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
        category: selectedProduct?.category,
        frequently_bought: selectedProduct?.frequently_bought,
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
      user_email: userEmail,
      category: selectedCategory ? selectedCategory : formData.category,
      frequently_bought: formData?.frequently_bought,
      pre_order: formData?.pre_order,
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

        <label className=''>Product Price (NGN)</label>
        <input
          type='text'
          className='border border-[#3d3e3f] rounded-sm w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='enter price in NGN'
          value={formData?.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />

        <label className=''>Product Description</label>
        <textarea
          className='border border-[#3d3e3f] rounded-sm w-full h-[160px] my-2 p-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='Describe your product'
          value={formData?.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <div className='w-full mb-2 relative '>
          <p className=''>Product Category</p>
          <div
            onClick={() => {
              console.log('hhjh');
              setShowDropdown(!showDropdown);
            }}
            className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 flex gap-3 justify-between  items-center cursor-pointer '
          >
            <p className='text-[#000]'>
              {selectedCategory ? selectedCategory : formData.category}
            </p>
            <MdOutlineKeyboardArrowDown size={18} className='text-gray-400 ' />
          </div>
          {showDropdown && (
            <div className='bg-[#ecebeb] rounded-sm p-2 absolute shadow-md text-xs sm:text-sm flex flex-col gap-2 z-[999] w-[200px] max-h-[230px] overflow-y-auto'>
              {categoryOptions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedCategory(item.name);
                    setShowDropdown(false);
                  }}
                  className={`${
                    selectedCategory === item.name
                      ? ' font-medium bg-gray-100 rounded-md'
                      : ''
                  } hover:font-medium hover:bg-gray-100 hover:rounded-md p-2 cursor-pointer  `}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
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
          {formData?.images?.map((item, index) => (
            <FileUploader
              key={index}
              fileUrls={[item]}
              setFileUrls={(url) => {
                const updatedImages = [...formData?.images];
                updatedImages[index] = url[0];
                setFormData({ ...formData, images: updatedImages });
              }}
              className='w-full text-sm'
            />
          ))}
        </div>

        <div className='flex my-3 gap-4'>
          <input
            type='checkbox'
            className='accent-[#d3d3d3] cursor-pointer'
            checked={formData?.frequently_bought}
            onChange={(e) =>
              setFormData({ ...formData, frequently_bought: e.target.checked })
            }
          />
          <p className='font-semibold '>Mark Product as Frequently Bought</p>
        </div>

        <div className='flex my-3 gap-4'>
          <input
            type='checkbox'
            className='accent-[#d3d3d3] cursor-pointer'
            checked={formData?.sold_out}
            onChange={(e) =>
              setFormData({ ...formData, sold_out: e.target.checked })
            }
          />
          <p className='font-semibold '>Out Of Stock</p>
        </div>

        <div className='flex my-3 gap-4'>
          <input
            type='checkbox'
            className='accent-[#d3d3d3] cursor-pointer'
            checked={formData?.pre_order}
            onChange={(e) =>
              setFormData({ ...formData, pre_order: e.target.checked })
            }
          />
          <p className='font-semibold '>Mark Product for Pre-Order</p>
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
            {size && !formData?.sizes.find((s) => s === size) ? (
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
            {color && !formData?.colors.find((c) => c === color) ? (
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
      {showErrorMessage && (
        <ErrorModal
          show={showErrorMessage}
          onClose={() => setShowErrorMessage(false)}
          description='An error occured, please check your connection'
        />
      )}
    </LocalSideModal>
  );
};

export default EditProductModal;
