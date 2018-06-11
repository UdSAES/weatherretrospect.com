<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-layout>
          <v-flex xs1>
            <img src="./assets/logo.png">
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs4>
            <v-card class="elevation-6 mr-1 ml-1">
              <station-map
                :stationList="stationList"
                :selectedPoiId="selectedPoiId"
                v-on:marker-clicked="changePoi"
                :cosmoLocation="cosmoLocation">
              </station-map>
            </v-card>
          </v-flex>
          <v-flex xs8>
            <v-layout>
              <v-flex xs12>
                <v-card class="elevation-6 mr-1 ml-1 mb-1">
                  <weather-station-data
                    :staticLocationData="staticLocationData"
                    :currentReportData="currentReportData"
                  >
                  </weather-station-data>
                </v-card>
              </v-flex xs12>
            </v-layout>
            <v-layout>
              <v-flex xs12>
                <v-card class="elevation-6 mr-1 ml-1 mt-1"  height="429">
                  <current-forecast-data
                    :timeseries="currentData"
                  >
                  </current-forecast-data>
                </v-card>
              </v-flex xs12>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12 class="elevation-6 mr-1 ml-1 mt-1">
            <v-card>
              <weather-retrospect>
              </weather-retrospect>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
import StationMap from '@/Components/StationMap'
import WeatherStationData from '@/Components/WeatherStationData'
import CurrentForecastData from '@/Components/CurrentForecastData'
import WeatherRetrospect from '@/Components/WeatherRetrospect'

function parseCsv (text) {
  let lines = text.split('\n')

  const stationCollection = []
  for (let i = 0; i < lines.length - 1; i++) {
    const cols = lines[i].split(';')
    stationCollection.push({
      id: cols[0],
      lat: parseFloat(cols[1]),
      lon: parseFloat(cols[2]),
      elev: parseFloat(cols[3])
    })
  }

  return stationCollection
}

export default {
  name: 'App',
  components: {
    StationMap,
    WeatherStationData,
    CurrentForecastData,
    WeatherRetrospect
  },
  created: function () {
    var xhttp = new XMLHttpRequest()
    const that = this
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        // Typical action to be performed when the document is ready:
        const c = parseCsv(xhttp.responseText)
        setTimeout(function () {
          that.stationList = c
          console.log(that.stationList)
        }, 1000)
        
      }
    }
    xhttp.open('GET', '/static/station_catalog.csv', true)
    xhttp.send()
  },
  data: function () {
    return {
      stationList: [],
      selectedPoiId: '10708',
      selectedPoi: null,
      staticLocationData: {
        id: '10708',
        addressString: 'super',
        coordinates: {
          lat: 50,
          lon: 7,
          elev: 0
        }
      },
      currentReportData: {
        timestamp: 0,
        t_2m: 0,
        pmsl: 0,
        relhum_2m: 0
      },
      currentData: [{label: '1', unit: 'K', data: [0,0]}],
      cosmoLocation: {
        lat: 7.5,
        lon: 50
      },
    }
  },
  methods: {
    changePoi (poi) {
      const that = this
      this.selectedPoiId = poi.id

      this.selectedPoi = _.find(this.stationList, function (item) {
        return item.id === that.selectedPoiId
      })
      
      
      this.staticLocationData.id = this.selectedPoiId
      this.staticLocationData.coordinates.lat = this.selectedPoi.lat
      this.staticLocationData.coordinates.lon = this.selectedPoi.lon
      this.staticLocationData.coordinates.elev = this.selectedPoi.elev
    },

    async loadReportData (options) {
      let {
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

      let result = await this.$superagent.get('http://leela.msaas.me:12345/weather/weather_reports/poi/' + poiID + '/' + voi)
      if (result.statusCode !== 200) {
        // do something
        return
      }

      _.remove(result.body.data, (item) => {
        return item.timestamp < startTimestamp || item.timestamp >= endTimestamp
      })

      result.body.data = _.map(result.body.data, (item) => {
        if (this.$_.isNil(item.value)) {
          return item
        }
        return {timestamp: item.timestamp, value: item.value * scalingFactor + scalingOffset}
      })

      if (unit) {
        result.body.unit = unit
      }
      
      return result
    },

    async loadCosmoData (options) {
      let {
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

      let result = await this.$superagent.get('http://leela.msaas.me:12345/weather/cosmo/d2/' + referenceTimestamp + '/' + voi + '?lon=' + lon + '&lat=' + lat)
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

      return result
    },

    async loadMosmixData (options) {
      let {
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
      let result = await this.$superagent.get('http://leela.msaas.me:12345/weather/local_forecasts/poi/' + referenceTimestamp + '/' + poiID + '/' + voi)
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
      return result
    },

    async loadCurrentData () {
      const that = this
      const now = this.$moment.utc()
      const oldesTimestamp = this.$moment.utc(now).subtract(6, 'hours').valueOf()
      const newestTimestamp = this.$moment.utc(oldesTimestamp).add(28, 'hours').valueOf()
      
      let t_2m_REPORT
      try {
        t_2m_REPORT = await this.loadReportData({
          voi: 't_2m',
          scalingOffset: -273.15,
          poiID: this.selectedPoiId,
          startTimestamp: oldesTimestamp,
          endTimestamp: newestTimestamp + 1,
          unit: '°C'
        })
      } catch (error) {
        console.log(error)
      }

      let result1 = t_2m_REPORT

      let pmsl_REPORT
      try {
        pmsl_REPORT = await this.loadReportData({
          voi: 'pmsl',
          scalingFactor: 0.01,
          poiID: this.selectedPoiId,
          startTimestamp: oldesTimestamp,
          endTimestamp: newestTimestamp + 1,
          unit: 'hPa'
        })
      } catch (error) {
        console.log(error)
      }
      
      let relhum_2m_REPORT
      try {
        relhum_2m_REPORT = await this.loadReportData({
          voi: 'relhum_2m',
          scalingFactor: 100,
          poiID: this.selectedPoiId,
          startTimestamp: oldesTimestamp,
          endTimestamp: newestTimestamp + 1
        })
      } catch (error) {
        console.log(error)
      }
      
      

      const referenceTimestamp = this.$moment.utc().startOf('day').add(6, 'hours').valueOf()
      
      let t_2m_COSMO
      try {
        t_2m_COSMO = await this.loadCosmoData({
          voi: 't_2m',
          scalingOffset: -273.15,
          lat: this.selectedPoi.lat,
          lon: this.selectedPoi.lon,
          referenceTimestamp: referenceTimestamp,
          startTimestamp: referenceTimestamp,
          endTimestamp: newestTimestamp + 1,
          unit: '°C'          
        })
      } catch (error) {
        console.log(error)
      }
      let result2 = t_2m_COSMO

      let pmsl_COSMO
      try {
        pmsl_COSMO = await this.loadCosmoData({
          voi: 'pmsl',
          scalingFactor: 0.01,
          lat: this.selectedPoi.lat,
          lon: this.selectedPoi.lon,
          referenceTimestamp: referenceTimestamp,
          startTimestamp: referenceTimestamp,
          endTimestamp: newestTimestamp + 1,
          unit: 'hPa'
        })
      } catch (error) {
        console.log(error)
      }
      
      const localforecastReferenceTimestamp = this.$moment.utc().subtract(60, 'minutes').startOf('day').add(6, 'hours').valueOf()

      let t_2m_MOSMIX
      try {
        t_2m_MOSMIX = await this.loadMosmixData({
          voi: 't_2m',
          scalingOffset: -273.15,
          poiID: this.selectedPoiId,
          startTimestamp: oldesTimestamp,
          endTimestamp: newestTimestamp + 1,
          referenceTimestamp: localforecastReferenceTimestamp,
          unit: '°C'
        })
      } catch (error) {
        console.log(error)
      }

      let pmsl_MOSMIX
      try {
        pmsl_MOSMIX = await this.loadMosmixData({
          voi: 'pmsl',
          scalingFactor: 0.01,
          poiID: this.selectedPoiId,
          startTimestamp: oldesTimestamp,
          endTimestamp: newestTimestamp + 1,
          referenceTimestamp: localforecastReferenceTimestamp,
          unit: 'hPa'
        })
      } catch (error) {
        console.log(error)
      }
      
      t_2m_REPORT.body.label = t_2m_REPORT.body.label + '_REPORT'
      t_2m_COSMO.body.label = t_2m_COSMO.body.label + '_COSMO'
      t_2m_MOSMIX.body.label = t_2m_MOSMIX.body.label + '_MOSMIX'
      pmsl_REPORT.body.label = pmsl_REPORT.body.label + '_REPORT'
      pmsl_COSMO.body.label = pmsl_COSMO.body.label + '_COSMO'
      pmsl_MOSMIX.body.label = pmsl_MOSMIX.body.label + '_MOSMIX'
      
      this.currentData = [t_2m_REPORT.body, t_2m_COSMO.body, t_2m_MOSMIX.body, pmsl_REPORT.body, pmsl_COSMO.body, pmsl_MOSMIX.body]
      
      this.currentReportData.timestamp = _.last(t_2m_REPORT.body.data).timestamp
      this.currentReportData.t_2m = _.last(t_2m_REPORT.body.data).value
      this.currentReportData.pmsl = _.last(pmsl_REPORT.body.data).value
      this.currentReportData.relhum_2m = _.last(relhum_2m_REPORT.body.data).value

      console.log(t_2m_COSMO)
      this.cosmoLocation.lat = t_2m_COSMO.body.location.lat
      this.cosmoLocation.lon = t_2m_COSMO.body.location.lon

      console.log(this.cosmoLocation)

      const google_map_pos = new google.maps.LatLng( this.selectedPoi.lat, this.selectedPoi.lon )
      const google_maps_geocoder = new google.maps.Geocoder()
      google_maps_geocoder.geocode(
        { 'latLng': google_map_pos },
        function( results, status ) {
          if ( status == google.maps.GeocoderStatus.OK && results[0] ) {
            that.staticLocationData.addressString = results[0].formatted_address
            console.log( results[0].formatted_address )
          }
        }
      )
    }
  },
  watch: {
    selectedPoiId () {
      this.loadCurrentData()
      
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
