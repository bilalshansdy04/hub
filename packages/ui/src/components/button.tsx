import * as React from "react";
import { cn } from "../utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "emerald" | "amber" | "sky" | "violet" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer";

    const variantStyles = {
      default: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10 shadow-sm",
      emerald:
        "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/30 border border-emerald-500/30",
      amber:
        "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-sm",
      sky: "bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 shadow-sm",
      violet:
        "bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-950/30 border border-violet-500/30",
      destructive:
        "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 shadow-sm",
      outline:
        "border border-white/10 bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white",
      ghost: "hover:bg-white/5 text-zinc-400 hover:text-zinc-100",
    };

    const sizeStyles = {
      default: "h-9 px-4 py-2 rounded-xl",
      sm: "h-8 px-3 rounded-lg text-[11px]",
      lg: "h-11 px-6 rounded-2xl text-sm",
      icon: "h-9 w-9 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
