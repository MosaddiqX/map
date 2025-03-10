"use client"

import { motion } from "framer-motion"
import { CheckCircle, Search, Filter } from "lucide-react"
import type { Filter as FilterType } from "@/lib/types"

interface EmptyStateProps {
  filter: FilterType
  search?: string
}

export function EmptyState({ filter, search }: EmptyStateProps) {
  let icon = CheckCircle
  let title = "All caught up!"
  let description = "You don't have any tasks that match your current filter."

  if (search) {
    icon = Search
    title = "No results found"
    description = `No tasks match your search for "${search}".`
  } else if (filter === "completed") {
    title = "No completed tasks"
    description = "You haven't completed any tasks yet."
  } else if (filter === "today") {
    title = "Nothing due today"
    description = "You don't have any tasks due today."
  } else if (filter === "upcoming") {
    title = "Nothing upcoming"
    description = "You don't have any upcoming tasks."
  } else if (filter === "overdue") {
    title = "Nothing overdue"
    description = "You don't have any overdue tasks."
  } else if (filter.startsWith("tag:")) {
    const tag = filter.replace("tag:", "")
    icon = Filter
    title = `No tasks with tag: ${tag}`
    description = `You don't have any tasks with the tag "${tag}".`
  }

  const Icon = icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-full flex-col items-center justify-center rounded-lg p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mb-4 rounded-full bg-primary/10 p-3"
      >
        <Icon className="h-6 w-6 text-primary" />
      </motion.div>
      <motion.h3
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="mb-1 text-lg font-medium"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mb-4 text-sm text-muted-foreground"
      >
        {description}
      </motion.p>
    </motion.div>
  )
}

