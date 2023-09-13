import { pb } from '$lib/pocketbase'
import { Collections, type OrganizationsResponse } from '$lib/pocketbase-types'
import { currentOrganization } from '$lib/stores/organization'
import { currentUser } from '$lib/stores/user'
import { serializeNonPOJOs } from '$lib/utils'

pb.authStore.loadFromCookie(document.cookie)
pb.authStore.onChange(() => {

    const getOrg = async (userId: string) => {
        const organizations = serializeNonPOJOs(
            await pb
                .collection(Collections.Organizations)
                .getFullList<OrganizationsResponse>(undefined, { userId })
        )

        if (organizations?.length > 0) {
            currentOrganization.set(organizations[0])
        }
    }

    getOrg(pb?.authStore?.model?.id || "")


    currentUser.set(pb.authStore.model)
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false })
}, true)

