import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import an icon library of your choice

const options = [
  { key: 'option1', label: 'Total Children Per Bit', icon: 'rocket' }, // Add icon names here
  { key: 'option2', label: 'Grade Distribution Per Bit and Visit', icon: 'bell' },
  { key: 'option3', label: 'BitName VS GenderGraph ', icon: 'star' },
  // { key: 'option4', label: 'Option 4', icon: 'heart' },
  // Add more options as needed
];

const ConsolidatedReports = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => {
              // Check if "Option 1" is selected
              if (item.key === 'option1') {
                navigation.navigate('BitNamevsGender'); // Navigate to BitNamevsGender screen
              }


              if (item.key === 'option2') {
                navigation.navigate('GradeDistribution'); // Navigate to BitNamevsGender screen
              }

              if (item.key === 'option3') {
                navigation.navigate('BitNamevsGenderGraph'); // Navigate to BitNamevsGender screen
              }
              // You can add similar logic for other options if needed
              // if (item.key === 'option3') {
              //   navigation.navigate('AnganwadiCountvsBit_name'); // Navigate to BitNamevsGender screen
              // }
            }}
          >
            <View style={styles.optionRow}>
              <Icon name={item.icon} size={24} color="#333" style={styles.icon} />
              <Text style={styles.optionLabel}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 20,
    padding: 50, // Increased padding between rows
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
    height:100,
    borderRadius: 10,
    marginBottom: 10, // Increased margin to create more spacing between rows
    backgroundColor: '#FFF', // Background color
    shadowColor: '#888', // Shadow color
    shadowOffset: { width: 0, height: 3 }, // Shadow offset
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 5, // Shadow radius
    elevation: 5, // Android shadow elevation
  },
  icon: {
    marginRight: 10,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ConsolidatedReports;
