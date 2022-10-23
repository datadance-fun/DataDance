import cx from "classnames";
import { Cross1Icon } from "@radix-ui/react-icons";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { twMerge } from "tailwind-merge";
import React from "react";

export interface IPopoverProps {
  title?: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const Popover = (props: IPopoverProps) => {
  return (
    <PopoverPrimitive.Root onOpenChange={props.onOpenChange} modal>
      <PopoverPrimitive.Trigger asChild>
        {props.children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="center"
          sideOffset={4}
          className={twMerge(
            "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
            "w-60 z-10 rounded p-4 shadow-xl border-stone-100 border",
            "bg-white",
            props.className
          )}
        >
          <h3 className="text-base font-medium text-gray-900">{props.title}</h3>
          <div className="text-sm mt-4">{props.content}</div>
          <PopoverPrimitive.Close
            className={cx(
              "absolute top-4 right-4 inline-flex items-center justify-center rounded-full p-1 focus-ring"
            )}
          >
            <Cross1Icon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </PopoverPrimitive.Close>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default Popover;
