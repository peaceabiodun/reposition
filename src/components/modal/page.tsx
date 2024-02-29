'use client';
import { ReactNode } from 'react';
import Modal, { Props } from 'react-modal';
import { MdClose } from 'react-icons/md';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

export type LocalModalProps = Props & {
  title?: string;
  titleCta?: JSX.Element;
  hasBackButton?: boolean;
  description?: string;
  onBackButton?: () => void;
  footer?: JSX.Element;
  children?: ReactNode;
  contentClassName?: string;
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    backgroundColor: '#fff',
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
const LocalModal = ({
  children,
  title,
  titleCta,
  hasBackButton,
  description,
  onBackButton,
  footer,
  contentClassName,
  ...modalProps
}: LocalModalProps) => {
  return (
    <div>
      <Modal style={customStyles} ariaHideApp={false} {...modalProps}>
        <div className={`l-modal__content relative ${contentClassName}`}>
          <div className=''>
            <div
              className={`${'l-modal__no_icons'} pb-3 pt-4 ${
                title && 'border-b-[0.8px] border-[#EFF0F0]'
              }`}
            >
              <div className='text-lg font-medium mx-auto text-[#2E3031]'>
                <h3>{title}</h3>
                {titleCta}
              </div>

              <MdClose
                size={18}
                className='md:absolute right-[-40px] top-[-8px]'
                role='button'
                onClick={modalProps.onRequestClose}
              />
            </div>
            {hasBackButton && (
              <div
                className='l-modal__back'
                role='button'
                onClick={onBackButton}
              >
                <MdOutlineArrowBackIosNew size={18} /> <span>Back</span>
              </div>
            )}

            <p className='l-modal__desc'>{description}</p>
          </div>
          <div className='l-modal__body mt-3'>{children}</div>
          {footer && <div className='l-modal__footer'>{footer}</div>}
        </div>
      </Modal>
    </div>
  );
};

export default LocalModal;
