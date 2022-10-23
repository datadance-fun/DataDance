import cx from "classnames";
import { Stack, Text } from "@mantine/core";
import { GearIcon } from "@radix-ui/react-icons";
import { useControllableValue, useMemoizedFn } from "ahooks";
import { Select } from "../Compact/Select";
import Popover from "../Popover";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

export type AxisOptionValue = {
  stack?: "normalize" | "auto" | "zero" | "center";
  zero?: boolean;
};

export interface IAxisOptionProps {
  value?: AxisOptionValue;
  onChange?: (v: AxisOptionValue) => void;
}

export function AxisOptionSelect(props: IAxisOptionProps) {
  const [state, setState] = useControllableValue<AxisOptionValue | undefined>(
    props
  );

  const handleStackChange = useMemoizedFn((v: any) => {
    setState((state) => {
      return {
        ...state,
        stack: v,
      };
    });
  });

  const handleZeroChange = useMemoizedFn((checked: boolean) => {
    setState((state) => {
      return {
        ...state,
        zero: checked,
      };
    });
  });

  return (
    <Popover
      title="Axis Options"
      className="w-60"
      content={
        <Stack spacing="md">
          <div>
            <Text size="xs">Stack</Text>
            <Select
              value={state?.stack ?? "auto"}
              onChange={handleStackChange}
              isWhiteBg
              options={[
                { value: "auto", label: "Auto" },
                { value: "normalize", label: "Normalize" },
                { value: "zero", label: "Zero" },
                { value: "center", label: "Center" },
              ]}
            />
          </div>
          <div>
            <Text size="xs">Zero based</Text>
            <CheckboxPrimitive.Root
              id="c1"
              checked={state?.zero ?? true}
              onCheckedChange={handleZeroChange}
              className={cx(
                "flex h-5 w-5 items-center justify-center rounded",
                "radix-state-checked:bg-rose-500 radix-state-unchecked:bg-gray-100",
                "focus-ring"
              )}
            >
              <CheckboxPrimitive.Indicator>
                <CheckIcon className="h-4 w-4 self-center text-white" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
          </div>
        </Stack>
      }
    >
      <div className="inline-flex px-1 py-1 appearance-none cursor-pointer text-gray-700 hover:text-rose-500 ">
        <GearIcon className="w-4 h-4" />
      </div>
    </Popover>
  );
}
