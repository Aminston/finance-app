"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type FilterSelectOption = {
  label: string
  value: string
}

type FilterSelectProps = {
  value: string
  onValueChange: (value: string) => void
  options: FilterSelectOption[]
  placeholder?: string
  className?: string
}

export function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder = "Seleccionar...",
  className,
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
