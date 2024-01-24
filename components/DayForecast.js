import { View, Text, StyleSheet, Image } from "react-native";

import colors from "../config/colors.json";

export default function DayForecast({ title, date, uri }) {
  return (
    <View style={styles.dayCont}>
      <Text style={styles.daySubt}>{date}</Text>
      <Image style={styles.dayImage} source={{ uri }} />
      <Text style={styles.dayTemp}>{title ? title : 0}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  daySubt: {
    fontWeight: "500",
    color: colors.medium,
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
