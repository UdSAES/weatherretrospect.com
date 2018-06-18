// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import _ from 'lodash'
import superagent from 'superagent'
import moment from 'moment-timezone'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueI18n from 'vue-i18n'

const messages = {
  en_US: {
    language: 'Language',
    weather_station: 'Weather station',
    location: 'Location',
    above_sea_level: 'above sea level',
    timezone_gmtp2: 'Timezone GMT+2',
    current_weather_conditions: 'Current weather conditions',
    time_of_acquisition: 'Time of acquisition',
    air_temperature: 'Air temperature',
    air_pressure: 'Air pressure',
    relative_humidity: 'Relative humidity',
    current_forecast_data: 'Current forecast data',
    weather_retrospect: 'Weather retrospect',
    share_start_time: 'Share start time across diagrams',
    share_voi: 'Share value of interest across diagrams',
    add_new_diagram: 'Add new diagram',
    yes: 'yes',
    no: 'no',
    start_date: 'Start date',
    start_time: 'Start time',
    value_of_interest: 'Value of interest',
    imprint: 'Imprint',
    clock_empty: '',
    show_forecasts: 'Show forecasts'
  },
  de_DE: {
    language: 'Sprache',
    weather_station: 'Wetterstation',
    location: 'Standort',
    above_sea_level: 'über Meereshöhe',
    timezone_gmtp2: 'Zeitzone GMT+2',
    current_weather_conditions: 'Aktuelle Wetterbedingungen',
    time_of_acquisition: 'Zeitpunkt der Erfassung',
    air_temperature: 'Lufttemperatur',
    air_pressure: 'Luftdruck',
    relative_humidity: 'Relative Luftfeuchtigkeit',
    current_forecast_data: 'Aktuelle Vorhersagedaten',
    weather_retrospect: 'Wetternachhersage',
    share_start_time: 'Kopplung des Startzeitpunkts der Diagramme',
    share_voi: 'Kopplung der Größe der Diagramme',
    add_new_diagram: 'Neues Diagramm hinzufügen',
    yes: 'ja',
    no: 'nein',
    start_date: 'Startdatum',
    start_time: 'Startzeit',
    value_of_interest: 'Größe',
    imprint: 'Impressum',
    clock_empty: 'Uhr',
    show_forecasts: 'Vorhersagen anzeigen'
  }
}

Object.defineProperty(Vue.prototype, '$_', {
  value: _
})

Object.defineProperty(Vue.prototype, '$superagent', {
  value: superagent
})

Object.defineProperty(Vue.prototype, '$moment', {
  value: moment
})

Vue.use(VueI18n)
Vue.use(Vuetify)

// create global filter
Vue.filter('getTextForCurrentLang', function (value) {
  return i18n.t(value)
})

const i18n = new VueI18n({
  locale: 'de_DE',
  messages: messages
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  i18n
})
