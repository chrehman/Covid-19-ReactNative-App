import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, Button, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('favorite_list')
        //   console.log("Frst Raed")
        const resp = JSON.parse(jsonValue)
        // console.log(resp)
        return resp
    } catch (e) {
        console.log(e)
    }
}
const storeData = async (value) => {
    try {
        const jsonValue = JSON.stringify(value)
        // console.log("Saving")
        // console.log(jsonValue)
        await AsyncStorage.setItem('favorite_list', jsonValue)
    } catch (e) {
        console.log(e)
    }
}

function FavoriteList({ navigation }) {
    const [countries, setCountries] = useState({})
    const [render, setRender] = useState(true)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const data = async () => {
                const resp = await getData()
                setCountries(resp)
            }
            data()

        });
        return unsubscribe;

    }, [navigation])
    const delCountry = (name) => {

        console.log("delete")
        console.log(name)
        delete countries[name]
        storeData(countries)
        setRender(render ? false : true)

    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ScrollView>
                {Object.keys(countries).map((name, index) => {
                    return (
                        <View key={index} style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Country Stats", name)}
                            >
                                <Text style={{ fontSize: 25, color: "yellowgreen" }}>{name}</Text>
                            </TouchableOpacity>
                            <AntDesign name="star" size={30} color="yellowgreen" onPress={() => { delCountry(name) }} />
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    );
}

function CountryDetail({ route }) {
    const [cases, setCases] = useState({})
    const [population, setPopulation] = useState({})
    // console.log(route)
    useEffect(() => {
        const getCountryPopulation = async (name) => {
            const data = await fetch(`https://world-population.p.rapidapi.com/population?country_name=${name}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "df02d31564mshbb4784e074fce6dp123aacjsn975b88ad8233",
                    "x-rapidapi-host": "world-population.p.rapidapi.com"
                }
            })
            const res = await data.json()
            setPopulation(res.body)
            // console.log(res.body)
        }
        const getCountryCases = async (name) => {
            const data = await fetch(`https://covid-19-data.p.rapidapi.com/country?name=${name}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "df02d31564mshbb4784e074fce6dp123aacjsn975b88ad8233",
                    "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
                }
            })
            const res = await data.json()
            setCases(res[0])
            // console.log(res[0])
        }
        getCountryPopulation(route.params)
        getCountryCases(route.params)
    }, [])
    return (
        <View style={styles.container}>
            <Text style={styles.header}>{route.params} COVID-19 Cases</Text>
            <View>
                <View >
                    <Text style={styles.cases}>Confirmed Cases {cases.confirmed}</Text>
                    <Text style={styles.info}>Country Percentage {((cases.confirmed / population.population) * 100).toFixed(2)}%</Text>
                    <Text style={styles.info}>{new Date(cases.lastUpdate).toDateString()}</Text>
                </View>
                <View >
                    <Text style={styles.cases}>Recovered Cases {cases.recovered}</Text>
                    <Text style={styles.info}>Country Percentage {((cases.recovered / population.population) * 100).toFixed(2)}%</Text>
                    <Text style={styles.info}>{new Date(cases.lastUpdate).toDateString()}</Text>
                </View>
                <View >
                    <Text style={styles.cases}>Cases Cases {cases.critical}</Text>
                    <Text style={styles.info}>Country Percentage {((cases.critical / population.population) * 100).toFixed(2)}%</Text>
                    <Text style={styles.info}>{new Date(cases.lastUpdate).toDateString()}</Text>
                </View>
                <View >
                    <Text style={styles.cases}>Deaths Cases {cases.deaths}</Text>
                    <Text style={styles.info}>Country Percentage {((cases.deaths / population.population) * 100).toFixed(2)}%</Text>
                    <Text style={styles.info}>{new Date(cases.lastUpdate).toDateString()}</Text>
                </View>
            </View>
        </View>
    );
}

const Stack = createStackNavigator();

function FavoriteListStack() {
    return (
        <Stack.Navigator
            initialRouteName="Favorite Countries List"
            screenOptions={({ navigation }) => ({
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: 'yellowgreen'
                },
                headerLeft: () =>
                    <View style={styles.menuButton}>
                        <Ionicons name="md-menu" color="white" size={32} onPress={() => navigation.toggleDrawer()} />
                    </View>
            })
            }
        >
            <Stack.Screen name="Favorite Countries List" component={FavoriteList} />
            <Stack.Screen
                name="Country Stats"
                component={CountryDetail}
                options={({ navigation }) => ({
                    title: 'Country Stats',
                    headerLeft: () => <View style={{ paddingLeft: 10 }}>
                        <AntDesign
                            name="arrowleft"
                            size={32}
                            color="white"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                })
                }
            />
        </Stack.Navigator>
    );
}

export default FavoriteListStack;

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { fontSize: 30, fontWeight: "bold", paddingBottom: 10 },
    cases: { fontSize: 20 },
    info: { fontSize: 15 },
    menuButton: { paddingLeft: 10 }
});