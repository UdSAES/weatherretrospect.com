# weatherretrospect.com
`weatherretrospect.com` is part of a case study for using a microservice architecture to collect, store, analyze and visualize weather data provided by [Germany's National Meteorological Service, Deutscher Wetterdienst (DWD)](https://www.dwd.de/EN/Home/home_node.html).

In the case study `weatherretrospect.com` implements the web-based user interface to visualize weather data, which includes actual observed weather data and weather forecasts. One of the interesting features is that `weatherretrospect.com` allows for comparing weather data observed in the past with forecasts that were supposed to predict the observed weather data. Dependending on the weather station one can see that forecasts are often very good, whereas for other weather stations, due to geographical particularities, forecasts are way off.

A running instance of `weatherretrospect.com` is available at [http://www.weatherretrospect.com](http://www.weatherretrospect.com) (English) and [http://www.wetternachhersage.de](http://www.wetternachhersage.de) (German).

`weatherretrospect.com` is being developed and maintained by the [Chair of Automation and Energy Systems](https://www.uni-saarland.de/en/lehrstuhl/frey/start.html) at the [Saarland University](https://www.uni-saarland.de/nc/en/home.html).

## LICENSE
`weatherretrospect.com` is released under the [ISC license](./LICENSE).

## Setup
The easiest way to set up weatherretrospect.com for testing purposes (**not for production!!!**) is as follows.

Clone the repository from github with the git command:
```
$ git clone https://github.com/UdSAES/weatherretrospect.com.git
```

Then change to the directory of the cloned repository:
```
$ cd ./weatherretrospect.com
```

The ui can be started with the development web server of `webpack` which is included in the repository:
```
$ npm run dev
```

Now the application will start a web server which listens on port `12346`. Assuming you want to test `weatherretrospect.com` on your local machine, enter the following URL in your browser:

```
http://127.0.0.1:12346
```

If everything is fine, you should see a user interface like this:

![Screen shot](https://github.com/UdSAES/weatherretrospect.com/blob/master/static/screenshot.png?raw=true)

In order to change the listening port of the web server, the `port` attribute of the `dev` object in the file `./config/index.js` needs to be changed.

With the standard settings, the weather data is pulled from `https://weather.designetz.saarland`, which is a microservice run by the [Chair of Automation and Energy Systems](https://www.uni-saarland.de/en/lehrstuhl/frey/start.html) at the [Saarland University](https://www.uni-saarland.de/nc/en/home.html). The microservice is a running instance of [dwd_forecast_service](https://github.com/UdSAES/dwd_forecast_service). If you want to pull the data from your own instance of `dwd_forecast_service` you can set the environment variable `DWD_DATA_API_ORIGIN` before starting the web server:

```
$ DWD_DATA_API_ORIGIN=https://your-own-server-address-for-weather-data.com:12345 npm run dev
```

