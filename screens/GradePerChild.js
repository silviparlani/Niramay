import React, { useEffect, useState } from 'react';
import { View, StyleSheet,TouchableOpacity,Image, Text, ActivityIndicator, ScrollView } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryScatter,VictoryLabel } from 'victory-native';
import { API_URL } from './config';
import { useNavigation } from '@react-navigation/native';

const GradePerChild = ({ route,toggleMenu }) => {
  const { anganwadiNo, childsName, gender, dob } = route.params;

  // State variables to store data
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  
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

  // Check if formData and data exist before accessing properties
  const data = formData?.data;
  console.log(data);
  const grades = data ? data.map((entry) => entry.grade) : [];


  // Convert categorical grades to numerical values
  const gradeValues = grades.map((grade) => {
    switch (grade) {
      case 'NORMAL':
        return 0;
      case 'MAM':
        return 1;
      case 'SAM':
        return 2;
      default:
        return 0; // Handle other cases as needed
    }
  });

  const chartData = data ? data.map((_, index) => ({ x: index + 1, y: gradeValues[index] })) : [];

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
          <ScrollView horizontal={true}>
            <View style={styles.chart}>
              <Text style={styles.chartTitle}>Grade Chart</Text>
              <VictoryChart padding={{ top: 20, bottom: 50, left: 70, right: 40 }} domainPadding={{ x: 0 }}>
                <VictoryLine
                  data={chartData}
                  style={{
                    data: { stroke: 'rgba(128, 0, 128, 0.7)', strokeWidth: 3 },
                  }}
                  interpolation="linear"
                />
                <VictoryScatter
                  data={chartData}
                  size={5} // adjust the size of the scatter points
                  style={{
                    data: { fill: 'rgba(128, 0, 128, 0.7)' },
                  }}
                />
                <VictoryAxis
                  label="Visits"
                  style={{
                    axisLabel: { padding: 30 },
                  }}
                  tickFormat={(value) => `Visit${value}`}
                  // tickLabelComponent={
                  //   <VictoryLabel
                  //     dy={3} // Adjust the spacing here
                  //     textAnchor="middle"
                  //   />
                  // }
                />
                <VictoryAxis
                  dependentAxis
                  label="Grade"
                  style={{
                    axisLabel: { padding: 55, y: -20 },
                  }}
                  tickValues={[0, 1, 2]}
                  tickFormat={['Normal', 'MAM', 'SAM']}
                />
              </VictoryChart>
            </View>
          </ScrollView>

          <View style={styles.table}>
            <Text style={styles.tableTitle}>Summary Table</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <View style={[styles.tableHeader, { flex: 2 }]}>
                  <Text style={styles.tableHeaderText}>Visit Date</Text>
                </View>
                <View style={[styles.tableHeader, { flex: 1 }]}>
                  <Text style={styles.tableHeaderText}>Grade</Text>
                </View>
              </View>
              {data.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text style={styles.tableCellText}>{item.visitDate}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    <Text style={styles.tableCellText}>{item.grade}</Text>
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

export default GradePerChild;