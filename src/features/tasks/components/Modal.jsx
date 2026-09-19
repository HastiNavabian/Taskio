import { createPortal } from "react-dom";

function Modal({ children }) {
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-box">{children}</div>
    </div>,
    document.body,
  );
}

export default Modal;
