// import { View, Text, Pressable, Image, Dimensions, StyleSheet } from 'react-native';
// import React from 'react';
// import { LinearGradient } from "expo-linear-gradient";
// import COLORS from '../constants/colors';
// import Button from '../components/Button';

// const Welcome = ({ navigation }) => {
//     const windowHeight = Dimensions.get('window').height;

//     return (
//         <View style={styles.container}>
//             <Image
//                 source={require('../assets/bg1.jpg')}
//                 style={styles.backgroundImage}
//             />
//             <LinearGradient
//                 style={styles.overlay}
//                 colors={[COLORS.black, COLORS.black]}
//             >
//                 <View style={styles.contentContainer}>
//                     <View style={styles.logoContainer}>
//                         <Image
//                             source={require('../assets/logo1.jpg')}
//                             style={styles.logoImage}
//                         />
//                     </View>
//                     <Text style={styles.title}>NIRAMAY</Text>
//                     <Text style={styles.title}>BHARAT</Text>
//                     <Text style={styles.subtitle}>सर्वे पि सुखिनः सन्तु | सर्वे सन्तु निरामय: ||</Text>
//                     <Button
//                         title="Join Now"
//                         onPress={() => navigation.navigate("Signup")}
//                         filled
//                         style={styles.joinButton}
//                     />
//                     <View style={styles.loginContainer}>
//                         <Text style={styles.loginText}>Already have an account?</Text>
//                         <Pressable
//                             onPress={() => navigation.navigate("Login")}
//                         >
//                             <Text style={styles.loginLink}>Login</Text>
//                         </Pressable>
//                     </View>
//                 </View>
//             </LinearGradient>
//         </View>
//     );
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        position: 'absolute',
        width: '100%',
        height: '68%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 22,
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "65%",
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    logoContainer: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    logoImage: {
        width: 90,
        height: 95,
    },
    title: {
        fontSize: 46,
        fontWeight: '800',
        color: COLORS.white,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 22,
        color: COLORS.white,
        textAlign: 'center',
        marginTop: 15,
    },
    joinButton: {
        marginTop: 15,
        width: "100%",
        backgroundColor: COLORS.theme,
        fontWeight: "bold",
        alignSelf: 'center',
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    loginText: {
        fontSize: 16,
        color: COLORS.white,
    },
    loginLink: {
        fontSize: 16,
        color: COLORS.white,
        fontWeight: "bold",
        marginLeft: 4,
    },
});



import { View, Text, Pressable, Image, Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient'; // Import from the library
import COLORS from '../constants/colors';
import Button from '../components/Button';

const Welcome = ({ navigation }) => {
    const windowHeight = Dimensions.get('window').height;

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/bg1.jpg')}
                style={styles.backgroundImage}
            />
            <LinearGradient
                style={styles.overlay}
                colors={[COLORS.black, COLORS.black]}
            >
                <View style={styles.contentContainer}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/logo1.jpg')}
                            style={styles.logoImage}
                        />
                    </View>
                    <Text style={styles.title}>NIRAMAY</Text>
                    <Text style={styles.title}>BHARAT</Text>
                    <Text style={styles.subtitle}>सर्वे पि सुखिनः सन्तु | सर्वे सन्तु निरामय: ||</Text>
                    <Button
                        title="Join Now"
                        onPress={() => navigation.navigate("Signup")}
                        filled
                        style={styles.joinButton}
                    />
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account?</Text>
                        <Pressable
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={styles.loginLink}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

// Rest of your styles and export statement remains the same

export default Welcome;
