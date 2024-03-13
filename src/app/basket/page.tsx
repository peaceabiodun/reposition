'use client';

import Header from '@/components/header/page';
import Image from 'next/image';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { CiTrash } from 'react-icons/ci';
import { GiTakeMyMoney } from 'react-icons/gi';
import { useState } from 'react';
import CheckoutModal from '@/components/checkout-modal/page';
import Link from 'next/link';

const Basket = () => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'card' | 'transfer'
  >('card');
  return (
    <div className='w-full min-h-screen bg-[#dbd9d2] p-3 xs:p-4'>
      <Header />
      <Link href='/' className='mt-4 gap-1 flex text-sm items-center'>
        <MdOutlineArrowBackIosNew size={20} />
        Back
      </Link>
      <h2 className='text-sm font-medium text-center my-4'>Shopping Basket</h2>

      <div className='my-4 space-y-4'>
        <div className='border border-[#3d3e3f] w-full p-2 flex text-xs md:text-sm gap-3 justify-between items-center'>
          <Image
            src={'/img1.jpg'}
            alt='product_image'
            width='80'
            height='90'
            className='h-[90px] object-cover'
          />
          <div className='flex flex-col gap-2 '>
            <p className=''>Reposition White Jacket [white]</p>
            <p>Size: XL</p>
          </div>
          <div className='flex flex-col gap-2 '>
            <div>qty 1</div>
            <p>$100</p>
          </div>
          <div>
            <CiTrash size={20} />
          </div>
        </div>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='border border-[#3d3e3f] w-full p-2 text-xs md:text-sm space-y-2 '>
            <h2>Delivery Details:</h2>
            <input
              type='text'
              placeholder='Delivery State'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent'
            />
            <input
              type='text'
              placeholder='Delivery Address'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent'
            />
            <input
              type='text'
              placeholder='Phone number'
              className='border border-[#3d3e3f] w-full p-2 outline-none bg-transparent'
            />
          </div>
          <div className='border border-[#3d3e3f] w-full p-2 text-xs md:text-sm space-y-2'>
            <h2>Order Summary:</h2>
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

            <div className='border border-[#3d3e3f] w-full p-2 space-y-2'>
              <h2>Payment Options:</h2>
              <div
                onClick={() => setSelectedPaymentMethod('card')}
                className='flex gap-3 justify-between p-2'
              >
                <div className=' flex gap-2'>
                  <Image
                    alt='paystack'
                    src='/paystack-icon.svg'
                    width={18}
                    height={18}
                    className='object-cover'
                  />
                  <p>Pay with Paystack</p>
                </div>
                {selectedPaymentMethod === 'card' && (
                  <span className='border-2 border-[#3d3e3f] w-3 h-3 rounded-full' />
                )}
              </div>
              <div
                onClick={() => setSelectedPaymentMethod('transfer')}
                className='flex gap-3 justify-between p-2'
              >
                <div className=' flex gap-2'>
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
      <div className='flex justify-center mt-6'>
        <button
          onClick={() => setShowCheckoutModal(true)}
          className='border border-[#3d3e3f] w-full sm:w-[300px] p-2 text-xs md:text-sm'
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

export default Basket;
