'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDropdownData } from '@/lib/hooks/use-dropdown-data';

export interface DropdownSelectProps {
  type: 'customers' | 'products' | 'locations';
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function DropdownSelect({
  type,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className,
  emptyMessage = 'No items found.',
}: DropdownSelectProps) {
  const [open, setOpen] = React.useState(false);
  const { data: options, isLoading, isError } = useDropdownData(type, !disabled);

  // Find the selected item to display its name
  const selectedItem = React.useMemo(() => {
    if (!value || !options) return null;
    return options.find((item) => item.id === value);
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between', className)}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : selectedItem ? (
            selectedItem.name
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${type}...`} />
          <CommandEmpty>
            {isError 
              ? 'Failed to load data.' 
              : emptyMessage}
          </CommandEmpty>
          <CommandGroup>
            {options?.map((option) => (
              <CommandItem
                key={option.id}
                value={option.id}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === option.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {option.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 