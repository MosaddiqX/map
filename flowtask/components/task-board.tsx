"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable,DropResult } from "react-beautiful-dnd"
import type { Task } from "@/lib/types"
import { TaskCard } from "@/components/task-card"
import { cn } from "@/lib/utils"

interface TaskBoardProps {
  tasks: Task[]
  onToggleComplete: (id: string) => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: string) => void
}

export function TaskBoard({ tasks, onToggleComplete, onUpdateTask, onDeleteTask }: TaskBoardProps) {
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

  const handleDragEnd = (result:  DropResult ) => {
    if (!result.destination) return

    const { source, destination } = result

    // Moving between columns
    if (source.droppableId !== destination.droppableId) {
      const taskId = result.draggableId
      const newStatus = destination.droppableId === "completed" ? true : false

      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        onUpdateTask({
          ...task,
          completed: newStatus,
          completedAt: newStatus ? new Date().toISOString() : undefined,
        })
      }
    }
  }

  // Group tasks by status
  const todoTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-6 overflow-x-auto pb-4 pt-2">
        <div className="kanban-column">
          <div className="kanban-column-header">To Do ({todoTasks.length})</div>
          <Droppable droppableId="todo">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn("kanban-column-content", snapshot.isDraggingOver && "bg-secondary/50")}
              >
                {todoTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn("transition-all", snapshot.isDragging && "rotate-1 scale-105 shadow-lg")}
                      >
                        <TaskCard
                          task={task}
                          isEditing={task.id === editingTaskId}
                          onToggleComplete={onToggleComplete}
                          onEdit={handleEdit}
                          onUpdate={handleUpdate}
                          onCancelEdit={handleCancelEdit}
                          onDelete={onDeleteTask}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <div className="kanban-column">
          <div className="kanban-column-header">Completed ({completedTasks.length})</div>
          <Droppable droppableId="completed">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn("kanban-column-content", snapshot.isDraggingOver && "bg-secondary/50")}
              >
                {completedTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn("transition-all", snapshot.isDragging && "rotate-1 scale-105 shadow-lg")}
                      >
                        <TaskCard
                          task={task}
                          isEditing={task.id === editingTaskId}
                          onToggleComplete={onToggleComplete}
                          onEdit={handleEdit}
                          onUpdate={handleUpdate}
                          onCancelEdit={handleCancelEdit}
                          onDelete={onDeleteTask}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  )
}

