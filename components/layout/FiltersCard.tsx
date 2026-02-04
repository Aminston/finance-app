import { ReactNode } from "react";

type FiltersCardProps = {
  children: ReactNode;
};

export function FiltersCard({ children }: FiltersCardProps) {
  return <div className="rounded-xl border bg-card p-4">{children}</div>;
}
