import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export interface IRootProps {
  children?: React.ReactNode;
}

export function Root({ children }: IRootProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      {children}
    </TooltipPrimitive.Provider>
  );
}
