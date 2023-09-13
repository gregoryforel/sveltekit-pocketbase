import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
    default: async ({ locals, request, url }) => {
        const data = Object.fromEntries(await request.formData()) as {
            email: string
            password: string
        }

        try {
            await locals.pb
                .collection('users')
                .authWithPassword(data.email, data.password)
        } catch (e) {
            console.error(e)
            throw e
        }

        const redirectTo = url.searchParams.get('redirectTo') || '/'
        if (redirectTo) {
            throw redirect(302, `/${redirectTo.slice(1)}`)
        } else {
            throw redirect(302, '/')
        }
    },
}
