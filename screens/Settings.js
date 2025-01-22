import React from "react";
import { View } from "react-native";
import Button from "../components/Button";
import { auth } from "../firebaseConfig"; // import the auth object from your Firebase configuration
import { signOut } from "firebase/auth";
// import { auth } from "firebase";



export default () => {
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <Button
                text="Log out"
                onPress={async () => {
                    try {
                        await signOut(auth);
                    } catch (error) {
                        console.error("Error signing out:", error);
                    }
                }}
            />
        </View>
    );
};
