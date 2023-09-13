import { error, type Actions, fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import sharp from 'sharp'

import {
    Collections,
    type ColorsResponse,
    type ProductTypesResponse,
    type ProductsRecord,
} from '$lib/pocketbase-types'
import { serializeNonPOJOs } from '$lib/utils'
import { newProductSchema } from '../productSchema'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
    const getProductTypes = async (userId: string | undefined) => {
        try {
            return serializeNonPOJOs(
                await event.locals.pb
                    .collection(Collections.ProductTypes)
                    .getFullList<ProductTypesResponse>(undefined, {
                        userId,
                        sort: 'name',
                    })
            )
        } catch (err: any) {
            console.log('Error getting product types: ', err)
            throw error(err.status, err.message)
        }
    }

    const getColors = async (userId: string | undefined) => {
        try {
            return serializeNonPOJOs(
                await event.locals.pb
                    .collection(Collections.Colors)
                    .getFullList<ColorsResponse>(undefined, {
                        userId,
                        sort: 'fr',
                    })
            )
        } catch (err: any) {
            console.log('Error getting colors: ', err)
            throw error(err.status, err.message)
        }
    }

    const form = await superValidate(event, newProductSchema)
    const productTypes = await getProductTypes(event.locals?.user?.id)
    const colors = await getColors(event.locals?.user?.id)

    return {
        colors,
        form,
        productTypes,
    }
}

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const formData = await request.formData()
        const photos = (formData.getAll('photos') as Blob[]).filter(
            (img) => img.size > 0
        )

        formData.append('isActive', 'true')
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
                .collection(Collections.Products)
                .create<ProductsRecord>(formData, { userId: locals?.user?.id })
        } catch (err: any) {
            console.log('Error creating product: ', err)
            throw error(err.status, err.message)
        }

        return { form }
    },
}
