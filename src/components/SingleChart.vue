<template>
  <div ref="parent" style="position: relative; width: 100%">
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script>

import Chart from 'chart.js'

export default {
  name: 'SingleChart',
  data () {
    return {
      chart: null
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
    xAxisMinValue: {
      type: Number,
      default: function () {
        return undefined
      }
    },
    xAxisMaxValue: {
      type: Number,
      default: function () {
        return undefined
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
    leftAxisLabel: {
      type: String,
      default: function () {
        return null
      }
    },
    leftAxisWidth: {
      type: Number,
      default: function () {
        return 50
      }
    },
    rightAxisLabel: {
      type: String,
      default: function () {
        return null
      }
    },
    rightAxisWidth: {
      type: Number,
      default: function () {
        return 50
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
        return [[1, 0]]
      }
    },
    showLegend: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    handleWindowResize () {
      this.draw()
    },
    draw () {
      const that = this
      const data = {}

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
        canvasElement.chart.destroy()
        canvasElement = this.$refs.canvas
      }

      let leftAxisScaleLabel
      if (this.leftAxisLabel != null) {
        leftAxisScaleLabel = {
          display: true,
          labelString: this.leftAxisLabel
        }
      } else {
        leftAxisScaleLabel = {
          display: false
        }
      }

      let leftAxis = {
        id: 'A',
        position: 'left',
        afterFit: function (scaleInstance) {
          if (!that.$_.isNil(that.leftAxisWidth)) {
            scaleInstance.width = that.leftAxisWidth
          }
        },
        scaleLabel: leftAxisScaleLabel,
        ticks: {
          fontColor: that.leftAxisColor
        }
      }

      let rightAxisScaleLabel
      if (this.rightAxisLabel != null) {
        rightAxisScaleLabel = {
          display: true,
          labelString: this.rightAxisLabel
        }
      } else {
        rightAxisScaleLabel = {
          display: false
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
        scaleLabel: rightAxisScaleLabel,
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

      this.chart = new Chart(canvasElement, {
        type: 'scatter',
        data: data,
        options: {
          animation: {
            duration: 100
          },
          legend: {
            display: this.showLegend
          },
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            xAxes: [{
              type: 'time',
              display: true,
              ticks: {
                callback: function (value, index, values) {
                  if (index >= values.length) {
                    return ''
                  }

                  if (values[index].major) {
                    return that.$moment(values[index].value).format('DD.MM.YYYY HH:mm')
                  }
                }
              },
              time: {
                min: that.xAxisMinValue,
                max: that.xAxisMaxValue
              }
            }],
            yAxes: yAxes
          },
          tooltips: {
            mode: 'x',
            callbacks: {
              label: function (tooltipItem, data) {
                const dataset = data.datasets[tooltipItem.datasetIndex]
                return dataset.label + ': ' + dataset.data[tooltipItem.index].y.toFixed(1)
              }
            }
          }
        }
      })

      canvasElement.chart = this.chart
    }
  },

  mounted () {
    this.draw()
    window.addEventListener('resize', this.handleWindowResize)
  },

  watch: {
    curves () {
      this.draw()
    }
  }
}

</script>
