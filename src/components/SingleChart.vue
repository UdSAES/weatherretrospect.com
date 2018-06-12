<template>
  <canvas ref="canvas"></canvas>
</template>
<script>

import Chart from 'chart.js'

export default {
  name: 'SingleChart',
  data () {
    return {
      chart: null,
      originalCanvas: ''
    }
  },
  props: {
    curves: {
      type: Array,
      default: function () {
        return [
          {
            label: 'curve1',
            unit: 'unit1',
            data: [{timestamp: 0, value: 0}, {timestamp: 1, value: 1}, {timestamp: 2, value: 4}]
          }
        ]
      }
    },
    leftAxisWidth: {
      type: Number,
      default: function () {
        return null
      }
    },
    rightAxisWidth: {
      type: Number,
      default: function () {
        return null
      }
    },
    curveColors: {
      type: Array,
      default: function () {
        return ['#000000']
      }
    },
    borderDashs: {
      type: Array,
      default: function () {
        return [[1,0]]
      }
    },
    leftAxisColor: {
      type: String,
      default: function () {
        return '#888888'
      }
    },
    rightAxisColor: {
      type: String,
      default: function () {
        return '#888888'
      }
    },
    displayLeftAxis: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    displayRightAxis: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  methods: {
    draw () {
      console.log('draw called')
      const that = this
      const data = {}

      // const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      //const colors = ['#e52d1e', '#e52d1e', '#e52d1e', '#3157a0', '#3157a0', '#3157a0', '#3157a0']
      const colors = this.curveColors
      const borderDashs = this.borderDashs

      data.datasets = this.$_.map(this.curves, (curve, index) => {
        const curveData = []
        this.$_.forEach(curve.data, (item) => {
          curveData.push({x: item.timestamp, y: item.value})
        })

        return {
          label: curve.label + ' (' + curve.unit + ')',
          data: curveData,
          showLine: true,
          borderColor: colors[index],
          fill: false,
          borderWidth: 2,
          yAxisID: curve.axis,
          borderDash: borderDashs[index],
          borderCapStyle: 'butt'
        }
      })

      let canvasElement = this.$refs.canvas
      
      if (canvasElement.chart) {
        const width = canvasElement.width
        const height = canvasElement.height
        canvasElement.chart.destroy()
        canvasElement = this.$refs.canvas
        canvasElement.width = width
        canvasElement.height = height
        
      }

      let leftAxis = {
        id: 'A',
        position: 'left',
        afterFit: function (scaleInstance) {
          if (!that.$_.isNil(that.leftAxisWidth)) {
            scaleInstance.width = that.leftAxisWidth
          }
        },
        ticks: {
          fontColor: that.leftAxisColor
        }
      }
      
      let rightAxis = {
        id: 'B',
        position: 'right',
        afterFit: function (scaleInstance) {
          if (!that.$_.isNil(that.rightAxisWidth)) {
            scaleInstance.width = that.rightAxisWidth
          }
        },
        ticks: {
          fontColor: that.rightAxisColor
        }
      }

      let yAxes = []
      if (that.displayLeftAxis !== false) {
        yAxes.push(leftAxis)
      }

      if (that.displayRightAxis !== false) {
        yAxes.push(rightAxis)
      }

      console.log({
        test: that.displayRightAxis
      })

      console.log('that.displayRightAxis', that.displayRightAxis, yAxes)
      
      this.chart = new Chart(canvasElement, {
        type: 'scatter',
        data: data,
        options: {
          animation: {
            duration: 100
          },
          responsive: false,
          scales: {
            xAxes: [{
              type: 'time',
              display: true,
              ticks: {
                callback: function (value, index, values) {
                  if (index >= values.length) {
                    return ''
                  }

                  if (index === 0) {
                    console.log(values)
                  }

                  if (values[index].major) {
                    return that.$moment(values[index].value).format('DD.MM.YYYY HH:mm')
                  }
                  
                  return
                }
              }
            }],
            yAxes: yAxes
          },
          tooltips: {
            mode: 'x',
            callbacks: {
              label: function (tooltipItem, data) {
                console.log(tooltipItem, data)
                const dataset = data.datasets[tooltipItem.datasetIndex]
                return dataset.label + ': ' + dataset.data[tooltipItem.index].y.toFixed(1)
              }
            }
          }
        }
      })

      canvasElement.style.width = canvasElement.width + 'px'
      canvasElement.style.height = canvasElement.height + 'px'
      canvasElement.chart = this.chart
    }
  },

  computed: {

  },

  mounted () {
    this.draw()
  },

  data: function () {
    return {
    }
  },

  watch: {
    curves () {
      this.draw()
    }
  }
}

</script>
