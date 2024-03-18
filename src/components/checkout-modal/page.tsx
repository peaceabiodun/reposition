'use client';

import { useRouter } from 'next/navigation';
import LocalModal from '../modal/page';

type Props = {
  show: boolean;
  onClose: () => void;
};
const CheckoutModal = ({ show, onClose }: Props) => {
  const router = useRouter();
  return (
    <LocalModal isOpen={show} onRequestClose={onClose}>
      <div className='text-sm space-y-3 flex flex-col items-center justify-center'>
        <h3 className='font-semibold text-green-400'>
          Thanks for shopping with us
        </h3>
        <p>Your order will be delivered within 7-10 days</p>
      </div>
      <button
        className='text-sm p-1 w-full border border-[#3d3e3f] mt-5'
        onClick={() => router.push('/')}
      >
        Back to Homepage
      </button>
    </LocalModal>
  );
};

export default CheckoutModal;
