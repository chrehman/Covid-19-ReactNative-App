import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import WorldScreen from './WorldScreen'
import CountriesListStack from './CountriesListStack'
import FavoriteListStack from './FavoriteListStack'
const Drawer = createDrawerNavigator();

const  MyDrawer=()=> {
  return (
    <Drawer.Navigator
      drawerType="slide"
    >
      <Drawer.Screen
        name="World Stats"
        component={WorldScreen}
      />
      <Drawer.Screen
        name="Stats By All Countries"
        component={CountriesListStack}
      />
      <Drawer.Screen
        name="Stats By Favorite Countries"
        component={FavoriteListStack}
      />
    </Drawer.Navigator>
  );
}
export default function App() {
  return (
      <NavigationContainer>
        <MyDrawer />
      </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
