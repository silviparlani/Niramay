import React, { useState, useEffect } from 'react';
import { View, Text,TextInput, ActivityIndicator, StyleSheet, ScrollView,TouchableOpacity,Switch} from 'react-native';
// import NetInfo from '@react-native-community/netinfo';
import { API_URL } from './config.js';
const ViewForm = ({ route }) => {
  const { anganwadiNo, childsName } = route.params;
  const [formData, setFormData] = useState(null);
  const [siblingsData, setSiblingsData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [siblings, setSiblings] = useState([]);
  const [updatedSiblings, setUpdatedSiblings] = useState([]);
  


  const handleAddSibling = () => {
    setSiblings([...siblings, { name: '', age: '', malnourished: false }]);
    const newSibling = { name: '', age: '', malnourished: false };
      setUpdatedSiblings([...updatedSiblings, newSibling]);

  };

  const handleRemoveSibling = (index) => {
    const updatedSiblings = [...siblings];
    updatedSiblings.splice(index, 1);
    setSiblings(updatedSiblings);
  };

  const handleSiblingFieldChange = (index, field, value) => {
    const updatedSiblings = [...siblings];
    updatedSiblings[index][field] = value;
    setSiblings(updatedSiblings);
  };
  
  const handleSaveChanges = async () => {
    try {
      // Prepare the data to be sent to the server
      const requestData = {
        anganwadiNo,
        childsName,
        siblings: siblings, // Updated siblings data
      };
      console.log("hello");
    console.log(requestData);
      // Send a POST request to save the siblings data
      
      const response = await fetch(`${API_URL}/submit-sibling`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.status === 200) {
        // Data saved successfully, you can perform any additional actions here
        console.log('Siblings data saved successfully');
      } else {
        console.log('Failed to save siblings data');
      }
    } catch (error) {
      console.error('Error saving siblings data:', error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          anganwadiNo,
          childsName,
        };
        // fetchDeviceIpAddress();
        const response = await fetch(`${API_URL}/getFormData`, {
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
  useEffect(() => {
    // Fetch sibling data here
    const fetchSiblingData = async () => {
      try {
        const requestData = {
            anganwadiNo,
            childsName,
          };
        const siblingResponse = await fetch(`${API_URL}/getSiblingData`, {
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
            <Text style={styles.text}>{formData.bit_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Anganwadi No.:</Text>
            <Text style={styles.text}>{formData.anganwadi_no}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Anganwadi Assistant Information/अंगणवाडी सहाय्यकांची माहिती </Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Anganwadi Assistance Name:</Text>
            <Text style={styles.text}>{formData.assistant_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Anganwadi Assistance Phone no. :</Text>
            <Text style={styles.text}>{formData.assistant_phone}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Child Information / मुलांची माहिती</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Child's Name:</Text>
            <Text style={styles.text}>{formData.child_name}</Text>
          </View>

          
          <View style={styles.fieldContainer}>
  <Text style={styles.label}>Child's DOB:</Text>
  <Text style={styles.text}>
    {formData.child_dob ? new Date(formData.child_dob).toISOString().split('T')[0] : 'N/A'}
  </Text>
</View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Child's Gender</Text>
            <Text style={styles.text}>{formData.child_gender}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Parents Phone no.</Text>
            <Text style={styles.text}>{formData.child_phone}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Parent Information / अभिभावकांची माहिती</Text>


          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mother's Name: </Text>
            <Text style={styles.text}>{formData.mother_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mother's Education:</Text>
            <Text style={styles.text}>{formData.mother_education}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mothers's Occupation:</Text>
            <Text style={styles.text}>{formData.mother_occupation}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mothers age at Marriage:</Text>
            <Text style={styles.text}>{formData.mother_age_at_marriage}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mothers age during First Pregnancy:</Text>
            <Text style={styles.text}>{formData.mother_age_at_first_pregnancy}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Child's weight after Birth:</Text>
            <Text style={styles.text}>{formData.child_weight_after_birth}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Father's Name: </Text>
            <Text style={styles.text}>{formData.father_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Fathers's Occupation:</Text>
            <Text style={styles.text}>{formData.father_occupation}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Father's Education :</Text>
            <Text style={styles.text}>{formData.father_education}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Information of Family / कुटुंबाची माहिती</Text>


          <View style={styles.fieldContainer}>
            <Text style={styles.label}>No. of Total Family Members:</Text>
            <Text style={styles.text}>{formData.total_family_members}</Text>
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

{siblings.map((sibling, index) => (
  <View key={index} style={styles.siblingTableRow}>
    {/* Sibling Name */}
    <TextInput
      style={[styles.siblingTableCell, { flex: 2 },]}
      value={sibling.name}
      onChangeText={(value) => handleSiblingFieldChange(index, 'name', value)}
      placeholder={`Enter name`}
    />
    {/* Sibling Age */}
    <TextInput
      style={[styles.siblingTableCell, { flex: 1 }]}
      value={sibling.age}
      onChangeText={(value) => handleSiblingFieldChange(index, 'age', value)}
      placeholder={`Age`}
      keyboardType="numeric"
    />
    {/* Malnourished */}
    <View style={[styles.siblingTableCell, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
      <Switch
        value={sibling.malnourished}
        onValueChange={(value) => handleSiblingFieldChange(index, 'malnourished', value)}
      />
    </View>
    
    {/* Remove Sibling Button */}
    <TouchableOpacity onPress={() => handleRemoveSibling(index)} style={styles.removeButton}>
      <Text style={styles.removeButtonText}>Remove</Text>
    </TouchableOpacity>
  </View>
))}
<TouchableOpacity style={styles.addButton} onPress={handleAddSibling}>
        <Text style={styles.addButtonLabel}>Add</Text>
      </TouchableOpacity>
   {/* Save Changes Button */}
   <TouchableOpacity style={styles.saveChangesButton} onPress={handleSaveChanges}>
            <Text style={styles.saveChangesButtonText}>Save Changes</Text>
          </TouchableOpacity>

         
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
            <Text style={styles.text}>{formData.source_of_drinking_water}</Text>
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
  separator: {
    height: 1,
    backgroundColor: 'gray', // Choose a color for the separator line
    marginVertical: 5,
    marginBottom: 20,
  },
  siblingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'teal',
    paddingVertical: 8,
    paddingHorizontal: 12,
 
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  addButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  siblingTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 85,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  siblingTableHeaderCell: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 8,
   
  },
  siblingTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  siblingTableCell: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    // flex: 1,
  },
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 12,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop:8
  },
  checkboxChecked: {
    backgroundColor: 'teal',
    borderColor: 'teal',
  },
  checkboxLabel: {
    fontSize: 16,
    marginTop:8
  },
 
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 45, // Adjust the height as needed
    textAlignVertical: 'center', // Start typing from the top
  },
  
  
});

export default ViewForm;