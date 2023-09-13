import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
    const { locals, url } = event
    if (!locals?.user) {
        const fromUrl = url.pathname + url.search
        throw redirect(302, `/login?redirectTo=${fromUrl}`)
    }
}