<template>
  <v-container>
    <v-layout>
      <v-flex xs12 class="text-xs-left">
        <h2>Wetterstation {{ staticLocationData.id }}</h2>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs6>
        <v-card class="elevation-6 mr-1 ml-1 text-xs-left" height="150">
          <v-container>
            <v-layout>
              <v-flex xs12 class="text-xs-left">
                <h2>Lage des Standorts</h2>
                <p>
                  {{ staticLocationData.addressString }}<br>
                  {{ staticLocationData.coordinates.lat }} °N, {{ staticLocationData.coordinates.lon }} °O, {{ staticLocationData.coordinates.elev }} m ü. NHN<br>
                  Zeitzone GMT+2
                </p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <v-flex xs6>
        <v-card class="elevation-6 mr-1 ml-1" height="150">
          <v-container>
           <v-layout>
              <v-flex xs12 class="text-xs-left">
                <h2>Aktuelle Wetterlage</h2>
                <p>
                  Zeitpunkt der Erfassung: {{ this.$moment(currentReportData.timestamp).format('DD.MM.YYYY, HH:mm') }} Uhr<br>
                  Lufttemperatur: {{ currentReportData.t_2m.toFixed(1) }} °C<br>
                  Luftdruck: {{ currentReportData.pmsl.toFixed(1) }} hPa<br>
                  Relative Luftfeuchtigkeit: {{ currentReportData.relhum_2m.toFixed(1) }} %
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
      addressString: ''
    },
    currentReportData: {

    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
