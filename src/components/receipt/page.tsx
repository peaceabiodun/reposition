'use client';
import generatePDF, { Options } from 'react-to-pdf';
import Modal, { Props } from 'react-modal';
import { MdClose } from 'react-icons/md';
import { getSimpleDateFormat } from '@/utils/functions';
import { PlacedOrderDetailsType } from '@/utils/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export type ReceiptModalProps = Props & {
  orderDetails: PlacedOrderDetailsType;
  isOpen: boolean;
  onRequestClose: () => void;
  subTotal: string;
  total: string;
};
const customStyles = {
  content: {
    top: '20px',
    left: '20px',
    right: '20px',
    bottom: '68px',
    border: 'none',
    padding: '0px',
    overflow: 'unset',
  },
  overlay: {
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(3px)',
    zIndex: 10000,
  },
};

const PaymentReceipt = ({
  orderDetails,
  isOpen,
  onRequestClose,
  subTotal,
  total,
  ...modalProps
}: ReceiptModalProps) => {
  const currentDate = new Date().toISOString();
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // const options: Options = {
  //   filename: 'reposition-receipt.pdf',
  //   page: {
  //     margin: 10,
  //     format: 'letter',
  //   },
  // };
  // const getTargetElement = () => document.getElementById('container');
  // const downloadPdf = () => generatePDF(getTargetElement, options);

  if (typeof window === 'undefined') return null;
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        ariaHideApp={false}
        {...modalProps}
        appElement={document.getElementById('__next') as HTMLElement}
        className={
          'max-w-[800px] h-[700px] overflow-y-auto scroll-smooth mx-auto'
        }
      >
        <div className='my-4 gap-3 flex justify-between'>
          <button
            onClick={() => {
              localStorage.setItem(STORAGE_KEYS.BAG_ITEMS, JSON.stringify([]));
              onRequestClose();
              router.push('/');
            }}
            className='bg-[#573a169a] rounded-sm text-sm p-2 h-[38px] text-white hover:scale-105 transition-all duration-300'
          >
            <MdClose size={16} />
          </button>
          <button
            onClick={handlePrint}
            className=' bg-[#573a169a] rounded-sm text-sm p-2 h-[38px] text-white hover:scale-105 transition-all duration-300'
          >
            Save
          </button>
        </div>
        <div
          id='container'
          ref={componentRef}
          className='bg-white relative h-full w-full p-3 sm:p-6 overflow-y-auto scroll-smooth '
        >
          <div>
            <h2 className='text-lg sm:text-xl font-semibold '>
              Reposition [ ]
            </h2>
            <h2 className='my-3 fonts-bold text-xs sm:text-sm'>
              Thank you for being a believer!{' '}
            </h2>
            <p className='my-3 text-xs font-semibold'>
              Order Id : {orderDetails.order_id}
            </p>
            <h3 className='text-center text-[16px] font-semibold my-3'>
              Order Summary
            </h3>
            <div className='text-xs md:text-sm mt-6'>
              <p className='font-semibold'>Bill To : </p>
              <p className='capitalize my-1'>
                {orderDetails.first_name} {orderDetails.last_name}
              </p>
              <p>
                {orderDetails.address}, {orderDetails.city},{' '}
                {orderDetails.country}
              </p>
              <p className='my-1'>{orderDetails.zip_code}</p>
              <p>{getSimpleDateFormat(currentDate)}</p>
            </div>

            <table className='w-[100%] my-4'>
              <tr className='border-y border-[#a1a1a19c] bg-[#573a16c5] text-[#ecf3f3] '>
                <th className='py-2 text-sm'>QTY</th>
                <th className='py-2 text-sm border-l border-r border-[#a1a1a19c]'>
                  ITEMS
                </th>
                <th className='py-2 text-sm'>PRICES</th>
              </tr>
              {orderDetails.product_details.map((itm, index) => (
                <tr
                  key={index}
                  className='text-center mt-2 text-xs sm:text-sm border-b border-[#a1a1a19c] '
                >
                  <td className='py-1'>{itm.quantity}</td>
                  <td>{itm.name}</td>
                  <td>₦{Number(itm.price).toLocaleString()}</td>
                </tr>
              ))}
            </table>
            <div className='mt-10 space-y-2'>
              <div className=' font-semibold text-sm flex gap-8 w-[300px] justify-between'>
                <p className=''>Subtotal</p>
                <p className=''>₦{Number(subTotal).toLocaleString()}</p>
              </div>
              <div className=' font-semibold text-sm flex gap-8 w-[300px] justify-between'>
                <p className=''>Shipping Fee</p>
                <p className=''>
                  ₦{Number(orderDetails.shipping_fee).toLocaleString()}
                </p>
              </div>
              <div className=' font-semibold text-sm flex gap-8 w-[300px] justify-between'>
                <p className=''>Total</p>
                <p className=''>₦{Number(total).toLocaleString()}</p>
              </div>
            </div>

            <div className='text-[10px] mt-10  '>
              © {currentYear} Reposition, Inc.{' '}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentReceipt;
