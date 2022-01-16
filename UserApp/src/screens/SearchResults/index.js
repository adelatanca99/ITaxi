import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  Alert,
  Button,
  SafeAreaView,
} from "react-native";
import styles from "./styles";
import ITaxiTypes from "../../components/ITaxiTypes";
import RouteMap from "../../components/RouteMap";
import Entypo from "react-native-vector-icons/Entypo";
import { useRoute, useNavigation } from "@react-navigation/native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createOrder } from "../../graphql/mutations";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchResult = (props) => {
  const typeState = useState({});
  const priceState = useState({});
  const [time, setTime] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [km, setKm] = useState(null);

  const route = useRoute();
  const navigation = useNavigation();

  console.log(route.params);

  const { originPlace, destinationPlace, stopPlace } = route.params;

  const onSubmit = async () => {
    const [type] = typeState;
    const [pret] = priceState;
    if (!type && !priceState) {
      return;
    }

    try {
      const userInfo = await Auth.currentAuthenticatedUser();

      const date = new Date();

      const input = {
        createdAt: date.toISOString(),
        type,
        originLatitude: originPlace.details.geometry.location.lat,
        originLongitude: originPlace.details.geometry.location.lng,

        destLatitude: destinationPlace.details.geometry.location.lat,
        destLongitude: destinationPlace.details.geometry.location.lng,

        // POATE NULL in loc de destinationPlace.details.geometry.location.lat

        stopLatitude: stopPlace
          ? stopPlace.details.geometry.location.lat
          : destinationPlace.details.geometry.location.lat,
        stopLongitude: stopPlace
          ? stopPlace.details.geometry.location.lng
          : destinationPlace.details.geometry.location.lng,

        userId: userInfo.attributes.sub,
        carId: "1",
        status: "Noua",
        pret: pret,
      };

      const response = await API.graphql(
        graphqlOperation(createOrder, {
          input: input,
        })
      );
      navigation.navigate("OrderPage", { id: response.data.createOrder.id });
    } catch (error) {
      console.error(error);
    }
  };

  AsyncStorage.setItem("destination", destinationPlace?.data.description);

  const getValue = () => {
    AsyncStorage.getItem("destination").then((value) => {
      console.log("from AsyncStorage", value);
    });
  };

  const timeConvert = (n) => {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    setHours(rhours);
    setMinutes(rminutes);
  };

  useEffect(() => {
    console.log(timeConvert(time));
  });

  return (
    <View style={{ display: "flex", justifyContent: "space-between" }}>
      <View style={{ height: Dimensions.get("window").height - 550 }}>
        <RouteMap
          origin={originPlace}
          destination={destinationPlace}
          stop={stopPlace}
          passTime={(time) => setTime(time)}
          passKm={(km) => setKm(km)}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.leftButton}>
          <AntDesign
            name={"creditcard"}
            size={23}
            color={"#45a8f2"}
            style={{ top: 7 }}
          />
          <Button title="Card" onPress={() => console.warn("Card")}>
            Card
          </Button>
        </View>
        <View style={styles.rightButton}>
          <Ionicons
            name={"ios-cash-outline"}
            size={23}
            color={"#45a8f2"}
            style={{ top: 7 }}
          />
          <Button
            title="Numerar"
            onPress={() => console.warn("Numerar")}
          ></Button>
        </View>
      </View>
      <View style={{ height: 400 }}>
        <ITaxiTypes
          typeState={typeState}
          priceState={priceState}
          onSubmit={onSubmit}
          hours={hours}
          minutes={minutes}
          km={km}
        />
      </View>
    </View>
  );
};

export default SearchResult;
