import { error, type Actions } from '@sveltejs/kit'

import { Collections, type ProductTypesRecord, type ProductTypesResponse } from '$lib/pocketbase-types'
import { serializeNonPOJOs } from '$lib/utils'

const productTypes = [
    // "ACCESBEAUT",
    "Affiche",
]

export const load = async (event) => {
    const getProductTypes = async (userId: string | undefined) => {
        try {
            return serializeNonPOJOs(
                await event.locals.pb
                    .collection(Collections.ProductTypes)
                    .getFullList<ProductTypesResponse>(undefined, { userId })
            )
        } catch (err: any) {
            console.log('Error getting product types: ', err)
            throw error(err.status, err.message)
        }
    }

    const productTypes = await getProductTypes(event.locals?.user?.id)

    return {
        productTypes
    }
}

export const actions: Actions = {
    batch: async (event) => {
        for (const type of productTypes) {
            const data = {
                name: type,
                organization: "ejfst7j6x9ltcji"
            };
            try {
                const { locals } = event
                await locals.pb.collection(Collections.ProductTypes).create<ProductTypesRecord>(data, { userId: locals?.user?.id })
            }
            catch (err: any) {
                console.log('Error creating product-type: ', err)
                throw error(err.status, err.message);
            }
        }
    }
}