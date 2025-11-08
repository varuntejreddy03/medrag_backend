import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
}

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => context?.setIsOpen(!context.isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const context = React.useContext(SelectContext);
  return <span>{context?.value || placeholder}</span>;
};

const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  const context = React.useContext(SelectContext);
  
  if (!context?.isOpen) return null;
  
  return (
    <div className={cn(
      "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-white/20 bg-gray-900 py-1 text-base shadow-lg focus:outline-none",
      className
    )}>
      {children}
    </div>
  );
};

const SelectItem: React.FC<SelectItemProps> = ({ value, children, className }) => {
  const context = React.useContext(SelectContext);
  
  return (
    <div
      className={cn(
        "relative cursor-pointer select-none py-2 px-3 text-white hover:bg-white/10",
        context?.value === value && "bg-white/20",
        className
      )}
      onClick={() => {
        context?.onValueChange(value);
        context?.setIsOpen(false);
      }}
    >
      {children}
    </div>
  );
};

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};