import { createInstance } from '$lib/pocketbase'
import { handleLoginRedirect, isUrlPrivate } from '$lib/utils'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Before request is handled
    const pb = createInstance()

    // load the store data from the request cookie string
    pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
    try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        if (pb.authStore.isValid) {
            await pb.collection('users').authRefresh()
        }
    } catch (_) {
        // clear the auth store on failed refresh
        pb.authStore.clear()
    }

    event.locals.pb = pb
    event.locals.user = pb.authStore.model

    if (isUrlPrivate(event.url.pathname)) {
        if (!event.locals.user) {
            throw redirect(302, handleLoginRedirect(event))
        }
        // Other rules here:
        // ...
        // Example rule: redirect to home if user is not admin
        // if (event.url.pathname === '/admin' && !event.locals.user.isAdmin) {
        //     throw redirect(302, '/')
        // }
    }

    // 2. Render route & generate response await resolve(event)
    const response = await resolve(event)

    // 3. After response is generated
    // send back the default 'pb_auth' cookie to the client with the latest store state
    response.headers.set(
        'set-cookie',
        pb.authStore.exportToCookie({ httpOnly: false })
    )

    return response
}

