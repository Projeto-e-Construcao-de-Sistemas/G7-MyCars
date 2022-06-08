import React from 'react';

export function Modal({title, textBody, confirmText, cancelText, onConfirm}) {
    return (
        <div className="modal" tabIndex="-1" id="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>{textBody}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onConfirm}>{confirmText}</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{cancelText}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
