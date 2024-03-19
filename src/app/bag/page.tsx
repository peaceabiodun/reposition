'use client';

import Header from '@/components/header/page';
import Image from 'next/image';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { CiTrash } from 'react-icons/ci';
import { GiTakeMyMoney } from 'react-icons/gi';
import { useState } from 'react';
import CheckoutModal from '@/components/checkout-modal/page';
import Link from 'next/link';

const Bag = () => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'card' | 'transfer'
  >('card');
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
        Shopping Bag (2)
      </h2>

      <div className='my-4 space-y-6 px-3 xs:px-4'>
        <h2 className='border-b border-[#a1a1a19c] w-full py-3 text-sm'>
          Order Summary
        </h2>
        <div className='border-b border-[#a1a1a19c] w-full p-3 flex text-xs md:text-sm gap-3 justify-between items-center'>
          <Image
            src={'/img1.jpg'}
            alt='product_image'
            width='80'
            height='90'
            className='h-[90px] object-cover'
          />
          <div className='flex flex-col gap-3 '>
            <p className=''>Reposition White Jacket [white]</p>
            <p>Size: XL</p>
          </div>
          <div className='flex flex-col gap-3 '>
            <div className='flex gap-1 items-center'>
              <h2>Qty</h2>
              <input
                type='number'
                className=' outline-none border border-[#3d3e3f] bg-transparent w-[36px] p-2 h-[24px]'
                defaultValue={1}
              />
            </div>
            <p>$100</p>
          </div>
          <div>
            <CiTrash size={20} />
          </div>
        </div>
        <div className='flex flex-col md:flex-row gap-4 md:gap-8 '>
          <div className=' w-full text-xs md:text-sm '>
            <h2 className='border-b border-[#a1a1a19c]  w-full py-3 text-sm'>
              Delivery Details
            </h2>
            <input
              type='text'
              placeholder='Country'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent mt-5'
            />
            <input
              type='text'
              placeholder='City'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent my-3'
            />
            <input
              type='text'
              placeholder='Delivery Address'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent mb-3'
            />
            <input
              type='text'
              placeholder='Phone number'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent'
            />
          </div>
          <div className=' w-full text-xs md:text-sm space-y-3'>
            <h2 className='border-b border-[#a1a1a19c]  w-full py-3 text-sm'>
              Billing Summary
            </h2>
            <div className='space-y-1'>
              <div className='flex gap-3 justify-between'>
                <p>Subtotal</p>
                <p>$100</p>
              </div>
              <div className='flex gap-3 justify-between'>
                <p>Delivery Fee</p>
                <p>$10</p>
              </div>
              <div className='flex gap-3 justify-between'>
                <p>Discount Fee</p>
                <p>--</p>
              </div>
            </div>

            <div className=' w-full'>
              <h2 className='border-b border-[#a1a1a19c] w-full py-3 text-sm'>
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
    </div>
  );
};

export default Bag;
