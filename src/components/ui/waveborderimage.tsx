"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

interface WaveBorderImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  animated?: boolean
  className?: string
}

export default function WaveBorderImage({
  src = "/placeholder.svg?height=400&width=600",
  alt = "Image with wave border",
  width = 600,
  height = 400,
  animated = true,
  className,
}: WaveBorderImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className={cn("relative z-10 overflow-hidden", className)}>
        {/* Top Wave */}
        <svg
          className={cn(
            "absolute left-0 top-0 z-20 w-full",
            animated && "animate-wave-slow"
          )}
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C150,20 350,80 500,50 C650,20 850,80 1000,50 L1000,0 L0,0 Z"
            className="fill-background"
          />
        </svg>

        {/* Bottom Wave */}
        <svg
          className={cn(
            "absolute bottom-0 left-0 z-20 w-full",
            animated && "animate-wave-slow-reverse"
          )}
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C150,80 350,20 500,50 C650,80 850,20 1000,50 L1000,100 L0,100 Z"
            className="fill-background"
          />
        </svg>

        {/* Left Wave */}
        <svg
          className={cn(
            "absolute left-0 top-0 z-20 h-full",
            animated && "animate-wave-vertical-slow"
          )}
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
        >
          <path
            d="M50,0 C20,150 80,350 50,500 C20,650 80,850 50,1000 L0,1000 L0,0 Z"
            className="fill-background"
          />
        </svg>

        {/* Right Wave */}
        <svg
          className={cn(
            "absolute right-0 top-0 z-20 h-full",
            animated && "animate-wave-vertical-slow-reverse"
          )}
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
        >
          <path
            d="M50,0 C80,150 20,350 50,500 C80,650 20,850 50,1000 L100,1000 L100,0 Z"
            className="fill-background"
          />
        </svg>

        {/* Main Image */}
        <div className="relative aspect-[3/2] w-full">
          <img
            src={src}
            alt={alt}
           
            className={cn(
              "object-cover transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            
          />
        </div>
      </div>
    </div>
  )
}

