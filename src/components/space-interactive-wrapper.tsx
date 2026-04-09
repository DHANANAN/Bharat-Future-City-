import React, { useEffect, useRef } from 'react'
import { useSparkles } from '@/hooks/useSparkles'

export function SpaceInteractiveWrapper({ children }: { children: React.ReactNode }) {
  const { addSparkle } = useSparkles()
  const cursorRef = useRef({ x: 0, y: 0 })
  const gravityItemsRef = useRef<Map<HTMLElement, { x: number; y: number; vx: number; vy: number }>>(new Map())

  useEffect(() => {
    // Track cursor position
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
      
      // Update gravity for floating elements
      gravityItemsRef.current.forEach((state, elem) => {
        const rect = elem.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const dx = cursorRef.current.x - centerX
        const dy = cursorRef.current.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 200
        
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 0.08
          state.vx += (dx / distance) * force * -1
          state.vy += (dy / distance) * force * -1
        }
        
        state.vx *= 0.92
        state.vy *= 0.92
        state.x += state.vx
        state.y += state.vy
        
        // Damping
        if (Math.abs(state.vx) < 0.01) state.vx = 0
        if (Math.abs(state.vy) < 0.01) state.vy = 0
        
        elem.style.transform = `translate(${state.x}px, ${state.y}px)`
      })
    }

    // Sparkle effect on click
    const handleClick = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      
      // Create multiple sparkles in a burst pattern
      for (let i = 0; i < 12; i++) {
        setTimeout(() => {
          const angle = (i / 12) * Math.PI * 2
          const radius = 20
          addSparkle(
            x + Math.cos(angle) * radius,
            y + Math.sin(angle) * radius
          )
        }, i * 20)
      }
    }

    // Register gravity elements
    const registerGravityItem = (elem: HTMLElement) => {
      const rect = elem.getBoundingClientRect()
      gravityItemsRef.current.set(elem, {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      })
    }

    // Expose API for components
    window.__registerGravityItem = registerGravityItem
    window.__addSparkle = addSparkle

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      delete window.__registerGravityItem
      delete window.__addSparkle
    }
  }, [addSparkle])

  useEffect(() => {
    // Animate gravity items
    let rafId: number
    const animate = () => {
      gravityItemsRef.current.forEach((state) => {
        // Natural drift
        state.vy += 0.02
        state.y += state.vy
        state.x += state.vx
      })
      rafId = requestAnimationFrame(animate)
    }
    animate()
    
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div className="space-interactive-container relative w-full">
      {children}
    </div>
  )
}

// Augment window type
declare global {
  interface Window {
    __registerGravityItem?: (elem: HTMLElement) => void
    __addSparkle?: (x: number, y: number) => void
  }
}
