import React, { useState } from 'react';
import { Button } from 'antd';

interface DeleteUserModalProps {
  isOpen: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  userName,
  onConfirm,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleFirstConfirm = () => {
    setStep(2);
  };

  const handleFinalConfirm = () => {
    onConfirm();
    setStep(1);
  };

  const handleClose = () => {
    onCancel();
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={handleClose}></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md z-10">
        {step === 1 ? (
          <>
            <h3 className="text-lg font-semibold mb-2 text-red-600">Delete User</h3>
            <p className="text-brand-700 mb-4">
              Are you sure you want to delete the user <strong>{userName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button onClick={handleClose}>
                Cancel
              </Button>
              <Button danger onClick={handleFirstConfirm}>
                Yes, Delete
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-2 text-red-600">Final Confirmation</h3>
            <p className="text-brand-700 mb-4">
              This is your final chance to confirm. All data associated with <strong>{userName}</strong> will be permanently deleted.
            </p>
            <p className="text-brand-700 mb-4 font-medium">
              Type "DELETE" to confirm:
            </p>
            <div className="flex justify-end gap-2">
              <Button onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                danger 
                onClick={handleFinalConfirm}
              >
                Confirm Delete
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteUserModal;
