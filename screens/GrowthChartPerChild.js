import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text,TouchableOpacity,Image, ActivityIndicator, ScrollView } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryLegend, VictoryArea } from 'victory-native';
import { API_URL } from './config';
import { useNavigation } from '@react-navigation/native';

const GrowthChartPerChild = ({ route,toggleMenu }) => {
    const { anganwadiNo, childsName, gender, dob } = route.params;
    const navigation = useNavigation();
   
    // State variables to store data
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestData = {
                    anganwadiNo,
                    childsName,
                };

                const response = await fetch(`${API_URL}/getVisitsData`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    console.log('Data not found in the database');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [anganwadiNo, childsName]);

    // Extract weight data and visit dates from formData
    const { data } = formData || {};
    const weights = data ? data.map((entry) => parseFloat(entry.weight)) : [];
    const heights = data ? data.map((entry) => parseFloat(entry.height)) : [];
    const haemoglobin = data ? data.map((entry) => parseFloat(entry.haemoglobin)) : [];
    const visitDates = data ? data.map((entry) => entry.visitDate) : [];

    // Create an array of custom labels for the graph ("visit1," "visit2," etc.)
    const customLabels = heights.map((_, index) => `visit${index + 1}`);

    // Before using haemoglobin array in the LineChart component
    const filledHaemoglobin = haemoglobin.map((value, index) => {
        if (isNaN(value) && index > 0) {
            // If the value is NaN and index is greater than 0, replace it with the previous numeric value
            let previousNumericValue = null;

            for (let i = index - 1; i >= 0; i--) {
                if (!isNaN(haemoglobin[i])) {
                    previousNumericValue = haemoglobin[i];
                    break;
                }
            }

            return previousNumericValue || 0;
        }
        return value;
    });

    console.log(filledHaemoglobin);

    // Create table data with visit dates
    const tableData = visitDates.map((visitDate, index) => ({
        visit: visitDate,
        height: `${parseFloat(heights[index]).toFixed(2)} cm`,
        weight: `${parseFloat(weights[index]).toFixed(2)} kg`,
        haemoglobin: `${parseFloat(haemoglobin[index]).toFixed(2)} g/dL`,
    }));

    // Normalize the height, weight, and haemoglobin data
    const normalize = (data) => {
        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);
        const range = maxValue - minValue;

        return data.map((value) => (value - minValue) / range);
    };


    // Normalize the height, weight, and haemoglobin datasets
    const normalizedHeights = normalize(heights);
    const normalizedWeights = normalize(weights);
    const normalizedHaemoglobin = normalize(filledHaemoglobin);

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <ScrollView style={styles.scrollView}>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <View>
                <View style={styles.childInfo}>
              <Text style={styles.chartTitle}>Profile</Text>
              <Text style={styles.infoText}>Name: {childsName}</Text>
              <Text style={styles.infoText}>Gender: {gender}</Text>
              <Text style={styles.infoText}>Date of Birth: {dob}</Text>
            </View>
                    <View style={styles.chart}>
                        <Text style={styles.chartTitle}>Growth Chart</Text>
                        <ScrollView horizontal={true}>
                            <VictoryChart padding={{ top: 30, bottom: 45, left: 50, right: 20 }} width={customLabels.length * 60} height={300} domainPadding={{ x: 20 }}>
                                <VictoryLegend
                                    x={80}
                                    y={0}
                                    orientation="horizontal"
                                    gutter={10}
                                    data={[
                                        { name: 'Haemoglobin ', symbol: { fill: 'rgba(237, 102, 99, 0.7)' } },
                                        { name: 'Height ', symbol: { fill: 'rgba(255, 163, 114, 0.7)' } },
                                        { name: 'Weight ', symbol: { fill: 'rgba(67, 101, 139, 0.7)' } },
                                    ]}
                                />
                                <VictoryAxis
                                    label="Visits"
                                    style={{
                                        axisLabel: { padding: 30 },
                                    }}
                                    tickFormat={(value) => `Visit${value}`}
                                />
                                <VictoryAxis
                                    label="Data"
                                    style={{
                                        axisLabel: { padding: 35, y: -20 },
                                    }}
                                    dependentAxis
                                />
                                <VictoryArea
                                    data={normalizedHaemoglobin.map((value, index) => ({ x: index, y: value }))}
                                    style={{ data: { fill: 'rgba(237, 102, 99, 0.15)' } }}
                                />
                                <VictoryArea
                                    data={normalizedHeights.map((value, index) => ({ x: index, y: value }))}
                                    style={{ data: { fill: 'rgba(255, 163, 114, 0.15)' } }}
                                />
                                <VictoryArea
                                    data={normalizedWeights.map((value, index) => ({ x: index, y: value }))}
                                    style={{ data: { fill: 'rgba(67, 101, 139, 0.15)' } }}
                                />
                                <VictoryLine
                                    data={normalizedHaemoglobin.map((value, index) => ({ x: index, y: value }))}
                                    style={{ data: { stroke: 'rgba(237, 102, 99, 0.7)', strokeWidth: 2 } }}
                                />
                                <VictoryLine
                                    data={normalizedHeights.map((value, index) => ({ x: index, y: value }))}
                                    style={{ data: { stroke: 'rgba(255, 163, 114, 0.7)', strokeWidth: 2 } }}
                                />
                                <VictoryLine
                                    data={normalizedWeights.map((value, index) => ({ x: index, y: value }))}
                                    style={{ data: { stroke: 'rgba(67, 101, 139, 0.7)', strokeWidth: 2 } }}
                                />
                            </VictoryChart>

                        </ScrollView>
                    </View>


                    <View style={styles.table}>
                        <Text style={styles.tableTitle}>Summary Table</Text>
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableHeaderText}>Visit Date</Text>
                                <Text style={styles.tableHeaderText}>Height</Text>
                                <Text style={styles.tableHeaderText}>Weight</Text>
                                <Text style={styles.tableHeaderText}>Haemoglobin</Text>
                            </View>
                            {tableData.map((item, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <Text style={styles.tableCell}>{item.visit}</Text>
                                    <Text style={styles.tableCell}>{item.height}</Text>
                                    <Text style={styles.tableCell}>{item.weight}</Text>
                                    <Text style={styles.tableCell}>{item.haemoglobin}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                </View>
            )}
            </ScrollView>
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
    chart: {
        margin: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 4,
        padding: 16,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
    },
    chartStyle: {
        marginVertical: 8,
    },
    table: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 4,
        margin: 16,
        borderWidth: 1, // Add a border to the table
        borderColor: '#ccc', // Border color
    },
    tableTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 16,
        color: '#555',
    },
    tableContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    tableHeader: {
        backgroundColor: 'teal',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1, // Add a border to the bottom of the header
        borderBottomColor: '#ccc', // Border color
    },
    tableHeaderText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        color: '#333'

    },
    childInfo: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 4,
        margin: 16,
        padding: 16,
      },
      infoText: {
        fontSize: 16,
        marginBottom: 8,
        color: 'black'
      },
      scrollView: {
        flex: 1,
        width: '100%',
      },
});

export default GrowthChartPerChild;