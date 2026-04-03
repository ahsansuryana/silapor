type StatusBadgeProps = {
  children: string;
  variant?: "status" | "condition";
};

const statusClasses: Record<string, string> = {
  Resolved: "bg-primary-fixed/20 text-on-primary-fixed-variant",
  "In Progress": "bg-secondary-container/20 text-on-secondary-container",
  Pending: "bg-surface-container-highest text-on-surface-variant",
  Operational: "bg-primary/10 text-primary",
  Maintenance: "bg-secondary-container/20 text-on-secondary-container",
  Broken: "bg-error/10 text-error",
};

const conditionClasses: Record<string, string> = {
  Excellent: "text-primary",
  Good: "text-primary",
  Fair: "text-on-secondary-container",
  Poor: "text-error",
};

export default function StatusBadge({
  children,
  variant = "status",
}: StatusBadgeProps) {
  const classes =
    variant === "condition"
      ? (conditionClasses[children] ?? "text-on-surface")
      : (statusClasses[children] ??
        "bg-surface-container-highest text-on-surface-variant");

  const base =
    variant === "condition"
      ? "text-xs font-bold uppercase tracking-widest"
      : "px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest";

  return <span className={`${base} ${classes}`}>{children}</span>;
}
