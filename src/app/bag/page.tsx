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
import { ShoppingBagType } from '@/utils/types';
import { STORAGE_KEYS } from '@/utils/constants';

const Bag = () => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [bagItems, setBagItems] = useState<ShoppingBagType[]>([]);
  const [quantity, setQuantity] = useState('1');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'card' | 'transfer'
  >('card');

  const getBagItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('shopping-bag').select();
      setBagItems(data ?? []);
      localStorage.setItem(
        STORAGE_KEYS.CART_LENGTH,
        (data?.length ?? 0).toString()
      );
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

      <div className='my-4 space-y-6 px-3 xs:px-4'>
        <h2 className='border-b border-[#a1a1a19c] w-full py-3 text-sm'>
          Order Summary
        </h2>
        {bagItems.map((item) => (
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
                  value={quantity}
                  className=' outline-none border-b border-[#3d3e3f] bg-transparent w-[36px] p-2 h-[24px]'
                />
              </div>
              <p>{item.price}</p>
            </div>
            <div>
              <CiTrash size={20} />
            </div>
          </div>
        ))}
        <div className='flex flex-col md:flex-row gap-4 md:gap-12 '>
          <div className=' w-full text-xs md:text-sm '>
            <h2 className='border-b border-[#a1a1a19c]  w-full py-3 text-sm'>
              Delivery Details
            </h2>
            <input
              type='text'
              placeholder='First Name'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent mt-5'
            />
            <input
              type='text'
              placeholder='Last Name'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent my-5'
            />
            <input
              type='email'
              placeholder='Email'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent '
            />
            <input
              type='text'
              placeholder='Country'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent my-5'
            />
            <input
              type='text'
              placeholder='City'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent '
            />
            <input
              type='text'
              placeholder='Delivery Address'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent my-5'
            />
            <input
              type='text'
              placeholder='Phone number'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent'
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
              <input type='checkbox' checked className='accent-black mt-1' />
              <div>
                <h3 className='font-medium'>Standard Courier</h3>
                <div>$20</div>
                <p>
                  Delivery takes up to 7 business days. Estimated delivery time
                  once the order has shipped.
                </p>
              </div>
            </div>
            <h2 className='border-b border-[#a1a1a19c] mt-3 w-full py-3 text-sm'>
              Billing Summary
            </h2>
            <div className='space-y-3 mt-3'>
              <div className='flex gap-3 justify-between'>
                <p>Item total</p>
                <p>$100</p>
              </div>
              <div className='flex gap-3 justify-between'>
                <p>Shipping fee</p>
                <p>$20</p>
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
                <p>$120</p>
              </div>
            </div>

            <div className=' w-full'>
              <h2 className='border-b border-[#a1a1a19c] w-full mt-3 py-3 text-sm'>
                Payment Options
              </h2>
              <div
                onClick={() => setSelectedPaymentMethod('card')}
                className='flex gap-3 justify-between my-3'
              >
                <div className=' flex gap-2'>
                  <Image
                    alt='paystack'
                    src='/paystack-icon.svg'
                    width={18}
                    height={18}
                    className='object-cover'
                  />
                  <p>Pay with card</p>
                </div>
                {selectedPaymentMethod === 'card' && (
                  <span className='border-2 border-[#3d3e3f] w-3 h-3 rounded-full' />
                )}
              </div>
              <div
                onClick={() => setSelectedPaymentMethod('transfer')}
                className='flex gap-3 justify-between '
              >
                <div className='flex gap-2'>
                  <GiTakeMyMoney size={20} />
                  <p> Pay Via Transfer</p>
                </div>
                {selectedPaymentMethod === 'transfer' && (
                  <span className='border-2 border-[#3d3e3f] w-3 h-3 rounded-full' />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center py-6 px-3 xs:px-4'>
        <button
          onClick={() => setShowCheckoutModal(true)}
          className='border border-[#3d3e3f] w-full sm:w-[300px] p-2 text-xs md:text-sm mx-3'
        >
          Complete Order
        </button>
      </div>
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
    </div>
  );
};

export default Bag;
