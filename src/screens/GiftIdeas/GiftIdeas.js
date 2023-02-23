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

export default function GiftIdeas(props) {
  const [gender, setGender] = useState("man");
  const [age, setAge] = useState(30);
  const [priceMin, setPriceMin] = useState(25);
  const [priceMax, setPriceMax] = useState(100);
  const [hobbies, setHobbies] = useState("");
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
      const response = await axiosContext.authAxios.post('/generate-gifts', 
      { priceMin, priceMax, gender, age, hobbies },      
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
      );

/*
      const response = await fetch(`${API_URL}/generate-gifts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceMin, priceMax, gender, age, hobbies }),
      });
      const data = await response.json();
*/
      setResult(response.data.result);
    } catch (e) {
      Alert.alert("Couldn't generate ideas", e.message);
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
        <Text style={styles.title}>Looking for the best gift ideas 🎁 💡</Text>
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
          Here are some great Christmas gift ideas 🎁 💡
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
          <Text style={styles.title}>Christmas gift generator 🎁 💡</Text>
          <Text style={styles.label}>For who is the gift?</Text>
          <View style={styles.selectorContainer}>
            <Text
              onPress={() => setGender("man")}
              style={[
                styles.selector,
                gender === "man" && { backgroundColor: "#10a37f" },
              ]}
            >
              Man
            </Text>
            <Text
              onPress={() => setGender("woman")}
              style={[
                styles.selector,
                gender === "woman" && { backgroundColor: "#10a37f" },
              ]}
            >
              Woman
            </Text>
          </View>

          <Text style={styles.label}>Age</Text>
          <TextInput
            placeholder="Age"
            keyboardType="numeric"
            style={styles.input}
            value={age.toString()}
            onChangeText={(s) => setAge(Number.parseInt(s))}
          />

          <Text style={styles.label}>Price from ($)</Text>
          <TextInput
            placeholder="Price from"
            keyboardType="numeric"
            style={styles.input}
            value={priceMin.toString()}
            onChangeText={(s) => setPriceMin(Number.parseInt(s))}
          />

          <Text style={styles.label}>Price to ($)</Text>
          <TextInput
            placeholder="Price to"
            keyboardType="numeric"
            style={styles.input}
            value={priceMax.toString()}
            onChangeText={(s) => setPriceMax(Number.parseInt(s))}
          />

          <Text style={styles.label}>Hobbies</Text>
          <TextInput
            placeholder="Hobbies"
            style={styles.input}
            value={hobbies}
            onChangeText={setHobbies}
          />

          <Pressable onPress={onSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Generate gift ideas</Text>
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
