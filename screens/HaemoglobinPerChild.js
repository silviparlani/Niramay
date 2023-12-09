import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text,TouchableOpacity,Image,ActivityIndicator, ScrollView } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter, VictoryLabel } from 'victory-native'; // Import Victory components
import { API_URL } from './config';
import { useNavigation } from '@react-navigation/native';

const HaemoglobinPerChild = ({ route ,toggleMenu}) => {
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
          // const data = await response.json();
          // setFormData(data);
          const data = await response.json();
          const sortedData = data.data.sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate));
          setFormData({ data: sortedData });
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

  // Extract haemoglobin data from formData and filter out records where haemoglobin is not present
  const { data } = formData || {};
  const haemoglobinData = data ? data.filter(entry => entry.haemoglobin !== null && entry.haemoglobin !== "0") : [];
  console.log(haemoglobinData);
  const chartData = {
    labels: haemoglobinData ? haemoglobinData.map((_, index) => `Visit ${index + 1}`) : [],
    datasets: [
      {
        data: haemoglobinData ? haemoglobinData.map(entry => entry.haemoglobin) : [],
        strokeWidth: 2,
      },
    ],
  };

  const tableData = haemoglobinData || [];

  const calculateTickValues = (haemoglobinData) => {
    const haemoglobinValues = haemoglobinData.map((entry) => entry.haemoglobin);
    const sortedHaemoglobinValues = haemoglobinValues.sort((a, b) => a - b);
    return sortedHaemoglobinValues;
  };




  return (
    <ScrollView style={styles.container}>
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
            <Text style={styles.chartTitle}>Haemoglobin Chart</Text>
            <ScrollView horizontal={true}>
              <VictoryChart padding={{ top: 20, bottom: 70, left: 70, right: 40 }}>
                <VictoryLine
                  data={haemoglobinData.map((entry, index) => ({
                    x: `Visit ${index + 1}`,
                    y: entry.haemoglobin,
                  }))}
                  style={{
                    data: { stroke: '#3eb489' },
                    parent: { border: '1px solid #ccc' },
                  }}
                  interpolation="natural"
                  areaStyle={{ fill: '#3eb489', opacity: 0.3 }}
                />
                <VictoryScatter
                  data={haemoglobinData.map((entry, index) => ({
                    x: `Visit ${index + 1}`,
                    y: entry.haemoglobin,
                  }))}
                  size={5}
                  style={{ data: { fill: '#3eb489' } }}
                />
                <VictoryAxis
                  label="Visits"
                  style={{
                    axisLabel: { padding: 55 },
                    tickLabels: {angle: -90, textAnchor: "end"}
                  }}
                  tickValues={haemoglobinData.map((_, index) => `Visit ${index + 1}`)}
                />
                <VictoryAxis
                  label="Haemoglobin (in g/dL)"
                  style={{
                    axisLabel: { padding: 45, y: -20 },
                  }}
                  dependentAxis tickValues={calculateTickValues(haemoglobinData)} />
              </VictoryChart>
            </ScrollView>
          </View>

          <View style={styles.table}>
            <Text style={styles.tableTitle}>Summary Table</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <View style={[styles.tableHeader, { flex: 2 }]}>
                  <Text style={styles.tableHeaderText}>Visit Date</Text>
                </View>
                <View style={[styles.tableHeader, { flex: 1 }]}>
                  <Text style={styles.tableHeaderText}>Haemoglobin</Text>
                </View>
              </View>
              {tableData.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text style={styles.tableCellText}>{item.visitDate}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    <Text style={styles.tableCellText}>{item.haemoglobin}</Text>
                  </View>
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
    padding: 8,
    justifyContent: 'space-evenly'
  },
  tableHeaderText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
  },
  tableCellText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center'
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

export default HaemoglobinPerChild;