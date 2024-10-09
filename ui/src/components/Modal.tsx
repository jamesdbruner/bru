import React, { ReactNode } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid'

interface ModalProps {
  isOpen: boolean;
  onReset: () => void;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    <Transition appear show={isOpen}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex h-screen w-screen items-center justify-center">
          <DialogPanel transition className="w-screen h-screen lg:rounded-xl p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 space-y-4 border border-slate-800 p-12 pt-10">
            <div className="text-wrap max-h-[90vh] overflow-scroll">
              <DialogTitle className="font-bold text-white">
                <span className="text-4xl font-bold text-white">{title}</span>
                <span className="absolute top-2 right-2 text-white">
                  <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white outline-none focus:ring-1 ring-slate-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </span>
              </DialogTitle>
              {children}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
