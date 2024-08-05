import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  FlatList,
} from "react-native";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";
import { router } from "expo-router";

export default function home() {
  //expo install firebase @react-native-firebase/firestore
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [userId, setUserId] = useState(null);

  const [data, setData] = useState([]);
  const [time, setTime] = useState("");
  const [editId, setEditId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "projects"),
        where("userId", "==", getAuth().currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      //const querySnapshot = await getDocs(collection(db, "projects"));
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(newData);
      setUserId(getAuth().currentUser.uid);
    };

    fetchData();
  }, [time]);

  const createData = async (data) => {
    try {
      await addDoc(collection(db, "projects"), data);
      console.log("Data created successfully");
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const deleteData = async (id) => {
    try {
      const docRef = doc(db, "projects", id);
      await deleteDoc(docRef);
      console.log("Data deleted successfully");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const updateData = async (id, newData) => {
    try {
      const docRef = doc(db, "projects", id);
      await updateDoc(docRef, newData);
      console.log("Data updated successfully");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
      style={styles.flatList}
        data={data}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.part}>{index + 1}</Text>
            <TouchableOpacity style={styles.part}
              onPress={() => {
                router.push("notes/" + item.id);
              }}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
            <Text style={styles.part}>{item.age}</Text>
            <TouchableOpacity style={styles.part}>
              <Ionicons
                name="trash"
                size={30}
                color="red"
                onPress={() => {
                  deleteData(item.id);
                  setTime(Date.now().toString());
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.part}
              onPress={() => {
                setEditId(item.id);
                setName(item.name);
                setAge(item.age);
              }}
            >
              <Ionicons name="create" size={30} color="blue" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.addContainer}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.textinput}
            placeholder="name"
            value={name}
            onChangeText={(text) => {
              setName(text);
            }}
          />
          <TextInput
            inputMode="numeric"
            style={styles.textinput}
            placeholder="age"
            value={age}
            onChangeText={(text) => {
              setAge(text);
            }}
          />
        </View>

        <TouchableOpacity onPress={() => {}}>
          <Button
            title={editId === "" ? "ADD" : "SUBMIT"}
            onPress={() => {
              if (editId === "") {
                createData({ name: name, age: age, userId: userId });
              } else {
                updateData(editId, { name: name, age: age, userId: userId });
              }
              setAge("");
              setName("");
              setTime(Date.now().toString());
              //refresh
              setEditId("");
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatList:{
    width:"100%",
    maxWidth:500
  },
  part: {
    flex: 1,
  },
  textinput: {
    padding: 8,
    margin: 10,
    width: 100,
    borderRadius: 10,
    textAlign: "center",
    borderWidth: 2,
    borderColor: "lightblue",
  },
  addContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 50,
    elevation:5
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    margin: 10,
  },
  notes: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
