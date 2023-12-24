import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView,Image } from 'react-native';
import axios from 'axios';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory-native';
import { FlatList } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ViewShot from 'react-native-view-shot';
import Clipboard from '@react-native-community/clipboard'; // Added import
import { useNavigation } from '@react-navigation/native';
import { API_URL } from './config';
const CustomMenuButton = ({ toggleMenu}) => {
  const handleMenuToggle = () => {
    toggleMenu(); // Call the toggleMenu function received as a prop
  };

  return (
    <TouchableOpacity style={styles.menuButton} onPress={handleMenuToggle}>
      <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
    </TouchableOpacity>
    
  );
};
const BitNamevsGender = ({ toggleMenu }) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const chartRef = useRef();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <CustomMenuButton toggleMenu={toggleMenu} />, // Place the menu button in the header
      // You can add other header configurations here as needed
    });
  }, [navigation]);
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

  const xAxisTickValues = data.map((item, index) => ({ x: index + 1, label: item.bit_name }));

  const generateHTML = (chartImageUri) => {
    
    const chartHtml = `
    <div style="margin: 16px; background-color: white; border-radius: 10px; elevation: 4; padding: 16px;">
    <img src="${chartImageUri}" alt="Chart" style="width: 100%; height: 400px; object-fit: contain;"/>
  </div>
`;

    
    const tableHtml = `
    <div style="background-color: #fff; border-radius: 15px; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3); elevation: 8; margin: 16px;">
      <Text style="font-size: 20px; font-weight: bold; margin: 16px; color: #333; text-align: center;">Bit Name vs Count of Children</Text>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc; font-weight: bold;">Bit Name</th>
          <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc; font-weight: bold;">Count</th>
        </tr>
        ${data.map(item => `
          <tr>
            <td style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc;">${item.bit_name}</td>
            <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc;">${item.total_children_count}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;
  

const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
        }
        .headerContainer {
          display: flex;
          align-items: left;
          
          border-bottom: 1px solid orange; /* Thin line below the heading */
          padding-bottom: 15px; /* Adjust as needed */
        }

        img {
          width:100px; 
          height:100px;
          
          }
          .headingLine {
           font-size:30;
           color:orange;
           margin-left:20px;
          margin-top:20px;
          padding-bottom:25px;
        
         }
         .subheading {
           font-size: 18px;
           color: orange;
        
           margin-left:20px;
         }
         .textContainer {
           margin-left: 10px;
         }


      </style>
    </head>
    <body>
    <div class="headerContainer">
       
    <img src="file:///android_asset/images/logo2.jpg" />
        <div class="textContainer">
        <div class="headingLine">Niramay Bharat</div>
        <div class="subheading">सर्वे पि सुखिनः सन्तु | सर्वे सन्तु निरामय: ||</div>
        </div>
        </div>
    
      <Text style="font-size: 20px; font-weight: bold; margin-bottom: 10px;margin-top:20px; color: #333; text-align: center;">Total Children by Bit Name</Text>
      ${chartHtml}
      <Text style="font-size: 20px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #333; text-align: center;">Summary Table</Text>
      ${tableHtml}
    </body>
  </html>
`;

return htmlContent;
};

  const captureChart = async () => {
    try {
      // Capture the chart as an image
      return await chartRef.current.capture();
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };

  const generatePDF = async () => {
    try {
      // Capture the chart before generating the PDF
      const chartImageUri = await captureChart();

      if (chartImageUri) {
        const options = {
          html: generateHTML(chartImageUri),
          fileName: 'BitNamevsGenderReport',
          directory: 'Documents',
        };

        const pdf = await RNHTMLtoPDF.convert(options);
        console.log(pdf.filePath);
      } else {
        console.error('Chart capture failed.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.chartTitle}>Total Children by Bit Name</Text>
      <ScrollView horizontal={true}>
        <View style={styles.chartContainer} collapsable={false}>
          <ViewShot
            ref={chartRef}
            options={{ format: 'png', quality: 0.8 }}
          >
            <VictoryChart
              domainPadding={{ x: 5 }}
              padding={{ left: 50, right: 50, top: 20, bottom: 50 }}
              height={450}
              width={data.length * 100}
            >
              <VictoryAxis
                label="Bit Name"
                tickValues={xAxisTickValues.map((tick) => tick.x)}
                tickLabelComponent={<VictoryLabel angle={0} />}
                style={{
                  axisLabel: { padding: 30 },
                }}
                tickFormat={(tick, index) => xAxisTickValues[index]?.label || ''}
              />
              <VictoryAxis
                dependentAxis
                label="Count of Children"
                style={{
                  axisLabel: { padding: 30 },
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
          </ViewShot>
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
      <TouchableOpacity
        style={{
          ...styles.printButton,
          position: 'absolute',
          top: -10,
          right: -20,
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onPress={generatePDF}
      >
        <Image
          source={require('../assets/printer1.png')}
          style={{
            width: 35,
            height: 35,
            borderRadius: 10,
            backgroundColor: '#f4f4f4',
            marginEnd:40,
          }}
        />
        <Text style={{ color: 'black', fontSize: 14, marginTop: 3 ,marginEnd:45}}> PDF</Text>
      </TouchableOpacity>
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
  pdfButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BitNamevsGender;
