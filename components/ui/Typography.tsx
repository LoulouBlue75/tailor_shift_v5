import { cn } from "@/lib/utils/cn";

// H1 Component
interface H1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

function H1({ className, children, ...props }: H1Props) {
  return (
    <h1
      className={cn("font-serif text-h1 text-charcoal", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

// H2 Component
interface H2Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

function H2({ className, children, ...props }: H2Props) {
  return (
    <h2
      className={cn("font-serif text-h2 text-charcoal", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

// H3 Component
interface H3Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

function H3({ className, children, ...props }: H3Props) {
  return (
    <h3
      className={cn("font-sans text-h3 font-semibold text-charcoal", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

// Text Component
interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "body" | "caption" | "label";
  as?: "p" | "span" | "div";
  children: React.ReactNode;
}

function Text({
  className,
  variant = "body",
  as: Component = "p",
  children,
  ...props
}: TextProps) {
  const variants = {
    body: "text-body text-charcoal",
    caption: "text-caption text-grey-warm",
    label: "text-label font-medium text-charcoal tracking-luxury-wide uppercase",
  };

  return (
    <Component className={cn(variants[variant], className)} {...props}>
      {children}
    </Component>
  );
}

export { H1, H2, H3, Text, type H1Props, type H2Props, type H3Props, type TextProps };
