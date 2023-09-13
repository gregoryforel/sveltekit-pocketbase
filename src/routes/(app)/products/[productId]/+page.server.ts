import { error, type Actions } from '@sveltejs/kit'
import sharp from 'sharp'
import { superValidate } from 'sveltekit-superforms/server'

import { Collections, type ColorsResponse, type ProductTypesResponse, type ProductsRecord, type ProductsResponse } from '$lib/pocketbase-types'
import { serializeNonPOJOs } from '$lib/utils'

import { newProductSchema } from '../productSchema'
import type { PageServerLoad } from './$types'

type Texpand = {
    type: ProductTypesResponse
}

export const load: PageServerLoad = async (event) => {
    const { locals, params } = event
    const productId = params.productId

    const getOneOrganizationProduct = async (userId: string | undefined) => {
        try {
            return serializeNonPOJOs(
                await locals.pb
                    .collection(Collections.Products)
                    .getOne<ProductsResponse<unknown, Texpand>>(productId, { userId, expand: 'type' })
            )
        } catch (err: any) {
            console.log('Error getting products: ', err)
            throw error(err.status, err.message)
        }
    }


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

    const product = await getOneOrganizationProduct(locals?.user?.id)
    const productTypes = await getProductTypes(event.locals?.user?.id)
    const colors = await getColors(event.locals?.user?.id)
    const form = await superValidate(product, newProductSchema)

    return {
        colors,
        form,
        product,
        productTypes,
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
                .collection(Collections.Products)
                .update<ProductsRecord>(productId!, formData, { userId: locals?.user?.id })
        } catch (err: any) {
            console.log('Error updating product: ', err)
            throw error(err.status, err.message)
        }

        return { form }
    },
}
