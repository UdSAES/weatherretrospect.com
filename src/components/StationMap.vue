<template>
  <div ref="map" style="height: 680px; width: 100%"></div>
</template>

<script>
export default {
  name: 'StationMap',

  data: function () {
    return {
      map: null,
      markers: [],
      cosmoMarker: null
    }
  },

  methods: {
    handleMarkerClick (poi) {
      this.$emit('marker-clicked', {
        id: poi.id,
        lat: poi.lat,
        lon: poi.lon
      })
    },

    redrawMap () {
      if (!(window.google && this.map)) {
        setTimeout(function () {
          this.redrawMap()
        }.bind(this), 100)
        return
      }

      const bounds = new window.google.maps.LatLngBounds()
      const pois = this.stationList
      this.markers = []
      for (let i = 0; i < pois.length; i++) {
        const poi = pois[i]

        const point = {
          lat: poi.lat,
          lng: poi.lon
        }

        bounds.extend(point)
        let marker

        if (poi.id === this.selectedPoiId) {
          marker = new window.google.maps.Marker({
            position: point,
            map: this.map,
            poi: poi,
            icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          })
        } else {
          marker = new window.google.maps.Marker({
            position: point,
            map: this.map,
            poi: poi,
            icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          })
        }

        this.markers.push(marker)

        const that = this
        const ah = function (marker) {
          marker.addListener('click', function () {
            that.handleMarkerClick(poi)
          })
        }

        ah(marker)
      }

      this.map.fitBounds(bounds, {
        bottom: 25,
        left: 10,
        right: 10,
        top: 25
      })
    },
    redrawMarkers () {
      for (let i = 0; i < this.markers.length; i++) {
        const marker = this.markers[i]
        if (marker.poi.id === this.selectedPoiId && marker.icon !== 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png') {
          marker.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png')
        } else if (marker.poi.id !== this.selectedPoiId && marker.icon !== 'https://maps.google.com/mapfiles/ms/icons/red-dot.png') {
          marker.setIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png')
        }
      }
    },
    redrawCosmoMarker () {
      if (this.cosmoMarker != null) {
        this.cosmoMarker.setMap(null)
      }

      this.cosmoMarker = new window.google.maps.Marker({
        position: {
          lat: this.cosmoLocation.lat,
          lng: this.cosmoLocation.lon
        },
        map: this.map,
        icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
      })
    }
  },

  mounted: function () {
    // this.redrawMap()
    const intervalId = setInterval(function () {
      if (!window.google) {
        return
      }

      this.map = new window.google.maps.Map(this.$refs.map, {
        zoom: 4
      })
      clearInterval(intervalId)
    }.bind(this), 100)
  },

  props: {
    stationList: {
      type: Array
    },
    selectedPoiId: {
      type: String,
      default: '10706'
    },
    cosmoLocation: {
      type: Object,
      default: function () {
        return {
          lat: 7.5,
          lon: 50
        }
      }
    }
  },

  watch: {
    stationList: function () {
      this.redrawMap()
    },

    selectedPoiId: function () {
      this.redrawMarkers()
    },

    cosmoLocation: {
      handler () {
        this.redrawCosmoMarker()
      },
      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
