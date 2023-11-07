import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, SafeAreaView, Pressable } from 'react-native';
import COLORS from '../constants/colors';
import Checkbox from '@react-native-community/checkbox';
import Button from '../components/Button';
import { API_URL } from './config.js';
import eyeImage from '../assets/view.png';
import eyeOffImage from '../assets/hide.png';
import ModalDropdown from 'react-native-modal-dropdown'; // Import the ModalDropdown component

const Signup = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Assistant');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const options = ['Assistant', 'Doctor', 'Supervisor'];

    const handleSignUp = () => {
        const userData = {
            name: name,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            post: selectedOption,
        };

        fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                navigation.navigate('Login');
            })
            .catch((error) => {
                console.error('Error signing up: ', error);
            });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 5 }}>
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        color: COLORS.black,
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
                            placeholder='Enter your name'
                            placeholderTextColor={COLORS.black}
                            style={{
                                color: COLORS.black,
                                width: "100%"
                            }}
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        color: COLORS.black,
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
                                color: COLORS.black,
                                width: "100%"
                            }}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        color: COLORS.black,
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
                                color: COLORS.black,
                                width: "100%"
                            }}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
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
                                    <Image source={eyeImage} style={{ width: 24, height: 24 }} />
                                ) : (
                                    <Image source={eyeOffImage} style={{ width: 24, height: 24 }} />
                                )
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        color: COLORS.black,
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
                                color: COLORS.black,
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
                            style={{
                                color: COLORS.black,
                                width: "80%"
                            }}
                            value={phoneNumber}
                            onChangeText={(text) => setPhoneNumber(text)}
                        />
                    </View>
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 400,
                        marginVertical: 5
                    }}>Post / हुददा</Text>
                    <ModalDropdown
                        options={options}
                        defaultValue={selectedOption}
                        textStyle={{ fontSize: 16, color: COLORS.black }}
                        dropdownTextStyle={{ fontSize: 16, color: COLORS.black }}
                        onSelect={(index, value) => setSelectedOption(value)}
                        style={{
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                        }}
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    marginVertical: 3
                }}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        value={isChecked}
                        onValueChange={setIsChecked}
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
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10
                        }}
                    />
                    <Text style={{ fontSize: 14, color: COLORS.black }}>Or Sign up with</Text>
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
                            width: 1,
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

export default Signup;