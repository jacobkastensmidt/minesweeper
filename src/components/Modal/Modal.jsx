import React from 'react';

import "./Modal.css";

export default function Modal(props) {
  const { children, child, childProps, displayed } = props;
  const ModalContent = child;
  return (
    <div>
      {displayed &&
        <div id="modal-overlay">
          <div id="modal-backdrop" />
          <div id="modal">
            <ModalContent {...childProps} />
          </div>
        </div>
      }
      {children}
    </div>
  );
}
