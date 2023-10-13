import React from "react";

function Modal({ children, dismissible = true, show, onClose, ...props }) {
  const onClick = dismissible ? onClose : null;
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 w-full max-h-full overflow-auto"
      {...props}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center  ">
        <div
          className="fixed top-0 left-0 w-full h-full inset-0 bg-black bg-opacity-50"
          onClick={onClick}
        ></div>
        <div className=" z-50 w-full justify-center flex ">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
