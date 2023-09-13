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
    name: z.string().min(2).max(50),
    user_id: z.string().length(15),
    photos: z.array(zodPhoto).optional().default([]),
})

export const newProductSchema = productSchema.extend({
    id: productSchema.shape.id.optional()
})

export const searchProductsSchema = z.object({
    search: z.string().min(2).max(50).optional(),
})