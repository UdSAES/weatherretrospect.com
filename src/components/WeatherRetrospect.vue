<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs12 class="text-xs-left">
        <h2>Wetternachhersage</h2>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs2 mr-1 ml-1>
        <v-select
          label="Diagramme zeitlich koppeln"
          :items="binarySelectionItems"
        ></v-select>
      </v-flex>
      <v-flex xs2 mr-1 ml-1>
        <v-select
          label="Diagramme bzgl. ausgewählter Prognose koppeln"
          :items="binarySelectionItems"
        ></v-select>
      </v-flex>
      <v-flex xs2 mr-1 ml-1>
        <v-btn>Neues Diagramm hinzufügen</v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <v-card class="elevation-6 mr-1 ml-1 mt-1"  height="429">
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
      binarySelectionItems: [{text: 'ja', value: true}, {text: 'nein', value: false}],
      voiSelectionItems: [{text: 'ja', value: true}, {text: 'nein', value: false}]
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
