import Image from 'next/image';
import LocalModal from '../modal/page';

type Props = {
  show: boolean;
  onClose: () => void;
};
const DonationModal = ({ show, onClose }: Props) => {
  return (
    <LocalModal isOpen={show} onRequestClose={onClose}>
      <div className='  flex items-center justify-center m-5'>
        <Image
          src={'/donation-img.png'}
          alt='donation-img'
          width={150}
          height={150}
        />
      </div>
      <p className='text-bsm font-medium text-[#f8f0ea] text-center mt-3'>
        Check our impact section for what $5 from your order will do.
      </p>
    </LocalModal>
  );
};

export default DonationModal;
