<template>
  <v-container>
    <v-layout>
      <v-flex xs12 class="text-xs-left">
        <h2>{{ $t('current_forecast_data') }}</h2>
        <div>
          <single-chart
            style="height: 390px"
            :curves="curves"
            :leftAxisWidth="50"
            :rightAxisWidth="50"
            :curveColors="curveColors"
            :borderDashs="borderDashs"
            leftAxisColor="#e52d1e"
            rightAxisColor="#00a878"
          >
          </single-chart>
        </div>
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
  data: function () {
    return {
      curves: [],
      // curveColors: ['#e52d1e', '#e52d1e', '#e52d1e', '#3157a0', '#3157a0', '#3157a0', '#3157a0'],
      curveColors: ['#e52d1e', '#e52d1e', '#e52d1e', '#00a878', '#00a878', '#00a878', '#00a878'],
      borderDashs: [undefined, [7, 7], [3, 3], undefined, [7, 7], [3, 3]]
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
