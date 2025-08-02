import React from "react";
import { createPortal } from "react-dom";

interface IModalProps {
  title: string;
  onPositive: () => void;
  onClose?: () => void;
  positiveText: string;
  negativeText?: string;
  isDisabled?: boolean;
  children?: React.ReactNode;
}

export interface ModalRef {
  open: () => void;
  close: () => void;
}

const Modal = React.forwardRef<ModalRef, IModalProps>(
  (
    {
      title,
      onPositive,
      onClose,
      positiveText,
      negativeText = "Cancel",
      isDisabled = false,
      children,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const modalRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    const handleClose = React.useCallback(() => {
      setIsOpen(false);
      onClose?.();
    }, [onClose]);

    const handlePositive = React.useCallback(() => {
      onPositive();
      // Don't auto-close - let parent component decide
    }, [onPositive]);

    // Handle ESC key
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isOpen) {
          handleClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleKeyDown);
        // Focus management
        modalRef.current?.focus();
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, handleClose]);

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    };

    if (!isOpen) return null;

    // Create portal target if it doesn't exist
    let portalTarget = document.getElementById("modal");
    if (!portalTarget) {
      portalTarget = document.createElement("div");
      portalTarget.id = "modal";
      document.body.appendChild(portalTarget);
    }

    return createPortal(
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-xs flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
              aria-label="Close modal"
              type="button"
            >
              ×
            </button>
          </div>

          {/* Content */}
          {children && <div className="p-6">{children}</div>}

          {/* Actions */}
          <div className="flex justify-start space-x-3 p-8 border-t bg-gray-50">
            <button
              onClick={handlePositive}
              disabled={isDisabled}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {positiveText}
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              type="button"
            >
              {negativeText}
            </button>
          </div>
        </div>
      </div>,
      portalTarget
    );
  }
);

export default Modal;
