import React, { useEffect } from "react";
import { View, Image, Text, Pressable } from "react-native";
import styles from "./styles";

import Ionicons from "react-native-vector-icons/Ionicons";

const ITaxiTypeRow = (props) => {
  const { type, onPress, isSelected, hours, minutes, km } = props;
  const getImage = () => {
    if (type.type === "ITaxiX") {
      return require(`../../assets/images/UberX.png`);
    }
    if (type.type === "Confort") {
      return require(`../../assets/images/Mercedes.png`);
    }
    if (type.type === "ITaxiXL") {
      return require(`../../assets/images/UberXL.png`);
    }
  };

  // var hours = new Date().getHours();
  // var min = new Date().getMinutes();

  if (props.km == null) {
    console.log("props null");
  } else {
    var hoursProps = props?.hours;
    var minutesProps = props?.minutes;
    var kmProps = props?.km.toString().substr(0, 5);
    var price = (props?.km * 3.49).toString().substr(0, 5);

    if (type.type == "Confort") {
      price = (props?.km * 4.59).toString().substr(0, 5);
    }
    if (type.type == "ITaxiXL") {
      price = (props?.km * 2.79).toString().substr(0, 5);
    }
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: isSelected ? "#efefef" : "white" },
      ]}
    >
      <Image style={styles.image} source={getImage()} />
      <View style={styles.middleContainer}>
        <Text style={styles.type}>
          {type.type} <Ionicons name={"person"} size={16} />
          {type.nrPers}
        </Text>

        <Text style={styles.time}>
          La destinatie in {hoursProps} ore si {minutesProps} minute.
        </Text>
        <Text style={styles.time}>Distanta {kmProps} km </Text>
      </View>

      <View style={styles.rightContainer}>
        <Ionicons name={"pricetag"} size={18} color={"#47d742"} />
        <Text style={styles.price}> {price} LEI </Text>
      </View>
    </Pressable>
  );
};

export default ITaxiTypeRow;
