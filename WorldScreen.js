import React, { useEffect, useState } from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

function WorldStats({ navigation }) {
    const [cases, setCases] = useState({})
    const [population, setPopulation] = useState({})

    useEffect(() => {

        const getPopulation = async () => {
            const data = await fetch("https://world-population.p.rapidapi.com/worldpopulation", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "2aab564cc1msh9aea17d26c5f038p146e7cjsn2a76f95a060c",
                    "x-rapidapi-host": "world-population.p.rapidapi.com"
                }
            })
            const res = await data.json()
            setPopulation(res.body)
        }
        const getCases = async () => {
            const data = await fetch("https://covid-19-data.p.rapidapi.com/totals", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "2aab564cc1msh9aea17d26c5f038p146e7cjsn2a76f95a060c",
                    "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
                }
            })
            const res = await data.json()
            setCases(res[0])
        }
        getPopulation()
        getCases()
    }, [])


    return (
        <View style={styles.container}>
            <Text style={styles.header}>COVID-19</Text>
            <View>

                <View >
                    <Text style={styles.cases}>Confirmed Cases {cases.confirmed}</Text>
                    <Text style={styles.info}>World Percentage {((cases.confirmed / population.world_population) * 100).toFixed(2)}%</Text>
                    <Text style={styles.info}>{new Date(cases.lastUpdate).toDateString()}</Text>


                </View>
                <View >
                    <Text style={styles.cases}>Recovered Cases {cases.recovered}</Text>
                    <Text style={styles.info}>World Percentage {((cases.recovered / population.world_population) * 100).toFixed(2)}%</Text>
                    <Text style={styles.info}>{new Date(cases.lastUpdate).toDateString()}</Text>
                </View>
                <View >
                    <Text style={styles.cases}>Cases Cases {cases.critical}</Text>
                    <Text style={styles.info}>World Percentage {((cases.critical / population.world_population) * 100).toFixed(2)}%</Text>
                    <Text style={styles.info}>{new Date(cases.lastUpdate).toDateString()}</Text>
                </View>
                <View >
                    <Text style={styles.cases}>Deaths Cases {cases.deaths}</Text>
                    <Text style={styles.info}>World Percentage {((cases.deaths / population.world_population) * 100).toFixed(2)}%</Text>
                    <Text style={styles.info}>{new Date(cases.lastUpdate).toDateString()}</Text>
                </View>

            </View>
        </View>
    );
}


const Stack = createStackNavigator();

function WorldScreen() {
    return (

        <Stack.Navigator
            initialRouteName="World Stats"
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
            <Stack.Screen name="World Stats" component={WorldStats} />
        </Stack.Navigator>
    );
}

export default WorldScreen;
const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { fontSize: 30, fontWeight: "bold", paddingBottom: 10 },
    cases: { fontSize: 20 },
    info: { fontSize: 15 },
    menuButton: { paddingLeft: 10 }
});
