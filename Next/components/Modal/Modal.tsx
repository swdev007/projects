import style from './Modal.module.scss';
import CloseIcon from '../../assets/images/close.svg';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Modal = ({
  title = '',
  children,
  footer,
  showModal = false,
  showModalFunction,
  maxWidth = '600px',
}: {
  title?: string;
  children: any;
  footer?: any;
  showModal: boolean;
  showModalFunction: Function;
  maxWidth?: string;
}) => {
  return (
    <div className={`${style.modal} ${showModal && style.active}`}>
      <div
        className={style.modal__backdrop}
        onClick={() => showModalFunction(false)}
      ></div>
      <div className={style.modal__wrap} style={{ maxWidth: maxWidth }}>
        <header className={style.modal__header}>
          <Image
            onClick={() => showModalFunction(false)}
            src={CloseIcon}
            alt='X'
          />
        </header>
        <div className={style.modal__content}>{children}</div>
        {footer && <div className={style.modal__footer}>{footer}</div>}
      </div>
    </div>
  );
};
export default Modal;
