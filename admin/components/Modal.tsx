import React from "react";

interface ModalProps {
    open: boolean;
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
    open,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText = "Delete",
    cancelText = "Cancel"
}) => {
    if (!open) return null; 

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={onCancel}></div>

            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-[300px] z-10">
                {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
                {description && <p className="text-brand-700 mb-4">{description}</p>}
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-1 rounded bg-brand-100 text-brand-800 cursor-pointer"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="px-4 py-1 rounded bg-red-500 text-white cursor-pointer"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
