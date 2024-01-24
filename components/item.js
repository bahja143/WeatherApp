import { View, Text, StyleSheet } from "react-native";

import colors from "../config/colors.json";

export default function item({ amount, title, Icon }) {
  return (
    <View style={styles.item}>
      {Icon}
      <View style={styles.itemTextCont}>
        <Text style={styles.itemText}>{title}</Text>
        <Text style={styles.itemText}>{amount && 0} </Text>
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
    marginBottom: 2.5,
    fontWeight: "500",
    color: colors.black,
  },
  item: {
    width: "45%",
    elevation: 3,
    borderRadius: 5,
    paddingVertical: 10,
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    backgroundColor: colors.secondary,
  },
});
