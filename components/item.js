import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import colors from "../config/colors.json";

export default function item(title, item) {
  console.log(item);
  return (
    <View style={styles.item}>
      <Feather name="wind" size={24} color={colors.primary} />
      <View style={styles.itemTextCont}>
        <Text style={styles.itemText}>wind</Text>
        <Text style={styles.itemText}>0 Km/h</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemTextCont: {
    marginLeft: 10,
  },
  itemText: {
    fontSize: 15,

    fontWeight: "500",
    color: colors.black,
  },
  item: {
    width: "45%",
    borderRadius: 5,
    paddingVertical: 10,
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    backgroundColor: colors.secondary,
  },
});
