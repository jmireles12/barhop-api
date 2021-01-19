const BarsService = {
    getAllBars(knex) {
        return knex.select('*').from('barhop_bars')
    },
    insertBar(knex, newBar) {
        return knex
            .insert(newBar)
            .into('barhop_bars')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('barhop_bars').select('*').where('id', id).first()
    },
    deleteBar(knex, id) {
        return knex('barhop_bars')
            .where({ id })
            .delete()
    },
    updateBar(knex, id, newBarFields) {
        return knex('barhop_bars')
            .where({ id })
            .update(newBarFields)
    },
}

module.exports = BarsService