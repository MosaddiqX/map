"use client"

import { useEffect } from "react"

interface HotkeyConfig {
  keys: string
  callback: () => void
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
}

export function useHotkeys(hotkeys: HotkeyConfig[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const hotkey of hotkeys) {
        const keys = hotkey.keys.toLowerCase().split("+")
        const mainKey = keys[keys.length - 1]

        const ctrlRequired = keys.includes("ctrl") || hotkey.ctrlKey
        const altRequired = keys.includes("alt") || hotkey.altKey
        const shiftRequired = keys.includes("shift") || hotkey.shiftKey
        const metaRequired = keys.includes("meta") || keys.includes("cmd") || hotkey.metaKey

        const ctrlMatches = ctrlRequired === event.ctrlKey
        const altMatches = altRequired === event.altKey
        const shiftMatches = shiftRequired === event.shiftKey
        const metaMatches = metaRequired === event.metaKey
        const keyMatches = event.key.toLowerCase() === mainKey.toLowerCase()

        if (ctrlMatches && altMatches && shiftMatches && metaMatches && keyMatches) {
          event.preventDefault()
          hotkey.callback()
          break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [hotkeys])
}

