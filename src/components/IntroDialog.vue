<template>
  <v-dialog :value="show" persistent  max-width="700px">
    <v-layout justify-center>
      <v-card>
        <v-card-title class="headline">www.wetternachhersage.de / www.weatherretrospect.com</v-card-title>
        <v-card-text v-if="language === 'de_DE'" class="text-xs-left">
          www.wetternachhersage.de / www.weatherretrospect.com ist ein Demonstrationsprojekt des <a href="https://www.uni-saarland.de/en/lehrstuhl/frey/start.html" target="_blank">Lehrstuhls für Automatisierungs- und Energysysteme</a> der <a href="https://www.uni-saarland.de/nc/en/home.html" target="_blank">Universität des Saarlandes</a> und zeigt die Möglichkeit zur Nutzung öffentlich zugänglicher Wetterdaten. Die verwendeten Daten stammen aus dem Download-Portal <a href="https://www.dwd.de/DE/leistungen/opendata/opendata.html" target="_blank">Open Data</a> des <a href="https://www.dwd.de" target="_blank">Deutschen Wetterdienstes (DWD)</a>. Für die Richtigkeit der Daten, deren Darstellung und/oder Aktualität wird keinerlei Gewähr übernommen. Weitere Details zu rechtlichen Aspekten der Nutzung von www.wetternachhersage.de / www.weatherretrospect.com entnehmen Sie bitte dem <a href="https://www.uni-saarland.de/footer/dialog/impressum.html" target="_blank">Impressum</a>.
        </v-card-text>
        <v-card-text v-else class="text-xs-left">
          www.wetternachhersage.de / www.weatherretrospect.com is a project of the <a href="https://www.uni-saarland.de/en/lehrstuhl/frey/start.html" target="_blank">Chair of Automation and Energy Systems</a> at the <a href="https://www.uni-saarland.de/nc/en/home.html" target="_blank">Saarland University</a> that demonstrates the possibility to make use of publicly accessible weather data. The data used is provided by <a href="https://www.dwd.de" target="_blank">Germany's National Meteorological Service, Deutscher Wetterdienst (DWD)</a> via the download portal <a ref="https://www.dwd.de/DE/leistungen/opendata/opendata.html" target="_blank">Open Data</a>. No guarantees regarding the correctness of the data, their representation and/or topicality can be given. For further details on legal aspects of the use of www.wetternachhersage.de / www.weatherretrospect.com please refer to the <a href="https://www.uni-saarland.de/footer/dialog/impressum.html" target="_blank">imprint</a>.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="show = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-dialog>
</template>

<script>
export default {
  name: 'IntroDialog',
  data () {
    return {
      show: true
    }
  },
  props: {
    language: {
      type: String,
      default () {
        return 'en_US'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list {
  padding: 30px;
}
</style>
