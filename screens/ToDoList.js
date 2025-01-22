import React, { useState, useLayoutEffect, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from "react-native";
import ToDoItem from "../components/ToDoItem";
import Colors from "../constants/Colors";
import {
    onSnapshot,
    addDoc,
    removeDoc,
    updateDoc,
} from "../services/collections";
import { firestore, auth } from "../firebaseConfig";
import { collection, doc } from "firebase/firestore";

const renderAddListIcon = (addItem) => {
    return (
        <TouchableOpacity onPress={() => addItem()}>
            <Text style={styles.icon}>+</Text>
        </TouchableOpacity>
    );
};

export default ({ navigation, route }) => {
    const [toDoItems, setToDoItems] = useState([]);
    const [newItem, setNewItem] = useState(null);

    // Membuat referensi collection dengan benar
    const toDoItemsRef = auth.currentUser
        ? collection(
              doc(firestore, "users", auth.currentUser.uid, "lists", route.params.listId),
              "todoItems"
          )
        : null;

    useEffect(() => {
        if (!auth.currentUser) {
            navigation.replace("Login");
            return;
        }

        // Menambahkan unsubscribe untuk cleanup
        const unsubscribe = toDoItemsRef
            ? onSnapshot(
                  toDoItemsRef,
                  (newToDoItems) => {
                      setToDoItems(newToDoItems);
                  },
                  {
                      sort: (a, b) => {
                          if (a.isChecked && !b.isChecked) return 1;
                          if (b.isChecked && !a.isChecked) return -1;
                          return 0;
                      },
                  }
              )
            : () => {};

        return () => unsubscribe();
    }, [toDoItemsRef]);

    const addItemToLists = () => {
        setNewItem({ text: "", isChecked: false, new: true });
    };

    const removeItemFromLists = (index) => {
        const updatedItems = [...toDoItems];
        updatedItems.splice(index, 1);
        setToDoItems(updatedItems);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => renderAddListIcon(addItemToLists),
        });
    }, [navigation]);

    // Menggabungkan items untuk render
    const itemsToRender = newItem ? [newItem, ...toDoItems] : toDoItems;

    return (
        <View style={styles.container}>
            <FlatList
                data={itemsToRender}
                renderItem={({
                    item: { id, text, isChecked, ...params },
                    index,
                }) => {
                    return (
                        <ToDoItem
                            {...params}
                            text={text}
                            isChecked={isChecked}
                            onChecked={async () => {
                                try {
                                    const data = { 
                                        text, 
                                        isChecked: !isChecked,
                                        updatedAt: new Date().toISOString()
                                    };
                                    if (id) {
                                        await updateDoc(toDoItemsRef, id, data);
                                    } else {
                                        await addDoc(toDoItemsRef, data);
                                    }
                                } catch (error) {
                                    console.error("Error updating todo item:", error);
                                }
                            }}
                            onChangeText={(newText) => {
                                if (params.new) {
                                    setNewItem({
                                        text: newText,
                                        isChecked,
                                        new: params.new,
                                    });
                                } else {
                                    const updatedItems = [...toDoItems];
                                    updatedItems[index].text = newText;
                                    setToDoItems(updatedItems);
                                }
                            }}
                            onDelete={async () => {
                                try {
                                    if (params.new) {
                                        setNewItem(null);
                                    } else {
                                        removeItemFromLists(index);
                                        if (id) {
                                            await removeDoc(toDoItemsRef, id);
                                        }
                                    }
                                } catch (error) {
                                    console.error("Error deleting todo item:", error);
                                }
                            }}
                            onBlur={async () => {
                                try {
                                    if (text.length > 1) {
                                        const data = { 
                                            text, 
                                            isChecked,
                                            updatedAt: new Date().toISOString()
                                        };
                                        if (id) {
                                            await updateDoc(toDoItemsRef, id, data);
                                        } else {
                                            await addDoc(toDoItemsRef, data);
                                        }
                                        if (params.new) {
                                            setNewItem(null);
                                        }
                                    } else {
                                        if (params.new) {
                                            setNewItem(null);
                                        } else {
                                            removeItemFromLists(index);
                                            if (id) {
                                                await removeDoc(toDoItemsRef, id);
                                            }
                                        }
                                    }
                                } catch (error) {
                                    console.error("Error handling blur:", error);
                                }
                            }}
                        />
                    );
                }}
                keyExtractor={(item, index) => item.id || `new-${index}`}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    icon: {
        padding: 5,
        fontSize: 32,
        color: "white",
    },
});