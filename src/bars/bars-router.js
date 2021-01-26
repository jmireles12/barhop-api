const path = require('path')
const express = require('express');
const BarsService = require('./bars-service')
const resultsRouter = require('../results/results-router')
const axios = require('axios')
const config = require('../config')

const barsRouter = express.Router()
const jsonParser = express.json()

const serializeBar = bar => ({
    id: bar.id,
    name: bar.name,
    listId: bar.listid,
    content: bar.content,
})

const serializeResult = result => ({
    place_id: result.place_id,
    name: result.name,
    photos: result.photos,
    address: result.formatted_address,
    price: result.price_level,
    rating: result.rating
})

barsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BarsService.getAllBars(knexInstance)
            .then(bars => {
                res.json(bars.map(serializeBar))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, listId, content } = req.body
        const newBar = { name, listId, content }

        for(const [key, value] of Object.entries(newBar))
            if(value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
                
            newBar.listId = listId

            BarsService.insertBar(
                req.app.get('db'),
                newBar
            )
            .then(bar => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl + `/${bar.id}`))
                    .json(serializeBar(bar))
            })
            .catch(next)
    })

    
barsRouter
    .route('/search')
    .get((req, res, next) => {
        axios.get(config.API_URL)
            .then(function (response) {
                results = response.data.results
                console.log(results)
                res.json(results.map(serializeResult))
            })
            
            .catch(function (error) {
                console.error(error)
            })
    })

barsRouter
    .route('/:bar_id')
    .all((req, res, next) => {
        BarsService.getById(
            req.app.get('db'),
            req.params.bar_id
        )
            .then(bar => {
                if(!bar) {
                    return res.status(404).json({
                        error: { message: `Bar doesn't exist` }
                    })
                }
                res.bar = bar
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeBar(res.bar))
    })
    .delete((req, res, next) => {
        BarsService.deleteBar(
            req.app.get('db'),
            req.params.bar_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, listId, content } = req.body
        const barToUpdate = { name, listId, content }

        const numberOfValues = Object.values(barToUpdate).filter(Boolean).length
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'name', 'listId' or 'content'`
                }
            })
        }

        BarsService.updateBar(
            req.app.get('db'),
            req.params.bar_id,
            barToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })



module.exports = barsRouter