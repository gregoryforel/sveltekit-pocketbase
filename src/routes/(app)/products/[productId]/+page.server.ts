import { error, type Actions } from '@sveltejs/kit'
import sharp from 'sharp'
import { superValidate } from 'sveltekit-superforms/server'

import { Collections, type ProductRecord, type ProductResponse } from '$lib/pocketbase-types'
import { serializeNonPOJOs } from '$lib/utils'

import { newProductSchema } from '../productSchema'
import type { PageServerLoad } from './$types'


export const load: PageServerLoad = async (event) => {
    const { locals, params } = event
    const productId = params.productId

    const getOneUserProduct = async (userId: string | undefined) => {
        try {
            return serializeNonPOJOs(
                await locals.pb
                    .collection(Collections.Product)
                    .getOne<ProductResponse>(productId, { userId })
            )
        } catch (err: any) {
            console.log('Error getting products: ', err)
            throw error(err.status, err.message)
        }
    }

    const product = await getOneUserProduct(locals?.user?.id)
    const form = await superValidate(product, newProductSchema)

    return {
        form,
        product,
    }
}

export const actions: Actions = {
    update: async ({ request, locals, params }) => {
        const productId = params.productId
        const formData = await request.formData()
        const photos = (formData.getAll('photos') as Blob[]).filter(
            (img) => img.size > 0
        )

        formData.delete('photos') //  superform sends photos as an array of empty strings, so we delete it and add it back later

        // Compress photos
        // ONLY THE NEWLY ADDED ONES!!
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

        try {
            await locals.pb
                .collection(Collections.Product)
                .update<ProductRecord>(productId!, formData, { userId: locals?.user?.id })
        } catch (err: any) {
            console.log('Error updating product: ', err)
            throw error(err.status, err.message)
        }

        return { form }
    },
}
