import { StyleSheet, Text, SafeAreaView,View} from "react-native";
import * as Font from "expo-font";
import React from "react";
import Routes from "./Routes/routes";
import { NavigationContainer } from "@react-navigation/native";

let customFonts = {
  RethinkSans: require("./assets/Fonts/static/RethinkSans-Regular.ttf"),
  Cabin: require("./assets/Fonts/static/Cabin-Bold.ttf"),
  Afacad: require("./assets/Fonts/static/Afacad-Bold.ttf"),
  RedHatText: require("./assets/Fonts/static/RedHatText-Regular.ttf"),
};

export default class App extends React.Component {
  state = {
    fontsLoaded: false,
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return null;
    }
    return (
      <View style={styles.container}>
        <NavigationContainer>
        <Routes/>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '0F0F10',
    flex: 1,
  },
});
