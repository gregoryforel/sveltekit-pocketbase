/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uihhsx2hl3l7uii")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gyonpxvj",
    "name": "user_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uihhsx2hl3l7uii")

  // remove
  collection.schema.removeField("gyonpxvj")

  return dao.saveCollection(collection)
})
