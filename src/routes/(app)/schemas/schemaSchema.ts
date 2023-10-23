import { z } from 'zod'

export const schemaSchema = z.object({
    id: z.string().length(15),
    name: z.string().min(2).max(50),
    description: z.string().min(2).max(50).optional(),
    user_id: z.string(),
    schema: z.any(),
})

export const newSchemaSchema = schemaSchema.extend({
    id: schemaSchema.shape.id.optional()
})

export const searchschemasSchema = z.object({
    search: z.string().min(2).max(50).optional(),
})