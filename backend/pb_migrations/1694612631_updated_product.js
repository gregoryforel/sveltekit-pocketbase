/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uihhsx2hl3l7uii")

  collection.listRule = "user_id = @request.auth.id"
  collection.viewRule = "user_id = @request.auth.id"
  collection.createRule = "user_id = @request.auth.id"
  collection.updateRule = "user_id = @request.auth.id"
  collection.deleteRule = "user_id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uihhsx2hl3l7uii")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})