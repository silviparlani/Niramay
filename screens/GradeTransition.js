import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import axios from 'axios';
import { VictoryBar, VictoryChart, VictoryStack, VictoryAxis, VictoryLegend, VictoryLabel } from 'victory-native';
import { API_URL } from './config';
const GradeTransition = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getTransitionCount`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error, you might want to set an error state or display an error message.
    }
  };

  // Log the data to check if it's available
  console.log('Data:', data);

  // Check if data is empty or undefined before rendering
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Loading...</Text>
      </View>
    );
  }

  const chartData = data.map((item) => ({
    bit_name: item.bit_name,
    mam_to_normal_count: item.mam_to_normal_count,
    sam_to_normal_count: item.sam_to_normal_count,
  }));

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Grade Transitions</Text>

        {/* Container for the Bar Chart */}
        <ScrollView horizontal={true}>
          <View style={styles.chartContainer}>
            {/* Stacked Bar Chart using Victory */}
            <VictoryChart
              domainPadding={{ x: 20 }}
              width={data.length * 80} // Adjust the width as needed
              padding={{ bottom: 90, left: 80, top: 30, right: 20 }} // Increase this value
            >
              {/* Add Y-axis */}
              <VictoryAxis
                dependentAxis
                tickCount={5} // Adjust the tick count as needed
                label="No. of Transitions" // Add Y-axis label here
                style={{
                  axisLabel: { padding: 40 }, // Adjust padding as needed
                }}
              />

              <VictoryStack colorScale={['#9dd9f3', '#0f4c75']}>
                <VictoryBar data={chartData} x="bit_name" y="mam_to_normal_count" />
                <VictoryBar data={chartData} x="bit_name" y="sam_to_normal_count" />
              </VictoryStack>
              
              <VictoryAxis
                tickValues={chartData.map((item) => item.bit_name)}
                style={{
                  tickLabels: { angle: -45, textAnchor: 'end' },
                }}
              />
              
              <VictoryLabel
                text="Bit Name"
                textAnchor="middle"
                verticalAnchor="start"
                x={data.length * 40}
                y={285}
              />
              {/* No need to add Y-axis label again here */}
              <VictoryLegend
                x={10}
                y={-5}
                centerTitle
                orientation="horizontal"
                gutter={20}
                rowGutter={10}
                style={{ title: { fontSize: 20 } }}
                data={[
                  { name: 'MAM to Normal', symbol: { fill: '#9dd9f3' } },
                  { name: 'SAM to Normal', symbol: { fill: '#0f4c75' } },
                ]}
              />
            </VictoryChart>
          </View>
        </ScrollView>
        {/* Table */}
        <ScrollView horizontal={true}>
          <View style={styles.table}>
            <Text style={styles.tableTitle}>Transition Summary</Text>
            <ScrollView horizontal={true}>
              <Table style={styles.tableContainer}>
                <Row
                  data={['Name', 'MAM to Normal', 'SAM to Normal']} // Updated labels
                  style={styles.tableHeader}
                  textStyle={styles.tableHeaderText}
                />
                {data.map((item) => (
                  <Row
                    key={item.bit_name}
                    data={[item.bit_name, item.mam_to_normal_count, item.sam_to_normal_count]}
                    style={styles.tableRow}
                    textStyle={styles.tableCell}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  chartContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
    paddingVertical: 100,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    width: 350,
  },
  tableHeader: {
    backgroundColor: 'teal',
    justifyContent: 'space-evenly',
    paddingVertical: 8,
  },
  tableHeaderText: {
    fontSize: 16,
    padding:10,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
});

export default GradeTransition;