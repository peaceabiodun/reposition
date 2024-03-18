'use client';

import { MdClose } from 'react-icons/md';
import { ReactNode } from 'react';
import Modal, { Props } from 'react-modal';

type LocalSideModalProps = Props & {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  title?: ReactNode;
};
const customStyles = {
  content: {
    top: '70px',
    left: 'auto',
    right: '0%',
    bottom: 'auto',
    backgroundColor: '#ece8e3',
    border: 'none',
    padding: '0px',
    height: 'calc(100vh - 70px)',
    boxShadow: '0px 1px 20px 0px rgba(69, 75, 84, 0.20)',
    overflow: 'none',
  },
  overlay: {
    background: 'transparent',
    zIndex: 10000,
  },
};
const LocalSideModal = ({
  isOpen,
  onRequestClose,
  children,
  title,
  ...modalProps
}: LocalSideModalProps) => {
  return (
    <Modal
      style={customStyles}
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick
      {...modalProps}
    >
      <div className='w-[98vw] sm:w-[450px] pt-5 pl-[30px] sidemodal'>
        <div className='sidemodal__close' onClick={onRequestClose}>
          <MdClose />
        </div>

        {title ? <h3 className='text-center'>{title}</h3> : <span />}
        <div className='overflow-y-scroll h-full pr-[30px]'>{children}</div>
      </div>
    </Modal>
  );
};

export default LocalSideModal;
