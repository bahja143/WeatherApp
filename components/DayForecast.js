import { View, Text, StyleSheet, Image } from "react-native";

import colors from "../config/colors.json";

export default function DayForecast({ item, image }) {
  return (
    <View style={styles.dayCont}>
      <Text style={styles.daySubt}> {item}</Text>
      <Image style={styles.dayImage} source={image} />
      <Text style={styles.dayTemp}>23</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  daySubt: {
    fontWeight: "400",
  },
  dayTemp: {
    fontSize: 18,
    fontWeight: "700",
  },
  dayCont: {
    borderRadius: 7.5,
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: "center",
    backgroundColor: colors.lighter,
  },
  dayImage: {
    width: 75,
    height: 75,
  },
});
