/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Colors = "colors",
	OrganizationMembers = "organization_members",
	Organizations = "organizations",
	ProductTypes = "product_types",
	Products = "products",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type ColorsRecord = {
	en?: string
	fr?: string
}

export enum OrganizationMembersRoleOptions {
	"admin" = "admin",
	"user" = "user",
	"sales" = "sales",
}
export type OrganizationMembersRecord = {
	user?: RecordIdString
	organization?: RecordIdString
	role?: OrganizationMembersRoleOptions
}

export type OrganizationsRecord = {
	name: string
	members?: RecordIdString[]
}

export type ProductTypesRecord = {
	name: string
	organization?: RecordIdString
}

export type ProductsRecord<Tattributes = unknown> = {
	name?: string
	description?: HTMLString
	photos?: string[]
	type?: RecordIdString
	reference?: string
	code?: string
	attributes?: null | Tattributes
	batch_size?: number
	isActive?: boolean
	organization: RecordIdString
	size?: string
	batch_unit_price?: number
	vat?: number
	commission?: number
	color?: RecordIdString
}

export type UsersRecord = {
	name?: string
	avatar?: string
}

// Response types include system fields and match responses from the PocketBase API
export type ColorsResponse<Texpand = unknown> = Required<ColorsRecord> & BaseSystemFields<Texpand>
export type OrganizationMembersResponse<Texpand = unknown> = Required<OrganizationMembersRecord> & BaseSystemFields<Texpand>
export type OrganizationsResponse<Texpand = unknown> = Required<OrganizationsRecord> & BaseSystemFields<Texpand>
export type ProductTypesResponse<Texpand = unknown> = Required<ProductTypesRecord> & BaseSystemFields<Texpand>
export type ProductsResponse<Tattributes = unknown, Texpand = unknown> = Required<ProductsRecord<Tattributes>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	colors: ColorsRecord
	organization_members: OrganizationMembersRecord
	organizations: OrganizationsRecord
	product_types: ProductTypesRecord
	products: ProductsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	colors: ColorsResponse
	organization_members: OrganizationMembersResponse
	organizations: OrganizationsResponse
	product_types: ProductTypesResponse
	products: ProductsResponse
	users: UsersResponse
}