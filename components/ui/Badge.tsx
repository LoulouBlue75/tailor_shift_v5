import { cn } from "@/lib/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  children: React.ReactNode;
}

function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full tracking-luxury-wide";

  const variants = {
    default: "bg-ivory-warm text-charcoal-soft",
    success: "bg-success/15 text-[#5A6B4E]",
    warning: "bg-gold/15 text-gold-dark",
    error: "bg-error/15 text-error",
    info: "bg-gold/15 text-gold-dark",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-caption",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps };
