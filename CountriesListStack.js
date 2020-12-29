import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

function CountriesList({ navigation }) {
    const [countries, setCountries] = useState([])
    const [save, setSave] = useState({})
    const [render, setRender] = useState(true)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const getAllCountries = async () => {
                const data = await fetch("https://world-population.p.rapidapi.com/allcountriesname", {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": "2aab564cc1msh9aea17d26c5f038p146e7cjsn2a76f95a060c",
                        "x-rapidapi-host": "world-population.p.rapidapi.com"
                    }
                })
                const res = await data.json()
                setCountries(res.body.countries)
            }
            const getSaveData = async () => {
                const resp = await getData()
                setSave(resp)
            }
            getAllCountries()
            getSaveData()

        });
        return unsubscribe;

    }, [navigation])
    const CountriesScrollList = () => {
        const checking = (name) => {
            if (name in save) {
                return true
            } else {
                return false
            }
        }
        const saveCountry = (name) => {
            save[name] = true
            setSave(save)
            storeData(save)
            setRender(render ? false : true)
        }
        return (
            <ScrollView>
                {countries.map((name, index) => {
                    return (
                        <View key={index} style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Country Stats", name)}
                            >
                                <Text style={{ fontSize: 25, color: "yellowgreen" }}>{name}</Text>
                            </TouchableOpacity>
                            {checking(name) ? <AntDesign name="star" size={30} color="yellowgreen" /> : <AntDesign name="staro" size={30} color="yellowgreen" onPress={() => { saveCountry(name) }} />}
                        </View>
                    )
                })}
            </ScrollView>
        )
    }
    if (countries.length === 0) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Loading.....</Text>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <CountriesScrollList />
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
                    "x-rapidapi-key": "2aab564cc1msh9aea17d26c5f038p146e7cjsn2a76f95a060c",
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
                    "x-rapidapi-key": "2aab564cc1msh9aea17d26c5f038p146e7cjsn2a76f95a060c",
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

function CountriesListStack() {
    return (
        <Stack.Navigator
            initialRouteName="All Countries List"
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
            <Stack.Screen name="All Countries List" component={CountriesList} />
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

export default CountriesListStack;

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { fontSize: 30, fontWeight: "bold", paddingBottom: 10 },
    cases: { fontSize: 20 },
    info: { fontSize: 15 },
    menuButton: { paddingLeft: 10 }
});