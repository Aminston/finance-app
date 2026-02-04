import { ReactNode } from "react";

type FiltersBarProps = {
  children: ReactNode;
};

export function FiltersBar({ children }: FiltersBarProps) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}
