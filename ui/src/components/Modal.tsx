import React, { ReactNode } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition } from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  onReset: () => void;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onReset, onClose, title, children }: ModalProps) => {
  return (
    <Transition appear show={isOpen}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel transition className="w-full max-w-2xl rounded-xl p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 space-y-4 border border-slate-800 p-12 pt-10">
            <DialogTitle className="font-bold text-white">{title}</DialogTitle>
            <div className="text-wrap max-h-[80vh] overflow-scroll">
              {children}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
