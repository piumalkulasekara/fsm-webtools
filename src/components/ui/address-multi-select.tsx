"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export type MultiSelectOption = {
  value: string;
  label: string;
};

interface AddressMultiSelectProps {
  options: MultiSelectOption[];
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  searchPlaceholder?: string;
  closeOnSelect?: boolean;
}

// Memoized option component for better performance
const SelectOption = React.memo(
  ({ 
    option, 
    isSelected, 
    onSelect 
  }: { 
    option: MultiSelectOption; 
    isSelected: boolean;
    onSelect: (value: string) => void;
  }) => (
    <div
      key={option.value}
      className={cn(
        "relative flex items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        isSelected 
          ? "bg-muted text-muted-foreground cursor-not-allowed" 
          : "cursor-pointer hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={() => {
        if (!isSelected) {
          onSelect(option.value);
        }
      }}
    >
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
      {option.label}
    </div>
  )
);
SelectOption.displayName = "SelectOption";

export function AddressMultiSelect({
  options = [],
  values = [],
  onValuesChange,
  placeholder = "Select options",
  emptyMessage = "No results found.",
  className,
  searchPlaceholder = "Search...",
  closeOnSelect = false,
}: AddressMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [width, setWidth] = React.useState<number | undefined>(undefined);
  
  // Ensure options is always an array
  const safeOptions = React.useMemo(() => 
    Array.isArray(options) ? options : [],
    [options]
  );
  
  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return safeOptions;
    const query = searchQuery.toLowerCase();
    return safeOptions.filter(option => 
      option.label.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query)
    );
  }, [safeOptions, searchQuery]);

  // Update width when the dropdown opens
  React.useEffect(() => {
    if (open && triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  // Handle selecting an option
  const handleSelect = React.useCallback((value: string) => {
    const newValues = [...values, value];
    onValuesChange(newValues);
    if (closeOnSelect) {
      setOpen(false);
      setSearchQuery("");
    }
  }, [values, onValuesChange, closeOnSelect]);

  // Memoize selected options
  const selectedOptions = React.useMemo(() => 
    values.map(value => safeOptions.find(o => o.value === value))
      .filter((option): option is MultiSelectOption => !!option),
    [values, safeOptions]
  );

  // Memoize display text
  const displayText = React.useMemo(() => {
    return selectedOptions.length > 0 
      ? `${selectedOptions.length} selected` 
      : placeholder;
  }, [selectedOptions.length, placeholder]);

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
          >
            <span className="truncate">{displayText}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0" 
          style={{ width: width ? `${width}px` : undefined }}
          align="start"
        >
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder={searchPlaceholder}
              className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-64 overflow-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = values.includes(option.value);
                return (
                  <SelectOption
                    key={option.value}
                    option={option}
                    isSelected={isSelected}
                    onSelect={handleSelect}
                  />
                );
              })
            ) : (
              <div className="py-6 text-center text-sm">{emptyMessage}</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 