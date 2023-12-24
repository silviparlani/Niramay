import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel } from 'victory-native';
import ViewShot from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { API_URL } from './config';
import { useNavigation } from '@react-navigation/native';

const BMIChartvsPerVisit = ({ route }) => {
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

  const { data } = formData || {};
  const heights = data ? data.map((entry) => parseFloat(entry.height)) : [];
  const weights = data ? data.map((entry) => parseFloat(entry.weight)) : [];

  const calculateBMI = (height, weight) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const bmis = data
    ? data.map((entry, index) => calculateBMI(heights[index], weights[index]))
    : [];

  const chartData = bmis.map((value, index) => ({
    x: `Visit ${index + 1}`,
    y: parseFloat(value),
  }));

  const chartLabels = bmis.map((value) => `${value} kg/m²`);

  const captureChart = async () => {
    try {
      return await chartRef.current.capture();
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };

  const generateHTML = (chartImageUri) => {
    const chartHtml = `
      <div style="margin: 16px; background-color: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 16px;">
        <img src="${chartImageUri}" alt="Chart" style="width: 100%; height: 400px; object-fit: contain;"/>
      </div>
    `;

    const tableRows = data.map((item, index) => `
      <tr>
        <td style="padding: 8px; text-align: center;">${item.visitDate}</td>
        <td style="padding: 8px; text-align: center;">${parseFloat(item.height).toFixed(2)} cm</td>
        <td style="padding: 8px; text-align: center;">${parseFloat(item.weight).toFixed(2)} kg</td>
        <td style="padding: 8px; text-align: center;">${bmis[index]}</td>
      </tr>`).join('');

    const tableHtml = `
      <div class="table">
        <div class="table-title">Summary Table</div>
        <div class="table-container">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="background-color: teal; color: white; padding: 8px; text-align: center;">Visit Date</th>
                <th style="background-color: teal; color: white; padding: 8px; text-align: center;">Height</th>
                <th style="background-color: teal; color: white; padding: 8px; text-align: center;">Weight</th>
                <th style="background-color: teal; color: white; padding: 8px; text-align: center;">BMI</th>
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
           img{
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
              <div class="chart-title">BMI Chart</div>
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
          fileName: 'BMIChartvsPerVisitReport',
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
              <Text style={styles.chartTitle}>BMI Chart</Text>
              <ScrollView horizontal={true}>
                <ViewShot ref={chartRef} options={{ format: 'png', quality: 0.8 }}>
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
                      dependentAxis
                      domain={{ y: [Math.min(...bmis) - 5, Math.max(...bmis) + 5] }}
                    />
                  </VictoryChart>
                </ViewShot>
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
                {data.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{item.visitDate}</Text>
                    <Text style={styles.tableCell}>{`${parseFloat(item.height).toFixed(2)} cm`}</Text>
                    <Text style={styles.tableCell}>{`${parseFloat(item.weight).toFixed(2)} kg`}</Text>
                    <Text style={styles.tableCell}>{bmis[index]}</Text>
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
                marginBottom: 90,
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
                  marginEnd: 40,
                  marginBottom: 40
                }}
              />
              <Text style={{ color: 'black', fontSize: 14, marginTop: -40, marginEnd: 45 }}> PDF</Text>
            </TouchableOpacity>

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
  ,
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

export default BMIChartvsPerVisit;