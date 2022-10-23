import { useControllableValue } from "ahooks";
import React, { useMemo } from "react";
import { DropdownPrimitive } from "../DropdownPrimitive";

export interface ISelectOption {
  value: string;
  label?: React.ReactNode;
  disabled?: boolean;
}

export interface ISelectProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "placeholder" | "onChange"
  > {
  options: Array<ISelectOption>;
  placeholder?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  isWhiteBg?: boolean;
}

export function Select(props: ISelectProps) {
  const { options, placeholder, value, defaultValue, onChange, ...restProps } =
    props;
  const optionByKey = useMemo(() => {
    const map: Record<string, ISelectOption> = {};
    options.forEach((opt) => {
      map[opt.value] = opt;
    });
    return map;
  }, [options]);

  const [state, setState] = useControllableValue<string>(props);

  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger {...restProps}>
        {Boolean(!state || !optionByKey[state]) && (placeholder ?? "")}
        {!Boolean(!state || !optionByKey[state]) &&
          (optionByKey[state]?.label ?? optionByKey[state]?.value)}
      </DropdownPrimitive.Trigger>
      <DropdownPrimitive.Content>
        <DropdownPrimitive.RadioGroup value={state} onValueChange={setState}>
          {options.map((option) => (
            <DropdownPrimitive.RadioItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label ?? option.value}
            </DropdownPrimitive.RadioItem>
          ))}
        </DropdownPrimitive.RadioGroup>
      </DropdownPrimitive.Content>
    </DropdownPrimitive.Root>
  );
}
