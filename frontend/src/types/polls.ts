import { z } from 'zod'

export const CreatePollSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
  description: z.string().trim().max(1000).optional(),
  isPublic: z.boolean().default(true),
  closedAt: z.string().datetime().optional(),
})

export type CreatePollType = z.infer<typeof CreatePollSchema>


export type PollStatus = 'active' | 'closed' | 'draft'
export type ResultVisibility = 'always' | 'after_vote' | 'creator_only'

export interface Poll {
  id: string
  creatorId: string
  title: string
  description: string | null
  isPublic: boolean
  status: PollStatus
  resultVisibility: ResultVisibility
  closedAt: string | null
  createdAt: string
  updatedAt: string | null
}

export type Filter = 'all' | PollStatus
