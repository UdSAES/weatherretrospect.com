'use strict'
module.exports = {
  NODE_ENV: '"production"',
  DWD_DATA_API_ORIGIN: JSON.stringify(process.env.DWD_DATA_API_ORIGIN),
  DWD_DATA_API_JWT: JSON.stringify(process.env.DWD_DATA_API_JWT)
}
