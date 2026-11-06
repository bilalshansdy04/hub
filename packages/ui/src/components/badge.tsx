import * as React from "react";
import { cn } from "../utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "emerald" | "amber" | "sky" | "violet" | "rose" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-white/10 text-zinc-300 border-white/10",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    sky: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    violet: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    outline: "text-zinc-400 border-white/10 bg-transparent",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-medium tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
