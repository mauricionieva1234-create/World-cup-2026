'use client'

import { useState, useMemo } from 'react'
import { coachImages } from '@/data/coach-images'

interface CoachPhotoProps {
  coachName: string
  teamId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'w-12 h-12', md: 'w-20 h-20', lg: 'w-28 h-28' }
const textSizeMap = { sm: 'text-sm', md: 'text-2xl', lg: 'text-4xl' }

export default function CoachPhoto({ coachName, teamId, className = '', size = 'md' }: CoachPhotoProps) {
  const [fallback, setFallback] = useState(0)
  const wikiUrl = useMemo(() => coachImages[teamId], [teamId])
  const initials = coachName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const sources = [wikiUrl, `/coaches/${teamId}.jpg`].filter(Boolean) as string[]
  const src = sources[fallback]

  if (!src || fallback >= sources.length) {
    return (
      <div className={`${sizeMap[size]} rounded-full bg-dark-hover flex items-center justify-center ${textSizeMap[size]} font-bold text-gold ${className}`}>
        {initials}
      </div>
    )
  }

  return (
    <div className={`${sizeMap[size]} rounded-full overflow-hidden ${className}`}>
      <img
        src={src}
        alt={coachName}
        className="w-full h-full object-cover"
        onError={() => setFallback(f => f + 1)}
      />
    </div>
  )
}
