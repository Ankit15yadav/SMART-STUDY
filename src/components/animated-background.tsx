'use client'

import React, { useEffect, useRef } from 'react'

interface Node {
    x: number
    y: number
    vx: number
    vy: number
    color: string
}

const NetworkAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        const nodeCount = 50
        const nodes: Node[] = []
        const connectionDistance = 150

        // Define your color palette (Tailwind-like values)
        const colors = ['#E9D5FF', '#3B82F6', '#FDF2F8'] // purple-200, blue, pink-50

        // Create nodes with a random color from the palette
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: colors[Math.floor(Math.random() * colors.length)] || '#000000',
            })
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            nodes.forEach((node, i) => {
                // Update node position
                node.x += node.vx
                node.y += node.vy

                // Bounce off the edges
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1

                // Draw the node
                ctx.beginPath()
                ctx.fillStyle = node.color
                ctx.arc(node.x, node.y, 3, 0, Math.PI * 2)
                ctx.fill()

                // Draw connections with gradient strokes
                for (let j = i + 1; j < nodes.length; j++) {
                    const otherNode = nodes[j]
                    const dx = otherNode?.x! - node.x
                    const dy = otherNode?.y! - node.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < connectionDistance) {
                        const gradient = ctx.createLinearGradient(node.x, node.y, otherNode?.x!, otherNode?.y!)
                        gradient.addColorStop(0, node.color)
                        gradient.addColorStop(1, otherNode?.color!)
                        ctx.strokeStyle = gradient

                        ctx.beginPath()
                        ctx.moveTo(node.x, node.y)
                        ctx.lineTo(otherNode?.x!, otherNode?.y!)
                        ctx.stroke()
                    }
                }
            })
            requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}

export default NetworkAnimation
