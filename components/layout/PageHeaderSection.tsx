import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";

type PageHeaderSectionProps = {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function PageHeaderSection({
  title,
  subtitle,
  actions,
  children,
  className
}: PageHeaderSectionProps) {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title={title} subtitle={subtitle} />
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
