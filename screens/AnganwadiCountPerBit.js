import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, FlatList ,Image} from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ViewShot from 'react-native-view-shot';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from './config';
const CustomMenuButton = ({toggleMenu}) => {
    const handleMenuToggle = () => {
      toggleMenu(); // Call the toggleMenu function received as a prop
    };
  
    return (
      <TouchableOpacity style={styles.menuButton} onPress={handleMenuToggle}>
        <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
      </TouchableOpacity>
      
    );
  };
const AnganwadiCountPerBit = ({toggleMenu}) => {
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
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/anganwadi-count`);
            const result = await response.json();

            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderSummaryItem = ({ item }) => (
        <View style={styles.summaryItem}>
            <Text style={styles.summaryBit}>{item.bit_name}</Text>
            <Text style={styles.summaryCount}>{item.anganwadi_count}</Text>
        </View>
    );

    const captureChart = async () => {
        try {
            // Capture the chart as an image
            return await chartRef.current.capture();
        } catch (error) {
            console.error('Error capturing chart:', error);
            return null;
        }
    };

    const generateHTML = (chartImageUri) => {
        const chartHtml = `
        <div style="margin: 16px; background-color: white; border-radius: 10px; elevation: 4; padding: 16px;">
        <img src="${chartImageUri}" alt="Chart" style="width: 100%; height: 400px; object-fit: contain;"/>
      </div>
    `;

        const tableHtml = `
          <div style="background-color: #fff; border-radius: 15px; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3); elevation: 8; margin: 16px;">
            <Text style="font-size: 20px; font-weight: bold; margin: 16px; color: #333; text-align: center;">Anganwadi Count Per Bit</Text>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc; font-weight: bold;">Bit Name</th>
                <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc; font-weight: bold;">Count</th>
              </tr>
              ${data.map(item => `
                <tr>
                  <td style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc;">${item.bit_name}</td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc;">${item.anganwadi_count}</td>
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
              <Text style="font-size: 20px; font-weight: bold; margin-bottom: 10px; color: #333; text-align: center;">Anganwadi Count Per Bit</Text>
              
              ${chartHtml}
              <Text style="font-size: 20px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #333; text-align: center;">Summary Table</Text>
              ${tableHtml}
            </body>
          </html>
        `;

        return htmlContent;
    };

    const generatePDF = async () => {
        try {
            // Capture the chart before generating the PDF
            const chartImageUri = await captureChart();

            if (chartImageUri) {
                const options = {
                    html: generateHTML(chartImageUri),
                    fileName: 'AnganwadiCountPerBitReport',
                    directory: 'Documents/ConsolidatedReports',
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
            <Text style={styles.title}>Anganwadi Count Per Bit</Text>
            {data.length > 0 ? (
                <View>
                    <View style={styles.chartContainer}>
                        <ScrollView horizontal={true}>
                            <ViewShot
                                ref={chartRef}
                                options={{ format: 'png', quality: 0.8 }}
                            >
                                <VictoryChart
                                    padding={{ left: 50, right: 50, top: 20, bottom: 50 }}
                                    domainPadding={{ x: 20 }}
                                    width={data.length * 100}
                                    height={350}
                                >
                                    <VictoryAxis
                                        label="Bit Name"
                                        style={{ axisLabel: { padding: 30 } }}
                                        tickValues={data.map((item) => item.bit_name)}
                                    />
                                    <VictoryAxis
                                        dependentAxis
                                        style={{ axisLabel: { padding: 30 } }}
                                        tickFormat={(tick) => tick.toFixed(0)}
                                        label="No. of Anganwadi"
                                    />
                                    <VictoryBar
                                        data={data}
                                        x="bit_name"
                                        y="anganwadi_count"
                                        style={{ data: { fill: '#884b62' } }}
                                        labels={({ datum }) => datum.anganwadi_count}
                                        labelComponent={<VictoryLabel dx={2} dy={0} />}
                                    />
                                </VictoryChart>
                            </ViewShot>
                        </ScrollView>
                    </View>
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Summary Table</Text>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.bit_name}
                            renderItem={renderSummaryItem}
                        />
                    </View>
                    <TouchableOpacity
        style={{
          ...styles.printButton,
          position: 'absolute',
          top: -55,
          right: 20,
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onPress={() => {
          
            generatePDF();
        
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
                </View>
            ) : (
                <Text>No data available</Text>
            )}
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
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'left',
        marginLeft: 20,
    },
    chartContainer: {
        margin: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 4,
        padding: 16,
    },
    summaryContainer: {
        margin: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 4,
        padding: 16,
        marginTop: 20,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555',
        textAlign: 'center',
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    summaryBit: {
        flex: 1,
        color: '#333',
        fontSize: 16,
    },
    summaryCount: {
        marginLeft: 16,
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

export default AnganwadiCountPerBit;
