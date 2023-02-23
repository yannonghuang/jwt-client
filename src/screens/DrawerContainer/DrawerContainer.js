import React, {useContext} from "react";
import { View, Button } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import MenuButton from "../../components/MenuButton/MenuButton";
import {AuthContext} from '../../context/AuthContext';

export default function DrawerContainer(props) {
  const { navigation } = props;
  const authContext = useContext(AuthContext);

  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <MenuButton
          title="Gift Ideas"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            navigation.navigate("GiftIdeas");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="Animal Name"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            navigation.navigate("AnimalName");
            navigation.closeDrawer();
          }}
        />        
        <MenuButton
          title="Chat"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            navigation.navigate("Chat");
            navigation.closeDrawer();
          }}
        />          
        <Button title="Logout" onPress={() => authContext.logout()} />
      </View>
    </View>
  );
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};
