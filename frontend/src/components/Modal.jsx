import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times; {/* Close button */}
                </button>
                {children} {/* Render children here, like your form */}
            </div>
        </div>
    );
};

export default Modal;
