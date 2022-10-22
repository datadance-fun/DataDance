import { DataColumnDataTypeEnum } from "@/api";

export function NumericFieldIcon(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg width="15" height="15" viewBox="0 0 1024 1024" {...props}>
      <path
        fill="currentColor"
        d="M872 394c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8H708V152c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v166H400V152c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v166H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h168v236H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h168v166c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V706h228v166c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V706h164c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8H708V394h164zM628 630H400V394h228v236z"
      />
    </svg>
  );
}

export function TextFieldIcon(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg width="15" height="15" viewBox="0 0 512 512" {...props}>
      <path
        fill="currentColor"
        d="M404.42,170c-41.23,0-78.07,24.06-93.85,61.3L304,246.52l40.33,17.18,6.56-15.22c8.9-21,29.91-34.55,53.53-34.55,34.55,0,57.76,23.27,57.76,57.91v2.3c-22.12.59-48.65,2.05-72.27,4.84-54.52,6.43-87.06,36.23-87.06,79.72,0,23.16,8.72,44,24.56,58.59C342.28,431,362.55,438,384.51,438c30.86,0,57.5-7.33,77.67-22.64V438H506V271.84C506,212.83,463.28,170,404.42,170ZM384.51,395.07c-17.46,0-37.85-9.84-37.85-36.37,0-10.65,3.82-18.11,12.38-24.19,8.34-5.92,21.12-10.15,36-11.9,21.78-2.57,46.31-3.95,67-4.52C459.88,369.58,434.47,395.07,384.51,395.07Z"
      />
      <path
        fill="currentColor"
        d="M93.25,325.87h125.5L260.94,438H308L155,48,4,438H51.06ZM156,160.71,202.25,282h-92.5Z"
      />
    </svg>
  );
}

export function DateTimeFieldIcon(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"
      />
    </svg>
  );
}

export interface IColumnTypeIconProps extends React.SVGAttributes<SVGElement> {
  dataType?: DataColumnDataTypeEnum;
}

export function ColumnTypeIcon({
  dataType,
  ...restProps
}: IColumnTypeIconProps) {
  switch (dataType) {
    case "datetime":
      return <DateTimeFieldIcon {...restProps} />;
    case "float":
      return <NumericFieldIcon {...restProps} />;
    case "int":
      return <NumericFieldIcon {...restProps} />;
    case "string":
      return <TextFieldIcon {...restProps} />;
  }
  return <></>;
}
