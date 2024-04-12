'use client';

import LocalSideModal from '../side-modal/page';

type ModalProps = {
  show: boolean;
  onClose: () => void;
};

const menuInfo = [
  {
    title: 'About Us',
    onClick: '',
  },
  {
    title: 'Manage Products',
    onClick: '',
  },
  {
    title: 'Update Password',
    onClick: '',
  },
  {
    title: 'Logout',
    onClick: '',
  },
];

const MobileMenu = ({ show, onClose }: ModalProps) => {
  return (
    <LocalSideModal isOpen={show} onRequestClose={onClose} className=''>
      <div className='flex flex-col '>
        {menuInfo?.map((item, index) => (
          <div key={index} className='p-2'>
            {item?.title}
          </div>
        ))}
      </div>
    </LocalSideModal>
  );
};

export default MobileMenu;
