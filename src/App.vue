<template>
  <v-app>
    <v-toolbar fixed app>
      <v-layout align-center>
          <v-flex xs7>
            <v-layout justify-start>
              <v-btn flat style="padding: 0px; height: 70px" target="_blank"><img src="./assets/logo.png" height="60px" style="margin: 10px"></v-btn>
              <v-btn flat style="padding: 0px; height: 70px" href="https://www.uni-saarland.de/en/lehrstuhl/frey/start.html" target="_blank"><img src="./assets/AES_logo.png" height="60px" style="margin: 10px"></v-btn>
              <v-btn class="hidden-sm-and-down" flat style="padding: 0px; height: 70px" href="https://www.uni-saarland.de/nc/en/home.html" target="_blank"><img src="./assets/logo_uds_transparent.png" height="60px" style="margin: 10px"></v-btn>
              <v-btn class="hidden-lg-and-up" flat style="padding: 0px; height: 70px" href="https://www.dwd.de/EN/ourservices/opendata/opendata.html" target="_blank"><img src="./assets/dwd_logo_40x69_transparent.png" height="60px" style="margin: 10px"></v-btn>
              <v-btn class="hidden-md-and-down" flat style="padding: 0px; height: 70px" href="https://www.dwd.de/EN/ourservices/opendata/opendata.html" target="_blank"><img src="./assets/dwd_logo_258x69_transparent.png" height="60px" style="margin: 10px"></v-btn>
            </v-layout>
          </v-flex>
          <v-flex xs5>
            <v-layout row justify-end align-center>
              <v-select
                :label="$t('language')"
                :items="languageItems"
                v-model="selectedLanguage"
                class="mt-4"
                style="max-width: 200px"
              ></v-select>
              <v-btn href="https://www.uni-saarland.de/footer/dialog/impressum.html" target="_blank" flat style="padding: 0px; margin: 0px; height: 70px">{{ $t('imprint') }}</v-btn>
            </v-layout>
          </v-flex>
      </v-layout>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-layout ref="secondRow">
          <v-flex xs6>
            <v-card class="elevation-6 mr-1 ml-1 mb-1">
              <station-map
                :stationList="stationList"
                :selectedPoiId="selectedPoiId"
                v-on:marker-clicked="changePoi"
                :cosmoLocation="cosmoLocation">
              </station-map>
            </v-card>
          </v-flex>
          <v-flex xs6>
            <v-layout>
              <v-flex x12>
                <v-card class="elevation-6 mr-1 ml-1">
                  <weather-station-data
                    :staticLocationData="staticLocationData"
                    :currentReportData="currentReportData"
                  >
                  </weather-station-data>
                </v-card>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12>
                <v-card class="elevation-6 mr-1 ml-1 mt-1"  height="433">
                  <current-forecast-data
                    :timeseries="currentData"
                  >
                  </current-forecast-data>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12 class="elevation-6 mr-1 ml-1 mt-1">
            <v-card>
              <weather-retrospect
                :poi="selectedPoi"
              ></weather-retrospect>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import StationMap from '@/Components/StationMap'
import WeatherStationData from '@/Components/WeatherStationData'
import CurrentForecastData from '@/Components/CurrentForecastData'
import WeatherRetrospect from '@/Components/WeatherRetrospect'
import {loadCosmoData, loadReportData, loadMosmixData} from '@/data_loader.js'
import _ from 'lodash'

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
    this.$i18n.locale = this.selectedLanguage
    window.addEventListener('resize', this.handleWindowResize)
  },
  data: function () {
    return {
      languageItems: ['de_DE', 'en_US'],
      selectedLanguage: window.INITIALLY_SELECTED_LANGUAGE,
      stationList: [],
      selectedPoiId: '',
      selectedPoi: {
        id: '',
        lat: 0,
        lon: 0
      },
      staticLocationData: {
        id: '10708',
        addressString: '--',
        coordinates: {
          lat: 0,
          lon: 0,
          elev: 0
        }
      },
      currentReportData: {
        timestamp: 0,
        t_2m: 0,
        pmsl: 0,
        relhum_2m: 0
      },
      currentData: [{label: '1', unit: 'K', data: [0, 0]}],
      cosmoLocation: {
        lat: 7.5,
        lon: 50
      }
    }
  },
  methods: {
    handleWindowResize: function () {
      if (this.$vuetify.breakpoint.xl) {
        this.$refs.secondRow.classList.add('row')
        this.$refs.secondRow.classList.remove('column')
      } else {
        this.$refs.secondRow.classList.add('column')
        this.$refs.secondRow.classList.remove('row')
      }
    },

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

    async loadCurrentData () {
      const that = this
      const now = this.$moment.utc()
      const oldesTimestamp = this.$moment.utc(now).subtract(6, 'hours').valueOf()
      const newestTimestamp = this.$moment.utc(oldesTimestamp).add(28, 'hours').valueOf()

      let t_2m_REPORT
      try {
        t_2m_REPORT = await loadReportData({
          voi: 't_2m',
          scalingOffset: -273.15,
          poiID: this.selectedPoiId,
          startTimestamp: oldesTimestamp,
          endTimestamp: newestTimestamp + 1,
          unit: '°C'
        })
      } catch (error) {
        console.error(error)
      }

      let pmsl_REPORT
      try {
        pmsl_REPORT = await loadReportData({
          voi: 'pmsl',
          scalingFactor: 0.01,
          poiID: this.selectedPoiId,
          startTimestamp: oldesTimestamp,
          endTimestamp: newestTimestamp + 1,
          unit: 'hPa'
        })
      } catch (error) {
        console.error(error)
      }

      let relhum_2m_REPORT
      try {
        relhum_2m_REPORT = await loadReportData({
          voi: 'relhum_2m',
          scalingFactor: 100,
          poiID: this.selectedPoiId,
          startTimestamp: oldesTimestamp,
          endTimestamp: newestTimestamp + 1
        })
      } catch (error) {
        console.error(error)
      }

      const nowTimestamp = now.valueOf()
      let referenceTimestamp = Math.floor((nowTimestamp) / (3 * 3600 * 1000)) * 3 * 3600 * 1000
      let t_2m_COSMO
      try {
        t_2m_COSMO = await loadCosmoData({
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
        console.error(error)
      }

      if (!t_2m_COSMO) {
        referenceTimestamp -= 3 * 3600 * 1000
        try {
          t_2m_COSMO = await loadCosmoData({
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
          console.error(error)
        }
      }

      let pmsl_COSMO
      try {
        pmsl_COSMO = await loadCosmoData({
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
        console.error(error)
      }

      const localforecastReferenceTimestamp = this.$moment.utc().subtract(60, 'minutes').startOf('day').add(6, 'hours').valueOf()

      let t_2m_MOSMIX
      try {
        t_2m_MOSMIX = await loadMosmixData({
          voi: 't_2m',
          scalingOffset: -273.15,
          poiID: this.selectedPoiId,
          startTimestamp: oldesTimestamp,
          endTimestamp: newestTimestamp + 1,
          referenceTimestamp: localforecastReferenceTimestamp,
          unit: '°C'
        })
      } catch (error) {
        console.error(error)
      }

      let pmsl_MOSMIX
      try {
        pmsl_MOSMIX = await loadMosmixData({
          voi: 'pmsl',
          scalingFactor: 0.01,
          poiID: this.selectedPoiId,
          startTimestamp: oldesTimestamp,
          endTimestamp: newestTimestamp + 1,
          referenceTimestamp: localforecastReferenceTimestamp,
          unit: 'hPa'
        })
      } catch (error) {
        console.error(error)
      }

      t_2m_REPORT.label = t_2m_REPORT.label + '_REPORT'
      t_2m_COSMO.label = t_2m_COSMO.label + '_COSMO'
      t_2m_MOSMIX.label = t_2m_MOSMIX.label + '_MOSMIX'
      pmsl_REPORT.label = pmsl_REPORT.label + '_REPORT'
      pmsl_COSMO.label = pmsl_COSMO.label + '_COSMO'
      pmsl_MOSMIX.label = pmsl_MOSMIX.label + '_MOSMIX'

      this.currentData = [t_2m_REPORT, t_2m_COSMO, t_2m_MOSMIX, pmsl_REPORT, pmsl_COSMO, pmsl_MOSMIX]

      this.currentReportData.timestamp = _.last(t_2m_REPORT.data).timestamp
      this.currentReportData.t_2m = _.last(t_2m_REPORT.data).value
      this.currentReportData.pmsl = _.last(pmsl_REPORT.data).value
      this.currentReportData.relhum_2m = _.last(relhum_2m_REPORT.data).value

      this.cosmoLocation.lat = t_2m_COSMO.location.lat
      this.cosmoLocation.lon = t_2m_COSMO.location.lon

      const google_map_pos = new window.google.maps.LatLng(this.selectedPoi.lat, this.selectedPoi.lon)
      const google_maps_geocoder = new window.google.maps.Geocoder()
      google_maps_geocoder.geocode(
        { 'latLng': google_map_pos },
        function (results, status) {
          if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
            that.staticLocationData.addressString = results[0].formatted_address
          }
        }
      )
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      var xhttp = new XMLHttpRequest()
      const that = this
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          // Typical action to be performed when the document is ready:
          const c = parseCsv(xhttp.responseText)
          setTimeout(function () {
            that.stationList = c
            that.changePoi({
              id: '10708',
              lat: 49.212803,
              lon: 7.107712
            })
          }, 0)
        }
      }
      xhttp.open('GET', '/static/station_catalog.csv', true)
      xhttp.send()
    })
  },
  watch: {
    selectedPoiId () {
      this.loadCurrentData()
    },

    selectedLanguage () {
      this.$i18n.locale = this.selectedLanguage
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
  background: #ffffff;
}
</style>
