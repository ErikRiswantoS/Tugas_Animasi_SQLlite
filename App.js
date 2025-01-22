// import React, { useState, useEffect } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import Home from "./screens/Home";
// import ToDoList from "./screens/ToDoList";
// import EditList from "./screens/EditList";
// import Login from "./screens/Login";
// import Settings from "./screens/Settings";
// import Colors from "./constants/Colors";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import 'firebase/auth'





// const Stack = createStackNavigator();
// const AuthStack = createStackNavigator();

// const AuthScreens = () => {
//     return (
//         <AuthStack.Navigator>
//             <AuthStack.Screen name="Login" component={Login} />
//         </AuthStack.Navigator>
//     );
// };

// const Screens = () => {
//     return (
//         <Stack.Navigator>
//             <Stack.Screen name="FireApp" component={Home} />
//             <Stack.Screen name="Settings" component={Settings} />
//             <Stack.Screen
//                 name="ToDoList"
//                 component={ToDoList}
//                 options={({ route }) => {
//                     return {
//                         title: route.params?.title || "Default Title",
//                         headerStyle: {
//                             backgroundColor: route.params?.color || Colors.blue,
//                         },
//                         headerTintColor: "white",
//                     };
//                 }}
//             />
//             <Stack.Screen
//                 name="Edit"
//                 component={EditList}
//                 options={({ route }) => {
//                     return {
//                         title: route.params?.title
//                             ? `Edit ${route.params.title} list`
//                             : "Create new list",
//                         headerStyle: {
//                             backgroundColor: route.params?.color || Colors.blue,
//                         },
//                         headerTintColor: "white",
//                     };
//                 }}
//             />
//         </Stack.Navigator>
//     );
// };

// export default function App() {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const auth = getAuth();

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             setIsAuthenticated(!!user);
//         });

//         return unsubscribe; // Unsubscribe on cleanup
//     }, [auth]);

//     return (
//         <NavigationContainer>
//             {isAuthenticated ? <Screens /> : <AuthScreens />}
//         </NavigationContainer>
//     );
// }

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import ToDoList from "./screens/ToDoList";
import Settings from "./screens/Settings";
import EditList from "./screens/EditList";
import Login from "./screens/Login";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });
        return unsubscribe;
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="Settings" component={Settings} />
                        <Stack.Screen name="ToDoList" component={ToDoList} />
                        <Stack.Screen name="Edit" component={EditList} />
                    </>
                ) : (
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
