<template>
  <v-container>
    <v-layout>
      <v-flex xs12 class="text-xs-left">
        <h2>{{ $t('current_forecast_data') }}</h2>
        <div>
          <single-chart
            style="height: 390px"
            :curves="curves"
            leftAxisLabel="°C"
            :leftAxisWidth="70"
            rightAxisLabel="hPa"
            :rightAxisWidth="70"
            :curveColors="curveColors"
            :borderDashs="borderDashs"
            leftAxisColor="#e52d1e"
            rightAxisColor="#00a878"
            :showLegend="showLegend"
            :xMinValue="xMinValue"
            :xMaxValue="xMaxValue"
          >
          </single-chart>
        </div>
      </v-flex>
      <v-flex xs12 style="height: 390px" v-if="loading">
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
export default {
  name: 'CurrentForecastData',
  components: {
    SingleChart
  },
  computed: {
    showLegend: function () {
      if (this.$vuetify.breakpoint.xs) {
        return false
      }

      return true
    }
  },
  data: function () {
    return {
      curves: [],
      curveColors: ['#e52d1e', '#e52d1e', '#e52d1e', '#00a878', '#00a878', '#00a878', '#00a878'],
      borderDashs: [undefined, [7, 7], [3, 3], undefined, [7, 7], [3, 3]],
      loading: false,
      xMinValue: undefined,
      xMaxValue: undefined
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

    timeseries: {
      type: Array,
      default: function () {
        return []
      }
    }
  },

  watch: {
    timeseries: {
      handler: function () {
        this.curves = []
        this.$_.forEach(this.timeseries, (item, index) => {
          const newCurve = this.$_.cloneDeep(item)

          if (index < 3) {
            newCurve.axis = 'A'
          } else {
            newCurve.axis = 'B'
          }
          this.curves.push(newCurve)
        })
      },
      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
