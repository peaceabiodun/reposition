'use client';
import { useRouter } from 'next/navigation';
import generatePDF, { Options } from 'react-to-pdf';

const PaymentReceipt = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const options: Options = {
    filename: 'reposition-receipt.pdf',
    page: {
      margin: 10,
      format: 'letter',
    },
  };
  const getTargetElement = () => document.getElementById('container');
  const downloadPdf = () => generatePDF(getTargetElement, options);
  return (
    <div className='bg-[#f0eeecbe] w-full min-h-[100vh] p-4 sm:p-[1cm]'>
      <div
        id='container'
        className='bg-white relative border h-full min-h-[80vh] shadow-lg p-3 sm:p-6 '
      >
        <div>
          <h2 className='text-xl sm:text-2xl font-semibold '>Reposition [ ]</h2>
          <h2 className='my-3 fonts-bold text-sm'>
            Thank you for being a believer!{' '}
          </h2>
          <h3 className='text-center text-lg font-semibold my-3'>
            Order Summary
          </h3>
          <div className='text-sm mt-6'>
            <p className='font-semibold'>Bill To : </p>
            <p className='capitalize'>Adeola olaoluwa</p>
            <p>No 5, Centinela Avenue, Los Angeles, USA</p>
            <p>9001100</p>
            <p>2nd May, 2024</p>
          </div>

          <table className='w-[100%] my-4 text-sm'>
            <tr className='border-y border-[#a1a1a19c] bg-[#dad8d89c] '>
              <th className='py-2'>QTY</th>
              <th>ITEMS</th>
              <th>PRICES</th>
            </tr>
            <tr className='text-center mt-2'>
              <td className='py-1'>1</td>
              <td>Reposition Hat</td>
              <td>$100</td>
            </tr>
            <tr className='text-center'>
              <td className='py-1'>2</td>
              <td>Reposition Shirt</td>
              <td>$50</td>
            </tr>
            <tr className='text-center'>
              <td className='py-1'>5</td>
              <td>Reposition Jacket</td>
              <td>$60</td>
            </tr>
            <tr className='text-center font-semibold'>
              <td className='pt-3'></td>
              <td className='pt-3'>Subtotal</td>
              <td className='pt-3'>$210</td>
            </tr>
            <tr className='text-center font-semibold'>
              <td></td>
              <td className=''>Shipping Fee</td>
              <td>$20</td>
            </tr>
            <tr className='text-center font-bold text-lg'>
              <td></td>
              <td className=''>TOTAL</td>
              <td>$230</td>
            </tr>
          </table>

          <div className='text-[10px] mt-5 bottom-3 absolute'>
            © {currentYear} Reposition, Inc.{' '}
          </div>
        </div>
      </div>

      <div className='my-4 gap-3 flex justify-between'>
        <button
          onClick={() => router.push('/')}
          className=' border shadow-lg p-2 h-[40px]'
        >
          Back
        </button>
        <button
          onClick={downloadPdf}
          className=' border shadow-lg p-2 h-[40px]'
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

export default PaymentReceipt;
