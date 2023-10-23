import { error, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import { Collections, type SchemaRecord, type SchemaResponse } from '$lib/pocketbase-types'
import { serializeNonPOJOs } from '$lib/utils'

import { newSchemaSchema } from '../schemaSchema'
import type { PageServerLoad } from './$types'


export const load: PageServerLoad = async (event) => {
    const { locals, params } = event
    const schemaId = params.schemaId

    const getOneUserSchema = async (userId: string | undefined) => {
        try {
            return serializeNonPOJOs(
                await locals.pb
                    .collection(Collections.Schema)
                    .getOne<SchemaResponse>(schemaId, { userId })
            )
        } catch (err: any) {
            console.log('Error getting schemas: ', err)
            throw error(err.status, err.message)
        }
    }

    const schema = await getOneUserSchema(locals?.user?.id)
    const form = await superValidate(schema, newSchemaSchema)

    return {
        form,
        schema,
    }
}

export const actions: Actions = {
    update: async ({ request, locals, params }) => {
        const schemaId = params.schemaId
        const formData = await request.formData()
        const form = await superValidate(formData, newSchemaSchema)

        try {
            await locals.pb
                .collection(Collections.Schema)
                .update<SchemaRecord>(schemaId!, formData, { userId: locals?.user?.id })
        } catch (err: any) {
            console.log('Error updating schema: ', err)
            throw error(err.status, err.message)
        }

        return { form }
    },
}
