import React, { useEffect, useState } from 'react';
import { View,TouchableOpacity, Text, StyleSheet, ScrollView, FlatList,Image } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory-native';
import { API_URL } from './config';
import { useNavigation } from '@react-navigation/native';
const AnganwadiCountPerBit = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/anganwadi-count`);
            const result = await response.json();

            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
   
    const renderSummaryItem = ({ item }) => (
        <View style={styles.summaryItem}>
            <Text style={styles.summaryBit}>{item.bit_name}</Text>
            <Text style={styles.summaryCount}>{item.anganwadi_count}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Anganwadi Count Per Bit</Text>
            {data.length > 0 ? (
                <View>
                    <View style={styles.chartContainer}>
                        <ScrollView horizontal={true}>
                            <VictoryChart
                                padding={{ left: 50, right: 50, top: 20, bottom: 50 }}
                                domainPadding={{ x: 20 }}
                                width={data.length * 100}
                                height={350}
                            >
                                <VictoryAxis
                                    label="Bit Name"
                                    style={{ axisLabel: { padding: 30 } }}
                                    tickValues={data.map((item) => item.bit_name)}
                                />
                                <VictoryAxis dependentAxis
                                    style={{ axisLabel: { padding: 30 } }}
                                    tickFormat={(tick) => tick.toFixed(0)}
                                    label="No. of Anganwadi"
                                />
                                <VictoryBar
                                    data={data}
                                    x="bit_name"
                                    y="anganwadi_count"
                                    style={{ data: { fill: 'rgba(215, 180, 243, 1)' } }}
                                    labels={({ datum }) => datum.anganwadi_count}
                                    labelComponent={<VictoryLabel dx={2} dy={0} />}
                                />
                            </VictoryChart>
                        </ScrollView>
                    </View>
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Summary Table</Text>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.bit_name}
                            renderItem={renderSummaryItem}
                        />
                    </View>
                </View>
            ) : (
                <Text>No data available</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    menuButton: {
        position: 'absolute',
        bottom: -20,
        right: 1,
        zIndex: 1,
   
        // Add any additional styles you need for positioning and appearance
      },
      menuIcon: {
        width: 28,
        height: 30,
        // Add styles for your icon if needed
      },
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    chartContainer: {
        margin: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 4,
        padding: 16,
    },
    summaryContainer: {
        margin: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 4,
        padding: 16,
        marginTop: 20,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555',
        textAlign: 'center',
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    summaryBit: {
        flex: 1,
        color: '#333',
        fontSize: 16,
    },
    summaryCount: {
        marginLeft: 16,
        color: '#333',
        fontSize: 16,
    },
});

export default AnganwadiCountPerBit;