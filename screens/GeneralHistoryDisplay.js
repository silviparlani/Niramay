import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Button,
    StatusBar,
    FlatList,
} from 'react-native';
import COLORS from '../constants/colors';
import { API_URL } from './config';

const GeneralHistoryDisplay = ({ route }) => {
    const { anganwadiNo, childsName } = route.params;
    const [generalHistoryData, setGeneralHistoryData] = useState(null);
    const [visitsData, setVisitsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addVisitMode, setAddVisitMode] = useState(false);
    const [newVisit, setNewVisit] = useState({
        date: '',
        totalNoOfJars: '',
        haemoglobin: '',
        muac: '',
        weight: '',
        height: '',
        difference: '',
        grade: '',
        observations: '',
        iron: 0,
        multivitamin: 0,
        calcium: 0,
        protein: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestData = {
                    anganwadiNo,
                    childsName,
                };
                const response = await fetch(`${API_URL}/getGeneralHistory`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                if (response.status === 200) {
                    const data = await response.json();
                    console.log("General History Data: ", data);
                    setGeneralHistoryData(data);
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

    useEffect(() => {
        const fetchVisitsData = async () => {
            try {
                const requestData = {
                    anganwadiNo,
                    childsName,
                };
                const visitsResponse = await fetch(`${API_URL}/getVisits`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                if (visitsResponse.status === 200) {
                    const visitsData = await visitsResponse.json();
                    console.log("Visits Data: ", visitsData);
                    setVisitsData(visitsData);
                } else {
                    console.log('Visits data not found in the database');
                }
            } catch (error) {
                console.error('Error fetching visits data:', error);
            }
        };

        fetchVisitsData();
    }, [anganwadiNo, childsName]);

    const handleAddVisit = () => {
        setAddVisitMode(true);
    };

    const handleCancelAddVisit = () => {
        setAddVisitMode(false);
        setNewVisit({
            date: '',
            totalNoOfJars: '',
            haemoglobin: '',
            muac: '',
            weight: '',
            height: '',
            difference: '',
            grade: '',
            observations: '',
            iron: 0,
            multivitamin: 0,
            calcium: 0,
            protein: 0,
        });
    };

    const handleSaveVisit = async () => {
        try {
            const requestData = {
                anganwadiNo,
                childName: childsName,
                visitDate: newVisit.date,
                totalNoOfJars: newVisit.totalNoOfJars,
                haemoglobin: newVisit.haemoglobin,
                muac: newVisit.muac,
                weight: newVisit.weight,
                height: newVisit.height,
                difference: newVisit.difference,
                grade: newVisit.grade,
                observations: newVisit.observations,
                iron: newVisit.iron,
                multivitamin: newVisit.multivitamin,
                calcium: newVisit.calcium,
                protein: newVisit.protein,
            };

            const response = await fetch(`${API_URL}/visits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.status === 200) {
                // Successfully inserted into the server, you can update the local state as well.
                console.log('SILVIIIIIIIIIIIIIIIIIIII');
                setVisitsData([...visitsData, newVisit]);
                setNewVisit({
                    date: '',
                    totalNoOfJars: '',
                    haemoglobin: '',
                    muac: '',
                    weight: '',
                    height: '',
                    difference: '',
                    grade: '',
                    observations: '',
                    iron: 0,
                    multivitamin: 0,
                    calcium: 0,
                    protein: 0,
                });
                setAddVisitMode(false);
            } else {
                console.log('Failed to insert data into the server');
            }
        } catch (error) {
            console.error('Error saving visit:', error);
        }
    };


    const renderVisitItem = ({ item }) => (
        <View style={styles.visitContainer}>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Visit Date: </Text>
                <Text style={styles.text}>{item.visitDate}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Height: </Text>
                <Text style={styles.text}>{item.height}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Weight: </Text>
                <Text style={styles.text}>{item.weight}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Haemoglobin: </Text>
                <Text style={styles.text}>{item.haemoglobin}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>MUAC: </Text>
                <Text style={styles.text}>{item.muac}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>No. of Jars of Iron: </Text>
                <Text style={styles.text}>{item.iron}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>No. of Jars of Multivitamin: </Text>
                <Text style={styles.text}>{item.multivitamin}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>No. of Jars of Calcium: </Text>
                <Text style={styles.text}>{item.calcium}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>No. of Jars of Protein: </Text>
                <Text style={styles.text}>{item.protein}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Total No. of Supplements: </Text>
                <Text style={styles.text}>{item.totalNoOfJars}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Difference: </Text>
                <Text style={styles.text}>{item.difference}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Grade: </Text>
                <Text style={styles.text}>{item.grade}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Observations & Suggestions: </Text>
                <Text style={styles.text}>{item.observations}</Text>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    const SupplementCounter = ({ value, onIncrement, onDecrement }) => {
        return (
            <View style={styles.supplementCounter}>
                <TouchableOpacity onPress={onDecrement} style={styles.counterButton}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{value}</Text>
                <TouchableOpacity onPress={onIncrement} style={styles.counterButton}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            {visitsData ? (
                <View style={styles.formDataContainer}>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.subSectionTitle}>Child's Health Data</Text>
                    </View>
                    {generalHistoryData && generalHistoryData.map((healthData, index) => (
                        <View key={index} style={styles.fieldContainer}>
                            <Text style={styles.label}>Common Cold:</Text>
                            <Text style={styles.text}>{healthData.commonCold === 1 ? 'Yes' : 'No'}</Text>
                            <Text style={styles.label}>Cough:</Text>
                            <Text style={styles.text}>{healthData.cough === 1 ? 'Yes' : 'No'}</Text>
                            <Text style={styles.label}>Fever:</Text>
                            <Text style={styles.text}>{healthData.fever === 1 ? 'Yes' : 'No'}</Text>
                            <Text style={styles.label}>Vomiting:</Text>
                            <Text style={styles.text}>{healthData.vomiting === 1 ? 'Yes' : 'No'}</Text>
                            <Text style={styles.label}>Oedema:</Text>
                            <Text style={styles.text}>{healthData.oedema === 1 ? 'Yes' : 'No'}</Text>
                            <Text style={styles.label}>Vaccination Done:</Text>
                            <Text style={styles.text}>{healthData.vaccinationDone === 1 ? 'Yes' : 'No'}</Text>
                            <Text style={styles.label}>Eye:</Text>
                            <Text style={styles.text}>{healthData.eye}</Text>
                            <Text style={styles.label}>Ear:</Text>
                            <Text style={styles.text}>{healthData.ear}</Text>
                            <Text style={styles.label}>Face:</Text>
                            <Text style={styles.text}>{healthData.face}</Text>
                            <Text style={styles.label}>Hair:</Text>
                            <Text style={styles.text}>{healthData.hair}</Text>
                            <Text style={styles.label}>Abdomen:</Text>
                            <Text style={styles.text}>{healthData.abdomen}</Text>

                            <Text style={styles.label}>Other Signs:</Text>
                            <Text style={styles.text}>{healthData.otherSigns}</Text>
                            <Text style={styles.label}>Appetite Test:</Text>
                            <Text style={styles.text}>{healthData.appetiteTest}</Text>
                            <Text style={styles.label}>Thirst:</Text>
                            <Text style={styles.text}>{healthData.thirst}</Text>

                            <Text style={styles.label}>Motion:</Text>
                            <Text style={styles.text}>{healthData.motion}</Text>
                            <Text style={styles.label}>Observations and Suggestions:</Text>
                            <Text style={styles.text}>{healthData.observationsAndSuggestions}</Text>
                        </View>
                    ))}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.subSectionTitle}>Child's Visits Data</Text>
                    </View>
                    <FlatList
                        data={visitsData}
                        renderItem={renderVisitItem}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                    {addVisitMode ? (
                        <View style={styles.addVisitContainer}>
                            <Text style={styles.subSectionTitle}>Add Visit</Text>
                            <Text style={styles.label}>Visit Date:</Text>
                            <TextInput
                                value={newVisit.date}
                                onChangeText={(text) => setNewVisit({ ...newVisit, date: text })}
                                placeholder="DD-MM-YYYY"
                                placeholderTextColor={COLORS.black}
                                keyboardType="phone-pad"
                                maxLength={10}
                                style={styles.textInput}
                            />
                            <Text style={styles.label}>Iron:</Text>
                            <SupplementCounter
                                value={newVisit.iron}
                                onIncrement={() => setNewVisit({...newVisit, iron: newVisit.iron + 1})}
                                onDecrement={() => setNewVisit({...newVisit, iron: Math.max(0, newVisit.iron - 1)})}
                            />

                            <Text style={styles.label}>Calcium:</Text>
                            <SupplementCounter
                                value={newVisit.calcium}
                                onIncrement={() => setNewVisit({...newVisit, calcium: newVisit.calcium + 1})}
                                onDecrement={() => setNewVisit({...newVisit, calcium: Math.max(0, newVisit.calcium - 1)})}
                            />

                            <Text style={styles.label}>Protein:</Text>
                            <SupplementCounter
                                value={newVisit.protein}
                                onIncrement={() => setNewVisit({...newVisit, protein: newVisit.protein + 1})}
                                onDecrement={() => setNewVisit({...newVisit, protein: Math.max(0, newVisit.protein - 1)})}
                            />

                            <Text style={styles.label}>Multivitamin:</Text>
                            <SupplementCounter
                                value={newVisit.multivitamin}
                                onIncrement={() => setNewVisit({...newVisit, multivitamin: newVisit.multivitamin + 1})}
                                onDecrement={() => setNewVisit({...newVisit, multivitamin: Math.max(0, newVisit.multivitamin - 1)})}
                            />

                            <Text style={styles.label}>Total No. of Supplements:</Text>
                            <TextInput
                                value={newVisit.totalNoOfJars}
                                onChangeText={(text) => setNewVisit({ ...newVisit, totalNoOfJars: text })}
                                keyboardType="phone-pad"
                                style={styles.textInput}
                            />

                            <Text style={styles.label}>Haemoglobin:</Text>
                            <TextInput
                                value={newVisit.haemoglobin}
                                onChangeText={(text) => setNewVisit({ ...newVisit, haemoglobin: text })}

                                keyboardType="phone-pad"
                                style={styles.textInput}
                            />

                            <Text style={styles.label}>MUAC:</Text>
                            <TextInput
                                value={newVisit.muac}
                                onChangeText={(text) => setNewVisit({ ...newVisit, muac: text })}
                                keyboardType="phone-pad"
                                style={styles.textInput}
                            />

                            <Text style={styles.label}>Weight (Kg):</Text>
                            <TextInput
                                value={newVisit.weight}
                                onChangeText={(text) => setNewVisit({ ...newVisit, weight: text })}
                                keyboardType="phone-pad"
                                style={styles.textInput}
                            />

                            <Text style={styles.label}>Height (cm):</Text>
                            <TextInput
                                value={newVisit.height}
                                onChangeText={(text) => setNewVisit({ ...newVisit, height: text })}
                                keyboardType="phone-pad"
                                style={styles.textInput}
                            />


                            <Text style={styles.label}>Difference:</Text>
                            <TextInput
                                value={newVisit.difference}
                                onChangeText={(text) => setNewVisit({ ...newVisit, difference: text })}
                                style={styles.textInput}
                            />

                            <Text style={styles.label}>Grade:</Text>
                            <TextInput
                                value={newVisit.grade}
                                onChangeText={(text) => setNewVisit({ ...newVisit, grade: text })}
                                style={styles.textInput}
                            />
                            <Text style={styles.label}>Observations & Suggestions:</Text>
                            <TextInput
                                value={newVisit.observations}
                                onChangeText={(text) => setNewVisit({ ...newVisit, observations: text })}
                                style={styles.textInput}
                            />
                            {/* Include other input fields for the new visit */}
                            <TouchableOpacity
                                onPress={handleSaveVisit}
                                style={styles.saveVisitButton}
                            >
                                <Text style={styles.buttonText}>Save Visit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCancelAddVisit}
                                style={styles.cancelVisitButton}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={handleAddVisit}
                            style={styles.addVisitButton}
                        >
                            <Text style={styles.buttonText}>Add Visit</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <Text style={styles.errorText}>Data not found</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 20,
    },
    formDataContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 8,
    },
    fieldContainer: {
        marginBottom: 10,
    },
    subSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: COLORS.black,
    },
    text: {
        fontSize: 16,
        color: COLORS.black,
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    addVisitButton: {
        backgroundColor: 'teal',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    addVisitContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: COLORS.black,
    },
    saveVisitButton: {
        backgroundColor: 'teal',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelVisitButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    visitContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 8,
    },
    visitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    supplementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      supplementCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
      },
      counterButton: {
        backgroundColor: 'teal',  // Set the background color to teal
        borderRadius: 8,
        //padding: 5,
        marginRight: 5, // Add some margin between the buttons
        height: 30, // Set a fixed height
        width: 40,
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
      },
      buttonText: {
        fontSize: 22,
        color: 'white', // Set the text color to white
        // textAlign: 'center',
        // textAlignVertical: 'center', 
        
      },
      counterValue: {
        fontSize: 18,
        paddingHorizontal: 15,
        color: COLORS.black,
        //lineHeight: 30,
      },
    
});

export default GeneralHistoryDisplay;