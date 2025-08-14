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
    backgroundColor: '#C4BAAF',
    border: '1px',
    borderColor: '#000000',
    padding: '0px',
    height: 'calc(100vh - 70px)',
    boxShadow:
      '-8px 0px 32px 0px rgba(0, 0, 0, 0.15), -4px 0px 16px 0px rgba(0, 0, 0, 0.1)',
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
      <div className='w-[98vw] sm:w-[550px] pt-5 pl-[30px] sidemodal '>
        <div
          className='sidemodal__close backdrop-blur-md'
          onClick={onRequestClose}
        >
          <MdClose />
        </div>

        {title ? <h3 className='text-center'>{title}</h3> : <span />}
        <div className='overflow-y-scroll h-full pr-[30px]'>{children}</div>
      </div>
    </Modal>
  );
};

export default LocalSideModal;
