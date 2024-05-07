'use client';
import generatePDF, { Options } from 'react-to-pdf';
import Modal, { Props } from 'react-modal';
import { MdClose } from 'react-icons/md';
import { getSimpleDateFormat } from '@/utils/functions';
import { PlacedOrderDetailsType } from '@/utils/types';

export type ReceiptModalProps = Props & {
  orderDetails: PlacedOrderDetailsType;
  isOpen: boolean;
  onRequestClose: () => void;
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

const PaymentReceipt = ({ orderDetails, ...modalProps }: ReceiptModalProps) => {
  const currentDate = new Date().toISOString();
  const currentYear = new Date().getFullYear();

  const options: Options = {
    filename: 'reposition-receipt.pdf',
    page: {
      margin: 10,
      format: 'letter',
    },
  };
  const getTargetElement = () => document.getElementById('container');
  const downloadPdf = () => generatePDF(getTargetElement, options);

  if (typeof window === 'undefined') return null;
  return (
    <div>
      <Modal
        style={customStyles}
        ariaHideApp={false}
        {...modalProps}
        appElement={document.getElementById('__next') as HTMLElement}
      >
        <div
          id='container'
          className='bg-white relative h-full w-full p-3 sm:p-6 overflow-y-auto scroll-smooth '
        >
          <div>
            <h2 className='text-lg sm:text-xl font-semibold '>
              Reposition [ ]
            </h2>
            <h2 className='my-3 fonts-bold text-xs sm:text-sm'>
              Thank you for being a believer!{' '}
            </h2>
            <h3 className='text-center text-[16px] font-semibold my-3'>
              Order Summary
            </h3>
            <div className='text-xs md:text-sm mt-6'>
              <p className='font-semibold'>Bill To : </p>
              <p className='capitalize'>
                {orderDetails.first_name} {orderDetails.last_name}
              </p>
              <p>
                {orderDetails.address}, {orderDetails.city},{' '}
                {orderDetails.country}
              </p>
              <p>{orderDetails.zip_code}</p>
              <p>{getSimpleDateFormat(currentDate)}</p>
            </div>

            <table className='w-[100%] my-4'>
              <tr className='border-y border-[#a1a1a19c] bg-[#dbb07c8f]  '>
                <th className='py-2 text-sm'>QTY</th>
                <th className='py-2 text-sm'>ITEMS</th>
                <th className='py-2 text-sm'>PRICES</th>
              </tr>
              {orderDetails.product_details.map((itm, index) => (
                <tr key={index} className='text-center mt-2 text-xs sm:text-sm'>
                  <td className='py-1'>{itm.quantity}</td>
                  <td>{itm.name}</td>
                  <td>${itm.price}</td>
                </tr>
              ))}

              <tr className='text-center font-medium text-xs sm:text-sm'>
                <td className='pt-3'></td>
                <td className='pt-3'>Subtotal</td>
                <td className='pt-3'>$210</td>
              </tr>
              <tr className='text-center font-medium text-xs sm:text-sm'>
                <td></td>
                <td className=''>Shipping Fee</td>
                <td>$20</td>
              </tr>
              <tr className='text-center font-medium text-xs sm:text-sm'>
                <td></td>
                <td className=''>Total</td>
                <td>$230</td>
              </tr>
            </table>

            <div className='text-[10px] mt-5 '>
              © {currentYear} Reposition, Inc.{' '}
            </div>
          </div>
        </div>

        <div className='my-4 gap-3 flex justify-between'>
          <button
            onClick={modalProps.onRequestClose}
            className='bg-white rounded-sm text-sm p-2 h-[38px]'
          >
            <MdClose size={16} />
          </button>
          <button
            onClick={downloadPdf}
            className=' bg-white rounded-sm text-sm p-2 h-[38px]'
          >
            Download
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentReceipt;
