import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded border border-white/20 bg-white/10 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-white checked:text-black",
            className
          )}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        {props.checked && (
          <Check className="absolute inset-0 h-4 w-4 text-black pointer-events-none" />
        )}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }