import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";

const Forecast = ({ navigation,route}) => {
  const [weatherData, setWeatherData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [country, SetCountry] = useState("");
  const [cityName, setCityName] = useState("");
  const [DateOfMonth, SetDateOfMonth] = useState("");
  const [month, setMonth] = useState("");
  const [Year, setYear] = useState("");
  const [Day, setday] = useState("");
  const [pops, Setpops] = useState("");

  const weatherImages = {
    Twenty_percent: require("../assets/sun.png"),
    Fourt_percent: require("../assets/cloudy.png"),
    Seventy_percent: require("../assets/sunny.png"),
    Hundred_percent: require("../assets/rainy-day.png"),
  };

  const {searchValue}=route.params;

  const currentDate = new Date();

  useEffect(() => {
    const API_KEY = "6b316e8e1581556fce65aade783cb787";
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${API_KEY}`;
    const API_URL1 = `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=${API_KEY}`;

    const currentDay = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const currentDateOfMonth = currentDate.getDate();
    const currentMonth = currentDate.toLocaleDateString("en-US", {
      month: "long",
    });
    const currentYear = currentDate.getFullYear();

    // const day="";
    // const i=0;
    // while(currentDay.length!=i)
    // {
    //   if(currentDay.charAt(i)!=' ');
    //   {
    //     day=day+currentDay.charAt(i);
    //     i++;
    //   }
    //   if(currentDay.charAt(i)==' ')
    //   {
    //     break;
    //   }
    // }

    SetDateOfMonth(currentDateOfMonth);
    setMonth(currentMonth);
    setYear(currentYear);
    setday(currentDay);

    // const firstHourlyForecast = hourlyForecast[0].pop;
    // Setpops(firstHourlyForecast);

    if (hourlyForecast && hourlyForecast.length > 0) {
      const firstHourlyForecast = hourlyForecast[0];
      console.log(firstHourlyForecast.pop);
      console.log(firstHourlyForecast.visibility);
      Setpops(firstHourlyForecast.pop);
      if (
        firstHourlyForecast &&
        typeof firstHourlyForecast === "object" &&
        "pop" in firstHourlyForecast
      ) {
      } else {
        Setpops("Cannot find the Chance of Rain");
      }
    } else {
      Setpops("Cannot find the Chance of Rain");
    }

    axios
      .get(API_URL1)
      .then((response) => {
        setHourlyForecast(response.data.list);

        const dailyForecasts = {};
        response.data.list.forEach((forecast) => {
          const date = forecast.dt_txt.split(" ")[0]; // Extract date without time

          if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
          }
          dailyForecasts[date].push(forecast);
        });

        // Now 'dailyForecasts' contains weather data grouped by day
        console.log(dailyForecasts);
      })
      .catch((error) => {
        setErrorMsg("Error");
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
          setCityName("Unknown");
        }
      })
      .catch((error) => {
        setErrorMsg("Error fetching weather data");
        console.error(error);
      });
  }, []);


  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [10, 15, 9, 22, 21, 20],
        color: (opacity = 1) => `rgba(255, 130, 98, ${opacity})`, // Customize line color
        strokeWidth: 2, // Customize line width
      },
    ],
  };

  const getImageSource = () => {
    if (pops < 30)
      return require("../assets/sun.png"); 
    else if (pops < 50)
      return require("../assets/cloudy.png"); 
    else if (pops < 80)
      return require("../assets/sunny.png"); 
    else if (pops <= 100) return require("../assets/rainy-day.png");
    else return require("../assets/question-mark.png"); 
  };

  let weatherContent = <Text>Loading...</Text>;
  if (errorMsg) {
    weatherContent = <Text>{errorMsg}</Text>;
  } else if (weatherData) {
    const { main, weather, wind } = weatherData;
    const temperature = main.temp;
    const weatherDescription = weather[0].description;
    const iconCode = weather[0].icon;
    const feels = main.feels_like;
    const min = main.temp_min;
    const max = main.temp_max;
    const humudities = main.humidity;
    const windspeed = wind.speed;
    const pressure = main.pressure;

    const dewpoint = temperature - 273.15 - (100 - humudities) / 5;

    weatherContent = (
      <View>
        <Text style={styles.temperature}>
          {Math.round(temperature - 273.15)}°C
        </Text>
        <Text style={styles.description}>{weatherDescription}</Text>
        <Text style={styles.pop}>
          Chance of Rain : {((pops * 100)).toFixed(2)}%
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.sunrises}>Sunrise {sunrise} |</Text>
          <Text style={styles.sunsets}>Sunset {sunset}</Text>
        </View>
        <View style={styles.totalBox}>
          <Text style={styles.wind}>Wind</Text>
          <Text style={styles.windspeed}>{windspeed} km/h</Text>

          <Text style={styles.humidity}>Humidity</Text>
          <Text style={styles.humudities}>{humudities}%</Text>
        </View>

        <View style={styles.totalBox2}>
          <Text style={styles.pressure}>Pressure</Text>
          <Text style={styles.pressures}>{pressure}hpa</Text>

          <Text style={styles.dewpoint}>Dew Point</Text>
          <Text style={styles.dewpoints}>{dewpoint.toFixed(2)}°</Text>
        </View>
        <LineChart
          data={data}
          width={Dimensions.get("window").width - 40}
          height={240}
          yAxisSuffix="°C"
          chartConfig={{
            backgroundGradientFrom: "#0f0f10",
            backgroundGradientTo: "#0f0f10",
            decimalPlaces: 0, // Number of decimal places for labels
            color: (opacity = 1) => `rgba(255, 130, 98, ${opacity})`, // Customize label color
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginTop: 220,
            position: "absolute",
            alignSelf: "center",
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#0f0f10", flex: 1 }}>
      <Image source={require("../assets/UpperPart.png")} />
      <TouchableOpacity onPress={() => navigation.navigate("Home",{searchValue})}>
        <Image
          source={require("../assets/icons8-arrow-50.png")}
          style={styles.arrow}
        />
      </TouchableOpacity>
      <Text style={styles.overallForecast}>Overall Forecast</Text>
      <Text style={styles.location}>
        {cityName},{country}
      </Text>
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          marginTop: 135,
          marginLeft: 10,
        }}
      >
        <Text style={styles.month}>{month} </Text>
        <Text style={styles.day}>{DateOfMonth},</Text>
        <Text style={styles.Year}>{Year}</Text>
      </View>
      <Text style={styles.Date}>{Day.substring(-1,9)}</Text>
      <View>{weatherContent}</View>
      <Text style={styles.todayDetails}>Today's Details</Text>
      <Text style={{ color: "#767b7f", marginTop: 7, marginLeft: 10 }}>
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - -{" "}
      </Text>
      <Image source={getImageSource()} style={styles.image} />
      <Text style={styles.liveGraph}>Live Graph</Text>
    </SafeAreaView>
  );
};

export default Forecast;

const styles = StyleSheet.create({
  arrow: {
    position: "absolute",
    marginTop: -290,
    width: 36,
    height: 40,
    marginLeft: 15,
  },
  overallForecast: {
    position: "absolute",
    marginTop: 42,
    alignSelf: "center",
    fontFamily: "Afacad",
    fontSize: 20,
  },
  location: {
    position: "absolute",
    fontFamily: "Cabin",
    marginTop: 100,
    fontSize: 25,
    marginLeft: 10,
  },
  month: {
    fontFamily: "RethinkSans",
    fontSize: 17,
  },
  day: {
    fontFamily: "RethinkSans",
    fontSize: 17,
  },
  Year: {
    fontFamily: "RethinkSans",
    fontSize: 17,
  },
  Date: {
    position: "absolute",
    fontFamily: "RethinkSans",
    fontSize: 17,
    marginTop: 158,
    marginLeft: 10,
  },
  temperature: {
    position: "absolute",
    color: "#0f0f10",
    marginTop: -140,
    fontFamily: "Cabin",
    fontSize: 35,
    marginLeft: 10,
  },
  description: {
    position: "absolute",
    color: "#0f0f10",
    marginTop: -97,
    marginLeft: 10,
    fontSize: 19,
    fontFamily: "RethinkSans",
  },
  pop: {
    color: "#0f0f10",
    position: "absolute",
    marginTop: -72,
    fontFamily: "RethinkSans",
    marginLeft: 10,
    fontSize: 16,
  },
  sunrises: {
    position: "absolute",
    color: "#0f0f10",
    fontFamily: "Cabin",
    marginLeft: 10,
    marginTop: -45,
    fontSize: 17,
  },
  sunsets: {
    position: "absolute",
    color: "#0f0f10",
    fontFamily: "Cabin",
    marginLeft: 210,
    marginTop: -45,
    fontSize: 17,
  },
  todayDetails: {
    color: "white",
    fontFamily: "Cabin",
    fontSize: 23,
    marginLeft: 10,
    marginTop: 17,
  },
  totalBox: {
    position: "absolute",
    flexDirection: "row",
    marginTop: 5,
  },
  wind: {
    color: "white",
    position: "absolute",
    marginTop: 80,
    marginLeft: 10,
    fontFamily: "RedHatText",
    fontSize: 18,
  },
  windspeed: {
    position: "absolute",
    marginLeft: 90,
    color: "#ff8262",
    marginTop: 80,
    fontFamily: "RedHatText",
    fontSize: 18,
  },
  humidity: {
    position: "absolute",
    color: "white",
    marginTop: 80,
    fontFamily: "RedHatText",
    fontSize: 18,
    marginLeft: 200,
  },
  humudities: {
    position: "absolute",
    color: "#ff8262",
    marginTop: 81,
    fontFamily: "RedHatText",
    fontSize: 18,
    marginLeft: 310,
  },
  totalBox2: {
    position: "absolute",
    flexDirection: "row",
  },
  pressure: {
    position: "absolute",
    color: "white",
    marginTop: 130,
    marginLeft: 10,
    fontFamily: "RedHatText",
    fontSize: 18,
  },
  pressures: {
    position: "absolute",
    marginLeft: 100,
    color: "#ff8262",
    marginTop: 130,
    fontFamily: "RedHatText",
    fontSize: 18,
  },
  dewpoint: {
    position: "absolute",
    color: "white",
    marginTop: 130,
    fontFamily: "RedHatText",
    fontSize: 18,
    marginLeft: 200,
  },
  dewpoints: {
    position: "absolute",
    marginLeft: 300,
    color: "#ff8262",
    marginTop: 130,
    fontFamily: "RedHatText",
    fontSize: 18,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    position: "absolute",
    marginLeft: 200,
    marginTop: 110,
    // Additional styling specific to each image
    // For example, for 'sunny' weather type:
    // borderColor: 'orange',
    // borderWidth: 2,
    // borderRadius: 10,
  },
  liveGraph: {
    position: 'absolute',
    color: 'white',
    marginTop: 493,
    fontFamily: 'Cabin',
    fontSize: 22,
    marginLeft: 10
  }
});
