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
import { db } from "../firebase";

import { useLocalSearchParams } from "expo-router";

export default function home() {
  //expo install firebase @react-native-firebase/firestore
  const [text, setText] = useState("");
  const { id } = useLocalSearchParams();
  const [notes, setNotes] = useState([]);
  const [time, setTime] = useState("");
  const [editId, setEditId] = useState("");

  // alert(id)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const q = query(collection(db, "abouts"), where("projectId", "==", id));
        const querySnapshot = await getDocs(q);
        const notesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesList);
      } catch (error) {
        console.error("Error fetching notes: ", error);
      }
    };
    fetchNotes();
  }, [time]);

  const createData = async (data) => {
    try {
      await addDoc(collection(db, "abouts"), data);
      console.log("Data created successfully");
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const deleteData = async (id) => {
    try {
      const docRef = doc(db, "abouts", id);
      await deleteDoc(docRef);
      console.log("Data deleted successfully");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const updateData = async (id, newData) => {
    try {
      const docRef = doc(db, "abouts", id);
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
        data={notes}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.part}>{index + 1}</Text>
            <Text style={styles.part}>{item.text}</Text>

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
                setText(item.text);
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
            placeholder="text here"
            value={text}
            onChangeText={(text) => {
              setText(text);
            }}
          />
        </View>

        <TouchableOpacity onPress={() => {}}>
          <Button
            title={editId === "" ? "ADD" : "SUBMIT"}
            onPress={() => {
              if (editId === "") {
                createData({ text: text, projectId: id });
              } else {
                updateData(editId, { text: text, projectId: id });
              }
              setText("");
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
  flatList: {
    width: "100%",
    maxWidth: 500,
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
    elevation: 5,
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
