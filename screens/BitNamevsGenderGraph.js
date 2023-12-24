import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, ScrollView,Image, Button,TouchableOpacity } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { API_URL } from './config';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { captureRef } from 'react-native-view-shot';
import logo2 from '../assets/logo2.jpg'; 

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    color: 'black',
  },
  dropdownContainer: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 20,
    
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    width: 300,
  },
  dropdownOptionText: {
    fontSize: 16,
  },
  genderChartSection: {
    alignItems: 'center',
    padding: 20,
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
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  tableContainer: {
    borderRadius: 8,
    paddingBottom: 20,
    marginTop: 20,
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
    paddingVertical: 8,
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
    color: 'black',
  },
  printButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 25,
    backgroundColor: '#f4f4f4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  printButtonText: {
    color: 'black',
    fontSize: 16,
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
const colors = ['#3498db', '#ff69b4']; // Blue for male, Pink for female
import RNFS from 'react-native-fs';

// Function to convert image to base64

const CustomMenuButton = ({ toggleMenu,handlePDFGeneration}) => {
  const handleMenuToggle = () => {
    toggleMenu(); // Call the toggleMenu function received as a prop
  };

  return (
    <TouchableOpacity style={styles.menuButton} onPress={handleMenuToggle}>
      <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
    </TouchableOpacity>
    
  );
};
const BitNamevsGenderGraph = ({toggleMenu}) => {
  const navigation = useNavigation();
  const [bitName, setBitName] = useState([]);
  const [selectedBitName, setSelectedBitName] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartImage, setChartImage] = useState(null);
  const [prevSelectedBitName, setPrevSelectedBitName] = useState('');
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <CustomMenuButton toggleMenu={toggleMenu} />, // Place the menu button in the header
      // You can add other header configurations here as needed
    });
  }, [navigation]);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/bit_name`)
      .then((response) => {
        setBitName(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedBitName) {
      axios
        .get(`${API_URL}/gender_distribution/${selectedBitName}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedBitName]);

  const pieChartData = data.map((item, index) => ({
    name: item.gender,
    count: item.count,
    color: item.gender === 'male' ? colors[0] : colors[1], // Blue for Male, Pink for Female
  }));
  

  useEffect(() => {
    console.log('bitName:', bitName);
    console.log('selectedBitName:', selectedBitName);
    console.log('data:', data);
    console.log('pieChartData:', pieChartData);
  }, [bitName, selectedBitName, data, pieChartData]);

  const captureChartImage = async () => {
    try {
      const image = await captureRef(chartRef, { format: 'png', quality: 1 });
      setChartImage(image);
    } catch (error) {
      console.error('Error capturing chart image:', error);
    }
  };

  const generateHTMLContent =() => {
  
    return `
      <html>
        <head>
        <style>
        body {
          font-family: 'Arial, sans-serif';
          padding: 20px;
        }
        .headerContainer {
          display: flex;
          align-items: left;
          
          border-bottom: 1px solid orange; /* Thin line below the heading */
          padding-bottom: 15px; /* Adjust as needed */
        }

        h1 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
          color: black;
        }
        p {
          font-size: 16px;
          margin-bottom: 20px;
          color: black;
        }
        img {
          width: 100%;
          max-width: 500px; /* Adjust as needed */
          height: auto;
          margin-bottom: 20px;
        }
        .gender-chart-section {
          align-items: center;
          padding: 20px;
          background-color: white;
          border-radius: 15px;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
          margin-top: 20px;
        }
        .chart-image {
          width: 100%; 
          max-width: 100%; 
          height: auto;
          margin-bottom: 20px;
        }
        .label {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: black;
        }
        .table-container {
          border-radius: 8px;
          padding-bottom: 20px;
          margin-top: 20px;
          background-color: white;
          border-radius: 15px;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
          overflow-x: auto; /* Enable horizontal scroll for the table */
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .table-header {
          background-color: teal;
          color: white;
          font-weight: bold;
          text-align: center;
        }
        .table-row {
          border-bottom: 1px solid #ccc;
        }
        .table-cell {
          padding: 8px;
          text-align: center;
          color: black;
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
          padding-bottom:3px;
        
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
          <h1>Gender Distribution</h1>
          <p>Anganwadi Name: ${selectedBitName}</p>
          <div class="gender-chart-section">
          ${chartImage ? `<img class="chart-image" src="${chartImage}" alt="Gender Distribution Chart" />` : ''}
        </div>
          
          <div class="table-container">
            <table class="table">
              <thead>
                <tr class="table-header">
                  <th class="table-cell">Gender</th>
                  <th class="table-cell">Count</th>
                </tr>
              </thead>
              <tbody>
                ${data.map((item) => `
                  <tr class="table-row">
                    <td class="table-cell">${item.gender}</td>
                    <td class="table-cell">${item.count}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
  };
  const generatePDF = async () => {
    try {
      if (!selectedBitName) {
        // Show an alert if bit_name is not selected
        Alert.alert('Error', 'Please select an Anganwadi Name before generating PDF.');
        return;
      }
  
      // Check if chartRef is defined before capturing the chart image
      if (chartRef) {
        await captureChartImage();
      }
  
      const options = {
        html: generateHTMLContent(),
        fileName: `${selectedBitName}`,
        directory: 'Documents/GenderDistributionReport',
      };
  
      const file = await RNHTMLtoPDF.convert(options);
      console.log('PDF generated:', file.filePath);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  let chartRef;

  return (
    <ScrollView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Gender Distribution</Text>
        <View>
          <Text style={styles.label}>Select Anganwadi Name:</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0072ff" />
          ) : (
            <View style={styles.dropdownContainer}>
              <ModalDropdown
                options={bitName}
                defaultValue="Select an Anganwadi Name"
                onSelect={(index, value) => setSelectedBitName(value)}
                textStyle={styles.dropdownText}
                dropdownStyle={styles.dropdownOptions}
                dropdownTextStyle={styles.dropdownOptionText}
              />
            </View>
          )}
        </View>

        {data.length > 0 && (
          <View style={styles.genderChartSection}>
            <Text style={styles.label}>Gender Distribution Chart</Text>
            <View ref={(ref) => (chartRef = ref)} onLayout={captureChartImage}>
              <PieChart
                data={pieChartData}
                width={300}
                height={200}
                chartConfig={{
                  backgroundGradientFrom: '#1E2923',
                  backgroundGradientTo: '#08130D',
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="5"
                absolute
              />
            </View>
          </View>
        )}

        {data.length > 0 && (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Gender Summary</Text>
            </View>
            <FlatList
              initialScrollIndex={0}
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.gender}</Text>
                  <Text style={styles.tableCell}>{item.count}</Text>
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={{
          ...styles.printButton,
          position: 'absolute',
          top: -10,
          right: -20,
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onPress={() => {
          if (selectedBitName !== prevSelectedBitName) {
            generatePDF();
          } else {
            captureChartImage();
          }
          setPrevSelectedBitName(selectedBitName);
        }}
        activeOpacity={0.2}
      >
        <Image
          source={require('../assets/printer1.png')}
          style={{
            width: 35,
            height: 35,
            borderRadius: 10,
            backgroundColor: '#f4f4f4',
          }}
        />
        <Text style={{ color: 'black', fontSize: 14, marginTop: 3 }}> PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BitNamevsGenderGraph;