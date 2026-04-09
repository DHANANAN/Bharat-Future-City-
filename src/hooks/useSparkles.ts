import { useEffect, useRef, useCallback } from 'react'

interface Sparkle {
  id: string
  x: number
  y: number
  size: number
  duration: number
}

export function useSparkles() {
  const sparklesRef = useRef<Sparkle[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)

  const addSparkle = useCallback((x: number, y: number) => {
    if (!containerRef.current) return

    const id = `sparkle-${idRef.current++}`
    const sparkle: Sparkle = {
      id,
      x,
      y,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 0.5 + 0.5,
    }

    const elem = document.createElement('div')
    elem.id = id
    elem.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${sparkle.size}px;
      height: ${sparkle.size}px;
      pointer-events: none;
      animation: sparkleFloat ${sparkle.duration}s ease-out forwards;
      background: radial-gradient(circle, rgba(255,215,0,1) 0%, rgba(255,215,0,0) 70%);
      border-radius: 50%;
      box-shadow: 0 0 ${sparkle.size * 2}px rgba(255,215,0,0.8);
      z-index: 999;
    `
    document.body.appendChild(elem)

    setTimeout(() => {
      elem.remove()
    }, sparkle.duration * 1000)

    sparklesRef.current.push(sparkle)
  }, [])

  return { addSparkle, containerRef }
}
