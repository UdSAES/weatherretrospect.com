'use strict'
import superagent from 'superagent'
import _ from 'lodash'

export async function loadCosmoData (options) {
  console.log(options)
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

  let result = await superagent.get(origin + '/weather/cosmo/d2/' + referenceTimestamp + '/' + voi + '?lon=' + lon + '&lat=' + lat)
  if (result.statusCode !== 200) {
    // do something
    return
  }

  _.remove(result.body.data, (item) => {
    return item.timestamp < startTimestamp || item.timestamp >= endTimestamp
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

  let result = await superagent.get(origin + '/weather/weather_reports/poi/' + poiID + '/' + voi + '?startTimestamp=' + startTimestamp + '&endTimestamp=' + endTimestamp)
  console.log('result', result)

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

  let result = await superagent.get(origin + '/weather/local_forecasts/poi/' + referenceTimestamp + '/' + poiID + '/' + voi)
  console.log(result)
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
