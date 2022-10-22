import { Transition } from "@headlessui/react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import cx from "classnames";
import React, { Fragment } from "react";
import { Button } from "@/components/Button";

export type AlertType = "error" | "info";

export interface IAlertDialogProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  type?: AlertType;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Alert_({
  title,
  children,
  type,
  open = false,
  onOpenChange,
}: IAlertDialogProps) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <Transition.Root show={open}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <AlertDialogPrimitive.Overlay
              forceMount
              className="fixed inset-0 z-20 bg-black/30"
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <AlertDialogPrimitive.Content
              forceMount
              className={cx(
                "fixed z-50",
                "w-[95vw] max-w-sm rounded p-6 md:w-full",
                "top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
                "bg-white shadow-xl",
                {
                  "border-t-4 border-red-500": type === "error",
                  "border-t-4 border-sky-400": type === "info",
                }
              )}
            >
              <div>
                {Boolean(title) && (
                  <AlertDialogPrimitive.Title className="text-lg leading-8 font-medium text-gray-900">
                    {title}
                  </AlertDialogPrimitive.Title>
                )}
                {Boolean(children) && (
                  <AlertDialogPrimitive.Description
                    className="my-5 text-sm font-normal text-gray-700"
                    asChild
                  >
                    <div className="break-words">{children}</div>
                  </AlertDialogPrimitive.Description>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <AlertDialogPrimitive.Action asChild>
                  <Button type="primary">OK</Button>
                </AlertDialogPrimitive.Action>
              </div>
            </AlertDialogPrimitive.Content>
          </Transition.Child>
        </Transition.Root>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}

export const Alert = React.memo(Alert_);

export * from "./api";
