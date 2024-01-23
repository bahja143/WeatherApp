import { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  Platform,
  StyleSheet,
} from "react-native";
import Constant from "expo-constants";
import * as Location from "expo-location";
import axios from "axios";

import colors from "../config/colors.json";
import Cloudy from "../assets/cloud.png";
import Sun from "../assets/sun.png";

import Item from "../components/item";
import DayForecast from "../components/DayForecast";

const apiKey = "8e9fb5fb3745851f91bb652faa9fc1ef";

export default function DashboardScreen() {
  const [days] = useState([
    new Date().toLocaleDateString(),
    new Date("2024-01-24").toLocaleDateString(),
    new Date("2024-01-25").toLocaleDateString(),
    new Date("2024-01-26").toLocaleDateString(),
  ]);
  const [coords, setCoords] = useState({ latitude: 0, longitude: 0 });
  const [data, setData] = useState({ weather: [] });

  const handleLoad = async (latitude, longitude) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );

    setData(response.data);
  };
  const handlePermission = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (granted) {
      const { coords } = await Location.getLastKnownPositionAsync();

      setCoords({ latitude: coords.latitude, longitude: coords.longitude });
      handleLoad(coords.latitude, coords.longitude);
    }
  };

  useEffect(() => {
    handlePermission();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Today in Jijiga, Somali Region</Text>
      <View style={styles.topContainer}>
        <View style={styles.subtCont}>
          <Text style={styles.temperature}>
            {Math.round(data?.main?.temp - 274.15)}
          </Text>
          <Text style={styles.subt}>{data?.weather[0]?.description}</Text>
        </View>
        <View style={styles.subtCont}>
          <Text> </Text>
          <Text style={styles.sept}>|</Text>
        </View>
        <View style={styles.subtCont}>
          <Image style={styles.image} source={Cloudy} />
          <Text style={styles.subt}>Day {new Date().getDay()}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.subBody}>
          <Item title="wind" item={data.wind} />
          <Item />
        </View>
        <View style={styles.subBody}>
          <Item />
          <Item />
        </View>

        <View style={styles.subBody}>
          <Item />
          <Item />
        </View>
      </View>

      <View style={styles.bottomCont}>
        <FlatList
          horizontal
          data={days}
          renderItem={({ item }) => <DayForecast item={item} image={Sun} />}
          ItemSeparatorComponent={() => <View style={styles.itemSept} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 7.5,
    paddingTop: Platform.OS === "android" ? Constant.statusBarHeight : 0,
  },
  bottomCont: {
    marginTop: 50,
  },
  itemSept: {
    width: 8,
    backgroundColor: colors.white,
  },
  subBody: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  body: {
    marginTop: 25,
  },
  sept: {
    color: colors.medium,
  },
  subtCont: {
    marginBottom: 10,
    alignItems: "center",
  },
  subt: {
    fontSize: 14.5,
    marginTop: 3,
    fontWeight: "500",
    color: colors.black,
  },
  temperature: {
    fontSize: 40,
    fontWeight: "700",
    color: colors.black,
  },
  topContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopColor: colors.light,
    borderBottomColor: colors.light,
    justifyContent: "space-between",
  },
  image: {
    width: 62.5,
    height: 52.5,
  },
  title: {
    fontSize: 19,
    marginTop: 25,
    marginBottom: 20,
    fontWeight: "500",
    color: colors.black,
  },
});
