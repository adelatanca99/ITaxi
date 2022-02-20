import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, Alert, TouchableOpacity } from "react-native";
import styles from "./styles";
import OrderMap from "../../components/OrderMap";
import { API, graphqlOperation } from "aws-amplify";
import { getOrder, getCar, getUser } from "../../graphql/queries";
import { onOrderUpdated } from "./subscriptions";
import { onCarUpdated } from "./subscriptions";
import UserAvatar from 'react-native-user-avatar';

import { useRoute } from "@react-navigation/native";

const OrderScreen = (props) => {
  const [car, setCar] = useState(null);
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const route = useRoute();
  console.log(route.params.id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await API.graphql(
          graphqlOperation(getUser, { id: order.carId })
        );
        setUser(userData.data.getUser);
      } catch (e) { }
    };
    fetchUser();
  }, []);

  // Fetch order on initial render
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await API.graphql(
          graphqlOperation(getOrder, { id: route.params.id })
        );

        setOrder(orderData.data.getOrder);
        console.log(order, "is order");
      } catch (e) { }
    };
    fetchOrder();
  }, []);

  // Subscribe to order updates
  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onOrderUpdated, { id: route.params.id })
    ).subscribe({
      next: ({ value }) => setOrder(value.data.onOrderUpdated),
      error: (error) => console.warn(error),
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Car data when order is updated
  useEffect(() => {
    if (!order?.carId || order.carId === "1") {
      return;
    }

    const fetchCar = async () => {
      try {
        const carData = await API.graphql(
          graphqlOperation(getCar, { id: order.carId })
        );
        setCar(carData.data.getCar);
      } catch (e) { }
    };
    fetchCar();
  }, [order]);

  // useEffect(() => {
  //   setPhoneNumber(user?.phoneNumber.slice(2, 12));
  // }, []);

  // let phoneNumber = user?.phoneNumber;
  // phoneNumber = phoneNumber?.slice(2, 12);

  // Subscribe to car updates
  useEffect(() => {
    if (!order?.carId || order.carId === "1") {
      return;
    }
    const subscription = API.graphql(
      graphqlOperation(onCarUpdated, { id: order.carId })
    ).subscribe({
      next: ({ value }) => setCar(value.data.onCarUpdated),
      error: (error) => console.warn(error),
    });
    return () => subscription.unsubscribe();
  }, [order]);

  return (
    <View>
      <View style={{ height: Dimensions.get("window").height - 580 }}>
        <OrderMap car={car} />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Rezumat</Text>
        <UserAvatar size={55} style={{ width: "30%", left: 145, height: 80 }} name={"Ade"} />
        <View style={styles.line}>
          <Text style={styles.comanda}>Comandă </Text>
          <Text style={styles.comandaData}>{order?.status} </Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.comanda}>Număr mașină </Text>
          <Text style={styles.comandaData}>{car?.carNumber} </Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.comanda}>Tipul </Text>
          <Text style={styles.comandaData}> {car?.type} </Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.comanda}>Cursă cu </Text>
          <Text style={styles.comandaData}> {car?.username} </Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.comanda}>Telefon</Text>
          <Text style={styles.comandaData}>
            {user?.phoneNumber.slice(2, 12)}
          </Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.comanda}>Preț</Text>
          <Text style={styles.comandaData}>{order?.pret} LEI</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderScreen;
