"use client"

import { useEffect, useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"

import { Dashboard } from "@/components/dashboard"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CommandMenu } from "@/components/command-menu"
import { Onboarding } from "@/components/onboarding"
import type { Task, Filter, View, SortOption } from "@/lib/types"
import { useHotkeys } from "@/hooks/use-hotkeys"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { cn } from "@/lib/utils"

export default function Home() {
  // App state
  const [tasks, setTasks] = useLocalStorage<Task[]>("flowTasks", [])
  const [filter, setFilter] = useState<Filter>("all")
  const [view, setView] = useState<View>("list")
  const [sort, setSort] = useState<SortOption>("default")
  const [search, setSearch] = useState("")
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showCompleted, setShowCompleted] = useState(true)
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const { theme, setTheme } = useTheme()

  // Check if this is the first visit
  useEffect(() => {
    const visited = localStorage.getItem("flowTaskVisited")
    if (!visited) {
      setIsFirstVisit(true)
      localStorage.setItem("flowTaskVisited", "true")
    }
  }, [])

  // Register keyboard shortcuts
  useHotkeys([
    { keys: "ctrl+k", callback: () => setIsCommandOpen(true) },
    { keys: "ctrl+b", callback: () => setIsSidebarOpen((prev) => !prev) },
    { keys: "ctrl+j", callback: () => setView((prev) => (prev === "list" ? "board" : "list")) },
    { keys: "ctrl+/", callback: () => setIsCommandOpen(true) },
  ])

  // Task management functions
  const addTask = useCallback(
    (task: Task) => {
      setTasks((prevTasks) => [...prevTasks, task])
    },
    [setTasks],
  )

  const toggleTaskCompletion = useCallback(
    (id: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date().toISOString() : undefined,
              }
            : task,
        ),
      )
    },
    [setTasks],
  )

  const updateTask = useCallback(
    (updatedTask: Task) => {
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    },
    [setTasks],
  )

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
    },
    [setTasks],
  )

  const reorderTasks = useCallback(
    (reorderedTasks: Task[]) => {
      setTasks(reorderedTasks)
    },
    [setTasks],
  )

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Search filter
      if (
        search &&
        !task.title.toLowerCase().includes(search.toLowerCase()) &&
        !task.description?.toLowerCase().includes(search.toLowerCase()) &&
        !task.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
      ) {
        return false
      }

      // Show/hide completed
      if (!showCompleted && task.completed) {
        return false
      }

      // Category filter
      if (filter === "all") return true
      if (filter === "active") return !task.completed
      if (filter === "completed") return task.completed
      if (filter === "today") {
        if (!task.dueDate) return false
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const dueDate = new Date(task.dueDate)
        dueDate.setHours(0, 0, 0, 0)
        return dueDate.getTime() === today.getTime()
      }
      if (filter === "upcoming") {
        if (!task.dueDate) return false
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const dueDate = new Date(task.dueDate)
        dueDate.setHours(0, 0, 0, 0)
        return dueDate.getTime() > today.getTime()
      }
      if (filter === "overdue") {
        if (!task.dueDate) return false
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const dueDate = new Date(task.dueDate)
        dueDate.setHours(0, 0, 0, 0)
        return dueDate.getTime() < today.getTime() && !task.completed
      }
      if (filter === "high") return task.priority === "high"
      if (filter === "medium") return task.priority === "medium"
      if (filter === "low") return task.priority === "low"
      if (filter.startsWith("tag:")) {
        const tagFilter = filter.replace("tag:", "")
        return task.tags?.includes(tagFilter)
      }
      return true
    })
    .sort((a, b) => {
      // Sort options
      if (sort === "default") {
        // Default sort: completed at bottom, then by priority
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        if (a.priority !== b.priority) {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return (
            priorityOrder[a.priority as keyof typeof priorityOrder] -
            priorityOrder[b.priority as keyof typeof priorityOrder]
          )
        }
        return 0
      }
      if (sort === "dateCreated") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sort === "dateCreatedReverse") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sort === "dueDate") {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      if (sort === "dueDateReverse") {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      }
      if (sort === "alphabetical") {
        return a.title.localeCompare(b.title)
      }
      if (sort === "alphabeticalReverse") {
        return b.title.localeCompare(a.title)
      }
      return 0
    })

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags || [])))

  return (
    <div
      className={cn(
        "flex h-screen flex-col overflow-hidden bg-gradient-to-br from-background to-background/80",
        "transition-all duration-300 ease-in-out",
      )}
    >
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        toggleTheme={toggleTheme}
        openCommandMenu={() => setIsCommandOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="h-full"
            >
              <Sidebar tasks={tasks} currentFilter={filter} onFilterChange={setFilter} allTags={allTags} />
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-hidden">
          <Dashboard
            tasks={filteredTasks}
            allTasks={tasks}
            view={view}
            onViewChange={setView}
            filter={filter}
            sort={sort}
            onSortChange={setSort}
            search={search}
            onSearchChange={setSearch}
            showCompleted={showCompleted}
            onShowCompletedChange={setShowCompleted}
            onAddTask={addTask}
            onToggleComplete={toggleTaskCompletion}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onReorderTasks={reorderTasks}
          />
        </main>
      </div>

      <CommandMenu
        isOpen={isCommandOpen}
        setIsOpen={setIsCommandOpen}
        tasks={tasks}
        onAddTask={addTask}
        onToggleComplete={toggleTaskCompletion}
        onFilterChange={setFilter}
        onViewChange={setView}
        onSortChange={setSort}
        onToggleTheme={toggleTheme}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <AnimatePresence>{isFirstVisit && <Onboarding onClose={() => setIsFirstVisit(false)} />}</AnimatePresence>
    </div>
  )
}

