import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";

const WeatherForecast = ({navigation,route}) => {
  const [weatherData, setWeatherData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [country,SetCountry]=useState("");
  const [cityName, setCityName] = useState('');

  const {searchValue}=route.params;

  useEffect(() => {
    const API_KEY = "6b316e8e1581556fce65aade783cb787";
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${API_KEY}`;
    const API_URL1=`https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=${API_KEY}`


    axios
    .get(API_URL1)
    .then(response=>{
      setHourlyForecast(response.data.list);
    })
    .catch(error=>{
      setErrorMsg ("Error")
      console.error(error);
    });
    axios
      .get(API_URL)
      .then((response) => {

        setHourlyForecast(response.data.list);

        const { sys } = response.data;
        setSunrise(
          new Date(sys.sunrise * 1000).toLocaleTimeString().toUpperCase()
        );
        setSunset(
          new Date(sys.sunset * 1000).toLocaleTimeString().toUpperCase()
        );

        SetCountry(sys.country);
        setWeatherData(response.data);
        setHourlyForecast(response.data.list);

        if (response.data && response.data.name) {
          setCityName(response.data.name);
        } else {
          setCityName('Unknown');
        }


      })
      .catch((error) => {
        setErrorMsg("Error fetching weather data");
        console.error(error);
      });
  }, []);

  let weatherContent = <Text>Loading...</Text>;
  if (errorMsg) 
  {
    weatherContent = <Text>{errorMsg}</Text>;
  } 
  else if (weatherData) 
  {
    const { main, weather } = weatherData;
    const temperature = main.temp;
    const weatherDescription = weather[0].description;
    const iconCode = weather[0].icon;
    const feels = main.feels_like;
    const min = main.temp_min;
    const max=main.temp_max;
    const humudities=main.humidity;


    const iconURL = `http://openweathermap.org/img/wn/${iconCode}.png`;

    weatherContent = (
      <View>
        <View style={styles.content}>
          <Image
            source={{ uri: iconURL }}
            style={{ width: 120, height: 120 }}
          />
          <Text style={styles.temperature}>
            {Math.round(temperature - 273)}°
          </Text>
          <Text style={styles.celsius}>C</Text>
        </View>
        <Text style={styles.description}>{weatherDescription}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.sunrises}>Sunrise {sunrise}      |</Text>

          <Text style={styles.sunsets}>Sunset {sunset}</Text>
        </View>


    <Text style={{color: '#767b7f',marginTop: 90,marginLeft: 10}}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </Text>
    <View style={{flexDirection: 'row'}}>
      <Text style={styles.mins}>Min Temp : {Math.round(min-273.15)}°C</Text>
      <Text style={styles.maxs}>Max Temp : {Math.round(max-273.15)}°C</Text>
    </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'white',marginLeft: 20,fontFamily: 'RethinkSans',fontSize: 15,marginTop: 15}}>Feels Like :</Text>
          <Text style={styles.feelsLike}>  {Math.round(feels - 273.15)}°C</Text>
          <Text style={styles.humidity}>Humidity :  </Text>
          <Text style={styles.humudities}>{humudities}%</Text>
        </View>

        <Text style={{color: '#767b7f',marginTop: 15,marginLeft: 10}}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </Text>
        <Text style={styles.forecasts}>Hourly Forecast</Text>
        <ScrollView horizontal={true}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : hourlyForecast && hourlyForecast.length ? (
        <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 20, flexWrap: 'wrap'}}>
  {hourlyForecast.map((forecast, index) => {
    const weatherIcon = forecast.weather[0].icon; // Get the weather icon code
    const iconURL = `http://openweathermap.org/img/wn/${weatherIcon}.png`; // Construct the icon URL

    return (
      <View key={index} style={{ marginRight: 20,borderRadius: 20,borderColor: '#767b7f',borderWidth: 1,padding: 20}}>
        <Text style={styles.dates}>{new Date(forecast.dt_txt).toLocaleTimeString()}</Text>
        <Image source={{ uri: iconURL }} style={{ width: 70, height: 70}} />
        <Text style={styles.temp}>{Math.round(forecast.main.temp-273.15)}°C</Text>
        <Text style={styles.descriptions}>{forecast.weather[0].description}</Text>
      </View>
    );
  })}
</View>
      ) : (
        <Text style={{color: 'white'}}>No hourly forecast data available.</Text>
      )}
    </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Weather Forecast</Text>
      <View>{weatherContent}</View>
      <Text style={styles.location}>{cityName},{country}</Text>
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Forecast',{searchValue})}>
        <Text style={styles.texts}>Overall Forecast</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WeatherForecast;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0f0f10",
    flex: 1,
  },
  text: {
    color: "white",
    alignSelf: "center",
    marginTop: 40,
    fontFamily: "RethinkSans",
    fontSize: 18,
  },
  content: {
    alignSelf: "center",
    marginTop: 20,
    flexDirection: "row",
    marginRight: 30,
  },
  temperature: {
    color: "white",
    fontSize: 45,
    marginTop: 26,
    marginRight: 3,
  },
  celsius: {
    color: "#ff8262",
    fontSize: 25,
    marginTop: 30,
  },
  location: {
    position: "absolute",
    marginTop: 190,
    color: "white",
    fontSize: 18,
    alignSelf: "center",
    fontFamily: "RedHatText",
  },
  sunrises: {
    position: "absolute",
    color: "white",
    fontFamily: "RethinkSans",
    marginLeft: 20,
    marginTop: 60,
    fontSize: 15
  },
  sunsets: {
    position: "absolute",
    color: "white",
    fontFamily: "RethinkSans",
    marginLeft: 210,
    marginTop: 60,
    fontSize: 15
  },
  description: {
    color: "#ff8262",
    fontFamily: "RethinkSans",
    alignSelf: "center",
    position: "absolute",
    marginTop: 150,
    fontSize: 20,
  },
  feelsLike: {
    marginTop: 15.5 ,
    color: '#ff8262',
    fontFamily: "RethinkSans",
    fontSize: 15,
    marginRight: 90
  },
  mins: {
    color: 'white',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 75,
    fontFamily: 'RethinkSans',
    fontSize: 15
  },
  maxs: {
    color: 'white',
    marginTop: 10,
    marginLeft: 20,
    fontFamily: 'RethinkSans',
    fontSize: 15
  },
  humidity: {
    color: 'white',
    fontFamily: 'RethinkSans',
    marginTop: 15,
    fontSize: 15
  },
  humudities: {
    color: '#ff8262',
    fontFamily: 'RethinkSans',
    marginTop: 15.5,
    fontSize: 15
  },
  forecasts: {
    color: '#ff8262',
    marginTop: 25,
    fontFamily: 'Cabin',
    fontSize: 22,
    marginLeft: 20
  },
  dates: {
    flexDirection: 'row',
    color: '#ff8262',
    marginRight: 25,
    fontFamily: 'RethinkSans',
  },
  temp: {
    color: 'white',
    marginLeft: 20,
    fontFamily: 'RethinkSans',
    marginTop: 5
  },
  descriptions: {
    fontFamily: 'RedHatText',
    color: 'white',
    marginTop: 10,
    marginLeft: 5
  },
  button: {
    marginTop: 30,
    backgroundColor: '#ff8262',
    marginHorizontal: 80,
    borderRadius: 20
  },
  texts: {
    alignSelf: 'center',
    marginVertical: 12,
    fontFamily: 'RedHatText',
    fontSize: 18
  }
});
