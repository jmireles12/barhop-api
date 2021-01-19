require('dotenv').config()
const knex = require('knex')
const ListsService = require('./lists/lists-service')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
})

ListsService.getAllLists(knexInstance)
    .then(lists => console.log(lists))
    .then(() =>
        ListsService.insertList(knexInstance, {
            name: 'New Name',
        })
    )
    .then(newList => {
        console.log(newList)
        return ListsService.updateList(knexInstance,
            newList.id,
            { name: 'Updated name' }
        ).then(() => ListsService.getById(knexInstance, newList.id))
    })
    .then(list => {
        console.log(list)
        return ListsService.deleteList(knexInstance, list.id)
    })