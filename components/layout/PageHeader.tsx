import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  className?: string;
};

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
