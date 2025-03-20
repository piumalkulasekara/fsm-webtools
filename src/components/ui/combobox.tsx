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

export type ComboboxOption = {
  value: string;
  label: string;
};

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  searchPlaceholder?: string;
}

export function Combobox({
  options = [],
  value,
  onValueChange,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  className,
  searchPlaceholder = "Search...",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : [];
  
  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return safeOptions;
    return safeOptions.filter(option => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [safeOptions, searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? safeOptions.find((option) => option.value === value)?.label || placeholder
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
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
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value === option.value && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onValueChange(option.value === value ? "" : option.value);
                  setOpen(false);
                  setSearchQuery("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-sm">{emptyMessage}</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 