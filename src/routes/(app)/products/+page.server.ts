import { type Actions, error, fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import { serializeNonPOJOs } from '$lib/utils'
import {
    Collections,
    type ProductResponse,
} from '$lib/pocketbase-types'

import type { PageServerLoad } from './$types'
import { searchProductsSchema } from './productSchema'

export const load: PageServerLoad = async (event) => {
    const { locals, url } = event
    const { searchParams } = url
    const pageParam = (searchParams.get('page') ?? 1) as number
    const perPageParam = (searchParams.get('perPage') ?? 10) as number
    const search = searchParams.get('search') ?? ""

    const {
        items: products,
        page,
        perPage,
        totalItems,
        totalPages,
    } = await getPaginatedOrganizationProducts({
        pb: locals.pb,
        userId: locals?.user?.id,
        page: pageParam,
        perPage: perPageParam,
        search
    })

    const form = await superValidate(event, searchProductsSchema)

    return { form, products, page, perPage, totalItems, totalPages }
}

export const actions: Actions = {
    search: async ({ request, locals, url }) => {
        const formData = await request.formData()

        const form = await superValidate(formData, searchProductsSchema)

        if (!form.valid) {
            return fail(400, { form });
        }

        const { searchParams } = url
        const pageParam = (searchParams.get('page') ?? 1) as number
        const perPageParam = (searchParams.get('perPage') ?? 10) as number
        const searchParam = form.data.search ?? searchParams.get('perPage') ?? ""

        throw redirect(307, `/products?page=${pageParam}&perPage=${perPageParam}${searchParam ? `&search=${searchParam}` : ''}`);
    },
}

const getPaginatedOrganizationProducts = async ({
    userId,
    page,
    perPage,
    pb,
    search,
}: {
    userId: string | undefined
    page: number
    perPage: number
    pb: import('pocketbase').default
    search?: string
}) => {
    try {
        const getListParams: any = {
            userId,
            expand: 'type',
            sort: 'name',
        }

        if (search) {
            const searchStr = search.split(' ').map((s) => {
                return `(name ?~ "${s}" || description ?~ "${s}")`
            }).join(' && ')

            console.log('searchStr', searchStr)

            getListParams.filter = searchStr
        }

        return serializeNonPOJOs(
            await pb
                .collection(Collections.Product)
                .getList<ProductResponse>(page, perPage, getListParams)
        )
    } catch (err: any) {
        console.log('Error getting products: ', err)
        throw error(err.status, err.message)
    }
}
