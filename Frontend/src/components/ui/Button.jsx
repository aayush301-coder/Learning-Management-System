import { cn } from "../../utils/cn";

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className,
  disabled,
  ...props
}) {
  const variants = {
    primary: "bg-ink text-paper hover:bg-ink-soft focus-visible:outline-ink",
    accent: "bg-highlighter text-ink hover:brightness-95 focus-visible:outline-highlighter",
    secondary: "bg-paper-dim text-ink hover:bg-paper-dim/70 focus-visible:outline-ink",
    danger: "bg-clay text-white hover:brightness-95 focus-visible:outline-clay",
    outline: "border border-ink/15 bg-transparent text-ink hover:bg-ink/[0.04] focus-visible:outline-ink",
    ghost: "text-ink hover:bg-ink/[0.06] focus-visible:outline-ink",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "rounded-md font-medium tracking-tight transition-colors duration-150 outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
