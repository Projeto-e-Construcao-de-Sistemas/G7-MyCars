import React from 'react';

export function Modal({title, textBody, confirmText, cancelText, onConfirm}) {
    return (
        <div class="modal" tabindex="-1" id="modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>{textBody}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={onConfirm}>{confirmText}</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{cancelText}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
