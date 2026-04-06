"use client"

import { useState, useEffect, useRef } from "react"

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY
      const direction = scrollY > lastScrollY.current ? "down" : "up"
      
      // Only update if we've scrolled more than 10px to avoid jitter
      if (Math.abs(scrollY - lastScrollY.current) > 10) {
        setScrollDirection(direction)
        lastScrollY.current = scrollY
      }
    }

    window.addEventListener("scroll", updateScrollDirection, { passive: true })
    return () => window.removeEventListener("scroll", updateScrollDirection)
  }, [])

  return scrollDirection
}

export function useStickyOnScroll(threshold = 100) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > threshold)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial position
    return () => window.removeEventListener("scroll", handleScroll)
  }, [threshold])

  return isSticky
}
