'use client';

import Header from '@/components/header/page';
import Image from 'next/image';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { CiTrash } from 'react-icons/ci';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ErrorModal from '@/components/error-modal/page';
import {
  ConversionRateType,
  DeliveryDetailsType,
  ShoppingBagType,
} from '@/utils/types';
import { ThreeCircles } from 'react-loader-spinner';
import SuccessModal from '@/components/success-modal/page';
import { useRouter } from 'next/navigation';
import { usePaystackPayment } from 'react-paystack';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { STORAGE_KEYS } from '@/utils/constants';
import { CiLocationOn } from 'react-icons/ci';
import axios from 'axios';
import { validateEmail } from '@/utils/functions';
import PaymentReceipt from '../../components/receipt/page';

type FormDataType = {
  quantity: string;
} & ShoppingBagType;

const Bag = () => {
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [bagItems, setBagItems] = useState<FormDataType[]>([]);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [Currencies, setCurrencies] = useState<ConversionRateType>();
  const [loadingCurrency, setLoadingCurrency] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shippingFee, SetShippingFee] = useState<number>(0);
  const [formError, setFormError] = useState<Partial<DeliveryDetailsType>>({});
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderReference, setOrderReference] = useState('');

  const exchangeRateApiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_KEY;

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetailsType>({
    first_name: '',
    last_name: '',
    user_email: '',
    country: selectedCountry,
    city: '',
    address: '',
    zip_code: '',
    phone_number: '',
  });

  const countryList = [
    'Nigeria',
    'Ghana',
    'Kenya',
    'Rwanda',
    'South Africa',
    'United State of America',
    'Canada',
    'Uk',
  ];
  const userId =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_ID)
      : '';

  // fetching cart items based on local storage

  useEffect(() => {
    const existingBagItemsJSON = localStorage.getItem(STORAGE_KEYS.BAG_ITEMS);
    if (existingBagItemsJSON) {
      const existingBagItems = JSON.parse(existingBagItemsJSON);
      setBagItems(
        existingBagItems?.map((item: any) => ({ ...item, quantity: '1' })) ?? []
      );
    }
  }, []);

  // const getBagItems = async () => {
  //   setLoading(true);
  //   try {
  //     const { data, error } = await supabase
  //       .from('shopping-bag')
  //       .select('*')
  //       .eq('user_id', userId);

  //     setBagItems(data?.map((item) => ({ ...item, quantity: '1' })) ?? []);

  //     if (error) {
  //       setShowErrorModal(true);
  //     }
  //   } catch {
  //     setShowErrorModal(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getBagItems();
  // }, []);

  // const removeItemFromBag = async (id: string) => {
  //   try {
  //     const { error } = await supabase
  //       .from('shopping-bag')
  //       .delete()
  //       .eq('id', id);
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       setShowDeleteSuccessModal(true);
  //       //getBagItems();
  //     }
  //   } catch {
  //     console.log('error');
  //   }
  // };

  const removeItemFromBag = (id: string) => {
    const updatedBagItems = bagItems.filter((item) => item.id !== id);
    localStorage.setItem(
      STORAGE_KEYS.BAG_ITEMS,
      JSON.stringify(updatedBagItems)
    );
    setBagItems(updatedBagItems);
    setShowDeleteSuccessModal(true);
  };

  // const getDeliveryDetails = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('delivery-details')
  //       .select('*')
  //       .eq('user_id', userId);
  //     setSavedDeliveryDetails(data ?? []);

  //     if (error) {
  //       setShowErrorModal(true);
  //     }
  //   } catch {
  //     setShowErrorModal(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getDeliveryDetails();
  // }, []);
  const updateQuantity = (quantity: string, index: number) => {
    const newItems = [...bagItems];
    const newItem = { ...newItems[index], quantity };
    newItems[index] = newItem;
    setBagItems(newItems);
    calculateTotalPrice();
    calculateShippingFee();
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
    const totalWeight = bagItems.reduce(
      (acc, item) => acc + item.weight * Number(item.quantity),
      0
    );
    let shippingFee = 0;
    if (totalWeight <= 0) {
      // No items in the bag, shipping fee is 0
      shippingFee = 0;
    } else if (totalWeight === 1) {
      shippingFee = 20;
    } else if (totalWeight === 2) {
      shippingFee = 55;
    } else {
      shippingFee = 20 * totalWeight;
    }
    SetShippingFee(shippingFee);
  };

  useEffect(() => {
    calculateShippingFee();
  }, [bagItems]);

  const formIsValid = (): boolean => {
    setFormError({});
    const first_name = deliveryDetails.first_name.trim();
    const last_name = deliveryDetails.last_name.trim();
    const user_email = deliveryDetails.user_email.trim();
    const city = deliveryDetails.city.trim();
    const address = deliveryDetails.address.trim();
    const zip_code = deliveryDetails.zip_code.trim();
    const phone_number = deliveryDetails.phone_number.trim();
    const country = deliveryDetails.country.trim();

    let isValid = true;

    if (!first_name) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        first_name: 'First name is required',
      }));
      isValid = false;
    }
    if (!last_name) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        last_name: 'Last name is required',
      }));
      isValid = false;
    }
    if (!user_email) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        user_email: 'Valid email is required',
      }));
      isValid = false;
    }
    if (!city) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        city: 'City is required',
      }));
      isValid = false;
    }
    if (!address) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        address: 'Address is required',
      }));
      isValid = false;
    }
    if (!zip_code) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        zip_code: 'Zip code is required',
      }));
      isValid = false;
    }

    if (!phone_number) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        phone_number: 'Valid phone number is required',
      }));
      isValid = false;
    }
    if (!country) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        country: 'Country is required',
      }));
      isValid = false;
    }
    return isValid;
  };

  const updateFormData = (key: string, value: string) => {
    setFormError((p) => ({ ...p, [key]: false }));
    setDeliveryDetails((p) => ({ ...p, [key]: value }));
  };

  // const updateDeliveryDetails = async () => {
  //   if (!formIsValid() ?? !validateEmail(deliveryDetails.user_email)) return;
  //   const payload = {
  //     first_name: deliveryDetails.first_name,
  //     last_name: deliveryDetails.last_name,
  //     user_email: deliveryDetails.user_email,
  //     country: selectedCountry,
  //     city: deliveryDetails.city,
  //     address: deliveryDetails.address,
  //     zip_code: deliveryDetails.zip_code,
  //     phone_number: deliveryDetails.phone_number,
  //   };
  //   try {
  //     const { data, error } = await supabase
  //       .from('delivery-details')
  //       .insert(payload);
  //     setDeliveryDetails({
  //       first_name: '',
  //       last_name: '',
  //       user_email: '',
  //       country: '',
  //       city: '',
  //       address: '',
  //       zip_code: '',
  //       phone_number: '',
  //     });
  //   } catch (err: any) {
  //     console.log(err);
  //   }
  // };

  const getConversionRate = async () => {
    setLoadingCurrency(true);
    try {
      const res = await axios.get(
        `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/USD`
      );

      setCurrencies(res?.data?.conversion_rates);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoadingCurrency(false);
    }
  };

  useEffect(() => {
    getConversionRate();
  }, []);

  const generateOrderNumber = (maxValue: number) => {
    const randomNumber = Math.random();
    const scaledNumber = Math.floor(randomNumber * maxValue) + 1;
    return scaledNumber;
  };

  const orderPayload = {
    first_name: deliveryDetails.first_name,
    last_name: deliveryDetails.last_name,
    user_email: deliveryDetails.user_email,
    country: selectedCountry,
    city: deliveryDetails.city,
    address: deliveryDetails.address,
    zip_code: deliveryDetails.zip_code,
    phone_number: deliveryDetails.phone_number,
    product_details: bagItems.map((itm) => ({
      name: itm.name,
      price: itm.price,
      quantity: itm.quantity,
    })),
    amount_paid:
      (totalPrice + shippingFee) * parseInt(Currencies?.NGN ?? '') * 100,
    shipping_fee: shippingFee,
    order_id: generateOrderNumber(100000),
    status: 'processing',
  };
  const orderConfirmationDetails = async (orderReference: string) => {
    try {
      const updatedOrderPayload = {
        ...orderPayload,
        reference: orderReference,
      };
      const { data, error } = await supabase
        .from('orders')
        .insert(updatedOrderPayload);
      setShowReceipt(true);
    } catch (err: any) {
      console.log(err);
    }
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: deliveryDetails.user_email,
    amount: (totalPrice + shippingFee) * parseInt(Currencies?.NGN ?? '') * 100, //totalPrice + shippingFee Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    Currency: 'NGN',
    metadata: {
      products: '1',
    },
  } as any;

  const initializePayment: any = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    // Implementation for whatever you want to do with reference and after success call.
    setOrderReference(reference.reference);
    if (reference.message === 'Approved') {
      orderConfirmationDetails(reference.reference);
    }
  };

  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed');
  };

  // const isDeliveryDetailsComplete = () => {
  //   return Object.values(deliveryDetails).every((value) => value.trim() !== '');
  // };

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
      ) : loading ? (
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
        <div className='my-4 space-y-6 px-3 xs:px-4'>
          <h2 className='border-b border-[#a1a1a19c] w-full py-3 text-sm'>
            Order Summary
          </h2>

          {bagItems?.map((item, index) => (
            <div
              key={item.id}
              className='border-b border-[#a1a1a19c] w-full p-3 flex text-xs md:text-sm gap-3 justify-between items-center'
            >
              <Image
                src={item?.image ?? '/placeholder.png'}
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
                    className='outline-none border-b rounded-none border-[#3d3e3f] bg-transparent w-[36px] p-2 h-[24px]'
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
          ))}
          <div className='flex flex-col md:flex-row gap-4 md:gap-12 '>
            <div className=' w-full text-xs md:text-sm '>
              <div className='border-b border-[#a1a1a19c] w-full flex gap-3 justify-between py-3 text-sm'>
                <h2>Delivery Details</h2>
                {/* {savedDeliveryDetails.length > 0 && (
                    <h2
                      onClick={() => setAddDeliveryDetail(false)}
                      className='font-semibold cursor-pointer'
                    >
                      Use saved delivery details
                    </h2>
                  )} */}
              </div>
              <div className='w-full mt-5'>
                <label>First Name</label>

                <input
                  type='text'
                  placeholder='E.g Walter'
                  value={deliveryDetails.first_name}
                  onChange={(e) => updateFormData('first_name', e.target.value)}
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
                />
                {formError.first_name && (
                  <div className='text-xs text-red-500 mt-2'>
                    {formError.first_name}
                  </div>
                )}
              </div>
              <div className='my-5'>
                <label>Last Name</label>
                <input
                  type='text'
                  placeholder='E.g White'
                  value={deliveryDetails.last_name}
                  onChange={(e) => updateFormData('last_name', e.target.value)}
                  className='border border-[#3d3e3f] rounded-sm w-full mt-2 p-2 outline-none bg-transparent '
                />
                {formError.last_name && (
                  <div className='text-xs text-red-500 mt-2'>
                    {formError.last_name}
                  </div>
                )}
              </div>
              <div>
                <label>Email</label>
                <input
                  type='email'
                  placeholder='E.g white@gmail.com'
                  value={deliveryDetails.user_email}
                  onChange={(e) => updateFormData('user_email', e.target.value)}
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 outline-none bg-transparent mt-2 '
                />
                {!validateEmail(deliveryDetails.user_email) &&
                  formError.user_email && (
                    <div className='text-[10px] text-red-500 mt-2'>
                      {formError.user_email}
                    </div>
                  )}
              </div>
              <div className='my-5'>
                <label> City</label>
                <input
                  type='text'
                  placeholder='E.g Los Angeles'
                  value={deliveryDetails.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 outline-none bg-transparent mt-2 '
                />
                {formError.city && (
                  <div className='text-[10px] text-red-500 mt-2'>
                    {formError.city}
                  </div>
                )}
              </div>
              <p className='mb-2'>Country </p>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className={`border  text-gray-400 border-[#3d3e3f] rounded-sm w-full p-2 flex gap-3 justify-between  items-center cursor-pointer relative`}
              >
                <p
                  className={`${
                    selectedCountry && selectedCountry !== ''
                      ? 'text-[#000]'
                      : ' text-gray-400'
                  } `}
                >
                  {selectedCountry ? selectedCountry : 'E.g United States'}
                </p>
                <MdOutlineKeyboardArrowDown
                  size={18}
                  className='text-gray-400 '
                />
              </div>
              {showDropdown && (
                <div className='bg-[#ecebeb] rounded-sm p-2 absolute shadow-md text-xs sm:text-sm flex flex-col gap-2 z-50 max-h-[230px] overflow-y-auto'>
                  {countryList.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedCountry(item);
                        setShowDropdown(false);
                      }}
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
              <div className='my-5'>
                <label>Address</label>
                <input
                  type='text'
                  placeholder='E.g No 5, Centinela Avenue, Los Angeles, USA'
                  value={deliveryDetails.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 outline-none bg-transparent mt-2 '
                />
                {formError.address && (
                  <div className='text-[10px] text-red-500 mt-2'>
                    {formError.address}
                  </div>
                )}
              </div>
              <div>
                <label>Zip code</label>

                <input
                  type='text'
                  placeholder='E.g 90004'
                  value={deliveryDetails.zip_code}
                  onChange={(e) => updateFormData('zip_code', e.target.value)}
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 outline-none bg-transparent mt-2 '
                />
                {formError.zip_code && (
                  <div className='text-[10px] text-red-500 mt-2'>
                    {formError.zip_code}
                  </div>
                )}
              </div>
              <div className='my-5'>
                <label>Phone Number</label>
                <input
                  type='text'
                  placeholder='E.g +213 90445678'
                  value={deliveryDetails.phone_number}
                  onChange={(e) =>
                    updateFormData('phone_number', e.target.value)
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 outline-none bg-transparent mt-2'
                />
                {formError.phone_number && (
                  <div className='text-[10px] text-red-500 mt-2'>
                    {formError.phone_number}
                  </div>
                )}
              </div>
            </div>

            {/* <div className=' w-full text-xs md:text-sm'>
                <h2 className='border-b border-[#a1a1a19c] w-full py-3 text-sm'>
                  Delivery Details
                </h2>
                {savedDeliveryDetails.map((item, index) => (
                  <div
                    key={index}
                    className={`${
                      selectedDeliveryDetail === item
                        ? 'border border-[#a1a1a19c] p-2'
                        : ''
                    } flex gap-2 mt-5 items-center`}
                    onClick={() => setSelectedDeliveryDetail(item)}
                  >
                    <CiLocationOn size={18} />
                    <div className=''>
                      <p className='font-semibold mb-1'>{item.address}</p>
                      <p>{item.city}</p>
                    </div>
                  </div>
                ))}

                <div
                  onClick={() => setAddDeliveryDetail(true)}
                  className='mt-3 font-bold cursor-pointer '
                >
                  {' '}
                  + Add new delivery details
                </div>
              </div> */}

            <div className=' w-full text-xs md:text-sm '>
              <h2 className='border-b border-[#a1a1a19c] w-full py-3 text-sm'>
                Shipping Method
              </h2>
              {totalPrice >= 600 ? (
                <div className='flex gap-2 items-start mt-5'>
                  <input
                    type='checkbox'
                    checked
                    className='accent-black mt-1'
                    readOnly
                  />
                  <div>
                    <h3 className='font-medium'>Standard Courier</h3>
                    <div className='font-bold'>(Free delivery)</div>
                    <p>
                      Delivery takes up to 10-16 business days for products
                      marked &apos;made-to-order&apos; or &apos;pre-order&apos;.
                      Estimated delivery time once the order has shipped.
                    </p>
                  </div>
                </div>
              ) : (
                <div className='flex gap-2 items-start mt-5'>
                  <input
                    type='checkbox'
                    checked
                    className='accent-black mt-1'
                    readOnly
                    // onChange={(e) =>
                    //   setDeliveryDetails({
                    //     ...deliveryDetails,
                    //     shipping: e.target.checked ? 'standard' : 'free',
                    //   })
                    // }
                  />
                  <div>
                    <h3 className='font-medium'>Standard Courier</h3>
                    <div>${shippingFee.toFixed(2)}</div>
                    <p>
                      Delivery takes up to 10-16 business days for products
                      marked &apos;made-to-order&apos; or &apos;pre-order&apos;.
                      Estimated delivery time once the order has shipped.
                    </p>
                  </div>
                </div>
              )}
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
                  <p>
                    {totalPrice >= 600
                      ? 'Free Delivery'
                      : `$${shippingFee.toFixed(2)}`}{' '}
                  </p>
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

              {/* <div className=' w-full'>
                <h2 className='border-b border-[#a1a1a19c] w-full mt-3 py-3 text-sm'>
                  Currency Converter
                </h2>
                <div className='border-b border-[#a1a1a19c] p-3'>
                  <div
                    onClick={() =>
                      setShowCurrencyDropdown(!showCurrencyDropdown)
                    }
                    className='flex justify-between cursor-pointer'
                  >
                    <div className='gap-6 flex'>
                      <p>USD</p>
                      <p className='font-semibold'>
                        ${(totalPrice + shippingFee).toFixed(2)}
                      </p>
                    </div>
                    <MdOutlineKeyboardArrowDown
                      size={18}
                      className='text-gray-400 cursor-pointer '
                    />
                  </div>
                </div>
                {showCurrencyDropdown && (
                  <div className='bg-[#ecebeb] rounded-sm p-2 absolute shadow-md text-xs sm:text-sm flex flex-col gap-2 z-50 '>
                    <div className='flex gap-6 hover:bg-gray-100 hover:cursor-pointer p-2'>
                      <p>Naira</p>
                      <p>350,000</p>
                    </div>
                  </div>
                )}
              </div> */}

              <div className=' w-full'>
                <h2 className='border-b border-[#a1a1a19c] w-full mt-3 py-3 text-sm'>
                  Payment Options
                </h2>
                <div className='my-3 flex items-center gap-2 pb-3 border-b border-[#a1a1a19c]'>
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
              if (formIsValid() || !validateEmail(deliveryDetails.user_email)) {
                return;
              }
              initializePayment({ onSuccess, onClose });
            }}
            className='border border-[#909192] cursor-pointer bg-[#523f3fab] text-[#e4e0e0] w-full sm:w-[300px] p-2 text-xs md:text-sm mx-3'
          >
            Complete Order
          </button>
        </div>
      )}

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
          buttonClick={() => router.push('/')}
        />
      )}

      {showReceipt && (
        <PaymentReceipt
          isOpen={showReceipt}
          onRequestClose={() => setShowReceipt(false)}
          orderDetails={orderPayload}
          subTotal={totalPrice.toFixed(2)}
          total={(totalPrice + shippingFee).toFixed(2)}
        />
      )}
    </div>
  );
};

export default Bag;
