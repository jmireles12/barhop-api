const path = require('path')
const express = require('express');
const ListsService = require('./lists-service');

const listsRouter = express.Router()
const jsonParser = express.json()

const serializeList = list => ({
    id: list.id,
    name: list.name,
})

listsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ListsService.getAllLists(knexInstance)
            .then(lists => {
                res.json(lists.map(serializeList))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body
        const newList = { name }

        for(const [key, value] of Object.entries(newList))
            if(value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

            ListsService.insertList(
                req.app.get('db'),
                newList
            )
                .then(list => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl + `/${list.id}`))
                        .json(serializeList(list))
                })
                .catch(next)
    })

listsRouter
    .route('/:list_id')
    .all((req, res, next) => {
        ListsService.getById(
            req.app.get('db'),
            req.params.list_id
        )
            .then(list => {
                if(!list) {
                    return res.status(404).json({
                        error: { message: `List doesn't exist` }
                    })
                }
                res.list = list
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeList(res.list))
    })
    .delete((req, res, next) => {
        ListsService.deleteList(
            req.app.get('db'),
            req.params.list_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name } = req.body
        const listToUpdate = { name }

        const numberOfValues = Object.values(listToUpdate).filter(Boolean).length
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain a 'name'`
                }
            })
        }

        ListsService.updateList(
            req.app.get('db'),
            req.params.list_id,
            listToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = listsRouter