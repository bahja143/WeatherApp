import { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  Keyboard,
  FlatList,
  Platform,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Constant from "expo-constants";
import Modal from "react-native-modal";
import * as Location from "expo-location";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";

import colors from "../config/colors.json";

import Item from "../components/item";
import DayForecast from "../components/DayForecast";

const apiKey = "8e9fb5fb3745851f91bb652faa9fc1ef";

export default function DashboardScreen() {
  const [city, setCity] = useState(null);
  const [error, setError] = useState(false);
  const [foreCast, setForeCast] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({ weather: [], wind: {}, main: {} });

  const handleLoad = async (latitude, longitude) => {
    try {
      setCity("");
      setError(false);
      setRefreshing(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      );
      setData(response.data);
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      setError(true);
    }
  };
  const handlePermission = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (granted) {
      const { coords } = await Location.getLastKnownPositionAsync();

      handleLoad(coords.latitude, coords.longitude);
      handleFiveDaysForeCast(coords.latitude, coords.longitude);
    }
  };
  const handleKelvinToCel = (kelvin) => {
    return Math.round(kelvin - 274.15);
  };
  const handleFiveDaysForeCast = async (latitude, longitude) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=5&appid=${apiKey}`
    );

    setForeCast(response.data);
  };
  const incrementDateByIndex = (date, index) => {
    const day = date.getDate();
    date.setDate(day + index);
    return date;
  };
  const getDateString = (date) => {
    const today = new Date();
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      // Format the date string
      const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return date.toDateString("en-US", options);
    }
  };
  const handleSearch = async () => {
    try {
      Keyboard.dismiss();
      setRefreshing(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      );

      setRefreshing(false);
      setData({ ...response.data });
    } catch (error) {
      setRefreshing(false);
      setError(true);
    }
  };
  const handleTryAgain = () => {
    setCity("");
    setError(false);
  };

  useEffect(() => {
    handlePermission();
  }, []);
  return (
    <>
      <Modal style={styles.modal} isVisible={error}>
        <View style={styles.modalError}>
          <Text style={styles.modalTitleError}>Error</Text>
          <Text style={styles.modalErrorText}>Something went wrong</Text>
          <TouchableOpacity onPress={handleTryAgain} style={styles.modalBtn}>
            <Text style={styles.modalBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <FlatList
        data={[1]}
        keyboardShouldPersistTaps="always"
        refreshing={refreshing}
        onRefresh={handlePermission}
        renderItem={() => (
          <View style={styles.container}>
            <View style={styles.searchCont}>
              <TextInput
                value={city}
                placeholder="Search City"
                style={styles.textInput}
                onChangeText={(text) => setCity(text)}
              />
              <TouchableOpacity onPress={handleSearch} style={styles.btn}>
                <Text style={styles.btnText}>Search</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>
              Weather Today in {city ? city : "Jijiga"}
            </Text>
            <View style={styles.topContainer}>
              <View style={styles.subtCont}>
                <Text style={styles.temperature}>
                  {data?.main?.temp ? handleKelvinToCel(data?.main?.temp) : 0}
                </Text>
                <Text style={styles.subt}>{data?.weather[0]?.description}</Text>
              </View>
              <View style={styles.subtCont}>
                <Text> </Text>
                <Text style={styles.sept}>|</Text>
              </View>
              <View style={styles.subtCont}>
                <Image
                  style={styles.image}
                  source={{
                    uri: `http://openweathermap.org/img/w/${data.weather[0]?.icon}.png`,
                  }}
                />
                <Text style={styles.subt}>Day {new Date().getDay()}</Text>
              </View>
            </View>

            <View style={styles.body}>
              <View style={styles.subBody}>
                <Item
                  title="Wind"
                  amount={data?.wind?.speed + " M/S"}
                  Icon={
                    <Feather name="wind" size={24} color={colors.primary} />
                  }
                />
                <Item
                  title="Humidity"
                  amount={data?.main?.humidity + "%"}
                  Icon={
                    <Ionicons name="water" size={24} color={colors.primary} />
                  }
                />
              </View>
              <View style={styles.subBody}>
                <Item
                  title="Pressure"
                  amount={data?.main?.pressure + " hPa"}
                  Icon={
                    <FontAwesome5
                      size={24}
                      color={colors.primary}
                      name="thermometer-quarter"
                    />
                  }
                />
                <Item
                  title="Sea Level"
                  amount={data?.main.sea_level + " hPa"}
                  Icon={
                    <FontAwesome5
                      name="water"
                      size={24}
                      color={colors.primary}
                    />
                  }
                />
              </View>
            </View>

            <View style={styles.bottomCont}>
              <FlatList
                horizontal
                data={foreCast.list}
                renderItem={({ item, index }) => (
                  <DayForecast
                    item={item}
                    title={handleKelvinToCel(data?.main?.temp)}
                    date={getDateString(
                      incrementDateByIndex(new Date(), index)
                    )}
                    uri={`http://openweathermap.org/img/w/${data.weather[0]?.icon}.png`}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.itemSept} />}
              />
            </View>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 7.5,
    paddingTop: Platform.OS === "android" ? Constant.statusBarHeight : 0,
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
  modalBtn: {
    elevation: 10,
    marginTop: 20,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.primary,
  },
  modalErrorText: {
    fontSize: 16,
    color: colors.medium,
  },
  modalTitleError: {
    fontSize: 20,
    marginBottom: 7.5,
    fontWeight: "700",
    color: colors.danger,
  },
  modalError: {
    height: 150,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  btnText: {
    fontSize: 17,
    fontWeight: "500",
    color: colors.white,
  },
  btn: {
    width: "25%",
    elevation: 2.5,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 10,
    borderBottomEndRadius: 10,
    backgroundColor: colors.primary,
  },
  searchCont: {
    marginTop: 10,
    flexDirection: "row",
  },
  textInput: {
    elevation: 2.5,
    fontSize: 18,
    width: "75%",
    fontWeight: "400",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: colors.lighter,
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
    width: 65,
    height: 65,
  },
  title: {
    fontSize: 20,
    marginTop: 25,
    marginBottom: 20,
    fontWeight: "500",
    color: colors.black,
  },
});
