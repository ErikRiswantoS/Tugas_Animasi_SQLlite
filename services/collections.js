import { 
    collection, 
    doc, 
    onSnapshot as firebaseOnSnapshot,
    setDoc,
    deleteDoc,
    addDoc as firebaseAddDoc
} from "firebase/firestore";

export const onSnapshot = (ref, callback, options) => {
    return firebaseOnSnapshot(ref, (snapshot) => {
        let items = snapshot.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id;
            return data;
        });
        items = options && options.sort ? items.sort(options.sort) : items;
        callback(items);
    });
};

export const addDoc = async (ref, data) => {
    try {
        const { id } = data;
        if (id) {
            await setDoc(doc(ref, id), data);
        } else {
            await firebaseAddDoc(ref, data);
        }
        console.log("Document added!");
    } catch (error) {
        console.error("Error adding document:", error);
    }
};

export const removeDoc = async (ref, id) => {
    try {
        await deleteDoc(doc(ref, id));
        console.log(`Document ${id} deleted!`);
    } catch (error) {
        console.error("Error removing document:", error);
    }
};

export const updateDoc = async (ref, id, data) => {
    try {
        await setDoc(doc(ref, id), data);
        console.log(`Document ${id} updated!`);
    } catch (error) {
        console.error("Error updating document:", error);
    }
};