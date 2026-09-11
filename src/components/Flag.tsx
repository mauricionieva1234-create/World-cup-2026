'use client'

import { getFlagUrl } from '@/data/flagUrls'

interface FlagProps {
  teamId: string | null
  teamName?: string | null
  className?: string
}

export default function Flag({ teamId, teamName, className = 'w-6 h-4 inline-block' }: FlagProps) {
  if (!teamId) return null
  const url = getFlagUrl(teamId)
  if (!url) return null
  return (
    <img
      src={url}
      alt={teamName ?? teamId}
      className={className}
      loading="lazy"
    />
  )
}
