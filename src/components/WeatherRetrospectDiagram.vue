<template>
  <v-container>
    <v-layout v-bind="binding">
      <v-flex xs3 mr-1 ml-1>
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
      <v-flex xs3 mr-1 ml-1>
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
      <v-flex xs3 mr-1 ml-1>
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
      <v-flex xs3 mr-1 ml-1>
        <v-select
          :label="$t('show_forecasts')"
          :items="binarySelectionItems"
          v-model="showForecasts"
        >
          <template slot="selection" slot-scope="data">
            {{ $t(data.item.text) }}
          </template>
          <template slot="item" slot-scope="data">
            {{ $t(data.item.text) }}
          </template>
        </v-select>
      </v-flex>
      <v-flex xs1 mr-1 ml-1>
        <v-btn
          flat
          large
          @click.stop="infoDialog = true"
        >
          <v-icon>
            info
          </v-icon>
        </v-btn>
        <v-dialog
          v-model="infoDialog"
          max-width="700"
        >
          <v-card>
            <v-card-title class="headline">Info</v-card-title>
            <v-card-text v-if="language === 'de_DE'" class="text-xs-left">
              <p>Zusätzlich zu den gemessenen Werten können in dieser Grafik auch die Vorhersagedaten für die ausgewählte Größe angezeigt werden. Es stehen sowohl die numerischen Modellvorhersagedaten des sogenannten <a href="https://www.dwd.de/DE/leistungen/modellvorhersagedaten/modellvorhersagedaten.html" target="_blank">COSMO-D2-Modells</a>, als auch statistisch optimierte Punktvorhersagen, genannt <a href="https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/met_verfahren_mosmix.html" target="_blank">MOSMIX</a>, zur Verfügung.</p>

              <p>In der Legende der Grafik werden die Kurven durch ein Kürzel für das Vorhersageverfahren und das Alter der Vorhersage bezogen auf den Beginn des in der Grafik dargestellten Zeitraums identifiziert. Beispielsweise bezeichnet "M-021h" in einer Darstellung von 00h - 24h die MOSMIX-Vorhersage, die um drei Uhr am Vortag erstellt wurde. In einer Darstellung, die um sieben Uhr morgens beginnt, bezeichnet "C-004h" die durch das COSMO-D2-Modell um drei Uhr morgens am selben Tag erstellte Vorhersage.</p>
            </v-card-text>
            <v-card-text v-else class="text-xs-left">
              <p>In addition to the measured data, forecasts for the selected values can be shown in this graphic. Both the forecasts created by the numerical weather prediction model <a href="https://www.dwd.de/EN/ourservices/nwp_forecast_data/nwp_forecast_data.html" target="_blank">COSMO-D2</a> as well as statistically optimized point forecasts, denoted <a href="https://www.dwd.de/EN/ourservices/met_application_mosmix/met_application_mosmix.html" target="_blank">MOSMIX</a>, are available.</p>

              <p>An abbreviation is used for identifying the individual curves of the graph, indicating the type of forecast and the beginning of the forecast horizon. The latter is expressed as the age of the forecast in hours with respect to the beginning of the time frame shown in the graph. For example, if the graph shows exactly one day, "M-021h" denotes the MOSMIX-forecast that was created at three a.m. on the previous day. If the graph starts at seven in the morning, "C-004h" denotes the forecast based on the COSMO-D2-model that was created at three a.m. on the same day.</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                flat="flat"
                @click="infoDialog = false"
              >OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
          :leftAxisLabel="leftAxisLabel"
          :leftAxisWidth="80"
          :showLegend="showLegend"
          :xAxisMinValue="xAxisMinValue"
          :xAxisMaxValue="xAxisMaxValue"
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
import {loadCosmoData, loadReportData, loadMosmixData} from '@/data_loader.js'
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
  },
  aswdifd_s: {
    unit: 'W/m²'
  },
  aswdir_s: {
    unit: 'W/m²'
  },
  td_2m: {
    scalingOffset: -273.15,
    unit: '°C'
  },
  ws_10m: {
    scalingFactor: 3.6,
    unit: 'km/h'
  },
  wd_10m: {
    unit: '°'
  }
}

export default {
  name: 'WeatherRetrospectDiagram',
  components: {
    SingleChart
  },
  computed: {
    binding: function () {
      const binding = {}

      if (this.$vuetify.breakpoint.xs) {
        binding.column = true
      } else {
        binding.column = false
      }

      return binding
    },
    showLegend: function () {
      if (this.$vuetify.breakpoint.xs) {
        return false
      }

      return true
    }
  },
  data: function () {
    return {
      binarySelectionItems: [{text: 'yes', value: true}, {text: 'no', value: false}],
      date: this.$moment().format('YYYY-MM-DD'),
      time: '00:00',
      menu2: false,
      curveColors: ['#000000', 'rgba(255, 0, 0, 1)', 'rgba(255, 0, 0, 1)', 'rgba(24, 91, 133, 1)', 'rgba(24, 91, 133, 0.9)', 'rgba(24, 91, 133, 0.8)', 'rgba(24, 91, 133, 0.7)', 'rgba(24, 91, 133, 0.6)', 'rgba(24, 91, 133, 0.5)', 'rgba(24, 91, 133, 0.4)', 'rgba(24, 91, 133, 0.3)', 'rgba(24, 91, 133, 0.2)'],
      borderDashs: [undefined],
      curves: [],
      voiSelectionItems: [{text: 'air_temperature', value: 't_2m'}, {text: 'air_pressure', value: 'pmsl'}, {text: 'relative_humidity', value: 'relhum_2m'}, {text: 'diffuse_radiation', value: 'aswdifd_s'}, {text: 'direct_radiation', value: 'aswdir_s'}, {text: 'dew_point', value: 'td_2m'}, {text: 'wind_speed', value: 'ws_10m'}, {text: 'wind_direction', value: 'wd_10m'}],
      selectedVoi: 't_2m',
      loading: false,
      showForecasts: false,
      leftAxisLabel: '°C',
      xAxisMinValue: null,
      xAxisMaxValue: null,
      infoDialog: false
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
      const endTimestamp = this.$moment.utc(startTimestamp).add(24, 'hours').valueOf()

      const curves = []
      this.xAxisMinValue = startTimestamp
      this.xAxisMaxValue = endTimestamp
      this.leftAxisLabel = voiConfig.unit

      let loadResult
      try {
        loadResult = await loadReportData({
          voi: this.selectedVoi,
          scalingFactor: voiConfig.scalingFactor,
          scalingOffset: voiConfig.scalingOffset,
          poiID: this.poi.id,
          startTimestamp: startTimestamp,
          endTimestamp: endTimestamp + 1,
          unit: voiConfig.unit
        })
        loadResult.label = 'Measured'
        curves.push(loadResult)
      } catch (error) {
        console.error(error)
      }

      for (let i = 6; i >= -1; i--) {
        const referenceTimestamp = this.$moment.utc(nowTimestamp).hours(6).subtract(i * 24, 'hours').minutes(0).seconds(0).milliseconds(0).valueOf()
        let diff = (referenceTimestamp - startTimestamp) / 3600 / 1000

        diff = diff >= 0 ? '+' + diff : '' + diff
        try {
          loadResult = await loadMosmixData({
            voi: this.selectedVoi,
            scalingFactor: voiConfig.scalingFactor,
            scalingOffset: voiConfig.scalingOffset,
            poiID: this.poi.id,
            startTimestamp: startTimestamp - 2 * 3600 * 1000,
            endTimestamp: endTimestamp + 2 * 3600 * 1000 + 1,
            referenceTimestamp: this.$moment.utc(nowTimestamp).hours(6).subtract(i * 24, 'hours').minutes(0).seconds(0).milliseconds(0).valueOf(),
            unit: voiConfig.unit
          })
          curves.push({label: 'M ' + diff + 'h', unit: voiConfig.unit, data: loadResult.data})
        } catch (error) {
          console.error(error)
          curves.push({label: 'M ' + diff + 'h', unit: voiConfig.unit, data: []})
        }
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

        loadResult.label = 'C ' + startHoursOffset + 'h'
        loadResult.referenceTimestamp = referenceTimestamp
        forecastCurves.push(loadResult)
      }.bind(this), 24)

      forecastCurves = _.sortBy(forecastCurves, (curve) => {
        console.log(curve.referenceTimestamp)
        return curve.referenceTimestamp
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
    language: {
      type: String,
      default () {
        return 'en_US'
      }
    }
  },

  created: function () {
    const colors = ['#000000']

    const basicColor = '128, 38, 83' // DESIGNETZ LILAC 1
    for (let i = 0; i < 8; i++) {
      colors.push('rgba(' + basicColor + ',' + (1 - (7 - i) * 1 / 8.0) + ')')
    }

    const basicColors = [
      '38,123,129', // DESIGNETZ UMBRA 1
      '0,168,120', // DESIGNETZ DUNKELGRÜN
      '100,99,99', // DESIGNETZ GRAU 1
      '0,0,0'
    ]
    const l = 8
    for (let i = 0; i < 20; i++) {
      colors.push('rgba(' + basicColors[Math.floor(i / l)] + ',' + (0.3 + (i % l) * 0.1) + ')')
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
a {
  padding-left: 0px;
  padding-right: 0px;
}
</style>
