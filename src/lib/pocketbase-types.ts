/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Organization = "organization",
	Product = "product",
	Schema = "schema",
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

export type OrganizationRecord = {
	name?: string
}

export type ProductRecord = {
	name?: string
	photos?: string[]
	user_id?: RecordIdString
}

export type SchemaRecord<Tschema = unknown> = {
	description?: HTMLString
	name?: string
	schema?: null | Tschema
	user_id?: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type OrganizationResponse<Texpand = unknown> = Required<OrganizationRecord> & BaseSystemFields<Texpand>
export type ProductResponse<Texpand = unknown> = Required<ProductRecord> & BaseSystemFields<Texpand>
export type SchemaResponse<Tschema = unknown, Texpand = unknown> = Required<SchemaRecord<Tschema>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	organization: OrganizationRecord
	product: ProductRecord
	schema: SchemaRecord
	users: UsersRecord
}

export type CollectionResponses = {
	organization: OrganizationResponse
	product: ProductResponse
	schema: SchemaResponse
	users: UsersResponse
}