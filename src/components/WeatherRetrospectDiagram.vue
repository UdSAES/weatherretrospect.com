<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs2 mr-1 ml-1>
        <v-menu
          ref="menu1"
          :close-on-content-click="true"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
         >
          <v-text-field
            slot="activator"
            v-model="date"
            :label="$t('start_date')"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="date"></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex xs2 mr-1 ml-1>
        <v-menu
          ref="menu2"
          :close-on-content-click="false"
          v-model="menu2"
          :nudge-right="40"
          :return-value.sync="time"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="time"
            :label="$t('start_time')"
            prepend-icon="access_time"
            readonly
          ></v-text-field>
          <v-time-picker v-model="time" @input="$refs.menu2.save(time)" format="24hr" :allowed-minutes="allowedMinutes"></v-time-picker>
        </v-menu>
      </v-flex>
      <v-flex xs2 mr-1 ml-1>
        <v-select
          :label="$t('value_of_interest')"
          :items="voiSelectionItems"
          v-model="selectedVoi"
        >
          <template slot="selection" slot-scope="data">
            {{ $t(data.item.text) }}
          </template>
          <template slot="item" slot-scope="data">
            {{ $t(data.item.text) }}
          </template>
        </v-select>
      </v-flex>
    </v-layout>
    <v-layout >
      <v-flex xs12 style="height: 450px" v-if="!loading">
        <single-chart
            style="height: 450px"
          :curves="curves"
          :borderDashs="borderDashs"
          :curveColors="curveColors"
          :display-right-axis="false"
        ></single-chart>
      </v-flex>
      <v-flex xs12 style="height: 450px" v-if="loading">
        <v-layout justify-center align-center style="height: 100%">
          <v-progress-circular
            indeterminate
            color="primary"
            :size="100"
          ></v-progress-circular>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SingleChart from '@/Components/SingleChart'
import {loadCosmoData, loadReportData} from '@/data_loader.js'
import * as Parallel from 'async-parallel'
import _ from 'lodash'

const voiConfigs = {
  t_2m: {
    scalingOffset: -273.15,
    unit: '°C'
  },
  pmsl: {
    scalingFactor: 0.01,
    unit: 'hPa'
  },
  relhum_2m: {
    scalingFactor: 100,
    unit: '%'
  }
}

export default {
  name: 'WeatherRetrospectDiagram',
  components: {
    SingleChart
  },
  data: function () {
    return {
      date: this.$moment().format('YYYY-MM-DD'),
      time: '00:00',
      menu2: false,
      curveColors: ['#000000', 'rgba(24, 91, 133, 1)', 'rgba(24, 91, 133, 0.9)', 'rgba(24, 91, 133, 0.8)', 'rgba(24, 91, 133, 0.7)', 'rgba(24, 91, 133, 0.6)', 'rgba(24, 91, 133, 0.5)', 'rgba(24, 91, 133, 0.4)', 'rgba(24, 91, 133, 0.3)', 'rgba(24, 91, 133, 0.2)'],
      borderDashs: [undefined],
      curves: [],
      voiSelectionItems: [{text: 'air_temperature', value: 't_2m'}, {text: 'air_pressure', value: 'pmsl'}, {text: 'relative_humidity', value: 'relhum_2m'}],
      selectedVoi: 't_2m',
      loading: false
    }
  },

  methods: {
    allowedMinutes (v) {
      return true
    },

    async loadData () {
      this.loading = true
      const voiConfig = voiConfigs[this.selectedVoi]
      const dateTimeString = this.date + ', ' + this.time
      const nowTimestamp = this.$moment(dateTimeString, 'YYYY-MM-DD, HH:mm')
      const startTimestamp = this.$moment.utc(nowTimestamp).minutes(0).seconds(0).milliseconds(0).valueOf()
      const endTimestamp = this.$moment.utc(startTimestamp).add(25, 'hours').valueOf()

      const curves = []

      let loadResult
      try {
        loadResult = await loadReportData({
          voi: this.selectedVoi,
          scalingFactor: voiConfig.scalingFactor,
          scalingOffset: voiConfig.scalingOffset,
          poiID: this.poi.id,
          startTimestamp: startTimestamp,
          endTimestamp: endTimestamp,
          unit: voiConfig.unit
        })
        curves.push(loadResult)
      } catch (error) {
        console.error(error)
      }

      // if forecasts shall not be shown, we stop right here
      if (!this.showForecasts) {
        this.curves = curves
        this.loading = false
        return
      }

      const referenceTimestamps = []
      const minusHours = []
      let referenceMoment = this.$moment.utc(endTimestamp).minutes(0).seconds(0).milliseconds(0)
      const hoursModulo = referenceMoment.hours() % 3
      referenceMoment.subtract(hoursModulo, 'hours')
      while (referenceTimestamps.length < 17) {
        minusHours.push(-hoursModulo - referenceTimestamps.length * 3)
        referenceTimestamps.push(referenceMoment.valueOf())
        referenceMoment.subtract(3, 'hours')
      }

      let index = -1
      let forecastCurves = []
      await Parallel.each(referenceTimestamps, async function (referenceTimestamp) {
        index++
        const i = index

        let loadResult
        try {
          loadResult = await loadCosmoData({
            voi: this.selectedVoi,
            scalingFactor: voiConfig.scalingFactor,
            scalingOffset: voiConfig.scalingOffset,
            lon: this.poi.lon,
            lat: this.poi.lat,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
            referenceTimestamp: referenceTimestamp,
            unit: voiConfig.unit
          })
        } catch (error) {
          console.error(error)
          return
        }

        let startHoursOffset = 25 + minusHours[i]
        startHoursOffset = startHoursOffset >= 0 ? '+' + startHoursOffset : '' + startHoursOffset

        let endHoursOffset = ((this.$_.last(loadResult.data).timestamp - startTimestamp) / 3600 / 1000)
        endHoursOffset = endHoursOffset >= 0 ? '+' + endHoursOffset : '' + endHoursOffset

        loadResult.label = loadResult.label + ' [' + startHoursOffset + 'h, ' + endHoursOffset + 'h]'
        forecastCurves.push(loadResult)
      }.bind(this), 24)

      forecastCurves = _.sortBy(forecastCurves, (curve) => {
        return curve.data[0].timestamp
      })

      this.curves = _.concat(curves, forecastCurves)
      this.loading = false
    }
  },

  props: {
    poi: {
      id: '10708',
      lat: 50,
      lon: 7.5
    },
    showForecasts: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },

  created: function () {
    const colors = ['#000000']

    const basicColors = ['24,91,133', '0,168,120', '100,99,99', '0,0,0']
    const l = 8
    for (let i = 0; i < 20; i++) {
      colors.push('rgba(' + basicColors[Math.floor(i / l)] + ',' + (1 - (i % l) * 0.1) + ')')
    }
    this.curveColors = colors
  },
  watch: {
    date: {
      handler: function () {
        this.loadData()
      }
    },
    time: {
      handler: function () {
        this.loadData()
      }
    },
    poi: {
      handler: function () {
        this.loadData()
      },
      deep: true
    },
    selectedVoi: {
      handler: function () {
        this.loadData()
      }
    },
    showForecasts: {
      handler: function () {
        this.loadData()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
