"use client"

import { motion } from "framer-motion"
import type { Filter } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TaskFilterProps {
  currentFilter: Filter
  onFilterChange: (filter: Filter) => void
}

export function TaskFilter({ currentFilter, onFilterChange }: TaskFilterProps) {
  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ]

  return (
    <div className="relative flex items-center justify-between overflow-x-auto rounded-lg border border-border/50 bg-card/50 p-1 shadow-sm backdrop-blur-sm">
      <div className="flex gap-1">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              currentFilter === filter.value ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {currentFilter === filter.value && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 rounded-md bg-secondary"
                initial={false}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

