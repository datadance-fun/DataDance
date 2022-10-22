import { useControllableValue, useMemoizedFn } from "ahooks";
import { orderBy } from "lodash";
import React, { useMemo, useState } from "react";
import { DropdownPrimitive } from "../DropdownPrimitive";

export interface IMultiSelectOption {
  value: string;
  label?: React.ReactNode;
  disabled?: boolean;
}

export interface IMultiSelectProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "placeholder" | "onChange" | "defaultValue"
  > {
  options: Array<IMultiSelectOption>;
  placeholder?: React.ReactNode; // Displayed with selected_n == 0
  value?: Set<string>;
  defaultValue?: Set<string>;
  onChange?: (value: Set<string>) => void;
}

export function MultiSelect(props: IMultiSelectProps) {
  const { options, placeholder, value, defaultValue, onChange, ...restProps } =
    props;
  const [state, setState] = useControllableValue<Set<string>>(props, {
    defaultValue: new Set(),
  });
  const [filter, setFilter] = useState<string>("");
  const handleSelectAll = useMemoizedFn((ev: Event) => {
    const newState = new Set<string>();
    options.forEach((opt) => {
      if (!opt.disabled) {
        newState.add(opt.value);
      }
    });
    setState(newState);
    ev.preventDefault();
  });
  const handleDeselectAll = useMemoizedFn((ev: Event) => {
    setState(new Set());
    ev.preventDefault();
  });
  const handleCheckChange = useMemoizedFn(
    (option: IMultiSelectOption, checked: boolean | "indeterminate") => {
      if (checked) {
        setState((state) => {
          const newState = new Set(state);
          newState.add(option.value);
          return newState;
        });
      } else {
        setState((state) => {
          const newState = new Set(state);
          newState.delete(option.value);
          return newState;
        });
      }
    }
  );

  const filteredOptions = useMemo(() => {
    const orderedOptions = orderBy(options, ["value"]);
    if (!filter) {
      return orderedOptions.slice(0, 50);
    }
    const fl = filter.toLowerCase();
    const ret: Array<IMultiSelectOption> = [];
    for (const opt of orderedOptions) {
      if (opt.value.toLowerCase().indexOf(fl) > -1) {
        ret.push(opt);
      }
      if (ret.length === 50) {
        break;
      }
    }
    return ret;
  }, [options, filter]);

  const handleSelectDoNotClose = useMemoizedFn((ev: Event) => {
    ev.preventDefault();
  });

  const selected_n = state?.size ?? 0;

  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger {...restProps}>
        {Boolean(selected_n === 0 && placeholder) && placeholder}
        {!Boolean(selected_n === 0 && placeholder) && <>{selected_n} values</>}
      </DropdownPrimitive.Trigger>
      <DropdownPrimitive.Content>
        <input
          className="w-full px-1 py-1 text-xs focus-ring"
          placeholder="Filter"
          value={filter}
          onChange={(ev) => setFilter(ev.target.value)}
          onKeyDown={(ev) => ev.stopPropagation()}
          autoFocus
        />
        <DropdownPrimitive.Separator />
        <DropdownPrimitive.Item onSelect={handleSelectAll}>
          Select all
        </DropdownPrimitive.Item>
        <DropdownPrimitive.Item onSelect={handleDeselectAll}>
          Deselect all
        </DropdownPrimitive.Item>
        <DropdownPrimitive.Separator />
        {filteredOptions.map((option) => (
          <DropdownPrimitive.CheckboxItem
            key={option.value}
            checked={state?.has(option.value) ?? false}
            disabled={option.disabled}
            onCheckedChange={(checked) => handleCheckChange(option, checked)}
            onSelect={handleSelectDoNotClose}
          >
            {option.label ?? option.value}
          </DropdownPrimitive.CheckboxItem>
        ))}
        {Boolean((options.length ?? 0) > 50) && (
          <DropdownPrimitive.Item>
            ... there are more ...
          </DropdownPrimitive.Item>
        )}
      </DropdownPrimitive.Content>
    </DropdownPrimitive.Root>
  );
}
