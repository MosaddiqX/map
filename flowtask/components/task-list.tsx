"use client"

import { useState } from "react"
import { AnimatePresence, Reorder } from "framer-motion"
import type { Task } from "@/lib/types"
import { TaskItem } from "@/components/task-item"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: string) => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onReorderTasks: (tasks: Task[]) => void
}

export function TaskList({ tasks, onToggleComplete, onUpdateTask, onDeleteTask, onReorderTasks }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id)
  }

  const handleUpdate = (updatedTask: Task) => {
    onUpdateTask(updatedTask)
    setEditingTaskId(null)
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
  }

  return (
    <Reorder.Group axis="y" values={tasks} onReorder={onReorderTasks} className="space-y-3">
      <AnimatePresence initial={false}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isEditing={task.id === editingTaskId}
            onToggleComplete={onToggleComplete}
            onEdit={handleEdit}
            onUpdate={handleUpdate}
            onCancelEdit={handleCancelEdit}
            onDelete={onDeleteTask}
          />
        ))}
      </AnimatePresence>
    </Reorder.Group>
  )
}

