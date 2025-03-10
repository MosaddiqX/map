"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { CalendarIcon, Tag, X, Plus, Sparkles } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { Task } from "@/lib/types"
import { cn, parseNaturalLanguageDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TaskInputProps {
  onAddTask: (task: Task) => void
  onCancel: () => void
  initialTask?: Task
}

export function TaskInput({ onAddTask, onCancel, initialTask }: TaskInputProps) {
  const [title, setTitle] = useState(initialTask?.title || "")
  const [description, setDescription] = useState(initialTask?.description || "")
  const [priority, setPriority] = useState(initialTask?.priority || "medium")
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialTask?.dueDate ? new Date(initialTask.dueDate) : undefined,
  )
  const [tags, setTags] = useState<string[]>(initialTask?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [activeTab, setActiveTab] = useState<string>("basic")
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("")
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Focus the title input on mount
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const task: Task = {
      id: initialTask?.id || uuidv4(),
      title,
      description,
      completed: initialTask?.completed || false,
      createdAt: initialTask?.createdAt || new Date().toISOString(),
      priority,
      tags,
      dueDate: dueDate?.toISOString(),
      completedAt: initialTask?.completedAt,
    }

    onAddTask(task)
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate(undefined)
    setTags([])
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleNaturalLanguageSubmit = () => {
    if (!naturalLanguageInput.trim()) return

    // Extract due date from natural language
    const { date, text } = parseNaturalLanguageDate(naturalLanguageInput)

    // Extract priority from text (e.g., "high priority", "p1", "!")
    let detectedPriority = priority
    if (text.match(/high priority|p1|!/i)) {
      detectedPriority = "high"
    } else if (text.match(/medium priority|p2/i)) {
      detectedPriority = "medium"
    } else if (text.match(/low priority|p3/i)) {
      detectedPriority = "low"
    }

    // Extract tags from text (e.g., "#work", "#personal")
    const tagMatches = text.match(/#(\w+)/g)
    const detectedTags = tagMatches ? tagMatches.map((tag) => tag.substring(1)).filter((tag) => tag.length > 0) : []

    // Update state
    setTitle(text.replace(/#(\w+)/g, "").trim())
    if (date) setDueDate(date)
    setPriority(detectedPriority)
    if (detectedTags.length > 0) setTags([...tags, ...detectedTags])

    // Switch to basic tab to show the parsed result
    setActiveTab("basic")
    setNaturalLanguageInput("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border border-border bg-card p-4 shadow-md"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="smart">Smart Input</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              ref={titleInputRef}
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-none bg-transparent text-lg font-medium placeholder:text-muted-foreground/70 focus-visible:ring-0"
            />

            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] border-none bg-transparent placeholder:text-muted-foreground/70 focus-visible:ring-0 resize-none"
            />

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {tag} tag</span>
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="h-8 w-[130px] border-none bg-secondary">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-8 border-none bg-secondary justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? dueDate.toLocaleDateString() : <span>Due date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-auto items-center rounded-md border-none bg-secondary px-2">
                  <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    className="h-8 border-none bg-transparent p-0 focus-visible:ring-0"
                  />
                  {tagInput && (
                    <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add tag</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!title.trim()}>
                {initialTask ? "Update" : "Add"} Task
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="smart">
          <div className="space-y-4">
            <div className="rounded-md bg-secondary/50 p-3">
              <div className="mb-2 flex items-center text-sm text-muted-foreground">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Type naturally with dates, priorities, and tags</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Examples:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Call John tomorrow at 3pm #work</li>
                  <li>Buy groceries this weekend high priority</li>
                  <li>Finish report by Friday #work #urgent</li>
                </ul>
              </div>
            </div>

            <Textarea
              placeholder="Type your task naturally..."
              value={naturalLanguageInput}
              onChange={(e) => setNaturalLanguageInput(e.target.value)}
              className="min-h-[120px] resize-none"
              autoFocus
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleNaturalLanguageSubmit}
                disabled={!naturalLanguageInput.trim()}
              >
                Parse & Add
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

