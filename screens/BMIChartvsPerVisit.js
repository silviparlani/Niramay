import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel } from 'victory-native'; // Import Victory components
import { API_URL } from './config';
import { useNavigation } from '@react-navigation/native';

const BMIChartvsPerVisit = ({ route }) => {
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

    // Extract height and weight data from formData
    const { data } = formData || {};
    const heights = data ? data.map((entry) => parseFloat(entry.height)) : [];
    const weights = data ? data.map((entry) => parseFloat(entry.weight)) : [];

    // Calculate BMI for each visit
    const calculateBMI = (height, weight) => {
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(2);
    };

    const bmis = data
        ? data.map((entry, index) => calculateBMI(heights[index], weights[index]))
        : [];

    // Create an array of visit labels for the graph
    const visitLabels = data ? data.map((_, index) => `Visit ${index + 1}`) : [];

    // Create table data
    const tableData = data
        ? data.map((entry, index) => ({
            visit: entry.visitDate,
            height: `${parseFloat(entry.height).toFixed(2)} cm`,
            weight: `${parseFloat(entry.weight).toFixed(2)} kg`,
            bmi: bmis[index],
        }))
        : [];

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
                        <Text style={styles.chartTitle}>BMI Chart</Text>
                        <ScrollView horizontal={true}>
                            <ScrollView horizontal={true}>
                                <VictoryChart padding={{ top: 20, bottom: 50, left: 70, right: 40 }} domainPadding={{ x: 33 }} width={bmis.length * 80}>
                                    <VictoryBar
                                        data={bmis.map((value, index) => ({ x: index + 1, y: parseFloat(value) }))}
                                        style={{ data: { fill: '#3eb489' } }}
                                        labelComponent={<VictoryLabel dy={-10} />}
                                        labels={({ datum }) => `${datum.y}\nkg/m²`}
                                    />
                                    <VictoryAxis
                                        label="Visits"
                                        style={{
                                            axisLabel: { padding: 30 },
                                        }}
                                        tickFormat={(value) => `Visit${value}`}
                                    />
                                    <VictoryAxis
                                    label="BMI (in kg/m²)"
                                    style={{
                                      axisLabel: { padding: 35, y: -20 },
                                    }}
                                    dependentAxis domain={{ y: [Math.min(...bmis) - 5, Math.max(...bmis) + 5] }} />
                                </VictoryChart>
                            </ScrollView>
                        </ScrollView>
                    </View>

                    <View style={styles.table}>
                        <Text style={styles.tableTitle}>Summary Table</Text>
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableHeaderText}>Visit Date</Text>
                                <Text style={styles.tableHeaderText}>Height</Text>
                                <Text style={styles.tableHeaderText}>Weight</Text>
                                <Text style={styles.tableHeaderText}>BMI</Text>
                            </View>
                            {tableData.map((item, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <Text style={styles.tableCell}>{item.visit}</Text>
                                    <Text style={styles.tableCell}>{item.height}</Text>
                                    <Text style={styles.tableCell}>{item.weight}</Text>
                                    <Text style={styles.tableCell}>{item.bmi}</Text>
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
        marginLeft: 20,
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
        color: '#333',
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
      }
});

export default BMIChartvsPerVisit;