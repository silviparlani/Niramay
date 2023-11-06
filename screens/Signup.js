import { View, Text, Image, Pressable, TextInput, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../components/Button';

const Signup = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Assistant'); // Initial selected option
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailValidationMessage, setEmailValidationMessage] = useState('');
    const [passwordValidationMessage, setPasswordValidationMessage] = useState('');

    const options = ['Assistant', 'Doctor', 'Supervisor'];

    const validateEmail = (email) => {
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      
        if (!emailPattern.test(email)) {
          setEmailValidationMessage('Please enter a valid email address');
        } else {
          setEmailValidationMessage('');
        }
      };
    
      const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?=.{8,})/;
        return passwordPattern.test(password);
      };

    const handleSignUp = () => {
    const userData = {
      name: name,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      post: selectedOption,
    };

    if (!emailValidationMessage) {
      if (!validatePassword(password)) {
        setPasswordValidationMessage('Password does not meet the criteria.');
        return;
      }

      setPasswordValidationMessage('');
      
      fetch('http://10.1.20.103:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {   
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          navigation.navigate('Login');
        })
        .catch((error) => {
          console.error('Error signing up: ', error);
        });
    }
  };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 5 }}>
                    

                    
                </View>
                <View style={{ marginBottom: 12 }}>
  <Text style={{
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 8
  }}>Name / नाव</Text>

  <View style={{
    width: "100%",
    height: 45,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 22
  }}>
    <TextInput
      placeholder='Enter your full name'
      placeholderTextColor={COLORS.black}
      style={{
        width: "100%"
      }}
      value={name}
      onChangeText={(text) => setName(text)}
    />
  </View>
</View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 400,
                        marginVertical: 5
                    }}>Email address / ईमेल</Text>

                    <View style={{
                        width: "100%",
                        height: 45,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
              placeholder='Enter your email address'
              placeholderTextColor={COLORS.black}
              keyboardType='email-address'
              style={{
                width: "100%"
              }}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                validateEmail(text);
              }}
            />
          </View>
          {/* Email validation message */}
          {emailValidationMessage ? (
            <Text style={{ color: 'red' }}>{emailValidationMessage}</Text>
          ) : null}
        </View>


        <View style={{ marginBottom: 12 }}>
          <Text style={{
            fontSize: 17,
            fontWeight: 400,
            marginVertical: 5
          }}>Password / पासवर्ड</Text>
          <View style={{
            width: "100%",
            height: 45,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 22
          }}>
            <TextInput
              placeholder='Enter your password'
              placeholderTextColor={COLORS.black}
              secureTextEntry={isPasswordShown}
              style={{
                width: "100%"
              }}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                const isValid = validatePassword(text);
                if (!isValid) {
                    setPasswordValidationMessage('Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and a minimum length of 8 characters.');
                } else {
                  setPasswordValidationMessage('');
                }
              }}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12
              }}
            >
              {
                isPasswordShown ? (
                  <Ionicons name="eye-off" size={24} color={COLORS.black} />
                ) : (
                  <Ionicons name="eye" size={24} color={COLORS.black} />
                )
              }
            </TouchableOpacity>
          </View>
          {passwordValidationMessage ? (
            <Text style={{ color: 'red' }}>{passwordValidationMessage}</Text>
          ) : null}
        </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 400,
                        marginVertical: 5
                    }}>Mobile Number / फोन नंबर</Text>

                    <View style={{
                        width: "100%",
                        height: 45,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='+91'
                            placeholderTextColor={COLORS.black}
                            keyboardType='numeric'
                            style={{
                                width: "12%",
                                borderRightWidth: 1,
                                borderLeftColor: COLORS.grey,
                                height: "100%"
                            }}
                            
                        />

                        <TextInput
                            placeholder='Enter your phone number'
                            placeholderTextColor={COLORS.black}
                            keyboardType='numeric'
                            maxLength={10}
                            style={{
                                width: "80%"
                            }}
                            value={phoneNumber}
                            onChangeText={(text) => setPhoneNumber(text)}
                        />
                    </View>

                     {/* Dropdown */}
                     <View style={{ marginBottom: 12 }}>
  <Text style={{
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 5
  }}>Post / हुददा</Text>
  <View style={{
    borderWidth: 1,          
    borderColor: COLORS.black, 
    borderRadius: 8,          
  }}>
 {/* <Picker
  selectedValue={selectedOption}
  onValueChange={(itemValue, itemIndex) => setSelectedOption(itemValue)}
  style={{ height: 45, textAlign: 'center'}} 
>
  {options.map((option, index) => (
    <Picker.Item key={index} label={option} value={option} />
  ))}
</Picker> */}
  </View>
</View>

                </View>

                <View style={{
                    flexDirection: 'row',
                    marginVertical: 3
                }}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        value={isChecked}
                        onValueChange={(value) => {
                            setIsChecked(value);
                            console.log('isChecked:', value); // Add this line
                          }}
                        color={isChecked ? COLORS.theme : undefined}
                        />

                    <Text>I agree to the terms and conditions</Text>
                </View>
                <Button
                    title="Sign Up"
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                        backgroundColor: COLORS.theme,
                        borderColor: COLORS.theme,
                        borderWidth: 1,
                        borderRadius: 8
                    }}
                    titleStyle={{
                        color: 'white'
                    }}
                    onPress={handleSignUp}
                    disabled={!isChecked} // Disable the button if isChecked is false
                    >
                        {console.log('Button disabled:', !isChecked)}
                    </Button>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10
                        }}
                    />
                    <Text style={{ fontSize: 14 }}>Or Sign up with</Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10
                        }}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    

                    <TouchableOpacity
                        onPress={() => console.log("Pressed")}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 50,
                            width:1,
                            borderWidth: 1,
                            borderColor: COLORS.grey,
                            marginRight: 4,
                            borderRadius: 10,
                            
                        }}
                    >
                        <Image
                            source={require("../assets/google.png")}
                            style={{
                                height: 36,
                                width: 25,
                                marginRight: 8
                                
                            }}
                            resizeMode='contain'
                        />

                        <Text style={{ fontSize: 16, color: COLORS.black }}>Google</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 15
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Already have an account?</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.theme,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Signup