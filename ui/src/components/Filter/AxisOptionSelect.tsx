import { Text } from "@mantine/core";
import { GearIcon } from "@radix-ui/react-icons";
import { useControllableValue, useMemoizedFn } from "ahooks";
import { Select } from "../Compact/Select";
import Popover from "../Popover";

export type AxisOptionValue = {
  stack?: "normalize" | "auto" | "zero" | "center";
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

  return (
    <Popover
      title="Axis Options"
      className="w-60"
      content={
        <div>
          <Text size="xs">Stack</Text>
          <Select
            value={state?.stack}
            onChange={handleStackChange}
            isWhiteBg
            options={[
              { value: "normalize", label: "Normalize" },
              { value: "auto", label: "Auto" },
              { value: "zero", label: "Zero" },
              { value: "center", label: "Center" },
            ]}
          />
        </div>
      }
    >
      <div className="inline-flex px-1 py-1 appearance-none cursor-pointer text-gray-700 hover:text-rose-500 ">
        <GearIcon className="w-4 h-4" />
      </div>
    </Popover>
  );
}
