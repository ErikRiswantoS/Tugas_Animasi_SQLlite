import React, { useState, useRef } from "react";
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    Dimensions,
    Animated,
    KeyboardAvoidingView,
    Platform 
} from "react-native";
import Button from "../components/Button";
import LabeledInput from "../components/LabeledInput";
import Colors from "../constants/Colors";
import validator from "validator";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
    const [isCreateMode, setCreateMode] = useState(false);
    const [emailField, setEmailField] = useState({ text: "", errorMessage: "" });
    const [passwordField, setPasswordField] = useState({ text: "", errorMessage: "" });
    const [passwordReentryField, setPasswordReentryField] = useState({ text: "", errorMessage: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const lottieRef = useRef(null);

    // Animasi saat komponen mount
    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            if (isCreateMode) {
                await handleCreateAccount(emailField.text, passwordField.text);
            } else {
                await handleLogin(emailField.text, passwordField.text);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAccount = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(firestore, "users", user.uid), {});
            console.log("Account created successfully!");
        } catch (error) {
            console.error("Account creation failed:", error.message);
        }
    };

    const handleLogin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in successfully!");
        } catch (error) {
            console.error("Login failed:", error.message);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Animatable.View 
                animation="fadeInDown" 
                duration={1500}
                style={styles.headerContainer}
            >
                <Text style={styles.header}>Login</Text>
                {isLoading && (
                    <LottieView
                        ref={lottieRef}
                        source={require('../animations/loading.json')}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />
                )}
            </Animatable.View>

            <Animatable.View 
                animation="fadeInUp"
                duration={1500} 
                style={styles.inputContainer}
            >
                <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={24} color={Colors.gray} style={styles.icon} />
                    <LabeledInput
                        label="Email"
                        text={emailField.text}
                        onChangeText={(text) => setEmailField({ text, errorMessage: "" })}
                        errorMessage={emailField.errorMessage}
                        labelStyle={styles.label}
                        autoCompleteType="email"
                        containerStyle={styles.input}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={24} color={Colors.gray} style={styles.icon} />
                    <LabeledInput
                        label="Password"
                        text={passwordField.text}
                        onChangeText={(text) => setPasswordField({ text, errorMessage: "" })}
                        secureTextEntry={!showPassword}
                        errorMessage={passwordField.errorMessage}
                        labelStyle={styles.label}
                        autoCompleteType="password"
                        containerStyle={styles.input}
                    />
                    <TouchableOpacity 
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons 
                            name={showPassword ? "eye-off-outline" : "eye-outline"} 
                            size={24} 
                            color={Colors.gray} 
                        />
                    </TouchableOpacity>
                </View>

                {isCreateMode && (
                    <Animatable.View 
                        animation="fadeIn"
                        duration={500}
                        style={styles.inputWrapper}
                    >
                        <Ionicons name="lock-closed-outline" size={24} color={Colors.gray} style={styles.icon} />
                        <LabeledInput
                            label="Re-enter Password"
                            text={passwordReentryField.text}
                            onChangeText={(text) => setPasswordReentryField({ text, errorMessage: "" })}
                            secureTextEntry={!showPassword}
                            errorMessage={passwordReentryField.errorMessage}
                            labelStyle={styles.label}
                            containerStyle={styles.input}
                        />
                    </Animatable.View>
                )}

                <TouchableOpacity 
                    onPress={() => setCreateMode(!isCreateMode)}
                    style={styles.toggleButton}
                >
                    <Text style={styles.toggleModeText}>
                        {isCreateMode ? "Already have an account?" : "Create new account"}
                    </Text>
                </TouchableOpacity>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" delay={500}>
                <Button 
                    onPress={handleSubmit} 
                    buttonStyle={styles.buttonStyle} 
                    text={isCreateMode ? "Create Account" : "Login"}
                    loading={isLoading}
                />
            </Animatable.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
        padding: 26,
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: height * 0.2,
    },
    inputContainer: {
        flex: 1,
        justifyContent: "center",
        marginVertical: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 19,
        paddingHorizontal: 10,
        
    },
    icon: {
        marginRight: 10,
    },
    eyeIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        
    },
    label: {
        fontSize: width * 0.04,
        fontWeight: "bold",
        color: Colors.black,
        marginBottom: 5,
    },
    header: {
        fontSize: width * 0.15,
        color: Colors.red,
        marginTop: height * 0.02,
    },
    toggleButton: {
        alignItems: 'center',
        marginTop: 20,
    },
    toggleModeText: {
        color: Colors.blue,
        fontSize: width * 0.04,
    },
    buttonStyle: {
        backgroundColor: Colors.red,
        paddingVertical: height * 0.02,
        borderRadius: width * 0.02,
        marginBottom: 29,
    },
    lottie: {
        width: 100,
        height: 100,
    },
});