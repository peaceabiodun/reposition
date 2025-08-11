'use client';

import { FileUploader } from '@/components/file-uploader/page';
import Link from 'next/link';
import {
  MdOutlineArrowBackIosNew,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { useState } from 'react';
import { ProductFormDataType } from '@/utils/types';
import { supabase } from '@/lib/supabase';
import ErrorModal from '@/components/error-modal/page';
import { useRouter } from 'next/navigation';
import SuccessModal from '@/components/success-modal/page';
import { STORAGE_KEYS } from '@/utils/constants';
import { ENUM_PRODUCT_FILTER_LIST } from '@/utils/enum';

const AddNewProduct = () => {
  const router = useRouter();
  const [productFormData, setProductFormData] = useState<ProductFormDataType>({
    name: '',
    price: '',
    description: [],
    weight: 0,
    images: [],
    sizes: [],
    colors: [],
    category: '',
  });

  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const userEmail =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
      : '';
  const addSize = () => {
    if (!size) return;
    const sizes = [...productFormData.sizes, size];
    setProductFormData((data) => ({ ...data, sizes }));
    setSize('');
  };
  const addColor = () => {
    if (!color) return;
    const colors = [...productFormData.colors, color];
    setProductFormData((data) => ({ ...data, colors }));
    setColor('');
  };
  const addDescription = () => {
    if (!description) return;
    const descriptions = [...productFormData.description, description];
    setProductFormData((data) => ({ ...data, description: descriptions }));
    setDescription('');
  };
  const handleRemoveSize = (index: number) => {
    const sizes = productFormData.sizes.filter((_, i) => i !== index);
    setProductFormData((data) => ({ ...data, sizes }));
  };
  const handleRemoveColor = (index: number) => {
    const colors = productFormData.colors.filter((_, i) => i !== index);
    setProductFormData((data) => ({ ...data, colors }));
  };
  const handleRemoveDescription = (index: number) => {
    const descriptions = productFormData.description.filter(
      (_, i) => i !== index
    );
    setProductFormData((data) => ({ ...data, description: descriptions }));
  };

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

  const createProduct = async () => {
    const payload = {
      name: productFormData.name,
      price: productFormData.price,
      product_details: productFormData.description,
      images: productFormData.images,
      sizes: productFormData.sizes,
      colors: productFormData.colors,
      weight: productFormData.weight,
      category: selectedCategory,
      user_email: userEmail,
    };
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').insert(payload);
      if (error !== null) {
        setShowErrorMessage(true);
      } else {
        setShowSuccessMessage(true);
        setProductFormData({
          name: '',
          price: '',
          description: [],
          weight: 0,
          images: [],
          sizes: [],
          colors: [],
          category: '',
        });
      }
    } catch (err: any) {
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };
  const disableButton =
    !productFormData.name ||
    !productFormData.price ||
    productFormData.description.length <= 0 ||
    productFormData.images.length <= 0 ||
    productFormData.colors.length <= 0 ||
    productFormData.sizes.length <= 0;

  return (
    <div className='w-full min-h-screen bg-[#C4BAAF] p-3 xs:p-4'>
      <div className='max-w-[1500px] mx-auto'>
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
              className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
              placeholder='e.g Utility Jacket'
              value={productFormData.name}
              onChange={(e) =>
                setProductFormData({
                  ...productFormData,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className='w-full'>
            <label className=''>Product Price</label>
            <div className='flex w-full items-center'>
              <div className='border-y border-l rounded-l-sm rounded-r-none border-[#3d3e3f] p-2 mt-2'>
                NGN
              </div>
              <input
                type='tel'
                className='border-y border-r rounded-l-none  border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
                placeholder='enter price in NGN'
                value={productFormData.price}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    price: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className='w-full text-sm my-4 '>
          <p>Product Description</p>
          <div className=' border border-[#3d3e3f] rounded-sm w-full h-[160px] p-3 mt-2 overflow-y-scroll '>
            <p className=''>+ Add Descriptions one after another</p>
            <div className='flex items-center  gap-3'>
              <input
                type='text'
                className='border border-[#3d3e3f] rounded-sm w-[240px] p-2 mt-1 outline-none bg-transparent '
                placeholder='e.g Cotton Blend, 100% Cotton'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {description &&
              !productFormData.description.find((s) => s === description) ? (
                <FaCheck className='cursor-pointer' onClick={addDescription} />
              ) : null}
            </div>
            <div className='mt-6 text-sm space-y-3'>
              {productFormData.description.map((item, index) => (
                <div key={index} className='flex gap-3 items-center'>
                  <span className='bg-[#d3d3d37c] shadow-sm p-2 rounded-sm w-auto max-w-[400px] text-wrap '>
                    {item}
                  </span>
                  <div
                    className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'
                    onClick={() => handleRemoveDescription(index)}
                  >
                    <AiOutlineDelete className='cursor-pointer' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='my-4 text-sm w-full flex flex-col sm:flex-row gap-4 sm:gap-6'>
          <div className='w-full'>
            <label className=''>Product Weight</label>
            <div className='flex w-full items-center'>
              <input
                type='tel'
                className='border-y border-l rounded-l-sm rounded-r-none border-[#3d3e3f] w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#9fa1a3]'
                placeholder='weight in kg'
                value={productFormData.weight ?? 0}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const parsedValue = parseInt(inputValue);
                  if (!isNaN(parsedValue)) {
                    setProductFormData({
                      ...productFormData,
                      weight: parsedValue,
                    });
                  } else {
                    setProductFormData({
                      ...productFormData,
                      weight: 0,
                    });
                  }
                }}
              />
              <div className='border-y border-r rounded-r-sm rounded-l-none border-[#3d3e3f] p-2 mt-2'>
                Kg
              </div>
            </div>
          </div>

          <div className='w-full'>
            <p className=''>Product Category</p>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 flex gap-3 justify-between  items-center cursor-pointer relative '
            >
              <p
                className={`${
                  selectedCategory && selectedCategory !== ''
                    ? 'text-[#000]'
                    : ' text-[#9fa1a3]'
                } `}
              >
                {' '}
                {selectedCategory ? selectedCategory : 'Select a category'}
              </p>
              <MdOutlineKeyboardArrowDown
                size={18}
                className='text-gray-400 '
              />
            </div>
            {showDropdown && (
              <div className='bg-[#ecebeb] rounded-sm p-2 absolute shadow-md text-xs sm:text-sm flex flex-col gap-2 z-50 w-[200px]'>
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
        </div>
        <div className='w-full text-sm my-4'>
          <label className=''>Product Image(s)</label>
          <FileUploader
            fileUrls={productFormData.images}
            setFileUrls={(img) =>
              setProductFormData({ ...productFormData, images: img })
            }
            className='w-full text-sm'
            isMultiple
          />
        </div>

        <div className='my-4 text-sm w-full flex flex-col sm:flex-row gap-4 sm:gap-6'>
          <div className='w-full text-sm '>
            <p>Product Sizes</p>
            <div className=' border border-[#3d3e3f] rounded-sm w-full h-[160px] p-3 mt-2 overflow-y-scroll '>
              <p className=''>+ Add Sizes</p>
              <div className='flex items-center  gap-3'>
                <input
                  type='text'
                  className='border border-[#3d3e3f] rounded-sm w-[240px] p-2 mt-1 outline-none bg-transparent '
                  placeholder='e.g Medium'
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
                {size && !productFormData.sizes.find((s) => s === size) ? (
                  <FaCheck className='cursor-pointer' onClick={addSize} />
                ) : null}
              </div>
              <div className='mt-6 text-sm space-y-3'>
                {productFormData.sizes.map((item, index) => (
                  <div key={index} className='flex gap-3 items-center'>
                    <span className='bg-[#d3d3d37c] shadow-sm p-2 rounded-sm w-[240px] '>
                      {item}
                    </span>
                    <div
                      className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'
                      onClick={() => handleRemoveSize(index)}
                    >
                      <AiOutlineDelete className='cursor-pointer' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='w-full text-sm '>
            <p>Product Colors</p>
            <div className=' border border-[#3d3e3f] rounded-sm w-full h-[160px] p-3 mt-2 overflow-y-scroll '>
              <p className=''>+ Add Colors</p>
              <div className='flex items-center  gap-3'>
                <input
                  type='text'
                  className='border border-[#3d3e3f] rounded-sm w-[240px] p-2 mt-1 outline-none bg-transparent '
                  placeholder='e.g White'
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                {color && !productFormData.colors.find((s) => s === color) ? (
                  <FaCheck className='cursor-pointer' onClick={addColor} />
                ) : null}
              </div>
              <div className='mt-6 text-sm space-y-3'>
                {productFormData.colors.map((item, index) => (
                  <div key={index} className='flex gap-3 items-center'>
                    <span className='bg-[#d3d3d37c] shadow-sm p-2 rounded-sm w-[240px] '>
                      {item}
                    </span>
                    <div
                      className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'
                      onClick={() => handleRemoveColor(index)}
                    >
                      <AiOutlineDelete className='cursor-pointer' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {disableButton && (
          <div className='text-xs text-red-500'>
            * All fields are required and must be inputted
          </div>
        )}
        <div className='flex items-center justify-center my-6'>
          <button
            onClick={createProduct}
            disabled={disableButton}
            className='border border-[#38271c] rounded-sm p-2 text-sm w-full sm:w-[300px] h-[40px]'
          >
            {loading ? 'Loading...' : ' Confirm'}
          </button>
        </div>
      </div>
      {showErrorMessage && (
        <ErrorModal
          show={showErrorMessage}
          onClose={() => setShowErrorMessage(false)}
          description='An error occured while trying to create a new product'
        />
      )}

      {showSuccessMessage && (
        <SuccessModal
          show={showSuccessMessage}
          onClose={() => setShowSuccessMessage(false)}
          title='Product Created'
          description='You have successfully created a product '
          buttonText='Back to product'
          buttonClick={() => router.push('/')}
        />
      )}
    </div>
  );
};

export default AddNewProduct;
