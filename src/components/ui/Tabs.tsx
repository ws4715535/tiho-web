import React from "react";
import { cn } from "../../lib/utils";

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-slate-200 p-1 text-slate-500 dark:bg-slate-900 dark:text-slate-400 w-full",
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, active, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
          : "hover:text-slate-700 dark:hover:text-slate-200",
        className
      )}
      {...props}
    />
  )
);
TabsTrigger.displayName = "TabsTrigger";