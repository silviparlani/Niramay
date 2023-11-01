import React from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import IsChildAlreadyPresent from './IsChildAlreadyPresent';
import { useNavigation } from '@react-navigation/native';
import ConsolidatedReports from './ConsolidatedReports';

const HomePage = () => {
  const navigation = useNavigation();
  const goToConsolidatedReports = () => {
    navigation.navigate('ConsolidatedReports'); // This should match the name of your screen in your navigation stack
  };
  
  // Define a function to navigate to the PersonalInformation screen
  const goToPersonalInformation = () => {
    navigation.navigate('IsChildAlreadyPresent'); // This should match the name of your screen in your navigation stack
  };
  const goToPhysicalCheckupInformation = () => {
    navigation.navigate('ChildPresent', {
      navigationSource: 'PhysicalCheckupInformation',
    });
    // This should match the name of your screen in your navigation stack
  };
  const goToReports = () => {
    navigation.navigate('IsChild'); // This should match the name of your screen in your navigation stack
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/bg11.jpg')}
        style={styles.image}
      />
      {/* <Text style={styles.overlayText}>NIRAMAY BHARAT</Text> */}
      <View style={styles.searchContainer}>
        <View style={styles.searchIconContainer}>
          <Icon name="search" size={20} color="#ffffff" style={styles.searchIcon} />
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#ffffff"
        />
      </View>
      <Text style={styles.menuHeading}>Menu</Text>
      <View style={styles.menuContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.menuItem1} onPress={goToPersonalInformation}>
            <Icon name="user" size={50} color="teal" />
            <Text style={styles.menuItemText}>Child Personal Information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem2} onPress={goToPhysicalCheckupInformation}>
            <Icon name="heartbeat" size={50} color="#d30000" />
            <Text style={styles.menuItemText}>Physical Checkup Information</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.menuItem3} onPress={goToReports}>
            <Icon name="file" size={50} color="#2b547e" />
            <Text style={styles.menuItemText}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem4} onPress={goToConsolidatedReports}>
            <Icon name="clipboard" size={50} color="#0f6557" />
            <Text style={styles.menuItemText}>Consolidated Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  overlayText: {
    position: 'absolute',
    top: 20, // Adjust the position as needed
    left: 20, // Adjust the position as needed
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 1, // Make sure it's above the image
  },
  searchContainer: {
    position: 'absolute',
    top: 80,
    left: '50%',
    transform: [{ translateX: -160 }],
    flexDirection: 'row', // Align icon and input horizontally
    alignItems: 'center', // Center vertically
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 28,
    color: '#ffffff',
    marginTop: 120, // Adjust as needed
    width: 320,
  },
  searchIconContainer: {
    padding: 10,
    marginLeft: 10,
  },
  searchIcon: {
    color: '#ffffff',
  },
  searchBar: {
    flex: 1, // Take remaining space in the row
    padding: 10,
    color: '#ffffff',
  },
  menuHeading: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'grey',
    marginTop: 10,
    marginLeft: 20,
    padding: 15,
  },
  menuContainer: {
    alignItems: 'center',
    justifyContent: 'center', // Center-align the menus
    paddingBottom: 20, // Adjust as needed
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, // Add some vertical gap between rows
    marginLeft: 20, // Add some horizontal gap between
  },
  menuItem1: {
    backgroundColor: '#c9f6ff',
    width: '40%',
    aspectRatio: 1, // Maintain a square shape
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center', // Center both icon and text
    marginRight: 20, // Add horizontal gap between columns
  },
  menuItem2: {
    backgroundColor: '#f5e4e4',
    width: '40%',
    aspectRatio: 1, // Maintain a square shape
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center', // Center both icon and text
    marginRight: 20, // Add horizontal gap between columns
  },
  menuItem3: {
    backgroundColor: '#eee1ff',
    width: '40%',
    aspectRatio: 1, // Maintain a square shape
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center', // Center both icon and text
    marginRight: 20, // Add horizontal gap between columns
  },
  menuItem4: {
    backgroundColor: '#d7f5d3',
    width: '40%',
    aspectRatio: 1, // Maintain a square shape
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center', // Center both icon and text
    marginRight: 20, // Add horizontal gap between columns
  },
  menuItemText: {
    color: 'black',
    fontSize: 15,
    marginTop: 15,
    textAlign: 'center',
  },
});

export default HomePage;