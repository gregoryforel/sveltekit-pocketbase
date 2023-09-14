import { error, type Actions, fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import sharp from 'sharp'

import { Collections, type ProductRecord } from '$lib/pocketbase-types'
import { newProductSchema } from '../productSchema'
import type { PageServerLoad } from './$types'
import { goto } from '$app/navigation'

export const load: PageServerLoad = async (event) => {
    const form = await superValidate(event, newProductSchema)

    return {
        form,
    }
}

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const formData = await request.formData()
        const photos = (formData.getAll('photos') as Blob[]).filter(
            (img) => img.size > 0
        )

        formData.delete('photos') //  superform sends photos as an array of empty strings, so we delete it and add it back later

        // Compress photos
        if (photos.length > 0) {
            for (let photo of photos) {
                const buffer = await photo.arrayBuffer()
                const compressedPhoto = await new Blob([
                    await sharp(buffer)
                        .webp({ quality: 80 })
                        .resize({ width: 1000, fit: 'cover', withoutEnlargement: true })
                        .toBuffer(),
                ])
                formData.append('photos', compressedPhoto)
            }
        }

        const form = await superValidate(formData, newProductSchema)

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await locals.pb
                .collection(Collections.Product)
                .create<ProductRecord>(formData, { userId: locals?.user?.id })

        } catch (err: any) {
            console.log('Error creating product: ', err)
            throw error(err.status, err.message)
        }

        return { form }
    },
}
