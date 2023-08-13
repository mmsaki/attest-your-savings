import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import Icon from "../Icon";

type ModalProps = {
  className?: string;
  classWrap?: string;
  classOverlay?: string;
  classButtonClose?: string;
  title?: string;
  visible: boolean;
  onClose: () => void;
  initialFocus?: any;
  children: React.ReactNode;
  video?: boolean;
};

const Modal = ({
  className,
  classWrap,
  classOverlay,
  classButtonClose,
  title,
  visible,
  onClose,
  initialFocus,
  children,
  video,
}: ModalProps) => {
  return (
    <Transition show={visible} as={Fragment}>
      <Dialog
        initialFocus={initialFocus}
        className={`fixed inset-0 z-50 flex p-6 overflow-auto scroll-smooth md:px-4 ${className}`}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`fixed inset-0 bg-n-1/85 ${classOverlay}`}
            aria-hidden="true"
          />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom={`opacity-0 ${!video && "scale-95"}`}
          enterTo={`opacity-100 ${!video && "scale-100"}`}
          leave="ease-in duration-200"
          leaveFrom={`opacity-100 ${!video && "scale-100"}`}
          leaveTo={`opacity-0 ${!video && "scale-95"}`}
        >
          <Dialog.Panel
            className={twMerge(
              `relative z-10 max-w-[30.625rem] w-full m-auto bg-white border border-transparent dark:border-white dark:bg-n-1 ${
                video
                  ? "static max-w-[64rem] aspect-video bg-n-1 overflow-hidden shadow-[0_2.5rem_8rem_rgba(0,0,0,0.5)] dark:border-transparent"
                  : ""
              } ${classWrap}`
            )}
          >
            {title ? (
              <>
                <div className="p-5 pr-12 border-b border-n-1 text-h6 dark:border-white">
                  {title}
                </div>
                <div className="pt-8 px-5 pb-7">{children}</div>
              </>
            ) : (
              children
            )}
            <button
              className={twMerge(
                `absolute top-6 right-5 text-0 hover:fill-purple-1 outline-none dark:fill-white dark:hover:fill-purple-1 ${
                  video ? "absolute top-6 right-6 w-10 h-10 fill-white" : ""
                } ${classButtonClose}`
              )}
              onClick={onClose}
            >
              <Icon className="fill-inherit transition-colors" name="close" />
            </button>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Modal;
