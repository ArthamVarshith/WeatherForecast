import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity,Animated } from 'react-native';

const Welcome = ({navigation}) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000, // Animation duration in milliseconds
      useNativeDriver: true,
    }).start();
  }, [animation]);

  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 5],
          outputRange: [0, 0], // Move text up by 50 units
        }),
      },
    ],
  };

  return (
    <View style={{backgroundColor: '#0f0f10',flex: 1}}>
      <Animated.Text style={[animatedStyle, { fontSize: 35,color:'#ff8262',marginTop: 300,alignSelf: 'center',fontFamily: 'RethinkSans'}]}>
        Weather Forecast
      </Animated.Text>
      <View>
        <Image source={require('../assets/cloudy.png')} style={{ width: 90, height: 90,marginTop: 20,alignSelf: 'center'}} />
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('Search')}>
        <Text style={{color: '#767b7f',alignSelf: 'center',position: 'absolute',fontFamily: 'RedHatText',marginTop: 300}}>
        Touch to start
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;
