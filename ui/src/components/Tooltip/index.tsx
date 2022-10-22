import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import cx from "classnames";

export interface ITooltipProps {
  children?: React.ReactNode;
  title: React.ReactNode;
  delay?: number;
}

export function Tooltip({ children, title, delay }: ITooltipProps) {
  return (
    <TooltipPrimitive.Root delayDuration={delay}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        side="top"
        align="center"
        className={cx(
          "radix-side-top:animate-slide-up-fade",
          "radix-side-right:animate-slide-left-fade",
          "radix-side-bottom:animate-slide-down-fade",
          "radix-side-left:animate-slide-right-fade",
          "inline-flex items-center px-4 py-2.5",
          "bg-gray-800 bg-opacity-90"
        )}
      >
        <div className="text-xs text-gray-100">{title}</div>
        <TooltipPrimitive.Arrow
          offset={5}
          width={11}
          height={5}
          className="fill-current text-gray-800 text-opacity-90"
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
