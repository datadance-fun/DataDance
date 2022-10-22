import cx from "classnames";
import React from "react";

export type ButtonType = "default" | "primary";

export interface IButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  type?: ButtonType;
  children?: React.ReactNode;
}

function Button_(
  { children, disabled = false, type = "default", ...props }: IButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cx(
        "inline-flex select-none items-center justify-center rounded px-4 py-1.5 text text-sm font-medium",
        "focus-ring",
        {
          "text-gray-500 hover:bg-gray-100 hover:text-blue-500":
            !disabled && type === "default",
        },
        {
          "bg-blue-600 text-white hover:bg-blue-500":
            !disabled && type === "primary",
        },
        {
          "bg-gray-200 text-gray-400": disabled,
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
        "inline-flex select-none items-center justify-center rounded px-2 py-2 text text-sm font-medium",
        "focus-ring",
        {
          "text-gray-500 hover:bg-gray-100 hover:text-blue-500":
            type === "default",
        },
        {
          "bg-blue-600 text-white hover:bg-blue-500": type === "primary",
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export const IconButton = React.forwardRef(IconButton_);
