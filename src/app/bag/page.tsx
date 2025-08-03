/* eslint-disable @next/next/no-img-element */
'use client';

import Header from '@/components/header/page';
import Image from 'next/image';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { CiTrash } from 'react-icons/ci';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ErrorModal from '@/components/error-modal/page';
import {
  ConversionRateType,
  DeliveryDetailsType,
  ProductDetailType,
  ShoppingBagType,
} from '@/utils/types';
import { ThreeCircles } from 'react-loader-spinner';
import SuccessModal from '@/components/success-modal/page';
import { useRouter } from 'next/navigation';
import { usePaystackPayment } from 'react-paystack';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { STORAGE_KEYS } from '@/utils/constants';
import { validateEmail } from '@/utils/functions';
import PaymentReceipt from '../../components/receipt/page';
import { useProductContext } from '@/context/product-context';
import { HiArrowLongRight } from 'react-icons/hi2';
import { IoAdd, IoRemove } from 'react-icons/io5';

type FormDataType = {
  quantity: string;
} & ShoppingBagType;

const Bag = () => {
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [bagItems, setBagItems] = useState<FormDataType[]>([]);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('');
  // const [Currencies, setCurrencies] = useState<ConversionRateType>();
  const [loadingCurrency, setLoadingCurrency] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shippingFee, SetShippingFee] = useState<number>(0);
  const [formError, setFormError] = useState<Partial<DeliveryDetailsType>>({});
  const [showReceipt, setShowReceipt] = useState(false);
  const [products, setProducts] = useState<ProductDetailType[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  const exchangeRateApiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_KEY;
  const deliveryDetailsRef = useRef<HTMLDivElement>(null);

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
    'United Kingdom',
    'United States of America',
    'Ghana',
    'Kenya',
    'Rwanda',
    'Mali',
    "Côte d'ivoire",
    'South Africa',
    'Canada',
    'Cameroon',
    'Germany',
    'Portugal',
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('products')
        .select()
        .order('created_at', { ascending: false });
      if (data !== null) {
        setProducts(data ?? []);
      }

      if (error) {
        console.log(error);
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const frequentlyBoughtItems = products?.filter(
    (itm) => itm.frequently_bought === true
  );

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

  const userBeverage =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.BEVERAGE_SELECTED)
      : '';

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
    } else if (
      (totalPrice >= 600000 && selectedCountry !== 'Nigeria') ||
      (totalPrice >= 300000 && selectedCountry === 'Nigeria')
    ) {
      shippingFee = 0;
    } else if (totalWeight === 1 && selectedCountry === 'Nigeria') {
      shippingFee = 11690;
    } else if (totalWeight === 1 && selectedCountry !== 'Nigeria') {
      shippingFee = 33400;
    } else if (totalWeight === 2 && selectedCountry !== 'Nigeria') {
      shippingFee = 66800;
    } else if (totalWeight && selectedCountry == 'Nigeria') {
      shippingFee = 11690 * totalWeight;
    } else {
      shippingFee = 33400 * totalWeight;
    }
    SetShippingFee(shippingFee);
  };

  useEffect(() => {
    calculateShippingFee();
  }, [bagItems, selectedCountry, totalPrice]);

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

  // const getConversionRate = async () => {
  //   setLoadingCurrency(true);
  //   try {
  //     const res = await axios.get(
  //       `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/USD`
  //     );

  //     setCurrencies(res?.data?.conversion_rates);
  //   } catch (err: any) {
  //     console.log(err);
  //   } finally {
  //     setLoadingCurrency(false);
  //   }
  // };

  // useEffect(() => {
  //   getConversionRate();
  // }, []);

  const generateOrderNumber = (maxValue: number) => {
    const randomNumber = Math.random();
    const scaledNumber = Math.floor(randomNumber * maxValue) + 1;
    return scaledNumber;
  };

  // Ensure order number is generated
  const getOrderNumber = () => {
    if (!orderNumber) {
      const newOrderNumber = generateOrderNumber(100000);
      setOrderNumber(newOrderNumber);
      return newOrderNumber;
    }
    return orderNumber;
  };

  // Generate order number when checkout is initiated
  useEffect(() => {
    if (showCheckout && !orderNumber) {
      setOrderNumber(generateOrderNumber(100000));
    }
  }, [showCheckout, orderNumber]);

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
      size: itm.size,
    })),
    amount_paid: totalPrice + shippingFee,
    shipping_fee: shippingFee,
    order_id: getOrderNumber(),
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
    amount: Math.round((totalPrice + shippingFee) * 100),
    //totalPrice + shippingFee Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    Currency: 'NGN',
    metadata: {
      product_details: bagItems.map((itm) => ({
        name: itm.name,
        price: itm.price,
        quantity: itm.quantity,
        size: itm.size,
      })),
      first_name: deliveryDetails.first_name,
      last_name: deliveryDetails.last_name,
      user_email: deliveryDetails.user_email,
      phone_number: deliveryDetails.phone_number,
      country: selectedCountry,
      address: deliveryDetails.address,
    },
  } as any;

  const initializePayment: any = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    if (reference.message === 'Approved') {
      orderConfirmationDetails(reference.reference);
      localStorage.removeItem(STORAGE_KEYS.BEVERAGE_SELECTED);
    }
  };

  const onClose = () => {
    console.log('closed');
  };

  const applyDiscount = () => {
    if (
      discountCode === STORAGE_KEYS.DISCOUNT_CODE_ONE ||
      discountCode === STORAGE_KEYS.DISCOUNT_CODE_TWO ||
      discountCode === STORAGE_KEYS.DISCOUNT_CODE_THREE ||
      discountCode === STORAGE_KEYS.DISCOUNT_CODE_FOUR ||
      discountCode === STORAGE_KEYS.DISCOUNT_CODE_FIVE
    ) {
      const discount = (totalPrice + shippingFee) * 0.2;
      setDiscountAmount(discount);
      setFinalTotal(totalPrice + shippingFee - discount);
    } else if (discountCode === STORAGE_KEYS.TEN_PERCENT_DISCOUNT) {
      const discount = (totalPrice + shippingFee) * 0.1;
      setDiscountAmount(discount);
      setFinalTotal(totalPrice + shippingFee - discount);
    } else {
      setDiscountAmount(0);
      setFinalTotal(totalPrice + shippingFee);
    }
  };

  useEffect(() => {
    applyDiscount();
  }, [discountCode, totalPrice, shippingFee]);

  return (
    <div className='w-full min-h-screen bg-[#dbd9d2] pb-10 '>
      <div className='max-w-[1500px] mx-auto'>
        <Header />
        <Link
          href='/'
          className='mt-4 gap-1 flex text-sm items-center px-3 xs:px-4'
        >
          <MdOutlineArrowBackIosNew size={20} />
          Back
        </Link>

        <h2 className='text-base font-semibold text-center my-4 px-3 xs:px-4'>
          YOUR BAG ({bagItems.length})
        </h2>
        {bagItems.length <= 0 ? (
          <div className='flex justify-center items-center p-3 my-6 text-sm sm:text-base h-[80vh]'>
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
          <div className='my-4 px-3 xs:px-4'>
            <h2 className='border-b border-[#a1a1a19c] w-full py-3 text-sm'>
              Summary
            </h2>

            {bagItems?.map((item, index) => (
              <div
                key={item.id}
                className='border-b border-[#a1a1a19c] w-full p-3 flex text-sm gap-5 items-center'
              >
                <Image
                  src={item?.image ?? '/placeholder.png'}
                  alt='product_image'
                  width={200}
                  height={200}
                  className='h-[200px] w-[200px] object-cover cursor-pointer'
                  onClick={() => router.push(`product/${item.id}`)}
                />
                <div className='flex flex-col sm:flex-row sm:justify-between w-full gap-3 sm:items-center'>
                  <div className='flex flex-col gap-3 '>
                    <p className='text-base sm:text-lg font-semibold'>
                      {item.name} [{item.color}]
                    </p>
                    <p>₦ {Number(item.price).toLocaleString()}</p>
                    <p>Size: {item.size}</p>
                  </div>

                  <div className='flex items-center justify-between border border-[#523f3fab] p-2 w-[100px] '>
                    <button
                      onClick={() => {
                        const currentQty = parseInt(item.quantity);
                        if (currentQty > 1) {
                          updateQuantity((currentQty - 1).toString(), index);
                        }
                      }}
                      className='w-5 h-5  bg-[#523f3f] flex items-center justify-center text-white hover:bg-[#523f3fc5] transition-colors'
                    >
                      <IoRemove size={16} />
                    </button>
                    <span className='px-3 text-[#523f3f] text-base font-medium'>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        const currentQty = parseInt(item.quantity);
                        updateQuantity((currentQty + 1).toString(), index);
                      }}
                      className='w-5 h-5  bg-[#523f3f] flex items-center justify-center text-white hover:bg-[#523f3fc5] transition-colors'
                    >
                      <IoAdd size={16} />
                    </button>
                  </div>

                  <div
                    onClick={() => removeItemFromBag(item.id)}
                    className='cursor-pointer'
                  >
                    <CiTrash size={20} />
                  </div>
                </div>
              </div>
            ))}

            <div className='text-base space-y-1 mt-4'>
              <p>
                <span className=' mr-1 text-sm'> {bagItems.length}</span>
                Item(s)
              </p>
              <p>
                Total:
                <span className='font-medium'>
                  {' '}
                  ₦ {Number(totalPrice).toLocaleString()}
                </span>
              </p>
            </div>

            <div>
              <div className='flex items-center gap-1 text-xs xs:text-sm '>
                <p className='text-nowrap'>Your </p>
                {userBeverage === 'Tea' ? (
                  <img
                    src='/tea.png'
                    alt='tea'
                    className=' w-[80px] h-[60px] hover:scale-105 transition-all duration-300 object-contain object-center'
                  />
                ) : (
                  <img
                    src='/coffee.png'
                    alt='coffee'
                    className=' w-[80px] h-[60px] hover:scale-105 transition-all duration-300 object-contain object-center'
                  />
                )}
                <p>
                  Will be packaged and delivered with your Order. Thank you.{' '}
                </p>
              </div>
            </div>

            {bagItems.length > 0 && !showCheckout && (
              <button
                onClick={() => {
                  setShowCheckout(true);
                  // Generate order number when checkout is initiated
                  if (!orderNumber) {
                    setOrderNumber(generateOrderNumber(100000));
                  }
                  // Scroll to delivery details section after a short delay to ensure it's rendered
                  setTimeout(() => {
                    deliveryDetailsRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }, 100);
                }}
                className='border border-[#523f3fab] bg-[#38271c] text-[#F5F5DC] p-2 text-sm flex items-center justify-between gap-2 w-full sm:w-[350px] font-semibold shadow-md hover:scale-105 transition-all duration-300 my-4'
              >
                CHECKOUT SECURELY
                <HiArrowLongRight size={20} />
              </button>
            )}
            <div className='border-b border-[#a1a1a19c] w-full py-3 '>
              <h2 className='text-base font-semibold'>MADE TO FIT</h2>

              <div className='mt-5 text-xs md:text-sm w-full flex gap-4 sm:gap-6 overflow-x-scroll scroll-smooth scrollable-div pb-2'>
                {frequentlyBoughtItems.map((item, index) => (
                  <div key={index} className='min-w-[200px]'>
                    <Image
                      src={item?.images[0]}
                      alt='product-img'
                      width={200}
                      height={200}
                      className='w-[200px] h-[200px] object-cover'
                      onClick={() => router.push(`product/${item.id}`)}
                    />
                    <p className='mt-2 mb-1 font-semibold '>{item.name}</p>
                    <p className=' mb-1 '>
                      ₦ {Number(item.price).toLocaleString()}
                    </p>
                    <button
                      onClick={() => router.push(`product/${item.id}`)}
                      className=' bg-[#523f3fab] hover:bg-[#523f3f71] text-[#e4e0e0] p-2 w-[200px] h-[30px] flex items-center justify-center cursor-pointer'
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {showCheckout && (
              <div className='flex flex-col md:flex-row gap-4 md:gap-12 '>
                <div
                  className=' w-full text-xs md:text-sm '
                  ref={deliveryDetailsRef}
                >
                  <div className='border-b border-[#a1a1a19c] w-full flex gap-3 justify-between py-3 text-sm'>
                    <h2>Delivery Details</h2>
                  </div>
                  <div className='w-full mt-5'>
                    <label>First Name</label>

                    <input
                      type='text'
                      placeholder='E.g Walter'
                      value={deliveryDetails.first_name}
                      onChange={(e) =>
                        updateFormData('first_name', e.target.value)
                      }
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
                      onChange={(e) =>
                        updateFormData('last_name', e.target.value)
                      }
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
                      onChange={(e) =>
                        updateFormData('user_email', e.target.value)
                      }
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
                  <p className='mb-2'>
                    Country/Region{' '}
                    <span className='text-xs italic'>
                      (shipping fee may change depending on country)
                    </span>
                  </p>
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
                              ? ' font-light bg-gray-100'
                              : ''
                          } hover:font-light hover:bg-gray-100 p-2 cursor-pointer`}
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
                      onChange={(e) =>
                        updateFormData('address', e.target.value)
                      }
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
                      onChange={(e) =>
                        updateFormData('zip_code', e.target.value)
                      }
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

                <div className=' w-full text-xs md:text-sm '>
                  <h2 className='border-b border-[#a1a1a19c] w-full py-3 text-sm'>
                    Shipping Method
                  </h2>
                  {(totalPrice >= 600 && selectedCountry !== 'Nigeria') ||
                  (totalPrice >= 300 && selectedCountry === 'Nigeria') ? (
                    <div className='flex gap-2 items-start mt-5'>
                      <input
                        type='checkbox'
                        checked
                        className='accent-black mt-1'
                        readOnly
                      />
                      <div>
                        <h3 className='font-light'>Standard Courier</h3>
                        {/* <div className='font-light'>(Free delivery)</div> */}
                        <p>
                          Delivery takes up to 10-16 business days for products
                          marked &apos;made-to-order&apos; or
                          &apos;pre-order&apos;. Estimated delivery time once
                          the order has shipped.
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
                        <h3 className='font-light'>Standard Courier</h3>
                        <div>${shippingFee.toFixed(2)}</div>
                        <p>
                          Delivery takes up to 10-16 business days for products
                          marked &apos;made-to-order&apos; or
                          &apos;pre-order&apos;. Estimated delivery time once
                          the order has shipped.
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
                      <p>₦ {totalPrice.toLocaleString()}</p>
                    </div>
                    <div className='flex gap-3 justify-between'>
                      <div className=''>
                        <p>Shipping fee</p>
                        <p className='text-[10px] text-[#644120] italic'>
                          *Shipping fee may reduce or increase depending on
                          destination country.
                        </p>
                        <p className='text-[10px] text-[#644120] italic'>
                          *Please select a country to see correct shipping fee
                        </p>
                      </div>
                      <p>
                        {(totalPrice >= 600000 &&
                          selectedCountry !== 'Nigeria') ||
                        (totalPrice >= 300000 && selectedCountry === 'Nigeria')
                          ? 'Free Delivery'
                          : `₦${shippingFee.toLocaleString()}`}{' '}
                      </p>
                    </div>
                    <div className='flex gap-3 items-center justify-between'>
                      <p>Discount Code</p>
                      <input
                        type='text'
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className='border border-[#3d3e3f] rounded-sm w-[130px] h-[30px] p-2 outline-none bg-transparent '
                      />
                    </div>
                    <div className='flex gap-3 justify-between'>
                      <p>Discount Fee</p>
                      <p>₦ {discountAmount.toLocaleString()}</p>
                    </div>
                    <div className='flex gap-3 justify-between'>
                      <p>Duties, taxes & fees</p>
                      <p>--</p>
                    </div>
                    <div className='flex gap-3 justify-between font-light'>
                      <p className=''>Total</p>
                      <p>₦ {finalTotal.toLocaleString()}</p>
                    </div>
                  </div>

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
                    <p className='mt-2 text-[#644120] italic text-sm'>
                      please note that transcation fees will be added at
                      checkout
                    </p>
                    <p className='mt-2 text-[#644120] italic text-sm'>
                      If you have any issues ordering or with your order
                      payment, please contact us at {''}
                      <span className='font-semibold'>
                        welcome@re-position.co
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {bagItems.length <= 0 || !showCheckout ? null : (
          <div className='flex justify-center py-6 px-3 xs:px-4'>
            <button
              onClick={() => {
                if (
                  formIsValid() ||
                  !validateEmail(deliveryDetails.user_email)
                ) {
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
      </div>

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
          title='Product removed from Bag'
          buttonText='Got it '
          buttonClick={() => router.push('/')}
        />
      )}

      {showReceipt && (
        <PaymentReceipt
          isOpen={showReceipt}
          onRequestClose={() => setShowReceipt(false)}
          orderDetails={orderPayload}
          subTotal={totalPrice.toFixed(2)}
          total={finalTotal.toFixed(2)}
        />
      )}
    </div>
  );
};

export default Bag;
