/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "7wx90n6guiiav1d",
    "created": "2023-10-23 17:06:46.882Z",
    "updated": "2023-10-23 17:06:46.882Z",
    "name": "organization",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "nwnyeb7m",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("7wx90n6guiiav1d");

  return dao.deleteCollection(collection);
})
