import { useControllableValue } from "ahooks";

export interface IStepItem {
  id: string;
  name: string;
}

export interface IStepProps {
  data: Array<IStepItem>;
  value?: number;
  defaultValue?: number;
  onChange?: (v: number) => void;
}

export function Step(props: IStepProps) {
  const [state, setState] = useControllableValue<number>(props, {
    defaultValue: 0,
  });

  return (
    <nav aria-label="Progress">
      <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {props.data.map((step, idx) => (
          <li key={idx} className="md:flex-1">
            {idx < state ? (
              <a
                href="javascript:;"
                className="group focus-ring pl-4 py-2 flex flex-col border-l-4 border-blue-600 hover:border-blue-400 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                onClick={() => setState(idx)}
              >
                <span className="text-xs text-blue-600 font-semibold tracking-wide uppercase">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : idx === state ? (
              <a
                href="javascript:;"
                className="focus-ring pl-4 py-2 flex flex-col border-l-4 border-blue-600 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                onClick={() => setState(idx)}
              >
                <span className="text-xs text-blue-600 font-semibold tracking-wide uppercase">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : (
              <a
                href="javascript:;"
                className="group focus-ring pl-4 py-2 flex flex-col border-l-4 border-gray-200 hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                onClick={() => setState(idx)}
              >
                <span className="text-xs text-gray-500 font-semibold tracking-wide uppercase group-hover:text-gray-700">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
