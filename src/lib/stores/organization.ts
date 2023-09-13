import type { OrganizationsResponse } from '$lib/pocketbase-types'
import type { Record } from 'pocketbase'
import { writable } from 'svelte/store'

export const currentOrganization = writable<Record | null | OrganizationsResponse>()