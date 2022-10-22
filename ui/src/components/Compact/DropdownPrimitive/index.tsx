import { twMerge } from "tailwind-merge";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  CaretRightIcon,
  CheckIcon,
  ChevronDownIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";
import React from "react";

interface IBaseItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

function BaseItem_(
  { className, disabled, ...restProps }: IBaseItemProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={twMerge(
        "flex w-full cursor-default select-none items-center rounded px-2 py-1.5 text-xs outline-none pl-[25px] relative",
        "text-gray-700 focus:bg-rose-500 focus:text-white",
        disabled ? "opacity-50 pointer-events-none" : "",
        className
      )}
      {...restProps}
    />
  );
}

const BaseItem = React.forwardRef(BaseItem_);

function Separator({
  className,
  ...restProps
}: DropdownMenuPrimitive.DropdownMenuSeparatorProps) {
  return (
    <DropdownMenuPrimitive.Separator
      className={twMerge("my-1 h-px bg-gray-200", className)}
      {...restProps}
    />
  );
}

function Item({
  className,
  children,
  ...restProps
}: DropdownMenuPrimitive.MenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item asChild {...restProps}>
      <BaseItem className={className}>{children}</BaseItem>
    </DropdownMenuPrimitive.Item>
  );
}

function IndicatorContainer_(
  { className, ...restProps }: React.HTMLAttributes<HTMLDivElement>,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div
      className={twMerge(
        "absolute left-0 w-[25px] inline-flex justify-center items-center",
        className
      )}
      ref={ref}
      {...restProps}
    />
  );
}

const IndicatorContainer = React.forwardRef(IndicatorContainer_);

function ItemIndicator_(
  props: DropdownMenuPrimitive.MenuItemIndicatorProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <DropdownMenuPrimitive.ItemIndicator asChild>
      <IndicatorContainer ref={ref} {...props}></IndicatorContainer>
    </DropdownMenuPrimitive.ItemIndicator>
  );
}

const ItemIndicator = React.forwardRef(ItemIndicator_);

function CheckboxItem_(
  {
    className,
    children,
    disabled,
    ...restProps
  }: DropdownMenuPrimitive.MenuCheckboxItemProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      asChild
      disabled={disabled}
      {...restProps}
      ref={ref}
    >
      <BaseItem className={className} disabled={disabled}>
        {children}
        <ItemIndicator>
          <CheckIcon />
        </ItemIndicator>
      </BaseItem>
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function RadioItem_(
  {
    className,
    children,
    disabled,
    ...restProps
  }: DropdownMenuPrimitive.MenuRadioItemProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <DropdownMenuPrimitive.RadioItem
      asChild
      disabled={disabled}
      {...restProps}
      ref={ref}
    >
      <BaseItem className={className} disabled={disabled}>
        {children}
        <ItemIndicator>
          <DotFilledIcon />
        </ItemIndicator>
      </BaseItem>
    </DropdownMenuPrimitive.RadioItem>
  );
}

function SubTrigger({
  className,
  children,
  ...restProps
}: DropdownMenuPrimitive.MenuSubTriggerProps) {
  return (
    <DropdownMenuPrimitive.SubTrigger asChild {...restProps}>
      <BaseItem className={className}>
        <div className="flex-1 flex flex-row items-center">{children}</div>
        <CaretRightIcon />
      </BaseItem>
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function Label({
  className,
  ...restProps
}: DropdownMenuPrimitive.MenuLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      className={twMerge(
        "select-none px-1 py-1 text-xs text-rose-600 opacity-70",
        className
      )}
      {...restProps}
    />
  );
}

const baseContentStyle = [
  "rounded-md px-1 py-1 text-xs shadow-lg",
  "bg-white z-10",
];

function Content_(
  { className, ...restProps }: DropdownMenuPrimitive.MenuContentProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align="start"
        className={twMerge(
          "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
          "max-h-[300px] overflow-y-auto",
          "w-full min-w-[150px]",
          ...baseContentStyle,
          className
        )}
        ref={ref}
        {...restProps}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function SubContent_(
  { className, ...restProps }: DropdownMenuPrimitive.MenuSubContentProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={twMerge(
        "origin-radix-dropdown-menu radix-side-right:animate-scale-in",
        "w-full",
        ...baseContentStyle,
        className
      )}
      ref={ref}
      {...restProps}
    />
  );
}

function Trigger({
  className,
  children,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <DropdownMenuPrimitive.Trigger asChild>
      <div
        className={twMerge(
          "inline-flex flex-row items-center text-xs rounded py-1.5 px-2",
          "cursor-default select-none",
          "bg-white hover:bg-gray-200 text-gray-700",
          "appearance-none shadow-xs",
          className
        )}
        {...restProps}
      >
        <div className="flex-1 flex h-4">{children}</div>
        <ChevronDownIcon className="ml-4" />
      </div>
    </DropdownMenuPrimitive.Trigger>
  );
}

export const DropdownPrimitive = {
  Root: DropdownMenuPrimitive.Root,
  Trigger,
  Content: React.forwardRef(Content_),
  Item,
  Group: DropdownMenuPrimitive.Group,
  CheckboxItem: React.forwardRef(CheckboxItem_),
  RadioGroup: DropdownMenuPrimitive.RadioGroup,
  RadioItem: React.forwardRef(RadioItem_),
  Label,
  Separator,
  Sub: DropdownMenuPrimitive.Sub,
  SubTrigger,
  SubContent: React.forwardRef(SubContent_),
  IndicatorContainer, // Used to put into the indicator region without a context
};
