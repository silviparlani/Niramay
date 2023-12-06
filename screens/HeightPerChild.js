import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text,TouchableOpacity,Image,ActivityIndicator, ScrollView } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory-native'; // Import Victory components
import { API_URL } from './config';
import { useNavigation } from '@react-navigation/native';

const HeightPerChild = ({ route,toggleMenu }) => {
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
    console.log('Heights:', heights);
  }, [anganwadiNo, childsName]);

  // Extract visit data from formData
  const { data } = formData || {};
  const heights = data ? data.map((entry) => parseFloat(entry.height)) : [];

  // Create an array of visit labels for the graph
  const visitLabels = data ? data.map((_, index) => `Visit ${index + 1}`) : [];

  // Create an array of visit dates for the table
  const visitDates = data ? data.map((entry) => entry.visitDate) : [];

  // Create table data
  const tableData = data
    ? data.map((entry, index) => ({
      visit: visitDates[index], // Use visit dates for the table
      height: `${parseFloat(entry.height).toFixed(2)} cm`,
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
            <Text style={styles.chartTitle}>Height Chart</Text>
            <ScrollView horizontal={true}>
              {/* <VictoryChart domainPadding={{ x: 20 }} width={heights.length * 80}>
                <VictoryBar
                  data={heights.map((value, index) => ({ x: index + 1, y: value }))}
                  style={{ data: { fill: '#3eb489' } }} // Set the fill color to Mint (#3eb489)
                />
                <VictoryAxis />
                <VictoryAxis
                  dependentAxis
                  domain={{ y: [Math.min(...heights) - 5, Math.max(...heights) + 5] }}
                />
              </VictoryChart> */}
              <VictoryChart padding={{ top: 20, bottom: 50, left: 70, right: 40 }} domainPadding={{ x: 20 }} width={heights.length * 80}>
                <VictoryBar
                  data={heights.map((value, index) => ({ x: index + 1, y: value }))}
                  style={{ data: { fill: '#3eb489' } }}
                  labels={({ datum }) => `${datum.y} cm`}
                />
                <VictoryAxis
                  label = "Visits"
                  style={{
                    axisLabel: { padding: 30 },
                  }}
                  tickFormat={(value) => `Visit${value}`}
                />
                <VictoryAxis
                label="Height (in cm)"
                style={{
                  axisLabel: { padding: 40, y: -20 },
                }}
                dependentAxis domain={{ y: [Math.min(...heights) - 5, Math.max(...heights) + 5] }}
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
              </View>
              {tableData.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{item.visit}</Text>
                  <Text style={styles.tableCell}>{item.height}</Text>
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
    marginLeft: 20
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
        // Add styles for your icon if needed
      },
   

});

export default HeightPerChild;