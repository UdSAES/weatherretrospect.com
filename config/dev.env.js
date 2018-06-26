'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DWD_DATA_API_ORIGIN: JSON.stringify(process.env.DWD_DATA_API_ORIGIN || 'https://weather.designetz.saarland')
})
