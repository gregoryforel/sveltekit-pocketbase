/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uihhsx2hl3l7uii")

  collection.listRule = "user_id = @request.auth.id"
  collection.viewRule = "user_id = @request.auth.id"
  collection.createRule = "@request.data.id != \"\""
  collection.updateRule = "user_id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uihhsx2hl3l7uii")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""
  collection.updateRule = ""

  return dao.saveCollection(collection)
})
