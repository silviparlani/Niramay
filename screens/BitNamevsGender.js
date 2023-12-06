import React, { useEffect, useState } from 'react';
import { View,TouchableOpacity, Text, StyleSheet, ScrollView,Image} from 'react-native';
import axios from 'axios';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory-native';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from './config';

const BitNamevsGender = ({ toggleMenu }) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    axios
      .get(`${API_URL}/childData`)
      .then((response) => {
        if (response.data instanceof Array) {
          setData(response.data);
        } else if (response.data instanceof Object) {
          const dataArray = Object.values(response.data);
          setData(dataArray);
        } else {
          console.error('Invalid data format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
 
  const chartData = data.map((item) => ({
    bit_name: item.bit_name,
    total_children_count: parseInt(item.total_children_count),
  }));
  console.log(chartData);
  const xAxisTickValues = data.map((item, index) => ({ x: index + 1, label: item.bit_name }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.chartTitle}>Total Children by Bit Name</Text>
      <ScrollView horizontal={true}>
        <View style={styles.chartContainer}>
          <VictoryChart domainPadding={{ x: 5 }} padding={{ left: 50, right: 50, top: 20, bottom: 50 }} height={350} width={data.length * 100}>
            <VictoryAxis
              label="Bit Name"
              tickValues={xAxisTickValues.map((tick) => tick.x)}
              tickLabelComponent={<VictoryLabel angle={0} />}
              style={{
                axisLabel: { padding: 30 },
              }}
              tickFormat={(tick, index) => xAxisTickValues[index]?.label || ''}
            />
            <VictoryAxis dependentAxis
              label="Count of Children"
              style={{
                axisLabel: { padding: 30},
              }}
            />
            <VictoryBar
              data={chartData}
              x="bit_name"
              y="total_children_count"
              style={{ data: { fill: 'rgba(180, 80, 130, 1)' } }}
              barWidth={20}
              alignment="start"
              labels={({ datum }) => datum.total_children_count}
              labelComponent={<VictoryLabel dx={10} dy={0} />}
            />
          </VictoryChart>
        </View>
      </ScrollView>
      <Text style={styles.summaryTableTitle}>Summary Table</Text>
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Bit Name vs Count of Children</Text>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.bitName}>{item.bit_name}</Text>
              <Text style={styles.childCount}>{item.total_children_count}</Text>
            </View>
          )}
        />
      </View>
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
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
  },
  chartContainer: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    padding: 16,
  },
    chartTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
      textAlign: 'center',
    },
    summaryTableTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: '#333',
      textAlign: 'center',
    },
    tableContainer: {
      backgroundColor: '#fff',
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 8,
      margin: 16,
    },
    tableTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      margin: 16,
      color: '#333',
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
    bitName: {
      flex: 1,
      textAlign: 'left',
      color: '#333',
      fontSize: 16,
    },
    childCount: {
      flex: 1,
      textAlign: 'right',
      color: '#333',
      fontSize: 16,
    },
  });

export default BitNamevsGender;