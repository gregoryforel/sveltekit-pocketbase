import { z } from 'zod'

export const productTypeSchema = z.object({
    id: z.string().length(15),
    name: z.string().min(1).max(50),
    organization: z.string().length(15),
})

export const newProductTypeSchema = productTypeSchema.extend({
    id: productTypeSchema.shape.id.optional()
})