'use client'

import { useState } from 'react'
import { playerImages } from '@/data/player-images'

interface PlayerPhotoProps {
  playerId: string
  playerName: string
  className?: string
  imgClassName?: string
  initialsClassName?: string
}

const UI_AVATAR = 'https://ui-avatars.com/api'

export default function PlayerPhoto({ playerId, playerName, className = '', imgClassName = '', initialsClassName = '' }: PlayerPhotoProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const wikiUrl = playerImages[playerId]

  const initials = playerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const src = (!imgFailed && wikiUrl) ? wikiUrl : `${UI_AVATAR}/?name=${encodeURIComponent(playerName)}&background=1a1a2e&color=d4af37&size=200&bold=true`

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={playerName}
        className={imgClassName}
        onError={() => setImgFailed(true)}
      />
      <div className={`absolute inset-0 flex items-center justify-center font-bold text-gold ${initialsClassName}`}>
        {initials}
      </div>
    </div>
  )
}
