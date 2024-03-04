import LocalModal from '../modal/page';

type Props = {
  show: boolean;
  onClose: () => void;
};
const CheckoutModal = ({ show, onClose }: Props) => {
  return (
    <LocalModal isOpen={show} onRequestClose={onClose}>
      <div>thanks for shopping</div>
      <button>Back to Homepage</button>
    </LocalModal>
  );
};

export default CheckoutModal;
