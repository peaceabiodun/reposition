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
import { HexColorPicker } from 'react-colorful';

type EditModalProps = {
  show: boolean;
  onClose: () => void;
  selectedProduct: ProductDetailType | undefined;
  refresh?: () => void;
};

type EditFormDataType = {
  name: string;
  price: string;
  description: string[];
  sub_description: string;
  weight: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  sold_out?: boolean;
  frequently_bought?: boolean;
  category: string;
  pre_order?: boolean;
  color_blocks: string[];
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
  const [description, setDescription] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState('#38271c');

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
        description: selectedProduct?.product_details,
        sub_description: selectedProduct?.sub_description,
        weight: selectedProduct?.weight,
        images: selectedProduct?.images,
        sizes: selectedProduct?.sizes,
        colors: selectedProduct?.colors,
        sold_out: selectedProduct?.sold_out,
        category: selectedProduct?.category,
        frequently_bought: selectedProduct?.frequently_bought,
        color_blocks: selectedProduct?.color_blocks,
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
  const addDescription = () => {
    if (!description) return;
    const descriptions = [...formData.description, description];
    setFormData((data) => ({ ...data, description: descriptions }));
    setDescription('');
  };

  const addSelectedColor = () => {
    if (currentColor && !selectedColors.includes(currentColor)) {
      const newColors = [...selectedColors, currentColor];
      setSelectedColors(newColors);
      setFormData((data) => ({ ...data, color_blocks: newColors }));
      setShowColorPicker(false);
    }
  };

  const removeSelectedColor = (colorToRemove: string) => {
    const newColors = selectedColors.filter((c) => c !== colorToRemove);
    setSelectedColors(newColors);
    setFormData((data) => ({ ...data, color_blocks: newColors }));
  };

  const handleRemoveSize = (index: number) => {
    const sizes = formData.sizes.filter((_, i) => i !== index);
    setFormData((data) => ({ ...data, sizes }));
  };

  const handleRemoveColor = (index: number) => {
    const colors = formData.colors.filter((_, i) => i !== index);
    setFormData((data) => ({ ...data, colors }));
  };

  const handleRemoveDescription = (index: number) => {
    const descriptions = formData.description.filter((_, i) => i !== index);
    setFormData((data) => ({ ...data, description: descriptions }));
  };

  const editProductDetails = async () => {
    setLoading(true);
    const payload = {
      name: formData?.name,
      price: formData?.price,
      product_details: formData?.description,
      sub_description: formData?.sub_description,
      weight: formData?.weight,
      images: formData?.images,
      sizes: formData?.sizes,
      colors: formData?.colors,
      sold_out: formData?.sold_out,
      user_email: userEmail,
      category: selectedCategory ? selectedCategory : formData.category,
      frequently_bought: formData?.frequently_bought,
      pre_order: formData?.pre_order,
      color_blocks: formData?.color_blocks,
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

        <p className='mt-2'>Product Price (NGN)</p>
        <input
          type='text'
          className='border border-[#38271c] rounded-sm w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='enter price in NGN'
          value={formData?.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />

        <p className='mt-4'>Product Description</p>
        <div className='border border-[#38271c] rounded-sm w-full p-3 my-2 h-[200px] overflow-y-scroll scrollable-div'>
          <p className=''>+ Add Descriptions one after another</p>
          <div className='flex items-center justify-between gap-3'>
            <input
              type='text'
              className='border border-[#38271c] rounded-sm w-[240px] p-2 mt-1 outline-none bg-transparent'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {description &&
            !formData?.description.find((s) => s === description) ? (
              <FaCheck className='cursor-pointer' onClick={addDescription} />
            ) : null}
          </div>

          <div className='mt-6 text-sm space-y-3'>
            {formData?.description?.map((item, index) => (
              <div
                key={index}
                className='flex justify-between items-center gap-3'
              >
                <span className='border border-[#38271c] shadow-sm p-2 rounded-sm w-[240px] '>
                  {item}
                </span>
                <div
                  onClick={() => handleRemoveDescription(index)}
                  className='p-[0.75rem] rounded-lg flex bg-[#a3a3a325]'
                >
                  <AiOutlineDelete className='cursor-pointer' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className='mt-4'>Product Sub-Description</p>
        <input
          type='text'
          className='border border-[#3d3e3f] rounded-sm w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder="e.g Men's wear"
          value={formData?.sub_description}
          onChange={(e) =>
            setFormData({ ...formData, sub_description: e.target.value })
          }
        />

        <div className='w-full mb-2 relative '>
          <p className='mt-4'>Product Category</p>
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
          <label className='mt-4'>Product Weight</label>
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
        <p className='mt-4 mb-2'>Product Image</p>
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

        <p className='mt-4'>Product Sizes</p>
        <div className='border border-[#38271c] rounded-sm w-full p-3 my-2 h-[160px] overflow-y-scroll scrollable-div'>
          <p className=''>+ Add Sizes</p>
          <div className='flex items-center justify-between gap-3'>
            <input
              type='text'
              className='border border-[#38271c] rounded-sm w-[240px] p-2 mt-1 outline-none bg-transparent'
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
                <span className='border border-[#38271c] shadow-sm p-2 rounded-sm w-[240px] '>
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

        <div>
          <p className='mt-4'>Product Color Blocks</p>
          <div className='border border-[#38271c] rounded-sm w-full p-3 my-2 min-h-[120px] text-sm'>
            <div className='flex items-center justify-between mb-3'>
              <p className='font-medium'>Selected Colors</p>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className='px-3 py-1 text-xs border border-[#38271c] rounded-sm hover:bg-[#38271c] hover:text-white transition-colors'
              >
                {showColorPicker ? 'Cancel' : 'Add Color'}
              </button>
            </div>

            {showColorPicker && (
              <div className='mb-4 p-3 border border-[#38271c] rounded-sm bg-gray-50'>
                <div className='flex items-center gap-3 mb-3'>
                  <HexColorPicker
                    color={currentColor}
                    onChange={setCurrentColor}
                    className='w-32 h-32'
                  />
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-8 h-8 rounded border border-gray-300'
                        style={{ backgroundColor: currentColor }}
                      />
                      <input
                        type='text'
                        value={currentColor}
                        onChange={(e) => setCurrentColor(e.target.value)}
                        className='border border-gray-300 rounded px-2 py-1 text-xs w-20'
                        placeholder='#000000'
                      />
                    </div>
                    <button
                      onClick={addSelectedColor}
                      className='px-3 py-1 text-xs bg-[#38271c] text-white rounded-sm hover:bg-[#5a3d2e] transition-colors'
                    >
                      Add Color
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedColors.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {formData?.color_blocks?.map((color, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-2 rounded-full '
                  >
                    <div
                      className='w-4 h-4 rounded-full border border-[#fcd7bf]'
                      style={{ backgroundColor: color }}
                    />

                    <button
                      onClick={() => removeSelectedColor(color)}
                      className='ml-1 text-gray-500 hover:text-red-500 transition-colors'
                    >
                      <AiOutlineDelete size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className=' text-center py-4'>No colors selected yet</p>
            )}
          </div>
        </div>

        <p className='mt-4'>Product Colors</p>
        <div className='border border-[#38271c] rounded-sm w-full p-3 my-2 h-[160px] overflow-y-scroll scrollable-div'>
          <p className=''>+ Add Colors</p>
          <div className='flex items-center justify-between gap-3'>
            <input
              type='text'
              className='border border-[#38271c] rounded-sm w-[240px] p-2 mt-1 outline-none bg-transparent'
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
                <span className='border border-[#38271c] shadow-sm p-2 rounded-sm w-[240px] '>
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
          className='border border-[#38271c]  text-[#38271c] rounded-sm p-2 mt-6 mb-9 text-sm w-full h-[40px] hover:bg-[#7e5d5d67] transition-all duration-300'
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
