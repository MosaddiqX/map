"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface OnboardingProps {
  onClose: () => void
}

export function Onboarding({ onClose }: OnboardingProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "Welcome to FlowTask",
      description: "Your premium task management experience starts here. Let's take a quick tour of the key features.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      title: "Create Tasks Effortlessly",
      description: "Add tasks with natural language input, set priorities, due dates, and organize with tags.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      title: "Multiple Views",
      description: "Switch between list and board views to visualize your tasks in different ways.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      title: "Powerful Filters",
      description: "Filter tasks by status, priority, due date, and tags to focus on what matters most.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      title: "Keyboard Shortcuts",
      description: "Use ⌘K to open the command menu, ⌘B to toggle the sidebar, and more for power users.",
      image: "/placeholder.svg?height=300&width=500",
    },
  ]

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 shadow-lg"
      >
        <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h2 className="mb-2 text-2xl font-bold">{steps[step].title}</h2>
              <p className="text-muted-foreground">{steps[step].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg border border-border">
          <AnimatePresence mode="wait">
            <motion.img
              key={step}
              src={steps[step].image}
              alt={steps[step].title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-auto w-full"
            />
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prevStep} disabled={step === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                className={cn("h-2 w-2 rounded-full transition-all", index === step ? "bg-primary w-4" : "bg-muted")}
                onClick={() => setStep(index)}
              />
            ))}
          </div>

          <Button onClick={nextStep}>
            {step === steps.length - 1 ? (
              <>
                Get Started
                <Check className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

