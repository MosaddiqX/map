/* eslint-disable */
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Edit2, MoreVertical, Trash2, Calendar, Tag, Clock } from "lucide-react"

import type { Task } from "@/lib/types"
import { cn, formatRelativeDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TaskInput } from "@/components/task-input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface TaskCardProps {
  task: Task
  isEditing: boolean
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
  onUpdate: (task: Task) => void
  onCancelEdit: () => void
  onDelete: (id: string) => void
}

export function TaskCard({
  task,
  isEditing,
  onToggleComplete,
  onEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isCheckboxHovered, setIsCheckboxHovered] = useState(false)

  if (isEditing) {
    return <TaskInput initialTask={task} onAddTask={onUpdate} onCancel={onCancelEdit} />
  }

  const priorityColors = {
    low: "bg-[hsl(var(--priority-low))]",
    medium: "bg-[hsl(var(--priority-medium))]",
    high: "bg-[hsl(var(--priority-high))]",
  }

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date()

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group relative mb-2 rounded-lg border border-border/50 bg-card/50 p-4 shadow-sm backdrop-blur-sm transition-all",
          "hover:border-border hover:bg-card hover:shadow-md",
          task.completed && "bg-muted/50",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start gap-3">
          <div
            className="relative mt-0.5"
            onMouseEnter={() => setIsCheckboxHovered(true)}
            onMouseLeave={() => setIsCheckboxHovered(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-5 w-5 shrink-0 rounded-full border border-input p-0 transition-all",
                task.completed
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-primary hover:scale-110 hover:bg-primary/10 hover:text-primary",
              )}
              onClick={() => onToggleComplete(task.id)}
            >
              <AnimatePresence mode="wait">
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="h-3 w-3" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="sr-only">Mark as {task.completed ? "incomplete" : "complete"}</span>
            </Button>

            {/* Priority indicator */}
            <div
              className={cn(
                "absolute -right-1 -top-1 h-2 w-2 rounded-full",
                priorityColors[task.priority as keyof typeof priorityColors],
              )}
            />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "text-base font-medium transition-colors",
                  task.completed && "text-muted-foreground line-through",
                )}
              >
                {task.title}
              </h3>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Task options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(task.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {task.description && (
              <p className={cn("text-sm text-muted-foreground", task.completed && "line-through")}>
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {formattedDate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className={cn(
                        "flex items-center gap-1 font-normal",
                        isOverdue && "border-destructive text-destructive",
                      )}
                    >
                      <Calendar className="h-3 w-3" />
                      {formattedDate}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{isOverdue ? "Overdue" : "Due date"}</TooltipContent>
                </Tooltip>
              )}

              {task.completedAt && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="flex items-center gap-1 font-normal">
                      <Clock className="h-3 w-3" />
                      {formatRelativeDate(task.completedAt)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Completed {new Date(task.completedAt).toLocaleString()}</TooltipContent>
                </Tooltip>
              )}

              {task.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Progress indicator for task completion animation */}
        <AnimatePresence>
          {task.completed && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-primary"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}

