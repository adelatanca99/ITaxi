import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./styles";
import ITaxiTypeRow from "..//ITaxiTypeRow";
import typesData from "../../assets/data/types";

const ITaxiTypes = ({
  typeState,
  onSubmit,
  hours,
  minutes,
  km,
  priceState,
}) => {
  const [selectedType, setSelectedType] = typeState;

  const [selectedPrice, setSelectedPrice] = priceState;

  if (km == null) {
    console.log("props null");
  } else {
    var hoursProps = hours;
    var minutesProps = minutes;
    var kmProps = km.toString().substr(0, 4);
    var price = (km * 3.49).toString().substr(0, 5);

    if (typeState[0] == "Confort") {
      price = (km * 4.59).toString().substr(0, 5);
    }
    if (typeState[0] == "ITaxiXL") {
      price = (km * 2.79).toString().substr(0, 5);
    }
  }

  return (
    <View>
      {typesData.map((type, i) => (
        <ITaxiTypeRow
          type={type}
          key={type.id}
          hours={hours}
          minutes={minutes}
          km={km}
          isSelected={type.type === selectedType}
          onPress={() => {
            setSelectedType(type.type);
            setSelectedPrice(price);
          }}
        />
      ))}

      <Pressable
        onPress={onSubmit}
        style={{
          backgroundColor: "#45a8f2",
          padding: 10,
          margin: 10,
          borderRadius: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
          Confirmă ITaxi
        </Text>
      </Pressable>
    </View>
  );
};

export default ITaxiTypes;
