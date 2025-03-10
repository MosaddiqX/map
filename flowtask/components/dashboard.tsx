"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LayoutGrid, List, Plus, Search, SlidersHorizontal, X, Eye, EyeOff } from "lucide-react"

import type { Task, View, Filter, SortOption } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TaskList } from "@/components/task-list"
import { TaskBoard } from "@/components/task-board"
import { TaskInput } from "@/components/task-input"
import { TaskStats } from "@/components/task-stats"
import { EmptyState } from "@/components/empty-state"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface DashboardProps {
  tasks: Task[]
  allTasks: Task[]
  view: View
  onViewChange: (view: View) => void
  filter: Filter
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  search: string
  onSearchChange: (search: string) => void
  showCompleted: boolean
  onShowCompletedChange: (show: boolean) => void
  onAddTask: (task: Task) => void
  onToggleComplete: (id: string) => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onReorderTasks: (tasks: Task[]) => void
}

export function Dashboard({
  tasks,
  allTasks,
  view,
  onViewChange,
  filter,
  sort,
  onSortChange,
  search,
  onSearchChange,
  showCompleted,
  onShowCompletedChange,
  onAddTask,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
  onReorderTasks,
}: DashboardProps) {
  const [isInputExpanded, setIsInputExpanded] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const { toast } = useToast()

  const handleAddTask = (task: Task) => {
    onAddTask(task)
    setIsInputExpanded(false)
    toast({
      title: "Task added",
      description: "Your task has been successfully created.",
    })
  }

  const getFilterTitle = () => {
    if (filter === "all") return "All Tasks"
    if (filter === "active") return "Active Tasks"
    if (filter === "completed") return "Completed Tasks"
    if (filter === "today") return "Today's Tasks"
    if (filter === "upcoming") return "Upcoming Tasks"
    if (filter === "overdue") return "Overdue Tasks"
    if (filter === "high") return "High Priority"
    if (filter === "medium") return "Medium Priority"
    if (filter === "low") return "Low Priority"
    if (filter.startsWith("tag:")) return `Tag: ${filter.replace("tag:", "")}`
    return "Tasks"
  }

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "dateCreated", label: "Date Created (Newest)" },
    { value: "dateCreatedReverse", label: "Date Created (Oldest)" },
    { value: "dueDate", label: "Due Date (Earliest)" },
    { value: "dueDateReverse", label: "Due Date (Latest)" },
    { value: "alphabetical", label: "Alphabetical (A-Z)" },
    { value: "alphabeticalReverse", label: "Alphabetical (Z-A)" },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden p-4">
      <div className="mb-4 flex items-center justify-between">
        <motion.h1
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {getFilterTitle()}
        </motion.h1>

        <div className="flex items-center gap-2">
          {isSearchExpanded ? (
            <motion.div
              className="flex items-center"
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-9 w-full"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-8 w-8"
                onClick={() => {
                  onSearchChange("")
                  setIsSearchExpanded(false)
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            </motion.div>
          ) : (
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsSearchExpanded(true)}>
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={(value) => onSortChange(value as SortOption)}>
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onShowCompletedChange(!showCompleted)}>
                {showCompleted ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide Completed
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show Completed
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center rounded-md border border-border/50 bg-background/50 p-1">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => onViewChange("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
            <Button
              variant={view === "board" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => onViewChange("board")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Board view</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <TaskStats tasks={allTasks} />
      </div>

      <div className="mb-4">
        <AnimatePresence mode="wait">
          {!isInputExpanded && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg border border-border/50 bg-card/50 p-4",
                "text-left text-muted-foreground shadow-sm backdrop-blur-sm transition-all",
                "hover:border-border hover:bg-card hover:shadow-md hover:-translate-y-0.5",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              )}
              onClick={() => setIsInputExpanded(true)}
            >
              <Plus className="h-5 w-5 text-primary" />
              <span>Add a new task...</span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isInputExpanded && <TaskInput onAddTask={handleAddTask} onCancel={() => setIsInputExpanded(false)} />}
        </AnimatePresence>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-lg border border-border/50">
        {tasks.length === 0 ? (
          <EmptyState filter={filter} search={search} />
        ) : (
          <div className="h-full overflow-auto scrollbar-thin p-2">
            <AnimatePresence mode="wait">
              {view === "list" ? (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <TaskList
                    tasks={tasks}
                    onToggleComplete={onToggleComplete}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                    onReorderTasks={onReorderTasks}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="board-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <TaskBoard
                    tasks={tasks}
                    onToggleComplete={onToggleComplete}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

