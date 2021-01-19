const ListsService = {
    getAllLists(knex) {
        return knex.select('*').from('barhop_lists')
    },
    insertList(knex, newList) {
        return knex
            .insert(newList)
            .into('barhop_lists')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('barhop_lists').select('*').where('id', id).first()
    },
    deleteList(knex, id) {
        return knex('barhop_lists')
            .where({ id })
            .delete()
    },
    updateList(knex, id, newListFields) {
        return knex('barhop_lists')
            .where({ id })
            .update(newListFields)
    },
}

module.exports = ListsService