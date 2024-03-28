'use client';

import Header from '@/components/header/page';
import Image from 'next/image';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { CiTrash } from 'react-icons/ci';
import { GiTakeMyMoney } from 'react-icons/gi';
import { useEffect, useState } from 'react';
import CheckoutModal from '@/components/checkout-modal/page';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ErrorModal from '@/components/error-modal/page';
import { DeliveryDetailsType, ShoppingBagType } from '@/utils/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { ThreeCircles } from 'react-loader-spinner';
import SuccessModal from '@/components/success-modal/page';
import { useRouter } from 'next/navigation';
import { usePaystackPayment } from 'react-paystack';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

type FormDataType = {
  quantity: string;
} & ShoppingBagType;
const Bag = () => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [bagItems, setBagItems] = useState<FormDataType[]>([]);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shippingFee, SetShippingFee] = useState<number>(0);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetailsType>({
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    city: '',
    address: '',
    zip_code: '',
    phone_number: '',
    shipping: 'standard',
  });

  const countryList = [
    'Nigeria',
    'Ghana',
    'South Africa',
    'United State of America',
    'Canada',
    'Uk',
  ];
  const getBagItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('shopping-bag').select();
      setBagItems(data?.map((item) => ({ ...item, quantity: '1' })) ?? []);

      if (error) {
        setShowErrorModal(true);
      }
    } catch {
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBagItems();
  }, []);

  const removeItemFromBag = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shopping-bag')
        .delete()
        .eq('id', id);
      if (error) {
        console.log(error);
      } else {
        setShowDeleteSuccessModal(true);
      }
    } catch {
      console.log('error');
    }
  };

  const updateQuantity = (quantity: string, index: number) => {
    const newItems = [...bagItems];
    const newItem = { ...newItems[index], quantity };
    newItems[index] = newItem;
    setBagItems(newItems);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    for (const item of bagItems) {
      total += parseFloat(item.price) * parseInt(item.quantity);
    }
    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [bagItems]);

  const calculateShippingFee = () => {
    const totalWeight = bagItems.reduce((acc, item) => acc + item.weight, 0);
    let shippingFee = 0;
    if (totalWeight <= 0) {
      // No items in the bag, shipping fee is 0
      shippingFee = 0;
    } else if (totalWeight === 1) {
      // If total weight is 1kg, shipping fee is $4
      shippingFee = 4;
    } else {
      // For each additional kilogram, add $4 to the shipping fee
      shippingFee = 4 * totalWeight;
    }
    SetShippingFee(shippingFee);
  };

  useEffect(() => {
    calculateShippingFee();
  }, [bagItems]);
  const config = {
    reference: new Date().getTime().toString(),
    email: 'abiodunpeace8@gmail.com',
    amount: 20000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  };

  // you can call this function anything
  const onSuccess = (reference: string) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed');
  };

  const initializePayment = usePaystackPayment(config);

  //implement epmty state
  return (
    <div className='w-full min-h-screen bg-[#dbd9d2] '>
      <Header />
      <Link
        href='/'
        className='mt-4 gap-1 flex text-sm items-center px-3 xs:px-4'
      >
        <MdOutlineArrowBackIosNew size={20} />
        Back
      </Link>
      <h2 className='text-sm font-medium text-center my-4 px-3 xs:px-4'>
        Shopping Bag ({bagItems.length})
      </h2>
      {bagItems.length <= 0 ? (
        <div className='flex justify-center items-center p-3 my-6 text-sm h-full'>
          No item in your shopping bag
        </div>
      ) : (
        <div className='my-4 space-y-6 px-3 xs:px-4'>
          <h2 className='border-b border-[#a1a1a19c] w-full py-3 text-sm'>
            Order Summary
          </h2>

          {loading ? (
            <div className='flex justify-center items-center p-3 '>
              <ThreeCircles
                visible={true}
                height={50}
                width={50}
                color='#b4b4b4ad'
                ariaLabel='three-circles-loading'
                wrapperClass='my-4'
              />
            </div>
          ) : (
            bagItems.map((item, index) => (
              <div
                key={item.id}
                className='border-b border-[#a1a1a19c] w-full p-3 flex text-xs md:text-sm gap-3 justify-between items-center'
              >
                <Image
                  src={item.image}
                  alt='product_image'
                  width='80'
                  height='90'
                  className='h-[90px] object-cover'
                />
                <div className='flex flex-col gap-3 '>
                  <p className=''>
                    {item.name} [{item.color}]
                  </p>
                  <p>Size: {item.size}</p>
                </div>
                <div className='flex flex-col gap-3 '>
                  <div className='flex gap-2 items-center'>
                    <h2>Qty</h2>
                    <input
                      type='text'
                      value={item.quantity}
                      onChange={(e) => updateQuantity(e.target.value, index)}
                      className='outline-none border-b border-[#3d3e3f] bg-transparent w-[36px] p-2 h-[24px]'
                    />
                  </div>
                  <p>${item.price}</p>
                </div>
                <div
                  onClick={() => removeItemFromBag(item.id)}
                  className='cursor-pointer'
                >
                  <CiTrash size={20} />
                </div>
              </div>
            ))
          )}
          <div className='flex flex-col md:flex-row gap-4 md:gap-12 '>
            <div className=' w-full text-xs md:text-sm '>
              <h2 className='border-b border-[#a1a1a19c]  w-full py-3 text-sm'>
                Delivery Details
              </h2>
              <input
                type='text'
                placeholder='First Name'
                value={deliveryDetails.first_name}
                onChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    first_name: e.target.value,
                  })
                }
                className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent mt-5'
              />
              <input
                type='text'
                placeholder='Last Name'
                value={deliveryDetails.last_name}
                onChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    last_name: e.target.value,
                  })
                }
                className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent my-5'
              />
              <input
                type='email'
                placeholder='Email'
                value={deliveryDetails.email}
                onChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    email: e.target.value,
                  })
                }
                className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent '
              />

              <input
                type='text'
                placeholder='City'
                value={deliveryDetails.city}
                onChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    city: e.target.value,
                  })
                }
                className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent my-5'
              />
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className={`${
                  selectedCountry !== '' ? 'text-[#000]' : 'text-gray-400'
                } border border-[#3d3e3f] w-full p-2 flex gap-3 justify-between text-gray-400 items-center cursor-pointer relative`}
              >
                <p>{selectedCountry ? selectedCountry : 'Country'}</p>
                <MdOutlineKeyboardArrowDown
                  size={18}
                  className='text-gray-400 '
                />
              </div>
              {showDropdown && (
                <div className='bg-[#ecebeb] rounded-sm p-2 absolute  shadow-md text-xs sm:text-sm flex flex-col gap-2 z-[999]'>
                  {countryList.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedCountry(item)}
                      className={`${
                        selectedCountry === item
                          ? ' font-medium bg-gray-100'
                          : ''
                      } hover:font-medium hover:bg-gray-100 p-2 cursor-pointer`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
              <input
                type='text'
                placeholder='Delivery Address'
                value={deliveryDetails.address}
                onChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    address: e.target.value,
                  })
                }
                className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent my-5'
              />
              <input
                type='text'
                placeholder='Zip code'
                value={deliveryDetails.zip_code}
                onChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    zip_code: e.target.value,
                  })
                }
                className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent '
              />
              <input
                type='text'
                placeholder='Phone number'
                value={deliveryDetails.phone_number}
                onChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    phone_number: e.target.value,
                  })
                }
                className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent my-5'
              />
              <div className='text-xs text-red-500 mt-2'>
                * All details are required{' '}
              </div>
            </div>

            <div className=' w-full text-xs md:text-sm '>
              <h2 className='border-b border-[#a1a1a19c] w-full py-3 text-sm'>
                Shipping Method
              </h2>
              <div className='flex gap-2 items-start mt-5'>
                <input
                  type='checkbox'
                  checked={deliveryDetails.shipping === 'standard'}
                  className='accent-black mt-1'
                />
                <div>
                  <h3 className='font-medium'>Standard Courier</h3>
                  <div>$20</div>
                  <p>
                    Delivery takes up to 7 business days. Estimated delivery
                    time once the order has shipped.
                  </p>
                </div>
              </div>
              <h2 className='border-b border-[#a1a1a19c] mt-3 w-full py-3 text-sm'>
                Billing Summary
              </h2>
              <div className='space-y-3 mt-3'>
                <div className='flex gap-3 justify-between'>
                  <p>Item total</p>
                  <p>${totalPrice.toFixed(2)}</p>
                </div>
                <div className='flex gap-3 justify-between'>
                  <p>Shipping fee</p>
                  <p>${shippingFee.toFixed(2)}</p>
                </div>
                <div className='flex gap-3 justify-between'>
                  <p>Discount Fee</p>
                  <p>--</p>
                </div>
                <div className='flex gap-3 justify-between'>
                  <p>Duties, taxes & fees</p>
                  <p>--</p>
                </div>
                <div className='flex gap-3 justify-between font-bold'>
                  <p className=''>Total</p>
                  <p>${(totalPrice + shippingFee).toFixed(2)}</p>
                </div>
              </div>

              <div className=' w-full'>
                <h2 className='border-b border-[#a1a1a19c] w-full mt-3 py-3 text-sm'>
                  Payment Options
                </h2>
                <div className='my-3 flex items-center gap-2'>
                  <Image
                    alt='master-card'
                    src={'/master-card-icon.svg'}
                    width={50}
                    height={50}
                  />
                  <Image
                    alt='visa-card'
                    src={'/visa-icon.svg'}
                    width={50}
                    height={50}
                  />
                  <Image
                    alt='paystack'
                    src={'/paystack-icon.svg'}
                    width={30}
                    height={30}
                  />
                  <Image
                    alt='bank-transfer'
                    src={'/bank-transfer-icon.svg'}
                    width={40}
                    height={40}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {bagItems.length <= 0 ? null : (
        <div className='flex justify-center py-6 px-3 xs:px-4'>
          <button
            onClick={() => {
              initializePayment({ onSuccess, onClose });
            }}
            className='border border-[#3d3e3f] w-full sm:w-[300px] p-2 text-xs md:text-sm mx-3'
          >
            Complete Order
          </button>
        </div>
      )}
      <CheckoutModal
        show={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
      />
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          description='Sorry an error occured while loading the products'
        />
      )}
      {showDeleteSuccessModal && (
        <SuccessModal
          show={showDeleteSuccessModal}
          onClose={() => setShowDeleteSuccessModal(false)}
          title='Product removed from Cart'
          buttonText='Go back to shopping'
          buttonClick={() => router.push('/home')}
        />
      )}
    </div>
  );
};

export default Bag;
