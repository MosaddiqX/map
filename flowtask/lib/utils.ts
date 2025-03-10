import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  return date.toLocaleDateString()
}

export function parseNaturalLanguageDate(text: string): { date?: Date; text: string } {
  // Simple natural language date parsing
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Match patterns like "tomorrow", "next week", "in 3 days", etc.
  let date: Date | undefined = undefined
  let cleanedText = text

  // Tomorrow
  if (/\btomorrow\b/i.test(text)) {
    date = tomorrow
    cleanedText = text.replace(/\btomorrow\b/i, "").trim()
  }

  // Today
  else if (/\btoday\b/i.test(text)) {
    date = today
    cleanedText = text.replace(/\btoday\b/i, "").trim()
  }

  // Next week
  else if (/\bnext week\b/i.test(text)) {
    date = new Date(today)
    date.setDate(date.getDate() + 7)
    cleanedText = text.replace(/\bnext week\b/i, "").trim()
  }

  // This weekend
  else if (/\bthis weekend\b/i.test(text)) {
    date = new Date(today)
    // Set to next Saturday
    date.setDate(date.getDate() + (6 - date.getDay()))
    cleanedText = text.replace(/\bthis weekend\b/i, "").trim()
  }

  // Next month
  else if (/\bnext month\b/i.test(text)) {
    date = new Date(today)
    date.setMonth(date.getMonth() + 1)
    cleanedText = text.replace(/\bnext month\b/i, "").trim()
  }

  // Days of week
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  for (let i = 0; i < daysOfWeek.length; i++) {
    const dayRegex = new RegExp(`\\b${daysOfWeek[i]}\\b`, "i")
    if (dayRegex.test(text)) {
      date = new Date(today)
      const currentDay = date.getDay()
      const targetDay = i
      const daysToAdd = (targetDay + 7 - currentDay) % 7
      date.setDate(date.getDate() + (daysToAdd === 0 ? 7 : daysToAdd))
      cleanedText = text.replace(dayRegex, "").trim()
      break
    }
  }

  // In X days/weeks/months
  const inTimeRegex = /\bin\s+(\d+)\s+(day|days|week|weeks|month|months)\b/i
  const inTimeMatch = text.match(inTimeRegex)
  if (inTimeMatch) {
    const amount = Number.parseInt(inTimeMatch[1])
    const unit = inTimeMatch[2].toLowerCase()

    date = new Date(today)
    if (unit === "day" || unit === "days") {
      date.setDate(date.getDate() + amount)
    } else if (unit === "week" || unit === "weeks") {
      date.setDate(date.getDate() + amount * 7)
    } else if (unit === "month" || unit === "months") {
      date.setMonth(date.getMonth() + amount)
    }

    cleanedText = text.replace(inTimeRegex, "").trim()
  }

  // Specific date formats like "Mar 15" or "3/15"
  const dateRegex = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})\b/i
  const dateMatch = text.match(dateRegex)
  if (dateMatch) {
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
    const monthIndex = months.findIndex((m) => m === dateMatch[1].toLowerCase())
    const day = Number.parseInt(dateMatch[2])

    if (monthIndex !== -1 && day >= 1 && day <= 31) {
      date = new Date(today.getFullYear(), monthIndex, day)
      // If the date is in the past, assume next year
      if (date < today) {
        date.setFullYear(date.getFullYear() + 1)
      }
      cleanedText = text.replace(dateRegex, "").trim()
    }
  }

  // MM/DD format
  const shortDateRegex = /\b(\d{1,2})\/(\d{1,2})\b/
  const shortDateMatch = text.match(shortDateRegex)
  if (shortDateMatch) {
    const month = Number.parseInt(shortDateMatch[1]) - 1 // 0-based month
    const day = Number.parseInt(shortDateMatch[2])

    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      date = new Date(today.getFullYear(), month, day)
      // If the date is in the past, assume next year
      if (date < today) {
        date.setFullYear(date.getFullYear() + 1)
      }
      cleanedText = text.replace(shortDateRegex, "").trim()
    }
  }

  return { date, text: cleanedText }
}

