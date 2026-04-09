import { useEffect, useRef } from 'react'

interface Element {
  element: HTMLElement
  x: number
  y: number
  vx: number
  vy: number
}

export function useCursorGravity() {
  const elementsRef = useRef<Element[]>([])
  const cursorRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      elementsRef.current.forEach((elem) => {
        const dx = cursorRef.current.x - (elem.x + 50)
        const dy = cursorRef.current.y - (elem.y + 50)
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 0.5
          elem.vx += (dx / distance) * force * -0.3
          elem.vy += (dy / distance) * force * -0.3
        }

        elem.vx *= 0.95
        elem.vy *= 0.95
        elem.x += elem.vx
        elem.y += elem.vy

        if (elem.element) {
          elem.element.style.transform = `translate(${elem.x}px, ${elem.y}px)`
        }
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const register = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    elementsRef.current.push({
      element,
      x: rect.left,
      y: rect.top,
      vx: 0,
      vy: 0,
    })
  }

  return { register }
}
