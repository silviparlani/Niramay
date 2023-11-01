import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
// import NetInfo from '@react-native-community/netinfo';

const ViewForm = ({ route }) => {
  const { anganwadiNo, childsName } = route.params;
  const [formData, setFormData] = useState(null);
  console.log(formData);
  const [siblingsData, setSiblingsData] = useState([]); 
  const [loading, setLoading] = useState(true);
//   const fetchDeviceIpAddress = async () => {
//     try {
//       const state = await NetInfo.fetch();
//       const ipAddress = state.details.ip; // Use 'ip' property
//       console.log('Device IP Address:', ipAddress);
//     } catch (error) {
//       console.error('Error fetching device IP address:', error);
//     }
//   };
  
  // Call the function to fetch the IP address
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          anganwadiNo,
          childsName,
        };
        // fetchDeviceIpAddress();
        const response = await fetch('http://192.168.1.16:3000/getFormData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
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
  useEffect(() => {
    // Fetch sibling data here
    const fetchSiblingData = async () => {
      try {
        const requestData = {
            anganwadiNo,
            childsName,
          };
        const siblingResponse = await fetch('http://192.168.1.16:3000/getSiblingData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (siblingResponse.status === 200) {
          const siblingData = await siblingResponse.json();
          console.log(siblingData);
          setSiblingsData(siblingData);
        } else {
          console.log('Sibling data not found in the database');
        }
      } catch (error) {
        console.error('Error fetching sibling data:', error);
      }
    };

    fetchSiblingData();
  }, [anganwadiNo, childsName]);
//   const renderSiblingData = () => {
//     return siblingsData.map((sibling, index) => (
//       <View key={index} style={styles.fieldContainer}>
//         <Text style={styles.label}>Sibling {index + 1} Name:</Text>
//         <Text style={styles.text}>{sibling.name}</Text>
//         {/* Add more sibling data fields here */}
//       </View>
//     ));
//   };
  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : formData ? (
        <View style={styles.formDataContainer}>
          <View style={styles.fieldContainer}>
          <Text style={styles.subSectionTitle}>Bit Information / बिट माहिती</Text>
            <Text style={styles.label}>Bit Name:</Text>
            <Text style={styles.text}>{formData.bitName}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Anganwadi No.:</Text>
            <Text style={styles.text}>{formData.anganwadiNo}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Anganwadi Assistant Information/अंगणवाडी सहाय्यकांची माहिती </Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Anganwadi Assistance Name:</Text>
            <Text style={styles.text}>{formData.assistantName}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Anganwadi Assistance Phone no. :</Text>
            <Text style={styles.text}>{formData.assistantPhone}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Child Information / मुलांची माहिती</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Child's Name:</Text>
            <Text style={styles.text}>{formData.childName}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Child's DOB:</Text>
            <Text style={styles.text}>{formData.childDob}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Child's Gender</Text>
            <Text style={styles.text}>{formData.childGender}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Parents Phone no.</Text>
            <Text style={styles.text}>{formData.childPhone}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Parent Information / अभिभावकांची माहिती</Text>


          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mother's Name: </Text>
            <Text style={styles.text}>{formData.motherName}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mother's Education:</Text>
            <Text style={styles.text}>{formData.motherEducation}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mothers's Occupation:</Text>
            <Text style={styles.text}>{formData.motherOccupation}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mothers age at Marriage:</Text>
            <Text style={styles.text}>{formData.motherAgeAtMarriage}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mothers age during First Pregnancy:</Text>
            <Text style={styles.text}>{formData.motherAgeAtFirstPregnancy}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Child's weight after Birth:</Text>
            <Text style={styles.text}>{formData.childWeightAfterBirth}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Father's Name: </Text>
            <Text style={styles.text}>{formData.fatherName}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Fathers's Occupation:</Text>
            <Text style={styles.text}>{formData.fatherOccupation}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Father's Education :</Text>
            <Text style={styles.text}>{formData.fatherEducation}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Information of Family / कुटुंबाची माहिती</Text>


          <View style={styles.fieldContainer}>
            <Text style={styles.label}>No. of Total Family Members:</Text>
            <Text style={styles.text}>{formData.totalFamilyMembers}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Total Number of Siblings:</Text>
            <Text style={styles.text}>{formData.TotalSiblings}</Text>
        </View>
        {siblingsData.map((sibling, index) => (
  <View key={index} style={styles.siblingContainer}>
    <View style={styles.siblingRow}>
      <Text style={styles.siblingLabel}>Sibling Name:</Text>
      <Text style={styles.siblingValue}>{sibling.name}</Text>
    </View>
    <View style={styles.siblingRow}>
      <Text style={styles.siblingLabel}>Sibling Age:</Text>
      <Text style={styles.siblingValue}>{sibling.age}</Text>
    </View>
    <View style={styles.siblingRow}>
      <Text style={styles.siblingLabel}>Malnourished:</Text>
      <Text style={styles.siblingValue}>
        {sibling.malnourished === 0 ? 'No' : 'Yes'}
      </Text>
    </View>
  </View>
))}

         
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>Disease History :</Text>
            <Text style={styles.text}>{formData.prevHistory}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Addictions:</Text>
            <Text style={styles.text}>{formData.addictions}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Source of Drinking Water:</Text>
            <Text style={styles.text}>{formData.sourceOfDrinkingWater}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Other:</Text>
            <Text style={styles.text}>{formData.other}</Text>
          </View>
          {/* Add more data fields here with labels and text */}
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
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  subSectionTitle: {
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
    color: '#3f3f3f', // Change the color to make it stand out
    backgroundColor: '#cdf0ff', // Add a background color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  siblingContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  siblingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  siblingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  siblingValue: {
    fontSize: 16,
    color: '#333',
  },
  
});

export default ViewForm;