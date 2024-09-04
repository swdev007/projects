import React, { ReactNode, forwardRef, useRef } from "react";
import CustomButton from "../Button/Button";
import style from "./Modal.module.scss";

interface ModalProps {
  yesResponse: () => void;
  noResponse: () => void;
  ref: React.RefObject<HTMLDivElement>;
  children: ReactNode;
}

const Modal = forwardRef(
  ({ yesResponse, children, noResponse }: ModalProps, ref: any) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutsideModal = (event: any) => {
      if (!modalRef.current?.contains(event.target)) {
        noResponse();
      }
    };

    return (
      <div
        className={`${style.modal} d-none alignCenter justifyCenter`}
        ref={ref}
        onClick={handleClickOutsideModal}
      >
        <div className={style.modal__content} ref={modalRef}>
          {children}
          <div className={style.modal__actions}>
            <CustomButton
              title="CANCEL"
              type="submit"
              onClick={noResponse}
              className="primary"
            />
            <CustomButton title="OK" type="submit" onClick={yesResponse} />
          </div>
        </div>
      </div>
    );
  }
);
export default Modal;
