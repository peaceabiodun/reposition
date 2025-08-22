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
        Thank you. We have made a $5 contribution on your behalf <br />
        to a special needs child in Africa. Please check your email.
      </p>
    </LocalModal>
  );
};

export default DonationModal;
