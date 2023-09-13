import type { RequestEvent } from '@sveltejs/kit'
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const handleLoginRedirect = (event: RequestEvent) => {
    const redirectTo = event.url.pathname + event.url.search
    return `/login?redirectTo=${redirectTo}`
}

export const isUrlPrivate = (url: string): boolean => {
    if (!url) return true

    return (
        !url.includes('login') &&
        !url.includes('register') &&
        !url.includes('logout')
    )
}

export const serializeNonPOJOs = <T>(obj: T) => {
    return structuredClone(obj)
}

export const getImageURL = (
    { collection, recordId, fileName, size }: { collection: string, recordId: string, fileName: string, size?: string }
) => {
    return `${PUBLIC_POCKETBASE_URL}/api/files/${collection}/${recordId}/${fileName}${size ? `?size=${size}` : ''}`;
};