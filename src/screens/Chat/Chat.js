import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
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

export default function Chat(props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);
  const [trail, setTrail] = useState([]);

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
      const response = await axiosContext.authAxios.post('/chat', 
      { prompt: prompt },      
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
      );

      setResult(response.data.result);
    } catch (e) {
      Alert.alert("Couldn't generate response: ", e.message);
    } finally {
      setLoading(false);
    }
  };

  const onTryAgain = () => {
    setResult("");
  };

  const updateTrail = () => {
    if (!result) return;

    let clone = [...trail, ['Prompt', prompt], ['Response', result]];
    setTrail(clone);
    setPrompt("");
  }

  useEffect(updateTrail, [result]);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>Generating response ... </Text>
        <Image
          source={loadingGif}
          style={styles.loading}
          resizeMode="contain"
        />
      </View>
    );
  }


  const RowItem = (props) => {
    const {rowData, index} = props;
    if (!rowData) return;

    return (
      <SafeAreaView style={[styles.row, index%2 && {backgroundColor: '#ffffff'}]} >
              <Text style={{width: 100}}>{rowData[0]}</Text>
              <TextInput editable={false} multiline style={{flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', flex: 1}}>{rowData[1]}</TextInput>
      </SafeAreaView>
    );
  }

  const _RowItem = (props) => {
    const {rowData, index} = props;
    if (!rowData) return;

    return (
      <View style={[styles.row, index%2 && {backgroundColor: '#ffffff'}]} >
          <View style={{width: 100}}>
              <Text>{rowData[0]}</Text>
          </View>
          <View style={{flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
              <TextInput editable={false} multiline style={{flex: 1, userSelect: 'text'}}>{rowData[1]}</TextInput>
          </View>
      </View>
    );
  }

  const Conversation = () => { 
        
    return (

      <View style={{height: 550}} >
      <ScrollView>
        <View>
          {trail.map((rowData, index) => (            
            <RowItem rowData={rowData} index={index} key={index}/>
          ))}
        </View>
      </ScrollView>
      </View>
    )
  }     

  //     <View style={{flexGrow: 1}}> 
  /**
   
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView horizontal={false} style={styles.dataWrapper} >
          <Conversation/>
          <Text style={styles.label}>Prompt</Text>
          <TextInput
            placeholder="Prompt"
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
          />

          <LoadingOrSubmit/>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );   
   */


  return (
    <SafeAreaView style={styles.container}>

        <View>

          <TextInput
            placeholder="Prompt"
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
          />

          <Pressable onPress={onSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Generate response</Text>
          </Pressable>

          <Conversation/>          
        </View>

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

    height: 50
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

    height: 50
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


  text: { 
    textAlign: 'center', 
    fontWeight: '200' 
  },
  dataWrapper: { 
    marginTop: -1 
  },
  row: { 
    //height: 40, 
    backgroundColor: '#F7F8FA',
    flex: 1, 
    flexDirection: 'row',
  }  
});
