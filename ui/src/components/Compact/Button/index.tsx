import cx from "classnames";
import React from "react";

export type ButtonType = "default" | "primary";

export interface IButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: ButtonType;
  children?: React.ReactNode;
}

function Button_(
  { children, type = "default", ...props }: IButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      className={cx(
        "inline-flex select-none items-center justify-center rounded px-2 py-1.5 text text-xs font-medium",
        "appearance-none shadow-xs",
        "focus-ring",
        {
          "bg-white text-gray-500 hover:bg-gray-200": type === "default",
        },
        {
          "bg-blue-500 text-white hover:bg-blue-400": type === "primary",
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export const Button = React.forwardRef(Button_);

function IconButton_(
  { children, type = "default", ...props }: IButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      className={cx(
        "inline-flex select-none items-center justify-center rounded px-1.5 py-1.5 text text-xs font-medium",
        "appearance-none shadow-xs",
        "focus-ring",
        {
          "bg-white text-gray-500 hover:bg-gray-200": type === "default",
        },
        {
          "bg-blue-500 text-white hover:bg-blue-400": type === "primary",
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export const IconButton = React.forwardRef(IconButton_);
