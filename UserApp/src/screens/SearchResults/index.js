import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Alert,
  Button,
  SafeAreaView,
  Pressable
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
const GOOGLE_MAPS_APIKEY = "test";

const SearchResult = (props) => {
  const typeState = useState({});
  const priceState = useState({});
  const [time, setTime] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [km, setKm] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const [havePaymentType, setPaymentType] = useState(false);


  const { originPlace, destinationPlace, stopPlace, destinatie, hasPromotion } = route.params;

  let originName;
  if (originPlace?.data?.description == 'Job' || originPlace?.data?.description == 'Acasă') {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      originPlace?.data?.geometry?.location?.lat +
      ',' +
      originPlace?.data?.geometry?.location?.lng +
      '&key=' +
      GOOGLE_MAPS_APIKEY,
    )
      .then(response => response.json())
      .then(responseJson => {
        const responseAdd = responseJson.results.map(
          address => address.formatted_address,
        );
        originName = responseAdd[3];
      });
  }
  else {
    originName = originPlace?.data?.description;
  }
  let stopName = stopPlace ? stopPlace?.data?.description : null;

  const onSubmit = async () => {
    const [type] = typeState;
    const [pret] = priceState;

    if (!type && !priceState) {
      return;
    }
    if (havePaymentType === false || havePaymentType === null) {
      Alert.alert('Alege o metoda de plata', '', [
        {
          text: 'Închide',
        }
      ]);
    }

    else if (havePaymentType === true) {
      try {

        const userInfo = await Auth.currentAuthenticatedUser();

        const date = new Date();

        const input = {
          createdAt: date.toISOString(),
          type,
          originLatitude: originPlace?.details.geometry.location.lat,
          originLongitude: originPlace?.details.geometry.location.lng,

          originName: originName,
          destinationName: destinatie,
          stopName: stopName,

          destLatitude: destinationPlace?.details?.geometry?.location?.lat || destinationPlace?.latitude,
          destLongitude: destinationPlace?.details?.geometry?.location?.lng || destinationPlace?.longitude,

          stopLatitude: stopPlace
            ? stopPlace?.details.geometry.location.lat
            : destinationPlace?.details?.geometry?.location?.lat || destinationPlace?.latitude,
          stopLongitude: stopPlace
            ? stopPlace?.details.geometry.location.lng
            : destinationPlace?.details?.geometry?.location?.lng || destinationPlace?.longitude,

          duration: time,

          userId: userInfo.attributes.sub,
          carId: "1",
          status: "Noua",
          pret: pret,
          paymentMethod: paymentMethod,
          hasPromotion: hasPromotion
        };

        const response = await API.graphql(
          graphqlOperation(createOrder, {
            input: input,
          })
        );
        if (paymentMethod === "Card") {
          navigation.navigate("PaymentScreen", { pret: pret, id: response.data.createOrder.id, emailPayment: userInfo.attributes.email });
        }
        else {
          navigation.navigate("OrderPage", { id: response.data.createOrder.id });
        }

      } catch (error) {
        console.error(error);
      }
    }
  };

  AsyncStorage.setItem("destination", destinatie || destinationPlace?.data.description);

  // const getValue = () => {
  //   AsyncStorage.getItem("destination").then((value) => {
  //     console.log("from AsyncStorage", value);
  //   });
  //   console.log("from AsyncStorage", destinatie);
  // };

  const timeConvert = (n) => {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    setHours(rhours);
    setMinutes(rminutes);
  };

  const setPayment = (payment) => {
    setPaymentMethod(payment)
    setPaymentType(true);
  }

  useEffect(() => {
    timeConvert(time);
    // getValue();
  });


  const goToPromotii = () => {
    navigation.navigate("Promoții", { originPlace, destinationPlace, stopPlace, destinatie })
  }

  const goToDestinationSearch = () => {
    const region = "";
    const destinatie = "";
    navigation.navigate("DestinationSearch", { region, destinatie });
  }


  return (
    <View style={styles.container}>
      <View style={{ height: Dimensions.get("window").height - 550 }}>
        <RouteMap
          origin={originPlace}
          destination={destinationPlace}
          stop={stopPlace}
          passTime={(time) => setTime(time)}
          passKm={(km) => setKm(km)}
        />
      </View>
      <Pressable onPress={() => goToDestinationSearch()} style={styles.backButton}>
        <AntDesign name={'back'} size={30} color={'#45a8f2'} />
      </Pressable>
      <Pressable onPress={() => goToPromotii()} style={styles.promotiiButton}>
        <Entypo name={'price-tag'} size={35} color={'#45a8f2'} />
      </Pressable>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.leftButton}>
          <AntDesign
            name={"creditcard"}
            size={23}
            color={"#45a8f2"}
            style={{ top: 7 }}
          />
          <Button title="Card" onPress={() => setPayment("Card")}>
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
            onPress={() => setPayment("Numerar")}
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
          hasPromotion={hasPromotion}
        />
      </View>
    </View>
  );
};

export default SearchResult;
