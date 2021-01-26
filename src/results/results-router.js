const path = require('path')
const express = require('express')
const ResultsService = require('./results-service')
const request = require('request')
const axios = require('axios')
const config = require('../config')

const resultsRouter = express.Router()
const jsonParser = express.json()

/* const serializeResult = result => ({
    place_id: result.place_id,
    name: result.name,
    photos: result.photos,
    address: result.formatted_address,
    price: result.price_level,
    rating: result.rating
}) */

/* let options = {
  'method': 'GET',
  'url': config.API_URL,
  'headers': {
  }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  let results = JSON.parse(body);
  return results
}); */

resultsRouter

       axios.get(config.API_URL)
            .then(function (response) {
                results = response.data.results
                console.log(results)
                return results
            })
            .catch(function (error) {
                console.error(error)
            })



module.exports = resultsRouter