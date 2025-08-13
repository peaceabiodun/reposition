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
      <p className='text-sm italic text-[#38271c] text-center mt-3'>
        $5 dollars goes to a creative special needs child in Africa.
      </p>
    </LocalModal>
  );
};

export default DonationModal;
