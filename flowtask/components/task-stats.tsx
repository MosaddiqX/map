"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Circle, Clock, TrendingUp } from "lucide-react"
import type { Task } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const activeTasks = totalTasks - completedTasks
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Get tasks due today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dueTodayTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime()
  }).length

  // Get overdue tasks
  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() < today.getTime()
  }).length

  // Calculate completion rate over time
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    return date
  }).reverse()

  const completionData = last7Days.map((date) => {
    const dateStr = date.toISOString().split("T")[0]
    const dayStr = date.toLocaleDateString("en-US", { weekday: "short" })

    const completedOnDay = tasks.filter((task) => {
      if (!task.completedAt) return false
      const completedDate = new Date(task.completedAt)
      return completedDate.toISOString().split("T")[0] === dateStr
    }).length

    return {
      name: dayStr,
      completed: completedOnDay,
    }
  })

  // Priority distribution
  const priorityData = [
    { name: "High", value: tasks.filter((t) => t.priority === "high").length },
    { name: "Medium", value: tasks.filter((t) => t.priority === "medium").length },
    { name: "Low", value: tasks.filter((t) => t.priority === "low").length },
  ]

  const PRIORITY_COLORS = ["#ef4444", "#f59e0b", "#3b82f6"]

  return (
    <div className="rounded-lg border border-border/50 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
      <Tabs defaultValue="overview">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Progress & Analytics</h2>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="mb-2 h-2 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Card className="overflow-hidden">
              <CardContent className="flex flex-col items-center p-3">
                <Circle className="mb-1 h-5 w-5 text-blue-500" />
                <span className="text-xl font-medium">{activeTasks}</span>
                <span className="text-xs text-muted-foreground">Active</span>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="flex flex-col items-center p-3">
                <CheckCircle2 className="mb-1 h-5 w-5 text-green-500" />
                <span className="text-xl font-medium">{completedTasks}</span>
                <span className="text-xs text-muted-foreground">Completed</span>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="flex flex-col items-center p-3">
                <Clock className="mb-1 h-5 w-5 text-amber-500" />
                <span className="text-xl font-medium">{dueTodayTasks}</span>
                <span className="text-xs text-muted-foreground">Due Today</span>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="flex flex-col items-center p-3">
                <TrendingUp className="mb-1 h-5 w-5 text-rose-500" />
                <span className="text-xl font-medium">{overdueTasks}</span>
                <span className="text-xs text-muted-foreground">Overdue</span>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-4">
                <h3 className="mb-2 text-sm font-medium">Completion Trend</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={completionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorCompleted)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <h3 className="mb-2 text-sm font-medium">Priority Distribution</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {priorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

