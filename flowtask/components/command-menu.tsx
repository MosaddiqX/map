"use client"

import { useEffect, useState } from "react"
import {
  CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Home,
  LayoutGrid,
  List,
  Moon,
  Plus,
  Search,
  SlidersHorizontal,
  Sun,
  Tag,
} from "lucide-react"
import { useTheme } from "next-themes"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import type { Task, Filter, View, SortOption } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

interface CommandMenuProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  tasks: Task[]
  onAddTask: (task: Task) => void
  onToggleComplete: (id: string) => void
  onFilterChange: (filter: Filter) => void
  onViewChange: (view: View) => void
  onSortChange: (sort: SortOption) => void
  onToggleTheme: () => void
  onToggleSidebar: () => void
}

export function CommandMenu({
  isOpen,
  setIsOpen,
  tasks,
  onAddTask,
  onToggleComplete,
  onFilterChange,
  onViewChange,
  onSortChange,
  onToggleTheme,
  onToggleSidebar,
}: CommandMenuProps) {
  const [inputValue, setInputValue] = useState("")
  const { theme } = useTheme()

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags || [])))

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [isOpen, setIsOpen])

  const handleAddQuickTask = () => {
    if (!inputValue.trim()) return

    const newTask: Task = {
      id: uuidv4(),
      title: inputValue,
      description: "",
      completed: false,
      createdAt: new Date().toISOString(),
      priority: "medium",
      tags: [],
    }

    onAddTask(newTask)
    setInputValue("")
    setIsOpen(false)
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput placeholder="Type a command or search..." value={inputValue} onValueChange={setInputValue} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {inputValue && (
          <CommandGroup heading="Actions">
            <CommandItem onSelect={handleAddQuickTask}>
              <Plus className="mr-2 h-4 w-4" />
              <span>
                Add &quot;<strong>{inputValue}</strong>&quot; as task
              </span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                onFilterChange("all")
                setInputValue("")
                setIsOpen(false)
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>
                Search for &quot;<strong>{inputValue}</strong>&quot;
              </span>
            </CommandItem>
          </CommandGroup>
        )}

        <CommandGroup heading="Tasks">
          {tasks.slice(0, 5).map((task) => (
            <CommandItem
              key={task.id}
              onSelect={() => {
                onToggleComplete(task.id)
                setIsOpen(false)
              }}
            >
              {task.completed ? (
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <Circle className="mr-2 h-4 w-4" />
              )}
              <span className={task.completed ? "line-through opacity-70" : ""}>{task.title}</span>
            </CommandItem>
          ))}
          <CommandItem
            onSelect={() => {
              setIsOpen(false)
              // Open add task form
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Create new task</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Filters">
          <CommandItem
            onSelect={() => {
              onFilterChange("all")
              setIsOpen(false)
            }}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>All Tasks</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onFilterChange("active")
              setIsOpen(false)
            }}
          >
            <Circle className="mr-2 h-4 w-4" />
            <span>Active Tasks</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onFilterChange("completed")
              setIsOpen(false)
            }}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <span>Completed Tasks</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onFilterChange("today")
              setIsOpen(false)
            }}
          >
            <Clock className="mr-2 h-4 w-4" />
            <span>Today&apos;s Tasks</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onFilterChange("high")
              setIsOpen(false)
            }}
          >
            <Flame className="mr-2 h-4 w-4 text-[hsl(var(--priority-high))]" />
            <span>High Priority</span>
          </CommandItem>
        </CommandGroup>

        {allTags.length > 0 && (
          <CommandGroup heading="Tags">
            {allTags.slice(0, 5).map((tag) => (
              <CommandItem
                key={tag}
                onSelect={() => {
                  onFilterChange(`tag:${tag}`)
                  setIsOpen(false)
                }}
              >
                <Tag className="mr-2 h-4 w-4" />
                <span>{tag}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Views">
          <CommandItem
            onSelect={() => {
              onViewChange("list")
              setIsOpen(false)
            }}
          >
            <List className="mr-2 h-4 w-4" />
            <span>List View</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onViewChange("board")
              setIsOpen(false)
            }}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>Board View</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Sort">
          <CommandItem
            onSelect={() => {
              onSortChange("default")
              setIsOpen(false)
            }}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <span>Default</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onSortChange("dateCreated")
              setIsOpen(false)
            }}
          >
            <Clock className="mr-2 h-4 w-4" />
            <span>Date Created (Newest)</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onSortChange("dueDate")
              setIsOpen(false)
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Due Date (Earliest)</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem
            onSelect={() => {
              onToggleTheme()
              setIsOpen(false)
            }}
          >
            {theme === "dark" ? (
              <>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark Mode</span>
              </>
            )}
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onToggleSidebar()
              setIsOpen(false)
            }}
          >
            <span className="mr-2 flex h-4 w-4 items-center justify-center text-xs">⌘</span>
            <span>Toggle Sidebar</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
