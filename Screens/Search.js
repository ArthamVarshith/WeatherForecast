import React, { useEffect, useState } from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image
} from "react-native";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";

const UserLocationComponent = ({navigation}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue,Setsearchvalue]=useState(" ");
  const [lat,setlat]=useState("");
  const [lon,setlon]=useState("");


  const handlePress = () => {
    setIsFocused(!isFocused);
  };

  const handleSearch=()=>{
    navigation.navigate('Home',{searchValue})
  }

  const getReverseGeocoding = async (latitude, longitude) => {
    const apiKey = "8f524aa292e842628b8d440daf59b835"; // Replace with your OpenCage API key
    const geocodingApiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(geocodingApiUrl);
      const data = await response.json();

      if (data.results.length > 0) {
        const address = data.results[0].formatted;
        const addressComponents = data.results[0].components;
        const city = addressComponents.city;
        const sym=data.symbol;
        setUserLocation(address);

         // Update state with the address
      } else {
        setUserLocation("Location information not found.");
      }
    } catch (error) {
      setUserLocation("Error fetching location.");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Location permission denied");
          setUserLocation("Location permission denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          enableHighAcurracy: true,
          timeout: 20000
        });
        const { latitude, longitude } = location.coords;
        getReverseGeocoding(latitude, longitude);

        setlat(latitude);
        setlon(longitude);

      } catch (error) {
        Alert.alert("Error fetching location");
        setUserLocation("Error fetching location");
      }
    };

    getUserLocation();
  }, []);


  //search valueeee

  console.log(searchValue);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
          <Text style={styles.text}>Know weather of any location</Text>
          <Text style={styles.text1}>
            Predict the future by weather forecast
          </Text>
          <Text style={styles.text2}>Know the future of five days.</Text>
          <View>
            <LottieView
              source={require("../assets/woman-taking-sunbath-on-beach.json")}
              style={styles.animation}
              autoPlay
              loop
            />
          </View>
          <View style={[styles.TextInput, isFocused?styles.focused : null]} 
          onTouchStart={handlePress} onTouchEnd={handlePress}>
            <TextInput placeholder="Enter your city" style={styles.input} onFocus={()=>setIsFocused(true)}
            onBlur={()=>setIsFocused(false)}
            onChangeText={(text)=>Setsearchvalue(text)}/>
          </View>
        
        <TouchableOpacity style={styles.arrow} onPress={handleSearch}>
          <Image source={require('../assets/right-arrow.png')} style={styles.Image}/>
        </TouchableOpacity>
        {/* <Text style={{color: 'white'}}>{lat}</Text>
        <Text style={{color: 'white'}}>{lon}</Text> */}
        <View style={styles.border}>
        <Text style={styles.loc}>Your Location :</Text>
        <View style={{}}>
      {userLocation ? (
        <Text style={{color: 'white',fontSize:16,fontFamily:'RedHatText',padding:10}}>
          {userLocation}.
        </Text>
      ) : (
        <Text style={{color: 'white',fontSize:16,padding: 10}}>Loading location...</Text>
      )}
      </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserLocationComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0f0f10",
    flex: 1,
  },
  text: {
    color: "#ff8262",
    fontFamily: "RethinkSans",
    fontSize: 23,
    alignSelf: "center",
    marginTop: 60,
  },
  text1: {
    marginTop: 10,
    alignSelf: "center",
    color: "#ff8262",
    fontFamily: "RethinkSans",
    fontSize: 20,
  },
  text2: {
    alignSelf: "center",
    color: "#ff8262",
    fontFamily: "RethinkSans",
    fontSize: 20,
  },
  animation: {
    width: 400,
    height: 400,
    alignSelf: "center",
    marginTop: -10,
  },
  TextInput: {
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 20,
    paddingHorizontal: 60,
  },
  input: {
    marginVertical: 7,
    paddingHorizontal: 10,
    marginHorizontal: 10
  },
  focused: {
    borderColor: '#ff8262',
    borderWidth: 2
  },
  Image: {
    width: 35,
    height: 35,
    
  },
  arrow: {
    position: 'absolute',
    marginTop: 545,
    backgroundColor: '#ff8262',
    marginLeft: 320,
    borderRadius: 20
  },
  loc: {
    color: 'white',
    fontFamily: 'RedHatText',
    fontSize: 19,
    marginTop:10,
    marginLeft:10
  },
  border:{
    borderColor: '#767b7f',
    borderWidth:1,
    marginTop:50,
    alignSelf:'center',
    borderRadius:10,
  }
});
