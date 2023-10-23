import { type Actions, error, fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import { serializeNonPOJOs } from '$lib/utils'
import {
    Collections,
    type SchemaResponse,
} from '$lib/pocketbase-types'

import type { PageServerLoad } from './$types'
import { searchschemasSchema } from './schemaSchema'

export const load: PageServerLoad = async (event) => {
    const { locals, url } = event
    const { searchParams } = url
    const pageParam = (searchParams.get('page') ?? 1) as number
    const perPageParam = (searchParams.get('perPage') ?? 10) as number
    const search = searchParams.get('search') ?? ""

    const {
        items: schemas,
        page,
        perPage,
        totalItems,
        totalPages,
    } = await getPaginatedOrganizationSchemas({
        pb: locals.pb,
        userId: locals?.user?.id,
        page: pageParam,
        perPage: perPageParam,
        search
    })

    const form = await superValidate(event, searchschemasSchema)

    return { form, schemas, page, perPage, totalItems, totalPages }
}

export const actions: Actions = {
    search: async ({ request, locals, url }) => {
        const formData = await request.formData()

        const form = await superValidate(formData, searchschemasSchema)

        if (!form.valid) {
            return fail(400, { form });
        }

        const { searchParams } = url
        const pageParam = (searchParams.get('page') ?? 1) as number
        const perPageParam = (searchParams.get('perPage') ?? 10) as number
        const searchParam = form.data.search ?? searchParams.get('perPage') ?? ""

        throw redirect(307, `/schemas?page=${pageParam}&perPage=${perPageParam}${searchParam ? `&search=${searchParam}` : ''}`);
    },
}

const getPaginatedOrganizationSchemas = async ({
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
            sort: 'name',
        }

        if (search) {
            const searchStr = search.split(' ').map((s) => {
                return `(name ?~ "${s}")`
            }).join(' && ')

            getListParams.filter = searchStr
        }

        return serializeNonPOJOs(
            await pb
                .collection(Collections.Schema)
                .getList<SchemaResponse>(page, perPage, getListParams)
        )
    } catch (err: any) {
        console.log('Error getting schemas: ', err)
        throw error(err.status, err.message)
    }
}
