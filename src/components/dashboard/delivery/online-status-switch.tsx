"use client"

import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function OnlineStatusSwitch() {
  const [isOnline, setIsOnline] = useState(true)

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="online-status"
        checked={isOnline}
        onCheckedChange={setIsOnline}
      />
      <Label htmlFor="online-status" className={isOnline ? "text-green-500" : "text-muted-foreground"}>
        {isOnline ? "En ligne" : "Hors ligne"}
      </Label>
    </div>
  )
}

