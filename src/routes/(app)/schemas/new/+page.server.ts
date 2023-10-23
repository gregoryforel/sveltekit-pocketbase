import { error, type Actions, fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import sharp from 'sharp'

import { Collections, type SchemaRecord } from '$lib/pocketbase-types'
import { newSchemaSchema } from '../schemaSchema'
import type { PageServerLoad } from './$types'
import { goto } from '$app/navigation'

export const load: PageServerLoad = async (event) => {
    const form = await superValidate(event, newSchemaSchema)

    return {
        form,
    }
}

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const formData = await request.formData()
        const form = await superValidate(formData, newSchemaSchema)

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await locals.pb
                .collection(Collections.Schema)
                .create<SchemaRecord>(formData, { userId: locals?.user?.id })

        } catch (err: any) {
            console.log('Error creating product: ', err)
            throw error(err.status, err.message)
        }

        return { form }
    },
}
