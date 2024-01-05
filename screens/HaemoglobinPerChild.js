import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter } from 'victory-native';
import ViewShot from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { API_URL } from './config';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import ModalDropdown from 'react-native-modal-dropdown';



const HaemoglobinPerChild = ({ route, toggleMenu }) => {
  const { anganwadiNo, childsName, gender, dob } = route.params;
  const navigation = useNavigation();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const chartRef = useRef();
  useEffect(() => {
    fetchData();
  }, [anganwadiNo, childsName, selectedYear]);
  const fetchData = async () => {
    try {
      const requestData = {
        anganwadiNo,
        childsName,
        selectedYear,
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



  // const { data } = formData || {};
  // const haemoglobinData = data ? data.filter(entry => entry.haemoglobin !== null && entry.haemoglobin !== "0") : [];
  // const visitDates = data ? data.map((entry) => entry.visitDate) : [];
  // const tableData = haemoglobinData || [];

  const { data } = formData || {};
  const haemoglobinData = data ? data.filter(entry => entry.haemoglobin !== null && entry.haemoglobin !== "0" && entry.haemoglobin !== "0.0" && entry.haemoglobin !== "") : [];
  const visitDates = data ? data.map((entry) => entry.visitDate) : [];
  const tableData = haemoglobinData || [];
  console.log("Haemoglobin Data: ", haemoglobinData);
  console.log("Visit Dates: ", visitDates);
  console.log("Table Data: ", tableData);
  // const { data } = formData || {};
  // const haemoglobinData = data ? data.filter(entry => entry.haemoglobin !== null && entry.haemoglobin !== "0") : [];
  // const tableData = haemoglobinData || [];

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
        const pdfPath = pdf.filePath;

        // Move the generated PDF to the Downloads directory
        const downloadsPath = RNFS.DownloadDirectoryPath;
        const newPdfPath = `${downloadsPath}/${childsName}_HaemoglobinChart.pdf`;

        await RNFS.moveFile(pdfPath, newPdfPath);

        // Display an alert dialog after the PDF is generated
        Alert.alert(
          'PDF Downloaded',
          'The PDF has been downloaded in your downloads folder.'
        );
      } else {
        console.error('Chart capture failed.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };



  const renderYearSelector = () => {
    if (!data || !visitDates || visitDates.length === 0) {
      // Render some default content or handle the case where visitDates is not available
      return <Text>No visit data available</Text>;
    }

    // Use Set to collect unique years
    const uniqueYearsSet = new Set(
      visitDates.map((date) => new Date(date).getFullYear())
    );

    // Convert Set back to array for rendering
    const uniqueYears = Array.from(uniqueYearsSet);

    return (
      <View>
        <Text style={styles.dropdownLabel}>Select Year:</Text>
        <View style={styles.dropdownContainer}>
          <ModalDropdown
            options={uniqueYears.map((year) => year.toString())}
            onSelect={(index, value) => setSelectedYear(value)}
            defaultValue="Select Year"
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownDropdown} // Adjusted dropdown style
            renderButtonText={(rowData) => rowData.toString()}
          />
        </View>
      </View>
    );
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
            {renderYearSelector()}
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
    marginLeft: 20,
    marginTop: 90,
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
  dropdownContainer: {
    position: 'absolute',
    top: '90%', // Position below the profile container
    zIndex: 2,
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 1,
    marginLeft: 20,
    marginTop: 20, // Increase the margin to create more space
    padding: 5, // Add padding for better visual appearance
  },

  dropdownDropdown: {
    paddingBottom: 100,
    marginLeft: -6,
    width: '90%',
    marginTop: 30, // Adjust the margin to create more space
  },


  dropdown: {
    height: 40,
    width: '100%', // Change the width to 100% to ensure full-width dropdown
    padding: 10,
    marginLeft: -5,
    borderRadius: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignSelf: 'center',
    zIndex: 1,
  },

  dropdownText: {
    fontSize: 20,
  },
  dropdownLabel: {
    fontSize: 16,
    marginLeft: 20,
    color: '#555',

  },
});

export default HaemoglobinPerChild;