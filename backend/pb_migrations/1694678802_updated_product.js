/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uihhsx2hl3l7uii")

  collection.createRule = "@request.auth.id != \"\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uihhsx2hl3l7uii")

  collection.createRule = "@request.data.id != \"\""

  return dao.saveCollection(collection)
})
