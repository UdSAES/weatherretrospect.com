<template>
  <v-container>
    <v-layout>
      <v-flex xs12 class="text-xs-left">
        <h2>{{ $t('weather_station')}} {{ staticLocationData.id }}</h2>
      </v-flex>
    </v-layout>
    <v-layout v-bind="binding">
      <v-flex xs6>
        <v-card class="elevation-6 mr-1 ml-1 text-xs-left" height="150">
          <v-container>
            <v-layout>
              <v-flex xs12 class="text-xs-left">
                <h2>{{ $t('location') }}</h2>
                <p>
                  {{ staticLocationData.addressString }}<br>
                  {{ staticLocationData.coordinates.lat }} °N, {{ staticLocationData.coordinates.lon }} °O, {{ staticLocationData.coordinates.elev }} m {{ $t('above_sea_level') }}<br>
                  {{ $t('timezone_gmtp2') }}
                </p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <v-flex xs6>
        <v-card class="elevation-6 mr-1 ml-1" height="150" :class="{'mt-1': !showHorizontal}">
          <v-container>
           <v-layout>
              <v-flex xs12 class="text-xs-left">
                <h2>{{ $t('current_weather_conditions') }}</h2>
                <p>
                  {{ $t('time_of_acquisition') }}: {{ (currentReportData.timestamp && this.$moment(currentReportData.timestamp).format('DD.MM.YYYY, HH:mm')) || '--' }} {{ $t('clock_empty') }}<br>
                  {{ $t('air_temperature') }}: {{ (currentReportData.t_2m && currentReportData.t_2m.toFixed(1)) || '--' }} °C<br>
                  {{ $t('air_pressure') }}: {{ (currentReportData.pmsl && currentReportData.pmsl.toFixed(1)) || '--' }} hPa<br>
                  {{ $t('relative_humidity') }}: {{ (currentReportData.relhum_2m && currentReportData.relhum_2m.toFixed(1)) || '--' }} %
                </p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'WeatherStationData',

  computed: {
    binding: function () {
      const binding = {}

      binding.column = !this.showHorizontal
      
      return binding
    },

    showHorizontal: function () {
      return this.$vuetify.breakpoint.mdAndUp
    }
  },

  data: function () {
    return {
    }
  },

  methods: {
  },

  mounted: function () {
  },

  props: {
    stationList: {
      type: Array
    },
    staticLocationData: {

    },
    currentReportData: {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
