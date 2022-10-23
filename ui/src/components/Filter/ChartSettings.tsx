import React from "react";
import Popover from "../Popover";

export const ChartSettings: React.FC<{
  children?: React.ReactNode;
  title?: string;
}> = ({ children, title }) => {
  return (
    <Popover title={title} className="w-80" content={<div></div>}>
      {children}
    </Popover>
  );
};
