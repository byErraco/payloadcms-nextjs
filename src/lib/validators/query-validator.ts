import { z } from 'zod'

export const QueryValidator = z.object({
    category: z.array(z.string()).optional(),
    // category: z.string().optional(),
    sort: z.enum(['asc', 'desc']).optional(),
    limit: z.number().optional(),
})

export type TQueryValidator = z.infer<typeof QueryValidator>