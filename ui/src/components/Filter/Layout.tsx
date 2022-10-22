export interface IPanelProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  icon?: React.ReactNode;
}

export function Panel({ children, title, icon }: IPanelProps) {
  return (
    <div className="border-b border-slate-200 py-4">
      <div className="text-xs px-4 mb-3 text-slate-400 font-bold flex flex-row items-center gap-x-1">
        {Boolean(icon) && icon}
        {title}
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}

export interface IColumnProps {
  children?: React.ReactNode;
}

export function Column({ children }: IColumnProps) {
  return (
    <div className="border-r border-slate-200 min-w-[300px] overflow-y-auto">
      <div>{children}</div>
    </div>
  );
}

export interface IContainerProps {
  children?: React.ReactNode;
}

export function Container({ children }: IContainerProps) {
  // See Nav.tsx for margin-top.
  return (
    <div className="fixed h-screen z-10 top-0 ml-[275px] left-1/2 right-0 overflow-x-auto pt-12 flex flex-row items-stretch">
      {children}
    </div>
  );
}
