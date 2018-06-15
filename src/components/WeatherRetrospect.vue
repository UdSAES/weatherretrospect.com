<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs12 class="text-xs-left">
        <h2>{{ $t('weather_retrospect') }}</h2>
      </v-flex>
    </v-layout>
    <!--<v-layout>
      <v-flex xs2 mr-1 ml-1>
        <v-select
          :label="$t('share_start_time')"
          :items="binarySelectionItems"
          v-model="shareStartDate"
        >
          <template slot="selection" slot-scope="data">
            {{ $t(data.item.text) }}
          </template>
          <template slot="item" slot-scope="data">
            {{ $t(data.item.text) }}
          </template>
        </v-select>
      </v-flex>
      <v-flex xs2 mr-1 ml-1>
        <v-select
          :label="$t('share_voi')"
          :items="binarySelectionItems"
          v-model="shareVoi"
        >
          <template slot="selection" slot-scope="data">
            {{ $t(data.item.text) }}
          </template>
          <template slot="item" slot-scope="data">
            {{ $t(data.item.text) }}
          </template>
        </v-select>
      </v-flex>
      <v-flex xs2 mr-1 ml-1>
        <v-btn>{{ $t('add_new_diagram') }}</v-btn>
      </v-flex>
    </v-layout>
    -->
    <v-layout>
      <v-flex xs12>
        <v-card class="elevation-6 mr-1 ml-1 mt-1">
          <weather-retrospect-diagram
            :poi="poi"
          ></weather-retrospect-diagram>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import WeatherRetrospectDiagram from '@/Components/WeatherRetrospectDiagram'
export default {
  name: 'WeatherRetrospect',
  components: {
    WeatherRetrospectDiagram
  },
  data: function () {
    return {
      binarySelectionItems: [{text: 'yes', value: true}, {text: 'no', value: false}],
      voiSelectionItems: [{text: 'yes', value: true}, {text: 'no', value: false}],
      shareStartDate: true,
      shareVoi: false
    }
  },

  methods: {

  },

  props: {
    poi: {
      id: '10708',
      lat: 50,
      lon: 7.5
    }
  },

  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
