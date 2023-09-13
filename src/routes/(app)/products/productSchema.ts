import { z } from 'zod'

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif", "image/jfif"];

const zodPhoto = z
    .instanceof(Blob)
    .optional()
    .superRefine((val, ctx) => {
        if (val) {
            if (val.size < 10000 || val.size > MAX_FILE_SIZE) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Avatar must be between 10KB & ${Math.round(5_000_000 / 1_000_000)}MB`
                });
            }

            if (!ACCEPTED_IMAGE_TYPES.includes(val.type)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Unsupported file type. Supported formats: jpeg, jpg, png, webp, avif, jfif'"
                });
            }
        }
    })

export const productSchema = z.object({
    id: z.string().length(15),
    attributes: z.string().optional(),
    batch_unit_price: z.number().min(0).nullable().default(null),
    batch_size: z.number().min(1).max(1000000).optional().default(1),
    code: z.string().min(1).max(50),
    color: z.string().optional(),
    commission: z.number().min(0).max(100).nullable().default(null),
    description: z.string().max(500).optional(),
    isActive: z.boolean().default(true),
    name: z.string().min(2).max(50),
    organization: z.string().length(15),
    reference: z.string().min(1).max(50),
    size: z.string().optional(),
    type: z.string().length(15),
    vat: z.number().min(0).max(100).default(20),
    photos: z.array(zodPhoto).optional().default([]),
})

export const newProductSchema = productSchema.extend({
    id: productSchema.shape.id.optional()
})

export const searchProductsSchema = z.object({
    search: z.string().min(2).max(50).optional(),
})