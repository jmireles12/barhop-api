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
    listid: bar.listid,
    address: bar.address,
    price: bar.price,
    rating: bar.rating
})

const serializeResult = result => ({
    id: result.place_id,
    name: result.name,
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
        const { name, listid, address, price, rating } = req.body
        const newBar = { name, listid, address, price, rating }

        for(const [key, value] of Object.entries(newBar))
            if(value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
                
            newBar.listid = listid

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
        const { name, listid, address, price, rating } = req.body
        const barToUpdate = { name, listid, address, price, rating }

        const numberOfValues = Object.values(barToUpdate).filter(Boolean).length
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'name', 'listId', 'address', 'price' or 'rating'`
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