'use strict'

import superagent from 'superagent'
import _ from 'lodash'

const token = 'Bearer ' + process.env.DWD_DATA_API_JWT

export async function loadCosmoData (options) {
  let {
    origin,
    voi,
    scalingFactor,
    scalingOffset,
    lat,
    lon,
    startTimestamp,
    endTimestamp,
    referenceTimestamp,
    unit
  } = options

  scalingFactor = scalingFactor || 1
  scalingOffset = scalingOffset || 0
  origin = origin || process.env.DWD_DATA_API_ORIGIN

  const path = origin + '/weather/cosmo/d2/' + referenceTimestamp + '/' + voi + '?lon=' + lon + '&lat=' + lat
  let result = await superagent
    .get(path)
    .set('Authorization', token)
  if (result.statusCode !== 200) {
    // do something
    return
  }

  _.remove(result.body.data, (item) => {
    return item.timestamp < startTimestamp || item.timestamp > endTimestamp
  })

  result.body.data = _.map(result.body.data, (item) => {
    return {
      timestamp: item.timestamp,
      value: item.value * scalingFactor + scalingOffset
    }
  })

  if (unit) {
    result.body.unit = unit
  }

  return result.body
}

export async function loadReportData (options) {
  let {
    origin,
    voi,
    scalingFactor,
    scalingOffset,
    poiID,
    startTimestamp,
    endTimestamp,
    unit
  } = options

  scalingFactor = scalingFactor || 1
  scalingOffset = scalingOffset || 0
  origin = origin || process.env.DWD_DATA_API_ORIGIN

  const path = origin + '/weather/weather_reports/poi/' + poiID + '/' + voi + '?startTimestamp=' + startTimestamp + '&endTimestamp=' + endTimestamp
  let result = await superagent
    .get(path)
    .set('Authorization', token)

  if (result.statusCode !== 200) {
    // do something
    return
  }

  _.remove(result.body.data, (item) => {
    return item.timestamp < startTimestamp || item.timestamp >= endTimestamp
  })

  result.body.data = _.map(result.body.data, (item) => {
    if (_.isNil(item.value)) {
      return item
    }
    return {
      timestamp: item.timestamp,
      value: item.value * scalingFactor + scalingOffset
    }
  })

  if (unit) {
    result.body.unit = unit
  }

  return result.body
}

export async function loadMosmixData (options) {
  let {
    origin,
    voi,
    scalingFactor,
    scalingOffset,
    poiID,
    startTimestamp,
    endTimestamp,
    referenceTimestamp,
    unit
  } = options

  scalingFactor = scalingFactor || 1
  scalingOffset = scalingOffset || 0
  origin = origin || process.env.DWD_DATA_API_ORIGIN

  const path = origin + '/weather/local_forecasts/poi/' + referenceTimestamp + '/' + poiID + '/' + voi
  let result = await superagent
    .get(path)
    .set('Authorization', token)
  if (result.statusCode !== 200) {
    // do something
    return
  }

  _.remove(result.body.data, (item) => {
    return item.timestamp < startTimestamp || item.timestamp >= endTimestamp
  })

  result.body.data = _.map(result.body.data, (item) => {
    return {timestamp: item.timestamp, value: item.value * scalingFactor + scalingOffset}
  })

  if (unit) {
    result.body.unit = unit
  }
  return result.body
}
