import { cn } from "@/lib/utils/cn";

// Container Component
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

function Container({
  className,
  size = "lg",
  children,
  ...props
}: ContainerProps) {
  const sizes = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
  };

  return (
    <div
      className={cn("mx-auto w-full px-comfortable", sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Stack Component (vertical spacing)
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

function Stack({ className, gap = "md", children, ...props }: StackProps) {
  const gaps = {
    none: "space-y-0",
    xs: "space-y-1",
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
    xl: "space-y-8",
  };

  return (
    <div className={cn("flex flex-col", gaps[gap], className)} {...props}>
      {children}
    </div>
  );
}

// Grid Component
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

function Grid({ className, cols = 1, gap = "md", children, ...props }: GridProps) {
  const columns = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const gaps = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div className={cn("grid", columns[cols], gaps[gap], className)} {...props}>
      {children}
    </div>
  );
}

// Divider Component
interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

function Divider({
  className,
  orientation = "horizontal",
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("h-full w-px bg-concrete", className)}
        {...props}
      />
    );
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={cn("border-t border-concrete", className)}
      {...props}
    />
  );
}

export {
  Container,
  Stack,
  Grid,
  Divider,
  type ContainerProps,
  type StackProps,
  type GridProps,
  type DividerProps,
};
