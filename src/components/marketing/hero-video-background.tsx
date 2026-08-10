"use client"

import { useEffect, useState } from "react"

const CLIPS = [
  "/videos/tomatodo-hiking.mp4",
  "/videos/poncho-jump.mp4",
  "/videos/toalla-running.mp4",
  "/videos/medias-climbing.mp4",
]

const INTERVAL_MS = 6000

export function HeroVideoBackground() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % CLIPS.length)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {CLIPS.map((src, i) => (
        <video
          key={src}
          src={src}
          muted
          loop
          autoPlay
          playsInline
          preload={i === 0 ? "auto" : "metadata"}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
        />
      ))}
    </div>
  )
}
