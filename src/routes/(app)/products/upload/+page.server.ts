import { error, type Actions } from '@sveltejs/kit'

import { Collections, type ProductsRecord, type ProductsResponse } from '$lib/pocketbase-types'
import { serializeNonPOJOs } from '$lib/utils'

import { productsToUpload } from './data'

export const load = async (event) => {
    const getProducts = async (userId: string | undefined) => {
        try {
            return serializeNonPOJOs(
                await event.locals.pb
                    .collection(Collections.Products)
                    .getFullList<ProductsResponse>(undefined, { userId })
            )
        } catch (err: any) {
            console.log('Error getting product types: ', err)
            throw error(err.status, err.message)
        }
    }

    const products = await getProducts(event.locals?.user?.id)

    return {
        products
    }
}

export const actions: Actions = {
    upload: async (event) => {
        for (const product of productsToUpload) {

            try {
                const { locals } = event
                await locals.pb.collection(Collections.Products).create<ProductsRecord>({ ...product, isActive: true }, { userId: locals?.user?.id })
            }
            catch (err: any) {
                console.log('Error creating products: ', err)
                throw error(err.status, err.message);
            }
        }
    }
}