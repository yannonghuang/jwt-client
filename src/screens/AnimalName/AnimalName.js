import React, { useState, useLayoutEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import loadingGif from "../../../assets/icons/loading.gif";

import MenuImage from "../../components/MenuImage/MenuImage";

import {AuthContext} from '../../context/AuthContext';
import {AxiosContext} from '../../context/AxiosContext';

const API_URL = "http://192.168.86.95:3000/api";

export default function AnimalName(props) {
  const [inputAnimal, setInputAnimal] = useState("");
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState("");

  const { navigation } = props;

  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);


  const onSubmit = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const response = await axiosContext.authAxios.post('/animal-name', 
      { animal: inputAnimal },      
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
      );

      setResult(response.data.result);
    } catch (e) {
      Alert.alert("Couldn't generate animal name: ", e.message);
    } finally {
      setLoading(false);
    }
  };

  const onTryAgain = () => {
    setResult("");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>Looking for hero animal names </Text>
        <Image
          source={loadingGif}
          style={styles.loading}
          resizeMode="contain"
        />
      </View>
    );
  }

  if (result) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Here are some great hero names
        </Text>
        <Text style={styles.result}>{result}</Text>
        <Pressable onPress={onTryAgain} style={styles.button}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }}>

          <Text style={styles.label}>Animal</Text>
          <TextInput
            placeholder="Animal"
            style={styles.input}
            value={inputAnimal}
            onChangeText={setInputAnimal}
          />

          <Pressable onPress={onSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Generate hero animal name</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    alignSelf: "center",
    marginVertical: 20,
    textAlign: "center",
  },
  result: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,

    //borderColor: "#353740;",
    borderWidth: 1,
    borderRadius: 4,

    padding: 16,
    marginTop: 6,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "gray",
  },
  button: {
    marginTop: "auto",
    backgroundColor: "#10a37f",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 10,
  },
  loading: {
    width: "100%",
  },

  //selector
  selectorContainer: {
    flexDirection: "row",
  },
  selector: {
    flex: 1,
    textAlign: "center",
    backgroundColor: "gainsboro",
    margin: 5,
    padding: 16,
    borderRadius: 5,
    overflow: "hidden",
  },
});
