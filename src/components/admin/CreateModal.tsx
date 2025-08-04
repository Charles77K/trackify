import React from "react";
import { createPortal } from "react-dom";

interface IModalProps {
  onClose?: () => void;
  children?: React.ReactNode;
}

export interface ModalRef {
  open: () => void;
  close: () => void;
}

const CreateModal = React.forwardRef<ModalRef, IModalProps>(
  ({ onClose, children }, ref) => {
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
    let portalTarget = document.getElementById("create-modal");
    if (!portalTarget) {
      portalTarget = document.createElement("div");
      portalTarget.id = "create-modal";
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
          {/* Content */}
          {children && <div className="p-6">{children}</div>}
        </div>
      </div>,
      portalTarget
    );
  }
);

export default CreateModal;
