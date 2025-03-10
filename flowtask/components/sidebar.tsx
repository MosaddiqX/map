"use client"

import type React from "react"

import { useState } from "react"
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Home,
  Tag,
  Timer,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react"

import type { Task, Filter } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  tasks: Task[]
  currentFilter: Filter
  onFilterChange: (filter: Filter) => void
  allTags: string[]
}

export function Sidebar({ tasks, currentFilter, onFilterChange, allTags }: SidebarProps) {
  const [isTagsOpen, setIsTagsOpen] = useState(true)

  // Count tasks for each filter
  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    today: tasks.filter((t) => {
      if (!t.dueDate) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dueDate = new Date(t.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate.getTime() === today.getTime()
    }).length,
    upcoming: tasks.filter((t) => {
      if (!t.dueDate) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dueDate = new Date(t.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate.getTime() > today.getTime()
    }).length,
    overdue: tasks.filter((t) => {
      if (!t.dueDate || t.completed) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dueDate = new Date(t.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate.getTime() < today.getTime()
    }).length,
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
  }

  // Count tasks for each tag
  const tagCounts: Record<string, number> = {}
  allTags.forEach((tag) => {
    tagCounts[tag] = tasks.filter((t) => t.tags?.includes(tag)).length
  })

  return (
    <div className="flex h-full flex-col border-r border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold gradient-text">FlowTask</h2>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Tasks</h3>
            <nav className="space-y-1">
              <SidebarItem
                icon={Home}
                label="All Tasks"
                count={counts.all}
                isActive={currentFilter === "all"}
                onClick={() => onFilterChange("all")}
              />
              <SidebarItem
                icon={Circle}
                label="Active"
                count={counts.active}
                isActive={currentFilter === "active"}
                onClick={() => onFilterChange("active")}
              />
              <SidebarItem
                icon={CheckCircle2}
                label="Completed"
                count={counts.completed}
                isActive={currentFilter === "completed"}
                onClick={() => onFilterChange("completed")}
              />
              <SidebarItem icon={Trash2} label="Trash" count={0} isActive={false} onClick={() => {}} disabled />
            </nav>
          </div>

          <div className="space-y-1">
            <h3 className="px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Time</h3>
            <nav className="space-y-1">
              <SidebarItem
                icon={Clock}
                label="Today"
                count={counts.today}
                isActive={currentFilter === "today"}
                onClick={() => onFilterChange("today")}
              />
              <SidebarItem
                icon={Calendar}
                label="Upcoming"
                count={counts.upcoming}
                isActive={currentFilter === "upcoming"}
                onClick={() => onFilterChange("upcoming")}
              />
              <SidebarItem
                icon={Timer}
                label="Overdue"
                count={counts.overdue}
                isActive={currentFilter === "overdue"}
                onClick={() => onFilterChange("overdue")}
                highlight={counts.overdue > 0}
              />
            </nav>
          </div>

          <div className="space-y-1">
            <h3 className="px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Priority</h3>
            <nav className="space-y-1">
              <SidebarItem
                icon={Flame}
                iconColor="text-[hsl(var(--priority-high))]"
                label="High Priority"
                count={counts.high}
                isActive={currentFilter === "high"}
                onClick={() => onFilterChange("high")}
              />
              <SidebarItem
                icon={Flame}
                iconColor="text-[hsl(var(--priority-medium))]"
                label="Medium Priority"
                count={counts.medium}
                isActive={currentFilter === "medium"}
                onClick={() => onFilterChange("medium")}
              />
              <SidebarItem
                icon={Flame}
                iconColor="text-[hsl(var(--priority-low))]"
                label="Low Priority"
                count={counts.low}
                isActive={currentFilter === "low"}
                onClick={() => onFilterChange("low")}
              />
            </nav>
          </div>

          <Collapsible open={isTagsOpen} onOpenChange={setIsTagsOpen}>
            <div className="space-y-1">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tags</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                    {isTagsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <span className="sr-only">Toggle tags</span>
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent>
                <nav className="space-y-1">
                  {allTags.length === 0 ? (
                    <div className="px-4 py-2 text-xs text-muted-foreground">No tags yet</div>
                  ) : (
                    allTags.map((tag) => (
                      <SidebarItem
                        key={tag}
                        icon={Tag}
                        label={tag}
                        count={tagCounts[tag]}
                        isActive={currentFilter === `tag:${tag}`}
                        onClick={() => onFilterChange(`tag:${tag}`)}
                      />
                    ))
                  )}
                  <Button variant="ghost" size="sm" className="w-full justify-start pl-9 text-xs text-muted-foreground">
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Add Tag
                  </Button>
                </nav>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </ScrollArea>

      <div className="border-t border-border/50 p-4">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-sm font-medium">FT</span>
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">FlowTask Pro</p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  icon: React.ElementType
  iconColor?: string
  label: string
  count: number
  isActive: boolean
  onClick: () => void
  disabled?: boolean
  highlight?: boolean
}

function SidebarItem({
  icon: Icon,
  iconColor,
  label,
  count,
  isActive,
  onClick,
  disabled = false,
  highlight = false,
}: SidebarItemProps) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "w-full justify-start",
        disabled && "opacity-50 cursor-not-allowed",
        highlight && !isActive && "text-[hsl(var(--priority-high))]",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className={cn("mr-2 h-4 w-4", iconColor)} />
      <span className="flex-1 truncate">{label}</span>
      {count > 0 && (
        <Badge variant="outline" className="ml-auto h-5 min-w-5 px-1 py-0 text-xs">
          {count}
        </Badge>
      )}
    </Button>
  )
}

