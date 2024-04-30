'use client';

import Header from '@/components/header/page';
import Image from 'next/image';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { CiTrash } from 'react-icons/ci';
import { useEffect, useState } from 'react';
import CheckoutModal from '@/components/checkout-modal/page';
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
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [Currencies, setCurrencies] = useState<ConversionRateType>();
  const [loadingCurrency, setLoadingCurrency] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shippingFee, SetShippingFee] = useState<number>(0);
  const [selectedDeliveryDetail, setSelectedDeliveryDetail] =
    useState<DeliveryDetailsType>();
  const [savedDeliveryDetails, setSavedDeliveryDetails] = useState<
    DeliveryDetailsType[]
  >([]);
  const [addDeliveryDetail, setAddDeliveryDetail] = useState(false);
  const exchangeRateApiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_KEY;
  const userEmail =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
      : '';

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetailsType>({
    first_name: '',
    last_name: '',
    user_email: userEmail ?? '',
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

  //i should be fetching cart items based on user id or email :todo
  const getBagItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shopping-bag')
        .select('*')
        .eq('user_id', userId);

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
        getBagItems();
      }
    } catch {
      console.log('error');
    }
  };

  const getDeliveryDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery-details')
        .select('*')
        .eq('user_id', userId);
      setSavedDeliveryDetails(data ?? []);

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
    getDeliveryDetails();
  }, []);
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
    } else {
      // For each additional kilogram, add $4 to the shipping fee
      shippingFee = 4 * totalWeight;
    }
    SetShippingFee(shippingFee);
  };

  useEffect(() => {
    calculateShippingFee();
  }, [bagItems]);

  const updateDeliveryDetails = async () => {
    if (selectedDeliveryDetail && !deliveryDetails) return;
    const payload = {
      first_name: deliveryDetails.first_name,
      last_name: deliveryDetails.last_name,
      user_email: userEmail ?? '',
      country: selectedCountry,
      city: deliveryDetails.city,
      address: deliveryDetails.address,
      zip_code: deliveryDetails.zip_code,
      phone_number: deliveryDetails.phone_number,
    };
    try {
      const { data, error } = await supabase
        .from('delivery-details')
        .insert(payload);
      setDeliveryDetails({
        first_name: '',
        last_name: '',
        user_email: userEmail ?? '',
        country: '',
        city: '',
        address: '',
        zip_code: '',
        phone_number: '',
      });
    } catch (err: any) {
      console.log(err);
    }
  };

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

  const orderConfirmationDetails = async () => {
    const payload = {
      customer_email: userEmail ?? '',
      customer_phone_number:
        deliveryDetails.phone_number || selectedDeliveryDetail?.phone_number,
      user_id: userId,
      product_details: bagItems.map((itm) => ({
        name: itm.name,
        size: itm.size,
        quantity: itm.quantity,
      })),
      amount_paid:
        (totalPrice + shippingFee) * parseInt(Currencies?.NGN ?? '') * 100,
      shipping_fee: shippingFee,
      country: selectedCountry || selectedDeliveryDetail?.country,
      city: deliveryDetails.city || selectedDeliveryDetail?.city,
      address: deliveryDetails.address || selectedDeliveryDetail?.address,
    };
    try {
      const { data, error } = await supabase.from('orders').insert(payload);
    } catch (err: any) {
      console.log(err);
    }
  };
  const config = {
    reference: new Date().getTime().toString(),
    email: userEmail ?? '',
    amount: (totalPrice + shippingFee) * parseInt(Currencies?.NGN ?? '') * 100, //totalPrice + shippingFee Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    Currency: 'NGN',
    metadata: {
      products: '1',
    },
  } as any;

  // you can call this function anything
  const onSuccess = (reference: any) => {
    // Implementation for whatever you want to do with reference and after success call.

    if (reference.message === 'Approved') {
      orderConfirmationDetails();
      router.push('/receipt');
    }
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed');
  };

  const initializePayment: any = usePaystackPayment(config);

  const isDeliveryDetailsComplete = () => {
    return Object.values(deliveryDetails).every((value) => value.trim() !== '');
  };

  return (
    <div className='w-full min-h-screen bg-[#dbd9d2] '>
      <Header />
      <Link
        href='/home'
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
            {savedDeliveryDetails.length <= 0 || addDeliveryDetail ? (
              <div className=' w-full text-xs md:text-sm '>
                <div className='border-b border-[#a1a1a19c] w-full flex gap-3 justify-between py-3 text-sm'>
                  <h2>Delivery Details</h2>
                  {savedDeliveryDetails.length > 0 && (
                    <h2
                      onClick={() => setAddDeliveryDetail(false)}
                      className='font-semibold cursor-pointer'
                    >
                      Use saved delivery details
                    </h2>
                  )}
                </div>
                <div className='w-full mt-5'>
                  <label>First Name</label>

                  <input
                    type='text'
                    placeholder='E.g Walter'
                    value={deliveryDetails.first_name}
                    onChange={(e) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        first_name: e.target.value,
                      })
                    }
                    className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
                  />
                </div>
                <div className='my-5'>
                  <label>Last Name</label>
                  <input
                    type='text'
                    placeholder='E.g White'
                    value={deliveryDetails.last_name}
                    onChange={(e) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        last_name: e.target.value,
                      })
                    }
                    className='border border-[#3d3e3f] rounded-sm w-full mt-2 p-2 outline-none bg-transparent '
                  />{' '}
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type='email'
                    placeholder='E.g white@gmail.com'
                    value={deliveryDetails.user_email}
                    readOnly
                    className='border border-[#3d3e3f] rounded-sm w-full p-2 outline-none bg-transparent mt-2 '
                  />
                </div>
                <div className='my-5'>
                  <label> City</label>
                  <input
                    type='text'
                    placeholder='E.g Los Angeles'
                    value={deliveryDetails.city}
                    onChange={(e) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        city: e.target.value,
                      })
                    }
                    className='border border-[#3d3e3f] rounded-sm w-full p-2 outline-none bg-transparent mt-2 '
                  />
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
                  <div className='bg-[#ecebeb] rounded-sm p-2 absolute shadow-md text-xs sm:text-sm flex flex-col gap-2 z-50'>
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
                    onChange={(e) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        address: e.target.value,
                      })
                    }
                    className='border border-[#3d3e3f] rounded-sm w-full p-2 outline-none bg-transparent mt-2 '
                  />{' '}
                </div>
                <div>
                  <label>Zip code</label>

                  <input
                    type='text'
                    placeholder='E.g 90004'
                    value={deliveryDetails.zip_code}
                    onChange={(e) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        zip_code: e.target.value,
                      })
                    }
                    className='border border-[#3d3e3f] rounded-sm w-full p-2 outline-none bg-transparent mt-2 '
                  />
                </div>
                <div className='my-5'>
                  <label>Phone Number</label>
                  <input
                    type='text'
                    placeholder='E.g +213 90445678'
                    value={deliveryDetails.phone_number}
                    onChange={(e) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        phone_number: e.target.value,
                      })
                    }
                    className='border border-[#3d3e3f] rounded-sm w-full p-2 outline-none bg-transparent mt-2'
                  />{' '}
                </div>
                {!isDeliveryDetailsComplete() && (
                  <div className='text-xs text-red-500 mt-2'>
                    * All details are required{' '}
                  </div>
                )}
              </div>
            ) : (
              <div className=' w-full text-xs md:text-sm'>
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
              </div>
            )}
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
            disabled={!isDeliveryDetailsComplete() || !selectedDeliveryDetail}
            onClick={() => {
              updateDeliveryDetails();
              initializePayment({ onSuccess, onClose });
            }}
            // onClick={() => {
            //   updateDeliveryDetails();
            // }}
            className='border border-[#909192] cursor-pointer bg-[#523f3fab] text-[#e4e0e0] w-full sm:w-[300px] p-2 text-xs md:text-sm mx-3'
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
