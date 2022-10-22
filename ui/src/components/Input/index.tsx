import { useControllableValue } from "ahooks";
import { twMerge } from "tailwind-merge";

export interface IInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

export function Input(props: IInputProps) {
  const [state, setState] = useControllableValue<string>(props);
  return (
    <input
      className={twMerge(
        "block w-full text-gray-700 placeholder:text-gray-500 bg-gray-100",
        "rounded px-2 py-1.5 text-sm font-medium",
        "focus-ring",
        props.className
      )}
      value={state}
      onChange={(e) => setState(e.target.value)}
      readOnly={props.readOnly}
    />
  );
}
