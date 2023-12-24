import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, TouchableOpacity,Image } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter } from 'victory-native';
import ViewShot from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { API_URL } from './config';
import { useNavigation } from '@react-navigation/native';

const HaemoglobinPerChild = ({ route, toggleMenu }) => {
  const { anganwadiNo, childsName, gender, dob } = route.params;
  const navigation = useNavigation();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef();

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

  const { data } = formData || {};
  const haemoglobinData = data ? data.filter(entry => entry.haemoglobin !== null && entry.haemoglobin !== "0") : [];
  const tableData = haemoglobinData || [];

  const captureChart = async () => {
    try {
      return await chartRef.current.capture();
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };

  const calculateTickValues = (haemoglobinData) => {
    const haemoglobinValues = haemoglobinData.map((entry) => entry.haemoglobin);
    const sortedHaemoglobinValues = haemoglobinValues.sort((a, b) => a - b);
    return sortedHaemoglobinValues;
  };

  const generateHTML = (chartImageUri) => {
    const chartHtml = `
      <div style="margin: 16px; background-color: white; border-radius: 10px; elevation: 4; padding: 16px;">
        <img src="${chartImageUri}" alt="Chart" style="width: 100%; height: 400px; object-fit: contain;"/>
      </div>
    `;

    const tableRows = tableData.map((item, index) => `
      <tr>
        <td style="padding: 8px; text-align: center;">${item.visitDate}</td>
        <td style="padding: 8px; text-align: center;">${item.haemoglobin}</td>
      </tr>`).join('');

    const tableHtml = `
      <div class="table">
        <div class="table-title">Summary Table</div>
        <div class="table-container">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="background-color: teal; color: white; padding: 8px; text-align: center;">Visit Date</th>
                <th style="background-color: teal; color: white; padding: 8px; text-align: center;">Haemoglobin</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
            }
            .container {
              margin: 16px;
            }
            
            .profile {
              background-color: white;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              margin: 16px;
              padding: 16px;
            }
            .profile-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #555;
            }
            .info-text {
              font-size: 16px;
              margin-bottom: 8px;
              color: black;
            }
            .chart {
              background-color: white;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              margin: 16px;
              padding: 16px;
            }
            .chart-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #555;
            }
            .table {
              background-color: white;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              margin: 16px;
              padding: 16px;
            }
            .table-title {
              font-size: 18px;
              font-weight: bold;
              margin: 16px;
              color: #555;
            }
            .table-container {
              background-color: white;
              border-radius: 15px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              elevation: 8;
            }
            .table-header {
              background-color: teal;
              padding: 8px;
              justify-content: space-evenly;
            }
            .table-header-text {
              font-size: 16px;
              color: white;
              font-weight: bold;
              text-align: center;
            }
            .table-row {
              flex-direction: row;
              align-items: center;
              padding-vertical: 8px;
              border-bottom-width: 1px;
              border-bottom-color: #ccc;
            }
            .table-cell {
              flex: 1;
              padding: 8px;
              text-align: center;
            }
            .table-cell-text {
              font-size: 14px;
              color: #333;
              text-align: center;
            }
          img {
              width: 100px; 
              height: 100px;
            }
            .headingLine {
              font-size: 30;
              color: orange;
              margin-left: 20px;
              margin-top: 20px;
              padding-bottom: 3px;
            }
            .subheading {
              font-size: 18px;
              color: orange;
              margin-left: 20px;
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
          
          <div class="container">


            <div class="profile">
              <div class="profile-title">Profile</div>
              <div class="info-text">Name: ${childsName}</div>
              <div class="info-text">Gender: ${gender}</div>
              <div class="info-text">Date of Birth: ${dob}</div>
            </div>

            <div class="chart">
              <div class="chart-title">Haemoglobin Chart</div>
              ${chartHtml}
            </div>

            ${tableHtml}

          </div>
        </body>
      </html>
    `;

    return htmlContent;
  };
  
  const generatePDF = async () => {
    try {
      const chartImageUri = await captureChart();

      if (chartImageUri) {
        const options = {
          html: generateHTML(chartImageUri),
          fileName: 'HaemoglobinChartPerChildReport',
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
                <ViewShot ref={chartRef} options={{ format: 'png', quality: 0.8 }}>
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
                        tickLabels: { angle: -90, textAnchor: 'end' },
                      }}
                      tickValues={haemoglobinData.map((_, index) => `Visit ${index + 1}`)}
                    />
                    <VictoryAxis
                      label="Haemoglobin (in g/dL)"
                      style={{
                        axisLabel: { padding: 45, y: -20 },
                      }}
                      dependentAxis
                      tickValues={calculateTickValues(haemoglobinData)}
                    />
                  </VictoryChart>
                </ViewShot>
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
          <TouchableOpacity
        style={{
          ...styles.printButton,
          position: 'absolute',
          top: -10,
          right: -20,
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom:90,
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
            marginBottom:40
          }}
        />
        <Text style={{ color: 'black', fontSize: 14, marginTop: -40 ,marginEnd:45}}> PDF</Text>
      </TouchableOpacity>
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
      pdfButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      pdfButtonText: {
        color: 'white',
        fontSize: 16,
      },
});

export default HaemoglobinPerChild;
